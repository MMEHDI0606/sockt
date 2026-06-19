'use client';

import { use } from 'react';
import Link from 'next/link';

type PageProps = {
  params: Promise<{
    slug: string[];
  }>;
};

function prettify(part: string): string {
  return part
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function PlaceholderPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slugParts = resolvedParams.slug ?? [];
  const path = `/${slugParts.join('/')}`;
  const title = slugParts.map(prettify).join(' / ') || 'Page';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-void)', color: 'var(--text-primary)' }}>

      {/* Nav */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          borderBottom: '1px solid var(--bg-border)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 32px',
            height: '67px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '5px', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: '18px', color: 'var(--accent-btc)', letterSpacing: '-0.01em', lineHeight: 1 }}>
              {'{*}'}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '0.01em', lineHeight: 1 }}>
              Sockt
            </span>
          </Link>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
            }}
          >
            ← Back
          </Link>
        </div>
      </nav>

      {/* Body */}
      <main
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '160px 32px 120px',
        }}
      >
        {/* Breadcrumb */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            letterSpacing: '0.1em',
            marginBottom: '28px',
          }}
        >
          SOCKT / NOT FOUND
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            fontWeight: 800,
            lineHeight: 0.92,
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)',
            marginBottom: '40px',
          }}
        >
          404.
        </h1>

        {/* Divider */}
        <div style={{ width: '64px', height: '1px', backgroundColor: 'var(--accent-btc)', marginBottom: '40px' }} />

        {/* Body copy */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            lineHeight: 1.75,
            color: 'var(--text-secondary)',
            maxWidth: '520px',
            marginBottom: '20px',
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--bg-border)',
            letterSpacing: '0.06em',
          }}
        >
          Route: {path}
        </p>

        {/* CTA */}
        <div style={{ marginTop: '56px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              backgroundColor: 'var(--accent-btc)',
              color: 'var(--bg-void)',
              padding: '12px 24px',
              borderRadius: '4px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              display: 'inline-block',
            }}
          >
            Back to Home →
          </Link>
          <Link
            href="/docs"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.04em',
            }}
          >
            View Docs →
          </Link>
        </div>
      </main>

      {/* Footer strip */}
      <footer
        style={{
          borderTop: '1px solid var(--bg-border)',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
          © 2025 Sockt
        </span>
      </footer>
    </div>
  );
}
