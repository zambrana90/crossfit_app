'use client';

import { browserClient } from '@/shared/api/supabase';
import type { ExerciseRow, GetExercisesArgs } from './exercises';

/**
 * List the exercises library (name + image) — the catalog a WOD builder picks
 * from. Order is alphabetical so the picker can render a flat scrollable list;
 * pass `search` to narrow it to a prefix/substring.
 */
export async function getExercises(args: GetExercisesArgs = {}): Promise<ExerciseRow[]> {
  const { search, pageSize = 500 } = args;
  const supabase = browserClient();
  const limit = Math.max(1, Math.min(pageSize, 1000));

  let q = supabase.from('exercises').select('id, name, img, created_at, updated_at');
  if (search && search.trim()) {
    q = q.ilike('name', `%${search.trim()}%`);
  }
  const { data, error } = await q.order('name').limit(limit);
  if (error) throw error;
  return (data ?? []) as ExerciseRow[];
}
