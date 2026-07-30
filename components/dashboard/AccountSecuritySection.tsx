'use client';

import { useState, useEffect } from 'react';
import { getActiveSessions, revokeSession } from '@/lib/console/client';
import type { ActiveSession } from '@/lib/console/client';

const C = {
  void: 'var(--bg-void)', surface: 'var(--bg-surface)', raised: 'var(--bg-raised)', border: 'var(--bg-border)',
  primary: 'var(--text-primary)', secondary: 'var(--text-secondary)', mono: 'var(--font-mono)', body: 'var(--font-body)',
  headline: 'var(--font-headline)', green: 'var(--accent-green)', red: 'var(--accent-red)',
  radiusBtn: 'var(--radius-btn)', radiusCard: 'var(--radius-card)',
};
const BTN_OUTLINE = { background: 'transparent', border: `1px solid var(--bg-border)`, color: C.secondary, fontFamily: C.mono, fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', padding: '5px 12px', borderRadius: C.radiusBtn, cursor: 'pointer' };
const SECTION_LABEL = { fontSize: 11, fontFamily: C.mono, color: C.secondary, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 12, marginTop: 32 };
const CARD = (p?: number) => ({ background: C.surface, border: `1px solid var(--bg-border)`, borderTop: '1px solid var(--border-top-highlight)', borderRadius: C.radiusCard, padding: p ?? 16 });

const CONSOLE_URL = process.env.NEXT_PUBLIC_CONSOLE_API_URL || 'https://api.sockt.dev/console';
const IDENTITY_URL = process.env.NEXT_PUBLIC_IDENTITY_URL || 'http://localhost:3003';

export default function AccountSecuritySection() {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getActiveSessions()
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoadingSessions(false));
  }, []);

  const handleRevoke = async (id: string) => {
    if (!confirm('Revoke this session?')) return;
    setRevoking(id);
    try {
      await revokeSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      setError(e.message || 'Failed to revoke session');
    } finally {
      setRevoking(null);
    }
  };

  return (
    <div style={{ marginTop: 40 }}>
      <div style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 20, marginBottom: 0 }}>
        <h3 style={{ fontSize: 18, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: '0 0 4px' }}>Security</h3>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: 0 }}>Active sessions, SCIM provisioning, and SSO configuration.</p>
      </div>

      {error && (
        <div style={{ ...CARD(), borderColor: C.red, color: C.red, fontFamily: C.mono, fontSize: 12, marginTop: 16 }}>{error}</div>
      )}

      {/* Sessions */}
      <div style={SECTION_LABEL}>Active Sessions</div>
      {loadingSessions ? (
        <div style={{ fontFamily: C.mono, fontSize: 12, color: C.secondary }}>Loading...</div>
      ) : sessions.length === 0 ? (
        <div style={{ fontFamily: C.mono, fontSize: 12, color: C.secondary }}>No active sessions found.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sessions.map((s) => (
            <div key={s.id} style={{ ...CARD(), display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ fontFamily: C.mono, fontSize: 12, color: C.primary, marginBottom: 2 }}>
                  {s.userAgent ? s.userAgent.slice(0, 60) + (s.userAgent.length > 60 ? '…' : '') : 'Unknown client'}
                </div>
                <div style={{ fontFamily: C.mono, fontSize: 10, color: C.secondary, display: 'flex', gap: 12 }}>
                  {s.ipAddress && <span>{s.ipAddress}</span>}
                  <span>Started {new Date(s.createdAt * 1000).toLocaleString()}</span>
                  <span>Expires {new Date(s.expiresAt * 1000).toLocaleString()}</span>
                </div>
              </div>
              <button
                disabled={revoking === s.id}
                onClick={() => handleRevoke(s.id)}
                style={{ ...BTN_OUTLINE, borderColor: C.red, color: C.red, flexShrink: 0 }}
              >
                {revoking === s.id ? '...' : 'Revoke'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SCIM */}
      <div style={SECTION_LABEL}>SCIM Provisioning</div>
      <div style={{ ...CARD() }}>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: '0 0 12px', lineHeight: 1.6 }}>
          Use SCIM 2.0 to automatically provision and deprovision users from your identity provider (Okta, Azure AD, etc.).
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <div style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>SCIM Endpoint</div>
            <code style={{ fontFamily: C.mono, fontSize: 12, color: C.primary, background: C.raised, padding: '6px 10px', borderRadius: 6, display: 'block', wordBreak: 'break-all' }}>
              {IDENTITY_URL}/scim/v2
            </code>
          </div>
          <div style={{ fontFamily: C.mono, fontSize: 11, color: C.secondary, padding: '10px 12px', background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 6 }}>
            Generate a SCIM bearer token via the identity CLI: <code style={{ color: '#F59E0B' }}>sockt scim token create</code>
          </div>
        </div>
      </div>

      {/* SSO */}
      <div style={SECTION_LABEL}>Single Sign-On (SSO)</div>
      <div style={{ ...CARD() }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontFamily: C.headline, fontSize: 14, fontWeight: 600, color: C.primary, marginBottom: 4 }}>SAML / OIDC SSO</div>
            <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: 0, lineHeight: 1.6 }}>
              Configure SSO to let your team sign in with your existing identity provider. Supports SAML 2.0 and OIDC.
            </p>
          </div>
          <span style={{ fontFamily: C.mono, fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 999, background: 'rgba(167,139,250,.15)', color: '#A78BFA', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0, whiteSpace: 'nowrap' }}>
            Enterprise
          </span>
        </div>
        <div style={{ marginTop: 12, fontFamily: C.mono, fontSize: 11, color: C.secondary, padding: '10px 12px', background: C.raised, borderRadius: 6 }}>
          Contact <span style={{ color: C.primary }}>support@sockt.dev</span> to enable SSO for your organization.
        </div>
      </div>
    </div>
  );
}
