'use client';

import { useEffect, useState } from 'react';
import { getTasks } from '@/lib/console/client';
import type { TaskSummary, TaskStatus } from '@/lib/console/types';

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

const STATUS_COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'escalated', label: 'Escalated' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'cancelled', label: 'Cancelled' },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    pending: { bg: 'rgba(109,109,120,.15)', color: C.secondary },
    in_progress: { bg: 'rgba(96,165,250,.15)', color: '#60A5FA' },
    active: { bg: 'rgba(96,165,250,.15)', color: '#60A5FA' },
    completed: { bg: 'rgba(34,208,122,.15)', color: C.green },
    escalated: { bg: 'rgba(245,158,11,.15)', color: '#F59E0B' },
    blocked: { bg: 'rgba(229,62,62,.15)', color: C.red },
    cancelled: { bg: 'rgba(38,38,43,.5)', color: C.secondary },
    deploying: { bg: 'rgba(96,165,250,.15)', color: '#60A5FA' },
    paused: { bg: 'rgba(245,158,11,.15)', color: '#F59E0B' },
    failed: { bg: 'rgba(229,62,62,.15)', color: C.red },
    healthy: { bg: 'rgba(34,208,122,.15)', color: C.green },
    unhealthy: { bg: 'rgba(229,62,62,.15)', color: C.red },
  };
  const c = colors[status] || colors.pending;
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
      {status}
    </span>
  );
}

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

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        setError(null);
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const grouped = STATUS_COLUMNS.reduce(
    (acc, col) => {
      acc[col.key] = tasks.filter((t) => t.status === col.key);
      return acc;
    },
    {} as Record<TaskStatus, TaskSummary[]>,
  );

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
          Tasks
        </h1>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: 0 }}>
          Kanban board of all agent tasks across your workspace
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
      {!loading && !error && tasks.length === 0 && (
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
          <div style={{ fontSize: 28, opacity: 0.4, marginBottom: 8 }}>&#9776;</div>
          <div>No tasks yet. Agent tasks will appear here as they run.</div>
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
          {STATUS_COLUMNS.map((col) => (
            <div
              key={col.key}
              style={{
                flex: '1 0 220px',
                minWidth: 220,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 4px',
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: C.secondary,
                  }}
                >
                  {col.label}
                </span>
                <span
                  style={{
                    fontFamily: C.mono,
                    fontSize: 11,
                    fontWeight: 600,
                    color: C.primary,
                    background: C.raised,
                    borderRadius: 999,
                    padding: '1px 8px',
                    minWidth: 20,
                    textAlign: 'center',
                  }}
                >
                  {grouped[col.key].length}
                </span>
              </div>

              {grouped[col.key].map((task) => (
                <div
                  key={task.id}
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.border}`,
                    borderTop: '1px solid var(--border-top-highlight)',
                    borderRadius: C.radiusCard,
                    padding: 14,
                  }}
                >
                  <StatusBadge status={task.status} />
                  <div
                    style={{
                      fontSize: 13,
                      fontFamily: C.body,
                      color: C.primary,
                      marginTop: 8,
                      lineHeight: 1.45,
                      wordBreak: 'break-word',
                    }}
                  >
                    {task.summary}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: C.mono,
                        fontSize: 10,
                        color: C.secondary,
                      }}
                    >
                      {formatTimeAgo(task.startedAt)}
                    </span>
                    <span
                      style={{
                        fontFamily: C.mono,
                        fontSize: 11,
                        fontWeight: 600,
                        color: C.green,
                      }}
                    >
                      ${task.costUsd.toFixed(4)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
