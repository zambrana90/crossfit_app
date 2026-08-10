'use client';

import { browserClient } from '@/shared/api/supabase';
import type { TrainingBlockRow, TrainingDetail, TrainingRow } from './training';

/** Resolve a single training with per-user fav/done flags. */
export async function getTrainingById(id: string, userId: string): Promise<TrainingDetail | null> {
  const supabase = browserClient();
  const { data, error } = (await supabase
    .from('trainings')
    .select(
      `id, class, day, created_at, updated_at, created_by,
       training_blocks (
         id, training_id, position, title, description, rounds, rounds_meta,
         block_exercises (id, block_id, position, external_id, exercise_id, name, reps, weight, img)
       )`,
    )
    .eq('id', id)
    .single()) as { data: TrainingRow | null; error: unknown };

  if (error || !data) return null;

  const blocks: TrainingBlockRow[] = [...data.training_blocks]
    .sort((a, b) => a.position - b.position)
    .map((b) => ({ ...b, block_exercises: [...b.block_exercises].sort((a, c) => a.position - c.position) }));

  const [favResp, doneResp] = await Promise.all([
    supabase
      .from('favorites')
      .select('training_id')
      .eq('user_id', userId)
      .eq('training_id', id)
      .maybeSingle(),
    supabase
      .from('training_completions')
      .select('training_id')
      .eq('user_id', userId)
      .eq('training_id', id)
      .maybeSingle(),
  ]);

  return {
    id: data.id,
    class: data.class,
    day: data.day,
    created_at: data.created_at,
    updated_at: data.updated_at,
    created_by: data.created_by,
    isFavorite: Boolean(favResp.data),
    isDone: Boolean(doneResp.data),
    blocks,
  };
}