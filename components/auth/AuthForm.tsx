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

    const supabase = createClient();

    if (isLogin) {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
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
      email,
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
        <h1 className="font-display text-4xl mb-2 text-white">
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
              className="w-full bg-black border border-[var(--bg-border)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-btc)] transition-colors"
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
              className="w-full bg-black border border-[var(--bg-border)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--accent-btc)] transition-colors"
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
            className={`mt-2 font-mono text-xs tracking-widest py-4 rounded-lg transition-all ${
              busy 
                ? 'bg-[#6f4b24] cursor-not-allowed opacity-70' 
                : 'bg-[var(--accent-btc)] text-black hover:opacity-90'
            }`}
          >
            {busy ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
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
