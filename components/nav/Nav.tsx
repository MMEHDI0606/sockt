'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { exchangeForSession, logoutSession } from '@/utils/identity/client';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useIsMobile } from '@/hooks/useIsMobile';
import ThemeToggle from '@/components/theme/ThemeToggle';

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [taskCount] = useState('4,218');

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setIsAuthenticated(Boolean(data.user));
      setAuthLoaded(true);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      setIsAuthenticated(Boolean(session?.user));
      setAuthLoaded(true);
      const supabaseAccessToken = session?.access_token;
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && supabaseAccessToken) {
        try {
          await exchangeForSession(supabaseAccessToken);
        } catch {
          // session exchange failures surface on the next gated API call
        }
      } else if (event === 'SIGNED_OUT') {
        await logoutSession();
      }
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
          backgroundColor: 'var(--nav-glass)',
          duration: 0.4,
          ease: 'power2.out',
        }),
      onLeaveBack: () =>
        gsap.to(nav, {
          backgroundColor: 'rgba(15, 15, 15, 0)',
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
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--bg-border)',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: isMobile ? '0 16px' : '0 48px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Left: Logo mark */}
        <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: '5px', textDecoration: 'none' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 400,
              fontSize: isMobile ? '16px' : '18px',
              color: 'var(--logo-mark-color)',
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
        </Link>

        {/* Center: Nav links */}
        {!isMobile && (
          <div
            style={{
              display: 'flex',
              gap: '28px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            {/* {[
              { label: 'Departments', href: '/departments' },
              { label: 'Docs', href: '/docs' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'About', href: '/about' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                style={{ color: 'inherit', transition: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </Link>
            ))} */}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '16px' }}>
          {/* {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-brass)', display: 'inline-block', flexShrink: 0 }} />
              ▲ {taskCount} tasks today
            </div>
          )} */}
          <ThemeToggle compact={isMobile} />
          {authLoaded ? (
            isAuthenticated ? null : (
              <>
                <Link
                  href="https://github.com/sockt-dev/sockt"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: isMobile ? '11px' : '12px',
                    color: 'var(--bg-void)',
                    background: 'var(--text-primary)',
                    padding: isMobile ? '6px 12px' : '7px 18px',
                    borderRadius: '6px',
                    letterSpacing: '0.06em',
                    fontWeight: 700,
                    transition: 'background 0.12s ease',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#09090B'; }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--text-primary)';
                    e.currentTarget.style.color = 'var(--bg-void)';
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  GET STARTED
                </Link>
              </>
            )
          ) : null}
        </div>
      </div>
    </nav>
  );
}
