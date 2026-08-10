'use client';

import { useState } from 'react';
import { formatTrainDay, decodeDescription, cn } from '@/shared/lib/format-date';
import { TRAINING_CLASS_LABEL, type TrainingClass } from '@/shared/config/training-classes';
import { FavButton } from './FavButton';
import { DoneButton } from './DoneButton';
import { ExerciseImageModal } from './ExerciseImageModal';
import type { TrainingListFilter } from '@/shared/api/training';

interface WorkoutCardExercise {
  id: string;
  name: string;
  reps: string | null;
  weight: string | null;
  img: string | null;
}

interface WorkoutCardBlock {
  id: string;
  title: string | null;
  description: string | null;
  rounds_meta?: string | null;
  exercises: WorkoutCardExercise[];
}

export interface WorkoutCardProps {
  trainingId: string;
  class: TrainingClass;
  day: string;
  blocks: WorkoutCardBlock[];
  isFavorite: boolean;
  isDone: boolean;
  userId: string;
  filter: TrainingListFilter;
}

const GLASS_BADGE =
  'rounded-full border border-white/20 bg-white/10 px-3 py-1 font-brand-mono text-[10px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm';

export function WorkoutCard(props: WorkoutCardProps) {
  const { trainingId, class: cls, day, blocks, isFavorite, isDone, userId, filter } = props;

  const [firstBlock, ...restBlocks] = blocks;

  return (
    <article className="group relative mb-5 overflow-hidden rounded-2xl border border-primary-container/20 bg-surface-container shadow-lg">
      {/* Background: plain subtle gradient */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-surface-container via-[#161818] to-[#121212]"
      />

      {/* Top row: class + rounds badges, day, then fav/done actions */}
      <div className="relative z-10 flex items-start justify-between gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              GLASS_BADGE,
              'border-primary-container/40 bg-primary-container/10 text-primary-container',
            )}
          >
            {TRAINING_CLASS_LABEL[cls]}
          </span>
          {firstBlock?.rounds_meta ? (
            <span className={cn(GLASS_BADGE, 'text-primary-container')}>
              {firstBlock.rounds_meta}
            </span>
          ) : null}
          <span className="font-brand-mono text-[10px] uppercase tracking-[0.12em] text-primary-container/70">
            {formatTrainDay(day)}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <DoneButton trainingId={trainingId} isDone={isDone} userId={userId} filter={filter} />
          <FavButton trainingId={trainingId} isFavorite={isFavorite} userId={userId} filter={filter} />
        </div>
      </div>

      {/* Content: hero summary of the first block, compact rows for the rest */}
      <div className="relative z-10 p-4">
        {blocks.length === 0 ? <p className="text-sm text-on-surface-variant">Sin bloques.</p> : null}
        {firstBlock ? (
          <BlockSummary block={firstBlock} hero fallbackTitle={TRAINING_CLASS_LABEL[cls]} />
        ) : null}
        {restBlocks.map((block) => (
          <BlockSummary key={block.id} block={block} />
        ))}
      </div>
    </article>
  );
}

/**
 * Compact per-block summary: title, optional description lines, then every
 * exercise row (reps, name, weight). Exercises with an image render the name
 * as a button that opens the image lightbox. Visual grammar comes from the
 * TITAN CORE card; extra blocks reuse it so no training data is hidden.
 */
function BlockSummary({
  block,
  hero = false,
  fallbackTitle = null,
}: {
  block: WorkoutCardBlock;
  hero?: boolean;
  fallbackTitle?: string | null;
}) {
  const [selected, setSelected] = useState<WorkoutCardExercise | null>(null);

  const description = decodeDescription(block.description ?? '');
  const title = block.title ?? (description.length > 0 ? description[0] : null) ?? fallbackTitle;
  const bodyLines =
    block.title && description.length > 0
      ? description
      : description.length > 1
        ? description.slice(1)
        : [];

  const exercises = (block.exercises ?? []).filter((e) => e.name);

  return (
    <div className={hero ? undefined : 'mt-4 border-t border-primary-container/20 pt-4'}>
      {title ? (
        <h4
          className={cn(
            'font-display uppercase tracking-tight text-primary-container',
            hero ? 'text-2xl' : 'text-lg',
          )}
        >
          {title}
        </h4>
      ) : null}

      {bodyLines.map((line, i) => (
        <p key={`${block.id}-line-${i}`} className="mt-1 text-xs text-on-surface-variant/80">
          {line}
        </p>
      ))}

      {exercises.length > 0 ? (
        <div className="mt-2 space-y-1">
          {exercises.map((ex) => (
            <div key={ex.id} className="flex items-baseline gap-3">
              {ex.reps ? (
                <span className="shrink-0 font-brand-mono text-base text-white">{ex.reps}</span>
              ) : null}
              {ex.img ? (
                <button
                  type="button"
                  onClick={() => setSelected(ex)}
                  className="rounded-sm text-left text-sm font-medium uppercase tracking-wide text-on-surface-variant underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
                >
                  {ex.name}
                  {ex.weight ? <span className="text-white/40"> · {ex.weight}</span> : null}
                </button>
              ) : (
                <span className="text-sm font-medium uppercase tracking-wide text-on-surface-variant">
                  {ex.name}
                  {ex.weight ? <span className="text-white/40"> · {ex.weight}</span> : null}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : null}

      {selected ? (
        <ExerciseImageModal exercise={selected} onClose={() => setSelected(null)} />
      ) : null}
    </div>
  );
}
