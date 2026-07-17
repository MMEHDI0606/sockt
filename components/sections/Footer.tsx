'use client';

import Link from 'next/link';
import { useIsMobile } from '@/hooks/useIsMobile';

const COLS = [
  {
    title: 'PRODUCT',
    items: ['Docs', 'Install', 'Pricing', 'Departments'],
  },
  {
    title: 'LEGAL & CONTACT',
    items: ['Terms & Conditions', 'Privacy Policy', 'Contact'],
  },
];

export default function Footer() {
  const isMobile = useIsMobile();

  return (
    <footer
      style={{
        borderTop: '1px solid var(--bg-border)',
        padding: isMobile ? '44px 16px 20px' : '80px 32px 40px',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 48px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            gap: isMobile ? '40px' : '48px',
            marginBottom: isMobile ? '24px' : '64px',
          }}
        >
          <div style={{ maxWidth: isMobile ? '100%' : '300px' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                letterSpacing: '0.1em',
                marginBottom: '20px',
              }}
            >
              SOCKT
            </div>
            {!isMobile ? (
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                }}
              >
                AI-native workforce infrastructure for Slack-native departments.
              </p>
            ) : null}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '40px' : '80px',
            }}
          >
            {COLS.map((col) => (
              <div key={col.title}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    letterSpacing: '0.1em',
                    marginBottom: '20px',
                  }}
                >
                  {col.title}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.items.map((item) => {
                    const routeMap: Record<string, string> = {
                      Docs: '/docs',
                      Install: '/install',
                      Pricing: '/pricing',
                      Departments: '/departments',
                      'Terms & Conditions': '/terms',
                      'Privacy Policy': '/privacy',
                      'X / Twitter': 'https://x.com/socktdev',
                      GitHub: 'https://github.com/socktdev',
                      Contact: 'mailto:hello@sockt.dev',
                    };

                    const href = routeMap[item] ?? '/';
                    const isExternal = href.startsWith('http') || href.startsWith('mailto');

                    return isExternal ? (
                      <a
                        key={item}
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          transition: 'none',
                        }}
                        onMouseEnter={(event) => (event.currentTarget.style.color = 'var(--text-primary)')}
                        onMouseLeave={(event) => (event.currentTarget.style.color = 'var(--text-secondary)')}
                      >
                        {item}
                      </a>
                    ) : (
                      <Link
                        key={item}
                        href={href}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: '13px',
                          color: 'var(--text-secondary)',
                          transition: 'none',
                        }}
                        onMouseEnter={(event) => (event.currentTarget.style.color = 'var(--text-primary)')}
                        onMouseLeave={(event) => (event.currentTarget.style.color = 'var(--text-secondary)')}
                      >
                        {item}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!isMobile ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              margin: '64px 0 48px',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 400,
                fontSize: 'clamp(64px, 12vw, 160px)',
                color: 'var(--bg-border)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {'{*}'}
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 'clamp(60px, 11vw, 150px)',
                color: 'var(--bg-border)',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              Sockt
            </span>
          </div>
        ) : null}

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--bg-border)',
            paddingTop: isMobile ? '14px' : '24px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
            © {new Date().getFullYear()} Sockt
          </span>
        </div>
      </div>
    </footer>
  );
}
