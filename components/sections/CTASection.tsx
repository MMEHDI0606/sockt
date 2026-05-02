'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const LINES = ['WIRE YOUR', 'AGENT IN', '< 5 MINUTES.'];

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);

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
        padding: '120px 32px',
        borderTop: '1px solid var(--bg-border)',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--text-hero)',
          fontWeight: 800,
          lineHeight: 0.92,
          color: 'var(--text-primary)',
          marginBottom: '56px',
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

      <div className="cta-sub" style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href="#"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '15px',
            backgroundColor: 'var(--accent-btc)',
            color: 'var(--bg-void)',
            padding: '14px 32px',
            borderRadius: '4px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
          Open Lightning Channel →
        </a>
        <a
          href="#"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '15px',
            color: 'var(--text-secondary)',
            border: '1px solid var(--bg-border)',
            padding: '14px 32px',
            borderRadius: '4px',
            letterSpacing: '0.04em',
            display: 'inline-block',
            cursor: 'pointer',
          }}
        >
          Read the Docs →
        </a>
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
        No card. No account. Just sats.
      </span>
    </section>
  );
}
