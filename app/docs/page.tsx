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
  'Content swarm: builds a weekly content calendar, writes X threads and LinkedIn posts, submits drafts to Slack for approval, then publishes to platform APIs.',
  'Product swarm: turns a request into a structured spec, runs approved tasks, and delivers a consolidated PR.',
  'Ops swarm: catches incidents, correlates history, and drafts the root-cause summary.',
];

const REPO_URL = 'https://github.com/sockt-dev/sockt';

const ossDocs = [
  { title: 'Architecture', body: 'How the packages fit together, the task FSM, the agent execution loop, the memory pipeline.', href: `${REPO_URL}/blob/main/docs/ARCHITECTURE.md` },
  { title: 'API Reference', body: 'Full orchestrator HTTP API — tasks, agents, approvals, health.', href: `${REPO_URL}/blob/main/docs/API.md` },
  { title: 'Configuration', body: 'Every environment variable, what reads it, and free-tier LLM tuning notes.', href: `${REPO_URL}/blob/main/docs/CONFIGURATION.md` },
  { title: 'Departments & Skills', body: 'The skill index pattern, the .skill file format, and how to add a department.', href: `${REPO_URL}/blob/main/docs/DEPARTMENTS.md` },
  { title: 'Contributing', body: 'Dev setup, repo layout, conventions, and the PR process.', href: `${REPO_URL}/blob/main/CONTRIBUTING.md` },
  { title: 'Security', body: 'Vulnerability reporting and the current sandbox/security boundaries.', href: `${REPO_URL}/blob/main/SECURITY.md` },
];

export default function DocsPage() {
  return (
    <>
      <Nav />
       <main style={{ minHeight: '100vh', padding: '96px 24px 120px', background: 'radial-gradient(circle at top, rgba(194, 122, 54, 0.14), transparent 40%)', color: 'var(--text-primary)' }}>
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

          <section style={{ marginTop: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent-btc)', marginBottom: '10px' }}>Open source</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '8px' }}>Read the code, not just the pitch.</h2>
            <p style={{ margin: '0 0 24px', maxWidth: '68ch', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
              The orchestrator, agent runtime, FSM, memory pipeline, and CLI are all open-core (FSL-1.1-MIT, MIT after 2 years). Full technical docs live in the repo.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {ossDocs.map((doc) => (
                <a
                  key={doc.title}
                  href={doc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lift-card"
                  style={{ display: 'block', border: '1px solid var(--bg-border)', borderRadius: '18px', padding: '20px 22px', background: 'var(--bg-surface)' }}
                >
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', margin: '0 0 8px', color: 'var(--text-primary)' }}>{doc.title} →</h3>
                  <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{doc.body}</p>
                </a>
              ))}
            </div>
            <div style={{ marginTop: '18px' }}>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}>
                Full repo on GitHub →
              </a>
            </div>
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
