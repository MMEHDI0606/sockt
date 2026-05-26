'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    const supabase = createClient();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo:
        typeof window !== 'undefined'
          ? `${window.location.origin}/forgot-password/reset`
          : undefined,
    });

    if (resetError) {
      setError(resetError.message || 'Could not send password reset email.');
      setBusy(false);
      return;
    }

    setMessage('If an account exists for this email, a reset link has been sent.');
    setBusy(false);
  }

  return (
    <main className="min-h-screen grid place-items-center px-4 py-8">
      <section className="w-full max-w-[440px] border border-[var(--bg-border)] rounded-2xl bg-[var(--bg-surface)] p-8 shadow-2xl">
        <h1 className="font-display text-3xl mb-2 text-[var(--text-primary)]">Forgot Password</h1>
        <p className="text-[var(--text-secondary)] text-sm mb-8">
          Enter your email and we will send a secure reset link.
        </p>

        <form onSubmit={onSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full bg-[var(--bg-void)] border border-[var(--bg-border)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-btc)] transition-colors"
              placeholder="name@company.com"
            />
          </div>

          {error && <p className="text-[var(--accent-red)] text-xs leading-relaxed">{error}</p>}
          {message && <p className="text-[var(--accent-green)] text-xs leading-relaxed">{message}</p>}

          <button
            type="submit"
            disabled={busy}
            className={`mt-2 font-mono text-xs tracking-widest py-4 rounded-lg transition-all ${busy ? 'bg-[var(--bg-border)] text-[var(--text-secondary)] cursor-not-allowed opacity-50' : 'bg-[var(--accent-btc)] text-[var(--bg-void)] hover:opacity-90'
              }`}
          >
            {busy ? 'SENDING...' : 'SEND RESET LINK'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          Remembered your password?{' '}
          <Link href="/login" className="text-[var(--accent-btc)] hover:underline decoration-1 underline-offset-4">
            Back to login
          </Link>
        </p>
      </section>
    </main>
  );
}
