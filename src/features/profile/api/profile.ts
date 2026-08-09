'use client';

import { browserClient } from '@/shared/api/supabase';
import { TRAININGS_SELECT, orderTraining } from '@/shared/api/training';
import type { TrainingListItem, TrainingRow } from '@/shared/api/training';

export interface ProfileStats {
  /** ENTRENOS — number of completed trainings. */
  workouts: number;
  /** FAVORITOS — number of favorited trainings. */
  favorites: number;
}

export interface ProfileData {
  favorites: TrainingListItem[];
  history: TrainingListItem[];
  stats: ProfileStats;
}

interface FavoriteRow {
  training_id: string;
  created_at: string;
  trainings: TrainingRow;
}

interface CompletionRow {
  training_id: string;
  completed_at: string;
  trainings: TrainingRow;
}

function toListItem(row: TrainingRow, isFavorite: boolean, isDone: boolean): TrainingListItem {
  return {
    id: row.id,
    class: row.class,
    day: row.day,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by: row.created_by,
    isFavorite,
    isDone,
    blocks: orderTraining(row).training_blocks,
  };
}

/**
 * Profile data: favorited trainings + completion history (both newest first),
 * plus aggregate stats. The embedded `trainings(...TRAININGS_SELECT)` reuses
 * the exact shape the training list queries produce, so WorkoutCard renders
 * without conversion.
 */
export async function getProfileData(userId: string): Promise<ProfileData> {
  const supabase = browserClient();

  const [favResp, compResp] = await Promise.all([
    supabase
      .from('favorites')
      .select(`training_id, created_at, trainings(${TRAININGS_SELECT})`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('training_completions')
      .select(`training_id, completed_at, trainings(${TRAININGS_SELECT})`)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false }),
  ]);
  if (favResp.error) throw favResp.error;
  if (compResp.error) throw compResp.error;

  const favRows = (favResp.data ?? []).map((r) => ({
    training_id: r.training_id as string,
    created_at: r.created_at as string,
    trainings: Array.isArray(r.trainings) ? r.trainings[0] : r.trainings,
  })) as FavoriteRow[];
  const compRows = (compResp.data ?? []).map((r) => ({
    training_id: r.training_id as string,
    completed_at: r.completed_at as string,
    trainings: Array.isArray(r.trainings) ? r.trainings[0] : r.trainings,
  })) as CompletionRow[];

  const doneIds = new Set(compRows.map((r) => r.training_id));
  const favIds = new Set(favRows.map((r) => r.training_id));

  const favorites: TrainingListItem[] = favRows.map((r) =>
    toListItem(r.trainings, true, doneIds.has(r.trainings.id)),
  );
  const history: TrainingListItem[] = compRows.map((r) =>
    toListItem(r.trainings, favIds.has(r.trainings.id), true),
  );

  return {
    favorites,
    history,
    stats: {
      workouts: compRows.length,
      favorites: favRows.length,
    },
  };
}
