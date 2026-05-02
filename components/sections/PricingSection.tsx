'use client';

import { useIsMobile } from '@/hooks/useIsMobile';

const TIERS = [
  {
    name: 'SPARK',
    gpu: 'A10G',
    sats: '420',
    minBudget: '10,000 sats',
    channelType: 'Custodial',
    maxAgents: '1',
    bestFor: 'Prototype agents and early iteration',
    monthlyExample: '~126k sats / month at 10 epochs/day',
    recommended: false,
  },
  {
    name: 'CURRENT',
    gpu: 'A100',
    sats: '840',
    minBudget: '25,000 sats',
    channelType: 'Self-custody opt',
    maxAgents: '10',
    bestFor: 'Production agents with steady throughput',
    monthlyExample: '~252k sats / month at 10 epochs/day',
    recommended: true,
  },
  {
    name: 'CHANNEL',
    gpu: 'H100',
    sats: '1,240',
    minBudget: '50,000 sats',
    channelType: 'Full self-custody',
    maxAgents: 'Unlimited',
    bestFor: 'High-throughput teams and latency-sensitive tasks',
    monthlyExample: '~372k sats / month at 10 epochs/day',
    recommended: false,
  },
];

const ROWS = [
  { key: 'gpu', label: 'GPU Type' },
  { key: 'sats', label: 'Sats / epoch' },
  { key: 'minBudget', label: 'Min budget' },
  { key: 'bestFor', label: 'Best for' },
  { key: 'monthlyExample', label: 'Monthly example' },
  { key: 'channelType', label: 'Channel type' },
  { key: 'mcp', label: 'MCP fallback' },
  { key: 'maxAgents', label: 'Max concurrent agents' },
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
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '72px', color: 'var(--bg-border)', lineHeight: 1 }}>05</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.9 }}>
            PRICING
          </h2>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              style={{
                flex: isMobile ? '1 1 100%' : '0 0 320px',
                backgroundColor: 'var(--bg-surface)',
                border: `1px solid ${tier.recommended ? 'var(--accent-btc)' : 'var(--bg-border)'}`,
                borderRadius: '6px',
                padding: '32px',
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
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--bg-border)',
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
                      maxWidth: '165px',
                    }}
                  >
                    {row.key === 'mcp' ? '✓' : (tier as any)[row.key]}
                  </span>
                </div>
              ))}

              <a
                href="#"
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
            Billing is usage-based per compute epoch. Example: if you run CURRENT for 100 epochs in a week,
            cost is about 84,000 sats. Fallback path uses dashboard-issued api_key and account credits with the same lifecycle visibility.
          </p>
        </div>
      </div>
    </section>
  );
}
