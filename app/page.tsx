'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';
import SlackMock from '@/components/sections/SlackMock';
import ArchFlow from '@/components/sections/ArchFlow';

// ─── Tokens ────────────────────────────────────────────────────────────────────
const C = {
  mono: 'var(--font-mono)' as const,
  body: 'var(--font-body)' as const,
  display: 'var(--font-display)' as const,
  primary: 'var(--text-primary)' as const,
  secondary: 'var(--text-secondary)' as const,
  muted: 'var(--text-mono)' as const,
  border: 'var(--bg-border)' as const,
  surface: 'var(--bg-surface)' as const,
  raised: 'var(--bg-raised)' as const,
  void: 'var(--bg-void)' as const,
};

const wrap: React.CSSProperties = { maxWidth: 1160, margin: '0 auto', padding: '0 28px' };
const sep: React.CSSProperties = { borderTop: `1px solid ${C.border}` };
const label = (color = C.secondary): React.CSSProperties => ({
  fontFamily: C.mono,
  fontSize: 10,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color,
  marginBottom: 20,
  display: 'block',
});
const h2style: React.CSSProperties = {
  fontFamily: C.display,
  fontSize: 'clamp(2rem, 4vw, 3.8rem)',
  fontWeight: 700,
  lineHeight: 1.04,
  letterSpacing: '-0.035em',
  color: C.primary,
  margin: 0,
};

// ─── Data ──────────────────────────────────────────────────────────────────────
const STATS = [
  { n: '< 10 min', label: 'from sign-up to active swarm' },
  { n: '< 2 hrs', label: 'to first enriched output' },
  { n: '60–75%', label: 'token cost reduction by month 3' },
  { n: 'git log', label: 'audit trail for every memory write' },
];

const CRISES = [
  {
    n: '01',
    problem: 'Runaway cost loops',
    detail: 'Two agents sharing a workspace with no coordination constraints fall into open-ended ping-pong. Token spend reaches $200–$3,000 before a manual spending cap fires — which kills the agent, not the loop.',
    fix: 'Hierarchical FSM + SQLite task list. Every agent interaction is a discrete, auditable task. No horizontal messaging between agents. Loops structurally cannot form.',
  },
  {
    n: '02',
    problem: 'Amnesiac background jobs',
    detail: 'Scheduled cron agents hardcode skip_memory=True to prevent background prompts from contaminating foreground session history. What an agent learns at 2 AM disappears before the 8 AM run.',
    fix: 'CADVP daemon. Background agents write to an isolated JSONL event stream. A host-level monitor intercepts, validates, and commits verified outputs to GBrain under the agent\'s identity.',
  },
  {
    n: '03',
    problem: 'Credential leakage via prompt injection',
    detail: 'Agents holding raw API keys in their active context window are trivially exploitable. A malicious string in any processed content — a Slack message, a GitHub issue, a webpage — can exfiltrate keys to an attacker endpoint.',
    fix: 'OneCLI Secret Vault Proxy. Real credentials live in a host-layer vault, never in agent scope. Agents hold placeholder keys; the proxy injects real credentials at the network layer. A fully-compromised agent has no credentials to exfiltrate.',
  },
];

const DEPARTMENTS = [
  {
    tag: 'growth',
    name: 'Growth & Lead Gen',
    desc: 'Finds buying-intent signals on Reddit, HN, LinkedIn. Enriches leads, drafts hyper-personalized outreach for approval.',
    roles: ['Social Listening Monitor', 'Lead Researcher', 'Outbound Specialist'],
    stat: '70–90% automation on first-contact drafting',
    preview: [
      { a: true, t: 'Found 5 leads from r/SaaS + HN. Top 2 score 91/88. Drafting outreach now.' },
      { a: false, t: 'Send the top 2. Hold the rest.' },
      { a: true, t: '✓ Sent. 1 held (74). 2 discarded. GBrain updated.' },
    ],
  },
  {
    tag: 'product',
    name: 'Product Development',
    desc: 'Turns a ticket into a structured spec, executes approved steps in an isolated sandbox, runs tests, returns a consolidated PR.',
    roles: ['Product Architect', 'Coder Agent', 'QA Tester'],
    stat: '60–80% automation on junior-to-mid dev tickets',
    preview: [
      { a: true, t: 'Spec for #47 ready. 4 steps, 2 architectural decisions need approval.' },
      { a: false, t: 'Approved. Skip the refactor in step 3.' },
      { a: true, t: '✓ PR #48 opened. Tests passing. 1 edge case flagged.' },
    ],
  },
  {
    tag: 'eng ops',
    name: 'Engineering Ops',
    desc: 'Catches Sentry errors, correlates with recent commits, produces a root-cause hypothesis, and self-documents resolutions.',
    roles: ['Sentry Monitor', 'Incident Triager', 'Docs Writer'],
    stat: '< 15 min from alert to root-cause hypothesis',
    preview: [
      { a: true, t: '🔔 Spike on api/enrich. Correlates with 2:14 AM deploy (#c7a3f8).' },
      { a: true, t: 'Root cause: Apollo rate limit changed. Fix queued — approve?' },
      { a: false, t: 'Approved. Ship it.' },
    ],
  },
];

const TIERS = [
  { name: 'Community', price: 'Free', note: '+ LLM costs', badge: null, features: ['Full FSM loop prevention', 'CADVP memory protocol', 'All 3 departments', 'Unlimited GBrain (local)'] },
  { name: 'Starter', price: '$69', note: '/mo + LLM', badge: null, features: ['Managed hosting (no Docker)', '1 department', '90-day retention', 'Email support'] },
  { name: 'Professional', price: '$149', note: '/mo + LLM', badge: 'Most popular', features: ['Fleet intelligence', 'Real-time threat feed', '2 departments', 'Weekly Dream-Cycle'] },
  { name: 'Business', price: '$399', note: '/mo + LLM', badge: null, features: ['SOC 2 Type II', 'SSO / SCIM', '3 departments', 'Nightly optimization'] },
  { name: 'Agency', price: '$249', note: '/mo base + $39/client', badge: null, features: ['Multi-workspace', 'Cross-client skills', 'Agent federation', 'Unlimited staff'] },
  { name: 'Enterprise', price: '$799', note: '/mo + LLM', badge: null, features: ['Dedicated TEE', 'HIPAA BAA', 'Custom SLAs', 'Private skill marketplace'] },
];

const OSS = [
  { name: 'OSS-Orch', desc: 'Hybrid orchestration bridge (Hermes inside OpenClaw)' },
  { name: 'OSS-FSM', desc: 'Hierarchical FSM & SQLite task coordination engine' },
  { name: 'OSS-Memory', desc: 'Local GBrain deduplicator, Git sync, cosine dedupe' },
  { name: 'OSS-CLI', desc: 'Docker-native TUI with onboarding wizard and local model connectors' },
];

// ─── Component ─────────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = createClient();
    s.auth.getUser().then(({ data }) => { if (data.user) router.replace('/dashboard'); });
  }, [router]);

  // Parallax glow on scroll
  useEffect(() => {
    const glow = document.getElementById('hero-glow');
    if (!glow) return;
    const onScroll = () => {
      glow.style.transform = `translateY(${window.scrollY * 0.3}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Nav />
      <main style={{ color: C.primary, background: C.void, overflowX: 'hidden' }}>

        {/* ── HERO ── */}
        <section
          ref={heroRef}
          style={{
            position: 'relative',
            minHeight: '92vh',
            display: 'flex',
            alignItems: 'center',
            paddingTop: 96,
            paddingBottom: 64,
            overflow: 'hidden',
          }}
        >
          {/* Background glow */}
          <div
            id="hero-glow"
            style={{
              position: 'absolute',
              top: -200,
              right: -100,
              width: 700,
              height: 700,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.025) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ ...wrap, width: '100%' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
                gap: '5vw',
                alignItems: 'center',
              }}
              className="hero-grid"
            >
              {/* Left */}
              <div>
                <span style={label()}>AI Workforce Platform</span>
                <h1
                  style={{
                    fontFamily: C.display,
                    fontSize: 'clamp(3rem, 7vw, 7.5rem)',
                    fontWeight: 800,
                    lineHeight: 0.92,
                    letterSpacing: '-0.045em',
                    color: C.primary,
                    margin: '0 0 28px',
                  }}
                >
                  Hire a team.<br />
                  <span style={{ color: C.secondary }}>Not a tool.</span>
                </h1>
                <p
                  style={{
                    fontFamily: C.body,
                    fontSize: '1.08rem',
                    lineHeight: 1.72,
                    color: C.secondary,
                    maxWidth: '50ch',
                    marginBottom: 36,
                  }}
                >
                  Preconfigured AI departments that live in Slack, share persistent memory, and coordinate safely — with structural loop prevention, hardware-isolated execution, and fleet intelligence that learns from every deployment.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
                  <Link
                    href="/pricing"
                    style={{
                      background: C.primary,
                      color: C.void,
                      padding: '13px 28px',
                      borderRadius: 999,
                      fontFamily: C.mono,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      display: 'inline-block',
                      transition: 'opacity 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                  >
                    ADD TO SLACK
                  </Link>
                  <Link
                    href="/departments"
                    style={{
                      border: `1px solid ${C.border}`,
                      color: C.secondary,
                      padding: '12px 26px',
                      borderRadius: 999,
                      fontFamily: C.mono,
                      fontSize: 12,
                      letterSpacing: '0.06em',
                      display: 'inline-block',
                      transition: 'color 0.15s ease, border-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = C.primary; e.currentTarget.style.borderColor = '#46464E'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = C.secondary; e.currentTarget.style.borderColor = C.border; }}
                  >
                    SEE DEPARTMENTS
                  </Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['BYOK — zero token markup', 'Loop prevention (FSM-enforced)', 'Open-core (FSL-1.1-MIT)'].map((t) => (
                    <div
                      key={t}
                      style={{
                        fontFamily: C.mono,
                        fontSize: 10,
                        color: '#44444B',
                        letterSpacing: '0.1em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: '#44444B', flexShrink: 0 }} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <SlackMock />
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.surface }}>
          <div style={{ ...wrap }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: 0,
              }}
            >
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    padding: '28px 24px',
                    borderRight: i < STATS.length - 1 ? `1px solid ${C.border}` : 'none',
                  }}
                >
                  <div
                    style={{
                      fontFamily: C.display,
                      fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      color: C.primary,
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {s.n}
                  </div>
                  <div style={{ fontFamily: C.mono, fontSize: 10, color: C.secondary, letterSpacing: '0.08em' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── THE THREE FAILURES ── */}
        <section style={{ padding: '96px 0' }}>
          <div style={wrap}>
            <span style={label()}>Why this exists</span>
            <h2 style={{ ...h2style, marginBottom: 56, maxWidth: '20ch' }}>
              The three production failures that end AI deployments.
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 1 }}>
              {CRISES.map((c) => (
                <div
                  key={c.n}
                  style={{
                    border: `1px solid ${C.border}`,
                    background: C.surface,
                    padding: '36px 32px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      fontFamily: C.mono,
                      fontSize: 52,
                      fontWeight: 400,
                      color: '#1D1D22',
                      lineHeight: 1,
                      position: 'absolute',
                      top: 28,
                      right: 28,
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {c.n}
                  </div>
                  <div
                    style={{
                      fontFamily: C.display,
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: C.primary,
                      marginBottom: 16,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {c.problem}
                  </div>
                  <p
                    style={{
                      fontFamily: C.body,
                      fontSize: 14,
                      color: C.secondary,
                      lineHeight: 1.7,
                      marginBottom: 24,
                    }}
                  >
                    {c.detail}
                  </p>
                  <div
                    style={{
                      borderTop: `1px solid ${C.border}`,
                      paddingTop: 20,
                      fontFamily: C.mono,
                      fontSize: 11,
                      color: '#6D6D78',
                      lineHeight: 1.55,
                    }}
                  >
                    <span style={{ color: '#EEECE8', marginRight: 6 }}>FIX ›</span>
                    {c.fix}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section style={{ ...sep, padding: '96px 0', background: C.surface }}>
          <div style={wrap}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '6vw',
                alignItems: 'start',
              }}
            >
              {/* Left: steps */}
              <div>
                <span style={label()}>Setup</span>
                <h2 style={{ ...h2style, marginBottom: 40 }}>
                  Live in Slack in under 10 minutes.
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    ['Connect Slack', 'OAuth into your workspace. Scopes are minimal and listed in plain English.'],
                    ['Pick a department', 'Growth, Product Dev, or Eng Ops — each is a preconfigured team with defined roles.'],
                    ['Seed memory', '5 questions. Seeds GBrain with your ICP, offer, channels, and approval rules.'],
                    ['Bring your own key', 'Anthropic, OpenAI, Azure, Gemini, or self-hosted. Your bill, your rates, no markup.'],
                    ['Swarm activates', 'Agents DM you. First real output — leads, PR, or incident triage — within 2 hours.'],
                  ].map(([title, body], i, arr) => (
                    <div
                      key={title}
                      style={{
                        display: 'flex',
                        gap: 0,
                        paddingBottom: i < arr.length - 1 ? 0 : 0,
                      }}
                    >
                      {/* Timeline */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 32, flexShrink: 0 }}>
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            border: `1px solid ${C.border}`,
                            background: C.raised,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: C.mono,
                            fontSize: 9,
                            color: C.secondary,
                            flexShrink: 0,
                          }}
                        >
                          {String(i + 1).padStart(2, '0')}
                        </div>
                        {i < arr.length - 1 && (
                          <div style={{ width: 1, flex: 1, minHeight: 24, background: C.border }} />
                        )}
                      </div>
                      <div style={{ paddingLeft: 16, paddingBottom: 24 }}>
                        <div
                          style={{
                            fontFamily: C.display,
                            fontSize: '1rem',
                            fontWeight: 600,
                            color: C.primary,
                            marginBottom: 6,
                            paddingTop: 3,
                            letterSpacing: '-0.01em',
                          }}
                        >
                          {title}
                        </div>
                        <div style={{ fontFamily: C.body, fontSize: 13.5, color: C.secondary, lineHeight: 1.6 }}>
                          {body}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: arch */}
              <div>
                <span style={label()}>Architecture</span>
                <h2 style={{ ...h2style, marginBottom: 36 }}>
                  Three layers. Everything needed, nothing redundant.
                </h2>
                <ArchFlow />
                <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    { layer: 'Execution', body: 'Hermes agents run Plan→Act→Observe→Reflect loops inside AMD SEV-SNP / Intel SGX enclaves. Powered entirely by your LLM key — no inference markup.' },
                    { layer: 'Coordination', body: 'OpenClaw gateway + FSM task list. No horizontal agent messaging. Every interaction is a discrete, locked, logged task record.' },
                    { layer: 'Memory', body: 'GBrain: Git-backed Markdown knowledge graph. Every decision is immutable, human-readable, diff-able, and rollback-able in under 60 seconds.' },
                  ].map((item) => (
                    <div
                      key={item.layer}
                      style={{
                        border: `1px solid ${C.border}`,
                        padding: '16px 20px',
                        background: C.raised,
                      }}
                    >
                      <div
                        style={{
                          fontFamily: C.mono,
                          fontSize: 10,
                          color: C.primary,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          marginBottom: 7,
                        }}
                      >
                        {item.layer}
                      </div>
                      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6 }}>
                        {item.body}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DEPARTMENTS ── */}
        <section style={{ ...sep, padding: '96px 0' }}>
          <div style={wrap}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                gap: 20,
                flexWrap: 'wrap',
                marginBottom: 48,
              }}
            >
              <div>
                <span style={label()}>Departments</span>
                <h2 style={h2style}>Preconfigured for real workflows.</h2>
              </div>
              <Link
                href="/departments"
                style={{ fontFamily: C.mono, fontSize: 11, color: C.secondary, letterSpacing: '0.08em', whiteSpace: 'nowrap' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.secondary; }}
              >
                ALL DEPARTMENTS →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
              {DEPARTMENTS.map((dept) => (
                <article
                  key={dept.name}
                  className="lift-card"
                  style={{
                    border: `1px solid ${C.border}`,
                    background: C.surface,
                    borderRadius: 16,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Header */}
                  <div style={{ padding: '24px 24px 16px' }}>
                    <div
                      style={{
                        fontFamily: C.mono,
                        fontSize: 9,
                        color: C.secondary,
                        letterSpacing: '0.18em',
                        textTransform: 'uppercase',
                        marginBottom: 12,
                        border: `1px solid ${C.border}`,
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {dept.tag}
                    </div>
                    <h3
                      style={{
                        fontFamily: C.display,
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: C.primary,
                        margin: '0 0 10px',
                      }}
                    >
                      {dept.name}
                    </h3>
                    <p style={{ fontFamily: C.body, fontSize: 13.5, color: C.secondary, lineHeight: 1.6, margin: '0 0 14px' }}>
                      {dept.desc}
                    </p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {dept.roles.map((r) => (
                        <span
                          key={r}
                          style={{
                            fontFamily: C.mono,
                            fontSize: 9,
                            color: '#6D6D78',
                            background: C.raised,
                            border: `1px solid ${C.border}`,
                            borderRadius: 4,
                            padding: '3px 8px',
                            letterSpacing: '0.06em',
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
                      background: '#16181C',
                      border: '1px solid #222428',
                      padding: '12px 14px',
                      flex: 1,
                    }}
                  >
                    {dept.preview.map((m, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, marginBottom: i < dept.preview.length - 1 ? 8 : 0 }}>
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            background: m.a ? '#242428' : '#2A2A2F',
                            border: `1px solid ${m.a ? '#38383E' : '#2A2A2F'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: C.mono,
                            fontSize: 7,
                            color: m.a ? '#A09D98' : '#6D6D78',
                            flexShrink: 0,
                            marginTop: 1,
                          }}
                        >
                          {m.a ? '✦' : 'U'}
                        </div>
                        <span style={{ fontFamily: C.body, fontSize: 11.5, color: '#A09D98', lineHeight: 1.45 }}>
                          {m.t}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    style={{
                      padding: '10px 24px 18px',
                      fontFamily: C.mono,
                      fontSize: 10,
                      color: '#46464E',
                      letterSpacing: '0.08em',
                    }}
                  >
                    ↗ {dept.stat}
                  </div>
                </article>
              ))}
            </div>

            {/* Coming soon */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12, marginTop: 12 }}>
              {[['Marketing Content', 'Q3 2026'], ['Customer Success', 'Q4 2026']].map(([name, when]) => (
                <div
                  key={name}
                  style={{
                    border: `1px dashed ${C.border}`,
                    borderRadius: 14,
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}
                >
                  <span style={{ fontFamily: C.display, fontSize: '1rem', color: C.secondary, letterSpacing: '-0.01em' }}>{name}</span>
                  <span style={{ fontFamily: C.mono, fontSize: 9, color: '#44444B', border: `1px solid ${C.border}`, borderRadius: 4, padding: '3px 8px', letterSpacing: '0.1em' }}>{when}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SECURITY ── */}
        <section style={{ ...sep, padding: '96px 0', background: C.surface }}>
          <div style={wrap}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '6vw',
                alignItems: 'start',
              }}
            >
              {/* BYOK */}
              <div>
                <span style={label()}>Bring Your Own Key</span>
                <h2 style={{ ...h2style, marginBottom: 20 }}>You pay your LLM provider. We never see that line.</h2>
                <p style={{ fontFamily: C.body, fontSize: '1rem', lineHeight: 1.7, color: C.secondary, marginBottom: 32 }}>
                  Sockt charges only for the orchestration infrastructure — FSM coordination, GBrain memory, TEE isolation, and fleet intelligence. Your inference bill stays between you and your provider at their rates.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['Anthropic (Claude) — recommended', 'OpenAI (GPT-4o, GPT-4o-mini)', 'Azure OpenAI', 'Google Gemini', 'Self-hosted: Ollama · vLLM · LM Studio'].map((p) => (
                    <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: C.mono, fontSize: 11, color: C.secondary }}>
                      <span style={{ color: '#22D07A', flexShrink: 0 }}>✓</span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security arch */}
              <div>
                <span style={label()}>Security Architecture</span>
                <h2 style={{ ...h2style, marginBottom: 28 }}>No credentials in agent context. Ever.</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {[
                    { layer: 'TEE Hardware Isolation', body: 'Every agent runs inside AMD SEV-SNP or Intel SGX enclaves. Memory pages are encrypted at the CPU die — host admins, including Sockt, cannot inspect a live container.' },
                    { layer: 'Secret Vault Proxy', body: 'Agents hold placeholder keys. A host-layer proxy intercepts every outbound call, validates against the domain allowlist, injects real credentials, and forwards. A fully-compromised agent has nothing to exfiltrate.' },
                    { layer: 'Egress Allowlist', body: 'All outbound traffic routes through per-customer domain rules. DNS covert channels blocked. Injection attempts logged and distributed to the fleet threat feed in under 60 minutes.' },
                    { layer: 'HITL Gates (Tier 1/2/3)', body: 'Every possible action is pre-classified. Tier 1 auto-executes. Tier 2 needs human approval before sending. Tier 3 is permanently blocked at the proxy layer regardless of any agent instruction.' },
                  ].map((item) => (
                    <div
                      key={item.layer}
                      style={{
                        border: `1px solid ${C.border}`,
                        borderLeft: `2px solid #46464E`,
                        padding: '16px 18px',
                        background: C.raised,
                      }}
                    >
                      <div style={{ fontFamily: C.mono, fontSize: 10, color: C.primary, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 7 }}>
                        {item.layer}
                      </div>
                      <div style={{ fontSize: 13, color: C.secondary, lineHeight: 1.6 }}>{item.body}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FLEET INTELLIGENCE ── */}
        <section style={{ ...sep, padding: '96px 0' }}>
          <div style={wrap}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '6vw',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={label()}>Fleet Intelligence</span>
                <h2 style={{ ...h2style, marginBottom: 20 }}>
                  Your agents learn from 200+ deployments — not just yours.
                </h2>
                <p style={{ fontFamily: C.body, fontSize: '1rem', lineHeight: 1.7, color: C.secondary }}>
                  A single self-hosted deployment has N=1 data. No baseline, no collective threat intelligence, no proactive API monitoring. Paid tiers tap a growing network that becomes more valuable with every connected deployment.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                {[
                  { n: '< 60 min', l: 'Detection to fleet-wide protection' },
                  { n: '< 2 hrs', l: 'API change detected before your cron fails' },
                  { n: '60–75%', l: 'Token cost reduction (skill compilation)' },
                  { n: 'N=1 → N=∞', l: 'Self-hosted vs. fleet data advantage' },
                ].map((item) => (
                  <div
                    key={item.l}
                    style={{
                      border: `1px solid ${C.border}`,
                      padding: '24px 20px',
                      background: C.surface,
                    }}
                  >
                    <div
                      style={{
                        fontFamily: C.display,
                        fontSize: 'clamp(1.1rem, 3vw, 1.8rem)',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        color: C.primary,
                        lineHeight: 1,
                        marginBottom: 10,
                      }}
                    >
                      {item.n}
                    </div>
                    <div style={{ fontFamily: C.mono, fontSize: 10, color: C.secondary, letterSpacing: '0.06em', lineHeight: 1.5 }}>
                      {item.l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section style={{ ...sep, padding: '96px 0', background: C.surface }}>
          <div style={wrap}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap', marginBottom: 48 }}>
              <div>
                <span style={label()}>Pricing</span>
                <h2 style={{ ...h2style, maxWidth: '16ch' }}>Platform fee. Your LLM costs stay yours.</h2>
              </div>
              <p style={{ fontFamily: C.mono, fontSize: 11, color: C.secondary, maxWidth: '36ch', lineHeight: 1.7, letterSpacing: '0.02em' }}>
                No inference markup. No per-seat lock-in. Pay Sockt for orchestration intelligence; pay your provider directly for tokens.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 1 }}>
              {TIERS.map((tier) => (
                <article
                  key={tier.name}
                  style={{
                    border: `1px solid ${tier.badge ? '#46464E' : C.border}`,
                    background: tier.badge ? C.raised : C.surface,
                    padding: '24px 20px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 16,
                  }}
                >
                  {tier.badge && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -1,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: C.primary,
                        color: C.void,
                        fontFamily: C.mono,
                        fontSize: 8,
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        padding: '3px 10px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tier.badge.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div style={{ fontFamily: C.mono, fontSize: 9, color: C.secondary, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
                      {tier.name}
                    </div>
                    <div style={{ fontFamily: C.display, fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, letterSpacing: '-0.03em', color: C.primary, lineHeight: 1, marginBottom: 4 }}>
                      {tier.price}
                    </div>
                    <div style={{ fontFamily: C.mono, fontSize: 9, color: C.secondary, letterSpacing: '0.06em' }}>
                      {tier.note}
                    </div>
                  </div>
                  <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {tier.features.map((f) => (
                      <div key={f} style={{ display: 'flex', gap: 8 }}>
                        <span style={{ color: '#46464E', fontSize: 11, flexShrink: 0 }}>›</span>
                        <span style={{ fontFamily: C.body, fontSize: 12, color: C.secondary, lineHeight: 1.4 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <div style={{ marginTop: 16 }}>
              <Link href="/pricing" style={{ fontFamily: C.mono, fontSize: 10, color: C.secondary, letterSpacing: '0.1em' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = C.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = C.secondary; }}>
                FULL PRICING + ADD-ONS + ANNUAL DISCOUNTS →
              </Link>
            </div>
          </div>
        </section>

        {/* ── OPEN SOURCE ── */}
        <section style={{ ...sep, padding: '96px 0' }}>
          <div style={wrap}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6vw', alignItems: 'start' }}>
              <div>
                <span style={label()}>Open-Core</span>
                <h2 style={{ ...h2style, marginBottom: 20 }}>
                  AI infrastructure shouldn't be a black box.
                </h2>
                <p style={{ fontFamily: C.body, fontSize: '1rem', lineHeight: 1.7, color: C.secondary, marginBottom: 32 }}>
                  The core orchestration, FSM engine, and memory layer are open source under FSL-1.1-MIT — any engineer can verify that the loop-prevention and memory architecture work as described. Self-host on a $20/month VPS, or let us run it for you.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <a
                    href="https://github.com/MMEHDI0606/sockt"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontFamily: C.mono,
                      fontSize: 11,
                      color: C.primary,
                      border: `1px solid ${C.border}`,
                      borderRadius: 999,
                      padding: '9px 20px',
                      letterSpacing: '0.08em',
                      display: 'inline-block',
                      transition: 'border-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#46464E'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
                  >
                    GITHUB →
                  </a>
                  <Link
                    href="/docs"
                    style={{
                      fontFamily: C.mono,
                      fontSize: 11,
                      color: C.secondary,
                      border: `1px solid ${C.border}`,
                      borderRadius: 999,
                      padding: '9px 20px',
                      letterSpacing: '0.08em',
                      display: 'inline-block',
                    }}
                  >
                    DOCS
                  </Link>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {OSS.map((m) => (
                    <div key={m.name} style={{ display: 'flex', gap: 0, border: `1px solid ${C.border}`, background: C.surface }}>
                      <div
                        style={{
                          fontFamily: C.mono,
                          fontSize: 10,
                          color: C.primary,
                          letterSpacing: '0.06em',
                          padding: '14px 16px',
                          borderRight: `1px solid ${C.border}`,
                          minWidth: 100,
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {m.name}
                      </div>
                      <div style={{ padding: '14px 16px', fontSize: 13, color: C.secondary, lineHeight: 1.5 }}>
                        {m.desc}
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '12px 16px', fontFamily: C.mono, fontSize: 9, color: '#44444B', letterSpacing: '0.1em', border: `1px solid ${C.border}`, borderTop: 'none' }}>
                    LICENSE: FSL-1.1-MIT → MIT AFTER 2 YEARS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section
          style={{
            ...sep,
            padding: '128px 0',
            background: C.surface,
            textAlign: 'center',
          }}
        >
          <div style={{ ...wrap }}>
            <div
              style={{
                maxWidth: 640,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 24,
              }}
            >
              <h2
                style={{
                  fontFamily: C.display,
                  fontSize: 'clamp(2.4rem, 6vw, 5.5rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.045em',
                  lineHeight: 0.96,
                  color: C.primary,
                  margin: 0,
                }}
              >
                Launch an AI department this week.
              </h2>
              <p style={{ fontFamily: C.body, fontSize: '1rem', color: C.secondary, lineHeight: 1.7, maxWidth: '46ch', margin: 0 }}>
                Under 10 minutes to activate. First real output within 2 hours. GBrain transfers seamlessly if you change tiers.
              </p>
              <Link
                href="/pricing"
                style={{
                  background: C.primary,
                  color: C.void,
                  padding: '15px 40px',
                  borderRadius: 999,
                  fontFamily: C.mono,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  display: 'inline-block',
                  marginTop: 8,
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                ADD SOCKT TO SLACK
              </Link>
              <p style={{ fontFamily: C.mono, fontSize: 10, color: '#44444B', margin: 0, letterSpacing: '0.1em' }}>
                COMMUNITY EDITION IS FREE · PAID PLANS FROM $69/MO
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />

      {/* Mobile hero grid fix */}
      <style>{`
        @media (max-width: 720px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
