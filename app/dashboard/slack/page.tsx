'use client';

import { useState, useEffect } from 'react';
import { getSlackWorkspaces, deleteSlackWorkspace, getDeployments } from '@/lib/console/client';
import type { SlackWorkspace, Deployment } from '@/lib/console/client';

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

export default function SlackPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<SlackWorkspace[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);

  const fetchData = async () => {
    try {
      const [w, d] = await Promise.all([getSlackWorkspaces(), getDeployments()]);
      setWorkspaces(w);
      setDeployments(d);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to load Slack workspaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deploymentCount = (workspaceId: string) =>
    deployments.filter((d) => d.slack_workspace_id === workspaceId).length;

  const handleDisconnect = async (ws: SlackWorkspace) => {
    if (!confirm(`Disconnect workspace "${ws.workspace_id}"? Active deployments may be affected.`)) return;
    try {
      await deleteSlackWorkspace(ws.id);
      fetchData();
    } catch (e: any) {
      setError(e.message || 'Failed to disconnect workspace');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: 0 }}>Slack</h1>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: '4px 0 0 0' }}>Manage Slack workspace connections for AI swarm deployments.</p>
      </div>

      {error && (
        <div style={{ ...CARD(), borderColor: C.red, color: C.red, fontFamily: C.mono, fontSize: 12 }}>
          {error}
          <button style={{ ...BTN_OUTLINE, marginLeft: 12 }} onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          style={{ ...BTN_PRIMARY(), opacity: 0.5, cursor: 'not-allowed' }}
          disabled
          title="Coming soon"
        >
          Connect Workspace (Coming Soon)
        </button>
      </div>

      {loading ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>Loading...</div>
      ) : workspaces.length === 0 ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>
          No Slack workspaces connected. Connect your team&apos;s Slack to deploy AI swarms.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Workspace ID</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Team Ref</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bot User ID</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Installed</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Deployments</th>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workspaces.map((ws) => (
                <tr key={ws.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 12, color: C.primary }}>{ws.workspace_id}</td>
                  <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 12, color: C.secondary }}>{ws.team_id}</td>
                  <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 12, color: C.secondary }}>{ws.bot_user_id}</td>
                  <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 11, color: C.secondary }}>{new Date(ws.installed_at).toLocaleDateString()}</td>
                  <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 12, color: C.primary }}>{deploymentCount(ws.id)}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <button style={{ ...BTN_OUTLINE, borderColor: C.red, color: C.red }} onClick={() => handleDisconnect(ws)}>
                      Disconnect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
