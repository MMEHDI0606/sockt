'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsMobile } from '@/hooks/useIsMobile';

const INITIAL_LINES = [
  '> [00:00:01] agent.init — model: claude-4',
  '> [00:00:02] gpu.request — H100 SXM5 x2',
  '> [00:00:03] channel.open — lnbc1pvjluez...',
  '> [00:00:04] balance.check — 128,400 sats OK',
  '> [00:00:05] provision.start — node: sockt-us-1',
];

const LIVE_LINES = [
  '> [00:00:06] epoch.start — #00142',
  '> [00:00:07] compute.running — 2x H100 active',
  '> [00:00:08] sats.stream — 1,240 sats/epoch',
  '> [00:00:09] latency: 128ms — OK',
  '> [00:00:10] epoch.settle — PAID ✓',
  '> [00:00:11] epoch.start — #00143',
  '> [00:00:12] compute.running — 2x H100 active',
  '> [00:00:13] sats.stream — 1,240 sats/epoch',
];

export default function ConsoleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [lines, setLines] = useState(INITIAL_LINES);
  const [started, setStarted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      onEnter: () => setStarted(true),
      once: true,
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i < LIVE_LINES.length) {
        const nextLine = LIVE_LINES[i];
        if (typeof nextLine === 'string') {
          setLines((prev) => [...prev, nextLine]);
        }
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [started]);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: isMobile ? '80px 24px' : '120px 32px',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '64px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '72px', color: 'var(--bg-border)', lineHeight: 1 }}>04</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.9 }}>
            LIVE CONSOLE
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '32px' }}>
          {/* Agent Log - full width */}
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                letterSpacing: '0.08em',
                marginBottom: '12px',
              }}
            >
              AGENT LOG
            </div>
            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--bg-border)',
                borderRadius: '6px',
                padding: '20px',
                height: isMobile ? '240px' : '480px',
                overflowY: 'auto',
              }}
            >
              {lines.map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    lineHeight: 1.8,
                    color:
                      typeof line === 'string' && line.includes('✓')
                        ? 'var(--accent-green)'
                        : 'var(--text-mono)',
                  }}
                >
                  {typeof line === 'string' ? line : ''}
                </div>
              ))}
              <span className="cursor-blink" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-mono)' }}>_</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
