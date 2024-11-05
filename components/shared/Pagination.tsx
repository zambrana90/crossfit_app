'use client';

import { formUrlQuery } from '@/lib/utils';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  pageNumber: number;
  isNext: boolean;
}

const Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === 'prev' ? pageNumber - 1 : pageNumber + 1;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString(),
    });

    router.push(newUrl);
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className='flex w-full items-center justify-center gap-2'>
      <Button
        variant='outline'
        size='icon'
        onClick={() => handleNavigation('prev')}
        disabled={pageNumber === 1}
        aria-label='Previous page'
      >
        <ChevronLeft className='h-4 w-4' />
      </Button>
      <div className='flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2'>
        <p className='body-semibold'>{pageNumber}</p>
      </div>
      <Button
        variant='outline'
        size='icon'
        onClick={() => handleNavigation('next')}
        disabled={!isNext}
        aria-label='Next page'
      >
        <ChevronRight className='h-4 w-4' />
      </Button>
    </div>
  );
};

export default Pagination;
