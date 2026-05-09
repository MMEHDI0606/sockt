'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsMobile } from '@/hooks/useIsMobile';

const LINES = ['YOUR AGENT.', 'BUYS ITS OWN', 'COMPUTE.'];

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Char reveal per word line
      const chars = sectionRef.current?.querySelectorAll('.cta-char');
      if (chars) {
        gsap.from(chars, {
          y: '110%',
          duration: 0.7,
          ease: 'expo.out',
          stagger: 0.012,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        });
      }

      gsap.from('.cta-sub', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.6,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '80px 24px' : '120px 64px',
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid var(--bg-border)',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: isMobile ? 'clamp(2.2rem, 11vw, 3.4rem)' : 'var(--text-hero)',
          fontWeight: 800,
          lineHeight: isMobile ? 0.98 : 0.92,
          color: 'var(--text-primary)',
          marginBottom: isMobile ? '36px' : '56px',
        }}
      >
        {LINES.map((line, li) => (
          <div key={li} style={{ display: 'block', overflow: 'hidden' }}>
            {line.split('').map((char, ci) => (
              <span
                key={ci}
                className="cta-char"
                style={{ display: 'inline-block' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
            <br />
          </div>
        ))}
      </h2>

      <div className="cta-sub" style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
        <Link
          href="/sandbox"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isMobile ? '13px' : '15px',
            backgroundColor: 'var(--accent-btc)',
            color: 'var(--bg-void)',
            padding: isMobile ? '12px 22px' : '14px 32px',
            borderRadius: '4px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
          Create Sandbox →
        </Link>
        <Link
          href="/signup"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isMobile ? '13px' : '15px',
            color: 'var(--text-secondary)',
            border: '1px solid var(--bg-border)',
            padding: isMobile ? '12px 22px' : '14px 32px',
            borderRadius: '4px',
            letterSpacing: '0.04em',
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
          Start with api_key →
        </Link>
      </div>

      <span
        className="cta-sub"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          letterSpacing: '0.08em',
        }}
      >
        Agent autonomously creates a sandbox, pays for compute in sats, runs the task, and terminates.
      </span>
    </section>
  );
}
