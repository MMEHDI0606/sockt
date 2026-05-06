'use client';

import { useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useState } from 'react';

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setIsAuthenticated(Boolean(data.user));
      setAuthLoaded(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setIsAuthenticated(Boolean(session?.user));
      setAuthLoaded(true);
    });

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const trigger = ScrollTrigger.create({
      start: 20,
      onEnter: () =>
        gsap.to(nav, {
          backgroundColor: 'rgba(15, 15, 15, 0.6)',
          borderBottomColor: 'var(--bg-border)',
          duration: 0.4,
          ease: 'power2.out',
        }),
      onLeaveBack: () =>
        gsap.to(nav, {
          backgroundColor: 'rgba(15, 15, 15, 0)',
          borderBottomColor: 'transparent',
          duration: 0.3,
          ease: 'power2.inOut',
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
          padding: isMobile ? '0 14px' : '0 64px',
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
              fontSize: isMobile ? '16px' : '18px',
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
              fontSize: isMobile ? '16px' : '18px',
              color: 'var(--text-primary)',
              letterSpacing: '0.01em',
              lineHeight: 1,
            }}
          >
            Sockt
          </span>
        </a>

        {/* Center: Nav links */}
        {!isMobile && (
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
            {[
              { label: 'Use Cases', href: '/#use-cases' },
              { label: 'Docs', href: '/docs' },
              { label: 'Pricing', href: '/#pricing' },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{ color: 'inherit', transition: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px' }}>
          {authLoaded && isAuthenticated ? (
            <a
              href="/dashboard"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: isMobile ? '12px' : '14px',
                color: 'var(--accent-btc)',
                border: '1px solid var(--accent-btc)',
                padding: isMobile ? '6px 10px' : '7px 17px',
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
              Dashboard
            </a>
          ) : (
            <>
              <a
                href="/login"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: isMobile ? '11px' : '12px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.06em',
                  padding: isMobile ? '6px 8px' : '7px 10px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                Log In
              </a>
              <a
                href="/signup"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? '12px' : '14px',
                  color: 'var(--accent-btc)',
                  border: '1px solid var(--accent-btc)',
                  padding: isMobile ? '6px 10px' : '7px 17px',
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
                Create Account
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
