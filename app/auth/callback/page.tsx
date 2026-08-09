'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { browserClient } from '@/shared/api/supabase';
import { ROUTES } from '@/shared/config/routes';

/**
 * Implicit-flow magic-link landing page.
 *
 * With `flowType: 'implicit'` the magic link carries the session tokens in the
 * URL fragment (`#access_token=...&refresh_token=...`), which the server never
 * sees — so there is no route handler here. This page reads them in the
 * browser, exchanges them for a session via `setSession` (writes the auth
 * cookies), then bounces to `next` (or home).
 *
 * Public: listed in `PUBLIC_PATHS` in `proxy.ts`, so middleware lets it
 * through unauthenticated.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function completeSignIn() {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hash.get('access_token');
      const refreshToken = hash.get('refresh_token');

      if (!accessToken || !refreshToken) {
        router.replace(`${ROUTES.login}?error=${encodeURIComponent('missing_tokens')}`);
        return;
      }

      const supabase = browserClient();
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (cancelled) return;
      if (error) {
        router.replace(`${ROUTES.login}?error=${encodeURIComponent(error.message)}`);
        return;
      }

      const next =
        new URLSearchParams(window.location.search).get('next') ?? ROUTES.home;
      router.replace(next);
    }

    void completeSignIn();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="font-brand-mono text-sm uppercase tracking-[0.08em] text-[#c8c6c5]">
        Completando el inicio de sesión...
      </p>
    </div>
  );
}
