'use client';

import { useEffect, useRef, useState } from 'react';

const NODES = [
  { label: 'Slack', sub: 'channel', icon: '#' },
  { label: 'Gateway', sub: 'auth + routing', icon: '⬡' },
  { label: 'Orchestrator', sub: 'FSM task list', icon: '◈' },
  { label: 'TEE Sandbox', sub: 'isolated compute', icon: '⬢' },
  { label: 'GBrain', sub: 'git-backed memory', icon: '◎' },
];

export default function ArchFlow({ vertical = false }: { vertical?: boolean }) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % NODES.length);
    }, 900);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  if (vertical) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {NODES.map((node, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 28, flexShrink: 0 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: `1.5px solid ${i === active ? '#EEECE8' : '#2A2A2F'}`,
                  background: i === active ? '#1D1D22' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  color: i === active ? '#EEECE8' : '#44444B',
                  transition: 'all 0.4s ease',
                  flexShrink: 0,
                }}
              >
                {node.icon}
              </div>
              {i < NODES.length - 1 && (
                <div
                  style={{
                    width: 1,
                    height: 24,
                    background: i < active ? '#EEECE8' : '#26262B',
                    transition: 'background 0.4s ease',
                  }}
                />
              )}
            </div>
            <div style={{ paddingLeft: 12, paddingBottom: i < NODES.length - 1 ? 4 : 0, paddingTop: 4 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: i === active ? '#EEECE8' : '#6D6D78', letterSpacing: '0.06em', transition: 'color 0.4s ease' }}>
                {node.label}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#44444B', marginTop: 1 }}>
                {node.sub}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto', paddingBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, minWidth: 520 }}>
        {NODES.map((node, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: i < NODES.length - 1 ? 1 : 'none',
            }}
          >
            {/* Node */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  border: `1px solid ${i === active ? '#46464E' : '#26262B'}`,
                  background: i === active ? '#1D1D22' : '#0E0E12',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  color: i === active ? '#EEECE8' : '#44444B',
                  transition: 'all 0.4s var(--ease-expo)',
                  boxShadow: i === active ? '0 0 20px rgba(238,236,232,0.06)' : 'none',
                }}
              >
                {node.icon}
              </div>
              <div style={{ textAlign: 'center', width: 90 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: i === active ? '#EEECE8' : '#6D6D78',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.4s ease',
                  }}
                >
                  {node.label}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: '#44444B', marginTop: 2, whiteSpace: 'nowrap' }}>
                  {node.sub}
                </div>
              </div>
            </div>

            {/* Connector */}
            {i < NODES.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: i < active ? 'linear-gradient(90deg, #46464E, #2A2A2F)' : '#1D1D22',
                  marginBottom: 32,
                  position: 'relative',
                  minWidth: 16,
                  transition: 'background 0.4s ease',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: -3,
                    top: -3,
                    width: 0,
                    height: 0,
                    borderTop: '3px solid transparent',
                    borderBottom: '3px solid transparent',
                    borderLeft: `5px solid ${i < active ? '#46464E' : '#1D1D22'}`,
                    transition: 'border-left-color 0.4s ease',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
