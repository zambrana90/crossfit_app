import { AUTH_ROUTES } from '@/features/auth/model/protected-routes';
import { ROUTES } from '@/shared/config/routes';
import { Brand } from '@/shared/ui/brand';
import Link from 'next/link';
import { LoginCard } from '@/features/auth/ui/LoginCard';

export function LoginPage() {
  return (
    <div className="min-h-dvh bg-[#121414] font-brand-body text-[#e2e2e2]">
      {/* decorative radial glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(195, 244, 0, 0.2), transparent 70%)',
        }}
      />
      <header className="fixed inset-x-0 top-0 z-10 flex h-16 items-center justify-center">
        <Brand iconClassName="h-10 w-10" />
      </header>
      <main className="relative mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center gap-8 px-6 pb-10 pt-16">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-brand-display text-2xl font-semibold uppercase tracking-tight">
            Acceso
          </h1>
          <p className="text-base text-[#c8c6c5]">
            Introduce tu correo para recibir un enlace mágico.
          </p>
        </div>
        <div className="w-full rounded-lg border border-white/5 bg-[#1e2020] p-6 shadow-lg">
          <LoginCard />
        </div>
        <p className="max-w-xs text-center text-xs text-[#c8c6c5]/70">
          Sin registro. El acceso se crea desde el panel de Supabase y entra con un enlace
          mágico cada vez que vuelves.
        </p>
        <Link
          href={ROUTES.home}
          className="font-brand-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#c8c6c5] transition-colors hover:text-[#c3f400]"
        >
          Volver al inicio
        </Link>
        {/* referenced so unused-export lint does not drop AUTH_ROUTES from build */}
        <span className="hidden" data-protected-routes={AUTH_ROUTES.join(',')} />
      </main>
    </div>
  );
}
