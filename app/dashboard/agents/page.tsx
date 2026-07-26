'use client';

import { useState, useEffect } from 'react';
import { getAgents, createAgent, updateAgent, deleteAgent, getLlmKeys } from '@/lib/console/client';
import type { AgentDef, LlmKey } from '@/lib/console/client';

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

const ROLES = ['architect', 'worker'];
const PROVIDERS = ['anthropic', 'openai', 'google', 'ollama'];
const TOOL_OPTIONS = [
  { id: 'web', label: 'Web' },
  { id: 'code-exec', label: 'Code Exec' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'file-read', label: 'File Read' },
  { id: 'mcp-server', label: 'MCP Server' },
  { id: 'custom-http', label: 'Custom HTTP' },
];

export default function AgentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<AgentDef[]>([]);
  const [llmKeys, setLlmKeys] = useState<LlmKey[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('worker');
  const [formPrompt, setFormPrompt] = useState('');
  const [formProvider, setFormProvider] = useState('anthropic');
  const [formModel, setFormModel] = useState('');
  const [formTemperature, setFormTemperature] = useState(0.7);
  const [formMaxTokens, setFormMaxTokens] = useState(4096);
  const [formTools, setFormTools] = useState<string[]>([]);
  const [formLlmKeyId, setFormLlmKeyId] = useState('');

  const fetchData = async () => {
    try {
      const [a, k] = await Promise.all([getAgents(), getLlmKeys()]);
      setAgents(a);
      setLlmKeys(k);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormName('');
    setFormRole('worker');
    setFormPrompt('');
    setFormProvider('anthropic');
    setFormModel('');
    setFormTemperature(0.7);
    setFormMaxTokens(4096);
    setFormTools([]);
    setFormLlmKeyId('');
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const openEdit = (agent: AgentDef) => {
    setFormName(agent.name);
    setFormRole(agent.role);
    setFormPrompt(agent.system_prompt || '');
    setFormProvider(agent.llm_config?.provider || '');
    setFormModel(agent.llm_config?.model || '');
    setFormTemperature(agent.llm_config?.temperature ?? 0.7);
    setFormMaxTokens(agent.llm_config?.maxTokens || 4096);
    setFormTools(agent.tools || []);
    setFormLlmKeyId('');
    setEditingId(agent.id);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!formName.trim() || !formModel.trim()) return;
    setSubmitting(true);
    try {
      const payload = {
        name: formName.trim(),
        role: formRole as 'architect' | 'worker',
        system_prompt: formPrompt.trim(),
        llm_config: {
          provider: formProvider,
          model: formModel.trim(),
          temperature: formTemperature,
          maxTokens: formMaxTokens,
        },
        tools: formTools,
      };
      if (editingId) {
        await updateAgent(editingId, payload as any);
      } else {
        await createAgent(payload as any);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to save agent');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (agent: AgentDef) => {
    if (!confirm(`Delete agent "${agent.name}"? This cannot be undone.`)) return;
    try {
      await deleteAgent(agent.id);
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to delete agent');
    }
  };

  const toggleTool = (toolId: string) => {
    setFormTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId],
    );
  };

  const toolCount = (tools: string[]) => (tools && tools.length > 0 ? `${tools.length} tools` : '0 tools');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: 0 }}>Agents</h1>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: '4px 0 0 0' }}>Register and configure AI agents with LLM backends and tool access.</p>
      </div>

      {error && (
        <div style={{ ...CARD(), borderColor: C.red, color: C.red, fontFamily: C.mono, fontSize: 12 }}>
          {error}
          <button style={{ ...BTN_OUTLINE, marginLeft: 12 }} onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={BTN_PRIMARY()} onClick={openCreate}>Register Agent</button>
      </div>

      {loading ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>Loading...</div>
      ) : agents.length === 0 ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>
          No agents registered. Register your first agent to power AI workflows.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Role</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Provider</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Model</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tools</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '10px 12px', fontFamily: C.headline, fontSize: 14, fontWeight: 600, color: C.primary }}>{agent.name}</td>
                  <td style={{ padding: '10px 12px' }}><span style={STATUS_BADGE(agent.role)}>{agent.role}</span></td>
                  <td style={{ padding: '10px 12px' }}><span style={STATUS_BADGE(agent.llm_config?.provider || 'unknown')}>{agent.llm_config?.provider || 'unknown'}</span></td>
                  <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 12, color: C.primary }}>{agent.llm_config?.model || '-'}</td>
                  <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 11, color: C.secondary }}>{toolCount(agent.tools)}</td>
                  <td style={{ padding: '10px 12px', display: 'flex', gap: 6 }}>
                    <button style={BTN_OUTLINE} onClick={() => openEdit(agent)}>Edit</button>
                    <button style={{ ...BTN_OUTLINE, borderColor: C.red, color: C.red }} onClick={() => handleDelete(agent)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div style={MODAL_OVERLAY} onClick={() => { setShowModal(false); resetForm(); }}>
          <div style={MODAL_PANEL} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: '0 0 4px 0' }}>
              {editingId ? 'Edit Agent' : 'Register Agent'}
            </h2>
            <p style={{ fontSize: 12, fontFamily: C.body, color: C.secondary, margin: '0 0 20px 0' }}>
              {editingId ? 'Update agent configuration.' : 'Create a new AI agent with LLM backend and tool access.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none' }}
                  placeholder="e.g. Code Review Agent"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Role</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none' }}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>System Prompt</label>
                <textarea
                  value={formPrompt}
                  onChange={(e) => setFormPrompt(e.target.value)}
                  rows={4}
                  style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 12, outline: 'none', resize: 'vertical' }}
                  placeholder="You are a helpful assistant..."
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Provider</label>
                  <select
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value)}
                    style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none' }}
                  >
                    {PROVIDERS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Model</label>
                  <input
                    value={formModel}
                    onChange={(e) => setFormModel(e.target.value)}
                    style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none' }}
                    placeholder="e.g. claude-sonnet-4-20250514"
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Temperature</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={formTemperature}
                    onChange={(e) => setFormTemperature(parseFloat(e.target.value) || 0)}
                    style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                  <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Max Tokens</label>
                  <input
                    type="number"
                    value={formMaxTokens}
                    onChange={(e) => setFormMaxTokens(parseInt(e.target.value) || 0)}
                    style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>LLM Key</label>
                <select
                  value={formLlmKeyId}
                  onChange={(e) => setFormLlmKeyId(e.target.value)}
                  style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none' }}
                >
                  <option value="">None selected</option>
                  {llmKeys.map((k) => (
                    <option key={k.id} value={k.id}>{k.label} ({k.provider})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tools</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {TOOL_OPTIONS.map((tool) => (
                    <label
                      key={tool.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontFamily: C.mono, fontSize: 11, color: formTools.includes(tool.id) ? C.primary : C.secondary, cursor: 'pointer',
                        background: formTools.includes(tool.id) ? 'rgba(96,165,250,.1)' : C.void,
                        border: `1px solid ${formTools.includes(tool.id) ? '#60A5FA' : C.border}`,
                        borderRadius: C.radiusBtn, padding: '5px 10px', transition: 'all 0.15s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formTools.includes(tool.id)}
                        onChange={() => toggleTool(tool.id)}
                        style={{ display: 'none' }}
                      />
                      {tool.label}
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button style={BTN_OUTLINE} onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                <button style={BTN_PRIMARY()} disabled={submitting || !formName.trim() || !formModel.trim()} onClick={handleSubmit}>
                  {submitting ? 'Saving...' : editingId ? 'Save' : 'Register'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
