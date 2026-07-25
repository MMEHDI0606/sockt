'use client';

import Link from 'next/link';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';

const C = {
  mono:      'var(--font-mono)'      as const,
  body:      'var(--font-body)'      as const,
  headline:  'var(--font-headline)'  as const,
  primary:   'var(--text-primary)'   as const,
  secondary: 'var(--text-secondary)' as const,
  border:    'var(--bg-border)'      as const,
  surface:   'var(--bg-surface)'     as const,
  raised:    'var(--bg-raised)'      as const,
  void:      'var(--bg-void)'        as const,
  green:     'var(--accent-green)'   as const,
};

const wrap: React.CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };

const label = (color: string = C.secondary): React.CSSProperties => ({
  fontFamily: C.mono, fontSize: '11px', letterSpacing: '0.16em',
  textTransform: 'uppercase' as const, color, marginBottom: 20, display: 'block',
});

const TIERS = [
  {
    id: 'community',
    name: 'Community',
    price: '$0',
    period: 'forever',
    tagline: 'One swarm. Private channel. Free forever.',
    cta: 'Self-host free',
    ctaHref: 'https://github.com/sockt-dev/sockt',
    ctaExternal: true,
    highlight: false,
    features: [
      'Full FSM task engine',
      'Full GBrain persistent memory',
      'Secret Vault Proxy',
      'All 3 departments (Growth, Eng Ops, Support)',
      'Human-in-the-loop approval gates',
      'Bring your own API key',
      'Unlimited agent actions',
      'Community support',
    ],
    note: 'FSL-1.1-MIT → converts to MIT after 2 years',
  },
  {
    id: 'launch',
    name: 'Launch',
    price: '$79',
    period: '/mo',
    tagline: 'Small team. Shared channel. One managed swarm.',
    cta: 'Start Launch',
    ctaHref: 'mailto:hello@sockt.dev?subject=Launch plan',
    ctaExternal: false,
    highlight: false,
    features: [
      '1 managed department',
      'Hosted — no Docker, no servers',
      '90-day GBrain memory window',
      'Human-in-the-loop approval gates',
      'Bring your own API key',
      'Unlimited agent actions',
      'Email support',
    ],
    note: null,
  },
  {
    id: 'team',
    name: 'Team',
    price: '$249',
    period: '/mo',
    tagline: 'Full department. Three parallel swarms. Your whole team in control.',
    cta: 'Start Team',
    ctaHref: 'mailto:hello@sockt.dev?subject=Team plan',
    ctaExternal: false,
    highlight: true,
    features: [
      '3 departments running in parallel',
      'TEE-hardened hosting',
      '12-month GBrain memory window',
      'Fleet intelligence (cross-team patterns)',
      'Human-in-the-loop approval gates',
      'Bring your own API key',
      'Unlimited agent actions',
      'Priority support + onboarding call',
    ],
    note: null,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    tagline: 'SOC2 inheritance alone costs $50k+ if you build it yourself.',
    cta: 'Talk to us',
    ctaHref: 'mailto:hello@sockt.dev?subject=Enterprise',
    ctaExternal: false,
    highlight: false,
    features: [
      'Everything in Team',
      'SOC2 Type II ready',
      'HIPAA-eligible configuration',
      'SSO / SAML',
      'Multi-workspace deployments',
      'Dedicated infrastructure',
      'Unlimited memory window',
      'SLA + dedicated support',
    ],
    note: 'From ~$799/mo depending on scope',
  },
];

const ADDONS = [
  { name: 'Extra department', price: '$75/mo' },
  { name: 'Extra admin seat', price: '$35/mo' },
  { name: 'Operator (approve-only)', price: '$15/mo' },
  { name: 'Extra Slack workspace', price: '$39/mo' },
];

const NEVER_PAY = [
  'Token markup — bring your own key, pay Anthropic/OpenAI directly',
  'Per-seat pricing for people who just watch the channel — spectators are free on every plan',
  'FSM task engine — the loop prevention is on every tier, always',
  'GBrain core — persistent memory is not a premium feature',
  'Secret Vault Proxy — credential isolation ships on all plans',
  'Metered agent actions — no surprise bills from high-volume runs',
];

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="7" cy="7" r="7" fill="var(--accent-green)" opacity="0.15" />
      <path d="M4 7l2 2 4-4" stroke="var(--accent-green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main style={{ background: C.void, color: C.primary, paddingBottom: 120 }}>

        {/* ── Hero ── */}
        <section style={{ padding: '140px 24px 80px', textAlign: 'center' }}>
          <div style={wrap}>
            <span style={label()}>Pricing</span>
            <h1 style={{
              fontFamily: C.headline,
              fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              fontWeight: 800,
              lineHeight: 0.96,
              letterSpacing: '-0.045em',
              margin: '0 0 24px',
              color: C.primary,
            }}>
                One swarm, shared by your team.<br />
                <span style={{ color: C.secondary, fontWeight: 200 }}>Pay for operators, not spectators.</span>
            </h1>
            <p style={{
              fontFamily: C.body,
              fontSize: '1.1rem',
              lineHeight: 1.65,
              color: C.secondary,
              maxWidth: '52ch',
              margin: '0 auto',
            }}>
              Invite a swarm into a shared Slack channel. Everyone on your team can watch, react, and benefit — free.
              Pay only for team members who actively steer and configure the swarm.
            </p>
          </div>
        </section>

        {/* ── Tier cards ── */}
        <section style={{ padding: '0 24px 80px' }}>
          <div style={{ ...wrap, maxWidth: 1200 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
              alignItems: 'start',
            }}>
              {TIERS.map((tier) => (
                <div
                  key={tier.id}
                  style={{
                    background: tier.highlight ? C.raised : C.surface,
                    border: `1px solid ${tier.highlight ? 'var(--bg-border)' : 'var(--bg-border-subtle)'}`,
                    borderRadius: 16,
                    padding: '32px 28px',
                    position: 'relative',
                    outline: tier.highlight ? `1.5px solid ${C.border}` : undefined,
                    boxShadow: tier.highlight ? '0 0 0 1px var(--bg-border)' : undefined,
                  }}
                >
                  {tier.highlight && (
                    <div style={{
                      position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                      background: C.primary, color: C.void,
                      fontFamily: C.mono, fontSize: '10px', fontWeight: 700,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      padding: '4px 14px', borderRadius: 999,
                    }}>
                      Most popular
                    </div>
                  )}

                  {/* Tier name */}
                  <p style={{
                    fontFamily: C.mono, fontSize: '11px', letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: C.secondary, margin: '0 0 12px',
                  }}>
                    {tier.name}
                  </p>

                  {/* Price */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                    <span style={{
                      fontFamily: C.headline,
                      fontSize: tier.price === 'Custom' ? '2.4rem' : '3rem',
                      fontWeight: 800,
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                    }}>
                      {tier.price}
                    </span>
                    {tier.period && (
                      <span style={{ fontFamily: C.body, fontSize: '0.95rem', color: C.secondary }}>
                        {tier.period}
                      </span>
                    )}
                  </div>

                  {/* Tagline */}
                  <p style={{
                    fontFamily: C.body, fontSize: '0.82rem', lineHeight: 1.5,
                    color: C.secondary, margin: '0 0 28px', minHeight: '2.8em',
                  }}>
                    {tier.tagline}
                  </p>

                  {/* CTA */}
                  <Link
                    href={tier.ctaHref}
                    target={tier.ctaExternal ? '_blank' : undefined}
                    rel={tier.ctaExternal ? 'noopener noreferrer' : undefined}
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      fontFamily: C.mono, fontSize: '11px', fontWeight: 700,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      padding: '12px 20px',
                      borderRadius: 8,
                      background: tier.highlight ? C.primary : 'transparent',
                      color: tier.highlight ? C.void : C.primary,
                      border: `1px solid ${tier.highlight ? 'transparent' : C.border}`,
                      marginBottom: 28,
                    }}
                  >
                    {tier.cta} →
                  </Link>

                  {/* Divider */}
                  <div style={{ borderTop: `1px solid var(--bg-border-subtle)`, marginBottom: 20 }} />

                  {/* Features */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {tier.features.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <Check />
                        <span style={{ fontFamily: C.body, fontSize: '0.875rem', lineHeight: 1.45, color: C.secondary }}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Note */}
                  {tier.note && (
                    <p style={{
                      fontFamily: C.mono, fontSize: '10px', color: C.secondary,
                      marginTop: 20, opacity: 0.7, letterSpacing: '0.04em',
                    }}>
                      {tier.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Add-ons ── */}
        <section style={{ padding: '0 24px 80px' }}>
          <div style={{ ...wrap, maxWidth: 800 }}>
            <span style={label()}>Add-ons</span>
            <p style={{
              fontFamily: C.headline, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.035em', color: C.primary, margin: '0 0 36px',
            }}>
              Scale only what you need
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
            }}>
              {ADDONS.map((addon) => (
                <div key={addon.name} style={{
                  background: C.surface,
                  border: `1px solid var(--bg-border-subtle)`,
                  borderRadius: 12, padding: '20px 22px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontFamily: C.body, fontSize: '0.9rem', color: C.secondary }}>
                    {addon.name}
                  </span>
                  <span style={{
                    fontFamily: C.mono, fontSize: '12px', fontWeight: 700,
                    color: C.primary, whiteSpace: 'nowrap',
                  }}>
                    {addon.price}
                  </span>
                </div>
              ))}
            </div>
            <p style={{
              fontFamily: C.body, fontSize: '0.85rem', color: C.secondary,
              marginTop: 16, lineHeight: 1.6,
            }}>
              Passive Slack participants — viewers, reactors, and approvers in shared channels — are free on all plans.
              You only pay when you actively manage an agent deployment.
            </p>
          </div>
        </section>

        {/* ── What you never pay for ── */}
        <section style={{ padding: '60px 24px 80px', borderTop: `1px solid var(--bg-border-subtle)` }}>
          <div style={{ ...wrap, maxWidth: 800 }}>
            <span style={label(C.green)}>What you never pay for</span>
            <p style={{
              fontFamily: C.headline, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 700, letterSpacing: '-0.035em', color: C.primary, margin: '0 0 36px',
            }}>
              The safety layer is not a pricing lever
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {NEVER_PAY.map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{
                    fontFamily: C.mono, fontSize: '11px', color: C.green,
                    fontWeight: 700, letterSpacing: '0.04em', marginTop: 2, flexShrink: 0,
                  }}>✕</span>
                  <span style={{ fontFamily: C.body, fontSize: '0.95rem', lineHeight: 1.55, color: C.secondary }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section style={{ padding: '0 24px' }}>
          <div style={{
            ...wrap, maxWidth: 760,
            textAlign: 'center',
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 20, padding: '56px 40px',
          }}>
            <p style={{ fontFamily: C.mono, fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.secondary, marginBottom: 16 }}>
              Not sure where to start
            </p>
            <h2 style={{
              fontFamily: C.headline, fontSize: 'clamp(1.8rem, 4vw, 3rem)',
              fontWeight: 700, letterSpacing: '-0.04em', color: C.primary,
              margin: '0 0 16px', lineHeight: 1.1,
            }}>
              Start free. Upgrade when it pays.
            </h2>
            <p style={{
              fontFamily: C.body, fontSize: '1rem', lineHeight: 1.65,
              color: C.secondary, maxWidth: '44ch', margin: '0 auto 36px',
            }}>
              Community Edition runs everything. When you want managed hosting,
              compliance, or fleet intelligence for your shared channels — that&apos;s when paid plans make sense.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="https://github.com/sockt-dev/sockt"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: C.mono, fontSize: '11px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  background: C.primary, color: C.void,
                  borderRadius: 8, padding: '13px 28px', display: 'inline-block',
                }}
              >
                Self-host free →
              </Link>
              <Link
                href="mailto:hello@sockt.dev?subject=Pricing question"
                style={{
                  fontFamily: C.mono, fontSize: '11px',
                  color: C.secondary,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8, padding: '12px 26px',
                  letterSpacing: '0.06em', display: 'inline-block',
                }}
              >
                Talk to us
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
