import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Read Sockt privacy policy for data handling, authentication metadata, usage data, and support contact details.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Sockt Privacy Policy',
    description: 'How Sockt handles service data, billing metadata, and privacy requests.',
    url: '/privacy',
    type: 'article',
  },
};

export default function PrivacyPage() {
  const pStyle = { fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' };
  const h2Style = { fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '16px', marginTop: '48px', color: 'var(--text-primary)' };
  const ulStyle = { fontFamily: 'var(--font-body)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px', paddingLeft: '24px', listStyleType: 'disc' };

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
        <p style={{ ...pStyle, fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <p style={pStyle}>
          At Sockt, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our autonomous agent compute services.
        </p>

        <h2 style={h2Style}>1. Information We Collect</h2>
        <ul style={ulStyle}>
          <li><strong>Personal Information:</strong> We collect identifying information such as your name and email address when you register for an account or contact support.</li>
          <li><strong>Usage & Service Data:</strong> We automatically collect metadata related to compute usage, API calls, sandbox configurations, and access logs to maintain platform stability and performance.</li>
          <li><strong>Payment Information:</strong> If you purchase credits or a subscription, billing details are processed securely by our payment processors (e.g., Stripe, Polar). We do not store your full credit card numbers on our servers.</li>
        </ul>

        <h2 style={h2Style}>2. How We Use Your Information</h2>
        <p style={pStyle}>We use the information we collect primarily to provide, maintain, and improve our services. This includes:</p>
        <ul style={ulStyle}>
          <li>Authenticating your account and securing API endpoints.</li>
          <li>Processing transactions and sending billing notices.</li>
          <li>Monitoring system performance and preventing fraudulent or abusive Sandbox activity.</li>
          <li>Communicating with you regarding platform updates, security alerts, and support requests.</li>
        </ul>

        <h2 style={h2Style}>3. Sharing Your Information</h2>
        <p style={pStyle}>
          <strong>We do not sell, trade, or rent your personal data to third parties.</strong> We may share information with trusted service providers who assist us in operating our platform, such as:
        </p>
        <ul style={ulStyle}>
          <li><strong>Authentication & Database Providers:</strong> (e.g., Supabase) to securely manage user authentication and account storage.</li>
          <li><strong>Payment Processors:</strong> To handle billing and subscription mechanisms safely.</li>
          <li><strong>Legal Requirements:</strong> If required by law, subpoena, or other legal processes, we may disclose your information to law enforcement agencies.</li>
        </ul>

        <h2 style={h2Style}>4. Data Security</h2>
        <p style={pStyle}>
          We implement industry-standard security measures, including encryption and secure socket layer (SSL) technology, to protect your data from unauthorized access or alteration. However, no internet transmission or electronic storage method in completely secure; we cannot guarantee its absolute security.
        </p>

        <h2 style={h2Style}>5. Your Rights & Choices</h2>
        <p style={pStyle}>
          Depending on your location (e.g., under GDPR or CCPA), you may have the right to request access to, correction of, or deletion of your personal data. You can manage your account information within your dashboard or request an account deletion by contacting us directly.
        </p>

        <h2 style={h2Style}>6. Cookies and Tracking</h2>
        <p style={pStyle}>
          Sockt uses cookies and local storage mechanisms necessary to maintain user sessions and secure authentication state. You can control cookie preferences in your browser settings, though disabling them may impact your ability to use the dashboard and API services.
        </p>

        <h2 style={h2Style}>7. Changes to this Privacy Policy</h2>
        <p style={pStyle}>
          We may update this policy periodically to reflect changes in our practices or relevant laws. We encourage you to review this page periodically. Continued use of our services after updates are posted constitutes acknowledgement of the changes.
        </p>

        <p style={{ ...pStyle, marginTop: '48px' }}>
          For privacy requests, data deletion, or any questions about this policy, please contact us at <a href="mailto:hello@sockt.dev" style={{ color: 'var(--accent-btc)', textDecoration: 'underline' }}>hello@sockt.dev</a>.
        </p>

        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            color: 'var(--accent-btc)',
            letterSpacing: '0.06em',
            display: 'inline-block',
            marginTop: '24px'
          }}
        >
          ← BACK TO HOME
        </Link>
      </div>
    </main>
  );
}
