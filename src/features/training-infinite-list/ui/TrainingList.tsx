'use client';

import { useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { TRAINING_QUERIES, type TrainingListFilter } from '@/shared/api/training';
import { useAuth } from '@/features/auth';
import { WorkoutCard } from '@/entities/training';
import { CardSkeleton } from '@/shared/ui/skeleton';

interface TrainingListProps {
  filter: TrainingListFilter;
  pageSize?: number;
}

export function TrainingList({ filter, pageSize = 10 }: TrainingListProps) {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id ?? '';
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const query = useInfiniteQuery({
    ...TRAINING_QUERIES.infinite(filter, userId, pageSize),
    enabled: Boolean(userId),
  });

  useEffect(() => {
    if (!sentinelRef.current) return;
    const node = sentinelRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && query.hasNextPage && !query.isFetchingNextPage) {
          query.fetchNextPage();
        }
      },
      { rootMargin: '320px 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [query]);

  if (authLoading || query.isLoading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!userId) {
    return (
      <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Inicia sesión para ver entrenamientos.
      </p>
    );
  }

  if (query.isError) {
    return (
      <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        No se pudieron cargar los entrenamientos.
      </p>
    );
  }

  const items = query.data?.pages.flatMap((p) => p.items) ?? [];

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        No hay entrenamientos con estos filtros.
      </p>
    );
  }

  return (
    <div>
      {items.map((t) => (
        <WorkoutCard
          key={t.id}
          trainingId={t.id}
          class={t.class}
          day={t.day}
          blocks={t.blocks.map((b) => ({
            id: b.id,
            title: b.title,
            description: b.description,
            rounds_meta: b.rounds_meta,
            exercises: b.block_exercises.map((e) => ({
              id: e.id,
              name: e.name,
              reps: e.reps,
              weight: e.weight,
              img: e.img,
            })),
          }))}
          isFavorite={t.isFavorite}
          isDone={t.isDone}
          userId={userId}
          filter={filter}
        />
      ))}

      {query.isFetchingNextPage ? (
        <div className="mt-5 space-y-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <CardSkeleton key={`next-${i}`} />
          ))}
        </div>
      ) : null}

      <div ref={sentinelRef} className="h-1 w-full" aria-hidden="true" />
    </div>
  );
}