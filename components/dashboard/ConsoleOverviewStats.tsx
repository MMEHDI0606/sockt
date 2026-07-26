'use client';

import { useEffect, useState } from 'react';
import { getTeams, getAgents, getTasks } from '@/lib/console/client';

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

export default function ConsoleOverviewStats() {
  const [stats, setStats] = useState<{ teams: number; agents: number; tasks: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const [teams, agents, tasks] = await Promise.all([
          getTeams(),
          getAgents(),
          getTasks(),
        ]);
        setStats({ teams: teams.length, agents: agents.length, tasks: tasks.length });
      } catch {
        // gracefully degrade, render nothing
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          color: C.secondary,
          fontSize: 13,
          fontFamily: C.body,
          padding: '16px 0',
          textAlign: 'center',
        }}
      >
        Loading stats...
      </div>
    );
  }

  if (!stats) return null;

  const items = [
    { label: 'Teams', value: stats.teams },
    { label: 'Agents', value: stats.agents },
    { label: 'Tasks', value: stats.tasks },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 12,
        marginBottom: 24,
      }}
    >
      {items.map((s) => (
        <div
          key={s.label}
          style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderTop: `1px solid var(--border-top-highlight)`,
            borderRadius: C.radiusCard,
            padding: 16,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              fontFamily: C.headline,
              color: C.primary,
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            {s.value}
          </div>
          <div
            style={{
              fontSize: 11,
              fontFamily: C.mono,
              color: C.secondary,
              marginTop: 4,
            }}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
