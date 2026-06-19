import Link from 'next/link';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';

const tiers = [
  {
    name: 'Community Edition',
    price: 'Free',
    detail: 'Self-hosted, open source',
    intro: 'Full loop prevention, full memory persistence, all three department templates, unlimited local agents, Slack integration.',
    note: 'Est. cost: $35-100/mo (VPS + LLM). True TCO with engineering time: $850-1,300/mo.',
  },
  {
    name: 'Starter',
    price: '$69/mo',
    detail: '+ your own LLM costs',
    intro: 'Managed hosting, one department, 90-day memory retention, basic dashboard, and email support.',
    note: 'Est. total: $99-129/mo.',
  },
  {
    name: 'Professional',
    price: '$149/mo',
    detail: '+ your own LLM costs',
    intro: 'Adds fleet intelligence: real-time integration health alerts, active threat feed, fleet performance benchmarks, real-time model routing, anomaly detection, and LLM deletion certificates.',
    note: 'Est. total: $179-209/mo. Additional admins $39/mo, operators $15/mo.',
  },
  {
    name: 'Business',
    price: '$399/mo',
    detail: '+ your own LLM costs',
    intro: 'Everything in Professional plus inherited SOC 2 Type II, SSO/SCIM, advanced RBAC, audit log export, SIEM integration, custom retention policies, and zero-LLM-retention guarantee.',
    note: '3 departments, nightly optimization. Est. total: $459-499/mo.',
  },
  {
    name: 'Agency',
    price: '$249/mo base',
    detail: '+ $39/client workspace',
    intro: 'First two client workspaces included. Everything in Business plus multi-workspace orchestration, cross-client skill transfer, agent federation, and unlimited internal team seats.',
    note: 'Example: 5 clients = $466-516/mo total; 10 clients = $711-811/mo total.',
  },
  {
    name: 'Enterprise',
    price: '$799/mo',
    detail: '+ your own LLM costs',
    intro: 'Everything in Agency plus HIPAA BAA, custom LLM provider data agreements, dedicated single-tenant TEE instances, full fleet intelligence with custom segments, private skill marketplace, DLP/SIEM advanced integration, 99.5% uptime SLA, and dedicated CSM.',
    note: 'Unlimited everything.',
  },
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

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', padding: '96px 24px 120px', background: 'linear-gradient(180deg, var(--bg-void), var(--bg-surface))', color: 'var(--text-primary)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '14px' }}>Pricing</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', lineHeight: 1, letterSpacing: '-0.04em', margin: 0, maxWidth: '12ch' }}>You pay Sockt for orchestration. You pay your LLM provider directly for inference.</h1>
          <p style={{ marginTop: '18px', maxWidth: '78ch', fontFamily: 'var(--font-body)', lineHeight: 1.8, color: 'var(--text-secondary)' }}>That is the whole model. No token markup, no hidden inference fee, and no payment rail story layered on top of the product.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginTop: '40px' }}>
            {tiers.map((tier) => (
              <article key={tier.name} style={{ border: '1px solid var(--bg-border)', borderRadius: '24px', padding: '24px', background: 'var(--bg-surface)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '14px' }}>{tier.name}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', lineHeight: 1, marginBottom: '8px' }}>{tier.price}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '14px' }}>{tier.detail}</div>
                <p style={{ margin: 0, lineHeight: 1.8, color: 'var(--text-secondary)' }}>{tier.intro}</p>
                <p style={{ margin: '14px 0 0', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{tier.note}</p>
              </article>
            ))}
          </div>

          <section style={{ marginTop: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '20px' }}>Add-ons</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              {addOns.map(([name, price]) => (
                <div key={name} style={{ border: '1px solid var(--bg-border)', borderRadius: '18px', padding: '18px 20px', background: 'var(--bg-surface)' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '8px' }}>{name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-btc)' }}>{price}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '14px' }}>Annual pricing</h2>
            <p style={{ margin: 0, lineHeight: 1.8, color: 'var(--text-secondary)' }}>17% discount, 2 months free: Starter $690/yr, Professional $1,490/yr, Business $3,990/yr, Agency $2,490/yr base (+ per-client unchanged), Enterprise $7,990/yr.</p>
          </section>

          <div style={{ marginTop: '48px' }}>
            <Link href="/" style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}>← Back to home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
