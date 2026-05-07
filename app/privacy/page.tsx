import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-void)',
        color: 'var(--text-primary)',
        padding: '120px 24px 64px',
      }}
    >
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '20px' }}>
          Privacy Policy
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
          Sockt collects only the data necessary to operate and secure the service, including authentication,
          usage, and billing metadata.
        </p>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
          We do not sell personal data. For privacy requests, contact hello@sockt.dev.
        </p>
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--accent-btc)',
            letterSpacing: '0.06em',
          }}
        >
          ← BACK TO HOME
        </Link>
      </div>
    </main>
  );
}
