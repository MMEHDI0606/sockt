'use client';

import type React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { getAccessToken, exchangeForSession } from '@/utils/identity/client';
import { createClient as createSupabaseClient } from '@/utils/supabase/client';

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'OBSERVE',
    items: [
      { label: 'Overview', href: '/dashboard', icon: '◉' },
      { label: 'Tasks', href: '/dashboard/tasks', icon: '≡' },
      { label: 'Approvals', href: '/dashboard/approvals', icon: '✓' },
      { label: 'Monitor', href: '/dashboard/monitor', icon: '⚡' },
      { label: 'Memory', href: '/dashboard/memory', icon: '◈' },
    ],
  },
  {
    label: 'CONFIGURE',
    items: [
      { label: 'Teams', href: '/dashboard/teams', icon: '⬡' },
      { label: 'Agents', href: '/dashboard/agents', icon: '# ' },
      { label: 'LLM Keys', href: '/dashboard/llm-keys', icon: '🔑' },
      { label: 'Tools', href: '/dashboard/tools', icon: '⚙' },
      { label: 'Slack', href: '/dashboard/slack', icon: '⚡' },
    ],
  },
  {
    label: 'ACCOUNT',
    items: [
      { label: 'Account', href: '/dashboard/account', icon: '👤' },
      { label: 'Docs', href: '/dashboard/docs', icon: '📄' },
    ],
  },
];

export interface DashboardShellProps {
  userName: string;
  userEmail: string;
  children: React.ReactNode;
}

export default function DashboardShell({ userName, userEmail, children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  // Ensure the identity access token is available before console API calls.
  // On page refresh the in-memory token is lost; re-exchange from the
  // Supabase session so the first /console/* request doesn't 401+refresh.
  useEffect(() => {
    if (getAccessToken()) return;
    let cancelled = false;
    (async () => {
      try {
        const supabase = createSupabaseClient();
        const { data } = await supabase.auth.getSession();
        if (cancelled || !data.session?.access_token) return;
        await exchangeForSession(data.session.access_token);
      } catch {
        // The identityFetch refresh-on-401 path handles this fallback.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  const C = {
    void: 'var(--bg-void)',
    surface: 'var(--bg-surface)',
    raised: 'var(--bg-raised)',
    border: 'var(--bg-border)',
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    mono: 'var(--font-mono)',
    body: 'var(--font-body)',
    brass: 'var(--accent-brass)',
  };

  const toggleMobile = useCallback(() => setMobileOpen((v) => !v), []);

  const sidebarContent = (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: 28, padding: '24px 0' }}>
      <div style={{ padding: '0 20px', marginBottom: 4 }}>
        <Link href="/dashboard" style={{
          fontSize: 18, fontWeight: 700, fontFamily: C.mono,
          color: C.primary, textDecoration: 'none', letterSpacing: '-0.02em',
        }}>
          {'{*} SOCKT'}
        </Link>
        <div style={{ fontSize: 10, fontFamily: C.mono, color: C.secondary, marginTop: 2, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Console
        </div>
      </div>

      {NAV_GROUPS.map((group) => (
        <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div style={{
            padding: '0 20px 6px',
            fontSize: 9, fontFamily: C.mono, fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: '0.16em', color: C.secondary,
          }}>
            {group.label}
          </div>
          {group.items.map((item) => {
            const active = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 20px', margin: '0 8px', borderRadius: 8,
                  fontSize: 13, fontFamily: C.mono, fontWeight: 500,
                  color: active ? C.primary : C.secondary,
                  background: active ? C.raised : 'transparent',
                  border: active ? `1px solid ${C.border}` : '1px solid transparent',
                  textDecoration: 'none',
                  transition: 'background 150ms ease, border-color 150ms ease',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = C.raised;
                    e.currentTarget.style.color = C.primary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = C.secondary;
                  }
                }}
              >
                <span style={{ fontSize: 14 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}

      <div style={{ marginTop: 'auto', padding: '12px 20px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 10, fontFamily: C.mono, color: C.secondary, letterSpacing: '0.08em',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-green)',
            boxShadow: '0 0 6px rgba(34,208,122,0.4)',
            flexShrink: 0,
          }} />
          gateway online
        </div>
      </div>
    </nav>
  );

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: C.void }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <aside style={{
          width: 240, flexShrink: 0,
          background: C.surface,
          borderRight: `1px solid ${C.border}`,
          display: 'flex', flexDirection: 'column',
          overflowY: 'auto',
        }}>
          {sidebarContent}
        </aside>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(9,9,11,0.6)',
              backdropFilter: 'blur(4px)', zIndex: 99,
            }}
          />
          <aside style={{
            position: 'fixed', top: 0, left: 0, bottom: 0,
            width: 280, background: C.surface,
            borderRight: `1px solid ${C.border}`,
            display: 'flex', flexDirection: 'column',
            zIndex: 100, boxShadow: '8px 0 32px rgba(0,0,0,0.5)',
          }}>
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top header */}
        <header style={{
          height: 52, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
          borderBottom: `1px solid ${C.border}`,
          background: C.surface,
        }}>
          {/* Left: mobile hamburger + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={toggleMobile}
              style={{
                background: 'none', border: 'none', color: C.primary,
                fontSize: 18, cursor: 'pointer', padding: 4,
                display: isMobile ? 'flex' : 'none',
                alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <span style={{ fontFamily: C.mono, fontSize: 11, color: C.secondary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {NAV_GROUPS.flatMap((g) => g.items).find((i) => {
                if (i.href === '/dashboard') return pathname === '/dashboard';
                return pathname.startsWith(i.href);
              })?.label || 'Dashboard'}
            </span>
          </div>

          {/* Right: user area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontFamily: C.mono, fontWeight: 500, color: C.primary }}>{userName}</div>
              <div style={{ fontSize: 10, fontFamily: C.mono, color: C.secondary }}>{userEmail}</div>
            </div>
            <div style={{
              width: 30, height: 30, borderRadius: '50%',
              background: C.raised, border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontFamily: C.mono, fontWeight: 700, color: C.primary,
            }}>
              {initials}
            </div>
            <form action="/dashboard/actions" onSubmit={(e) => {
              e.preventDefault();
              document.cookie = 'sb-access-token=; Max-Age=0; path=/';
              window.location.href = '/api/auth/logout' as any;
              router.push('/');
            }}>
              <button
                type="button"
                onClick={async () => {
                  try {
                    const { createClient } = await import('@/utils/supabase/client');
                    const supabase = createClient();
                    await supabase.auth.signOut();
                    router.push('/');
                    router.refresh();
                  } catch {
                    router.push('/');
                  }
                }}
                style={{
                  background: 'none', border: `1px solid ${C.border}`, borderRadius: 6,
                  color: C.secondary, fontFamily: C.mono, fontSize: 10, fontWeight: 500,
                  padding: '4px 12px', cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        {/* Page content */}
        <main style={{
          flex: 1, overflowY: 'auto',
          padding: '28px 32px',
          background: C.void,
        }}>
          {children}
        </main>
      </div>
    </div>
  );
}
