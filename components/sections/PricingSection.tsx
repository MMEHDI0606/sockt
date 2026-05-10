'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

const TIERS = [
  {
    name: 'NANO',
    vcpu: '0.25',
    ram: '256 MB',
    satsPerSecond: '0.5',
    borderStyle: '2px solid var(--accent-btc)',
    accentColor: 'var(--accent-green)',
  },
  {
    name: 'MICRO',
    vcpu: '1',
    ram: '1 GB',
    satsPerSecond: '2',
    borderStyle: '2px solid var(--accent-btc)',
    accentColor: 'var(--accent-green)',
  },
  {
    name: 'STANDARD',
    vcpu: '2-4',
    ram: '4-8 GB',
    satsPerSecond: '4',
    borderStyle: '2px solid var(--accent-btc)',
    accentColor: 'var(--accent-green)',
  },
  {
    name: 'RTX 5090',
    vcpu: '4 + RTX 5090',
    ram: '16 GB',
    satsPerSecond: '8',
    borderStyle: '2px solid var(--accent-btc)',
    accentColor: 'var(--accent-green)',
  },
  {
    name: 'A100',
    vcpu: '8 + A100',
    ram: '40-80 GB',
    satsPerSecond: '15',
    borderStyle: '2px solid var(--accent-btc)',
    accentColor: 'var(--accent-green)',
  },
];

const ROWS = [
  { key: 'vcpu', label: 'vCPU' },
  { key: 'ram', label: 'RAM' },
  { key: 'satsPerSecond', label: 'Sats / sec' },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pricing-card', {
        scale: 0.9,
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="pricing"
      ref={sectionRef}
      style={{
        padding: isMobile ? '80px 24px' : '120px 64px',
        maxWidth: '1280px',
        margin: '0 auto',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '64px' }}>
          {/* <span style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? '48px' : '72px', color: 'var(--bg-border)', lineHeight: 1 }}>05</span> */}
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.9 }}>
            PRICING
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)',
            gap: '12px',
            alignItems: 'stretch',
          }}
        >
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className="pricing-card"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: tier.borderStyle,
                borderRadius: '6px',
                padding: isMobile ? '24px 20px' : '28px 24px',
              }}
              onMouseEnter={(e) => {
                gsap.to(e.currentTarget, { y: -4, duration: 0.2 });
              }}
              onMouseLeave={(e) => {
                gsap.to(e.currentTarget, { y: 0, duration: 0.2 });
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: tier.accentColor,
                  letterSpacing: '0.1em',
                  marginBottom: '24px',
                }}
              >
                {tier.name}
              </h3>

              {ROWS.map((row) => (
                <div
                  key={row.key}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    padding: '9px 0',
                    borderBottom: '1px solid var(--bg-border)',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: row.key === 'satsPerSecond' ? tier.accentColor : 'var(--text-primary)',
                      textAlign: 'right',
                    }}
                  >
                    {(tier as any)[row.key]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
