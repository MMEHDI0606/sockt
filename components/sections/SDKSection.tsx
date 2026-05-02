'use client';

import { useState } from 'react';
import gsap from 'gsap';

const TABS = ['TypeScript', 'Python', 'Go', 'CLI'];

const CODE: Record<string, string> = {
  TypeScript: `import { SocktAgent } from '@sockt/sdk';

const agent = new SocktAgent({
  apiKey: process.env.SOCKT_KEY,
  budget: { sats: 50_000 },
  fallback: {
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_KEY
  }
});

const session = await agent.provision({
  gpu: 'H100',
  count: 2,
  duration: '30m'
});

// Sats stream automatically per epoch
console.log(session.channelId); // lnbc...`,

  Python: `from sockt import Agent
import os

agent = Agent(
    api_key=os.environ["SOCKT_KEY"],
    budget_sats=50_000,
    fallback_key=os.environ["ANTHROPIC_KEY"]
)

session = agent.provision(
    gpu="H100",
    count=2,
    duration="30m"
)

print(session.channel_id)  # lnbc...`,

  Go: `package main

import (
    "fmt"
    "github.com/sockt/go-sdk"
)

func main() {
    agent := sockt.NewAgent(sockt.Config{
        APIKey:     os.Getenv("SOCKT_KEY"),
        BudgetSats: 50_000,
    })

    session, _ := agent.Provision(sockt.ProvisionRequest{
        GPU:      "H100",
        Count:    2,
        Duration: "30m",
    })

    fmt.Println(session.ChannelID)
}`,

  CLI: `# Install the Sockt CLI
npm install -g @sockt/cli

# Authenticate with your Lightning node
sockt auth --node lnbc1pvjluez...

# Provision GPU compute
sockt provision \\
  --gpu H100 \\
  --count 2 \\
  --duration 30m \\
  --budget 50000

# Monitor active sessions
sockt status`,
};

export default function SDKSection() {
  const [activeTab, setActiveTab] = useState('TypeScript');
  const codeRef = { current: null as HTMLPreElement | null };

  const switchTab = (tab: string) => {
    if (!codeRef.current) {
      setActiveTab(tab);
      return;
    }
    gsap.fromTo(
      codeRef.current,
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, duration: 0.24, ease: 'power2.out' }
    );
    setActiveTab(tab);
  };

  return (
    <section
      style={{
        padding: '120px 32px',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '64px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '72px', color: 'var(--bg-border)', lineHeight: 1 }}>06</span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.9 }}>
            AGENT SDK
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '48px' }}>
          {/* Tab selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  color: activeTab === tab ? 'var(--accent-btc)' : 'var(--text-secondary)',
                  backgroundColor: activeTab === tab ? 'var(--bg-raised)' : 'transparent',
                  border: `1px solid ${activeTab === tab ? 'var(--bg-border)' : 'transparent'}`,
                  borderLeft: activeTab === tab ? '3px solid var(--accent-btc)' : '3px solid transparent',
                  padding: '10px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: '0 4px 4px 0',
                  letterSpacing: '0.04em',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Code block */}
          <div style={{ flex: 1 }}>
            <pre
              ref={(el) => { codeRef.current = el; }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                lineHeight: 1.7,
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--bg-border)',
                borderRadius: '6px',
                padding: '28px',
                color: 'var(--text-mono)',
                overflow: 'auto',
                margin: 0,
              }}
            >
              <code>{CODE[activeTab]}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
