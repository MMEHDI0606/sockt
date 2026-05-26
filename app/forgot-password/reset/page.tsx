'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = useMemo(() => searchParams.get('email') || '', [searchParams]);
  const token = useMemo(() => searchParams.get('token') || '', [searchParams]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);

    const res = await fetch('/api/auth/forgot-password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, resetToken: token, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Could not reset password.');
      setBusy(false);
      return;
    }

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Password reset completed, but auto login failed. Please log in manually.');
      setBusy(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  if (!email || !token) {
    return (
      <main className="min-h-screen grid place-items-center px-4 py-8 text-[var(--text-secondary)]">
        Missing reset context. Please restart forgot password.
      </main>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center px-4 py-8">
      <section className="w-full max-w-[440px] border border-[var(--bg-border)] rounded-2xl bg-[var(--bg-surface)] p-8 shadow-2xl">
        <h1 className="font-display text-3xl mb-2 text-[var(--text-primary)]">Set New Password</h1>
        <p className="text-[var(--text-secondary)] text-sm mb-8">Create a new password for {email}.</p>

        <form onSubmit={onSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">New Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              className="w-full bg-[var(--bg-void)] border border-[var(--bg-border)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-btc)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div className="grid gap-2">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">Confirm Password</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={8}
              className="w-full bg-[var(--bg-void)] border border-[var(--bg-border)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-btc)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-[var(--accent-red)] text-xs leading-relaxed">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className={`mt-2 font-mono text-xs tracking-widest py-4 rounded-lg transition-all ${
              busy ? 'bg-[var(--bg-border)] text-[var(--text-secondary)] cursor-not-allowed opacity-50' : 'bg-[var(--accent-btc)] text-[var(--bg-void)] hover:opacity-90'
            }`}
          >
            {busy ? 'UPDATING...' : 'RESET PASSWORD'}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center px-4 py-8 text-[var(--text-secondary)]">
          Loading reset form...
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
