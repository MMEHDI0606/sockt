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

export default function WhatIsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState(INITIAL_LINES);
  const [consoleStarted, setConsoleStarted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from([leftRef.current, rightRef.current], {
        y: 80,
        opacity: 0,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          onEnter: () => setConsoleStarted(true),
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!consoleStarted) return;
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
  }, [consoleStarted]);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: isMobile ? '80px 24px' : '120px 64px',
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '40px' : '80px', alignItems: 'center' }}>
        {/* Left: counter + headline + body */}
        <div ref={leftRef} style={{ flex: isMobile ? '1 1 100%' : '0 0 55%' }}>
          {/* <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '72px',
              fontWeight: 400,
              color: 'var(--bg-border)',
              lineHeight: 1,
              display: 'block',
              marginBottom: '24px',
            }}
          >
            01
          </span> */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display)',
              fontWeight: 800,
              lineHeight: 0.9,
              color: 'var(--text-primary)',
              marginBottom: '32px',
            }}
          >
            AGENTS BUY
            <br />
            COMPUTE.
            <br />
            NOT HUMANS.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              marginBottom: '32px',
            }}
          >
            Sockt is the compute layer your agents actually pay for. They open a Lightning channel, provision GPU capacity, and settle per epoch — no human in the loop. Not on Lightning yet? Log in on the website, generate a Sockt api_key, and run the same sandbox lifecycle with credit-based billing.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--accent-sats)',
                border: '1px solid var(--accent-amber)',
                padding: '5px 12px',
                borderRadius: '100px',
                letterSpacing: '0.04em',
              }}
            >
              ⚡ Lightning settled
            </span>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                border: '1px solid var(--bg-border)',
                padding: '5px 12px',
                borderRadius: '100px',
                letterSpacing: '0.04em',
              }}
            >
              🔑 Dashboard api_key, credits billing
            </span>
          </div>
        </div>

        {/* Right: console */}
        <div ref={rightRef} style={{ flex: 1, width: '100%', paddingTop: isMobile ? '0' : '16px' }}>
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
              height: isMobile ? '240px' : '380px',
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
    </section>
  );
}
