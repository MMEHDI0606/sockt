'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

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

const METRICS = [
  { value: '14,203', label: 'ACTIVE AGENTS' },
  { value: '99.97%', label: 'UPTIME' },
  { value: '2,847', label: 'GPU NODES' },
  { value: '1,240', label: 'SATS/EPOCH' },
  { value: '128 ms', label: 'AVG SETTLE' },
  { value: '4,102', label: 'CHANNELS' },
  { value: '₿ 0.00031', label: 'TOTAL FLOW' },
  { value: 'ONLINE ●', label: 'NET STATUS', green: true },
];

export default function ConsoleSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [lines, setLines] = useState(INITIAL_LINES);
  const [started, setStarted] = useState(false);

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
        padding: '120px 32px',
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

        <div style={{ display: 'flex', gap: '32px' }}>
          {/* Agent Log */}
          <div style={{ flex: '0 0 55%' }}>
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
                height: '360px',
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

          {/* Metrics Panel */}
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
              METRICS PANEL
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2px',
                backgroundColor: 'var(--bg-border)',
                border: '1px solid var(--bg-border)',
                borderRadius: '6px',
                overflow: 'hidden',
              }}
            >
              {METRICS.map((m, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    padding: '20px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'clamp(1.2rem, 2vw, 1.6rem)',
                      fontWeight: 600,
                      color: (m as any).green ? 'var(--accent-green)' : 'var(--text-primary)',
                      lineHeight: 1,
                      marginBottom: '6px',
                    }}
                  >
                    {m.value}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-secondary)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
