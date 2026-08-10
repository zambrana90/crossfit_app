import type { Metadata } from 'next';
import { ExerciseLibraryView } from '@/features/exercise-library';

export const metadata: Metadata = {
  title: 'CrossFit WOD — Ejercicios',
};

export default function LibraryPage() {
  return (
    <section className="py-6">
      <h1 className="sr-only">Biblioteca de ejercicios</h1>
      <ExerciseLibraryView />
    </section>
  );
}
