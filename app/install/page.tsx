'use client';

import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';
import CopyCommand from '@/components/install/CopyCommand';

const INSTALL_CMD = 'curl -fsSL https://sockt.dev/install | bash';

export default function InstallPage() {
  return (
    <>
      <Nav />
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-primary)',
        background: 'var(--bg-void)',
        padding: '0 24px',
      }}>
        <div style={{ width: '100%', maxWidth: 580 }}>
          <h1 style={{
            fontFamily: 'var(--font-headline)',
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-secondary)',
            margin: '0 0 24px',
            textAlign: 'center',
          }}>
            Install the CLI
          </h1>
          <CopyCommand code={INSTALL_CMD} label="sockt.dev/install" variant="hero" />
        </div>
      </main>
      <Footer />
    </>
  );
}
