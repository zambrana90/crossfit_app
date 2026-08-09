export type TrainingClass = 'WOD' | 'BOOTCAMP' | 'D45';

export const TRAINING_CLASSES: TrainingClass[] = ['WOD', 'BOOTCAMP', 'D45'];

export const TRAINING_CLASS_LABEL: Record<TrainingClass, string> = {
  WOD: 'WOD',
  BOOTCAMP: 'Bootcamp',
  D45: 'D45',
};

export type DoneFilter = 'all' | 'done' | 'undone';

export const DONE_FILTERS: DoneFilter[] = ['all', 'done', 'undone'];

export const DONE_FILTER_LABEL: Record<DoneFilter, string> = {
  all: 'Todos',
  done: 'Hechos',
  undone: 'Por hacer',
};