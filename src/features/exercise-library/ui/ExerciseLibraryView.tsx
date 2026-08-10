'use client';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SearchBar, useTrainingFilters } from '@/features/training-search';
import { useAuth } from '@/features/auth';
import { EXERCISE_QUERIES } from '@/shared/api/exercises';
import { ExerciseCard } from '@/entities/exercise';
import { CardSkeleton } from '@/shared/ui/skeleton';

function ExerciseLibraryViewImpl() {
  const { search } = useTrainingFilters();
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? '';

  // Fetch the whole catalog once (729 rows; the API caps pageSize at 1000)
  // and filter client-side so search is instant.
  const query = useQuery({
    ...EXERCISE_QUERIES.list({ pageSize: 1000 }),
    enabled: Boolean(userId),
  });

  const exercises = query.data ?? [];
  const q = search.trim().toLowerCase();
  const items = q
    ? exercises.filter((e) => e.name.toLowerCase().includes(q))
    : exercises;

  return (
    <div className="space-y-6">
      <SearchBar placeholder="Buscar ejercicios…" ariaLabel="Buscar ejercicios por nombre" />

      {authLoading || query.isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : !userId ? (
        <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Inicia sesión para ver los ejercicios.
        </p>
      ) : query.isError ? (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          No se pudieron cargar los ejercicios.
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          No hay ejercicios que coincidan con la búsqueda.
        </p>
      ) : (
        <>
          <p className="font-brand-mono text-[10px] uppercase tracking-[0.12em] text-primary-container/70">
            {q ? `${items.length} resultados` : `${items.length} ejercicios`}
          </p>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {items.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ExerciseLibraryView() {
  return (
    <Suspense fallback={<div className="text-sm text-muted-foreground">Cargando…</div>}>
      <ExerciseLibraryViewImpl />
    </Suspense>
  );
}
