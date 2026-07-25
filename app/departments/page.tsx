import Link from 'next/link';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';

const departments = [
  {
    name: 'Growth & Lead Generation',
    roles: 'Social listening + outbound drafting',
    description: 'Finds intent signals and drafts personalized outreach for review.',
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
        <circle cx="10" cy="28" r="4" fill="var(--accent-btc)" />
        <circle cx="19" cy="19" r="4" fill="var(--accent-btc)" />
        <circle cx="28" cy="10" r="4" fill="var(--accent-btc)" />
        <path d="M10 28 L19 19 L28 10" stroke="var(--accent-btc)" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    name: 'Product Development',
    roles: 'Spec ? execute ? PR',
    description: 'Turns tickets into scoped execution and returns consolidated PRs.',
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
        <rect x="8" y="8" width="22" height="22" rx="5" fill="none" stroke="var(--accent-btc)" strokeWidth="2" />
        <path d="M14 19h10M19 14v10" stroke="var(--accent-btc)" strokeWidth="2" />
      </svg>
    ),
  },
  {
    name: 'Engineering Operations',
    roles: 'Alert triage + RCA draft',
    description: 'Correlates incidents with history and drafts root-cause summaries.',
    icon: (
      <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
        <path d="M19 8l9 5v12l-9 5-9-5V13l9-5z" fill="none" stroke="var(--accent-btc)" strokeWidth="2" />
        <circle cx="19" cy="19" r="4" fill="var(--accent-btc)" />
      </svg>
    ),
  },
];

const comingSoon = [
  ['Marketing Content', 'Brand Voice Analyst, Content Strategist, Copy Writer, Distribution Coordinator', 'Q3 2026'],
  ['Customer Success', 'Ticket Classifier, Response Drafter, Escalation Manager, Satisfaction Analyst', 'Q4 2026'],
];

export default function DepartmentsPage() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', padding: '96px 24px 120px', color: 'var(--text-primary)' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '14px' }}>Departments</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.1rem, 6vw, 3.8rem)', lineHeight: 1, letterSpacing: '-0.04em', margin: 0, maxWidth: '13ch' }}>Pick a swarm. Invite your team. Start steering.</h1>
          <p style={{ marginTop: '14px', maxWidth: '64ch', fontFamily: 'var(--font-body)', lineHeight: 1.65, color: 'var(--text-secondary)' }}>Each swarm deploys into a shared Slack channel. Your entire team — not just one power user — can watch it work, redirect it, and benefit from its output. Safe actions run automatically. Risky actions default to review.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginTop: '30px' }}>
            {departments.map((department) => (
              <article key={department.name} className="lift-card" style={{ border: '1px solid var(--bg-border)', borderRadius: '18px', padding: '18px', background: 'var(--bg-surface)' }}>
                <div style={{ marginBottom: '10px' }}>{department.icon}</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', margin: 0 }}>{department.name}</h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-btc)', margin: '8px 0 10px' }}>{department.roles}</p>
                <p style={{ margin: 0, lineHeight: 1.5, color: 'var(--text-secondary)' }}>{department.description}</p>
              </article>
            ))}
          </div>

          <section style={{ marginTop: '48px', borderTop: '1px solid var(--bg-border)', paddingTop: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '16px' }}>Coming soon</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {comingSoon.map(([name, roles, date]) => (
                <article key={name} className="lift-card" style={{ border: '1px solid var(--bg-border)', borderRadius: '16px', padding: '16px', background: 'var(--bg-surface)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '8px' }}>{date}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.02rem', margin: 0 }}>{name}</h3>
                  <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{roles}</p>
                </article>
              ))}
            </div>
          </section>

          <div style={{ marginTop: '38px', display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}>? Back to home</Link>
            <Link href="/pricing" style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}>See pricing</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
