'use client';

import { useState } from 'react';

export default function CopyCommand({
  code,
  label = 'Install',
}: {
  code: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for restricted clipboard environments
      setCopied(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid var(--bg-border)',
        borderRadius: '18px',
        background: 'var(--bg-surface)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '12px 16px',
          borderBottom: '1px solid var(--bg-border)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--accent-btc)',
          }}
        >
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
            background: 'transparent',
            border: '1px solid var(--bg-border)',
            borderRadius: '999px',
            padding: '6px 12px',
            cursor: 'pointer',
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: '20px 18px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          lineHeight: 1.7,
          color: 'var(--text-primary)',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        {code}
      </pre>
    </div>
  );
}
