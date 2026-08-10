'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X } from 'lucide-react';

interface ExerciseImageModalProps {
  exercise: {
    id: string;
    name: string;
    img: string | null;
  };
  onClose: () => void;
}

/**
 * Centered lightbox for a single exercise image, opened from a WorkoutCard
 * exercise row. Mirrors the library card grammar: name on top, image below.
 * Portaled to <body> so it stacks above the fixed topbar.
 */
export function ExerciseImageModal({ exercise, onClose }: ExerciseImageModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={exercise.name}
        className="relative w-full max-w-lg rounded-2xl border border-primary-container/20 bg-gradient-to-br from-surface-container via-[#161818] to-[#121212] p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
        >
          <X className="size-4" aria-hidden />
        </button>

        <h3 className="pr-10 font-brand-mono text-sm font-semibold uppercase tracking-wide text-primary-container">
          {exercise.name}
        </h3>

        <div className="mt-3 overflow-hidden rounded-lg">
          {exercise.img ? (
            <Image
              src={exercise.img}
              alt=""
              width={640}
              height={267}
              className="h-auto max-h-[70vh] w-full object-contain"
            />
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  );
}
