'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsMobile } from '@/hooks/useIsMobile';

const PROOF_METRICS = [
  {
    label: 'Median sandbox ready time',
    value: '< 90s (GPU) / < 1s (warm micro)',
  },
  {
    label: 'Billing visibility',
    value: 'Interval-level sats receipts + history endpoint',
  },
  {
    label: 'Lifecycle control',
    value: 'Create, exec, pause, resume, terminate',
  },
];

const OUTCOMES = [
  {
    title: 'Agent teams',
    detail: 'Run paid tasks continuously without adding manual procurement loops.',
  },
  {
    title: 'Infra leads',
    detail: 'Keep control with wallet-native flow plus dashboard-issued api_key fallback in one platform.',
  },
  {
    title: 'Product teams',
    detail: 'Launch pilots quickly, then scale by tier without changing integration patterns.',
  },
];

export default function TrustedBySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.proof-item', {
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
        padding: isMobile ? '80px 24px' : '120px 32px',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '64px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '72px', color: 'var(--bg-border)', lineHeight: 1 }}>08</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.9 }}>
            BY THE NUMBERS
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {PROOF_METRICS.map((metric, i) => (
            <div
              key={i}
              className="proof-item"
              style={{ border: '1px solid var(--bg-border)', borderRadius: '6px', padding: '18px', backgroundColor: 'var(--bg-surface)' }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.06em',
                  display: 'block',
                  marginBottom: '8px',
                }}
              >
                {metric.label}
              </span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: '24px' }}>
          {OUTCOMES.map((item, i) => (
            <div key={i} className="proof-item" style={{ display: 'flex', gap: '14px', padding: '10px 0', borderBottom: i < OUTCOMES.length - 1 ? '1px solid var(--bg-border)' : 'none' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-amber)', minWidth: '118px' }}>
                {item.title.toUpperCase()}
              </span>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
