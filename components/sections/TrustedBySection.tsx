'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const QUOTES = [
  {
    text: '"The only infrastructure that actually lets agents spend money without a human in the loop."',
    author: '— @autonomy_lab, AI researcher',
  },
  {
    text: '"Sats-native compute is the missing primitive. Sockt fills the gap."',
    author: '— @builder_eth, agent developer',
  },
  {
    text: '"MCP fallback means I ship without fear. My keys, my control, their GPUs."',
    author: '— @void_ptr, systems architect',
  },
];

const LOGOS = ['ANTHROPIC', 'OPENAI', 'DEEPMIND', 'MISTRAL', 'COHERE'];

export default function TrustedBySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.quote-item', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.15,
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
        padding: '120px 32px',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '64px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '72px', color: 'var(--bg-border)', lineHeight: 1 }}>08</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.9 }}>
            TRUSTED BY
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginBottom: '80px' }}>
          {QUOTES.map((q, i) => (
            <div
              key={i}
              className="quote-item"
              style={{ borderLeft: '2px solid var(--bg-border)', paddingLeft: '24px' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  color: 'var(--text-primary)',
                  lineHeight: 1.6,
                  marginBottom: '8px',
                }}
              >
                {q.text}
              </p>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                }}
              >
                {q.author}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            gap: '48px',
            alignItems: 'center',
            justifyContent: 'center',
            borderTop: '1px solid var(--bg-border)',
            paddingTop: '48px',
          }}
        >
          {LOGOS.map((logo) => (
            <span
              key={logo}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--bg-raised)',
                letterSpacing: '0.12em',
                fontWeight: 600,
                filter: 'grayscale(1)',
              }}
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
