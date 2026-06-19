import Link from 'next/link';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';

const departments = [
  {
    name: 'Growth & Lead Generation',
    roles: 'Social Listening Monitor, Lead Researcher, Outbound Specialist',
    description: 'Watches Reddit, HN, X, and LinkedIn for buying-intent signals, enriches leads, and drafts hyper-personalized outreach. Full automation on identification and enrichment; outbound sends stay gated for human approval by default.',
    target: 'Target: a clean first lead list inside 2 hours.',
  },
  {
    name: 'Product Development',
    roles: 'Product Architect, Coder Agent, QA Tester',
    description: 'Turns a feature request into a structured spec, executes approved steps in an isolated sandbox, runs tests, and delivers a consolidated PR instead of a stream of agent chatter.',
    target: 'Target: 60-80% automation on junior-to-mid dev tickets.',
  },
  {
    name: 'Engineering Operations',
    roles: 'Sentry Monitor, Incident Triager, Documentation Writer',
    description: 'Catches errors, correlates with recent commits and historical incidents, produces a root-cause hypothesis, and self-documents resolutions so the team can move faster the next time.',
    target: 'Target: under 15 minutes from alert to root-cause hypothesis.',
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
      <main style={{ minHeight: '100vh', padding: '96px 24px 120px', background: 'linear-gradient(180deg, var(--bg-void), var(--bg-surface))', color: 'var(--text-primary)' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '14px' }}>Departments</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', lineHeight: 1, letterSpacing: '-0.04em', margin: 0, maxWidth: '12ch' }}>Preconfigured AI departments for the parts of the business that never stop.</h1>
          <p style={{ marginTop: '18px', maxWidth: '76ch', fontFamily: 'var(--font-body)', lineHeight: 1.8, color: 'var(--text-secondary)' }}>All HITL gates default to review-before-risky-actions and full autonomy on safe ones. Sockt is the operating layer, not a chatbot and not a workflow toy.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px', marginTop: '40px' }}>
            {departments.map((department) => (
              <article key={department.name} style={{ border: '1px solid var(--bg-border)', borderRadius: '24px', padding: '24px', background: 'var(--bg-surface)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', margin: 0 }}>{department.name}</h2>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-btc)', margin: '10px 0 14px' }}>{department.roles}</p>
                <p style={{ margin: 0, lineHeight: 1.8, color: 'var(--text-secondary)' }}>{department.description}</p>
                <p style={{ margin: '14px 0 0', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{department.target}</p>
              </article>
            ))}
          </div>

          <section style={{ marginTop: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '20px' }}>Coming soon</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              {comingSoon.map(([name, roles, date]) => (
                <article key={name} style={{ border: '1px solid var(--bg-border)', borderRadius: '20px', padding: '22px', background: 'var(--bg-surface)' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '10px' }}>{date}</div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: 0 }}>{name}</h3>
                  <p style={{ margin: '10px 0 0', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{roles}</p>
                </article>
              ))}
            </div>
          </section>

          <div style={{ marginTop: '48px', display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}>← Back to home</Link>
            <Link href="/pricing" style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}>See pricing</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
