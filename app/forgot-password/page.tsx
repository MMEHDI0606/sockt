'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const res = await fetch('/api/auth/forgot-password/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Could not send OTP.');
      setBusy(false);
      return;
    }

    const params = new URLSearchParams({
      email: email.trim().toLowerCase(),
      expiresAt: data.expiresAt,
    });

    if (data.devOtp) {
      params.set('devOtp', data.devOtp);
    }

    if (data.warning) {
      params.set('warning', data.warning);
    }

    router.push(`/forgot-password/verify?${params.toString()}`);
  }

  return (
    <main className="min-h-screen grid place-items-center px-4 py-8">
      <section className="w-full max-w-[440px] border border-[var(--bg-border)] rounded-2xl bg-[var(--bg-surface)] p-8 shadow-2xl">
        <h1 className="font-display text-3xl mb-2 text-[var(--text-primary)]">Forgot Password</h1>
        <p className="text-[var(--text-secondary)] text-sm mb-8">
          Enter your email and we will send a 6-digit OTP.
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

          <button
            type="submit"
            disabled={busy}
            className={`mt-2 font-mono text-xs tracking-widest py-4 rounded-lg transition-all ${busy ? 'bg-[var(--bg-border)] text-[var(--text-secondary)] cursor-not-allowed opacity-50' : 'bg-[var(--accent-btc)] text-[var(--bg-void)] hover:opacity-90'
              }`}
          >
            {busy ? 'SENDING...' : 'SEND OTP'}
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
