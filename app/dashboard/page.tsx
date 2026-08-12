import { Suspense } from 'react';
import Link from 'next/link';
import { default as ConsoleOverviewStats } from '@/components/dashboard/ConsoleOverviewStats';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
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

      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--bg-border)',
            borderTop: '1px solid var(--border-top-highlight)',
            borderRadius: 'var(--radius-card)',
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap' as const,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginBottom: 8,
              }}
            >
              Get started
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                fontFamily: 'var(--font-headline)',
                color: 'var(--text-primary)',
              }}
            >
              Connect Slack, add your provider keys, and deploy a department.
            </div>
          </div>
          <Link
            href="/dashboard/deploy"
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
              textDecoration: 'none',
              display: 'inline-block',
              whiteSpace: 'nowrap' as const,
            }}
          >
            Deploy a Department
          </Link>
        </div>
      </div>
    </div>
  );
}