'use client';

import { useState } from 'react';

export default function CopyCommand({
  code,
  label = 'Install',
  variant = 'default',
  showPrompt = true,
}: {
  code: string;
  label?: string;
  variant?: 'hero' | 'default';
  showPrompt?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const isHero = variant === 'hero';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid var(--bg-border)',
        borderTop: '1px solid var(--border-top-highlight)',
        borderRadius: isHero ? 14 : 12,
        background: 'var(--bg-raised)',
        overflow: 'hidden',
        boxShadow: isHero
          ? '0 0 0 1px rgba(238,236,232,0.03), 0 24px 64px rgba(0,0,0,0.45), 0 0 80px rgba(194,168,120,0.06)'
          : '0 8px 28px rgba(0,0,0,0.28)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: isHero ? '12px 16px' : '10px 14px',
          borderBottom: '1px solid var(--bg-border)',
          background: 'var(--bg-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }} aria-hidden>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(229,62,62,0.75)' }} />
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(194,168,120,0.65)' }} />
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: 'rgba(34,208,122,0.55)' }} />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: copied ? 'var(--bg-void)' : 'var(--bg-void)',
            background: copied ? 'var(--accent-green)' : 'var(--text-primary)',
            border: 'none',
            borderRadius: 6,
            padding: '7px 12px',
            cursor: 'pointer',
            fontWeight: 700,
            flexShrink: 0,
            transition: 'background 0.15s ease, color 0.15s ease',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.14)',
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: isHero ? '22px 20px' : '16px 18px',
          fontFamily: 'var(--font-mono)',
          fontSize: isHero ? 'clamp(12px, 1.6vw, 14.5px)' : 12.5,
          lineHeight: 1.75,
          color: 'var(--text-primary)',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        {showPrompt ? (
          <span style={{ color: 'var(--accent-brass)', userSelect: 'none' }}>$ </span>
        ) : null}
        {code}
      </pre>
    </div>
  );
}
