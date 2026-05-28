import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { signOutAction, createTopupCheckoutAction } from '@/app/dashboard/actions';
import ApiKeysPanel from '@/components/dashboard/ApiKeysPanel';
import ThemeToggle from '@/components/theme/ThemeToggle';
import SyncCredits from './SyncCredits';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ApiKeyRow = {
  key_hash: string;
  key_prefix?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
};

function initialsFromName(name: string): string {
  const parts = name
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('credit_balance_subcents')
    .eq('id', user.id)
    .maybeSingle();

  const { data: rawKeys } = await supabase
    .from('api_keys')
    .select('key_hash, key_prefix, is_active, created_at')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const apiKeys = ((rawKeys ?? []) as ApiKeyRow[])
    .map((row) => {
      const prefix = row.key_prefix ?? '';
      if (!prefix || row.is_active === false) {
        return null;
      }

      return {
        id: row.key_hash,
        preview: `${prefix}****`,
        createdAt: row.created_at ?? null,
      };
    })
    .filter((value): value is { id: string; preview: string; createdAt: string | null } =>
      Boolean(value)
    );

  const balance = Number(profile?.credit_balance_subcents ?? 0);
  const balanceUsd = balance / 10000000;

  const userEmail = user.email || 'unknown@sockt.dev';
  const displayName =
    (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()) ||
    (typeof user.user_metadata?.name === 'string' && user.user_metadata.name.trim()) ||
    userEmail.split('@')[0] ||
    'Sockt User';
  const userInitials = initialsFromName(displayName);

  const navItems: Array<{ label: string; href: string; active?: boolean }> = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard', active: true },
    // { label: 'API Keys', href: '/dashboard#api-keys' },
    { label: 'Account', href: '/dashboard/account' },

  ];

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--dashboard-bg)', color: 'var(--dashboard-text)' }}
    >
      {/* Sleek Vercel-style Top Navigation Header */}
      <header
        style={{
          borderBottom: '1px solid var(--dashboard-border)',
          backgroundColor: 'var(--dashboard-sidebar)',
        }}
      >
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
          {/* Left Side: Logo & Workspace Breadcrumbs */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-baseline gap-[5px] no-underline">
              <span className="font-mono text-lg text-[var(--dashboard-accent)]">{'{*}'}</span>
              <span className="font-display text-lg font-medium text-[var(--dashboard-text)]">sockt.dev</span>
            </Link>
            <span className="font-mono text-sm text-[var(--dashboard-muted)]">/</span>
            <span className="font-mono text-xs text-[var(--dashboard-muted)]">Personal Workspace</span>
          </div>

          {/* Right Side: ThemeToggle, Profile and Sign Out */}
          <div className="flex items-center gap-4">
            <ThemeToggle className="rounded-lg border-[0.5px] border-[var(--dashboard-border)] px-3 py-1.5 text-xs font-mono uppercase tracking-[0.08em] text-[var(--dashboard-text)] hover:border-[var(--dashboard-accent)]" />
            <div className="flex items-center gap-3 border-l-[1px] border-[var(--dashboard-border)] pl-4">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-[var(--dashboard-accent)] font-mono text-xs font-semibold text-[var(--dashboard-bg)]">
                {userInitials}
              </div>
              <div className="hidden min-w-0 flex-col md:flex">
                <span className="truncate text-xs font-semibold text-[var(--dashboard-text)]">{displayName}</span>
                <span className="truncate text-[10px] text-[var(--dashboard-muted)]">{userEmail}</span>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-lg border-[0.5px] border-[var(--dashboard-border)] px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] text-[var(--dashboard-text)] hover:border-[var(--accent-red)] hover:text-[var(--accent-red)] transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Horizontal Navigation Sub-Tabs */}
        <div className="mx-auto max-w-[1280px] px-6">
          <nav className="flex gap-6">
            <Link
              href="/dashboard"
              className="border-b-2 border-[var(--dashboard-accent)] pb-3 pt-2 text-xs font-mono uppercase tracking-[0.1em] text-[var(--dashboard-text)]"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/account"
              className="border-b-2 border-transparent pb-3 pt-2 text-xs font-mono uppercase tracking-[0.1em] text-[var(--dashboard-muted)] hover:text-[var(--dashboard-text)] transition-colors"
            >
              Account Settings
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Spacious Content Grid */}
      <div className="mx-auto max-w-[1280px] px-6 py-8">
        {/* Welcome Banner */}
        <div className="mb-8 border-b-[0.5px] border-[var(--dashboard-border)] pb-6">
          <h2 className="font-display text-2xl font-semibold text-[var(--dashboard-text)]">
            Welcome back, {displayName.split(' ')[0]}
          </h2>
          <p className="mt-1 text-sm text-[var(--dashboard-muted)]">
            Manage your sandboxed compute credits and active API keys here.
          </p>
        </div>

        {/* Workspace Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Card 1: Credit Balance */}
          <section
            id="billing"
            className="rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-6 flex flex-col justify-between"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--dashboard-muted)]">
                  Credit Balance
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--accent-green)] uppercase tracking-[0.1em]">
                  <span className="h-2 w-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
                  Active
                </span>
              </div>
              <p className="font-display text-5xl font-semibold text-[var(--dashboard-text)]">
                ${balanceUsd.toFixed(2)}{' '}
                <span className="text-base font-normal text-[var(--dashboard-muted)]">USD</span>
              </p>
              <p className="mt-4 text-xs leading-relaxed text-[var(--dashboard-muted)]">
                Credits are debited automatically per request when your agents provision CPU/GPU sandboxes. Treat your balance as a compute budget allocation.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t-[0.5px] border-[var(--dashboard-border)] flex items-center justify-between">
              <span className="font-mono text-[10px] text-[var(--dashboard-muted)]">
                Secure checkout via Polar
              </span>
              <form action={createTopupCheckoutAction}>
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--dashboard-accent)] px-4 py-2 text-xs font-mono uppercase tracking-[0.12em] font-semibold text-[var(--dashboard-bg)] hover:opacity-90 transition-opacity"
                >
                  Top up credits
                </button>
              </form>
            </div>
          </section>

          {/* Card 2: API Keys Panel */}
          <div id="api-keys">
            <ApiKeysPanel initialKeys={apiKeys} />
          </div>
        </div>
      </div>
    </main>
  );
}
