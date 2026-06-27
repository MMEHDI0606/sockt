'use client';

import { useEffect, useRef, useState } from 'react';

type Msg = {
  agent: boolean;
  name: string;
  time: string;
  lines: string[];
  badge?: string;
};

const MESSAGES: Msg[] = [
  {
    agent: true,
    name: 'Sockt Growth',
    time: '09:04',
    badge: 'APP',
    lines: [
      'Morning @Mehdi — I found 5 high-intent leads from r/SaaS and HN since 3 AM.',
      'Top 2 have strong ICP match (score 88 / 91). Want me to draft outreach?',
    ],
  },
  {
    agent: false,
    name: 'Mehdi',
    time: '09:06',
    lines: ['Go. Auto-send if score > 85.'],
  },
  {
    agent: true,
    name: 'Sockt Growth',
    time: '09:06',
    badge: 'APP',
    lines: [
      '✓ 2 drafts queued and sent (score 88, 91).',
      '1 held for review (score 74) · 2 discarded · GBrain updated.',
    ],
  },
  {
    agent: true,
    name: 'Sockt Ops',
    time: '09:11',
    badge: 'APP',
    lines: [
      '🔔 Sentry spike on api/enrich — correlates with 2:14 AM deploy (#c7a3f8).',
      'Root cause: Apollo rate limit changed. Auto-fix queued, awaiting your approval.',
    ],
  },
];

const CHANNELS = [
  { name: 'sockt-swarms', active: true },
  { name: 'sockt-growth', active: false },
  { name: 'sockt-ops', active: false },
  { name: 'general', active: false },
];

export default function SlackMock({ className, glow = true }: { className?: string; glow?: boolean }) {
  const [visible, setVisible] = useState(2);
  const containerRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          let i = 2;
          const tick = () => {
            i++;
            setVisible(i);
            if (i < MESSAGES.length) setTimeout(tick, 900);
          };
          setTimeout(tick, 800);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        display: 'flex',
        borderRadius: 14,
        overflow: 'visible',
        width: '100%',
        maxWidth: 480,
        /* Ambient corona — the mock glows softly like a live terminal in darkness */
        filter: glow ? 'drop-shadow(0 0 40px rgba(238,236,232,0.06)) drop-shadow(0 24px 64px rgba(0,0,0,0.55))' : undefined,
      }}
    >
      {/* Inner wrapper that clips content */}
      <div style={{
        display: 'flex',
        borderRadius: 14,
        overflow: 'hidden',
        border: '1px solid #2A2A2F',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.05)',
        background: '#16181C',
        fontFamily: '"Geist", -apple-system, sans-serif',
        width: '100%',
      }}>
      {/* Sidebar */}
      <div
        style={{
          width: 180,
          background: '#111315',
          borderRight: '1px solid #222428',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          padding: '16px 0 12px',
        }}
      >
        {/* Workspace */}
        <div
          style={{
            padding: '0 14px 16px',
            borderBottom: '1px solid #222428',
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: '#EEECE8',
              letterSpacing: '-0.01em',
            }}
          >
            Your Workspace
          </div>
          <div
            style={{
              fontSize: 11,
              color: '#6D6D78',
              marginTop: 2,
              fontFamily: 'var(--font-mono)',
            }}
          >
            ● Online
          </div>
        </div>

        {/* Channels */}
        <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: '#44444B',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '4px 8px 8px',
            }}
          >
            Channels
          </div>
          {CHANNELS.map((ch) => (
            <div
              key={ch.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '5px 8px',
                borderRadius: 6,
                background: ch.active ? 'rgba(255,255,255,0.06)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <span style={{ color: '#44444B', fontSize: 13 }}>#</span>
              <span
                style={{
                  fontSize: 12,
                  color: ch.active ? '#EEECE8' : '#6D6D78',
                  fontWeight: ch.active ? 500 : 400,
                  letterSpacing: '-0.01em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {ch.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 16px',
            borderBottom: '1px solid #222428',
          }}
        >
          <span style={{ color: '#44444B', fontSize: 14 }}>#</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#EEECE8' }}>sockt-swarms</span>
          <span
            style={{
              marginLeft: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: '#44444B',
            }}
          >
            ···
          </span>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: '12px 4px', display: 'flex', flexDirection: 'column', gap: 0, overflowY: 'auto' }}>
          {MESSAGES.slice(0, visible).map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 10,
                padding: '6px 12px',
                transition: 'opacity 0.4s ease',
                opacity: i < visible ? 1 : 0,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 6,
                  background: msg.agent ? '#242428' : '#2A2A2F',
                  border: msg.agent ? '1px solid #38383E' : '1px solid #2A2A2F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                  fontFamily: 'var(--font-mono)',
                  fontSize: msg.agent ? 9 : 11,
                  color: msg.agent ? '#A09D98' : '#6D6D78',
                  fontWeight: 600,
                }}
              >
                {msg.agent ? '{*}' : msg.name[0]}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: msg.agent ? '#EEECE8' : '#C8C6C2',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {msg.name}
                  </span>
                  {msg.badge && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 8,
                        color: '#6D6D78',
                        background: '#1D1D22',
                        border: '1px solid #2A2A2F',
                        borderRadius: 3,
                        padding: '1px 5px',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {msg.badge}
                    </span>
                  )}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#44444B' }}>
                    {msg.time}
                  </span>
                </div>
                {msg.lines.map((line, j) => (
                  <div
                    key={j}
                    style={{
                      fontSize: 13,
                      color: '#A09D98',
                      lineHeight: 1.5,
                      marginBottom: j < msg.lines.length - 1 ? 2 : 0,
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: '10px 12px 14px' }}>
          <div
            style={{
              border: '1px solid #2A2A2F',
              borderRadius: 8,
              padding: '9px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: '#1D1D22',
            }}
          >
            <span style={{ color: '#44444B', fontSize: 12 }}>Message #sockt-swarms</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#2A2A2F' }}>↵</span>
          </div>
        </div>
      </div>
      </div>{/* /inner wrapper */}
    </div>
  );
}
