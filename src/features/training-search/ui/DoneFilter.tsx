'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { useTrainingFilters } from '@/features/training-search/model/use-training-filters';
import { cn } from '@/shared/lib/format-date';
import { DONE_FILTERS, DONE_FILTER_LABEL } from '@/shared/config/training-classes';

/**
 * Segmented control (Todos / Hechos / Por hacer). The active option gets a
 * sliding pill that glides between segments instead of just swapping colors.
 */
export function DoneFilter({ className }: { className?: string }) {
  const { done, setDone } = useTrainingFilters();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const doneRef = useRef(done);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  const measure = () => {
    const container = containerRef.current;
    const btn = buttonRefs.current[doneRef.current];
    if (!container || !btn) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setPill({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    });
  };

  useLayoutEffect(() => {
    doneRef.current = done;
    measure();
  }, [done]);

  // Re-measure on resize so the pill stays glued to the active segment.
  useLayoutEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative grid w-full grid-cols-3 gap-1 rounded-full border border-white/5 bg-white/5 p-1 shadow-inner',
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-y-1 rounded-full bg-primary-container transition-[left,width] duration-300 ease-out"
        style={{ left: pill.left, width: pill.width }}
      />
      {DONE_FILTERS.map((d) => (
        <button
          key={d}
          ref={(el) => {
            buttonRefs.current[d] = el;
          }}
          type="button"
          onClick={() => setDone(done === d ? null : d)}
          aria-pressed={done === d}
          className={cn(
            'relative z-10 rounded-full px-3 py-2 font-brand-mono text-xs font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container',
            done === d ? 'text-black' : 'text-on-surface-variant hover:text-white',
          )}
        >
          {DONE_FILTER_LABEL[d]}
        </button>
      ))}
    </div>
  );
}
