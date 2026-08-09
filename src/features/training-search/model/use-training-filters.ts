'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import type { TrainingClass, DoneFilter } from '@/shared/config/training-classes';
import type { TrainingListFilter } from '@/shared/api/training';

/**
 * Single source of truth for the trainings-list filter, mirrored in the URL
 * searchParams.
 */
export function useTrainingFilters() {
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const sp = useSearchParams();

  const search = sp?.get('q') ?? '';
  const cls = useMemo((): TrainingClass | undefined => {
    const value = sp?.get('class') as TrainingClass | null;
    if (value === 'WOD' || value === 'BOOTCAMP' || value === 'D45') return value;
    return undefined;
  }, [sp]);
  const done = useMemo((): DoneFilter | undefined => {
    const value = sp?.get('done') as DoneFilter | null;
    if (value === 'all' || value === 'done' || value === 'undone') return value;
    return undefined;
  }, [sp]);

  const filter: TrainingListFilter = useMemo(
    () => ({ class: cls, search: search || undefined, done }),
    [cls, search, done],
  );

  const update = useCallback(
    (params: Record<string, string | null>) => {
      const next = new URLSearchParams(sp?.toString() ?? '');
      for (const [k, v] of Object.entries(params)) {
        if (v === null || v === '') next.delete(k);
        else next.set(k, v);
      }
      router.replace(`${pathname}?${next.toString()}`);
    },
    [router, pathname, sp],
  );

  return {
    filter,
    search,
    cls,
    done: done ?? 'all',
    setClass: (c: TrainingClass | null) => update({ class: c }),
    setDone: (d: DoneFilter | null) => update({ done: d }),
    setSearch: (q: string) => update({ q: q || null }),
  };
}