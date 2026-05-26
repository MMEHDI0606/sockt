'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function formatSeconds(total: number): string {
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get('email') || '', [searchParams]);
  const initialExpiresAt = useMemo(() => searchParams.get('expiresAt') || '', [searchParams]);
  const devOtp = useMemo(() => searchParams.get('devOtp') || '', [searchParams]);

  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState(initialExpiresAt);
  const [countdown, setCountdown] = useState(0);
  const [resendBusy, setResendBusy] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const tick = () => {
      const remaining = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setCountdown(remaining);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  async function onVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const res = await fetch('/api/auth/forgot-password/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'OTP verification failed.');
      setBusy(false);
      return;
    }

    const params = new URLSearchParams({
      email,
      token: data.resetToken,
      tokenExpiresAt: data.resetExpiresAt,
    });

    router.push(`/forgot-password/reset?${params.toString()}`);
  }

  async function onResend() {
    setResendBusy(true);
    setError(null);

    const res = await fetch('/api/auth/forgot-password/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Could not resend OTP.');
      setResendBusy(false);
      return;
    }

    setExpiresAt(data.expiresAt);
    if (data.devOtp) {
      router.replace(`/forgot-password/verify?email=${encodeURIComponent(email)}&expiresAt=${encodeURIComponent(data.expiresAt)}&devOtp=${encodeURIComponent(data.devOtp)}`);
    }
    setResendBusy(false);
  }

  if (!email) {
    return (
      <main className="min-h-screen grid place-items-center px-4 py-8 text-[var(--text-secondary)]">
        Missing email context. Please restart forgot password.
      </main>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center px-4 py-8">
      <section className="w-full max-w-[440px] border border-[var(--bg-border)] rounded-2xl bg-[var(--bg-surface)] p-8 shadow-2xl">
        <h1 className="font-display text-3xl mb-2 text-[var(--text-primary)]">Verify OTP</h1>
        <p className="text-[var(--text-secondary)] text-sm mb-3">Enter the 6-digit code sent to {email}.</p>
        <p className="text-[var(--text-secondary)] text-xs mb-6">Code expires in {formatSeconds(countdown)}</p>

        {devOtp && (
          <p className="text-[var(--accent-amber)] text-xs mb-4">Dev OTP: {devOtp}</p>
        )}

        <form onSubmit={onVerify} className="grid gap-5">
          <div className="grid gap-2">
            <span className="text-[11px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">OTP Code</span>
            <input
              type="text"
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
              inputMode="numeric"
              pattern="[0-9]{6}"
              required
              maxLength={6}
              className="w-full bg-[var(--bg-void)] border border-[var(--bg-border)] rounded-lg text-[var(--text-primary)] px-4 py-3 text-sm tracking-[0.3em] focus:outline-none focus:border-[var(--accent-btc)] transition-colors"
              placeholder="123456"
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
            {busy ? 'VERIFYING...' : 'VERIFY OTP'}
          </button>
        </form>

        <button
          onClick={onResend}
          disabled={resendBusy}
          className="mt-5 text-[var(--accent-btc)] text-xs font-mono tracking-wider disabled:opacity-50"
        >
          {resendBusy ? 'RESENDING...' : 'RESEND CODE'}
        </button>
      </section>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen grid place-items-center px-4 py-8 text-[var(--text-secondary)]">
          Loading verification form...
        </main>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}
