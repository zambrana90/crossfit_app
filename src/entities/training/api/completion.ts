'use client';

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { browserClient } from '@/shared/api/supabase';
import { TRAINING_QUERIES, type TrainingListFilter, type TrainingListResponse } from '@/shared/api/training';
import { toast } from 'sonner';

async function markDone(userId: string, trainingId: string) {
  const { error } = await browserClient()
    .from('training_completions')
    .insert({ user_id: userId, training_id: trainingId });
  if (error) throw error;
}

async function unmarkDone(userId: string, trainingId: string) {
  const { error } = await browserClient()
    .from('training_completions')
    .delete()
    .eq('user_id', userId)
    .eq('training_id', trainingId);
  if (error) throw error;
}

/** Optimistic done-mark mutation; mirrors favorites. */
export function useCompletionMutation(userId: string, filter: TrainingListFilter) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ trainingId, current }: { trainingId: string; current: boolean }) =>
      current ? unmarkDone(userId, trainingId) : markDone(userId, trainingId),

    onMutate: async ({ trainingId, current }) => {
      const key = TRAINING_QUERIES.infinite(filter, userId).queryKey;
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<InfiniteData<TrainingListResponse>>(key);

      qc.setQueryData<InfiniteData<TrainingListResponse>>(key, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((p) => ({
            ...p,
            items: p.items.map((t) => (t.id === trainingId ? { ...t, isDone: !current } : t)),
          })),
        };
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      const key = TRAINING_QUERIES.infinite(filter, userId).queryKey;
      if (ctx?.prev) qc.setQueryData<InfiniteData<TrainingListResponse>>(key, ctx.prev);
      toast.error('No se pudo actualizar el estado.');
    },

    onSettled: () => qc.invalidateQueries({ queryKey: TRAINING_QUERIES.all() }),
  });
}
