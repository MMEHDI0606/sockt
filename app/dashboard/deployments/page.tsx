'use client';

import { useState, useEffect } from 'react';
import { getDeployments, createDeployment, pauseDeployment, resumeDeployment, getTeams, getSlackWorkspaces } from '@/lib/console/client';
import type { Deployment, Team, SlackWorkspace } from '@/lib/console/client';

const C = {
  void: 'var(--bg-void)', surface: 'var(--bg-surface)', raised: 'var(--bg-raised)', border: 'var(--bg-border)',
  primary: 'var(--text-primary)', secondary: 'var(--text-secondary)', mono: 'var(--font-mono)', body: 'var(--font-body)',
  headline: 'var(--font-headline)', green: 'var(--accent-green)', red: 'var(--accent-red)', brass: 'var(--accent-brass)',
  monoMicro: 'var(--mono-micro)', monoCta: 'var(--mono-cta)', radiusBtn: 'var(--radius-btn)', radiusCard: 'var(--radius-card)',
};
const CARD = (p?: number) => ({ background: C.surface, border: '1px solid var(--bg-border)', borderTop: '1px solid var(--border-top-highlight)', borderRadius: C.radiusCard, padding: p ?? 20 });
const BTN_PRIMARY = (p?: string) => ({ background: C.primary, color: C.void, fontFamily: C.mono, fontSize: C.monoCta, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, padding: p ?? '8px 20px', border: 'none', borderRadius: C.radiusBtn, cursor: 'pointer', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)' });
const BTN_OUTLINE = { background: 'transparent', border: `1px solid var(--bg-border)`, color: C.secondary, fontFamily: C.mono, fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', padding: '6px 14px', borderRadius: C.radiusBtn, cursor: 'pointer' };
const MODAL_OVERLAY = { position: 'fixed' as const, inset: 0, background: 'rgba(9,9,11,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 };
const MODAL_PANEL = { ...CARD(24), width: 520, maxWidth: 'calc(100vw - 40px)', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' as const, borderRadius: 16 };
const STATUS_BADGE = (s: string) => {
  const m: Record<string, [string, string]> = {
    active: ['rgba(96,165,250,.15)', '#60A5FA'], paused: ['rgba(245,158,11,.15)', '#F59E0B'],
    inactive: ['rgba(109,109,120,.15)', C.secondary], failed: ['rgba(229,62,62,.15)', C.red],
    deploying: ['rgba(96,165,250,.15)', '#60A5FA'],
  };
  const [bg, co] = m[s] ?? m.inactive!;
  return { fontFamily: C.mono, fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 999, background: bg, color: co, textTransform: 'uppercase' as const, letterSpacing: '0.08em' };
};

const INPUT = { background: C.void, border: `1px solid var(--bg-border)`, borderRadius: 6, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' as const };
const LABEL = { fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase' as const, letterSpacing: '0.06em' };

export default function DeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [workspaces, setWorkspaces] = useState<SlackWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formTeamId, setFormTeamId] = useState('');
  const [formWorkspaceId, setFormWorkspaceId] = useState('');
  const [formChannels, setFormChannels] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [d, t, w] = await Promise.all([getDeployments(), getTeams(), getSlackWorkspaces()]);
      setDeployments(d);
      setTeams(t);
      setWorkspaces(w);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to load deployments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); const i = setInterval(fetchData, 10000); return () => clearInterval(i); }, []);

  const handleCreate = async () => {
    if (!formTeamId) return;
    setSubmitting(true);
    try {
      const channels = formChannels.split(',').map((c) => c.trim()).filter(Boolean);
      await createDeployment({ team_id: formTeamId, slack_workspace_id: formWorkspaceId || undefined, channels: channels.length ? channels : undefined });
      setShowModal(false);
      setFormTeamId(''); setFormWorkspaceId(''); setFormChannels('');
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to create deployment');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePause = async (d: Deployment) => {
    if (!confirm(`Pause deployment for team "${d.team_id}"?`)) return;
    try { await pauseDeployment(d.id); fetchData(); } catch (e: any) { setError(e.message); }
  };

  const handleResume = async (d: Deployment) => {
    try { await resumeDeployment(d.id); fetchData(); } catch (e: any) { setError(e.message); }
  };

  const teamName = (id: string) => teams.find((t) => t.id === id)?.name ?? id;
  const workspaceName = (id?: string) => id ? (workspaces.find((w) => w.id === id)?.workspace_id ?? id) : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: 0 }}>Deployments</h1>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: '4px 0 0 0' }}>Deploy agent teams to Slack workspaces and channels.</p>
      </div>

      {error && (
        <div style={{ ...CARD(), borderColor: C.red, color: C.red, fontFamily: C.mono, fontSize: 12 }}>
          {error} <button style={{ ...BTN_OUTLINE, marginLeft: 12 }} onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={BTN_PRIMARY()} onClick={() => setShowModal(true)}>Deploy Team</button>
      </div>

      {loading ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>Loading...</div>
      ) : deployments.length === 0 ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>No deployments yet. Deploy a team to a Slack workspace to get started.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['Team', 'Workspace', 'Channels', 'Status', 'Created', 'Actions'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deployments.map((d) => (
                <tr key={d.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '10px 12px', fontFamily: C.headline, fontSize: 14, fontWeight: 600, color: C.primary }}>{teamName(d.team_id)}</td>
                  <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 12, color: C.secondary }}>{workspaceName(d.slack_workspace_id)}</td>
                  <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 11, color: C.secondary }}>{(d.channels ?? []).join(', ') || '—'}</td>
                  <td style={{ padding: '10px 12px' }}><span style={STATUS_BADGE(d.status)}>{d.status}</span></td>
                  <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 11, color: C.secondary }}>{new Date(d.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '10px 12px', display: 'flex', gap: 6 }}>
                    {d.status === 'active' ? (
                      <button style={BTN_OUTLINE} onClick={() => handlePause(d)}>Pause</button>
                    ) : d.status === 'paused' ? (
                      <button style={{ ...BTN_OUTLINE, color: C.green, borderColor: C.green }} onClick={() => handleResume(d)}>Resume</button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={MODAL_OVERLAY} onClick={() => setShowModal(false)}>
          <div style={MODAL_PANEL} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: '0 0 4px 0' }}>Deploy Team</h2>
            <p style={{ fontSize: 12, fontFamily: C.body, color: C.secondary, margin: '0 0 20px 0' }}>Deploy an agent team to a Slack workspace.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={LABEL}>Team *</label>
                <select value={formTeamId} onChange={(e) => setFormTeamId(e.target.value)} style={{ ...INPUT }}>
                  <option value="">Select a team...</option>
                  {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={LABEL}>Slack Workspace</label>
                <select value={formWorkspaceId} onChange={(e) => setFormWorkspaceId(e.target.value)} style={{ ...INPUT }}>
                  <option value="">None (manual later)</option>
                  {workspaces.map((w) => <option key={w.id} value={w.id}>{w.workspace_id}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={LABEL}>Channels (comma-separated)</label>
                <input value={formChannels} onChange={(e) => setFormChannels(e.target.value)} style={INPUT} placeholder="e.g. general, growth-alerts" />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button style={BTN_OUTLINE} onClick={() => setShowModal(false)}>Cancel</button>
                <button style={BTN_PRIMARY()} disabled={submitting || !formTeamId} onClick={handleCreate}>
                  {submitting ? 'Deploying...' : 'Deploy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
