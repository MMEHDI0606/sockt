'use client';

import { useIsMobile } from '@/hooks/useIsMobile';

const TIERS = [
  {
    name: 'NANO',
    vcpu: '0.25',
    ram: '256 MB',
    runtime: 'Firecracker microVM',
    host: 'c2-standard-16 (shared)',
    satsPerSecond: '~0.5',
    recommended: false,
  },
  {
    name: 'MICRO',
    vcpu: '1',
    ram: '1 GB',
    runtime: 'Firecracker microVM',
    host: 'c2-standard-16 (shared)',
    satsPerSecond: '~2',
    recommended: true,
  },
  {
    name: 'STANDARD',
    vcpu: '2-4',
    ram: '4-8 GB',
    runtime: 'Firecracker or dedicated VM',
    host: 'c2-standard-16 / n2-standard-4',
    satsPerSecond: '~8',
    recommended: false,
  },
  {
    name: 'GPU_SMALL',
    vcpu: '4 + T4',
    ram: '16 GB',
    runtime: 'Dedicated VM (full)',
    host: 'n1-standard-8 + T4 GPU',
    satsPerSecond: '~80',
    recommended: false,
  },
  {
    name: 'GPU_LARGE',
    vcpu: '8 + A100',
    ram: '40-80 GB',
    runtime: 'Dedicated VM (full)',
    host: 'a2-highgpu-1g',
    satsPerSecond: '~400',
    recommended: false,
  },
];

const ROWS = [
  { key: 'vcpu', label: 'vCPU' },
  { key: 'ram', label: 'RAM' },
  { key: 'runtime', label: 'Runtime' },
  { key: 'host', label: 'GCP Host' },
  { key: 'satsPerSecond', label: 'Sats / sec' },
];

export default function PricingSection() {
  const isMobile = useIsMobile();
  return (
    <section
      style={{
        padding: isMobile ? '80px 24px' : '120px 32px',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '64px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: isMobile ? '48px' : '72px', color: 'var(--bg-border)', lineHeight: 1 }}>05</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.9 }}>
            PRICING
          </h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', alignItems: 'stretch' }}>
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              style={{
                flex: isMobile ? '1 1 100%' : '1 1 280px',
                backgroundColor: 'var(--bg-surface)',
                border: `1px solid ${tier.recommended ? 'var(--accent-btc)' : 'var(--bg-border)'}`,
                borderRadius: '6px',
                padding: isMobile ? '24px 20px' : '32px',
                boxShadow: tier.recommended ? '0 0 0 1px var(--accent-amber)' : 'none',
                position: 'relative',
              }}
            >
              {tier.recommended && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    backgroundColor: 'var(--accent-btc)',
                    color: 'var(--bg-void)',
                    padding: '3px 12px',
                    borderRadius: '100px',
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  RECOMMENDED
                </span>
              )}

              <h3
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: tier.recommended ? 'var(--accent-btc)' : 'var(--text-primary)',
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
                    padding: '10px 0',
                    borderBottom: '1px solid var(--bg-border)',
                    gap: '10px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: 'var(--text-primary)',
                      textAlign: 'right',
                      maxWidth: isMobile ? '58%' : '165px',
                    }}
                  >
                    {(tier as any)[row.key]}
                  </span>
                </div>
              ))}

              <a
                href="/open-channel"
                style={{
                  display: 'block',
                  marginTop: '28px',
                  textAlign: 'center',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  padding: '12px',
                  borderRadius: '4px',
                  backgroundColor: tier.recommended ? 'var(--accent-btc)' : 'transparent',
                  color: tier.recommended ? 'var(--bg-void)' : 'var(--text-secondary)',
                  border: tier.recommended ? 'none' : '1px solid var(--bg-border)',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                }}
              >
                Open Channel →
              </a>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '28px',
            border: '1px solid var(--bg-border)',
            borderRadius: '6px',
            padding: '16px 18px',
            backgroundColor: 'var(--bg-surface)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            API pricing is sourced from the PRD tier table. Billing accrues by sats/sec with settlement on short intervals
            (10s ticker in the billing engine). Fallback path uses dashboard-issued api_key and account credits with the same lifecycle visibility.
          </p>
        </div>
      </div>
    </section>
  );
}
