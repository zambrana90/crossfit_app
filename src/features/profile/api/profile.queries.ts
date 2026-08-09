'use client';

import { getProfileData } from './profile';

/**
 * Profile query factory. Keys are prefixed `['trainings','profile',…]` so the
 * existing favorite/completion mutations' `invalidateQueries(['trainings'])`
 * prefix-match and refetch profile data after any toggle.
 */
export const PROFILE_QUERIES = {
  all: () => ['trainings', 'profile'] as const,
  detail: (userId: string) =>
    ({
      queryKey: [...PROFILE_QUERIES.all(), userId],
      queryFn: () => getProfileData(userId),
    }) as const,
};
