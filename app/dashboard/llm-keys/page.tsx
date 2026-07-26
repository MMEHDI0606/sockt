'use client';

import { useState, useEffect } from 'react';
import { getLlmKeys, createLlmKey, deleteLlmKey } from '@/lib/console/client';
import type { LlmKey } from '@/lib/console/client';

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

const PROVIDERS = ['anthropic', 'openai', 'google', 'ollama'];

export default function LlmKeysPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [keys, setKeys] = useState<LlmKey[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formProvider, setFormProvider] = useState('anthropic');
  const [formLabel, setFormLabel] = useState('');
  const [formKey, setFormKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const fetchData = async () => {
    try {
      const data = await getLlmKeys();
      setKeys(data);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to load LLM keys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!formLabel.trim() || !formKey.trim()) return;
    setSubmitting(true);
    try {
      await createLlmKey({ provider: formProvider, label: formLabel.trim(), key_plaintext: formKey });
      setShowModal(false);
      setFormProvider('anthropic');
      setFormLabel('');
      setFormKey('');
      setShowKey(false);
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to add LLM key');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (key: LlmKey) => {
    if (!confirm(`Delete key "${key.label}"? This cannot be undone.`)) return;
    try {
      await deleteLlmKey(key.id);
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to delete key');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: 0 }}>LLM Keys</h1>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: '4px 0 0 0' }}>Manage BYOK API credentials for AI provider access.</p>
      </div>

      {error && (
        <div style={{ ...CARD(), borderColor: C.red, color: C.red, fontFamily: C.mono, fontSize: 12 }}>
          {error}
          <button style={{ ...BTN_OUTLINE, marginLeft: 12 }} onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button style={BTN_PRIMARY()} onClick={() => setShowModal(true)}>Add Key</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p style={{ margin: 0, fontFamily: C.mono, fontSize: 11, color: C.secondary, background: C.void, padding: '10px 14px', borderRadius: C.radiusBtn }}>
          Keys are encrypted at rest. Once saved, the plaintext cannot be retrieved.
        </p>

        {loading ? (
          <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>Loading...</div>
        ) : keys.length === 0 ? (
          <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>
            No LLM provider keys configured. Add your BYOK API keys.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Provider</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Label</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Key Prefix</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Created</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((key) => (
                  <tr key={key.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '10px 12px' }}><span style={STATUS_BADGE(key.provider)}>{key.provider}</span></td>
                    <td style={{ padding: '10px 12px', fontFamily: C.headline, fontSize: 14, fontWeight: 600, color: C.primary }}>{key.label}</td>
                    <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 12, color: C.secondary }}>{key.key_prefix}</td>
                    <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 11, color: C.secondary }}>{new Date(key.created_at).toLocaleDateString()}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <button style={{ ...BTN_OUTLINE, borderColor: C.red, color: C.red }} onClick={() => handleDelete(key)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div style={MODAL_OVERLAY} onClick={() => setShowModal(false)}>
          <div style={MODAL_PANEL} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: '0 0 4px 0' }}>Add Key</h2>
            <p style={{ fontSize: 12, fontFamily: C.body, color: C.secondary, margin: '0 0 20px 0' }}>Add a BYOK API key for an LLM provider.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Label</label>
                <input
                  value={formLabel}
                  onChange={(e) => setFormLabel(e.target.value)}
                  style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none' }}
                  placeholder="e.g. Production Anthropic Key"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <label style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.06em' }}>API Key</label>
                <div style={{ display: 'flex', gap: 0 }}>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={formKey}
                    onChange={(e) => setFormKey(e.target.value)}
                    style={{ background: C.void, border: `1px solid ${C.border}`, borderRadius: `${C.radiusBtn} 0 0 ${C.radiusBtn}`, padding: '8px 12px', color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none', flex: 1 }}
                    placeholder="sk-ant-..."
                  />
                  <button
                    onClick={() => setShowKey((v) => !v)}
                    style={{ background: C.raised, border: `1px solid ${C.border}`, borderLeft: 'none', borderRadius: `0 ${C.radiusBtn} ${C.radiusBtn} 0`, padding: '0 12px', color: C.secondary, fontFamily: C.mono, fontSize: 11, cursor: 'pointer' }}
                  >
                    {showKey ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
                <button style={BTN_OUTLINE} onClick={() => setShowModal(false)}>Cancel</button>
                <button style={BTN_PRIMARY()} disabled={submitting || !formLabel.trim() || !formKey.trim()} onClick={handleCreate}>
                  {submitting ? 'Saving...' : 'Add Key'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
