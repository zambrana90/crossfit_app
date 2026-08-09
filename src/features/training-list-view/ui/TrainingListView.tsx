'use client';

import { Suspense, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import {
  SearchBar,
  DoneFilter,
  useTrainingFilters,
} from '@/features/training-search';
import { TrainingList } from '@/features/training-infinite-list';
import type { TrainingClass } from '@/shared/config/training-classes';
import { cn } from '@/shared/lib/format-date';

interface TrainingListViewProps {
  /** Pin the list to a single class. Hides the class filter. */
  classOverride?: TrainingClass | null;
}

function TrainingListViewImpl({ classOverride }: TrainingListViewProps) {
  const { cls, done, search } = useTrainingFilters();
  const [showDoneFilter, setShowDoneFilter] = useState(false);

  const filterClass: TrainingClass | undefined = classOverride ?? cls;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-pressed={showDoneFilter}
            aria-label="Filtros"
            onClick={() => setShowDoneFilter((prev) => !prev)}
            className={cn(
              'flex size-12 shrink-0 items-center justify-center rounded-full border backdrop-blur-md transition-colors',
              showDoneFilter
                ? 'border-primary-container/40 bg-primary-container/10 text-primary-container'
                : 'border-white/10 bg-white/5 text-white hover:bg-white/10',
            )}
          >
            <SlidersHorizontal aria-hidden="true" className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <SearchBar
              placeholder={
                classOverride ? `Buscar en ${classOverride}…` : 'Buscar entrenamientos…'
              }
            />
          </div>
        </div>
        {showDoneFilter ? <DoneFilter /> : null}
      </div>

      <TrainingList
        filter={{
          class: filterClass,
          search: search || undefined,
          done: done === 'all' ? undefined : done,
        }}
      />
    </div>
  );
}

export function TrainingListView(props: TrainingListViewProps) {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Cargando…</div>}>
      <TrainingListViewImpl {...props} />
    </Suspense>
  );
}
