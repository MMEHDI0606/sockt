'use client';

import { useState } from 'react';
import gsap from 'gsap';

const TABS = ['TypeScript', 'Python', 'Go', 'CLI'];

const CODE: Record<string, string> = {
  TypeScript: `import { SatoshiComputeClient } from 'satoshi-compute-client';

const client = new SatoshiComputeClient({
  baseUrl: 'https://api.satoshicompute.io',
  wallet: {
    bolt12Offer: process.env.BOLT12_OFFER!,
  },
});

// Registers wallet offer and returns agent token
await client.wallet.registerOffer();

const sandbox = await client.sandbox.create({
  tier: 'gpu_small',
  template: 'ubuntu22-cuda12-pytorch',
  durationSecs: 1800,
  egress: false,
});

const out = await client.sandbox.exec(sandbox.sandboxId, {
  command: 'python train.py --epochs 1',
});

console.log(out.stdout);`,

  Python: `from satoshi_compute_client import SatoshiComputeClient
import os

client = SatoshiComputeClient(
    base_url="https://api.satoshicompute.io",
    bolt12_offer=os.environ["BOLT12_OFFER"]
)

client.wallet.register_offer()

sandbox = client.sandbox.create(
    tier="gpu_large",
    template="ubuntu22-cuda12-pytorch",
    duration_secs=1800,
    egress=False,
)

result = client.sandbox.exec(
    sandbox["sandbox_id"],
    command="python train.py --epochs 1"
)

print(result["stdout"])
`,

  Go: `package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    payload := map[string]any{
        "tier": "standard",
        "template": "ubuntu22-python",
        "duration_secs": 900,
    }

    body, _ := json.Marshal(payload)
    req, _ := http.NewRequest("POST", "https://api.satoshicompute.io/v1/sandbox/create", bytes.NewReader(body))
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("X-Agent-Token", "<agent_jwt>")
    req.Header.Set("Authorization", "L402 <macaroon>:<preimage>")

    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    fmt.Println("create status:", resp.StatusCode)
}`,

  CLI: `# Install the client
pip install satoshi-compute-client

# Register wallet offer (BOLT12)
sc wallet offer register --offer "$BOLT12_OFFER"

# Create sandbox
sc sandbox create \
  --tier gpu_small \
  --template ubuntu22-cuda12-pytorch \
  --duration-secs 1800

# Run command
sc sandbox exec --id <sandbox_id> --command "python train.py --epochs 1"

# Pause and resume lifecycle
sc sandbox pause --id <sandbox_id>
sc sandbox resume --id <sandbox_id>
sc billing history`,
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
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-display)', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 0.9 }}>
              AGENT SDKS
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--text-secondary)', marginTop: '10px' }}>
              PRD v2 flow: wallet offer registration, L402-authenticated calls, sandbox lifecycle, and billing history.
            </p>
          </div>
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
