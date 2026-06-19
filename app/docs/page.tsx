import Link from 'next/link';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';

const sections = [
  {
    title: '1. Connect Slack',
    body: 'Install the workspace integration, pick a department, and connect the channels the swarm should watch.',
  },
  {
    title: '2. Seed memory',
    body: 'Answer five setup questions so the swarm knows your ICP, offer, approval rules, and operating context.',
  },
  {
    title: '3. Bring your own key',
    body: 'Connect Anthropic, OpenAI, Azure OpenAI, Google Gemini, or a self-hosted provider. Sockt never adds inference markup.',
  },
  {
    title: '4. Activate',
    body: 'The swarms spin up automatically and begin monitoring channels, coordinating tasks, and writing back into memory.',
  },
];

const examples = [
  'Growth swarm: watches for buying intent, enriches leads, and drafts outbound for approval.',
  'Product swarm: turns a request into a structured spec, runs approved tasks, and delivers a consolidated PR.',
  'Ops swarm: catches incidents, correlates history, and drafts the root-cause summary.',
];

export default function DocsPage() {
  return (
    <>
      <Nav />
      <main style={{ minHeight: '100vh', padding: '96px 24px 120px', background: 'linear-gradient(180deg, var(--bg-void), var(--bg-surface))', color: 'var(--text-primary)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '14px' }}>Docs</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', lineHeight: 1, letterSpacing: '-0.04em', margin: 0, maxWidth: '12ch' }}>Set up a swarm in Slack. Seed it once. Let it compound.</h1>
          <p style={{ marginTop: '18px', maxWidth: '74ch', fontFamily: 'var(--font-body)', lineHeight: 1.8, color: 'var(--text-secondary)' }}>Sockt docs focus on activation, memory, and safe autonomy. The old SDK/MCP-for-payments framing has been retired.</p>

          <section style={{ marginTop: '40px', display: 'grid', gap: '14px' }}>
            {sections.map((section) => (
              <article key={section.title} style={{ border: '1px solid var(--bg-border)', borderRadius: '18px', padding: '20px 22px', background: 'var(--bg-surface)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', margin: 0 }}>{section.title}</h2>
                <p style={{ margin: '10px 0 0', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{section.body}</p>
              </article>
            ))}
          </section>

          <section style={{ marginTop: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '16px' }}>Example workflows</h2>
            <div style={{ display: 'grid', gap: '14px' }}>
              {examples.map((example) => (
                <div key={example} style={{ border: '1px solid var(--bg-border)', borderRadius: '16px', padding: '18px 20px', background: 'var(--bg-surface)', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{example}</div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '16px' }}>Operational guardrails</h2>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              <li>Safe actions can run autonomously; risky actions default to review.</li>
              <li>Keys stay isolated from agent context windows.</li>
              <li>Memory is Git-backed so the team can audit what changed and why.</li>
            </ul>
          </section>

          <div style={{ marginTop: '48px', display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}>← Back to home</Link>
            <Link href="/departments" style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}>See departments</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
