'use client';

import { useEffect, useRef } from 'react';

const NODES = [
  { id: 'slack', label: 'Slack', sub: 'Message / mention', color: '#4A154B' },
  { id: 'gateway', label: 'Gateway', sub: 'Channel + auth', color: '#c27a36' },
  { id: 'orch', label: 'Orchestrator', sub: 'FSM task list', color: '#c27a36' },
  { id: 'tee', label: 'TEE Sandbox', sub: 'Isolated compute', color: '#c27a36' },
  { id: 'gbrain', label: 'GBrain', sub: 'Git-backed memory', color: '#22d07a' },
];

export default function ArchFlow({ compact = false }: { compact?: boolean }) {
  const dotRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dotRef.current || !lineRef.current) return;
    const dot = dotRef.current;
    const line = lineRef.current;
    const lineWidth = line.offsetWidth;

    let x = 0;
    let dir = 1;
    let raf: number;

    const animate = () => {
      x += dir * 0.5;
      if (x >= lineWidth - 8 || x <= 0) dir *= -1;
      dot.style.left = `${x}px`;
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        {NODES.map((node, i) => (
          <div key={node.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: node.color,
                flexShrink: 0,
              }}
            />
            <div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#f0ece4', letterSpacing: '0.06em' }}>
                {node.label}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#6b6761', marginLeft: 8 }}>
                {node.sub}
              </span>
            </div>
            {i < NODES.length - 1 && (
              <div
                style={{
                  marginLeft: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  color: '#3d3d3d',
                }}
              >
                ↓
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 0,
          minWidth: 560,
          position: 'relative',
        }}
      >
        {NODES.map((node, i) => (
          <div key={node.id} style={{ display: 'flex', alignItems: 'center', flex: i < NODES.length - 1 ? 1 : 'none' }}>
            {/* Node */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  border: `1.5px solid ${node.color}40`,
                  background: `${node.color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: node.color,
                    boxShadow: `0 0 10px ${node.color}`,
                  }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: '#f0ece4',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {node.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: '#6b6761',
                    whiteSpace: 'nowrap',
                    marginTop: 2,
                  }}
                >
                  {node.sub}
                </div>
              </div>
            </div>

            {/* Connector */}
            {i < NODES.length - 1 && (
              <div
                ref={i === 1 ? lineRef : undefined}
                style={{
                  flex: 1,
                  height: 1,
                  background: 'linear-gradient(90deg, #c27a3640, #c27a3620)',
                  position: 'relative',
                  marginBottom: 28,
                  minWidth: 20,
                }}
              >
                {i === 1 && (
                  <div
                    ref={dotRef}
                    style={{
                      position: 'absolute',
                      top: -3,
                      left: 0,
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: '#c27a36',
                      boxShadow: '0 0 8px #c27a36',
                    }}
                  />
                )}
                <div
                  style={{
                    position: 'absolute',
                    right: -4,
                    top: -3,
                    width: 0,
                    height: 0,
                    borderTop: '4px solid transparent',
                    borderBottom: '4px solid transparent',
                    borderLeft: '6px solid #c27a3640',
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
