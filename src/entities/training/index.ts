// entities/training — public API of the training domain.
// The workout card and its favorite/done interactions live together here
// because they change together and are consumed by multiple features
// (training-infinite-list, profile) — FSD: domain card used in 2+ places.
export { WorkoutCard, type WorkoutCardProps } from './ui/WorkoutCard';
