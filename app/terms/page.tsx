import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description:
    'Review Sockt terms and conditions covering platform usage, billing, and service availability.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Sockt Terms and Conditions',
    description: 'Terms for using Sockt autonomous agent compute services.',
    url: '/terms',
    type: 'article',
  },
};

export default function TermsPage() {
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
          Terms & Conditions
        </h1>
        <p style={{ ...pStyle, fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        <p style={pStyle}>
          Welcome to Sockt. By accessing or using our platform, website, and services, you agree to comply with and be bound by the following Terms and Conditions ("Terms"). If you do not agree to these Terms, please do not use our services.
        </p>

        <h2 style={h2Style}>1. Description of Service</h2>
        <p style={pStyle}>
          Sockt provides autonomous agent compute services, developer APIs, and underlying infrastructure for launching and testing sandboxed environments. Our services are provided to developers and teams on a subscription or pay-as-you-go basis.
        </p>

        <h2 style={h2Style}>2. Account Registration and Security</h2>
        <ul style={ulStyle}>
          <li>You must provide accurate and complete information when creating an account.</li>
          <li>You are responsible for maintaining the confidentiality of your account credentials, API keys, and Sandbox tokens.</li>
          <li>You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized access at hello@sockt.dev.</li>
        </ul>

        <h2 style={h2Style}>3. Acceptable Use Policy</h2>
        <p style={pStyle}>
          You agree not to use Sockt services for any unlawful, prohibited, or malicious activities. Prohibited uses include, but are not limited to:
        </p>
        <ul style={ulStyle}>
          <li>Deploying agents that conduct DDoS attacks, network abuse, or illegal scanning.</li>
          <li>Uploading, transmitting, or distributing malware, viruses, or destructive code.</li>
          <li>Engaging in unauthorized cryptocurrency mining without prior consent.</li>
          <li>Violating any applicable local, state, national, or international law.</li>
        </ul>

        <h2 style={h2Style}>4. Billing, Subscriptions, and Payments</h2>
        <p style={pStyle}>
          Certain aspects of the service are provided for a fee. By opting into paid services (such as specific compute tiers or credits), you agree to our pricing and payment terms via our payment processors (e.g., Polar, Stripe). All fees are non-refundable unless otherwise explicitly required by law.
        </p>

        <h2 style={h2Style}>5. Intellectual Property</h2>
        <p style={pStyle}>
          Sockt respects your intellectual property. You retain ownership of all code, data, and configurations you execute within your sandboxes. Conversely, all rights, titles, and interests in the Sockt platform, APIs, underlying architecture, and documentation remain with Sockt.
        </p>

        <h2 style={h2Style}>6. Disclaimers & Limitation of Liability</h2>
        <p style={pStyle}>
          Sockt is provided "AS IS" and "AS AVAILABLE" without warranties of any kind. Under no circumstances shall Sockt, its directors, employees, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of or inability to use the service.
        </p>

        <h2 style={h2Style}>7. Termination</h2>
        <p style={pStyle}>
          We reserve the right to suspend or terminate your account and access to the service at any time, without notice, if you breach these terms or engage in conduct we deem detrimental to our platform or other users.
        </p>

        <h2 style={h2Style}>8. Changes to Terms</h2>
        <p style={pStyle}>
          We may modify these Terms at any time. Significant changes will be communicated via email or an in-platform notification. Your continued use of the service following modifications indicates your acceptance of the updated terms.
        </p>

        <p style={{ ...pStyle, marginTop: '48px' }}>
          For support or legal inquiries, please contact us at <a href="mailto:hello@sockt.dev" style={{ color: 'var(--accent-btc)', textDecoration: 'underline' }}>hello@sockt.dev</a>.
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
