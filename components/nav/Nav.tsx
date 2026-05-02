'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const trigger = ScrollTrigger.create({
      start: 60,
      onEnter: () =>
        gsap.to(nav, {
          backgroundColor: 'var(--bg-surface)',
          borderBottomColor: 'var(--bg-border)',
          duration: 0.3,
          ease: 'power2.out',
        }),
      onLeaveBack: () =>
        gsap.to(nav, {
          backgroundColor: 'transparent',
          borderBottomColor: 'transparent',
          duration: 0.2,
        }),
    });

    return () => trigger.kill();
  }, []);

  return (
    <nav
      ref={navRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'transparent',
        borderBottom: '1px solid transparent',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
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
        {/* Left: Logo mark */}
        <a href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '5px', textDecoration: 'none' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 400,
              fontSize: '18px',
              color: 'var(--accent-btc)',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            {'{*}'}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 500,
              fontSize: '18px',
              color: 'var(--text-primary)',
              letterSpacing: '0.01em',
              lineHeight: 1,
            }}
          >
            Sockt
          </span>
        </a>

        {/* Center: Nav links */}
        <div
          style={{
            display: 'flex',
            gap: '32px',
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            color: 'var(--text-secondary)',
            letterSpacing: '0.08em',
          }}
        >
          {['Use Cases', 'Docs', 'Pricing', 'Status'].map((link) => (
            <a
              key={link}
              href="#"
              style={{ color: 'inherit', transition: 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right: CTA */}
        <a
          href="#"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '14px',
            color: 'var(--accent-btc)',
            border: '1px solid var(--accent-btc)',
            padding: '7px 17px',
            borderRadius: '100px',
            letterSpacing: '0.04em',
            transition: 'background-color 0.15s, color 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--accent-btc)';
            e.currentTarget.style.color = 'var(--bg-void)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--accent-btc)';
          }}
        >
          Start Sandbox
        </a>
      </div>
    </nav>
  );
}
