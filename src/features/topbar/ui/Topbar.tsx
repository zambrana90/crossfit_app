'use client';

import Link from 'next/link';
import { Dumbbell, User } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { ROUTES } from '@/shared/config/routes';
import { cn } from '@/shared/lib/format-date';
import { Brand } from '@/shared/ui/brand';

export function Topbar() {
  const { user } = useAuth();

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 h-16 border-b border-white/5 bg-surface/80 backdrop-blur-md',
        'mx-auto w-full max-w-[1024px]',
      )}
    >
      <div className="relative flex h-16 items-center justify-between px-4">
        <Link
          href={ROUTES.home}
          aria-label="CrossFit WOD — inicio"
          className="flex items-center"
        >
          <Brand iconClassName="h-7 w-7" wordmarkClassName="text-[28px] leading-none" />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.library}
            aria-label="Biblioteca de ejercicios"
            className="flex size-8 items-center justify-center rounded-full text-primary-container transition-colors hover:bg-primary-container/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            <Dumbbell className="size-4" />
          </Link>
          <Link
            href={ROUTES.profile}
            aria-label="Tu perfil"
            className="flex size-8 items-center justify-center rounded-full border-2 border-primary-container bg-surface-container font-brand-mono text-xs font-bold uppercase text-primary-container transition-colors hover:bg-primary-container/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
          >
            {user?.email ? user.email.charAt(0).toUpperCase() : <User className="size-4" />}
          </Link>
        </div>
      </div>
    </header>
  );
}
