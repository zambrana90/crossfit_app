'use client';

import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { browserClient } from '@/shared/api/supabase';
import { TRAINING_QUERIES, type TrainingListFilter, type TrainingListResponse } from '@/shared/api/training';
import { toast } from 'sonner';

async function addFavorite(userId: string, trainingId: string) {
  const { error } = await browserClient()
    .from('favorites')
    .insert({ user_id: userId, training_id: trainingId });
  if (error) throw error;
}

async function removeFavorite(userId: string, trainingId: string) {
  const { error } = await browserClient()
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('training_id', trainingId);
  if (error) throw error;
}

/**
 * Mutation that optimistically flips `isFavorite` for a single training across
 * the infinite training list caches. Invalidates the training list on settle.
 */
export function useFavoriteMutation(userId: string, filter: TrainingListFilter) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ trainingId, current }: { trainingId: string; current: boolean }) =>
      current ? removeFavorite(userId, trainingId) : addFavorite(userId, trainingId),

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
            items: p.items.map((t) => (t.id === trainingId ? { ...t, isFavorite: !current } : t)),
          })),
        };
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      const key = TRAINING_QUERIES.infinite(filter, userId).queryKey;
      if (ctx?.prev) qc.setQueryData<InfiniteData<TrainingListResponse>>(key, ctx.prev);
      toast.error('No se pudo actualizar el favorito.');
    },

    onSettled: () => qc.invalidateQueries({ queryKey: TRAINING_QUERIES.all() }),
  });
}
