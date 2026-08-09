// features/auth/index.ts — client-safe public API of the auth feature slice.
export { AuthProvider, useAuth, type CurrentUser, type UserRole } from './model/auth-context';
export { AUTH_ROUTES, isProtectedRoute } from './model/protected-routes';
export { useMagicLink } from './api/sign-in-with-otp';
export { LoginCard } from './ui/LoginCard';
