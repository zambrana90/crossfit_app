import { createServerClient } from '@supabase/ssr';
import type { NextRequest } from 'next/server';

/**
 * Middleware / route-handler Supabase client. Cookies live on the
 * request/response pair because middleware and `auth/callback` do not have a
 * writable cookie store from `next/headers`. Edge-safe: no `next/headers`.
 */
export function middlewareClient(request: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(toSet) {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        },
      },
    },
  );
}
