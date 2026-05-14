import Link from 'next/link';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';

export default function UseCasesPage() {
  return (
    <>
      <Nav />
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-void)',
          color: 'var(--text-primary)',
          padding: '120px 24px 64px',
        }}
      >
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              marginBottom: '14px',
            }}
          >
            AI Agent Compute Use Cases
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
              lineHeight: 1.8,
              marginBottom: '24px',
            }}
          >
            Sockt supports autonomous model training, evaluation loops, and batch processing where agents provision compute and settle billing without manual intervention.
          </p>

          <div
            style={{
              border: '1px solid var(--bg-border)',
              backgroundColor: 'var(--bg-surface)',
              borderRadius: '8px',
              padding: '18px 20px',
              marginBottom: '24px',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '10px' }}>
              Typical workflows
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              GPU model training, regression and evaluation pipelines, and high-memory research jobs with per-second billing.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <Link href="/#use-cases" style={linkStyle}>
              View live use-case cards
            </Link>
            <Link href="/docs" style={linkStyleMuted}>
              Integration docs
            </Link>
            <Link href="/pricing" style={linkStyleMuted}>
              Compare tiers
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  backgroundColor: 'var(--accent-btc)',
  color: 'var(--bg-void)',
  padding: '10px 14px',
  borderRadius: '4px',
  letterSpacing: '0.05em',
};

const linkStyleMuted: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  color: 'var(--text-secondary)',
  border: '1px solid var(--bg-border)',
  padding: '10px 14px',
  borderRadius: '4px',
  letterSpacing: '0.05em',
};
