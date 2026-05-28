import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { signOutAction } from '@/app/dashboard/actions';
import ThemeToggle from '@/components/theme/ThemeToggle';
import AccountSettingsForm from '@/components/dashboard/AccountSettingsForm';

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
              <span className="font-display text-lg font-medium text-[var(--dashboard-text)]">Sockt</span>
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
              className="border-b-2 border-transparent pb-3 pt-2 text-xs font-mono uppercase tracking-[0.1em] text-[var(--dashboard-muted)] hover:text-[var(--dashboard-text)] transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/account"
              className="border-b-2 border-[var(--dashboard-accent)] pb-3 pt-2 text-xs font-mono uppercase tracking-[0.1em] text-[var(--dashboard-text)]"
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
            Account Settings
          </h2>
          <p className="mt-1 text-sm text-[var(--dashboard-muted)]">
            Identity, profile details, and account status from your active session.
          </p>
        </div>

        {/* Account Settings Forms & Purge controls */}
        <AccountSettingsForm
          initialDisplayName={displayName}
          initialEmail={userEmail}
          userId={user.id}
          balanceUsd={balanceUsd}
        />
      </div>
    </main>
  );
}
