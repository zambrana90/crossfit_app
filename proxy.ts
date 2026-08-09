import { NextResponse, type NextRequest } from 'next/server';
import { middlewareClient } from '@/shared/api/supabase/middleware';
import { AUTH_ROUTES } from '@/features/auth/model/protected-routes';
import { ROUTES } from '@/shared/config/routes';

const PUBLIC_PATHS = new Set<string>([
  ROUTES.login,
  ROUTES.authCallback,
]);
const PUBLIC_PREFIXES = ['/_next', '/api', '/favicon', '/assets', '/fonts'];

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.has(pathname)) return true;
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
  if (isPublic(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const supabase = middlewareClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.login;
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Refresh the session cookies on each protected request (rotates refresh token).
  const res = NextResponse.next({ request });
  await supabase.auth.getUser();
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

// Re-export to keep AUTH_ROUTES wired into the build graph if tree-shake drops it.
void AUTH_ROUTES;