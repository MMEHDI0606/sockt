'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [recoveryReady, setRecoveryReady] = useState(false);
  const [checkingRecovery, setCheckingRecovery] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function initRecoverySession() {
      setCheckingRecovery(true);

      const code = searchParams.get('code');
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError('This reset link is invalid or expired. Please request a new one.');
          setCheckingRecovery(false);
          return;
        }
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !data.session) {
        setError('This reset link is invalid or expired. Please request a new one.');
        setCheckingRecovery(false);
        return;
      }

      setRecoveryReady(true);
      setCheckingRecovery(false);
    }

    void initRecoverySession();
  }, [searchParams]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);
    const supabase = createClient();

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message || 'Could not reset password.');
      setBusy(false);
      return;
    }

    setMessage('Password updated successfully. Redirecting to dashboard...');
    setBusy(false);
    router.push('/dashboard');
    router.refresh();
  }

  if (checkingRecovery) {
    return (
      <main className="min-h-screen grid place-items-center px-4 py-8 text-[var(--text-secondary)]">
        Validating reset link...
      </main>
    );
  }

  if (!recoveryReady) {
    return (
      <main className="min-h-screen grid place-items-center px-4 py-8 text-[var(--text-secondary)]">
        Reset link is invalid or expired. Please request a new password reset.
      </main>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center px-4 py-8">
      <section className="w-full max-w-[440px] border border-[var(--bg-border)] rounded-2xl bg-[var(--bg-surface)] p-8 shadow-2xl">
        <h1 className="font-display text-3xl mb-2 text-[var(--text-primary)]">Set New Password</h1>
        <p className="text-[var(--text-secondary)] text-sm mb-8">Create a new password for your account.</p>

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
          {message && <p className="text-[var(--accent-green)] text-xs leading-relaxed">{message}</p>}

          <button
            type="submit"
            disabled={busy}
            className={`mt-2 font-mono text-xs tracking-widest py-4 rounded-lg transition-all ${busy ? 'bg-[var(--bg-border)] text-[var(--text-secondary)] cursor-not-allowed opacity-50' : 'bg-[var(--accent-btc)] text-[var(--bg-void)] hover:opacity-90'
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
