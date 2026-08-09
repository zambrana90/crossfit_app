'use client';

import { Heart } from 'lucide-react';
import { useFavoriteMutation } from '../api/favorite';
import { cn } from '@/shared/lib/format-date';
import type { TrainingListFilter } from '@/shared/api/training';

interface Props {
  userId: string;
  trainingId: string;
  isFavorite: boolean;
  filter: TrainingListFilter;
  className?: string;
}

export function FavButton({ userId, trainingId, isFavorite, filter, className }: Props) {
  const fav = useFavoriteMutation(userId, filter);

  return (
    <button
      type="button"
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
      aria-pressed={isFavorite}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        fav.mutate({ trainingId, current: isFavorite });
      }}
      className={cn(
        'flex size-10 items-center justify-center rounded-full border backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container',
        isFavorite
          ? 'border-white/10 bg-white/10 text-primary-container'
          : 'border-white/10 bg-white/10 text-white hover:bg-white/20',
        fav.isPending && 'opacity-60',
        className,
      )}
    >
      <Heart className={cn('size-4', isFavorite && 'fill-current')} />
    </button>
  );
}
