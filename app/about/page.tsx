'use client';

import Link from 'next/link';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';
import { useIsMobile } from '@/hooks/useIsMobile';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sockt.dev';

const aboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Sockt',
  url: `${siteUrl}/about`,
  description:
    'Sockt is autonomous AI infrastructure where agents provision compute, pay in Bitcoin Lightning sats, execute tasks, and terminate automatically.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Sockt',
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    description:
      'Sockt provides on-demand compute sandboxes for AI agents with pay-per-second billing settled over the Bitcoin Lightning Network.',
    foundingDate: '2024',
    sameAs: ['https://x.com/socktdev', 'https://github.com/socktdev'],
  },
};

const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  color: 'var(--text-secondary)',
  border: '1px solid var(--bg-border)',
  padding: '8px 14px',
  borderRadius: '4px',
  letterSpacing: '0.05em',
  textDecoration: 'none',
  display: 'inline-block',
};

const accentLinkStyle: React.CSSProperties = {
  ...linkStyle,
  color: 'var(--accent-btc)',
  borderColor: 'var(--accent-btc)',
};

export default function AboutPage() {
  const isMobile = useIsMobile();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <Nav />
      <main
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '80px 24px 120px',
          color: 'var(--text-primary)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--accent-btc)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          ABOUT
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 700,
            lineHeight: 1.15,
            marginBottom: '28px',
            color: 'var(--text-primary)',
          }}
        >
          Compute for agents.<br />Billed per second in sats.
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.05rem',
            lineHeight: 1.75,
            color: 'var(--text-secondary)',
            marginBottom: '48px',
            maxWidth: '680px',
          }}
        >
          Sockt is autonomous AI compute infrastructure. We give AI agents the ability
          to provision on-demand compute sandboxes, pay per second using Bitcoin Lightning
          (msats), execute tasks, and terminate — without human intervention. CPU and GPU tiers available, billed to the second.
        </p>

        {/* Mission */}
        <section style={{ marginBottom: '56px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 600,
              marginBottom: '16px',
              color: 'var(--text-primary)',
            }}
          >
            Our mission
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'var(--text-secondary)',
              maxWidth: '680px',
            }}
          >
            AI agents are becoming the primary operators of software. They need infrastructure
            that matches their nature: instant, autonomous, and economically programmable.
            Sockt eliminates the gap between an agent deciding to run a workload and the compute
            being live and billed — with settlement over Lightning in milliseconds.
          </p>
        </section>

        {/* How it works */}
        <section style={{ marginBottom: '56px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 600,
              marginBottom: '20px',
              color: 'var(--text-primary)',
            }}
          >
            How it works
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              { step: '01', title: 'Provision', body: 'The agent calls the Sockt MCP or SDK to spin up a sandbox — CPU or GPU — in under a second.' },
              { step: '02', title: 'Pay', body: 'A Lightning invoice is generated and settled programmatically. Per-second billing starts immediately.' },
              { step: '03', title: 'Execute', body: 'The agent runs its workload: code execution, data processing, model inference, or agentic subtasks.' },
              { step: '04', title: 'Terminate', body: 'When the task is done, the agent terminates the sandbox. Billing stops. No idle waste.' },
            ].map(({ step, title, body }) => (
              <div
                key={step}
                style={{
                  border: '1px solid var(--bg-border)',
                  borderRadius: '6px',
                  padding: '20px',
                  background: 'var(--bg-surface)',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: 'var(--accent-btc)',
                    letterSpacing: '0.12em',
                    marginBottom: '8px',
                  }}
                >
                  {step}
                </p>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginBottom: '8px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Bitcoin Lightning */}
        <section style={{ marginBottom: '56px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 600,
              marginBottom: '16px',
              color: 'var(--text-primary)',
            }}
          >
            Why Bitcoin Lightning?
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              lineHeight: 1.75,
              color: 'var(--text-secondary)',
              maxWidth: '680px',
            }}
          >
            Traditional payment rails add friction for autonomous agents: credit cards require human
            accounts, bank transfers have daily limits, and both settle in days. The Bitcoin Lightning
            Network settles in milliseconds, supports sub-cent denominations (msats), is programmable
            via standard invoices, and requires no intermediary. This makes it the only payment layer
            that can keep pace with agent-driven compute at scale.
          </p>
        </section>

        {/* FAQ — structured for Google rich results */}
        <section
          style={{
            marginBottom: '56px',
            borderTop: '1px solid var(--bg-border)',
            paddingTop: '56px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--accent-btc)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: '20px',
            }}
          >
            FAQ
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: 700,
              marginBottom: '32px',
              color: 'var(--text-primary)',
            }}
          >
            Frequently asked questions
          </h2>
          <dl style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              {
                q: 'What is Sockt?',
                a: 'Sockt is autonomous AI compute infrastructure. It lets AI agents provision on-demand CPU and GPU sandboxes, pay per second using Bitcoin Lightning (msats), run tasks, and terminate — without human involvement.',
              },
              {
                q: 'How does billing work?',
                a: 'Billing is per second. The agent pays a prepaid balance via Lightning invoice to start the sandbox. When the agent terminates it, the remaining amount is credited back to the agent\'s wallet.',
              },
              {
                q: 'Can AI agents pay for compute autonomously?',
                a: 'Yes. Sockt is designed for agent-native payment flows. Agents settle invoices programmatically over the Bitcoin Lightning Network in milliseconds — no human credit card or approval needed.',
              },
              {
                q: 'What compute tiers are available?',
                a: 'Sockt offers CPU tiers (Nano, Micro, Standard) and GPU tiers (GPU Small, GPU Large), all billed per second. Pricing is viewable in USD or millisatoshis (msats).',
              },
              {
                q: 'How do I integrate Sockt into an agent?',
                a: 'Sockt provides an MCP server and a TypeScript/Python SDK. Agents connect via the Model Context Protocol or import the SDK directly to provision sandboxes and manage compute.',
              },
            ].map(({ q, a }, i, arr) => (
              <div
                key={q}
                style={{
                  borderBottom: i < arr.length - 1 ? '1px solid var(--bg-border)' : 'none',
                  padding: '20px 0',
                }}
              >
                <dt
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  {q}
                </dt>
                <dd
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}
                >
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* CTA links */}
        <section
          style={{
            borderTop: '1px solid var(--bg-border)',
            paddingTop: '40px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.08em',
              marginBottom: '16px',
            }}
          >
            GET STARTED
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <Link href="/docs" style={accentLinkStyle}>Read the Docs</Link>
            <Link href="/#pricing" style={linkStyle}>View Pricing</Link>
            <Link href="/#use-cases" style={linkStyle}>Use Cases</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
