import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

/**
 * Server-component / route-handler Supabase client bound to the request
 * cookies. Anon key; uses RLS based on the user's session cookie.
 *
 * Server-only: uses `next/headers` — import via `index.server.ts`, never
 * from a client component.
 */
export async function serverClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(toSet) {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    },
  );
}

/**
 * Service-role client. Bypasses RLS. Use ONLY from trusted server code
 * (admin server actions that have re-verified the user's role, and the
 * one-time migration script). NEVER expose to the browser bundle.
 */
export const serviceClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
