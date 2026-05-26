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
      <div className="mx-auto min-h-screen w-full max-w-[1360px] p-4 md:p-6">
        <div className="flex min-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-bg)]">
          <aside className="hidden w-[220px] shrink-0 border-r-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] p-4 md:flex md:flex-col">
            <div className="mb-8">
              <Link href="/" className="flex items-baseline gap-[5px] no-underline">
                <span className="font-mono text-lg text-[var(--dashboard-accent)]">{'{*}'}</span>
                <span className="font-display text-lg font-medium text-[var(--dashboard-text)]">Sockt</span>
              </Link>
            </div>

            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--dashboard-muted)]">Overview</div>
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-lg border-[0.5px] px-3 py-2.5 text-sm transition-colors ${item.active
                    ? 'border-[var(--dashboard-accent)] text-[var(--dashboard-accent)]'
                    : 'border-[var(--dashboard-border)] text-[var(--dashboard-text)] hover:border-[var(--dashboard-accent)] hover:text-[var(--dashboard-accent)]'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto border-t-[0.5px] border-[var(--dashboard-border)] pt-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-[var(--dashboard-accent)] text-[var(--dashboard-bg)] font-mono text-xs">
                  {userInitials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-display text-[var(--dashboard-text)]">{displayName}</p>
                  <p className="truncate text-xs text-[var(--dashboard-muted)]">{userEmail}</p>
                </div>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="w-full rounded-lg border-[0.5px] border-[var(--dashboard-border)] px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] text-[var(--dashboard-text)] hover:border-[var(--dashboard-accent)] hover:text-[var(--dashboard-accent)]"
                >
                  Sign out
                </button>
              </form>
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col p-4 md:p-6">
            <header className="mb-6 flex flex-col gap-4 border-b-[0.5px] border-[var(--dashboard-border)] pb-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h1 className="font-display text-3xl leading-tight text-[var(--dashboard-text)]">Dashboard</h1>
                <p className="mt-1 text-sm text-[var(--dashboard-muted)]">Manage compute, billing, and API access</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <ThemeToggle className="rounded-lg border-[0.5px] border-[var(--dashboard-border)] px-4 py-2 text-sm font-mono uppercase tracking-[0.08em] text-[var(--dashboard-text)] hover:border-[var(--dashboard-accent)] hover:text-[var(--dashboard-accent)]" />
                <Link
                  href="/"
                  className="rounded-lg border-[0.5px] border-[var(--dashboard-border)] px-4 py-2 text-sm font-display text-[var(--dashboard-text)] hover:border-[var(--dashboard-accent)] hover:text-[var(--dashboard-accent)]"
                >
                  Home
                </Link>
                <form action={createTopupCheckoutAction}>
                  <button
                    type="submit"
                    className="rounded-lg bg-[var(--dashboard-accent)] px-4 py-2 text-sm font-display text-[var(--dashboard-bg)] hover:opacity-90"
                  >
                    Top up
                  </button>
                </form>
              </div>
            </header>

            <div className="mb-6 grid gap-4 xl:grid-cols-2">
              <section id="billing" className="rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl text-[var(--dashboard-text)]">Credit Balance</h2>
                  <form action={createTopupCheckoutAction}>
                    <button
                      type="submit"
                      className="rounded-lg border-[0.5px] border-[var(--dashboard-accent)] px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] text-[var(--dashboard-accent)] hover:bg-[var(--dashboard-accent)] hover:text-[var(--dashboard-bg)]"
                    >
                      Top up
                    </button>
                  </form>
                </div>

                <p className="mt-1 font-display text-4xl text-[var(--dashboard-text)]">${balanceUsd.toFixed(2)} <span className="text-base text-[var(--dashboard-muted)]">USD</span></p>

                <Suspense fallback={null}>
                  <SyncCredits currentBalance={balance} />
                </Suspense>
              </section>

              <div id="api-keys">
                <ApiKeysPanel initialKeys={apiKeys} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
