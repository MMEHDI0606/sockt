'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

type AuthMode = 'login' | 'signup';

type AuthFormProps = {
  mode: AuthMode;
};

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isLogin = mode === 'login';
  const nextPath = useMemo(() => searchParams.get('next') || '/dashboard', [searchParams]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();

    const supabase = createClient();

    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setBusy(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setBusy(false);
      return;
    }

    // Supabase can return an obfuscated "success" for existing users when email confirmation is enabled.
    if (data.user && !data.session && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      setError('An account with this email already exists. Please log in instead.');
      setBusy(false);
      return;
    }

    if (data.session) {
      router.push('/dashboard');
      router.refresh();
      return;
    }

    setMessage('Account created. Check your email to verify your account.');
    setBusy(false);
  }

  return (
    <main className="min-h-screen grid place-items-center px-4 py-8">
      <section className="w-full max-w-[440px] border border-[var(--bg-border)] rounded-2xl bg-[var(--bg-surface)] p-8 shadow-2xl">
        <h1 className="font-display text-4xl mb-2 text-[var(--text-primary)]">
          {isLogin ? 'Sign in' : 'Create Account'}
        </h1>

        <p className="text-[var(--text-secondary)] text-sm mb-8">
          {isLogin
            ? 'Welcome back. Enter your credentials to continue.'
            : 'Get started with Sockt today.'}
        </p>

        <form onSubmit={onSubmit} className="grid gap-5">
          <div className="grid gap-2">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">
              Email
            </span>
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

          <div className="grid gap-2">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="w-full bg-[var(--bg-void)] border border-[var(--bg-border)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-btc)] transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-[var(--accent-red)] text-xs leading-relaxed">
              {error}
            </p>
          )}

          {message && (
            <p className="text-[var(--accent-green)] text-xs leading-relaxed">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className={`mt-2 font-mono text-xs tracking-widest py-4 rounded-lg transition-all ${busy
                ? 'bg-[var(--bg-border)] text-[var(--text-secondary)] cursor-not-allowed opacity-50'
                : 'bg-[var(--accent-btc)] text-[var(--bg-void)] hover:opacity-90'
              }`}
          >
            {busy ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>

          {isLogin && (
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-[var(--accent-btc)] text-xs font-mono hover:underline decoration-1 underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </form>

        <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <Link
            href={isLogin ? '/signup' : '/login'}
            className="text-[var(--accent-btc)] hover:underline decoration-1 underline-offset-4"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </p>
      </section>
    </main>
  );
}
