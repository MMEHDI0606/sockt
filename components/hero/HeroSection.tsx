'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import HeroConsole from './HeroConsole';
import { useIsMobile } from '@/hooks/useIsMobile';

const HEADLINE_TEXT = 'COMPUTE FOR AGENTS, NOT FOR THEIR OWNERS.';
const TAGLINE = 'sockt.dev is the first compute infrastructure platform purpose-built for autonomous AI agents. Agents pay directly — via Bitcoin Lightning sats or pre-loaded fiat credits — without credit card auth flows, KYC re-verification, or human re-approval.';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const headlineNodes = sectionRef.current?.querySelectorAll('.hero-headline-line');
    const animElements = sectionRef.current?.querySelectorAll('.hero-anim-element');

    const tl = gsap.timeline();

    tl.to(headlineNodes || [], {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.1,
      delay: 0.2,
    });

    tl.to(animElements || [], {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'expo.out',
      stagger: 0.1,
    }, "-=0.6");

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

    return () => { };
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: isMobile ? 'auto' : '100vh',
        paddingTop: '67px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <div
        className="flex-1 flex justify-center px-[16px] pt-[24px] pb-[20px] md:px-[64px] md:pt-[80px] md:pb-[120px] max-w-[1280px] mx-auto w-full"
      >
        <div
          className="flex flex-col md:flex-row gap-[24px] md:gap-[80px] items-start w-full"
        >
          {/* Headline */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              className="hero-headline-line text-[clamp(2.1rem,8vw,4rem)] md:text-[clamp(3.2rem,8vw,7.2rem)] max-w-full md:max-w-[760px]"
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                lineHeight: 0.96,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                textWrap: 'balance',
                opacity: 0,
                transform: 'translateY(120px)',
              }}
            >
              {HEADLINE_TEXT.split(/(NOT FOR THEIR OWNERS\.)/).map((part, i) => (
                <span key={i} style={part === 'NOT FOR THEIR OWNERS.' ? { color: 'var(--accent-btc)' } : undefined}>
                  {part}
                </span>
              ))}
            </h1>

            {/* Tagline */}
            <p
              className="mt-[16px] md:mt-[32px] text-[14px] md:text-[18px] max-w-full md:max-w-[620px] hero-anim-element"
              style={{
                fontFamily: 'var(--font-body)',
                lineHeight: isMobile ? 1.55 : 1.8,
                color: 'var(--text-secondary)',
                opacity: 0,
                transform: 'translateY(20px)',
              }}
            >
              {TAGLINE}
            </p>

            {/* CTA */}
            <div className="hero-anim-element" style={{ marginTop: isMobile ? '24px' : '40px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', opacity: 0, transform: 'translateY(20px)' }}>
              <Link
                href="/docs"
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
                View Docs →
              </Link>
              <Link
                href="/about"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  padding: '11px 24px',
                  borderRadius: '4px',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  border: '1px solid var(--text-tertiary)',
                  cursor: 'pointer',
                  display: 'inline-block',
                  transition: 'border-color 0.2s ease',
                }}
              >
                Learn More →
              </Link>
              {/* <Link
                href="/flow"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.04em',
                }}
              >
                See the flow →
              </Link> */}
            </div>

            {!isMobile ? (
              <div
                className="hero-anim-element"
                style={{
                  marginTop: '14px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.05em',
                  opacity: 0,
                  transform: 'translateY(20px)',
                  maxWidth: '620px',
                }}
              >
                Choose your pathway: Lightning (sats) for agent-to-agent economies, or API Key (fiat credits) for instant simplicity. Both deliver full agent autonomy post-setup.
              </div>
            ) : null}
          </div>

          {/* Console */}
          <div className="hidden md:block">
            <HeroConsole />
          </div>
        </div>
      </div>

      {/* Scroll chevron */}
      {!isMobile ? (
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
      ) : null}
    </section>
  );
}
