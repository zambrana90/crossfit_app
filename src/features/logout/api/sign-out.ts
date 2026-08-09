'use client';

import { useRouter } from 'next/navigation';
import { browserClient } from '@/shared/api/supabase';
import { ROUTES } from '@/shared/config/routes';
import { toast } from 'sonner';

export function useSignOut() {
  const router = useRouter();
  const supabase = browserClient();

  return async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success('Sesión cerrada.');
    router.push(ROUTES.login);
    router.refresh();
  };
}