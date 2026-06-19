import Link from 'next/link';

export default function TermsPage() {
  const pStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' };
  const h2Style: React.CSSProperties = { fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '16px', marginTop: '48px', color: 'var(--text-primary)' };
  const ulStyle: React.CSSProperties = { fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px', paddingLeft: '24px', listStyleType: 'disc' };

  return (
     <main style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, rgba(194, 122, 54, 0.12), transparent 30%), linear-gradient(180deg, var(--bg-void), var(--bg-surface))', color: 'var(--text-primary)', padding: '120px 24px 64px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '20px' }}>Terms & Conditions</h1>
        <p style={{ ...pStyle, fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        <p style={pStyle}>Welcome to Sockt. By accessing or using our website, workspace integrations, and platform services, you agree to comply with and be bound by these Terms. If you do not agree, please do not use our services.</p>

        <h2 style={h2Style}>1. Description of Service</h2>
        <p style={pStyle}>Sockt provides AI workforce orchestration software, Slack integrations, memory systems, and related tooling for coordinating AI employee swarms. Some services may be self-hosted, while paid plans may include managed hosting and fleet intelligence features.</p>

        <h2 style={h2Style}>2. Account Security</h2>
        <ul style={ulStyle}>
          <li>You must provide accurate and complete information when creating an account.</li>
          <li>You are responsible for safeguarding your account credentials and workspace permissions.</li>
          <li>You are responsible for activity that occurs under your account and should contact us immediately if you suspect unauthorized access.</li>
        </ul>

        <h2 style={h2Style}>3. Acceptable Use</h2>
        <p style={pStyle}>You agree not to use Sockt for unlawful, prohibited, or malicious activities. This includes deploying agents for abuse, distributing malware, or violating applicable law.</p>

        <h2 style={h2Style}>4. Billing and Payments</h2>
        <p style={pStyle}>Some features are provided for a fee. Paid services may be billed through subscriptions or other payment processors. Fees are non-refundable unless required by law or expressly stated otherwise.</p>

        <h2 style={h2Style}>5. Intellectual Property</h2>
        <p style={pStyle}>You retain ownership of your content and outputs. Sockt retains ownership of the platform, documentation, and related intellectual property.</p>

        <h2 style={h2Style}>6. Disclaimers</h2>
        <p style={pStyle}>Sockt is provided on an as-is and as-available basis without warranties of any kind. We are not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the service.</p>

        <h2 style={h2Style}>7. Termination</h2>
        <p style={pStyle}>We may suspend or terminate access if you violate these terms or use the service in a way that threatens the platform or other users.</p>

        <h2 style={h2Style}>8. Changes</h2>
        <p style={pStyle}>We may modify these terms from time to time. Continued use of the service after changes are posted constitutes acceptance of the updated terms.</p>

        <p style={{ ...pStyle, marginTop: '48px' }}>For support or legal inquiries, contact <a href="mailto:hello@sockt.dev" style={{ color: 'var(--accent-btc)', textDecoration: 'underline' }}>hello@sockt.dev</a>.</p>

        <Link href="/" style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--accent-btc)', letterSpacing: '0.06em', display: 'inline-block', marginTop: '24px' }}>← BACK TO HOME</Link>
      </div>
    </main>
  );
}
