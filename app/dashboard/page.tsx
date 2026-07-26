import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { createTopupCheckoutAction } from '@/app/dashboard/actions';
import ApiKeysPanel from '@/components/dashboard/ApiKeysPanel';
import SyncCredits from './SyncCredits';
import { Suspense } from 'react';

// Client sub-component for console data
import { default as ConsoleOverviewStats } from '@/components/dashboard/ConsoleOverviewStats';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  if (!user) redirect('/login');

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
      if (!prefix || row.is_active === false) return null;
      return {
        id: row.key_hash,
        preview: `${prefix}****`,
        createdAt: row.created_at ?? null,
      };
    })
    .filter(
      (value): value is { id: string; preview: string; createdAt: string | null } =>
        Boolean(value),
    );

  const balanceSubcents =
    typeof profile?.credit_balance_subcents === 'number'
      ? profile.credit_balance_subcents
      : 0;
  const balanceUsd = balanceSubcents / 10_000_000;

  return (
    <div style={{ maxWidth: 1280 }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: 'var(--font-headline)',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            margin: '0 0 4px',
          }}
        >
          Overview
        </h1>
        <p
          style={{
            fontSize: 13,
            fontFamily: 'var(--font-body)',
            color: 'var(--text-secondary)',
            margin: 0,
          }}
        >
          Your workspace at a glance
        </p>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <ConsoleOverviewStats />
      </Suspense>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 16,
        }}
      >
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--bg-border)',
            borderTop: '1px solid var(--border-top-highlight)',
            borderRadius: 'var(--radius-card)',
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              marginBottom: 12,
            }}
          >
            Credit Balance
          </div>
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              fontFamily: 'var(--font-headline)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
            }}
          >
            ${balanceUsd.toFixed(2)} USD
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'var(--accent-green)',
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-secondary)',
              }}
            >
              Active
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              marginTop: 12,
            }}
          >
            Credits are consumed when your agents provision CPU/GPU sandboxes.
          </p>
          <form action={createTopupCheckoutAction} style={{ marginTop: 12 }}>
            <button
              type="submit"
              style={{
                background: 'var(--text-primary)',
                color: 'var(--bg-void)',
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--mono-cta)',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '8px 20px',
                border: 'none',
                borderRadius: 'var(--radius-btn)',
                cursor: 'pointer',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
            >
              Top up credits
            </button>
          </form>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--bg-border)',
            borderTop: '1px solid var(--border-top-highlight)',
            borderRadius: 'var(--radius-card)',
            padding: 20,
          }}
        >
          <ApiKeysPanel
            initialKeys={apiKeys.map((k) => ({
              id: k.id,
              preview: k.preview,
              createdAt: k.createdAt || '',
            }))}
          />
        </div>
      </div>

      <SyncCredits currentBalance={balanceUsd} />
    </div>
  );
}
