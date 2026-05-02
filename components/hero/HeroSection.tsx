'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import HeroTicker from './HeroTicker';
import HeroConsole from './HeroConsole';

const HEADLINE = ['COMPUTE', 'FOR AGENTS', 'THAT PAY IN SATS.'];

export default function HeroSection() {
  const headlineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const chevronRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Headline stagger entry
    gsap.from(headlineRefs.current.filter(Boolean), {
      y: 120,
      opacity: 0,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.1,
      delay: 0.2,
    });

    // Chevron bounce loop
    if (chevronRef.current) {
      gsap.to(chevronRef.current, {
        y: 6,
        duration: 1.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  return (
    <section
      style={{
        minHeight: '100vh',
        paddingTop: '56px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <HeroTicker />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 32px 120px',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '48px',
            alignItems: 'flex-start',
          }}
        >
          {/* Headline */}
          <div style={{ flex: 1 }}>
            {HEADLINE.map((line, i) => (
              <div
                key={i}
                ref={(el) => { headlineRefs.current[i] = el; }}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--text-hero)',
                  fontWeight: 800,
                  lineHeight: 0.92,
                  color: i === 2 ? 'var(--accent-btc)' : 'var(--text-primary)',
                  marginBottom: i < 2 ? '4px' : '0',
                  display: 'block',
                }}
              >
                {line}
              </div>
            ))}

            {/* Tagline */}
            <p
              style={{
                marginTop: '32px',
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                maxWidth: '480px',
              }}
            >
              Autonomous AI infrastructure. Agents procure GPU resources, settle in milliseconds
              via Lightning, and scale without human intervention.
            </p>

            {/* CTA */}
            <div style={{ marginTop: '40px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <a
                href="#"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  backgroundColor: 'var(--accent-btc)',
                  color: 'var(--bg-void)',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-block',
                }}
              >
                Deploy your first agent →
              </a>
              <a
                href="#"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.04em',
                }}
              >
                Read the docs
              </a>
            </div>
          </div>

          {/* Console */}
          <HeroConsole />
        </div>
      </div>

      {/* Scroll chevron */}
      <div
        ref={chevronRef}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: 0.4,
          color: 'var(--text-secondary)',
          fontSize: '20px',
          cursor: 'pointer',
        }}
      >
        ↓
      </div>
    </section>
  );
}
