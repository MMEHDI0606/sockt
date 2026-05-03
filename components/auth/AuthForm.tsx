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

    setMessage('Account created. Check your email to verify your account, then sign in.');
    setBusy(false);
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '32px 20px',
      }}
    >
      <section
        style={{
          width: 'min(460px, 100%)',
          border: '1px solid var(--bg-border)',
          borderRadius: '14px',
          backgroundColor: 'var(--bg-surface)',
          padding: '28px',
          boxShadow: '0 16px 64px rgba(0, 0, 0, 0.45)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent-btc)',
            letterSpacing: '0.1em',
            fontSize: '11px',
            marginBottom: '12px',
          }}
        >
          AUTH GATE
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 8vw, 2.2rem)',
            lineHeight: 1,
            marginBottom: '10px',
          }}
        >
          {isLogin ? 'Sign in to Dashboard' : 'Create Dashboard Account'}
        </h1>

        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '22px' }}>
          {isLogin
            ? 'Use your email and password to access the protected control panel.'
            : 'Sign up with email and password. Your session uses PKCE-compatible Supabase auth flow.'}
        </p>

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '12px' }}>
          <label style={{ display: 'grid', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
              EMAIL
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              style={{
                width: '100%',
                backgroundColor: '#0a0a0a',
                border: '1px solid var(--bg-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                padding: '12px 14px',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
              PASSWORD
            </span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              style={{
                width: '100%',
                backgroundColor: '#0a0a0a',
                border: '1px solid var(--bg-border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                padding: '12px 14px',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
              }}
            />
          </label>

          {error ? (
            <p
              style={{
                color: 'var(--accent-red)',
                fontSize: '13px',
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
          ) : null}

          {message ? (
            <p
              style={{
                color: 'var(--accent-green)',
                fontSize: '13px',
                lineHeight: 1.5,
              }}
            >
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            style={{
              marginTop: '2px',
              border: '1px solid var(--accent-btc)',
              backgroundColor: busy ? '#6f4b24' : 'var(--accent-btc)',
              color: 'var(--bg-void)',
              borderRadius: '8px',
              padding: '12px 14px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.08em',
              cursor: busy ? 'not-allowed' : 'pointer',
            }}
          >
            {busy ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
          {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
          <Link
            href={isLogin ? '/signup' : '/login'}
            style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </Link>
        </p>
      </section>
    </main>
  );
}
