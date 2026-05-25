import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { signOutAction } from '@/app/dashboard/actions';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function initialsFromName(name: string): string {
  const parts = name
    .split(' ')
    .map((part) => part.trim())
    .filter(Boolean);

  if (!parts.length) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
}

export default async function DashboardAccountPage() {
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
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Sandboxes', href: '/dashboard#sandboxes' },
    { label: 'Billing', href: '/dashboard#billing' },
    { label: 'API Keys', href: '/dashboard#api-keys' },
    { label: 'Account', href: '/dashboard/account', active: true },
    { label: 'Logs', href: '/dashboard#recent-logs' },
    { label: 'Settings', href: '/dashboard/settings' },
  ];

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
            <header className="mb-6 border-b-[0.5px] border-[var(--dashboard-border)] pb-5">
              <h1 className="font-display text-3xl leading-tight text-[var(--dashboard-text)]">Account</h1>
              <p className="mt-1 text-sm text-[var(--dashboard-muted)]">Identity and profile details from your active session</p>
            </header>

            <div className="grid gap-4 lg:grid-cols-2">
              <section className="rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-5">
                <h2 className="mb-4 font-display text-xl text-[var(--dashboard-text)]">Profile</h2>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--dashboard-muted)]">Name</dt>
                    <dd className="mt-1 text-[var(--dashboard-text)]">{displayName}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--dashboard-muted)]">Email</dt>
                    <dd className="mt-1 text-[var(--dashboard-text)]">{userEmail}</dd>
                  </div>
                  <div>
                    <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--dashboard-muted)]">User ID</dt>
                    <dd className="mt-1 break-all text-[var(--dashboard-text)]">{user.id}</dd>
                  </div>
                </dl>
              </section>

              <section className="rounded-xl border-[0.5px] border-[var(--dashboard-border)] bg-[var(--dashboard-card)] p-5">
                <h2 className="mb-4 font-display text-xl text-[var(--dashboard-text)]">Account Status</h2>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--dashboard-muted)]">Credit Balance</p>
                    <p className="mt-1 text-2xl font-display text-[var(--dashboard-text)]">${balanceUsd.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--dashboard-muted)]">Actions</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Link
                        href="/dashboard/settings"
                        className="rounded-lg border-[0.5px] border-[var(--dashboard-border)] px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] text-[var(--dashboard-text)] hover:border-[var(--dashboard-accent)] hover:text-[var(--dashboard-accent)]"
                      >
                        Open settings
                      </Link>
                      <Link
                        href="/forgot-password"
                        className="rounded-lg border-[0.5px] border-[var(--dashboard-border)] px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] text-[var(--dashboard-text)] hover:border-[var(--dashboard-accent)] hover:text-[var(--dashboard-accent)]"
                      >
                        Reset password
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
