'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const LINES = [
  '> initializing runtime',
  '> gpu_type: H100 SXM5',
  '> allocation: 2x',
  '> channel_open: lnbc1pvjluezpp...',
  '> balance: 128,400 sats',
  '> status: READY ✓',
];

export default function HeroConsole() {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < LINES.length) {
        const nextLine = LINES[i];
        if (typeof nextLine === 'string') {
          setVisibleLines((prev) => [...prev, nextLine]);
        }
        i++;
      } else {
        clearInterval(interval);
      }
    }, 320);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '200px',
        minHeight: '200px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--bg-border)',
        borderRadius: '4px',
        padding: '12px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '10px',
          borderBottom: '1px solid var(--bg-border)',
          paddingBottom: '8px',
        }}
      >
        {['#e53e3e', '#fbbf24', '#22d07a'].map((c, i) => (
          <span
            key={i}
            style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: c }}
          />
        ))}
        <span style={{ color: 'var(--text-secondary)', fontSize: '10px', marginLeft: '4px' }}>
          sockt-runtime
        </span>
      </div>
      {visibleLines.map((line, i) => (
        <div key={i} style={{ marginBottom: '4px', lineHeight: 1.6 }}>
          <span style={{ color: 'var(--accent-green)' }}>&gt;</span>
          <span style={{ color: 'var(--text-mono)', marginLeft: '6px' }}>
            {typeof line === 'string' ? line.replace(/^> /, '') : ''}
          </span>
        </div>
      ))}
      {visibleLines.length < LINES.length && (
        <span className="cursor-blink" style={{ color: 'var(--accent-btc)' }}>
          |
        </span>
      )}
      {visibleLines.length === LINES.length && (
        <span className="cursor-blink" style={{ color: 'var(--accent-green)' }}>
          _
        </span>
      )}
    </div>
  );
}
