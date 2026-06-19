'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';

type BillingMode = 'monthly' | 'annual';

type Tier = {
  name: string;
  monthly: number;
  annual?: number;
  intro: string;
};

const tiers: Tier[] = [
  { name: 'Community Edition', monthly: 0, annual: 0, intro: 'Self-hosted open core for teams that want full control.' },
  { name: 'Starter', monthly: 69, annual: 690, intro: 'One department with managed hosting and quick setup.' },
  { name: 'Professional', monthly: 149, annual: 1490, intro: 'Adds fleet intelligence and optimization automations.' },
  { name: 'Business', monthly: 399, annual: 3990, intro: 'Security, governance, and compliance for growing teams.' },
  { name: 'Agency', monthly: 249, annual: 2490, intro: 'Multi-workspace orchestration with client-ready controls.' },
  { name: 'Enterprise', monthly: 799, annual: 7990, intro: 'Dedicated infrastructure and enterprise-grade operations.' },
];

const addOns = [
  ['Additional Swarm Department', '$75/mo'],
  ['Priority Dream-Cycle (nightly vs. weekly)', '$99/mo'],
  ['Advanced Fleet Segments', '$149/mo'],
  ['Real-Time Escalation via SMS', '$29/mo'],
  ['Custom Integration Build', '$500 one-time'],
  ['Memory Migration (Notion/Confluence/Docs import)', '$250 one-time'],
  ['Annual Audit & Optimization Report', '$1,500/yr'],
  ['EU Data Residency', '$99/mo'],
];

const formatPrice = (amount: number, mode: BillingMode): string => {
  if (amount === 0) {
    return 'Free';
  }
  return mode === 'monthly' ? `$${amount}/mo` : `$${amount}/yr`;
};

export default function PricingPage() {
  const [mode, setMode] = useState<BillingMode>('monthly');

  const visibleTiers = useMemo(
    () =>
      tiers.map((tier) => ({
        ...tier,
        shownPrice: mode === 'monthly' ? tier.monthly : tier.annual ?? Math.round(tier.monthly * 12 * 0.83),
      })),
    [mode],
  );

  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', padding: '96px 24px 120px', color: 'var(--text-primary)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '14px' }}>Pricing</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', lineHeight: 1, letterSpacing: '-0.04em', margin: 0, maxWidth: '13ch' }}>Simple platform pricing. BYOK always.</h1>
          <p style={{ marginTop: '14px', maxWidth: '62ch', fontFamily: 'var(--font-body)', lineHeight: 1.65, color: 'var(--text-secondary)' }}>Pay Sockt for orchestration, pay your model provider directly for inference.</p>

          <div style={{ marginTop: '28px', display: 'inline-flex', border: '1px solid var(--bg-border)', borderRadius: '999px', padding: '4px', background: 'var(--bg-surface)' }}>
            <button
              type="button"
              onClick={() => setMode('monthly')}
              style={{
                border: 'none',
                cursor: 'pointer',
                borderRadius: '999px',
                padding: '8px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                background: mode === 'monthly' ? 'var(--accent-btc)' : 'transparent',
                color: mode === 'monthly' ? 'var(--bg-void)' : 'var(--text-secondary)',
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setMode('annual')}
              style={{
                border: 'none',
                cursor: 'pointer',
                borderRadius: '999px',
                padding: '8px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                background: mode === 'annual' ? 'var(--accent-btc)' : 'transparent',
                color: mode === 'annual' ? 'var(--bg-void)' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Annual
              <span style={{ fontSize: '10px', border: '1px solid currentColor', borderRadius: '999px', padding: '2px 6px' }}>Save 17%</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginTop: '28px' }}>
            {visibleTiers.map((tier) => (
              <article key={tier.name} className="lift-card" style={{ border: '1px solid var(--bg-border)', borderRadius: '20px', padding: '20px', background: 'var(--bg-surface)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '12px' }}>{tier.name}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.7rem', lineHeight: 1, marginBottom: '6px' }}>{formatPrice(tier.shownPrice, mode)}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '10px' }}>+ your own LLM costs</div>
                <p style={{ margin: 0, lineHeight: 1.55, color: 'var(--text-secondary)' }}>{tier.intro}</p>
              </article>
            ))}
          </div>

          <p style={{ marginTop: '18px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }} title="Estimated totals vary by model choice and usage profile.">Footnote: Total spend depends on your selected model and usage volume.</p>

          <section style={{ marginTop: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '34px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '16px' }}>Add-ons</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
              {addOns.map(([name, price]) => (
                <div key={name} className="lift-card" style={{ border: '1px solid var(--bg-border)', borderRadius: '14px', padding: '14px 16px', background: 'var(--bg-surface)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', marginBottom: '6px' }}>{name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-btc)' }}>{price}</div>
                </div>
              ))}
            </div>
          </section>

          <div style={{ marginTop: '42px' }}>
            <Link href="/" style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}>? Back to home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
