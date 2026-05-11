'use client';

import { useState } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

type Tier = {
  name: string;
  usd: string;
  sats: string;
  usdAlt: string;
  satsAlt: string;
  specs: string[];
  gpuBadge?: string;
  gpu?: boolean;
};

const CPU_TIERS: Tier[] = [
  {
    name: 'Nano',
    usd: '$0.000012',
    sats: '14 msats',
    usdAlt: '≈ $0.04 / hr',
    satsAlt: '≈ 51 sats / hr',
    specs: ['1 vCPU', '2 GB RAM'],
  },
  {
    name: 'Micro',
    usd: '$0.000023',
    sats: '29 msats',
    usdAlt: '≈ $0.08 / hr',
    satsAlt: '≈ 103 sats / hr',
    specs: ['2 vCPU', '4 GB RAM'],
  },
  {
    name: 'Micro+',
    usd: '$0.000047',
    sats: '57 msats',
    usdAlt: '≈ $0.17 / hr',
    satsAlt: '≈ 205 sats / hr',
    specs: ['4 vCPU', '8 GB RAM'],
  },
];

const GPU_TIERS: Tier[] = [
  {
    name: 'GPU Small',
    gpu: true,
    gpuBadge: 'RTX 5090',
    usd: '$0.000350',
    sats: '427 msats',
    usdAlt: '≈ $1.26 / hr',
    satsAlt: '≈ 1,539 sats / hr',
    specs: ['NVIDIA RTX 5090', '32 GB GDDR7 VRAM'],
  },
  {
    name: 'GPU Large',
    gpu: true,
    gpuBadge: 'A100',
    usd: '$0.000583',
    sats: '712 msats',
    usdAlt: '≈ $2.10 / hr',
    satsAlt: '≈ 2,565 sats / hr',
    specs: ['NVIDIA A100 PCIe', '80 GB HBM2e VRAM'],
  },
];

export default function PricingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const [isSats, setIsSats] = useState(false);
  const gpuAccent = 'var(--accent-btc)';

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

  const renderTierCard = (tier: Tier) => {
    const accentColor = tier.gpu ? gpuAccent : 'var(--accent-green)';
    const borderColor = tier.gpu ? 'rgba(247, 147, 26, 0.24)' : 'var(--bg-border)';

    return (
      <div
        key={tier.name}
        className="pricing-card"
        style={{
          backgroundColor: 'var(--bg-surface)',
          border: `1px solid ${borderColor}`,
          borderRadius: '4px',
          padding: isMobile ? '22px 20px' : '24px',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100%',
          boxShadow: tier.gpu ? 'inset 0 0 0 1px rgba(247, 147, 26, 0.08)' : 'none',
        }}
        onMouseEnter={(e) => {
          gsap.to(e.currentTarget, { y: -4, duration: 0.2 });
        }}
        onMouseLeave={(e) => {
          gsap.to(e.currentTarget, { y: 0, duration: 0.2 });
        }}
      >
        {tier.gpu ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background:
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(247, 147, 26, 0.02) 3px, rgba(247, 147, 26, 0.02) 4px)',
            }}
          />
        ) : null}

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: accentColor,
              }}
            >
              {tier.name}
            </div>
            {tier.gpuBadge ? (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  padding: '2px 6px',
                  border: `1px solid ${tier.gpu ? 'rgba(247, 147, 26, 0.32)' : 'var(--bg-border)'}`,
                  borderRadius: '2px',
                  color: accentColor,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {tier.gpuBadge}
              </span>
            ) : null}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: isMobile ? '24px' : '26px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                lineHeight: 1,
                marginBottom: '4px',
              }}
            >
              {isSats ? tier.sats : tier.usd}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
              }}
            >
              per second
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                marginTop: '6px',
                minHeight: '18px',
              }}
            >
              {isSats ? tier.satsAlt : tier.usdAlt}
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid var(--bg-border)',
              paddingTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {tier.specs.map((spec) => {
              const [lead, ...rest] = spec.split(' ');
              const trailing = rest.join(' ');

              return (
                <div
                  key={spec}
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'flex-start',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>-</span>
                  <span>
                    <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{lead}</strong>
                    {trailing ? ` ${trailing}` : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

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
        <div style={{ marginBottom: '48px' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--accent-btc)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                display: 'block',
                width: '24px',
                height: '1px',
                background: 'var(--accent-btc)',
              }}
            />
            Pricing
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? 'clamp(28px, 10vw, 38px)' : 'clamp(32px, 4vw, 42px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              color: 'var(--text-primary)',
              marginBottom: '16px',
            }}
          >
            Pay per second.<br />In USD or sats.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: '540px',
            }}
          >
            Billing starts when a sandbox is created and stops the moment it terminates. No minimums, no seats, no idle charges. Agents pay exactly for what they use.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '48px',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.08em',
              color: isSats ? 'var(--text-secondary)' : 'var(--text-primary)',
            }}
          >
            USD
          </span>
          <label
            style={{
              position: 'relative',
              width: '52px',
              height: '28px',
              cursor: 'pointer',
              display: 'inline-flex',
            }}
          >
            <input
              type="checkbox"
              checked={isSats}
              onChange={() => setIsSats((current) => !current)}
              style={{
                opacity: 0,
                width: 0,
                height: 0,
                position: 'absolute',
              }}
            />
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                background: isSats ? 'rgba(247, 147, 26, 0.15)' : 'var(--bg-border)',
                border: `1px solid ${isSats ? 'var(--accent-btc)' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '14px',
                transition: 'all 0.3s ease',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: isSats ? '28px' : '4px',
                  width: '18px',
                  height: '18px',
                  background: isSats ? 'var(--accent-btc)' : 'var(--text-secondary)',
                  borderRadius: '50%',
                  transition: 'all 0.3s ease',
                  boxShadow: isSats ? '0 0 12px rgba(247, 147, 26, 0.45)' : 'none',
                }}
              />
            </span>
          </label>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              letterSpacing: '0.08em',
              color: isSats ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            SATS ₿
          </span>
          <div
            style={{
              marginLeft: isMobile ? '0' : 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              display: isMobile ? 'none' : 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            sats floor priced at <span style={{ color: 'var(--accent-btc)' }}>$50,000/BTC</span> — volatile-safe margins
          </div>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--text-secondary)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span>CPU / Sandbox</span>
          <span style={{ flex: 1, height: '1px', background: 'var(--bg-border)' }} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          {CPU_TIERS.map(renderTierCard)}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: gpuAccent,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span>GPU Compute</span>
          <span
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, rgba(247, 147, 26, 0.3), transparent)',
            }}
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
          }}
        >
          {GPU_TIERS.map(renderTierCard)}
        </div>

        <div
          style={{
            marginTop: '48px',
            border: '1px solid var(--bg-border)',
            borderLeft: '2px solid var(--accent-btc)',
            padding: isMobile ? '18px 20px' : '20px 24px',
            background: 'rgba(247, 147, 26, 0.03)',
            borderRadius: '2px',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--accent-btc)',
              marginBottom: '10px',
            }}
          >
            Sats conversion formula
          </div>
          <code
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-primary)',
              display: 'block',
              lineHeight: 1.8,
              whiteSpace: 'normal',
            }}
          >
            USD Amount = (Sats × BTC Price in USD) ÷ 100,000,000
          </code>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              marginTop: '10px',
              lineHeight: 1.6,
            }}
          >
            Sat prices are calculated using a conservative floor of $50,000/BTC to ensure agents are never undercharged during BTC volatility. Current BTC ≈ $81,224. The sat rate will not change with market price — it is fixed at issuance.
          </p>
        </div>
      </div>
    </section>
  );
}
