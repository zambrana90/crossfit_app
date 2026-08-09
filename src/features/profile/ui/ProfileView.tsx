'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BadgeCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useSignOut } from '@/features/logout';
import { WorkoutCard } from '@/entities/training';
import { CardSkeleton } from '@/shared/ui/skeleton';
import { cn } from '@/shared/lib/format-date';
import { PROFILE_QUERIES } from '../api/profile.queries';
import type { TrainingListItem } from '@/shared/api/training';

type ProfileTab = 'favorites' | 'history';

const TABS: { key: ProfileTab; label: string }[] = [
  { key: 'favorites', label: 'Favoritos' },
  { key: 'history', label: 'Entrenos' },
];

/** Email local part → capitalized display name ("jaxon.verdone" → "Jaxon V."). */
function deriveDisplayName(email: string): string {
  const local = email.split('@')[0] ?? '';
  const words = local.split(/[._+\-]+/).filter(Boolean);
  if (words.length === 0) return 'Atleta';
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/** First initial for the monogram avatar ("jaxon…" → "J"). */
function deriveInitial(email: string): string {
  return (email.charAt(0) ?? '?').toUpperCase();
}

function StatsCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-white/10 bg-surface-container p-4">
      <span className="font-display text-3xl leading-none text-primary-container">{value}</span>
      <span className="mt-2 font-brand-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
        {label}
      </span>
    </div>
  );
}

function renderWorkoutCard(t: TrainingListItem, userId: string) {
  return (
    <WorkoutCard
      key={t.id}
      trainingId={t.id}
      class={t.class}
      day={t.day}
      blocks={t.blocks.map((b) => ({
        id: b.id,
        title: b.title,
        description: b.description,
        rounds_meta: b.rounds_meta,
        exercises: b.block_exercises.map((e) => ({
          id: e.id,
          name: e.name,
          reps: e.reps,
          weight: e.weight,
          img: e.img,
        })),
      }))}
      isFavorite={t.isFavorite}
      isDone={t.isDone}
      userId={userId}
      filter={{}}
    />
  );
}

export function ProfileView() {
  const { user, isLoading: authLoading } = useAuth();
  const signOut = useSignOut();
  const userId = user?.id ?? '';
  const email = user?.email ?? '';
  const role = user?.role ?? 'user';

  const [tab, setTab] = useState<ProfileTab>('favorites');
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const tabRef = useRef(tab);
  const [pill, setPill] = useState({ left: 0, width: 0 });

  const query = useQuery({
    ...PROFILE_QUERIES.detail(userId),
    enabled: Boolean(userId),
  });

  const measure = () => {
    const container = containerRef.current;
    const btn = buttonRefs.current[tabRef.current];
    if (!container || !btn) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setPill({ left: btnRect.left - containerRect.left, width: btnRect.width });
  };

  useLayoutEffect(() => {
    tabRef.current = tab;
    // The tablist only mounts once loading finishes, so re-measure when the
    // loading flags flip — otherwise the pill starts at 0x0 on first paint.
    if (!authLoading && !query.isLoading) measure();
  }, [tab, authLoading, query.isLoading]);

  useLayoutEffect(() => {
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  if (authLoading || query.isLoading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-4">
          <div className="size-20 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-8 w-40 animate-pulse rounded bg-muted" />
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          </div>
        </div>
        {Array.from({ length: 2 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!user) {
    return (
      <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
        Inicia sesión para ver tu perfil.
      </p>
    );
  }

  if (query.isError) {
    return (
      <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        No se pudo cargar tu perfil.
      </p>
    );
  }

  const data = query.data;
  const items = (tab === 'favorites' ? data?.favorites : data?.history) ?? [];
  const emptyMessage =
    tab === 'favorites'
      ? 'Aún no tienes entrenamientos favoritos.'
      : 'Aún no has completado entrenamientos.';

  return (
    <div>
      {/* Hero */}
      <section className="mb-6 flex items-center gap-4">
        <div
          aria-hidden
          className="flex size-20 shrink-0 items-center justify-center rounded-full border-2 border-primary-container bg-surface-container font-brand-mono text-3xl font-bold text-primary-container"
        >
          {deriveInitial(email)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate font-display text-3xl uppercase tracking-tight text-on-surface">
              {deriveDisplayName(email)}
            </h1>
            <BadgeCheck className="size-5 shrink-0 text-primary-container" aria-label="Verificado" />
          </div>
          <p className="font-brand-mono text-xs font-semibold uppercase tracking-[0.12em] text-primary-container/80">
            {role === 'admin' ? 'Admin' : 'Atleta'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
        >
          <LogOut className="size-4" /> Cerrar sesión
        </button>
      </section>

      {/* Stats — same order as the tabs: Favoritos, Entrenos */}
      <section className="mb-6 grid grid-cols-2 gap-3" aria-label="Estadísticas">
        <StatsCell value={data?.stats.favorites ?? 0} label="Favoritos" />
        <StatsCell value={data?.stats.workouts ?? 0} label="Entrenos" />
      </section>

      {/* Tabs */}
      <div
        ref={containerRef}
        role="tablist"
        aria-label="Entrenamientos del perfil"
        className="relative mb-5 grid w-full grid-cols-2 gap-1 rounded-full border border-white/5 bg-white/5 p-1 shadow-inner"
      >
        <span
          aria-hidden
          className="absolute inset-y-1 rounded-full bg-primary-container transition-[left,width] duration-300 ease-out"
          style={{ left: pill.left, width: pill.width }}
        />
        {TABS.map((t) => (
          <button
            key={t.key}
            ref={(el) => {
              buttonRefs.current[t.key] = el;
            }}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'relative z-10 rounded-full px-3 py-2 font-brand-mono text-xs font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container',
              tab === t.key ? 'text-black' : 'text-on-surface-variant hover:text-white',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div>
        {items.length === 0 ? (
          <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          items.map((t) => renderWorkoutCard(t, userId))
        )}
      </div>
    </div>
  );
}
