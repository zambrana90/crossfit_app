import { infiniteQueryOptions } from '@tanstack/react-query';
import { getTrainings } from './get-trainings';
import { getTrainingById } from './get-training-by-id';
import type { GetTrainingsArgs, TrainingListResponse, TrainingDetail } from './training';
import type { TrainingClass, DoneFilter } from '@/shared/config/training-classes';

export interface TrainingListFilter {
  class?: TrainingClass;
  search?: string;
  done?: DoneFilter;
}

export type Cursor = { day: string; id: string } | null;

/**
 * Query factory for training lists + details. The infinite variant uses the
 * composite keyset cursor (see get-trainings.ts).
 */
export const TRAINING_QUERIES = {
  all: () => ['trainings'] as const,
  lists: () => [...TRAINING_QUERIES.all(), 'list'] as const,
  list: (filter: TrainingListFilter) => [...TRAINING_QUERIES.lists(), filter] as const,
  infinite: (filter: TrainingListFilter, userId: string, pageSize = 10) =>
    infiniteQueryOptions({
      queryKey: [...TRAINING_QUERIES.lists(), 'infinite', pageSize, filter, userId],
      queryFn: ({ pageParam }: { pageParam: Cursor }) =>
        getTrainings({ ...filter, cursor: pageParam, pageSize, userId }),
      initialPageParam: null as Cursor,
      getNextPageParam: (last: TrainingListResponse) => last.nextCursor,
    }),
  detail: (id: string, userId: string) =>
    ({
      queryKey: [...TRAINING_QUERIES.all(), 'detail', id],
      queryFn: () => getTrainingById(id, userId),
    }) as const,
};

export type TrainingListPromise = Promise<TrainingListResponse>;
export type TrainingDetailPromise = Promise<TrainingDetail | null>;
export type { GetTrainingsArgs };