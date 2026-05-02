'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const COLS = [
  {
    title: 'SOCKT',
    items: null as null | string[],
    desc: 'The execution layer for AI agents that pay in sats.',
  },
  {
    title: 'PRODUCT',
    items: ['Agents', 'Pricing', 'Docs', 'Status', 'Changelog'],
  },
  {
    title: 'DEVELOPERS',
    items: ['SDK Reference', 'MCP Server', 'Go Client', 'Python Client', 'TypeScript'],
  },
  {
    title: 'COMPANY',
    items: ['About', 'Blog', 'X / Twitter', 'GitHub', 'Contact'],
  },
];

export default function Footer() {
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!dotRef.current) return;
    gsap.to(dotRef.current, {
      opacity: 0.4,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }, []);

  return (
    <footer
      style={{
        borderTop: '1px solid var(--bg-border)',
        padding: '80px 32px 40px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px', marginBottom: '64px' }}>
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

              {col.desc ? (
                <>
                  <p
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      marginBottom: '16px',
                    }}
                  >
                    {col.desc}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                    }}
                  >
                    <span
                      ref={dotRef}
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent-btc)',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ color: 'var(--accent-btc)' }}>MAINNET LIVE</span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.items?.map((item) => (
                    <a
                      key={item}
                      href="#"
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                        transition: 'none',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                    >
                      {item}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Logo watermark */}
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

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--bg-border)',
            paddingTop: '24px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
            © 2025 Sockt
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
            Built on Bitcoin.
          </span>
        </div>
      </div>
    </footer>
  );
}
