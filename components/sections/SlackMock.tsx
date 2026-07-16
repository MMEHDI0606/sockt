'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Msg = {
  agent: boolean;
  name: string;
  avatar?: string;      // override avatar char
  time: string;
  lines: string[];
  badge?: string;
  reaction?: string;    // emoji reaction shown below
};

type Channel = {
  id: string;
  name: string;
  desc: string;
  messages: Msg[];
};

// ─── Channel content ──────────────────────────────────────────────────────────
const CHANNELS: Channel[] = [
  {
    id: 'sockt-growth',
    name: 'sockt-growth',
    desc: 'Growth swarm · lead gen + outbound',
    messages: [
      {
        agent: true, name: 'Sockt Growth', badge: 'APP', time: '07:42',
        lines: [
          'Found 3 buying-intent threads on r/SaaS and HN since midnight.',
          'Top signal: "We outgrew HubSpot, looking for alternatives" — posted 2 hrs ago.',
        ],
      },
      {
        agent: true, name: 'Sockt Growth', badge: 'APP', time: '07:43',
        lines: [
          'Lead enriched: Priya Kapoor · Head of Ops · Series B SaaS · 42 employees.',
          'Score: 91 · email found · draft outreach ready for your approval.',
        ],
        reaction: '👀',
      },
      {
        agent: false, name: 'Mehdi', avatar: 'M', time: '09:01',
        lines: ['Looks perfect. Send it.'],
      },
      {
        agent: true, name: 'Sockt Growth', badge: 'APP', time: '09:01',
        lines: ['✓ Sent. Queued 2 more drafts for your review this afternoon.'],
      },
    ],
  },
  {
    id: 'sockt-ops',
    name: 'sockt-ops',
    desc: 'Eng ops swarm · incidents + infra',
    messages: [
      {
        agent: true, name: 'Sockt Ops', badge: 'APP', time: '02:14',
        lines: [
          '🔔 P2 — api/enrich error rate spiked to 8.4% (baseline 0.2%).',
          'Correlates with deploy #c7a3f8 merged at 02:09.',
        ],
      },
      {
        agent: true, name: 'Sockt Ops', badge: 'APP', time: '02:16',
        lines: [
          'Root cause identified: Apollo.io rate limit changed from 600→200 req/min.',
          'GBrain has 2 prior incidents with this pattern. Backoff fix queued.',
        ],
        reaction: '🧠',
      },
      {
        agent: false, name: 'Ali', avatar: 'A', time: '08:30',
        lines: ['Ship the fix. Also update the runbook.'],
      },
      {
        agent: true, name: 'Sockt Ops', badge: 'APP', time: '08:31',
        lines: [
          '✓ Fix deployed · error rate back to 0.2%.',
          '✓ Runbook updated in GBrain/decisions/2026-06-28-apollo-ratelimit.md',
        ],
      },
    ],
  },
  {
    id: 'general',
    name: 'general',
    desc: 'Team updates',
    messages: [
      {
        agent: false, name: 'Ali', avatar: 'A', time: '09:15',
        lines: ['Growth swarm found 8 leads this week. Booked 2 calls already 🎯'],
      },
      {
        agent: false, name: 'Mehdi', avatar: 'M', time: '09:17',
        lines: ['Ops swarm caught the Apollo outage at 2am before any customer noticed. Worth it.'],
        reaction: '🔥',
      },
      {
        agent: true, name: 'Sockt', badge: 'APP', time: '09:20',
        lines: [
          'Weekly digest: 14 leads enriched · 2 incidents triaged · 1 PR reviewed.',
          'GBrain grew by 34 entries this week. Dream-Cycle runs tonight.',
        ],
      },
      {
        agent: false, name: 'Ali', avatar: 'A', time: '09:21',
        lines: ['this thing is genuinely replacing a hire'],
      },
    ],
  },
];

// ─── Theme detection ──────────────────────────────────────────────────────────
function useTheme() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    const read = () => {
      const attr = document.documentElement.getAttribute('data-theme');
      if (attr === 'light') { setLight(true); return; }
      if (attr === 'dark')  { setLight(false); return; }
      setLight(window.matchMedia('(prefers-color-scheme: light)').matches);
    };
    read();

    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const mq = window.matchMedia('(prefers-color-scheme: light)');
    mq.addEventListener('change', read);

    return () => { mo.disconnect(); mq.removeEventListener('change', read); };
  }, []);

  return light;
}

// ─── Colour palette (dark / light) ────────────────────────────────────────────
function palette(light: boolean) {
  return light
    ? {
        outer:        '#FFFFFF',
        sidebar:      '#F8F8F8',
        sidebarBdr:   '#E8E8E8',
        workspaceText:'#1D1C1D',
        onlineDot:    '#007A5A',
        chLabel:      '#9E9EA6',
        chActive:     '#1164A3',
        chActiveBg:   'rgba(17,100,163,0.1)',
        chText:       '#616061',
        headerBdr:    '#E8E8E8',
        headerText:   '#1D1C1D',
        msgBg:        '#FFFFFF',
        agentAvBg:    '#F3F4F6',
        agentAvBdr:   '#E2E3E5',
        agentAvText:  '#374151',
        userAvBg:     '#E5E7EB',
        userAvText:   '#6B7280',
        nameBg:       '#F3F4F6',
        nameBdr:      '#E2E3E5',
        nameText:     '#6B7280',
        agentName:    '#1D1C1D',
        userName:     '#1D1C1D',
        timeText:     '#9E9EA6',
        msgText:      '#1D1C1D',
        reactionBg:   '#F8F8F8',
        reactionBdr:  '#E8E8E8',
        inputBg:      '#F8F8F8',
        inputBdr:     '#E8E8E8',
        inputText:    '#9E9EA6',
        bdr:          '#E8E8E8',
        outerBdr:     '#E8E8E8',
        shadow:       'rgba(0,0,0,0.08)',
      }
    : {
        outer:        '#16181C',
        sidebar:      '#111315',
        sidebarBdr:   '#222428',
        workspaceText:'#EEECE8',
        onlineDot:    '#22D07A',
        chLabel:      '#44444B',
        chActive:     '#EEECE8',
        chActiveBg:   'rgba(255,255,255,0.06)',
        chText:       '#6D6D78',
        headerBdr:    '#222428',
        headerText:   '#EEECE8',
        msgBg:        '#16181C',
        agentAvBg:    '#242428',
        agentAvBdr:   '#38383E',
        agentAvText:  '#A09D98',
        userAvBg:     '#2A2A2F',
        userAvText:   '#6D6D78',
        nameBg:       '#1D1D22',
        nameBdr:      '#2A2A2F',
        nameText:     '#6D6D78',
        agentName:    '#EEECE8',
        userName:     '#C8C6C2',
        timeText:     '#44444B',
        msgText:      '#A09D98',
        reactionBg:   '#1D1D22',
        reactionBdr:  '#2A2A2F',
        inputBg:      '#1D1D22',
        inputBdr:     '#2A2A2F',
        inputText:    '#44444B',
        bdr:          '#222428',
        outerBdr:     '#2A2A2F',
        shadow:       'rgba(0,0,0,0.5)',
      };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SlackMock({
  className,
  glow = true,
}: {
  className?: string;
  glow?: boolean;
}) {
  const isLight = useTheme();
  const p = palette(isLight);

  const [activeId, setActiveId] = useState('sockt-growth');
  const [visible, setVisible]   = useState(0);
  const [fading, setFading]     = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeChannel = CHANNELS.find((c) => c.id === activeId) ?? CHANNELS[0];

  // Animate messages into view whenever the channel changes
  const animateIn = useCallback((msgs: Msg[]) => {
    setVisible(0);
    let i = 0;
    const tick = () => {
      i++;
      setVisible(i);
      if (i < msgs.length) timerRef.current = setTimeout(tick, 420);
    };
    timerRef.current = setTimeout(tick, 120);
  }, []);

  // Switch channel with a fade-out → swap → fade-in
  const switchChannel = (id: string) => {
    if (id === activeId) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setFading(true);
    timerRef.current = setTimeout(() => {
      setActiveId(id);
      setFading(false);
    }, 200);
  };

  // Kick off animation when channel content lands
  useEffect(() => {
    if (!fading) animateIn(activeChannel.messages);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, fading]);

  return (
    <>
      {/* Light-mode transition on the drop-shadow glow */}
      <style>{`
        .slack-mock-outer { transition: filter 0.4s ease; }
        .slack-msg { transition: opacity 0.28s ease, transform 0.28s ease; }
        .slack-ch-row {
          transition: background 0.15s ease;
          cursor: pointer;
          border-radius: 6px;
        }
        .slack-ch-row:hover { background: ${isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.04)'} !important; }
      `}</style>

      <div
        className={`slack-mock-outer ${className ?? ''}`}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 500,
        }}
      >
        {/* ── Machined bezel outer frame ──────────────────────────────────── */}
        <div style={{
          border: `1px solid ${isLight ? '#D8D5CD' : '#33333A'}`,
          borderTop: `1px solid ${isLight ? '#E2DFD8' : '#3F3F48'}`,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: glow
            ? isLight
              ? '0 4px 24px rgba(0,0,0,0.10), 0 24px 60px rgba(0,0,0,0.14)'
              : '0 4px 32px rgba(0,0,0,0.5), 0 24px 64px rgba(0,0,0,0.65)'
            : undefined,
          background: p.outer,
        }}>

        {/* Monochrome header dots */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '8px 12px',
          background: isLight ? '#F0EEE9' : '#0E0E12',
          borderBottom: `1px solid ${isLight ? '#D8D5CD' : '#1E1E23'}`,
        }}>
          {[0,1,2].map(i => (
            <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: isLight ? '#C8C5BE' : '#2A2A2F', display: 'inline-block' }} />
          ))}
        </div>

        {/* ── Chrome frame ───────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          width: '100%',
          background: p.outer,
          fontFamily: '"Geist", -apple-system, sans-serif',
        }}>

          {/* ── Sidebar ──────────────────────────────────────────────────── */}
          <div style={{
            width: 188,
            background: p.sidebar,
            borderRight: `1px solid ${p.sidebarBdr}`,
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            padding: '16px 0 12px',
          }}>
            {/* Workspace header */}
            <div style={{ padding: '0 14px 14px', borderBottom: `1px solid ${p.sidebarBdr}`, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: p.workspaceText, letterSpacing: '-0.01em' }}>
                Your Workspace
              </div>
              <div style={{ fontSize: 11, color: p.onlineDot, marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.onlineDot, display: 'inline-block' }} />
                <span style={{ color: p.chText, fontFamily: 'var(--font-mono)' }}>Online</span>
              </div>
            </div>

            {/* Channel list */}
            <div style={{ padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: p.chLabel, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 8px 8px' }}>
                Channels
              </div>

              {CHANNELS.map((ch) => {
                const isActive = ch.id === activeId;
                return (
                  <div
                    key={ch.id}
                    className="slack-ch-row"
                    onClick={() => switchChannel(ch.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 8px',
                      background: isActive ? p.chActiveBg : 'transparent',
                      userSelect: 'none',
                    }}
                  >
                    <span style={{ color: isActive ? p.chActive : p.chLabel, fontSize: 13, flexShrink: 0, fontWeight: isActive ? 600 : 400 }}>#</span>
                    <span style={{
                      fontSize: 12.5,
                      color: isActive ? p.chActive : p.chText,
                      fontWeight: isActive ? 600 : 400,
                      letterSpacing: '-0.01em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {ch.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Main area ────────────────────────────────────────────────── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, background: p.msgBg }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: `1px solid ${p.headerBdr}` }}>
              <span style={{ color: p.chLabel, fontSize: 14, fontWeight: 700 }}>#</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: p.headerText }}>{activeChannel.name}</span>
              <span style={{ fontSize: 11, color: p.chText, marginLeft: 4 }}>{activeChannel.desc}</span>
              <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: p.chLabel }}>···</span>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '10px 4px',
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              opacity: fading ? 0 : 1,
              transition: 'opacity 0.2s ease',
              minHeight: 200,
            }}>
              {activeChannel.messages.slice(0, visible).map((msg, i) => (
                <div
                  key={`${activeId}-${i}`}
                  className="slack-msg"
                  style={{
                    display: 'flex',
                    gap: 10,
                    padding: '5px 12px',
                    opacity: 1,
                    transform: 'translateY(0)',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 30, height: 30, borderRadius: 6, flexShrink: 0, marginTop: 2,
                    background: msg.agent ? p.agentAvBg : p.userAvBg,
                    border: `1px solid ${msg.agent ? p.agentAvBdr : p.agentAvBdr}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: msg.agent ? 8 : 11,
                    color: msg.agent ? p.agentAvText : p.userAvText,
                    fontWeight: 600,
                  }}>
                    {msg.agent ? '{*}' : (msg.avatar ?? msg.name[0])}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: msg.agent ? p.agentName : p.userName, letterSpacing: '-0.01em' }}>
                        {msg.name}
                      </span>
                      {msg.badge && (
                        <span style={{
                          fontFamily: 'var(--font-mono)', fontSize: 8,
                          color: p.nameText, background: p.nameBg,
                          border: `1px solid ${p.nameBdr}`, borderRadius: 3,
                          padding: '1px 5px', letterSpacing: '0.08em',
                        }}>
                          {msg.badge}
                        </span>
                      )}
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: p.timeText }}>
                        {msg.time}
                      </span>
                    </div>

                    {msg.lines.map((line, j) => (
                      <div key={j} style={{
                        fontSize: 13, color: p.msgText,
                        lineHeight: 1.5, marginBottom: j < msg.lines.length - 1 ? 2 : 0,
                      }}>
                        {line}
                      </div>
                    ))}

                    {msg.reaction && (
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        marginTop: 6, padding: '2px 8px',
                        background: p.reactionBg, border: `1px solid ${p.reactionBdr}`,
                        borderRadius: 12, fontSize: 12,
                      }}>
                        {msg.reaction}
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: p.chText }}>1</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding: '10px 12px 14px' }}>
              <div style={{
                border: `1px solid ${p.inputBdr}`,
                borderRadius: 8, padding: '9px 14px',
                display: 'flex', alignItems: 'center', gap: 8,
                background: p.inputBg,
              }}>
                <span style={{ color: p.inputText, fontSize: 12 }}>
                  Message #{activeChannel.name}
                </span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 10, color: p.inputBdr }}>↵</span>
              </div>
            </div>

          </div>{/* /main */}
        </div>{/* /chrome */}
        </div>{/* /bezel */}

        {/* Museum-placard caption */}
        <div style={{
          marginTop: 10,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: isLight ? '#9A9890' : '#44444B',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-brass)', display: 'inline-block', flexShrink: 0 }} />
          Live — #ops-standby · sockt fleet responding
        </div>
      </div>
    </>
  );
}
