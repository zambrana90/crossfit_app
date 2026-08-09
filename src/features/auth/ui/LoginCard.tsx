'use client';

import { useState, type FormEvent } from 'react';
import { Mail, ArrowRight, MailCheck, AlertCircle } from 'lucide-react';
import { useMagicLink } from '@/features/auth/api/sign-in-with-otp';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Spinner } from '@/shared/ui/skeleton';

export function LoginCard() {
  const [email, setEmail] = useState('');
  const { status, errorMessage, sendMagicLink, reset } = useMagicLink();
  const origin =
    typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback';

  function backToForm() {
    reset();
    setEmail('');
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    await sendMagicLink(email, origin);
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <MailCheck className="h-10 w-10 text-[#c3f400]" />
        <h2 className="font-brand-display text-2xl font-semibold uppercase tracking-tight text-[#e2e2e2]">
          Revisa tu correo
        </h2>
        <p className="text-base text-[#c8c6c5]">
          Hemos enviado un enlace mágico a{' '}
          <span className="font-medium text-[#e2e2e2]">{email}</span>. Pincha en él para entrar.
        </p>
        <Button
          variant="outline"
          onClick={backToForm}
          className="mt-2 border-white/20 bg-transparent text-[#c8c6c5] shadow-none hover:bg-white/5 hover:text-[#e2e2e2]"
        >
          Volver
        </Button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-[#93000a] bg-[#93000a]/30 p-4 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#93000a]">
          <AlertCircle className="h-5 w-5 text-[#ffb4ab]" />
        </span>
        <p className="text-sm leading-relaxed text-[#ffdad6]">
          {errorMessage ?? 'No se pudo enviar el enlace mágico. Inténtalo de nuevo.'}
        </p>
        <Button
          variant="outline"
          onClick={backToForm}
          className="mt-1 border-white/20 bg-transparent text-[#ffb4ab] shadow-none hover:bg-white/5 hover:text-[#ffdad6]"
        >
          Volver a intentar
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block space-y-2">
        <span className="font-brand-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#c8c6c5]">
          Correo electrónico
        </span>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c8c6c5]" />
          <Input
            type="email"
            required
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            disabled={status === 'sending'}
            className="h-12 rounded-lg border-white/20 bg-transparent pl-10 text-[#e2e2e2] placeholder:text-[#333535] focus-visible:border-[#c3f400]/50 focus-visible:ring-2 focus-visible:ring-[#c3f400] focus-visible:ring-offset-0"
          />
        </div>
      </label>
      <Button
        type="submit"
        disabled={status === 'sending'}
        className="h-auto w-full rounded-lg bg-[#c3f400] py-4 font-brand-mono text-sm font-semibold uppercase tracking-[0.08em] text-[#121414] shadow-none transition hover:bg-[#c3f400] hover:opacity-90 active:scale-95"
      >
        {status === 'sending' ? <Spinner /> : null}
        Enviar enlace mágico
        <ArrowRight />
      </Button>
    </form>
  );
}
