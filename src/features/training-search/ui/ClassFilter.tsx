'use client';

import { useTrainingFilters } from '@/features/training-search/model/use-training-filters';
import { cn } from '@/shared/lib/format-date';
import { TRAINING_CLASSES, TRAINING_CLASS_LABEL } from '@/shared/config/training-classes';

const PILL_BASE =
  'shrink-0 rounded-full border px-4 py-2 font-brand-mono text-xs font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container';
const PILL_ACTIVE = 'border-transparent bg-primary-container text-black';
const PILL_IDLE = 'border-white/10 bg-white/5 text-on-surface-variant hover:border-white/20 hover:text-white';

/** Horizontally scrollable glass pill row selecting `?class=`. No selection = all classes. */
export function ClassFilter({ className }: { className?: string }) {
  const { cls, setClass } = useTrainingFilters();

  return (
    <div className={cn('-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar', className)}>
      <button
        type="button"
        onClick={() => setClass(null)}
        aria-pressed={cls === undefined}
        className={cn(PILL_BASE, cls === undefined ? PILL_ACTIVE : PILL_IDLE)}
      >
        Todos
      </button>
      {TRAINING_CLASSES.map((c) => (
        <FilterChip
          key={c}
          label={TRAINING_CLASS_LABEL[c]}
          active={cls === c}
          onClick={() => setClass(cls === c ? null : c)}
        />
      ))}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(PILL_BASE, active ? PILL_ACTIVE : PILL_IDLE)}
    >
      {label}
    </button>
  );
}
