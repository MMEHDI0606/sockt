'use client';

import Link from 'next/link';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '96px 24px',
          color: 'var(--text-primary)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 640 }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--accent-btc)',
              marginBottom: '20px',
            }}
          >
            Pricing
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: 'clamp(3rem, 7vw, 6rem)',
              lineHeight: 0.92,
              letterSpacing: '-0.04em',
              margin: '0 0 24px',
              fontVariationSettings: "'opsz' 144",
            }}
          >
            <span style={{ display: 'block', fontWeight: 800 }}>Coming</span>
            <span style={{ display: 'block', fontWeight: 200, color: 'var(--text-secondary)' }}>soon.</span>
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1.05rem',
              lineHeight: 1.6,
              color: 'var(--text-secondary)',
              maxWidth: '42ch',
              margin: '0 auto 32px',
            }}
          >
            We&apos;re finalising pricing. Community Edition stays free and open-core — self-host it today.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://github.com/sockt-dev/sockt"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--bg-void)',
                background: 'var(--accent-btc)',
                borderRadius: '999px',
                padding: '13px 28px',
                letterSpacing: '0.06em',
                display: 'inline-block',
              }}
            >
              SELF-HOST FREE →
            </a>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--text-secondary)',
                border: '1px solid var(--bg-border)',
                borderRadius: '999px',
                padding: '12px 26px',
                letterSpacing: '0.06em',
                display: 'inline-block',
              }}
            >
              ← Back home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
