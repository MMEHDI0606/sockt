'use client';

import { useState, useEffect } from 'react';
import { getToolConfigs, createToolConfig, updateToolConfig, deleteToolConfig, getTeams } from '@/lib/console/client';
import type { ToolConfig, Team } from '@/lib/console/client';

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
const MODAL_PANEL = { ...CARD(24), width: 540, maxWidth: 'calc(100vw - 40px)', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' as const, borderRadius: 16 };
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

export default function ToolsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tools, setTools] = useState<ToolConfig[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedConfig, setExpandedConfig] = useState<string | null>(null);

  const [formToolName, setFormToolName] = useState('');
  const [formTeamId, setFormTeamId] = useState('');
  const [formConfig, setFormConfig] = useState('{}');
  const [formEnabled, setFormEnabled] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [t, tm] = await Promise.all([getToolConfigs(), getTeams()]);
      setTools(t);
      setTeams(tm);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to load tool configs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const teamName = (teamId: string | null) => {
    if (!teamId) return 'Global';
    const t = teams.find((tm) => tm.id === teamId);
    return t ? t.name : teamId;
  };

  const resetForm = () => {
    setFormToolName('');
    setFormTeamId('');
    setFormConfig('{}');
    setFormEnabled(true);
    setConfigError(null);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (tool: ToolConfig) => {
    setFormToolName(tool.tool_name);
    setFormTeamId(tool.team_id || '');
    setFormConfig(JSON.stringify(tool.config, null, 2));
    setFormEnabled(tool.enabled);
    setEditingId(tool.id);
    setShowModal(true);
  };

  const validateConfig = (): any | null => {
    if (!formConfig.trim()) {
      setConfigError('Config is required');
      return null;
    }
    try {
      const parsed = JSON.parse(formConfig);
      setConfigError(null);
      return parsed;
    } catch {
      setConfigError('Invalid JSON');
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!formToolName.trim()) return;
    const parsedConfig = validateConfig();
    if (!parsedConfig) return;
    setSubmitting(true);
    try {
      const payload = {
        tool_name: formToolName.trim(),
        team_id: formTeamId || undefined,
        config: parsedConfig,
        enabled: formEnabled,
      };
      if (editingId) {
        await updateToolConfig(editingId, payload);
      } else {
        await createToolConfig(payload);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to save tool config');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (tool: ToolConfig) => {
    if (!confirm(`Delete tool "${tool.tool_name}"? This cannot be undone.`)) return;
    try {
      await deleteToolConfig(tool.id);
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to delete tool config');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: 0 }}>Tools</h1>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: '4px 0 0 0' }}>Configure tool access and capabilities scoped to teams or globally.</p>
      </div>

      {error && (
        <div style={{ ...CARD(), borderColor: C.red, color: C.red, fontFamily: C.mono, fontSize: 12 }}>
          {error}
          <button style={{ ...BTN_OUTLINE, marginLeft: 12 }} onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={BTN_PRIMARY()} onClick={openCreate}>Add Tool</button>
      </div>

      {loading ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>Loading...</div>
      ) : tools.length === 0 ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>
          No tools configured. Add your first tool to extend agent capabilities.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tool Name</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Team Scope</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Enabled</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Config</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tools.map((tool) => {
                const isExpanded = expandedConfig === tool.id;
                return (
                  <tr key={tool.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '10px 12px', fontFamily: C.headline, fontSize: 14, fontWeight: 600, color: C.primary }}>{tool.tool_name}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        fontFamily: C.mono, fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 999,
                        background: tool.team_id ? 'rgba(167,139,250,.15)' : 'rgba(109,109,120,.15)',
                        color: tool.team_id ? '#A78BFA' : C.secondary,
                        textTransform: 'uppercase', letterSpacing: '0.08em',
                      }}>
                        {teamName(tool.team_id)}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        fontFamily: C.mono, fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 999,
                        background: tool.enabled ? C.green : C.red,
                        color: C.void, textTransform: 'uppercase', letterSpacing: '0.08em',
                      }}>
                        {tool.enabled ? '\u2713' : '\u2717'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <button
                        style={{ ...BTN_OUTLINE, fontSize: 10, padding: '3px 10px' }}
                        onClick={() => setExpandedConfig(isExpanded ? null : tool.id)}
                      >
                        {isExpanded ? 'Collapse' : 'Expand'}
                      </button>
                      {isExpanded && (
                        <pre style={{
                          margin: '8px 0 0 0', padding: 10, background: C.void, border: `1px solid ${C.border}`,
                          borderRadius: C.radiusBtn, fontFamily: C.mono, fontSize: 11, color: C.secondary,
                          overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                        }}>
                          {JSON.stringify(tool.config, null, 2)}
                        </pre>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', display: 'flex', gap: 6 }}>
                      <button style={BTN_OUTLINE} onClick={() => openEdit(tool)}>Edit</button>
                      <button style={{ ...BTN_OUTLINE, borderColor: C.red, color: C.red }} onClick={() => handleDelete(tool)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={MODAL_OVERLAY} onClick={() => { setShowModal(false); resetForm(); }}>
          <div style={MODAL_PANEL} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: '0 0 4px 0' }}>
              {editingId ? 'Edit Tool' : 'Add Tool'}
            </h2>
            <p style={{ fontSize: 12, fontFamily: C.body, color: C.secondary, margin: '0 0 20px 0' }}>
              {editingId ? 'Update tool configuration.' : 'Configure a new tool for agent use.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tool Name</label>
                <input
                  value={formToolName}
                  onChange={(e) => setFormToolName(e.target.value)}
                  style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none' }}
                  placeholder="e.g. slack-message"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Team Scope</label>
                <select
                  value={formTeamId}
                  onChange={(e) => setFormTeamId(e.target.value)}
                  style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none' }}
                >
                  <option value="">Global</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Config (JSON)</label>
                <textarea
                  value={formConfig}
                  onChange={(e) => { setFormConfig(e.target.value); setConfigError(null); }}
                  rows={6}
                  style={{
                    background: C.void, border: `1px solid ${configError ? C.red : C.border}`, borderRadius: C.radiusBtn,
                    padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 12, outline: 'none', resize: 'vertical',
                  }}
                />
                {configError && (
                  <span style={{ fontFamily: C.mono, fontSize: 10, color: C.red }}>{configError}</span>
                )}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formEnabled}
                  onChange={(e) => setFormEnabled(e.target.checked)}
                />
                <span style={{ fontFamily: C.mono, fontSize: 11, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Enabled</span>
              </label>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button style={BTN_OUTLINE} onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                <button style={BTN_PRIMARY()} disabled={submitting || !formToolName.trim()} onClick={handleSubmit}>
                  {submitting ? 'Saving...' : editingId ? 'Save' : 'Add Tool'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
