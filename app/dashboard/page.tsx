import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { signOutAction } from '@/app/dashboard/actions';
import ApiKeysPanel from '@/components/dashboard/ApiKeysPanel';

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

  const balance = Number(profile?.balance ?? 0);

  return (
    <main style={{ minHeight: '100vh', padding: '28px 20px 40px' }}>
      <section
        style={{
          maxWidth: '1080px',
          margin: '0 auto',
          display: 'grid',
          gap: '16px',
        }}
      >
        <header
          style={{
            border: '1px solid var(--bg-border)',
            borderRadius: '12px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(15,15,15,0.96), rgba(8,8,8,0.96))',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  color: 'var(--accent-btc)',
                  marginBottom: '8px',
                }}
              >
                CYBER-INDUSTRIAL DASHBOARD
              </p>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.7rem, 5vw, 2.8rem)',
                  marginBottom: '8px',
                  lineHeight: 1,
                }}
              >
                Welcome, {user.email}
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                All reads and writes are scoped to your authenticated user id via RLS.
              </p>
            </div>

            <form action={signOutAction}>
              <button
                type="submit"
                style={{
                  border: '1px solid var(--bg-border)',
                  backgroundColor: '#111',
                  color: 'var(--text-primary)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.07em',
                  cursor: 'pointer',
                }}
              >
                SIGN OUT
              </button>
            </form>
          </div>
        </header>

        <section
          style={{
            border: '1px solid var(--bg-border)',
            borderRadius: '12px',
            backgroundColor: 'var(--bg-surface)',
            padding: '20px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              marginBottom: '6px',
            }}
          >
            ACCOUNT BALANCE
          </p>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.9rem, 4.2vw, 2.8rem)',
              color: 'var(--accent-sats)',
              letterSpacing: '-0.02em',
            }}
          >
           $ {(balance/100).toFixed(2)}
          </p>
        </section>

        <ApiKeysPanel initialKeys={apiKeys} />
      </section>
    </main>
  );
}
