'use client';

type SlackMessage = {
  type: 'agent' | 'user';
  name: string;
  avatar: string;
  time: string;
  content: React.ReactNode;
};

const messages: SlackMessage[] = [
  {
    type: 'agent',
    name: 'Sockt Growth',
    avatar: '{*}',
    time: '9:04 AM',
    content: (
      <span>
        Morning @Mehdi — I found <strong style={{ color: '#f0ece4' }}>5 high-intent leads</strong> from r/SaaS and HN since 3 AM. Want me to draft outreach for the top 2?
      </span>
    ),
  },
  {
    type: 'user',
    name: 'Mehdi',
    avatar: 'M',
    time: '9:06 AM',
    content: <span>Yes, do it. Auto-send if lead score &gt; 80.</span>,
  },
  {
    type: 'agent',
    name: 'Sockt Growth',
    avatar: '{*}',
    time: '9:06 AM',
    content: (
      <span>
        ✓ Drafts queued. Auto-send threshold set. <br />
        <span style={{ color: '#6b6761', fontSize: '12px' }}>
          2 drafts ready · 1 pending review (score 74) · 2 discarded
        </span>
      </span>
    ),
  },
  {
    type: 'agent',
    name: 'Sockt Ops',
    avatar: '{*}',
    time: '9:11 AM',
    content: (
      <span>
        🔔 Sentry spike on <code style={{ background: '#161616', padding: '1px 5px', borderRadius: 3, fontSize: 11 }}>api/enrich</code> — correlates with the 2 AM deploy. Root cause: timeout on Apollo. Fix queued.
      </span>
    ),
  },
];

export default function SlackMock({ compact = false }: { compact?: boolean }) {
  return (
    <div
      style={{
        background: '#1a1d21',
        border: '1px solid #2d2d2d',
        borderRadius: 12,
        overflow: 'hidden',
        width: compact ? '100%' : 460,
        fontFamily: '"Geist", -apple-system, sans-serif',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      {/* Titlebar */}
      <div
        style={{
          background: '#19191d',
          borderBottom: '1px solid #2d2d2d',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 6 }}>
          {['#e53e3e', '#fbbf24', '#22d07a'].map((c) => (
            <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'block' }} />
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#6b6761', marginLeft: 8 }}>
          # sockt-swarms · your-workspace
        </span>
      </div>

      {/* Messages */}
      <div style={{ padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {(compact ? messages.slice(0, 3) : messages).map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: 10,
              padding: '6px 16px',
              background: i === 1 ? 'transparent' : 'transparent',
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                background: msg.type === 'agent' ? '#c27a36' : '#3f3f3f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: msg.type === 'agent' ? '#080808' : '#f0ece4',
                fontWeight: 700,
                flexShrink: 0,
                marginTop: 2,
              }}
            >
              {msg.avatar}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: msg.type === 'agent' ? '#c27a36' : '#e8e4dc',
                  }}
                >
                  {msg.name}
                </span>
                {msg.type === 'agent' && (
                  <span
                    style={{
                      fontSize: 9,
                      fontFamily: 'var(--font-mono)',
                      background: '#c27a3620',
                      color: '#c27a36',
                      border: '1px solid #c27a3630',
                      borderRadius: 3,
                      padding: '1px 5px',
                      letterSpacing: '0.06em',
                    }}
                  >
                    APP
                  </span>
                )}
                <span style={{ fontSize: 11, color: '#6b6761' }}>{msg.time}</span>
              </div>
              <div style={{ fontSize: 13.5, color: '#b9b4ae', lineHeight: 1.55 }}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <div
        style={{
          margin: '8px 16px 16px',
          border: '1px solid #3d3d3d',
          borderRadius: 8,
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: '#222226',
        }}
      >
        <span style={{ color: '#6b6761', fontSize: 13 }}>Message #sockt-swarms</span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: '#3d3d3d',
          }}
        >
          ↵
        </span>
      </div>
    </div>
  );
}
