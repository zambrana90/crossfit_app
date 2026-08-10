import { queryOptions } from '@tanstack/react-query';
import { getExercises } from './get-exercises';
import type { GetExercisesArgs } from './exercises';

export const EXERCISE_QUERIES = {
  all: () => ['exercises'] as const,
  list: (args: GetExercisesArgs = {}) =>
    queryOptions({
      queryKey: [...EXERCISE_QUERIES.all(), 'list', args],
      queryFn: () => getExercises(args),
      staleTime: 5 * 60 * 1000, // the library is curated; 5 min is plenty fresh
    }),
};

export type { GetExercisesArgs };
