'use client';

import { useState } from 'react';

const C = {
  void: 'var(--bg-void)',
  surface: 'var(--bg-surface)',
  raised: 'var(--bg-raised)',
  border: 'var(--bg-border)',
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  mono: 'var(--font-mono)',
  body: 'var(--font-body)',
  headline: 'var(--font-headline)',
  green: 'var(--accent-green)',
  red: 'var(--accent-red)',
  brass: 'var(--accent-brass)',
  monoMicro: 'var(--mono-micro)',
  monoCta: 'var(--mono-cta)',
  radiusBtn: 'var(--radius-btn)',
  radiusCard: 'var(--radius-card)',
};

export default function MemoryPage() {
  const [query, setQuery] = useState('');

  return (
    <div style={{ maxWidth: 1280 }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: C.headline,
            color: C.primary,
            letterSpacing: '-0.02em',
            margin: '0 0 4px',
          }}
        >
          Memory
        </h1>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: 0 }}>
          Explore agent memory entries written by the CADVP daemon
        </p>
      </div>

      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderTop: '1px solid var(--border-top-highlight)',
          borderRadius: C.radiusCard,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <p
          style={{
            fontSize: 13,
            fontFamily: C.body,
            color: C.secondary,
            lineHeight: 1.6,
            margin: '0 0 16px',
          }}
        >
          Agent memory is a persistent knowledge base that accumulates as agents work through tasks.
          The CADVP daemon automatically indexes task outcomes, decisions, and context, making it
          available for future agent retrieval and reasoning.
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Search memory entries..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setQuery('');
              }
            }}
            style={{
              flex: 1,
              background: C.raised,
              border: `1px solid ${C.border}`,
              borderRadius: C.radiusBtn,
              padding: '8px 14px',
              fontFamily: C.body,
              fontSize: 13,
              color: C.primary,
              outline: 'none',
            }}
          />
          <button
            onClick={() => setQuery('')}
            style={{
              background: C.primary,
              color: C.void,
              fontFamily: C.mono,
              fontSize: C.monoCta,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '8px 20px',
              border: 'none',
              borderRadius: C.radiusBtn,
              cursor: 'pointer',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
            }}
          >
            Search
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '48px 24px',
          color: C.secondary,
          fontSize: 13,
          fontFamily: C.body,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.4, marginBottom: 8 }}>&#128218;</div>
        <div>
          No memory entries yet — the CADVP daemon writes memory automatically as agents work.
        </div>
      </div>
    </div>
  );
}
