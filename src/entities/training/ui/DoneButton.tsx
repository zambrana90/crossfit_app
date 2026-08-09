'use client';

import { Check, CheckCheck } from 'lucide-react';
import { useCompletionMutation } from '../api/completion';
import { cn } from '@/shared/lib/format-date';
import type { TrainingListFilter } from '@/shared/api/training';

interface Props {
  userId: string;
  trainingId: string;
  isDone: boolean;
  filter: TrainingListFilter;
  className?: string;
}

export function DoneButton({ userId, trainingId, isDone, filter, className }: Props) {
  const done = useCompletionMutation(userId, filter);

  return (
    <button
      type="button"
      aria-label={isDone ? 'Marcar como no hecho' : 'Marcar como hecho'}
      aria-pressed={isDone}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        done.mutate({ trainingId, current: isDone });
      }}
      className={cn(
        'flex size-10 items-center justify-center rounded-full border backdrop-blur-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container',
        isDone
          ? 'border-transparent bg-primary-container text-black'
          : 'border-white/10 bg-white/10 text-white hover:bg-white/20',
        done.isPending && 'opacity-60',
        className,
      )}
    >
      {isDone ? <CheckCheck className="size-4" /> : <Check className="size-4" />}
    </button>
  );
}
