'use client';

import { useState, useRef, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ open, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setEmail('');
      setState('idle');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state !== 'loading') onClose();
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose, state]);

  async function submit() {
    if (!email || state === 'loading') return;
    setState('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setState(res.ok ? 'done' : 'error');
    } catch {
      setState('error');
    }
  }

  if (!open) return null;

  const C = {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    border: 'var(--bg-border)',
    surface: 'var(--bg-surface)',
    void: 'var(--bg-void)',
    mono: 'var(--font-mono)',
    headline: 'var(--font-headline)',
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={state === 'loading' ? undefined : onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(4,4,6,0.72)',
          backdropFilter: 'blur(8px)',
        }}
      />
      <div
        style={{
          position: 'relative', width: '100%', maxWidth: 420,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16, padding: '40px 32px 32px',
        }}
      >
        <button
          onClick={state === 'loading' ? undefined : onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: 'none', border: 'none',
            color: C.secondary, cursor: 'pointer',
            fontFamily: C.mono, fontSize: 14, padding: '4px 8px',
          }}
        >
          ✕
        </button>

        {state === 'done' ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
            <h2 style={{ fontFamily: C.headline, fontSize: '1.5rem', fontWeight: 700, color: C.primary, margin: '0 0 8px', letterSpacing: '-0.03em' }}>
              You&apos;re on the list
            </h2>
            <p style={{ fontFamily: C.mono, fontSize: 13, color: C.secondary, lineHeight: 1.6, margin: '0 0 24px' }}>
              We&apos;ll reach out when early access opens.
            </p>
            <button
              onClick={onClose}
              style={{
                fontFamily: C.mono, fontSize: 12, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                background: C.primary, color: C.void,
                border: 'none', borderRadius: 8, padding: '12px 28px',
                cursor: 'pointer',
              }}
            >
              Got it
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: C.headline, fontSize: '1.5rem', fontWeight: 700, color: C.primary, margin: '0 0 8px', letterSpacing: '-0.03em' }}>
              Get early access
            </h2>
            <p style={{ fontFamily: C.mono, fontSize: 13, color: C.secondary, lineHeight: 1.6, margin: '0 0 24px' }}>
              Be the first to try the managed platform when it launches.
            </p>

            <label style={{ display: 'block', marginBottom: 8 }}>
              <span style={{ fontFamily: C.mono, fontSize: 10, color: C.secondary, letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Email
              </span>
              <input
                ref={inputRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="you@company.com"
                disabled={state === 'loading'}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  fontFamily: C.mono, fontSize: 14,
                  color: C.primary, background: C.void,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8, padding: '12px 16px',
                  outline: 'none', letterSpacing: '0.04em',
                }}
              />
            </label>

            {state === 'error' && (
              <p style={{ fontFamily: C.mono, fontSize: 11, color: '#D95B5B', margin: '0 0 12px' }}>
                Something went wrong. Try again.
              </p>
            )}

            <button
              onClick={submit}
              disabled={state === 'loading' || !email}
              style={{
                width: '100%', marginTop: 8,
                fontFamily: C.mono, fontSize: 12, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                background: C.primary, color: C.void,
                border: 'none', borderRadius: 8, padding: '13px 0',
                cursor: state === 'loading' || !email ? 'not-allowed' : 'pointer',
                opacity: state === 'loading' || !email ? 0.5 : 1,
              }}
            >
              {state === 'loading' ? 'Sending...' : 'Join waitlist'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
