import Link from 'next/link';

export default function TermsPage() {
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
          Terms & Conditions
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '16px' }}>
          By using Sockt, you agree to use the platform responsibly and comply with all applicable laws.
          Usage, billing, and service availability are provided on an as-is basis.
        </p>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
          For support or legal inquiries, contact hello@sockt.dev.
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
