import { cn } from '@/shared/lib/format-date';
import { Loader2 } from 'lucide-react';
import type { HTMLAttributes } from 'react';

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-2xl bg-muted', className)} {...props} />;
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border p-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-4 w-20 rounded" />
      </div>
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-1/3 rounded" />
        <Skeleton className="h-3 w-full rounded" />
        <Skeleton className="h-3 w-2/3 rounded" />
        <div className="flex flex-wrap gap-2 pt-2">
          <Skeleton className="h-10 w-16 rounded-lg" />
          <Skeleton className="h-10 w-16 rounded-lg" />
          <Skeleton className="h-10 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn('size-4 animate-spin', className)} />;
}