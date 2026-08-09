'use client';

import { browserClient } from '@/shared/api/supabase';
import { TRAINING_CLASSES } from '@/shared/config/training-classes';
import type {
  GetTrainingsArgs,
  TrainingListItem,
  TrainingListResponse,
  TrainingRow,
  TrainingBlockRow,
} from './training';

export const TRAININGS_SELECT = `
  id,
  class,
  day,
  created_at,
  updated_at,
  created_by,
  training_blocks (
    id,
    training_id,
    position,
    title,
    description,
    rounds,
    rounds_meta,
    block_exercises (
      id,
      block_id,
      position,
      external_id,
      name,
      reps,
      weight,
      img
    )
  )
` as const;

/** Sort blocks + exercises by position client-side so order is deterministic. */
export function orderTraining(row: TrainingRow): TrainingRow {
  const blocks = [...row.training_blocks]
    .sort((a, b) => a.position - b.position)
    .map((b) => ({
      ...b,
      block_exercises: [...b.block_exercises].sort((a, c) => a.position - c.position),
    }));
  return { ...row, training_blocks: blocks };
}

/** Descending `(day desc, id desc)` — mirrors the SQL keyset ordering. */
function byDayDescIdDesc(a: TrainingRow, b: TrainingRow): number {
  if (a.day !== b.day) return a.day < b.day ? 1 : -1;
  return a.id < b.id ? 1 : -1;
}

/**
 * Fetch training IDs whose blocks contain an exercise whose name matches `%q%`.
 *
 * Uses a single inner join (`block_exercises!inner`) instead of a two-step
 * lookup. The old two-step built an `id=in.(…)` URL with one UUID per matching
 * block; a common term like "squat" matched 700+ blocks, pushing the URL past
 * the length limit and making PostgREST answer 400. The join keeps the request
 * tiny no matter how many exercises match.
 */
async function searchTrainingIds(
  supabase: ReturnType<typeof browserClient>,
  search: string,
): Promise<string[] | null> {
  if (!search.trim()) return null;
  const { data: blocks, error } = await supabase
    .from('training_blocks')
    .select('training_id, block_exercises!inner(block_id)')
    .ilike('block_exercises.name', `%${search.trim()}%`);
  if (error) throw error;
  if (!blocks || blocks.length === 0) return [];
  return [...new Set(blocks.map((b) => b.training_id))];
}

/** Fetch training IDs the current user has marked done. */
async function getUserCompletionIds(
  supabase: ReturnType<typeof browserClient>,
  userId: string,
): Promise<string[]> {
  const { data, error } = await supabase
    .from('training_completions')
    .select('training_id')
    .eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.training_id);
}

/**
 * Keyset-paginated training list. Cursor is composite `(day desc, id desc)` so
 * multiple trainings sharing the same `day` are disambiguated by `id`.
 *
 * Returns `nextCursor = null` on the last page.
 */
export async function getTrainings(args: GetTrainingsArgs): Promise<TrainingListResponse> {
  const { class: cls, search, done, userId, cursor, pageSize = 10 } = args;
  const supabase = browserClient();
  const limit = Math.max(1, Math.min(pageSize, 50));
  const limitPlus = limit + 1;

  let doneIds: string[] | null = null;
  if (done === 'done' || done === 'undone') {
    doneIds = await getUserCompletionIds(supabase, userId);
    if (done === 'done' && doneIds.length === 0) return { items: [], nextCursor: null };
  }

  const searchIds = await searchTrainingIds(supabase, search ?? '');
  if (searchIds && searchIds.length === 0) return { items: [], nextCursor: null };

  // URL-safe id batching: each UUID adds ~37 chars to the request URL, and a
  // single `id=in.(…)` with hundreds of ids blows the limit → PostgREST 400.
  // Chunk the search matches; the cursor/class/done filters stay identical per
  // batch, and merging by the same keyset order keeps pagination correct.
  const SEARCH_BATCH_SIZE = 100;
  const searchBatches: (string[] | null)[] =
    searchIds && searchIds.length > 0
      ? Array.from({ length: Math.ceil(searchIds.length / SEARCH_BATCH_SIZE) }, (_, i) =>
          searchIds.slice(i * SEARCH_BATCH_SIZE, (i + 1) * SEARCH_BATCH_SIZE),
        )
      : [null];

  const buildPageQuery = (searchBatch: string[] | null) => {
    let q = supabase.from('trainings').select(TRAININGS_SELECT);
    if (searchBatch) q = q.in('id', searchBatch);
    if (cls && TRAINING_CLASSES.includes(cls)) q = q.eq('class', cls);
    if (done === 'done' && doneIds && doneIds.length > 0) {
      q = q.in('id', doneIds);
    } else if (done === 'undone' && doneIds && doneIds.length > 0) {
      q = q.not('id', 'in', `(${doneIds.map((id) => `"${id}"`).join(',')})`);
    }
    if (cursor) {
      // NOTE: no manual encodeURIComponent here — postgrest-js `.or()` feeds the
      // string through URLSearchParams, which already percent-encodes the values.
      // Pre-encoding here double-encodes `:`/`+` to `%253A`/`%252B`, which
      // PostgREST rejects with 400 on every cursor page.
      q = q.or(`day.lt.${cursor.day},and(day.eq.${cursor.day},id.lt.${cursor.id})`);
    }
    // Truncating each batch to the top limit+1 is safe: the global top limit+1
    // of the merged set is always a subset of the per-batch top limit+1.
    return q
      .order('day', { ascending: false })
      .order('id', { ascending: false })
      .limit(limitPlus);
  };

  const responses = await Promise.all(searchBatches.map((batch) => buildPageQuery(batch)));
  const firstError = responses.map((r) => r.error).find((e) => e);
  if (firstError) throw firstError;

  const merged = responses
    .flatMap((r) => (r.data ?? []) as TrainingRow[])
    .sort(byDayDescIdDesc);

  const seen = new Set<string>();
  const rows = merged
    .filter((r) => {
      if (seen.has(r.id)) return false;
      seen.add(r.id);
      return true;
    })
    .map(orderTraining);
  const page = rows.slice(0, limit);
  const hasMore = rows.length > limit;

  const pageIds = page.map((r) => r.id);
  const [favResp, compResp] = await Promise.all([
    supabase.from('favorites').select('training_id').eq('user_id', userId).in('training_id', pageIds),
    supabase.from('training_completions').select('training_id').eq('user_id', userId).in('training_id', pageIds),
  ]);
  if (favResp.error) throw favResp.error;
  if (compResp.error) throw compResp.error;
  const favSet = new Set((favResp.data ?? []).map((r) => r.training_id));
  const doneSet = new Set((compResp.data ?? []).map((r) => r.training_id));

  const items: TrainingListItem[] = page.map((r) => ({
    id: r.id,
    class: r.class,
    day: r.day,
    created_at: r.created_at,
    updated_at: r.updated_at,
    created_by: r.created_by,
    isFavorite: favSet.has(r.id),
    isDone: doneSet.has(r.id),
    blocks: r.training_blocks as TrainingBlockRow[],
  }));

  const last = items[items.length - 1] ?? null;
  return {
    items,
    nextCursor: hasMore && last ? { day: last.day, id: last.id } : null,
  };
}