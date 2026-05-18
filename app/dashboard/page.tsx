import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { signOutAction, createTopupCheckoutAction } from '@/app/dashboard/actions';
import ApiKeysPanel from '@/components/dashboard/ApiKeysPanel';
import SyncCredits from './SyncCredits';
import { Suspense } from 'react';

type ApiKeyRow = {
  key_hash: string;
  key_prefix?: string | null;
  is_active?: boolean | null;
  created_at?: string | null;
};

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
    .select('credit_balance_usd_cents')
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

  const balance = Number(profile?.credit_balance_usd_cents ?? 0);

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-5xl mx-auto grid gap-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-[var(--bg-border)]">
          <div>
            <h1 className="font-display text-4xl text-white mb-2">Dashboard</h1>
            <p className="text-[var(--text-secondary)] text-sm">
              Manage your account and API access for {user.email}
            </p>
          </div>

          <form action={signOutAction}>
            <button
              type="submit"
              className="px-4 py-2 border border-[var(--bg-border)] bg-black hover:bg-[#111] text-white rounded-lg text-xs font-mono tracking-wider transition-colors"
            >
              SIGN OUT
            </button>
          </form>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="border border-[var(--bg-border)] rounded-xl bg-[var(--bg-surface)] p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-[11px] font-mono text-[var(--accent-btc)] uppercase tracking-[0.2em]">
                Balance
              </h2>
              <form action={createTopupCheckoutAction}>
                <button
                  type="submit"
                  className="px-3 py-1.5 border border-[var(--accent-btc)] text-[var(--accent-btc)] hover:bg-[var(--accent-btc)] hover:text-black rounded-lg text-xs font-mono tracking-wider transition-colors"
                >
                  TOP UP
                </button>
              </form>
            </div>
            <p className="font-display text-5xl text-white">
              ${(balance / 100).toFixed(2)}
            </p>
            <Suspense fallback={null}>
              <SyncCredits currentBalance={balance} />
            </Suspense>
          </section>

          <ApiKeysPanel initialKeys={apiKeys} />
        </div>
      </div>
    </main>
  );
}
