/**
 * Routes that require an authenticated session. Everything not listed here
 * (but not in `PUBLIC_PATHS` in `proxy.ts`) is also gated by the proxy, so
 * this list is documentary — keep it in sync with the app's routes.
 */
export const AUTH_ROUTES = ['/', '/profile', '/library'] as const;

export function isProtectedRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || (route !== '/' && pathname.startsWith(route)),
  );
}
