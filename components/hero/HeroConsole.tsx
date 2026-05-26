'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const LINES = [
  '> initializing runtime',
  '> gpu_type: A100 PCIe',
  '> allocation: 1x',
  '> balance: 128,400 sats',
  '> status: READY',
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
    }, 650);

    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        y: 100, // Parallax lag effect
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 30%',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '380px',
        minHeight: '280px',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--bg-border)',
        borderRadius: '8px',
        padding: '20px 24px',
        fontFamily: 'var(--font-mono)',
        fontSize: '14px',
        flexShrink: 0,
        boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--bg-border)',
          paddingBottom: '12px',
        }}
      >
        {['#e53e3e', '#fbbf24', '#22d07a'].map((c, i) => (
          <span
            key={i}
            style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: c }}
          />
        ))}
        <span style={{ color: 'var(--text-secondary)', fontSize: '11px', marginLeft: '6px' }}>
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
