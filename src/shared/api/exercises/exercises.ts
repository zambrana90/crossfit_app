/** Row shape of the `exercises` library table — id, name, image only. */
export interface ExerciseRow {
  id: string;
  name: string;
  img: string | null;
  created_at: string;
  updated_at: string;
}

export interface GetExercisesArgs {
  /** Case-insensitive name filter (ilike %q%). */
  search?: string;
  pageSize?: number;
}
