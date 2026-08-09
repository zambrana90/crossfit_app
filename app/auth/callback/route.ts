import { NextResponse, type NextRequest } from 'next/server';
import { middlewareClient } from '@/shared/api/supabase/middleware';
import { ROUTES } from '@/shared/config/routes';

/**
 * Magic-link redirect target. Exchanges the code for a session and sets the
 * cookies on the response before bouncing to `next` (or `/`).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? ROUTES.home;

  if (!code) {
    return NextResponse.redirect(`${origin}${ROUTES.login}?error=no_code`);
  }

  const supabase = middlewareClient(request);
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}${ROUTES.login}?error=${encodeURIComponent(error.message)}`);
  }

  // The middleware client's setAll wrote the session cookies on `request.cookies`.
  // Forward them to the final redirect response.
  const response = NextResponse.redirect(`${origin}${next}`);
  request.cookies.getAll().forEach((c) => response.cookies.set(c.name, c.value));
  return response;
}