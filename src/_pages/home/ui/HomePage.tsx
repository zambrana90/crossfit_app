import type { Metadata } from 'next';
import { TrainingListView } from '@/features/training-list-view';

export const metadata: Metadata = {
  title: 'CrossFit WOD',
};

export default function HomePage() {
  return (
    <section className="py-6">
      <h1 className="sr-only">Entrenamientos WOD</h1>
      <TrainingListView classOverride="WOD" />
    </section>
  );
}
