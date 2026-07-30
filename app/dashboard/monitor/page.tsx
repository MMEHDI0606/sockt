'use client';

import { useEffect, useState } from 'react';
import { getIntegrationHealth, getAlerts, getFleetBenchmarks, getRateLimits, acknowledgeAlert, resolveAlert } from '@/lib/console/client';
import type { IntegrationHealth, ConsoleAlert, FleetBenchmark } from '@/lib/console/types';
import type { RateLimit } from '@/lib/console/client';

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

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    info: { bg: 'rgba(96,165,250,.15)', color: '#60A5FA' },
    warning: { bg: 'rgba(245,158,11,.15)', color: '#F59E0B' },
    critical: { bg: 'rgba(229,62,62,.15)', color: C.red },
  };
  const c = colors[severity] || colors.info;
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
      {severity}
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

export default function MonitorPage() {
  const [integrations, setIntegrations] = useState<IntegrationHealth[]>([]);
  const [alerts, setAlerts] = useState<ConsoleAlert[]>([]);
  const [benchmarks, setBenchmarks] = useState<FleetBenchmark[]>([]);
  const [rateLimits, setRateLimits] = useState<RateLimit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actingAlert, setActingAlert] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [iData, aData, bData, rData] = await Promise.allSettled([
          getIntegrationHealth(),
          getAlerts(),
          getFleetBenchmarks(),
          getRateLimits(),
        ]);
        if (!cancelled) {
          if (iData.status === 'fulfilled') setIntegrations(iData.value);
          if (aData.status === 'fulfilled') setAlerts(aData.value);
          if (bData.status === 'fulfilled') setBenchmarks(bData.value);
          if (rData.status === 'fulfilled') setRateLimits(rData.value);
          const allFailed = [iData, aData, bData].every((r) => r.status === 'rejected');
          if (allFailed) throw new Error((iData as PromiseRejectedResult).reason?.message || 'Failed to load monitor data');
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load monitor data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchAll();
    const interval = setInterval(fetchAll, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  async function handleAcknowledge(id: string) {
    try {
      setActingAlert(id);
      await acknowledgeAlert(id);
      setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'acknowledged' } : a)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to acknowledge alert');
    } finally {
      setActingAlert(null);
    }
  }

  async function handleResolve(id: string) {
    try {
      setActingAlert(id);
      await resolveAlert(id);
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve alert');
    } finally {
      setActingAlert(null);
    }
  }

  const healthyIntegrations = integrations.filter((i) => i.status === 'healthy').length;
  const activeAlerts = alerts.filter((a) => a.status === 'active').length;
  const fleetStatus = integrations.every((i) => i.status === 'healthy')
    ? 'All Healthy'
    : integrations.some((i) => i.status === 'unhealthy')
      ? 'Issues Detected'
      : 'Degraded';

  const stats = [
    { label: 'Integrations Healthy', value: `${healthyIntegrations}/${integrations.length}` },
    { label: 'Alerts Active', value: activeAlerts },
    { label: 'Benchmarks Tracked', value: benchmarks.length },
    { label: 'Fleet Status', value: fleetStatus },
  ];

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
          Monitor
        </h1>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: 0 }}>
          Fleet observability, alerts, and benchmarks
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

      {!loading && !error && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 12,
              marginBottom: 24,
            }}
          >
            {stats.map((s) => (
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

          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: 11,
                fontFamily: C.mono,
                color: C.secondary,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Alerts
            </div>
            {alerts.length === 0 ? (
              <div style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, padding: '16px 0' }}>
                No alerts.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {alerts.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderTop: '1px solid var(--border-top-highlight)',
                      borderRadius: C.radiusCard,
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <SeverityBadge severity={a.severity} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontFamily: C.body, color: C.primary }}>
                        {a.message}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 10,
                          marginTop: 4,
                          fontFamily: C.mono,
                          fontSize: 10,
                          color: C.secondary,
                        }}
                      >
                        <span>{a.integrationId.slice(0, 8)}...</span>
                        <span>{formatTimeAgo(a.createdAt)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      {a.status === 'active' && (
                        <button
                          onClick={() => handleAcknowledge(a.id)}
                          disabled={actingAlert === a.id}
                          style={{
                            background: 'transparent',
                            border: `1px solid ${C.border}`,
                            color: C.secondary,
                            fontFamily: C.mono,
                            fontSize: C.monoCta,
                            fontWeight: 500,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            padding: '6px 12px',
                            borderRadius: C.radiusBtn,
                            cursor: actingAlert === a.id ? 'not-allowed' : 'pointer',
                            opacity: actingAlert === a.id ? 0.5 : 1,
                          }}
                        >
                          Ack
                        </button>
                      )}
                      <button
                        onClick={() => handleResolve(a.id)}
                        disabled={actingAlert === a.id}
                        style={{
                          background: C.primary,
                          color: C.void,
                          fontFamily: C.mono,
                          fontSize: C.monoCta,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: C.radiusBtn,
                          cursor: actingAlert === a.id ? 'not-allowed' : 'pointer',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
                          opacity: actingAlert === a.id ? 0.5 : 1,
                        }}
                      >
                        Resolve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontFamily: C.mono, color: C.secondary, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
              Rate Limits
            </div>
            {rateLimits.length === 0 ? (
              <div style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, padding: '16px 0' }}>
                Rate limit data unavailable — monitor service may not be running.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {rateLimits.map((r) => {
                  const pct = Math.min(100, Math.round((r.current / r.max) * 100));
                  const barColor = pct > 85 ? C.red : pct > 60 ? '#F59E0B' : C.green;
                  return (
                    <div key={r.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: '1px solid var(--border-top-highlight)', borderRadius: C.radiusCard, padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontFamily: C.mono, fontSize: 12, color: C.primary }}>{r.name}</span>
                        <span style={{ fontFamily: C.mono, fontSize: 11, color: C.secondary }}>{r.current} / {r.max} <span style={{ opacity: 0.6 }}>({Math.round(r.windowMs / 1000)}s window)</span></span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: C.raised, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 2, transition: 'width 0.4s ease' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                fontFamily: C.mono,
                color: C.secondary,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 12,
              }}
            >
              Fleet Benchmarks
            </div>
            {benchmarks.length === 0 ? (
              <div style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, padding: '16px 0' }}>
                No benchmarks recorded yet.
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                {benchmarks.map((b, i) => (
                  <div
                    key={`${b.metric}-${i}`}
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderTop: '1px solid var(--border-top-highlight)',
                      borderRadius: C.radiusCard,
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: C.mono,
                        fontSize: 12,
                        color: C.primary,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {b.metric}
                    </span>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <span style={{ fontFamily: C.mono, fontSize: 11, color: C.secondary }}>
                        p50: <span style={{ color: C.primary }}>{b.p50}</span>
                      </span>
                      <span style={{ fontFamily: C.mono, fontSize: 11, color: C.secondary }}>
                        p90: <span style={{ color: C.primary }}>{b.p90}</span>
                      </span>
                      <span style={{ fontFamily: C.mono, fontSize: 11, color: C.secondary }}>
                        p99: <span style={{ color: C.primary }}>{b.p99}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
