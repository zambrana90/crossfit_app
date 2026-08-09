'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

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

  async function sendMagicLink(email: string, redirectTo: string) {
    setStatus('sending');
    setErrorMessage(null);
    const { error } = await implicitOtpClient().auth.signInWithOtp({
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

/**
 * Implicit-flow client for initiating magic links.
 *
 * The app's main browser client (`@supabase/ssr`) hardcodes PKCE, whose
 * verifier lives only in the requesting browser — links then fail when opened
 * elsewhere (mail apps use a separate cookie jar; cross-device always fails).
 * This client starts the OTP without a code challenge, so GoTrue emits the
 * implicit flow: tokens ride in the redirect URL fragment and the callback page
 * swaps them for a session via the @supabase/ssr client (cookie storage).
 *
 * Stateless: never persists a session, only POSTs the OTP request.
 */
function implicitOtpClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        flowType: 'implicit',
      },
    },
  );
}
