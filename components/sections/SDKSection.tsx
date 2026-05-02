'use client';

import { useState } from 'react';
import gsap from 'gsap';
import { useIsMobile } from '@/hooks/useIsMobile';

const TABS = ['TypeScript', 'Python', 'Go', 'CLI'];

const CODE: Record<string, string> = {
  TypeScript: `import { SocktClient } from '@sockt/sdk';

const client = new SocktClient({
  apiKey: process.env.SOCKT_API_KEY,
});

const session = await client.sandbox.create({
  profile: 'compute-pro',
  duration: '30m',
});

const run = await client.sandbox.exec(session.id, {
  command: 'python task.py --mode eval',
});

console.log(run.stdout);
await client.sandbox.pause(session.id);`,

  Python: `from sockt import SocktClient
import os

client = SocktClient(
    api_key=os.environ["SOCKT_API_KEY"]
)

sandbox = client.sandbox.create(
    profile="compute-pro",
    duration="30m",
)

result = client.sandbox.exec(
    sandbox["id"],
    command="python task.py --mode eval"
)

print(result["stdout"])
`,

  Go: `package main

import (
    "fmt"
    sockt "github.com/sockt/go-sdk"
)

func main() {
    client := sockt.NewClient(sockt.Config{
        APIKey: "<SOCKT_API_KEY>",
    })

    session, err := client.CreateSandbox(sockt.CreateSandboxRequest{
        Profile:  "compute-pro",
        Duration: "30m",
    })
    if err != nil {
        panic(err)
    }

    out, _ := client.Exec(session.ID, "python task.py --mode eval")
    fmt.Println(out.Stdout)
}`,

  CLI: `# Install the client
npm install -g @sockt/cli

# Create sandbox
sockt sandbox create \
  --profile compute-pro \
  --duration 30m

# Run command
sockt sandbox exec --id <sandbox_id> --command "python task.py --mode eval"

# Pause and resume lifecycle
sockt sandbox pause --id <sandbox_id>
sockt sandbox resume --id <sandbox_id>
sockt billing history`,
};

export default function SDKSection() {
  const [activeTab, setActiveTab] = useState('TypeScript');
  const isMobile = useIsMobile();
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
        padding: isMobile ? '80px 24px' : '120px 32px',
        borderTop: '1px solid var(--bg-border)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', marginBottom: '64px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '72px', color: 'var(--bg-border)', lineHeight: 1 }}>06</span>
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.9 }}>
              AGENT SDKS
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-secondary)', marginTop: '10px' }}>
              Reference integration patterns for sandbox lifecycle, command execution, and billing visibility.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '16px' : '48px' }}>
          {/* Tab selector */}
          <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '4px', flexShrink: 0, overflowX: isMobile ? 'auto' : 'visible' }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => switchTab(tab)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: isMobile ? '12px' : '13px',
                  color: activeTab === tab ? 'var(--accent-btc)' : 'var(--text-secondary)',
                  backgroundColor: activeTab === tab ? 'var(--bg-raised)' : 'transparent',
                  border: `1px solid ${activeTab === tab ? 'var(--bg-border)' : 'transparent'}`,
                  borderLeft: isMobile ? undefined : (activeTab === tab ? '3px solid var(--accent-btc)' : '3px solid transparent'),
                  borderBottom: isMobile ? (activeTab === tab ? '2px solid var(--accent-btc)' : '2px solid transparent') : undefined,
                  padding: isMobile ? '8px 12px' : '10px 16px',
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
