'use client';

import { useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';
import AmbientBlobs from '@/components/canvas/AmbientBlobs';
import SwarmOrbit from '@/components/svg/SwarmOrbit';
import CopyCommand from '@/components/install/CopyCommand';
import { useReveal } from '@/hooks/useReveal';
import { useIsMobile } from '@/hooks/useIsMobile';

const INSTALL_CMD = 'curl -fsSL https://sockt.dev/install | bash';
const REPO_URL = 'https://github.com/sockt-dev/sockt';

const C = {
  mono: 'var(--font-mono)' as const,
  body: 'var(--font-body)' as const,
  headline: 'var(--font-headline)' as const,
  primary: 'var(--text-primary)' as const,
  secondary: 'var(--text-secondary)' as const,
  border: 'var(--bg-border)' as const,
  surface: 'var(--bg-surface)' as const,
  raised: 'var(--bg-raised)' as const,
  void: 'var(--bg-void)' as const,
  brass: 'var(--accent-brass)' as const,
};

const wrap: CSSProperties = { maxWidth: 1200, margin: '0 auto', padding: '0 24px' };
const sep: CSSProperties = { borderTop: `1px solid ${C.border}` };

const label = (): CSSProperties => ({
  fontFamily: C.mono,
  fontSize: 'var(--mono-micro)',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: C.secondary,
  marginBottom: 18,
  display: 'block',
});

const H2 = (extra: CSSProperties = {}): CSSProperties => ({
  fontFamily: C.headline,
  fontSize: 'clamp(1.8rem, 3.6vw, 3rem)',
  fontWeight: 700,
  lineHeight: 1.06,
  letterSpacing: '-0.045em',
  color: C.primary,
  margin: 0,
  ...extra,
});

const installerSteps = [
  {
    n: '01',
    title: 'Detect platform',
    body: 'Resolves Linux or macOS and architecture (x86_64 / aarch64), then pulls the matching release binary.',
  },
  {
    n: '02',
    title: 'Ensure Bun',
    body: 'Checks for the Bun runtime used by TypeScript services. Prompts to install if it is missing.',
  },
  {
    n: '03',
    title: 'Check Docker',
    body: 'Verifies Docker is available for local services. You can continue without it and install later.',
  },
  {
    n: '04',
    title: 'Install & PATH',
    body: 'Places the sockt binary in ~/.local/bin by default and offers to add that directory to your shell PATH.',
  },
];

const prerequisites = [
  { name: 'curl or wget', body: 'Required to download the installer and release archive.' },
  { name: 'tar', body: 'Required to extract the platform release tarball.' },
  {
    name: 'Bun',
    body: 'Auto-installed by the script when missing, or install from bun.sh first.',
    href: 'https://bun.sh',
  },
  {
    name: 'Docker',
    body: 'Recommended for sockt deploy. Install Desktop (macOS) or Engine (Linux) if you plan to run services locally.',
    href: 'https://docs.docker.com/get-docker/',
  },
];

const variants = [
  {
    title: 'Pin a version',
    code: 'VERSION=0.1.0 curl -fsSL https://sockt.dev/install | bash',
  },
  {
    title: 'Custom install directory',
    code: 'SOCKT_INSTALL_DIR=/usr/local/bin curl -fsSL https://sockt.dev/install | bash',
  },
  {
    title: 'Skip Bun prompt',
    code: 'curl -fsSL https://sockt.dev/install | bash -s -- --no-bun',
  },
  {
    title: 'Skip Docker checks',
    code: 'curl -fsSL https://sockt.dev/install | bash -s -- --no-docker',
  },
  {
    title: 'Uninstall',
    code: 'curl -fsSL https://sockt.dev/install | bash -s -- --uninstall',
  },
];

const nextSteps = `sockt init
sockt doctor
sockt deploy
sockt ask "Summarise our top 3 competitors"`;

const sourceInstall = `git clone https://github.com/sockt-dev/sockt
cd sockt
bun install
cd rust/sockt-cli
cargo build --release
# Binary: rust/target/release/sockt`;

const faqs: [string, string][] = [
  [
    'What does this install?',
    'The sockt CLI for Community Edition — open-core orchestration, memory, and deployment tooling so you can self-host AI employee swarms on your own machine or infrastructure.',
  ],
  [
    'Which platforms are supported?',
    'Linux and macOS on x86_64 and aarch64. Windows is not supported natively; use WSL2 and run the installer from a Linux environment.',
  ],
  [
    'Is Community Edition free?',
    'Yes. Community Edition is free and open-core (FSL-1.1-MIT, MIT after two years). Paid managed tiers are coming later; self-host works today.',
  ],
  [
    'How do I uninstall?',
    'Run curl -fsSL https://sockt.dev/install | bash -s -- --uninstall. The script removes the binary and can optionally delete ~/.sockt configuration.',
  ],
  [
    'Where do I go after install?',
    'Run sockt init, then sockt deploy. For Slack setup, memory seeding, and BYOK model connection, see the docs. Deep technical references live in the GitHub repo.',
  ],
];

const STATS = [
  { v: '1 cmd', l: 'install CLI' },
  { v: '< 2 min', l: 'typical bootstrap' },
  { v: '2 arch', l: 'x86_64 · aarch64' },
  { v: 'Free', l: 'Community Edition' },
];

function RevealSection({
  children,
  style,
  stagger = 0.1,
  y = 36,
}: {
  children: ReactNode;
  style?: CSSProperties;
  stagger?: number;
  y?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref, { selector: '[data-reveal]', stagger, y, duration: 0.9 });
  return (
    <section ref={ref} style={style}>
      {children}
    </section>
  );
}

function TerminalBlock({ code, label }: { code: string; label: string }) {
  return <CopyCommand code={code} label={label} showPrompt={false} />;
}

export default function InstallPage() {
  const isMobile = useIsMobile();

  return (
    <>
      <Nav />
      <main style={{ color: C.primary, background: C.void, overflowX: 'hidden' }}>
        {/* ── HERO ── */}
        <section
          style={{
            position: 'relative',
            minHeight: isMobile ? undefined : '78vh',
            display: 'flex',
            alignItems: 'center',
            paddingTop: 110,
            paddingBottom: isMobile ? 56 : 80,
            overflow: 'hidden',
          }}
        >
          <AmbientBlobs variant="hero" />
          <div style={{ ...wrap, width: '100%', position: 'relative', zIndex: 1 }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1.15fr) minmax(0,0.85fr)',
                gap: isMobile ? 40 : '4vw',
                alignItems: 'center',
              }}
            >
              <div>
                <span
                  style={{
                    ...label(),
                    color: C.brass,
                    marginBottom: 20,
                    fontSize: 11,
                  }}
                >
                  Install · Community Edition
                </span>
                <h1
                  style={{
                    fontFamily: C.headline,
                    fontSize: 'clamp(2.6rem, 5.4vw, 5.4rem)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.045em',
                    margin: '0 0 24px',
                  }}
                >
                  <span style={{ display: 'block', fontWeight: 800, color: C.primary }}>
                    One{' '}
                    <em
                      style={{
                        fontFamily: 'var(--font-serif-accent)',
                        fontWeight: 300,
                        fontStyle: 'italic',
                        color: C.brass,
                      }}
                    >
                      command.
                    </em>
                  </span>
                  <span style={{ display: 'block', fontWeight: 200, color: C.secondary }}>
                    Full AI workforce stack.
                  </span>
                </h1>
                <p
                  style={{
                    fontFamily: C.body,
                    fontSize: '1.08rem',
                    lineHeight: 1.7,
                    color: C.secondary,
                    maxWidth: '42ch',
                    marginBottom: 32,
                  }}
                >
                  Free and open-core. Install the CLI, initialise a deployment, and bring up coordinated AI departments on your own machine.
                </p>

                <div id="install-command" style={{ marginBottom: 22 }}>
                  <CopyCommand code={INSTALL_CMD} label="sockt.dev/install" variant="hero" />
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 18px' }}>
                  {['Linux · macOS', 'x86_64 · aarch64', 'WSL2 on Windows', '~/.local/bin'].map((chip) => (
                    <div
                      key={chip}
                      style={{
                        fontFamily: C.mono,
                        fontSize: 11,
                        color: C.secondary,
                        letterSpacing: '0.08em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: C.brass,
                          opacity: 0.7,
                          flexShrink: 0,
                          display: 'inline-block',
                        }}
                      />
                      {chip}
                    </div>
                  ))}
                </div>
              </div>

              {!isMobile && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: 0.72,
                    position: 'relative',
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      width: 280,
                      height: 280,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(194,168,120,0.12) 0%, transparent 70%)',
                      filter: 'blur(40px)',
                    }}
                  />
                  <SwarmOrbit size={300} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, background: C.surface }}>
          <div style={wrap}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
                gap: 0,
              }}
            >
              {STATS.map((s, i) => (
                <div
                  key={s.l}
                  style={{
                    padding: isMobile ? '22px 16px' : '28px 20px',
                    borderRight:
                      isMobile
                        ? i % 2 === 0
                          ? `1px solid ${C.border}`
                          : 'none'
                        : i < STATS.length - 1
                          ? `1px solid ${C.border}`
                          : 'none',
                    borderBottom: isMobile && i < 2 ? `1px solid ${C.border}` : 'none',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-subhead)',
                      fontSize: 'clamp(1.25rem, 2.4vw, 1.85rem)',
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      color: C.primary,
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {s.v}
                  </div>
                  <div
                    style={{
                      fontFamily: C.mono,
                      fontSize: 10,
                      color: C.secondary,
                      letterSpacing: '0.08em',
                    }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── WHAT THE SCRIPT DOES ── */}
        <RevealSection style={{ ...sep, padding: isMobile ? '64px 0' : '96px 0' }}>
          <div style={wrap}>
            <span data-reveal style={{ ...label(), color: C.brass }}>
              Installer
            </span>
            <h2 data-reveal style={{ ...H2(), marginBottom: 40, maxWidth: '18ch' }}>
              What happens when you run it.
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 1,
              }}
            >
              {installerSteps.map((step) => (
                <article
                  key={step.n}
                  data-reveal
                  className="lift-card"
                  style={{
                    border: `1px solid ${C.border}`,
                    borderTop: '1px solid var(--border-top-highlight)',
                    background: C.surface,
                    padding: '28px 24px',
                    position: 'relative',
                    borderRadius: 'var(--radius-card)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      fontFamily: C.mono,
                      fontSize: 48,
                      fontWeight: 400,
                      color: 'var(--bg-border-subtle)',
                      lineHeight: 1,
                      position: 'absolute',
                      top: 16,
                      right: 18,
                      letterSpacing: '-0.04em',
                      userSelect: 'none',
                    }}
                  >
                    {step.n}
                  </div>
                  <h3
                    style={{
                      fontFamily: C.headline,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      margin: '0 0 10px',
                      color: C.primary,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: C.body,
                      fontSize: '0.95rem',
                      lineHeight: 1.65,
                      color: C.secondary,
                      maxWidth: '36ch',
                    }}
                  >
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── PREREQUISITES ── */}
        <RevealSection style={{ ...sep, padding: isMobile ? '64px 0' : '88px 0', background: C.surface }}>
          <div style={wrap}>
            <span data-reveal style={{ ...label(), color: C.brass }}>
              Requirements
            </span>
            <h2 data-reveal style={{ ...H2(), marginBottom: 36 }}>
              Prerequisites
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 12,
              }}
            >
              {prerequisites.map((item) => (
                <article
                  key={item.name}
                  data-reveal
                  className="lift-card"
                  style={{
                    border: `1px solid ${C.border}`,
                    borderTop: '1px solid var(--border-top-highlight)',
                    borderRadius: 12,
                    padding: '20px 22px',
                    background: C.raised,
                  }}
                >
                  <div
                    style={{
                      fontFamily: C.mono,
                      fontSize: 11,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: C.brass,
                      marginBottom: 10,
                    }}
                  >
                    {item.name}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontFamily: C.body,
                      fontSize: '0.95rem',
                      lineHeight: 1.65,
                      color: C.secondary,
                    }}
                  >
                    {item.body}
                    {item.href ? (
                      <>
                        {' '}
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: C.brass,
                            fontFamily: C.mono,
                            fontSize: 11,
                            letterSpacing: '0.06em',
                          }}
                        >
                          Docs →
                        </a>
                      </>
                    ) : null}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── NEXT STEPS ── */}
        <RevealSection style={{ ...sep, padding: isMobile ? '64px 0' : '96px 0' }}>
          <div style={wrap}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,0.9fr) minmax(0,1.1fr)',
                gap: isMobile ? 28 : '5vw',
                alignItems: 'start',
              }}
            >
              <div>
                <span data-reveal style={{ ...label(), color: C.brass }}>
                  After install
                </span>
                <h2 data-reveal style={{ ...H2(), marginBottom: 16, maxWidth: '12ch' }}>
                  Init. Deploy. Ask.
                </h2>
                <p
                  data-reveal
                  style={{
                    margin: '0 0 24px',
                    fontFamily: C.body,
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: C.secondary,
                    maxWidth: '38ch',
                  }}
                >
                  Initialise config and encryption, run a pre-flight check, deploy the stack, then send your first instruction.
                </p>
                <Link
                  data-reveal
                  href="/docs"
                  style={{
                    fontFamily: C.mono,
                    fontSize: 'var(--mono-cta)',
                    letterSpacing: '0.08em',
                    color: C.primary,
                    border: `1px solid ${C.border}`,
                    borderRadius: 'var(--radius-btn)',
                    padding: '11px 22px',
                    display: 'inline-block',
                    transition: 'border-color 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3A3A42';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                  }}
                >
                  OPEN SETUP DOCS →
                </Link>
              </div>
              <div data-reveal>
                <TerminalBlock code={nextSteps} label="next steps" />
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ── VARIANTS ── */}
        <RevealSection style={{ ...sep, padding: isMobile ? '64px 0' : '88px 0', background: C.surface }}>
          <div style={wrap}>
            <span data-reveal style={{ ...label(), color: C.brass }}>
              Options
            </span>
            <h2 data-reveal style={{ ...H2(), marginBottom: 12 }}>
              Variants &amp; flags
            </h2>
            <p
              data-reveal
              style={{
                margin: '0 0 28px',
                fontFamily: C.body,
                color: C.secondary,
                maxWidth: '56ch',
                lineHeight: 1.65,
              }}
            >
              Pin a release, change the install path, or skip optional checks. Also:{' '}
              <code style={{ fontFamily: C.mono, fontSize: 12, color: C.primary }}>--no-path</code>,{' '}
              <code style={{ fontFamily: C.mono, fontSize: 12, color: C.primary }}>--dir</code>,{' '}
              <code style={{ fontFamily: C.mono, fontSize: 12, color: C.primary }}>--version</code>.
            </p>
            <div
              data-reveal
              style={{
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                overflow: 'hidden',
                background: C.raised,
              }}
            >
              {variants.map((variant, i) => (
                <div
                  key={variant.title}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '200px 1fr',
                    gap: isMobile ? 8 : 20,
                    padding: isMobile ? '14px 16px' : '16px 20px',
                    borderTop: i === 0 ? 'none' : `1px solid ${C.border}`,
                    alignItems: 'baseline',
                  }}
                >
                  <div
                    style={{
                      fontFamily: C.mono,
                      fontSize: 10,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: C.brass,
                    }}
                  >
                    {variant.title}
                  </div>
                  <code
                    style={{
                      fontFamily: C.mono,
                      fontSize: isMobile ? 11.5 : 12.5,
                      lineHeight: 1.55,
                      color: C.primary,
                      wordBreak: 'break-all',
                    }}
                  >
                    {variant.code}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── SOURCE ── */}
        <RevealSection style={{ ...sep, padding: isMobile ? '64px 0' : '96px 0' }}>
          <div style={wrap}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,0.9fr) minmax(0,1.1fr)',
                gap: isMobile ? 28 : '5vw',
                alignItems: 'start',
              }}
            >
              <div>
                <span data-reveal style={{ ...label(), color: C.brass }}>
                  Developers
                </span>
                <h2 data-reveal style={{ ...H2(), marginBottom: 16, maxWidth: '12ch' }}>
                  Build from source
                </h2>
                <p
                  data-reveal
                  style={{
                    margin: '0 0 24px',
                    fontFamily: C.body,
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    color: C.secondary,
                    maxWidth: '38ch',
                  }}
                >
                  Prefer a monorepo checkout? You need Bun and a Rust toolchain, then build the CLI from{' '}
                  <code style={{ fontFamily: C.mono, fontSize: 12, color: C.primary }}>rust/sockt-cli</code>.
                </p>
                <a
                  data-reveal
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: C.mono,
                    fontSize: 'var(--mono-cta)',
                    letterSpacing: '0.08em',
                    color: C.primary,
                    border: `1px solid ${C.border}`,
                    borderRadius: 'var(--radius-btn)',
                    padding: '11px 22px',
                    display: 'inline-block',
                    transition: 'border-color 0.12s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3A3A42';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                  }}
                >
                  VIEW REPOSITORY →
                </a>
              </div>
              <div data-reveal>
                <TerminalBlock code={sourceInstall} label="from source" />
              </div>
            </div>
          </div>
        </RevealSection>

        {/* ── FAQ ── */}
        <RevealSection style={{ ...sep, padding: isMobile ? '64px 0' : '88px 0', background: C.surface }}>
          <div style={wrap}>
            <span data-reveal style={{ ...label(), color: C.brass }}>
              FAQ
            </span>
            <h2 data-reveal style={{ ...H2(), marginBottom: 32 }}>
              Common questions
            </h2>
            <div style={{ display: 'grid', gap: 10, maxWidth: 720 }}>
              {faqs.map(([question, answer]) => (
                <details
                  key={question}
                  data-reveal
                  style={{
                    border: `1px solid ${C.border}`,
                    borderTop: '1px solid var(--border-top-highlight)',
                    borderRadius: 10,
                    padding: '16px 18px',
                    cursor: 'pointer',
                    background: C.raised,
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <summary
                    style={{
                      fontFamily: C.headline,
                      fontSize: '1.02rem',
                      fontWeight: 600,
                      color: C.primary,
                      outline: 'none',
                      listStyle: 'none',
                    }}
                  >
                    {question}
                  </summary>
                  <p
                    style={{
                      fontFamily: C.body,
                      lineHeight: 1.7,
                      color: C.secondary,
                      marginTop: 12,
                      marginBottom: 0,
                      fontSize: '0.95rem',
                    }}
                  >
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── CLOSING CTA ── */}
        <section
          style={{
            ...sep,
            padding: isMobile ? '88px 0 100px' : '140px 0 120px',
            background: C.surface,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <AmbientBlobs variant="cta" />
          <div style={{ ...wrap, position: 'relative', zIndex: 1 }}>
            <div
              style={{
                maxWidth: 640,
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 22,
              }}
            >
              <h2
                style={{
                  fontFamily: C.headline,
                  fontSize: 'clamp(2.2rem, 5.5vw, 4.4rem)',
                  fontWeight: 800,
                  letterSpacing: '-0.045em',
                  lineHeight: 1.02,
                  color: C.primary,
                  margin: 0,
                }}
              >
                Launch your{' '}
                <em
                  style={{
                    fontFamily: 'var(--font-serif-accent)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    color: C.brass,
                  }}
                >
                  swarm
                </em>{' '}
                today.
              </h2>
              <p
                style={{
                  fontFamily: C.mono,
                  fontSize: 'var(--mono-body)',
                  color: C.secondary,
                  letterSpacing: '0.06em',
                  margin: 0,
                }}
              >
                One command. Local control. Open-core forever.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
                <a
                  href="#install-command"
                  style={{
                    background: C.primary,
                    color: C.void,
                    padding: '13px 28px',
                    borderRadius: 'var(--radius-btn)',
                    fontFamily: C.mono,
                    fontSize: 'var(--mono-cta)',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    display: 'inline-block',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
                  }}
                >
                  COPY INSTALL CMD
                </a>
                <Link
                  href="/docs"
                  style={{
                    border: `1px solid ${C.border}`,
                    color: C.secondary,
                    padding: '12px 26px',
                    borderRadius: 'var(--radius-btn)',
                    fontFamily: C.mono,
                    fontSize: 'var(--mono-cta)',
                    letterSpacing: '0.06em',
                    display: 'inline-block',
                  }}
                >
                  READ DOCS
                </Link>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    border: `1px solid ${C.border}`,
                    color: C.secondary,
                    padding: '12px 26px',
                    borderRadius: 'var(--radius-btn)',
                    fontFamily: C.mono,
                    fontSize: 'var(--mono-cta)',
                    letterSpacing: '0.06em',
                    display: 'inline-block',
                  }}
                >
                  GITHUB →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
