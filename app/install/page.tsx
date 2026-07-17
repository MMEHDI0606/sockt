import type { CSSProperties } from 'react';
import Link from 'next/link';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';
import CopyCommand from '@/components/install/CopyCommand';

const INSTALL_CMD = 'curl -fsSL https://sockt.dev/install | bash';
const REPO_URL = 'https://github.com/sockt-dev/sockt';

const installerSteps = [
  {
    title: '1. Detect platform',
    body: 'Resolves Linux or macOS and architecture (x86_64 / aarch64), then pulls the matching release binary.',
  },
  {
    title: '2. Ensure Bun',
    body: 'Checks for the Bun runtime used by TypeScript services. Prompts to install if it is missing.',
  },
  {
    title: '3. Check Docker',
    body: 'Verifies Docker is available for local services. You can continue without it and install later.',
  },
  {
    title: '4. Install & PATH',
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

const cardStyle: CSSProperties = {
  border: '1px solid var(--bg-border)',
  borderRadius: '18px',
  padding: '20px 22px',
  background: 'var(--bg-surface)',
};

const monoCodeStyle: CSSProperties = {
  margin: 0,
  padding: '18px 20px',
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  lineHeight: 1.7,
  color: 'var(--text-primary)',
  background: 'var(--bg-surface)',
  border: '1px solid var(--bg-border)',
  borderRadius: '16px',
  overflowX: 'auto',
  whiteSpace: 'pre-wrap',
};

export default function InstallPage() {
  return (
    <>
      <Nav />
      <main
        style={{
          minHeight: '100vh',
          padding: '96px 24px 120px',
          background: 'radial-gradient(circle at top, rgba(194, 122, 54, 0.14), transparent 40%)',
          color: 'var(--text-primary)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--accent-btc)',
              marginBottom: '14px',
            }}
          >
            Install
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 6vw, 4.2rem)',
              lineHeight: 1,
              letterSpacing: '-0.04em',
              margin: 0,
              maxWidth: '14ch',
            }}
          >
            One command. Full AI-native workforce stack.
          </h1>
          <p
            style={{
              marginTop: '18px',
              maxWidth: '68ch',
              fontFamily: 'var(--font-body)',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
            }}
          >
            Community Edition is free and open-core. Install the CLI, initialise a deployment, and bring up coordinated AI departments on your own machine.
          </p>

          <section style={{ marginTop: '40px' }}>
            <CopyCommand code={INSTALL_CMD} label="One-liner" />
            <p
              style={{
                marginTop: '14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                letterSpacing: '0.04em',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}
            >
              Linux &amp; macOS · x86_64 / aarch64 · Windows via{' '}
              <a
                href="https://docs.microsoft.com/en-us/windows/wsl/install"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-btc)' }}
              >
                WSL2
              </a>
              . Default install path: <span style={{ color: 'var(--text-primary)' }}>~/.local/bin</span>
            </p>
          </section>

          <section style={{ marginTop: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--accent-btc)',
                marginBottom: '10px',
              }}
            >
              Installer
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '0 0 16px' }}>
              What the script does
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {installerSteps.map((step) => (
                <article key={step.title} style={cardStyle}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', margin: 0 }}>{step.title}</h3>
                  <p style={{ margin: '10px 0 0', lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section style={{ marginTop: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--accent-btc)',
                marginBottom: '10px',
              }}
            >
              Requirements
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '0 0 16px' }}>
              Prerequisites
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              {prerequisites.map((item) => (
                <article key={item.name} style={cardStyle}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', margin: 0 }}>{item.name}</h3>
                  <p style={{ margin: '10px 0 0', lineHeight: 1.7, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    {item.body}
                    {item.href ? (
                      <>
                        {' '}
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                        >
                          Docs →
                        </a>
                      </>
                    ) : null}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section style={{ marginTop: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--accent-btc)',
                marginBottom: '10px',
              }}
            >
              After install
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '0 0 12px' }}>
              Next steps
            </h2>
            <p
              style={{
                margin: '0 0 20px',
                maxWidth: '68ch',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Initialise config and encryption, run a pre-flight check, deploy the stack, then send your first instruction.
              For Slack, memory seeding, and BYOK setup, continue in the docs.
            </p>
            <pre style={monoCodeStyle}>{nextSteps}</pre>
            <div style={{ marginTop: '18px' }}>
              <Link
                href="/docs"
                style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}
              >
                Open setup docs →
              </Link>
            </div>
          </section>

          <section style={{ marginTop: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--accent-btc)',
                marginBottom: '10px',
              }}
            >
              Options
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '0 0 16px' }}>
              Variants &amp; flags
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {variants.map((variant) => (
                <div key={variant.title} style={{ ...cardStyle, padding: '16px 18px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--accent-btc)',
                      marginBottom: '10px',
                    }}
                  >
                    {variant.title}
                  </div>
                  <code
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '13px',
                      lineHeight: 1.6,
                      color: 'var(--text-primary)',
                      wordBreak: 'break-all',
                    }}
                  >
                    {variant.code}
                  </code>
                </div>
              ))}
            </div>
            <p
              style={{
                marginTop: '16px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
              }}
            >
              Also available: <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>--no-path</code> to skip
              shell PATH edits, and <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>--dir</code> /{' '}
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>--version</code> as flag equivalents of
              the env vars above.
            </p>
          </section>

          <section style={{ marginTop: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--accent-btc)',
                marginBottom: '10px',
              }}
            >
              Developers
            </p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', margin: '0 0 12px' }}>
              Build from source
            </h2>
            <p
              style={{
                margin: '0 0 20px',
                maxWidth: '68ch',
                lineHeight: 1.8,
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Prefer a local monorepo checkout? You need Bun and a Rust toolchain, then build the CLI from{' '}
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>rust/sockt-cli</code>.
            </p>
            <pre style={monoCodeStyle}>{sourceInstall}</pre>
            <div style={{ marginTop: '18px' }}>
              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}
              >
                View repository →
              </a>
            </div>
          </section>

          <section style={{ marginTop: '56px', borderTop: '1px solid var(--bg-border)', paddingTop: '40px' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--accent-btc)',
                marginBottom: '24px',
              }}
            >
              FAQ
            </p>
            <div style={{ display: 'grid', gap: '14px', maxWidth: '720px' }}>
              {faqs.map(([question, answer]) => (
                <details
                  key={question}
                  style={{
                    border: '1px solid var(--bg-border)',
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                    background: 'var(--bg-surface)',
                  }}
                >
                  <summary
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  >
                    {question}
                  </summary>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      lineHeight: 1.7,
                      color: 'var(--text-secondary)',
                      marginTop: '12px',
                      marginBottom: 0,
                    }}
                  >
                    {answer}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <div style={{ marginTop: '48px', display: 'flex', gap: '18px', flexWrap: 'wrap' }}>
            <Link
              href="/docs"
              style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}
            >
              Docs
            </Link>
            <Link
              href="/departments"
              style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}
            >
              Departments
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}
            >
              GitHub →
            </a>
            <Link
              href="/"
              style={{ color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em' }}
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
