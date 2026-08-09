import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const WEEKDAYS_ES = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const MONTHS_ES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
];

/** Day number (epoch ms) or ISO date → "lun 7 oct" */
export function formatTrainDay(value: number | string | Date): string {
  const date = typeof value === 'number' ? new Date(value) : new Date(value);
  const wd = WEEKDAYS_ES[date.getDay() ?? 0];
  const day = date.getUTCDate();
  const mo = MONTHS_ES[date.getUTCMonth()];
  return `${wd} ${day} ${mo}`;
}

/** Decode `<br />`, `&quot;`, `&amp;` and split into non-trivial lines. */
export function decodeDescription(raw: string): string[] {
  if (!raw) return [];
  const lines = raw.split('<br />\n');
  const decoded = lines.map((l) =>
    l
      .replaceAll('<br />', '')
      .replaceAll('&quot;', '"')
      .replaceAll('&amp;', '&')
      .trim()
  );
  return decoded.filter((l) => l.length > 0);
}