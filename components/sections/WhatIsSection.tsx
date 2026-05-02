'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function WhatIsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

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
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '120px 32px',
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div style={{ display: 'flex', gap: '80px', alignItems: 'flex-start' }}>
        {/* Left: counter + headline */}
        <div ref={leftRef} style={{ flex: '0 0 55%' }}>
          <span
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
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-display)',
              fontWeight: 800,
              lineHeight: 0.9,
              color: 'var(--text-primary)',
            }}
          >
            AGENTS BUY
            <br />
            COMPUTE.
            <br />
            NO HUMANS.
          </h2>
        </div>

        {/* Right: body + chips */}
        <div ref={rightRef} style={{ flex: 1, paddingTop: '16px' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '16px',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              marginBottom: '32px',
            }}
          >
            Sockt is the execution layer where AI agents autonomously provision compute resources,
            open Lightning channels, and stream micropayments per compute epoch — no credit
            cards, no procurement teams, no invoices.
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
              🔒 MCP fallback
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
