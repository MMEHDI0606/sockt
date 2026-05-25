import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { signOutAction, createTopupCheckoutAction } from '@/app/dashboard/actions';
import ApiKeysPanel from '@/components/dashboard/ApiKeysPanel';
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
  const balanceSats = Math.floor(balanceUsd * 100000000);

  const userEmail = user.email || 'unknown@sockt.dev';
  const displayName =
    (typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()) ||
    (typeof user.user_metadata?.name === 'string' && user.user_metadata.name.trim()) ||
    userEmail.split('@')[0] ||
    'Sockt User';
  const userInitials = initialsFromName(displayName);

  const navItems: Array<{ label: string; href: string; active?: boolean }> = [
    { label: 'Dashboard', href: '/dashboard', active: true },
    { label: 'Sandboxes', href: '/dashboard#sandboxes' },
    { label: 'Billing', href: '/dashboard#billing' },
    { label: 'API Keys', href: '/dashboard#api-keys' },
    { label: 'Account', href: '/dashboard/account' },
    { label: 'Logs', href: '/dashboard#recent-logs' },
    { label: 'Settings', href: '/dashboard/settings' },
  ];

  const tierRows = [
    { tier: 'nano', resources: '0.25 vCPU · 256 MB', price: '0.3 sats/s' },
    { tier: 'micro', resources: '1 vCPU · 1 GB', price: '0.8 sats/s' },
    { tier: 'standard', resources: '2-4 vCPU · 8 GB', price: '4 sats/s' },
    { tier: 'gpu_small', resources: '4 + T4 · 16 GB', price: '8 sats/s' },
  ];

  const recentLogs = apiKeys.slice(0, 5).map((key) => ({
    timestamp: key.createdAt ? new Date(key.createdAt).toLocaleString() : 'Unknown',
    event: `API key ${key.preview} active`,
    status: 'active',
  }));

  const budgetUsedPercent = 0;

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--dashboard-bg)', color: 'var(--dashboard-text)' }}
    >
      <div className="mx-auto min-h-screen w-full max-w-[1360px] p-4 md:p-6">
        <div className="flex min-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-bg)]">
          <aside className="hidden w-[220px] shrink-0 border-r-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] p-4 md:flex md:flex-col">
            <div className="mb-6 border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-bg)] p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-grid h-6 w-6 place-items-center rounded-md bg-[var(--dashboard-accent)] text-[var(--dashboard-bg)] font-mono text-xs">B</span>
                <span className="font-display text-lg text-[var(--dashboard-text)]">Sockt</span>
              </div>
              <p className="font-body text-xs text-[var(--dashboard-muted)]">Agent infrastructure</p>
            </div>

            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--dashboard-muted)]">Overview</div>
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`rounded-lg border-[0.5px] px-3 py-2.5 text-sm transition-colors ${
                    item.active
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
                <Link
                  href="/docs"
                  className="rounded-lg border-[0.5px] border-[var(--dashboard-border)] px-4 py-2 text-sm font-display text-[var(--dashboard-text)] hover:border-[var(--dashboard-accent)] hover:text-[var(--dashboard-accent)]"
                >
                  New sandbox
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

            <div id="sandboxes" className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--dashboard-muted)]">Balance</p>
                <p className="mt-2 font-display text-4xl text-[var(--dashboard-text)]">${balanceUsd.toFixed(2)}</p>
                <p className="mt-1 text-sm text-[var(--dashboard-muted)]">{balanceSats.toLocaleString()} sats</p>
              </article>

              <article className="rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--dashboard-muted)]">Active sandboxes</p>
                <p className="mt-2 font-display text-4xl text-[var(--dashboard-text)]">0</p>
                <p className="mt-1 text-sm text-[var(--dashboard-muted)]">0 running</p>
              </article>

              <article className="rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--dashboard-muted)]">Spent this month</p>
                <p className="mt-2 font-display text-4xl text-[var(--dashboard-text)]">$0.00</p>
                <p className="mt-1 text-sm text-[var(--dashboard-muted)]">0% vs last month</p>
              </article>

              <article className="rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--dashboard-muted)]">API calls (24h)</p>
                <p className="mt-2 font-display text-4xl text-[var(--dashboard-text)]">-</p>
                <p className="mt-1 text-sm text-[var(--dashboard-muted)]">No activity yet</p>
              </article>
            </div>

            <div className="mb-6 grid gap-4 xl:grid-cols-2">
              <section id="billing" className="rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl text-[var(--dashboard-text)]">Billing</h2>
                  <form action={createTopupCheckoutAction}>
                    <button
                      type="submit"
                      className="rounded-lg border-[0.5px] border-[var(--dashboard-accent)] px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] text-[var(--dashboard-accent)] hover:bg-[var(--dashboard-accent)] hover:text-[var(--dashboard-bg)]"
                    >
                      Top up
                    </button>
                  </form>
                </div>

                <p className="text-sm text-[var(--dashboard-muted)]">Lightning balance</p>
                <p className="mt-1 font-display text-4xl text-[var(--dashboard-text)]">${balanceUsd.toFixed(2)} <span className="text-base text-[var(--dashboard-muted)]">USD</span></p>

                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--dashboard-border)]">
                  <div className="h-full bg-[var(--dashboard-accent)]" style={{ width: `${budgetUsedPercent}%` }} />
                </div>
                <p className="mt-2 text-xs text-[var(--dashboard-muted)]">{budgetUsedPercent}% of monthly budget used</p>

                <div className="mt-5 space-y-2">
                  {tierRows.map((row) => (
                    <div key={row.tier} className="grid grid-cols-[90px_1fr_auto] items-center gap-2 border-b-[0.5px] border-[var(--dashboard-border)] py-1.5 text-sm">
                      <span className="font-mono uppercase text-[var(--dashboard-text)]">{row.tier}</span>
                      <span className="text-[var(--dashboard-muted)]">{row.resources}</span>
                      <span className="font-mono text-[var(--dashboard-text)]">{row.price}</span>
                    </div>
                  ))}
                </div>

                <Suspense fallback={null}>
                  <SyncCredits currentBalance={balance} />
                </Suspense>
              </section>

              <div id="api-keys">
                <ApiKeysPanel initialKeys={apiKeys} />
              </div>
            </div>

            <section id="recent-logs" className="rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-xl text-[var(--dashboard-text)]">Recent logs</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse">
                  <thead>
                    <tr className="border-b-[0.5px] border-[var(--dashboard-border)] text-left text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--dashboard-muted)]">
                      <th className="py-2 pr-4">Timestamp</th>
                      <th className="py-2 pr-4">Event</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.length ? (
                      recentLogs.map((log, index) => (
                        <tr key={`${log.timestamp}-${index}`} className="border-b-[0.5px] border-[var(--dashboard-border)] text-sm">
                          <td className="py-3 pr-4 text-[var(--dashboard-muted)]">{log.timestamp}</td>
                          <td className="py-3 pr-4 text-[var(--dashboard-text)]">{log.event}</td>
                          <td className="py-3">
                            <span className="inline-flex rounded-full border-[0.5px] border-[var(--dashboard-accent)] px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.12em] text-[var(--dashboard-accent)]">
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-5 text-sm text-[var(--dashboard-muted)]" colSpan={3}>
                          No recent logs yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}
