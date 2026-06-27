'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';
import SlackMock from '@/components/sections/SlackMock';
import ArchFlow from '@/components/sections/ArchFlow';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sockt.dev';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Sockt',
  url: siteUrl,
  logo: `${siteUrl}/favicon.svg`,
  description: 'AI workforce platform. Preconfigured departmental swarms in Slack with persistent memory, loop prevention, and credential isolation.',
  sameAs: ['https://x.com/socktdev', 'https://github.com/socktdev'],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Sockt',
  url: siteUrl,
  description: 'Sockt deploys preconfigured AI employee swarms into Slack. They coordinate, remember, and compound in intelligence — with built-in loop prevention and credential isolation.',
};

// ─── Design tokens ─────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  page: { color: 'var(--text-primary)', background: 'var(--bg-void)' },
  container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: 'var(--accent-btc)',
    marginBottom: 16,
  },
  divider: { borderTop: '1px solid var(--bg-border)' },
};

const CRISES = [
  {
    n: '01',
    title: 'Runaway cost loops',
    problem: 'Two agents sharing a workspace fall into open-ended ping-pong — burning $200–$3,000 in tokens before anyone notices.',
    fix: 'FSM-enforced task list. Every agent interaction is a discrete, auditable task — not free-form messaging.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="var(--accent-btc)" strokeWidth="1.5"/>
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="var(--accent-btc)" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Amnesiac background jobs',
    problem: 'Scheduled agents skip memory init to avoid contaminating session history. What they learn at 2 AM disappears by 8 AM.',
    fix: 'CADVP protocol. Background agents write to an isolated event stream; a daemon commits verified outputs to GBrain.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="var(--accent-btc)" strokeWidth="1.5"/>
        <path d="M12 7v5l3 3" stroke="var(--accent-btc)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Credential leakage',
    problem: 'Agents holding raw API keys in their context window are exploitable by a single malicious string in any content they process.',
    fix: 'OneCLI Secret Vault Proxy. Real credentials are injected at the host layer — mathematically invisible to the agent\'s context.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="var(--accent-btc)" strokeWidth="1.5"/>
        <path d="M8 11V7a4 4 0 018 0v4" stroke="var(--accent-btc)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="16" r="1.5" fill="var(--accent-btc)"/>
      </svg>
    ),
  },
];

const DEPARTMENTS = [
  {
    name: 'Growth & Lead Gen',
    tag: 'outbound',
    roles: ['Social Listening Monitor', 'Lead Researcher', 'Outbound Specialist'],
    body: 'Finds buying-intent signals on Reddit, HN, and LinkedIn. Enriches leads and drafts hyper-personalized outreach for approval.',
    stat: '70–90% automation on first-contact drafting',
    preview: [
      { agent: true, text: 'Found 3 leads from r/SaaS with high CRM pain. Drafting outreach now.' },
      { agent: false, text: 'Send the top 2.' },
      { agent: true, text: '✓ Sent. 1 held (score 68).' },
    ],
  },
  {
    name: 'Product Development',
    tag: 'engineering',
    roles: ['Product Architect', 'Coder Agent', 'QA Tester'],
    body: 'Turns a feature request into a structured spec, executes approved steps in an isolated sandbox, runs tests, and delivers a consolidated PR.',
    stat: '60–80% automation on junior-to-mid dev tickets',
    preview: [
      { agent: true, text: 'Spec for #47 ready. Awaiting approval before writing code.' },
      { agent: false, text: 'Approved. Go.' },
      { agent: true, text: '✓ PR #48 opened with passing tests.' },
    ],
  },
  {
    name: 'Engineering Ops',
    tag: 'incident response',
    roles: ['Sentry Monitor', 'Incident Triager', 'Docs Writer'],
    body: 'Catches Sentry errors, correlates with recent commits, produces a root-cause hypothesis, and self-documents resolutions.',
    stat: '<15 min from alert to root-cause hypothesis',
    preview: [
      { agent: true, text: '🔔 api/enrich timeout spike. Correlates with 2 AM deploy (#c7a3f).' },
      { agent: true, text: 'Root cause: Apollo rate limit change. Fix queued.' },
      { agent: false, text: 'Ship it.' },
    ],
  },
];

const PRICING_TIERS = [
  {
    name: 'Community',
    price: 'Free',
    sub: 'self-hosted',
    note: '+ LLM costs',
    highlight: false,
    features: ['Full FSM loop prevention', 'Full CADVP memory', 'All 3 departments', 'GBrain (unlimited local)'],
  },
  {
    name: 'Starter',
    price: '$69',
    sub: '/month',
    note: '+ your LLM costs',
    highlight: false,
    features: ['Managed hosting', '1 department', '90-day memory', 'Basic dashboard'],
  },
  {
    name: 'Professional',
    price: '$149',
    sub: '/month',
    note: '+ your LLM costs',
    highlight: true,
    features: ['Fleet intelligence', 'Real-time threat feed', '2 departments', 'Dream-Cycle weekly'],
  },
  {
    name: 'Business',
    price: '$399',
    sub: '/month',
    note: '+ your LLM costs',
    highlight: false,
    features: ['SOC 2 Type II', 'SSO/SCIM', '3 departments', 'Nightly optimization'],
  },
  {
    name: 'Agency',
    price: '$249',
    sub: '/month base',
    note: '+ $39/client workspace',
    highlight: false,
    features: ['Multi-workspace', 'Cross-client skills', 'Agent federation', 'Unlimited staff'],
  },
  {
    name: 'Enterprise',
    price: '$799',
    sub: '/month',
    note: '+ your LLM costs',
    highlight: false,
    features: ['Dedicated TEE', 'HIPAA BAA', 'Custom SLAs', 'Private skill marketplace'],
  },
];

const OSS_MODULES = [
  { name: 'OSS-Orch', desc: 'Hybrid orchestration bridge (Hermes + OpenClaw)' },
  { name: 'OSS-FSM', desc: 'Hierarchical FSM & SQLite task coordination' },
  { name: 'OSS-Memory', desc: 'Local GBrain deduplicator & Git sync' },
  { name: 'OSS-CLI', desc: 'Terminal interface with Docker execution' },
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace('/dashboard');
    });
  }, [router]);

  return (
    <>
      <Script id="org-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <Script id="web-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <Nav />

      <main style={s.page}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section
          style={{
            ...s.container,
            paddingTop: 112,
            paddingBottom: 80,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 56,
              alignItems: 'center',
            }}
          >
            {/* Left */}
            <div>
              <p style={s.label}>AI Workforce Platform</p>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.6rem, 7vw, 5.5rem)',
                  fontWeight: 800,
                  lineHeight: 0.94,
                  letterSpacing: '-0.04em',
                  margin: '0 0 20px',
                  maxWidth: '9ch',
                }}
              >
                Hire an AI team, not an AI tool.
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  color: 'var(--text-secondary)',
                  maxWidth: '52ch',
                  marginBottom: 32,
                }}
              >
                Preconfigured AI departments that live in Slack, share persistent memory, and coordinate safely — with built-in loop prevention, credential isolation, and fleet intelligence.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Link
                  href="/pricing"
                  style={{
                    background: 'var(--accent-btc)',
                    color: 'var(--bg-void)',
                    padding: '13px 26px',
                    borderRadius: 999,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Add to Slack
                </Link>
                <Link
                  href="/departments"
                  style={{
                    border: '1px solid var(--bg-border)',
                    color: 'var(--text-secondary)',
                    padding: '12px 24px',
                    borderRadius: 999,
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  See departments
                </Link>
              </div>
              <div
                style={{
                  marginTop: 24,
                  display: 'flex',
                  gap: 20,
                  flexWrap: 'wrap',
                }}
              >
                {['BYOK — zero token markup', 'Loop prevention (FSM-enforced)', 'Open-core (FSL-1.1-MIT)'].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--text-secondary)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    · {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Slack mock */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <SlackMock />
            </div>
          </div>
        </section>

        {/* ── PROBLEM: THREE CRISES ────────────────────────────────────────── */}
        <section style={{ ...s.container, paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ ...s.divider, paddingTop: 56 }}>
            <p style={s.label}>Why this exists</p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 20,
              }}
            >
              {CRISES.map((c) => (
                <article
                  key={c.n}
                  style={{
                    border: '1px solid var(--bg-border)',
                    borderRadius: 16,
                    padding: '24px',
                    background: 'var(--bg-surface)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--bg-raised)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {c.n}
                  </div>
                  <div style={{ marginBottom: 14 }}>{c.icon}</div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      margin: '0 0 10px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {c.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 14,
                      lineHeight: 1.6,
                      color: 'var(--text-secondary)',
                      margin: '0 0 16px',
                    }}
                  >
                    {c.problem}
                  </p>
                  <div
                    style={{
                      borderTop: '1px solid var(--bg-border)',
                      paddingTop: 14,
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--accent-btc)',
                      lineHeight: 1.5,
                    }}
                  >
                    ✓ {c.fix}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
        <section style={{ ...s.container, paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ ...s.divider, paddingTop: 56 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 56,
                alignItems: 'start',
              }}
            >
              {/* Left: onboarding steps */}
              <div>
                <p style={s.label}>How it works</p>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                    fontWeight: 800,
                    lineHeight: 1.02,
                    letterSpacing: '-0.03em',
                    margin: '0 0 32px',
                  }}
                >
                  Live in Slack in under 10 minutes.
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    ['01', 'Connect Slack', 'OAuth into your workspace. Scopes are minimal and listed.'],
                    ['02', 'Choose a department', 'Growth, Product Dev, or Engineering Ops — each is a preconfigured team.'],
                    ['03', 'Seed memory', 'Answer 5 questions. Seeds GBrain with your ICP, offer, and approval rules.'],
                    ['04', 'Bring your own key', 'Connect Anthropic, OpenAI, Azure, Gemini, or a self-hosted model.'],
                    ['05', 'Swarm activates', 'Agents DM you in Slack. First output within 2 hours.'],
                  ].map(([n, title, body]) => (
                    <div key={n} style={{ display: 'flex', gap: 16 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          color: 'var(--accent-btc)',
                          letterSpacing: '0.1em',
                          minWidth: 26,
                          paddingTop: 2,
                        }}
                      >
                        {n}
                      </div>
                      <div>
                        <div
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            marginBottom: 4,
                          }}
                        >
                          {title}
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 14,
                            color: 'var(--text-secondary)',
                            lineHeight: 1.55,
                          }}
                        >
                          {body}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: architecture diagram */}
              <div>
                <p style={s.label}>Architecture</p>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                    fontWeight: 800,
                    lineHeight: 1.02,
                    letterSpacing: '-0.03em',
                    margin: '0 0 32px',
                  }}
                >
                  Three layers. Everything you need, nothing you don't.
                </h2>
                <ArchFlow />
                <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    ['Execution', 'Agent runs Plan → Act → Observe loops inside a hardware-isolated sandbox, powered by your own LLM key.'],
                    ['Coordination', 'OpenClaw gateway + FSM task list. No horizontal agent messaging — every interaction is a discrete, logged task.'],
                    ['Memory', 'GBrain: Git-backed Markdown knowledge graph. Every decision is auditable and rollback-able.'],
                  ].map(([layer, desc]) => (
                    <div
                      key={layer}
                      style={{
                        border: '1px solid var(--bg-border)',
                        borderRadius: 10,
                        padding: '14px 18px',
                        background: 'var(--bg-surface)',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          color: 'var(--accent-btc)',
                          letterSpacing: '0.08em',
                          marginBottom: 6,
                        }}
                      >
                        {layer}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DEPARTMENTS ──────────────────────────────────────────────────── */}
        <section style={{ ...s.container, paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ ...s.divider, paddingTop: 56 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: 20,
                flexWrap: 'wrap',
                marginBottom: 32,
              }}
            >
              <div>
                <p style={{ ...s.label, marginBottom: 8 }}>Departments</p>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                    fontWeight: 800,
                    lineHeight: 1.02,
                    letterSpacing: '-0.03em',
                    margin: 0,
                  }}
                >
                  Preconfigured for real business workflows.
                </h2>
              </div>
              <Link
                href="/departments"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.06em',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                All departments →
              </Link>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 16,
              }}
            >
              {DEPARTMENTS.map((dept) => (
                <article
                  key={dept.name}
                  style={{
                    border: '1px solid var(--bg-border)',
                    borderRadius: 18,
                    background: 'var(--bg-surface)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Card header */}
                  <div style={{ padding: '20px 20px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 9,
                          color: 'var(--accent-btc)',
                          border: '1px solid var(--accent-btc)',
                          borderRadius: 4,
                          padding: '2px 6px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {dept.tag}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.15rem',
                        fontWeight: 700,
                        margin: '0 0 8px',
                      }}
                    >
                      {dept.name}
                    </h3>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 13.5,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.55,
                        margin: '0 0 12px',
                      }}
                    >
                      {dept.body}
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {dept.roles.map((r) => (
                        <span
                          key={r}
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 10,
                            color: 'var(--text-secondary)',
                            background: 'var(--bg-raised)',
                            border: '1px solid var(--bg-border)',
                            borderRadius: 4,
                            padding: '2px 7px',
                          }}
                        >
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mini Slack preview */}
                  <div
                    style={{
                      margin: '0 12px 12px',
                      borderRadius: 10,
                      background: '#1a1d21',
                      border: '1px solid #2d2d2d',
                      padding: '12px 14px',
                      flex: 1,
                    }}
                  >
                    {dept.preview.map((msg, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: 8,
                          marginBottom: i < dept.preview.length - 1 ? 8 : 0,
                        }}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            background: msg.agent ? '#c27a36' : '#3f3f3f',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 8,
                            color: msg.agent ? '#080808' : '#ccc',
                            fontWeight: 700,
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          {msg.agent ? '{*}' : 'U'}
                        </div>
                        <span
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: 12,
                            color: '#b9b4ae',
                            lineHeight: 1.45,
                          }}
                        >
                          {msg.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Stat */}
                  <div
                    style={{
                      padding: '10px 20px 16px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--accent-btc)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    ↗ {dept.stat}
                  </div>
                </article>
              ))}
            </div>

            {/* Coming soon row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 12,
                marginTop: 12,
              }}
            >
              {[
                { name: 'Marketing Content', when: 'Q3 2026' },
                { name: 'Customer Success', when: 'Q4 2026' },
              ].map((d) => (
                <div
                  key={d.name}
                  style={{
                    border: '1px dashed var(--bg-border)',
                    borderRadius: 16,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                    {d.name}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--bg-border)',
                      borderRadius: 4,
                      padding: '3px 8px',
                    }}
                  >
                    {d.when}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BYOK / SECURITY ──────────────────────────────────────────────── */}
        <section style={{ ...s.container, paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ ...s.divider, paddingTop: 56 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 56,
                alignItems: 'start',
              }}
            >
              <div>
                <p style={s.label}>Bring Your Own Key</p>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                    fontWeight: 800,
                    lineHeight: 1.02,
                    letterSpacing: '-0.03em',
                    margin: '0 0 18px',
                  }}
                >
                  You pay your LLM provider. We never see that line.
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    marginBottom: 28,
                  }}
                >
                  Sockt charges only for orchestration infrastructure — the FSM coordination, GBrain memory, TEE isolation, and fleet intelligence. Your Anthropic or OpenAI bill stays between you and your provider, with zero markup.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    'Anthropic (Claude) — recommended',
                    'OpenAI (GPT-4o / GPT-4o-mini)',
                    'Azure OpenAI',
                    'Google Gemini',
                    'Self-hosted (Ollama, vLLM, LM Studio)',
                  ].map((p) => (
                    <div
                      key={p}
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <span style={{ color: 'var(--accent-green)', flexShrink: 0 }}>✓</span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p style={s.label}>Security Architecture</p>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                    fontWeight: 800,
                    lineHeight: 1.02,
                    letterSpacing: '-0.03em',
                    margin: '0 0 24px',
                  }}
                >
                  No raw credentials in agent context. Ever.
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    {
                      layer: 'TEE Isolation',
                      desc: 'Every agent runs inside AMD SEV-SNP or Intel SGX hardware-encrypted enclaves. Host-level admins — including Sockt — cannot inspect a running container.',
                    },
                    {
                      layer: 'Secret Vault Proxy',
                      desc: 'Agents hold placeholder keys. The SaaS-Proxy intercepts outbound calls, injects real credentials from the vault, and forwards. Credential exfiltration is architecturally impossible.',
                    },
                    {
                      layer: 'Egress Allowlist',
                      desc: 'All outbound traffic routes through a per-customer domain allowlist. DNS covert channels are blocked. Injection attempts are logged and distributed to the fleet within an hour.',
                    },
                    {
                      layer: 'HITL Gates',
                      desc: 'Tier 1 (auto-execute), Tier 2 (approve before send), Tier 3 (never execute). Classification is enforced at the proxy layer — not in the agent\'s reasoning.',
                    },
                  ].map((item) => (
                    <div
                      key={item.layer}
                      style={{
                        border: '1px solid var(--bg-border)',
                        borderLeft: '3px solid var(--accent-btc)',
                        borderRadius: '0 10px 10px 0',
                        padding: '14px 18px',
                        background: 'var(--bg-surface)',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          color: 'var(--accent-btc)',
                          letterSpacing: '0.08em',
                          marginBottom: 6,
                        }}
                      >
                        {item.layer}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FLEET INTELLIGENCE ───────────────────────────────────────────── */}
        <section
          style={{
            ...s.container,
            paddingTop: 64,
            paddingBottom: 64,
          }}
        >
          <div style={{ ...s.divider, paddingTop: 56 }}>
            <p style={s.label}>Fleet Intelligence</p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 40,
                alignItems: 'center',
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                    fontWeight: 800,
                    lineHeight: 1.02,
                    letterSpacing: '-0.03em',
                    margin: '0 0 18px',
                  }}
                >
                  Your agents learn from 200+ deployments, not just yours.
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    maxWidth: '54ch',
                  }}
                >
                  A self-hosted deployment has N=1 data — no baseline, no collective threat intelligence, no proactive API monitoring. Paid tiers connect to a network that gets more valuable as the fleet grows.
                </p>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                {[
                  { metric: '< 60 min', label: 'Threat detection to protection' },
                  { metric: '< 2 hrs', label: 'API change detected across fleet' },
                  { metric: '60–75%', label: 'Token cost reduction by month 3' },
                  { metric: 'Git log', label: 'Full audit trail for every memory write' },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      border: '1px solid var(--bg-border)',
                      borderRadius: 14,
                      padding: '18px 16px',
                      background: 'var(--bg-surface)',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: 'var(--accent-btc)',
                        lineHeight: 1,
                        marginBottom: 8,
                      }}
                    >
                      {item.metric}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────────────── */}
        <section style={{ ...s.container, paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ ...s.divider, paddingTop: 56 }}>
            <p style={s.label}>Pricing</p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: 20,
                flexWrap: 'wrap',
                marginBottom: 32,
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                  fontWeight: 800,
                  lineHeight: 1.02,
                  letterSpacing: '-0.03em',
                  margin: 0,
                  maxWidth: '14ch',
                }}
              >
                Platform pricing. BYOK always.
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: 'var(--text-secondary)',
                  maxWidth: '42ch',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                You pay Sockt for the infrastructure that makes AI agents reliable and smarter over time. You pay your LLM provider directly for inference — no markup, ever.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 10,
              }}
            >
              {PRICING_TIERS.map((tier) => (
                <article
                  key={tier.name}
                  style={{
                    border: tier.highlight
                      ? '1px solid var(--accent-btc)'
                      : '1px solid var(--bg-border)',
                    borderRadius: 18,
                    padding: '20px 18px',
                    background: tier.highlight ? 'var(--bg-raised)' : 'var(--bg-surface)',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  {tier.highlight && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -10,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'var(--accent-btc)',
                        color: 'var(--bg-void)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        padding: '3px 10px',
                        borderRadius: 20,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      MOST POPULAR
                    </div>
                  )}
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: tier.highlight ? 'var(--accent-btc)' : 'var(--text-secondary)',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        marginBottom: 10,
                      }}
                    >
                      {tier.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.9rem',
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {tier.price}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{tier.sub}</span>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--text-secondary)',
                        marginTop: 4,
                      }}
                    >
                      {tier.note}
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid var(--bg-border)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {tier.features.map((f) => (
                      <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--accent-green)', fontSize: 11, flexShrink: 0, marginTop: 1 }}>✓</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <Link
                href="/pricing"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.06em',
                  textDecoration: 'none',
                }}
              >
                Full pricing, add-ons, and annual discounts →
              </Link>
            </div>
          </div>
        </section>

        {/* ── OPEN-CORE ────────────────────────────────────────────────────── */}
        <section style={{ ...s.container, paddingTop: 64, paddingBottom: 64 }}>
          <div style={{ ...s.divider, paddingTop: 56 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 48,
                alignItems: 'start',
              }}
            >
              <div>
                <p style={s.label}>Open-Core</p>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                    fontWeight: 800,
                    lineHeight: 1.02,
                    letterSpacing: '-0.03em',
                    margin: '0 0 18px',
                  }}
                >
                  AI infrastructure shouldn't be a black box.
                </h2>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    marginBottom: 24,
                    maxWidth: '54ch',
                  }}
                >
                  The core orchestration, FSM engine, and memory system are open source under FSL-1.1-MIT — any engineer can verify that the loop-prevention and memory architecture work as described. Self-host on a $20/month VPS, or let us run it.
                </p>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <a
                    href="https://github.com/socktdev"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--accent-btc)',
                      border: '1px solid var(--accent-btc)',
                      borderRadius: 999,
                      padding: '8px 18px',
                      textDecoration: 'none',
                      letterSpacing: '0.06em',
                    }}
                  >
                    GitHub →
                  </a>
                  <Link
                    href="/docs"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--bg-border)',
                      borderRadius: 999,
                      padding: '8px 18px',
                      textDecoration: 'none',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Docs
                  </Link>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {OSS_MODULES.map((mod) => (
                    <div
                      key={mod.name}
                      style={{
                        border: '1px solid var(--bg-border)',
                        borderRadius: 12,
                        padding: '14px 18px',
                        background: 'var(--bg-surface)',
                        display: 'flex',
                        gap: 16,
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 11,
                          color: 'var(--accent-btc)',
                          letterSpacing: '0.08em',
                          minWidth: 86,
                          flexShrink: 0,
                          paddingTop: 1,
                        }}
                      >
                        {mod.name}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                        {mod.desc}
                      </div>
                    </div>
                  ))}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--text-secondary)',
                      padding: '10px 18px',
                      letterSpacing: '0.06em',
                    }}
                  >
                    License: FSL-1.1-MIT → converts to MIT after 2 years
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <section style={{ ...s.container, paddingTop: 64, paddingBottom: 112 }}>
          <div
            style={{
              ...s.divider,
              paddingTop: 80,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 28,
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                fontWeight: 800,
                lineHeight: 0.96,
                letterSpacing: '-0.04em',
                margin: 0,
                maxWidth: '14ch',
              }}
            >
              Launch an AI department this week.
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                maxWidth: '46ch',
                margin: 0,
              }}
            >
              Under 10 minutes to activate. First real output within 2 hours. Your GBrain transfers if you ever need to switch tiers.
            </p>
            <Link
              href="/pricing"
              style={{
                background: 'var(--accent-btc)',
                color: 'var(--bg-void)',
                padding: '15px 36px',
                borderRadius: 999,
                fontFamily: 'var(--font-mono)',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.05em',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Add Sockt to Slack
            </Link>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--text-secondary)',
                margin: 0,
                letterSpacing: '0.06em',
              }}
            >
              Community Edition is free and self-hostable. Paid tiers from $69/month.
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
