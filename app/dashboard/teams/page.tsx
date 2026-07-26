'use client';

import { useState, useEffect } from 'react';
import { getTeams, createTeam, updateTeam, deleteTeam, getAgents } from '@/lib/console/client';
import type { Team, AgentDef } from '@/lib/console/client';

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
const MODAL_PANEL = { ...CARD(24), width: 500, maxWidth: 'calc(100vw - 40px)', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' as const, borderRadius: 16 };
const STATUS_BADGE = (s: string) => {
  const m: Record<string,[string,string]> = {
    active:['rgba(96,165,250,.15)','#60A5FA'], paused:['rgba(245,158,11,.15)','#F59E0B'],
    inactive:['rgba(109,109,120,.15)',C.secondary], failed:['rgba(229,62,62,.15)',C.red],
    deploying:['rgba(96,165,250,.15)','#60A5FA'], architect:['rgba(167,139,250,.15)','#A78BFA'],
    worker:['rgba(96,165,250,.15)','#60A5FA'], anthropic:['rgba(196,127,96,.15)','#C47F60'],
    openai:['rgba(16,163,127,.15)','#10A37F'], google:['rgba(66,133,244,.15)','#4285F4'],
    ollama:['rgba(109,109,120,.15)',C.secondary],
  };
  const [bg,co] = m[s] ?? m.inactive!;
  return { fontFamily: C.mono, fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 999, background: bg, color: co, textTransform: 'uppercase' as const, letterSpacing: '0.08em' };
};

export default function TeamsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [agents, setAgents] = useState<AgentDef[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formDepartment, setFormDepartment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [t, a] = await Promise.all([getTeams(), getAgents()]);
      setTeams(t);
      setAgents(a);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const agentCount = (teamId: string) => agents.filter((a) => a.team_id === teamId).length;

  const handleCreate = async () => {
    if (!formName.trim()) return;
    setSubmitting(true);
    try {
      await createTeam({ name: formName.trim(), department: formDepartment.trim() });
      setShowModal(false);
      setFormName('');
      setFormDepartment('');
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to create team');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePause = async (team: Team) => {
    if (!confirm(`Pause team "${team.name}"?`)) return;
    try {
      await updateTeam(team.id, { status: 'paused' });
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to pause team');
    }
  };

  const handleDelete = async (team: Team) => {
    if (!confirm(`Delete team "${team.name}"? This cannot be undone.`)) return;
    try {
      await deleteTeam(team.id);
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to delete team');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: 0 }}>Teams</h1>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: '4px 0 0 0' }}>Manage your organization&apos;s teams and their agent workloads.</p>
      </div>

      {error && (
        <div style={{ ...CARD(), borderColor: C.red, color: C.red, fontFamily: C.mono, fontSize: 12 }}>
          {error}
          <button style={{ ...BTN_OUTLINE, marginLeft: 12 }} onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={BTN_PRIMARY()} onClick={() => setShowModal(true)}>Create Team</button>
      </div>

      {loading ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>Loading...</div>
      ) : teams.length === 0 ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>
          No teams yet. Create your first team to get started.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Department</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Agents</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Created</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '10px 12px', fontFamily: C.headline, fontSize: 14, fontWeight: 600, color: C.primary }}>{team.name}</td>
                  <td style={{ padding: '10px 12px', fontFamily: C.body, fontSize: 13, color: C.secondary }}>{team.department || '—'}</td>
                  <td style={{ padding: '10px 12px' }}><span style={STATUS_BADGE(team.status)}>{team.status}</span></td>
                  <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 12, color: C.primary }}>{agentCount(team.id)}</td>
                  <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 11, color: C.secondary }}>{new Date(team.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '10px 12px', display: 'flex', gap: 6 }}>
                    {team.status !== 'paused' && (
                      <button style={BTN_OUTLINE} onClick={() => handlePause(team)}>Pause</button>
                    )}
                    <button style={{ ...BTN_OUTLINE, borderColor: C.red, color: C.red }} onClick={() => handleDelete(team)}>Delete</button>
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
            <h2 style={{ fontSize: 18, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: '0 0 4px 0' }}>Create Team</h2>
            <p style={{ fontSize: 12, fontFamily: C.body, color: C.secondary, margin: '0 0 20px 0' }}>Add a new team to your organization.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none' }}
                  placeholder="e.g. Backend Engineering"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Department</label>
                <input
                  value={formDepartment}
                  onChange={(e) => setFormDepartment(e.target.value)}
                  style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none' }}
                  placeholder="e.g. Engineering"
                />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button style={BTN_OUTLINE} onClick={() => setShowModal(false)}>Cancel</button>
                <button style={BTN_PRIMARY()} disabled={submitting || !formName.trim()} onClick={handleCreate}>
                  {submitting ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
