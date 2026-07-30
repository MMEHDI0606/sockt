'use client';

import { useState, useEffect } from 'react';
import { getIdentityUsers, updateIdentityUserRole, updateIdentityUserDepartment } from '@/lib/console/client';
import type { IdentityUser } from '@/lib/console/client';

const C = {
  void: 'var(--bg-void)', surface: 'var(--bg-surface)', raised: 'var(--bg-raised)', border: 'var(--bg-border)',
  primary: 'var(--text-primary)', secondary: 'var(--text-secondary)', mono: 'var(--font-mono)', body: 'var(--font-body)',
  headline: 'var(--font-headline)', green: 'var(--accent-green)', red: 'var(--accent-red)', brass: 'var(--accent-brass)',
  monoMicro: 'var(--mono-micro)', monoCta: 'var(--mono-cta)', radiusBtn: 'var(--radius-btn)', radiusCard: 'var(--radius-card)',
};
const CARD = (p?: number) => ({ background: C.surface, border: '1px solid var(--bg-border)', borderTop: '1px solid var(--border-top-highlight)', borderRadius: C.radiusCard, padding: p ?? 20 });
const BTN_OUTLINE = { background: 'transparent', border: `1px solid var(--bg-border)`, color: C.secondary, fontFamily: C.mono, fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', padding: '6px 14px', borderRadius: C.radiusBtn, cursor: 'pointer' };
const ROLE_BADGE = (r: string) => {
  const m: Record<string, [string, string]> = {
    admin: ['rgba(167,139,250,.15)', '#A78BFA'], dept_manager: ['rgba(96,165,250,.15)', '#60A5FA'],
    operator: ['rgba(16,163,127,.15)', '#10A37F'], viewer: ['rgba(109,109,120,.15)', C.secondary],
  };
  const [bg, co] = m[r] ?? m.viewer!;
  return { fontFamily: C.mono, fontSize: 10, fontWeight: 500, padding: '2px 8px', borderRadius: 999, background: bg, color: co, textTransform: 'uppercase' as const, letterSpacing: '0.08em' };
};

const ROLES = ['admin', 'dept_manager', 'operator', 'viewer'];

export default function UsersPage() {
  const [users, setUsers] = useState<IdentityUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [editDept, setEditDept] = useState<Record<string, string>>({});

  const fetchData = async () => {
    try {
      const u = await getIdentityUsers();
      setUsers(u);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRoleChange = async (userId: string, role: string) => {
    setSaving(userId);
    try {
      const updated = await updateIdentityUserRole(userId, role);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: updated.role } : u));
    } catch (e: any) {
      setError(e.message || 'Failed to update role');
    } finally {
      setSaving(null);
    }
  };

  const handleDeptSave = async (userId: string) => {
    const dept = editDept[userId] ?? '';
    setSaving(userId + '-dept');
    try {
      const updated = await updateIdentityUserDepartment(userId, dept || null);
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, departmentId: updated.departmentId } : u));
      setEditDept((prev) => { const n = { ...prev }; delete n[userId]; return n; });
    } catch (e: any) {
      setError(e.message || 'Failed to update department');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: 0 }}>Users</h1>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: '4px 0 0 0' }}>Manage user roles and department assignments for your tenant.</p>
      </div>

      {error && (
        <div style={{ ...CARD(), borderColor: C.red, color: C.red, fontFamily: C.mono, fontSize: 12 }}>
          {error} <button style={{ ...BTN_OUTLINE, marginLeft: 12 }} onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {loading ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>Loading...</div>
      ) : users.length === 0 ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>No users found.</div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                {['Email', 'Display Name', 'Role', 'Department', 'Status', 'Joined'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const deptEditing = editDept[u.id] !== undefined;
                const deptVal = deptEditing ? editDept[u.id] : (u.departmentId ?? '');
                return (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 12, color: C.primary }}>{u.email}</td>
                    <td style={{ padding: '10px 12px', fontFamily: C.body, fontSize: 13, color: C.secondary }}>{u.displayName}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <select
                        value={u.role}
                        disabled={saving === u.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        style={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 8px', color: C.primary, fontFamily: C.mono, fontSize: 11, cursor: 'pointer' }}
                      >
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <input
                          value={deptVal}
                          placeholder="—"
                          onChange={(e) => setEditDept((prev) => ({ ...prev, [u.id]: e.target.value }))}
                          style={{ background: C.raised, border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 8px', color: C.primary, fontFamily: C.mono, fontSize: 11, width: 120 }}
                        />
                        {deptEditing && (
                          <button
                            disabled={saving === u.id + '-dept'}
                            onClick={() => handleDeptSave(u.id)}
                            style={{ ...BTN_OUTLINE, padding: '4px 10px', fontSize: 10 }}
                          >
                            {saving === u.id + '-dept' ? '...' : 'Save'}
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontFamily: C.mono, fontSize: 10, padding: '2px 8px', borderRadius: 999, background: u.active ? 'rgba(34,208,122,.15)' : 'rgba(109,109,120,.15)', color: u.active ? C.green : C.secondary }}>
                        {u.active ? 'active' : 'inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: C.mono, fontSize: 11, color: C.secondary }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
