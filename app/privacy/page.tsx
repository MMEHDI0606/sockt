import Link from 'next/link';

export default function PrivacyPage() {
  const pStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' };
  const h2Style: React.CSSProperties = { fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '16px', marginTop: '48px', color: 'var(--text-primary)' };
  const ulStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px', paddingLeft: '24px', listStyleType: 'disc' };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-void)', color: 'var(--text-primary)', padding: '120px 24px 64px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '20px' }}>Privacy Policy</h1>
        <p style={{ ...pStyle, fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        <p style={pStyle}>Sockt takes privacy seriously. This policy explains how we collect, use, disclose, and safeguard information when you use our website and platform.</p>

        <h2 style={h2Style}>1. Information We Collect</h2>
        <ul style={ulStyle}>
          <li><strong>Account information:</strong> name, email address, and workspace details when you register or contact support.</li>
          <li><strong>Usage and service data:</strong> metadata related to workspace activity, feature usage, and access logs to keep the platform stable and secure.</li>
          <li><strong>Billing information:</strong> payment details processed securely by our payment processors. We do not store full card numbers on our servers.</li>
        </ul>

        <h2 style={h2Style}>2. How We Use Information</h2>
        <p style={pStyle}>We use information to provide and improve the service, secure accounts, process payments, monitor platform health, and communicate with you about updates or support requests.</p>

        <h2 style={h2Style}>3. Sharing</h2>
        <p style={pStyle}>We do not sell your personal data. We may share information with trusted service providers that help us operate the platform, and with authorities when required by law.</p>

        <h2 style={h2Style}>4. Security</h2>
        <p style={pStyle}>We use reasonable administrative, technical, and organizational safeguards to protect your information. No method of transmission or storage is perfectly secure, so we cannot guarantee absolute security.</p>

        <h2 style={h2Style}>5. Your Choices</h2>
        <p style={pStyle}>Depending on your location, you may have rights to access, correct, delete, or restrict processing of your personal data. You can also contact us about account deletion or privacy requests.</p>

        <h2 style={h2Style}>6. Cookies and Local Storage</h2>
        <p style={pStyle}>We use cookies and local storage to maintain sessions, preserve preferences, and keep the site functioning properly.</p>

        <h2 style={h2Style}>7. Changes</h2>
        <p style={pStyle}>We may update this policy over time. Continued use of the service after changes are posted constitutes acceptance of the updated policy.</p>

        <p style={{ ...pStyle, marginTop: '48px' }}>For privacy requests, contact <a href="mailto:hello@sockt.dev" style={{ color: 'var(--accent-btc)', textDecoration: 'underline' }}>hello@sockt.dev</a>.</p>

        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-btc)', letterSpacing: '0.06em', display: 'inline-block', marginTop: '24px' }}>← BACK TO HOME</Link>
      </div>
    </main>
  );
}
