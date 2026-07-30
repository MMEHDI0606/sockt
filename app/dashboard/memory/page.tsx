'use client';

import { useState, useEffect } from 'react';
import { identityFetch } from '@/lib/console/client';

const C = {
  void: 'var(--bg-void)', surface: 'var(--bg-surface)', raised: 'var(--bg-raised)', border: 'var(--bg-border)',
  primary: 'var(--text-primary)', secondary: 'var(--text-secondary)', mono: 'var(--font-mono)', body: 'var(--font-body)',
  headline: 'var(--font-headline)', green: 'var(--accent-green)', red: 'var(--accent-red)', brass: 'var(--accent-brass)',
  monoMicro: 'var(--mono-micro)', monoCta: 'var(--mono-cta)', radiusBtn: 'var(--radius-btn)', radiusCard: 'var(--radius-card)',
};
const CARD = (p?: number) => ({ background: C.surface, border: '1px solid var(--bg-border)', borderTop: '1px solid var(--border-top-highlight)', borderRadius: C.radiusCard, padding: p ?? 20 });
const BTN_PRIMARY = { background: C.primary, color: C.void, fontFamily: C.mono, fontSize: C.monoCta, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const, padding: '8px 20px', border: 'none', borderRadius: C.radiusBtn, cursor: 'pointer', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)' };

const CONSOLE_URL = process.env.NEXT_PUBLIC_CONSOLE_API_URL || 'https://api.sockt.dev/console';

interface MemoryEntry {
  id: string;
  key: string;
  value: string;
  agentId?: string;
  teamId?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
}

async function fetchMemoryEntries(query?: string): Promise<MemoryEntry[]> {
  const url = `${CONSOLE_URL}/memory${query ? `?q=${encodeURIComponent(query)}` : ''}`;
  const res = await identityFetch(url);
  if (!res.ok) throw new Error(`Memory API ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : (data.entries ?? []);
}

export default function MemoryPage() {
  const [query, setQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [entries, setEntries] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMemoryEntries(q);
      setEntries(data);
      setConnected(true);
    } catch (e: any) {
      if (e.message?.includes('502') || e.message?.includes('503') || e.message?.includes('404') || e.message?.includes('Failed to fetch')) {
        setConnected(false);
      } else {
        setError(e.message || 'Failed to load memory');
        setConnected(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleSearch = () => { setQuery(searchInput); fetch(searchInput); };

  return (
    <div style={{ maxWidth: 1280, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: C.headline, color: C.primary, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Memory</h1>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: 0 }}>Agent knowledge base — indexed automatically as agents complete tasks.</p>
      </div>

      {!connected && (
        <div style={{ ...CARD(), borderColor: 'rgba(245,158,11,.4)', background: 'rgba(245,158,11,.06)' }}>
          <div style={{ fontFamily: C.mono, fontSize: 11, fontWeight: 600, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>GBrain Not Connected</div>
          <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: '0 0 12px', lineHeight: 1.6 }}>
            The memory service (GBrain) is not reachable. Memory is written automatically by agents during task execution — start the GBrain/monitor service to view and search entries here.
          </p>
          <code style={{ fontFamily: C.mono, fontSize: 11, color: C.secondary, background: C.raised, padding: '6px 10px', borderRadius: 6, display: 'inline-block' }}>
            INTERNAL_MONITOR_URL=http://localhost:3002 bun run dev
          </code>
        </div>
      )}

      <div style={{ ...CARD() }}>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, lineHeight: 1.6, margin: '0 0 14px' }}>
          Agent memory accumulates as agents work through tasks. The CADVP daemon automatically indexes outcomes, decisions, and context for future retrieval and reasoning.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Search memory entries..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1, background: C.raised, border: `1px solid ${C.border}`, borderRadius: C.radiusBtn, padding: '8px 14px', fontFamily: C.body, fontSize: 13, color: C.primary, outline: 'none' }}
          />
          <button onClick={handleSearch} style={BTN_PRIMARY}>Search</button>
        </div>
      </div>

      {error && (
        <div style={{ ...CARD(), borderColor: C.red, color: C.red, fontFamily: C.mono, fontSize: 12 }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>Loading...</div>
      ) : !connected ? (
        <div style={{ color: C.secondary, fontFamily: C.mono, fontSize: 12, padding: 40, textAlign: 'center' }}>Waiting for memory service...</div>
      ) : entries.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', color: C.secondary, fontSize: 13, fontFamily: C.body, textAlign: 'center', gap: 8 }}>
          <div style={{ fontSize: 28, opacity: 0.4 }}>&#128218;</div>
          <div>{query ? `No entries matching "${query}"` : 'No memory entries yet — agents write memory automatically as they work.'}</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {entries.map((entry) => (
            <div key={entry.id} style={{ ...CARD(14) }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
                <span style={{ fontFamily: C.mono, fontSize: 12, fontWeight: 600, color: C.primary }}>{entry.key}</span>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  {entry.agentId && <span style={{ fontFamily: C.mono, fontSize: 10, color: C.secondary, background: C.raised, padding: '2px 6px', borderRadius: 4 }}>{entry.agentId}</span>}
                  <span style={{ fontFamily: C.mono, fontSize: 10, color: C.secondary }}>{new Date(entry.createdAt * 1000).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ fontFamily: C.body, fontSize: 13, color: C.secondary, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{entry.value}</div>
              {entry.tags && entry.tags.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
                  {entry.tags.map((t) => (
                    <span key={t} style={{ fontFamily: C.mono, fontSize: 10, color: C.brass, background: 'rgba(196,127,96,.12)', padding: '2px 6px', borderRadius: 4 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
