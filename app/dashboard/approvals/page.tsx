'use client';

import { useEffect, useState } from 'react';
import { getApprovals, decideApproval } from '@/lib/console/client';
import type { Approval } from '@/lib/console/types';

const C = {
  void: 'var(--bg-void)',
  surface: 'var(--bg-surface)',
  raised: 'var(--bg-raised)',
  border: 'var(--bg-border)',
  primary: 'var(--text-primary)',
  secondary: 'var(--text-secondary)',
  mono: 'var(--font-mono)',
  body: 'var(--font-body)',
  headline: 'var(--font-headline)',
  green: 'var(--accent-green)',
  red: 'var(--accent-red)',
  brass: 'var(--accent-brass)',
  monoMicro: 'var(--mono-micro)',
  monoCta: 'var(--mono-cta)',
  radiusBtn: 'var(--radius-btn)',
  radiusCard: 'var(--radius-card)',
};

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp * 1000;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function TierBadge({ tier }: { tier: number }) {
  const colors: Record<number, { bg: string; color: string }> = {
    1: { bg: 'rgba(109,109,120,.15)', color: C.secondary },
    2: { bg: 'rgba(96,165,250,.15)', color: '#60A5FA' },
    3: { bg: 'rgba(245,158,11,.15)', color: '#F59E0B' },
    4: { bg: 'rgba(229,62,62,.15)', color: C.red },
  };
  const c = colors[tier] || colors[1];
  return (
    <span
      style={{
        fontFamily: C.mono,
        fontSize: 10,
        fontWeight: 500,
        padding: '2px 8px',
        borderRadius: 999,
        background: c.bg,
        color: c.color,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      Tier {tier}
    </span>
  );
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);
  const [expandedContext, setExpandedContext] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        setError(null);
        const data = await getApprovals();
        setApprovals(data.filter((a) => a.status === 'pending'));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load approvals');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  async function handleDecide(id: string, approved: boolean) {
    try {
      setActing(id);
      await decideApproval(id, approved);
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process approval');
    } finally {
      setActing(null);
    }
  }

  return (
    <div style={{ maxWidth: 1280 }}>
      <div style={{ marginBottom: 24 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: C.headline,
            color: C.primary,
            letterSpacing: '-0.02em',
            margin: '0 0 4px',
          }}
        >
          Approvals
        </h1>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: 0 }}>
          Human-in-the-loop review queue for escalated agent actions
        </p>
      </div>

      {loading && (
        <div
          style={{
            color: C.secondary,
            fontSize: 13,
            fontFamily: C.body,
            padding: '24px 0',
            textAlign: 'center',
          }}
        >
          Loading...
        </div>
      )}
      {error && (
        <div
          style={{
            background: 'rgba(229,62,62,0.08)',
            border: '1px solid rgba(229,62,62,0.25)',
            borderRadius: 8,
            padding: '12px 16px',
            color: C.red,
            fontFamily: C.mono,
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}
      {!loading && !error && approvals.length === 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '48px 24px',
            color: C.secondary,
            fontSize: 13,
            fontFamily: C.body,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 28, opacity: 0.4, marginBottom: 8 }}>&#10003;</div>
          <div>No pending approvals. All caught up.</div>
        </div>
      )}

      {!loading &&
        !error &&
        approvals.map((a) => (
          <div
            key={a.id}
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderTop: '1px solid var(--border-top-highlight)',
              borderRadius: C.radiusCard,
              padding: 20,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontFamily: C.mono,
                      fontSize: 11,
                      color: C.secondary,
                      letterSpacing: '0.04em',
                    }}
                  >
                    {a.taskId.slice(0, 12)}...
                  </span>
                  <TierBadge tier={a.tier} />
                  <span
                    style={{
                      fontFamily: C.mono,
                      fontSize: 10,
                      color: C.secondary,
                    }}
                  >
                    {formatTimeAgo(a.requestedAt)}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: C.body,
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.primary,
                    marginBottom: 8,
                  }}
                >
                  {a.action}
                </div>
                <button
                  onClick={() =>
                    setExpandedContext(expandedContext === a.id ? null : a.id)
                  }
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontFamily: C.mono,
                    fontSize: 10,
                    color: C.secondary,
                    cursor: 'pointer',
                    padding: 0,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {expandedContext === a.id ? 'Hide context' : 'Show context'}
                </button>
                {expandedContext === a.id && (
                  <pre
                    style={{
                      marginTop: 8,
                      padding: 12,
                      background: C.raised,
                      border: `1px solid ${C.border}`,
                      borderRadius: C.radiusBtn,
                      fontFamily: C.mono,
                      fontSize: 11,
                      color: C.secondary,
                      overflowX: 'auto',
                      maxHeight: 200,
                      overflowY: 'auto',
                    }}
                  >
                    {JSON.stringify(a.context, null, 2)}
                  </pre>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => handleDecide(a.id, true)}
                  disabled={acting === a.id}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${C.green}`,
                    color: C.green,
                    fontFamily: C.mono,
                    fontSize: C.monoCta,
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '8px 20px',
                    borderRadius: C.radiusBtn,
                    cursor: acting === a.id ? 'not-allowed' : 'pointer',
                    opacity: acting === a.id ? 0.5 : 1,
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecide(a.id, false)}
                  disabled={acting === a.id}
                  style={{
                    background: 'transparent',
                    border: `1px solid ${C.red}`,
                    color: C.red,
                    fontFamily: C.mono,
                    fontSize: C.monoCta,
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '8px 20px',
                    borderRadius: C.radiusBtn,
                    cursor: acting === a.id ? 'not-allowed' : 'pointer',
                    opacity: acting === a.id ? 0.5 : 1,
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
