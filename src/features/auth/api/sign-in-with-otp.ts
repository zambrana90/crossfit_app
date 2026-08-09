'use client';

import { useState } from 'react';
import { browserClient } from '@/shared/api/supabase';

/**
 * Magic-link sending with inline feedback.
 *
 * Feedback is rendered by the caller (LoginCard) instead of toasts so it can
 * live inside the login card in the portal design: `status` drives the panel
 * and `errorMessage` carries the human-readable reason when status is 'error'.
 */
export function useMagicLink() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = browserClient();

  async function sendMagicLink(email: string, redirectTo: string) {
    setStatus('sending');
    setErrorMessage(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        // No auto-account creation: only send the magic link to existing users
        // (accounts are created from the Supabase dashboard, never publicly).
        shouldCreateUser: false,
      },
    });
    if (error) {
      setStatus('error');
      // 'otp_disabled' / "Signups not allowed for otp" is returned by GoTrue
      // when shouldCreateUser:false and the email has no account yet.
      setErrorMessage(
        error.code === 'otp_disabled'
          ? 'No existe una cuenta con ese correo. Contacta con el administrador si crees que es un error.'
          : 'No se pudo enviar el enlace mágico. Inténtalo de nuevo o contacta con el administrador.',
      );
      return;
    }
    setStatus('sent');
  }

  /** Back to the form: clears the inline feedback so the card re-renders idle. */
  function reset() {
    setStatus('idle');
    setErrorMessage(null);
  }

  return { status, errorMessage, sendMagicLink, reset };
}