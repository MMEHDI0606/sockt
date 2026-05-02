'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const METRICS = [
  'GPU_NODES: 2,847',
  'ACTIVE_AGENTS: 14,203',
  'SATS/EPOCH: 8,291',
  'UPTIME: 99.97%',
  'CHANNELS: 4,102',
  'AVG_SETTLE: 128ms',
  'TOTAL_FLOW: ₿ 0.00031',
];

export default function HeroTicker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;

    animRef.current = gsap.to(track, {
      x: -totalWidth,
      duration: totalWidth / 40,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((v: number) => v % totalWidth),
      },
    });

    return () => {
      animRef.current?.kill();
    };
  }, []);

  const text = METRICS.join('  ·  ') + '  ·  ';

  return (
    <div
      style={{
        overflow: 'hidden',
        borderBottom: '1px solid var(--bg-border)',
        backgroundColor: 'var(--bg-surface)',
        padding: '8px 0',
        width: '100%',
      }}
    >
      <div
        ref={trackRef}
        className="ticker-track"
        style={{
          display: 'flex',
          whiteSpace: 'nowrap',
          gap: 0,
        }}
      >
        {[text, text].map((t, i) => (
          <span
            key={i}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.06em',
              paddingRight: '0',
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
