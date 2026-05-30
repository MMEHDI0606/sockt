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
          Compute for agents, not for their owners.
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
          Sockt is the first compute infrastructure platform purpose-built for autonomous AI agents. We provide on-demand sandbox environments that agents can pay for directly (via Bitcoin Lightning sats or pre-loaded fiat credits) without credit card authorization flows, KYC re-verification, or human re-approval at the point of compute purchase.
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
            AI agents are becoming economic actors. Every existing compute platform requires a human to be present at the billing layer. Sockt eliminates that requirement through two parallel pathways, both of which give agents full operational autonomy after a single human setup step.
          </p>
        </section>

        {/* Choose your Pathway */}
        <section style={{ marginBottom: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 600,
              marginBottom: '20px',
              color: 'var(--text-primary)',
            }}
          >
            Choose Your Pathway
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            {/* Lightning (Sats) Card */}
            <div
              style={{
                border: '1px solid rgba(194, 122, 54, 0.3)',
                borderRadius: '6px',
                padding: '24px',
                background: 'var(--bg-surface)',
                boxShadow: 'inset 0 0 12px rgba(194, 122, 54, 0.04)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--accent-btc)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                ⚡ PATHWAY 01
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '14px',
                  color: 'var(--text-primary)',
                }}
              >
                Lightning (Sats)
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  marginBottom: '20px',
                }}
              >
                Full financial sovereignty for agents in revenue-generating loops. Agents hold, receive, and spend Bitcoin sats natively.
              </p>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Economic Model</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--text-primary)' }}>Hold & recirculate sats</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Billing Precision</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--text-primary)' }}>Per second in msats</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Initial Setup</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--text-primary)' }}>Connect external wallet MCP</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* API Key (Credits) Card */}
            <div
              style={{
                border: '1px solid var(--bg-border)',
                borderRadius: '6px',
                padding: '24px',
                background: 'var(--bg-surface)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                🔑 PATHWAY 02
              </div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '14px',
                  color: 'var(--text-primary)',
                }}
              >
                API Key (Credits)
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'var(--text-secondary)',
                  marginBottom: '20px',
                }}
              >
                Instant deployment and simplicity. Pre-allocate compute budgets using standard fiat credits, drawing down per request.
              </p>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Economic Model</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--text-primary)' }}>Spend pre-allocated budget</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--bg-border)' }}>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Billing Precision</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--text-primary)' }}>Per-request drawdowns</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>Initial Setup</td>
                    <td style={{ padding: '8px 0', textAlign: 'right', color: 'var(--text-primary)' }}>Pre-load credits in dashboard</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
              { step: '01', title: 'Provision', body: 'The agent calls the Sockt MCP or SDK to spin up a sandbox, CPU or GPU, in under a second.' },
              { step: '02', title: 'Pay', body: 'A Lightning invoice or credits draw down is settled programmatically. Billing is fully autonomous.' },
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

        {/* Why No Credit Cards? */}
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
            Why No Credit Cards?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                }}
              >
                Why Lightning?
              </h3>
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
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  marginBottom: '8px',
                  color: 'var(--text-primary)',
                }}
              >
                Why Pre-Loaded Credits?
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  lineHeight: 1.75,
                  color: 'var(--text-secondary)',
                  maxWidth: '680px',
                }}
              >
                Non-refundable credits are a deliberate feature: they enable upfront compute capacity pre-allocation, align operators with intentional budgeting, mirror how enterprise reserved instances work, and create a natural upgrade path to Lightning. This delivers a seamless gateway for teams wanting simplicity without running Lightning nodes, without sacrificing agent autonomy.
              </p>
            </div>
          </div>
        </section>

        {/* Founders / Team */}
        <section style={{ marginBottom: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              fontWeight: 600,
              marginBottom: '24px',
              color: 'var(--text-primary)',
            }}
          >
            Meet the Founders
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '20px',
              marginBottom: '40px',
            }}
          >
            {[
              {
                name: 'Ali Aan',
                role: 'Founder & CTO',
                pfp: '/alipfp.jfif',
                bio: 'Leading the technical design and orchestration layer for on-demand GPU runtimes and lightning-native settlement mechanics.',
                socials: [
                  { label: 'Twitter / X', url: 'https://x.com/AanBuilds' },
                  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/aliaan/' },
                  { label: 'Website', url: 'https://aliaan.vercel.app' },
                ],
              },
              {
                name: 'Muhammad Mehdi',
                role: 'Co-Founder & CEO',
                pfp: '/mehdipfp.jfif',
                bio: 'Driving the vision for decentralizing agent economies, enabling machines to transact and provision cloud services autonomously.',
                socials: [
                  { label: 'Twitter / X', url: 'https://x.com/SocktDev' },
                  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/muhammad-mehdi-alvi/' },
                  { label: 'Website', url: 'https://mehdisdone.dev' },
                ],
              },
            ].map((member) => (
              <div
                key={member.name}
                style={{
                  border: '1px solid var(--bg-border)',
                  borderRadius: '6px',
                  padding: '24px',
                  background: 'var(--bg-surface)',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '20px',
                  alignItems: 'flex-start',
                }}
              >
                <img
                  src={member.pfp}
                  alt={member.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--accent-btc)',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      marginBottom: '2px',
                    }}
                  >
                    {member.name}
                  </h3>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--accent-btc)',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      marginBottom: '12px',
                    }}
                  >
                    {member.role}
                  </div>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.9rem',
                      lineHeight: 1.55,
                      color: 'var(--text-secondary)',
                      marginBottom: '16px',
                    }}
                  >
                    {member.bio}
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {member.socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--accent-amber)',
                          textDecoration: 'none',
                          borderBottom: '1px solid transparent',
                          transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderBottomColor = 'var(--accent-amber)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderBottomColor = 'transparent'; }}
                      >
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ - structured for Google rich results */}
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
                a: 'Sockt is the first compute infrastructure platform purpose-built for autonomous AI agents. We provide on-demand sandbox environments that agents can pay for directly (via Bitcoin Lightning sats or pre-loaded fiat credits) without credit card authorization flows, KYC re-verification, or human re-approval at the point of compute purchase.',
              },
              {
                q: 'How does billing work?',
                a: 'Two billing models are available. Lightning: pay per second in Bitcoin sats via Lightning invoice; unused balance credited back to the agent\'s wallet. API Key Credits: purchase a fiat credit balance once; the agent draws it down autonomously per request. Credits are non-refundable (treat as compute budget allocation).',
              },
              {
                q: 'Can AI agents pay for compute autonomously?',
                a: 'Yes. Both pathways deliver full agent autonomy post-setup. Lightning: agents settle invoices programmatically over Bitcoin Lightning in milliseconds. API Key Credits: agents draw down a pre-loaded fiat credit balance autonomously per request. In neither case is human approval required after initial setup.',
              },
              {
                q: 'What is the difference between the Lightning and API Key pathways?',
                a: 'Both deliver full agent autonomy post-setup. The difference is financial sovereignty and recirculability. Lightning agents hold and earn sats natively, meaning they can receive payments and recirculate them into compute. API Key agents spend a pre-allocated credit budget. Lightning is the right choice for agents in revenue-generating loops; credits are the right choice for teams wanting simplicity without Lightning infrastructure.',
              },
              {
                q: 'What compute tiers are available?',
                a: 'Sockt offers CPU tiers (Nano, Micro, Standard) and GPU tiers (GPU Small, GPU Large), all billed per second. Pricing is viewable in USD or millisatoshis (msats).',
              },
              {
                q: 'How do I integrate an agent?',
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
