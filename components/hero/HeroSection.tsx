'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import HeroConsole from './HeroConsole';
import { useIsMobile } from '@/hooks/useIsMobile';

const HEADLINE_TEXT = 'COMPUTE FOR AGENTS THAT PAY IN SATS.';
const TAGLINE = 'Sockt gives agents the compute they can pay for autonomously — open a Lightning channel, get a GPU, settle in sats. No human in the loop. Any Lightning wallet, including your own MCP-connected wallet, works out of the box.';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const headlineNodes = sectionRef.current?.querySelectorAll('.hero-headline-line');
    gsap.from(headlineNodes || [], {
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

    return () => {};
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        paddingTop: '67px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          padding: isMobile ? '48px 24px 80px' : '80px 32px 120px',
          maxWidth: '1280px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '32px' : '48px',
            alignItems: 'flex-start',
          }}
        >
          {/* Headline */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              className="hero-headline-line"
              style={{
                fontFamily: 'var(--font-display)',
                // 0.8x headline scale versus prior values for better viewport fit.
                fontSize: isMobile ? 'clamp(2.1rem, 8vw, 4rem)' : 'clamp(3.2rem, 8vw, 7.2rem)',
                fontWeight: 800,
                lineHeight: 0.96,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                maxWidth: isMobile ? '100%' : '760px',
                textWrap: 'balance',
              }}
            >
              {HEADLINE_TEXT.split(/(SATS\.)/).map((part, i) => (
                <span key={i} style={part === 'SATS.' ? { color: 'var(--accent-btc)' } : undefined}>
                  {part}
                </span>
              ))}
            </h1>

            {/* Tagline */}
            <p
              style={{
                marginTop: isMobile ? '24px' : '32px',
                fontFamily: 'var(--font-body)',
                fontSize: isMobile ? '15px' : '18px',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                maxWidth: isMobile ? '100%' : '620px',
              }}
            >
              {TAGLINE}
            </p>

            {/* CTA */}
            <div style={{ marginTop: '40px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <a
                href="https://sockt.dev/mcp"
                target="_blank"
                rel="noopener noreferrer"
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
                Agent pays for its own sandbox →
              </a>
              <a
                href="/flow"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.04em',
                }}
              >
                See the flow →
              </a>
            </div>

            <div
              style={{
                marginTop: '14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                letterSpacing: '0.05em',
              }}
            >
              Any Lightning wallet can be added as an MCP server — or use api_key fallback.
            </div>
          </div>

          {/* Console */}
          {!isMobile && <HeroConsole />}
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
