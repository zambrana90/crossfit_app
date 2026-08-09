import type { TrainingClass, DoneFilter } from '@/shared/config/training-classes';

export interface BlockExerciseRow {
  id: string;
  block_id: string;
  position: number;
  external_id: string | null;
  name: string;
  reps: string | null;
  weight: string | null;
  img: string | null;
}

export interface TrainingBlockRow {
  id: string;
  training_id: string;
  position: number;
  title: string | null;
  description: string | null;
  rounds: string | null;
  rounds_meta: string | null;
  block_exercises: BlockExerciseRow[];
}

export interface TrainingRow {
  id: string;
  class: TrainingClass;
  day: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  training_blocks: TrainingBlockRow[];
}

export interface TrainingListItem {
  id: string;
  class: TrainingClass;
  day: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  isFavorite: boolean;
  isDone: boolean;
  blocks: TrainingBlockRow[];
}

export type TrainingDetail = TrainingListItem;

export interface TrainingListResponse {
  items: TrainingListItem[];
  nextCursor: { day: string; id: string } | null;
}

export interface GetTrainingsArgs {
  class?: TrainingClass;
  search?: string;
  done?: DoneFilter;
  userId: string;
  cursor?: { day: string; id: string } | null;
  pageSize?: number;
}