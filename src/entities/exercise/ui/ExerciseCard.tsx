import Image from 'next/image';

interface ExerciseCardExercise {
  id: string;
  name: string;
  img: string | null;
}

interface ExerciseCardProps {
  exercise: ExerciseCardExercise;
}

/**
 * Catalog card for the exercises library: name on top, thumbnail below.
 * Shell mirrors WorkoutCard — dark glass gradient, primary-container accent.
 */
export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-primary-container/20 bg-surface-container shadow-lg">
      {/* Background: plain subtle gradient */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-surface-container via-[#161818] to-[#121212]"
      />

      <div className="relative z-10 p-3">
        <h3 className="font-brand-mono text-xs font-semibold uppercase tracking-wide text-primary-container">
          {exercise.name}
        </h3>

        <div className="mt-3 overflow-hidden rounded-lg">
          {exercise.img ? (
            <Image
              src={exercise.img}
              alt=""
              width={314}
              height={131}
              className="h-auto w-full object-cover"
            />
          ) : (
            <div className="flex aspect-[314/131] items-center justify-center bg-white/5 font-brand-mono text-[10px] uppercase tracking-[0.12em] text-on-surface-variant/60">
              Sin imagen
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
