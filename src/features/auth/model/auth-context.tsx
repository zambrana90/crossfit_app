'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session,User } from '@supabase/supabase-js';
import { browserClient } from '@/shared/api/supabase';

export type UserRole = 'admin' | 'user';

export interface CurrentUser {
  id: string;
  email: string;
  role: UserRole;
  session: Session;
}

interface AuthContextValue {
  user: CurrentUser | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, isLoading: true });

function resolveRole(user: User | undefined | null): UserRole {
  const role = user?.app_metadata?.role;
  return role === 'admin' ? 'admin' : 'user';
}

function toCurrentUser(session: Session | null): CurrentUser | null {
  if (!session?.user) return null;
  return {
    id: session.user.id,
    email: session.user.email ?? '',
    role: resolveRole(session.user),
    session,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => browserClient(), []);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUser(toCurrentUser(data.session));
      setIsLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(toCurrentUser(session));
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo<AuthContextValue>(() => ({ user, isLoading }), [user, isLoading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}