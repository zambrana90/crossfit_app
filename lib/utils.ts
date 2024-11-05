import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import qs from 'query-string';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOrdinalSuffix(day: number) {
  if (day % 10 === 1 && day !== 11) {
    return 'ST';
  } else if (day % 10 === 2 && day !== 12) {
    return 'ND';
  } else if (day % 10 === 3 && day !== 13) {
    return 'RD';
  } else {
    return 'TH';
  }
}

export function formatTimestampToDate(timestamp: number) {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const dateString = date.toLocaleDateString('en-US', options).toUpperCase();

  const [month, day, year] = dateString.split(' ');
  const dayWithSuffix = `${parseInt(day)}${getOrdinalSuffix(parseInt(day))}`;

  return `${month} ${dayWithSuffix} ${year}`;
}

interface UrlQueryParams {
  params: string;
  key: string;
  value: string | null;
}

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
};
