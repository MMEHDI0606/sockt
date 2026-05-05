'use client';

import { useState } from 'react';
import Nav from '@/components/nav/Nav';

type Section = 'overview' | 'mcp' | 'sdk' | 'sandbox' | 'billing';

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'mcp', label: 'MCP Server' },
  { id: 'sdk', label: 'SDK' },
  { id: 'sandbox', label: 'Sandbox API' },
  { id: 'billing', label: 'Billing & Tiers' },
];

const CODE = {
  mcpJson: `{
  "mcpServers": {
    "sockt": {
      "url": "https://api.sockt.dev/v1/mcp",
      "headers": {
        "Authorization": "Bearer sockt_live_..."
      }
    }
  }
}`,
  mcpRpc: `// Single JSON-RPC 2.0 POST per tool call
POST https://api.sockt.dev/v1/mcp
Authorization: Bearer sockt_live_...
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "sandbox_create",
    "arguments": {
      "tier": "micro",
      "billing_method": "credits"
    }
  }
}`,
  sdkTs: `import { ComputeClient } from '@sockt/client';

const client = new ComputeClient({ apiKey: process.env.SOCKT_API_KEY });

const sandbox = await client.createSandbox({
  tier: 'micro',
  billingMethod: 'credits',
});

const result = await sandbox.exec('python eval.py --dataset cifar10');
console.log(result.stdout);

await sandbox.terminate();`,
  sdkPy: `from sockt import ComputeClient

client = ComputeClient(api_key=os.environ["SOCKT_API_KEY"])

sandbox = client.create_sandbox(tier="micro", billing_method="credits")

result = sandbox.exec("python eval.py --dataset cifar10")
print(result.stdout)

sandbox.terminate()`,
  l402Flow: `// 1. Agent sends request without credentials
POST https://api.sockt.dev/v1/mcp
X-Agent-Id: <uuid>

// 2. Server returns 402 with Lightning invoice
{
  "macaroon": "...",
  "invoice": "lnbc...",
  "payment_hash": "...",
  "expires_at": "..."
}

// 3. Agent pays invoice via wallet MCP tool, then retries with L402 header
Authorization: L402 <base64_macaroon>:<preimage_hex>`,
};

const MCP_TOOLS = [
  { name: 'sandbox_create', desc: 'Provision a new sandbox on the specified tier. Returns sandbox ID and proxy URL.' },
  { name: 'sandbox_exec', desc: 'Run a shell command inside a sandbox. Returns stdout, stderr, and exit code.' },
  { name: 'sandbox_write_file', desc: 'Write a file into the sandbox filesystem at a given path.' },
  { name: 'sandbox_read_file', desc: 'Read the contents of a file from the sandbox filesystem.' },
  { name: 'sandbox_list_files', desc: 'List files at a path inside the sandbox.' },
  { name: 'sandbox_status', desc: 'Get current sandbox state: running, paused, terminated, etc.' },
  { name: 'sandbox_pause', desc: 'Pause billing and execution for an idle sandbox.' },
  { name: 'sandbox_resume', desc: 'Resume a paused sandbox.' },
  { name: 'sandbox_terminate', desc: 'Destroy the sandbox and stop billing.' },
  { name: 'sandbox_extend_balance', desc: 'Add more sats or credits to a running sandbox.' },
  { name: 'wallet_balance', desc: 'Query the agent Lightning wallet balance in msats.' },
  { name: 'wallet_deposit', desc: 'Generate a Lightning invoice to deposit funds into the agent wallet.' },
  { name: 'wallet_deposit_status', desc: 'Check payment status of a deposit invoice.' },
];

const TIERS = [
  { name: 'nano', sats: '0.5', desc: 'Lightweight CPU tasks', specs: '2 vCPU · 2 GB RAM' },
  { name: 'micro', sats: '2', desc: 'Standard eval and inference', specs: '4 vCPU · 8 GB RAM' },
  { name: 'standard', sats: '4', desc: 'Mid-tier batch workloads', specs: '8 vCPU · 16 GB RAM' },
  { name: 'rtx-5090', sats: '8', desc: 'GPU-accelerated compute', specs: 'RTX 5090 · 32 GB VRAM' },
  { name: 'a100', sats: '15', desc: 'High-memory model training', specs: 'A100 · 80 GB VRAM' },
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        position: 'relative',
        backgroundColor: 'var(--bg-raised)',
        border: '1px solid var(--bg-border)',
        borderRadius: '6px',
        overflow: 'hidden',
        marginTop: '14px',
        marginBottom: '28px',
      }}
    >
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: '10px',
          right: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          letterSpacing: '0.06em',
          padding: '2px 0',
        }}
      >
        {copied ? 'COPIED' : 'COPY'}
      </button>
      <pre
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          lineHeight: 1.65,
          color: 'var(--text-mono)',
          padding: '20px 24px',
          margin: 0,
          overflowX: 'auto',
          whiteSpace: 'pre',
        }}
      >
        {code}
      </pre>
    </div>
  );
}

export default function DocsPage() {
  const [active, setActive] = useState<Section>('overview');

  const sectionStyle: React.CSSProperties = {
    display: 'none',
  };
  const activeSectionStyle: React.CSSProperties = {
    display: 'block',
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-void)',
        minHeight: '100vh',
      }}
    >
      <Nav />
      {/* Docs tab bar */}
      <div
        style={{
          borderBottom: '1px solid var(--bg-border)',
          backgroundColor: 'var(--bg-surface)',
          padding: '0 32px',
          marginTop: '67px',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: '52px',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--accent-amber)', marginRight: '16px', letterSpacing: '0.08em' }}>
            DOCS
          </span>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                letterSpacing: '0.06em',
                padding: '7px 18px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: active === item.id ? 'rgba(194,122,54,0.15)' : 'transparent',
                color: active === item.id ? 'var(--accent-btc)' : 'var(--accent-amber)',
                transition: 'color 0.15s, background-color 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-btc)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = active === item.id ? 'var(--accent-btc)' : 'var(--accent-amber)'; }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          padding: '60px 32px 120px',
        }}
      >
        {/* Overview */}
        <div style={active === 'overview' ? activeSectionStyle : sectionStyle}>
          <SectionHeading label="Overview" number="00" />
          <p style={bodyText}>
            Sockt is a compute-on-demand platform built for AI agents. Agents create sandboxes,
            pay per second in sats via Lightning, execute commands, and terminate — no human in the loop.
          </p>
          <p style={bodyText}>
            There are two integration paths: the <span style={mono}>MCP server</span> at{' '}
            <span style={mono}>https://api.sockt.dev/v1/mcp</span> (for LLM agents using tool-use),
            and the <span style={mono}>@sockt/client</span> SDK (for programmatic access from TypeScript, Python, or Go).
          </p>
          <h3 style={h3Style}>Base URL</h3>
          <CodeBlock code="https://api.sockt.dev" />
          <h3 style={h3Style}>Authentication</h3>
          <p style={bodyText}>
            All authenticated requests use <span style={mono}>Authorization: Bearer &lt;token&gt;</span>.
            Two token types are accepted on sandbox routes:
          </p>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Format</th>
                <th style={thStyle}>Billing</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>API Key</td>
                <td style={tdStyle}><span style={mono}>sockt_live_...</span></td>
                <td style={tdStyle}>Credits (USD)</td>
              </tr>
              <tr>
                <td style={tdStyle}>L402 / Lightning</td>
                <td style={tdStyle}><span style={mono}>L402 &lt;macaroon&gt;:&lt;preimage&gt;</span></td>
                <td style={tdStyle}>Sats per second</td>
              </tr>
            </tbody>
          </table>
          <p style={bodyText}>
            Agents that do not supply credentials receive a <span style={mono}>402</span> response containing a
            Lightning invoice. Once paid, the agent retries with the L402 header. See the{' '}
            <span style={{ ...mono, cursor: 'pointer', color: 'var(--accent-btc)' }} onClick={() => setActive('mcp')}>
              MCP Server
            </span>{' '}
            section for the full flow.
          </p>
          <h3 style={h3Style}>Rate Limits</h3>
          <p style={bodyText}>
            300 requests/minute per API key. Excess requests receive <span style={mono}>429 rate limited</span>.
          </p>
        </div>

        {/* MCP Server */}
        <div style={active === 'mcp' ? activeSectionStyle : sectionStyle}>
          <SectionHeading label="MCP Server" number="01" />
          <p style={bodyText}>
            The Sockt MCP server implements <strong style={{ color: 'var(--text-primary)' }}>JSON-RPC 2.0 over HTTP</strong> — one POST per tool call.
            Any MCP-compatible client (Cursor, Claude Desktop, custom agents) can connect by pointing at{' '}
            <span style={mono}>https://api.sockt.dev/v1/mcp</span>.
          </p>

          <h3 style={h3Style}>Cursor / mcp.json</h3>
          <CodeBlock code={CODE.mcpJson} />

          <h3 style={h3Style}>Raw JSON-RPC</h3>
          <CodeBlock code={CODE.mcpRpc} />

          <h3 style={h3Style}>Supported Methods</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Method</th>
                <th style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { m: 'initialize', d: 'Start an MCP session. Returns protocolVersion, capabilities, session ID.' },
                { m: 'tools/list', d: 'List all available tools with full JSON Schema input descriptors.' },
                { m: 'tools/call', d: 'Invoke a tool by name with arguments.' },
                { m: 'ping', d: 'Health check — returns empty result object.' },
              ].map(({ m, d }) => (
                <tr key={m}>
                  <td style={tdStyle}><span style={mono}>{m}</span></td>
                  <td style={tdStyle}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={h3Style}>Lightning / L402 Agent Flow</h3>
          <p style={bodyText}>
            Agents without an API key can pay per sandbox in sats. The handshake is automatic:
          </p>
          <CodeBlock code={CODE.l402Flow} />

          <h3 style={h3Style}>Available Tools</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
            {MCP_TOOLS.map((tool) => (
              <div
                key={tool.name}
                style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '14px 18px',
                  border: '1px solid var(--bg-border)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface)',
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: 'var(--accent-btc)',
                    whiteSpace: 'nowrap',
                    minWidth: '220px',
                    paddingTop: '1px',
                  }}
                >
                  {tool.name}
                </span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {tool.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SDK */}
        <div style={active === 'sdk' ? activeSectionStyle : sectionStyle}>
          <SectionHeading label="SDK" number="02" />
          <p style={bodyText}>
            The <span style={mono}>@sockt/client</span> package provides a typed client for TypeScript and JavaScript.
            Python and Go clients are available under the <span style={mono}>sockt</span> package name on their respective registries.
          </p>
          <h3 style={h3Style}>Install</h3>
          <CodeBlock code={`npm install @sockt/client\n# or\npip install sockt`} />

          <h3 style={h3Style}>TypeScript</h3>
          <CodeBlock code={CODE.sdkTs} />

          <h3 style={h3Style}>Python</h3>
          <CodeBlock code={CODE.sdkPy} />

          <h3 style={h3Style}>ComputeClient methods</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Method</th>
                <th style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { m: 'createSandbox({ tier, billingMethod })', d: 'Create and start a sandbox. Returns sandbox object.' },
                { m: 'sandbox.exec(command)', d: 'Run a shell command. Returns { stdout, stderr, exitCode }.' },
                { m: 'sandbox.writeFile(path, content)', d: 'Write a file to the sandbox filesystem.' },
                { m: 'sandbox.readFile(path)', d: 'Read a file from the sandbox filesystem.' },
                { m: 'sandbox.pause()', d: 'Pause billing and freeze execution.' },
                { m: 'sandbox.resume()', d: 'Resume from paused state.' },
                { m: 'sandbox.terminate()', d: 'Destroy sandbox and stop billing.' },
                { m: 'sandbox.status()', d: 'Get current sandbox state.' },
              ].map(({ m, d }) => (
                <tr key={m}>
                  <td style={tdStyle}><span style={mono}>{m}</span></td>
                  <td style={tdStyle}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sandbox API */}
        <div style={active === 'sandbox' ? activeSectionStyle : sectionStyle}>
          <SectionHeading label="Sandbox API" number="03" />
          <p style={bodyText}>
            All sandbox endpoints are under <span style={mono}>POST /v1/sandbox</span> and require
            authentication (API key or L402 macaroon).
          </p>
          <h3 style={h3Style}>Lifecycle</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>State</th>
                <th style={thStyle}>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                { s: 'provisioning', d: 'Sandbox is being allocated. Not yet ready for commands.' },
                { s: 'running', d: 'Sandbox is live and billing. Commands can be sent.' },
                { s: 'paused', d: 'Billing stopped. Execution frozen. Resume to continue.' },
                { s: 'terminated', d: 'Sandbox destroyed. No further commands possible.' },
                { s: 'error', d: 'Provisioning or runtime failure. Check logs.' },
              ].map(({ s, d }) => (
                <tr key={s}>
                  <td style={tdStyle}><span style={mono}>{s}</span></td>
                  <td style={tdStyle}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={h3Style}>Sandbox ownership</h3>
          <p style={bodyText}>
            Credits/API-key callers must match <span style={mono}>sandbox.UserID</span>.
            Lightning/L402 callers must match <span style={mono}>sandbox.AgentID</span>.
            Mismatches yield <span style={mono}>403 forbidden</span>.
          </p>

          <h3 style={h3Style}>Error format</h3>
          <CodeBlock
            code={`// REST errors (most handlers)
{ "code": "not_found", "error": "sandbox not found", "message": "..." }

// MCP tool errors (always HTTP 200, error in JSON-RPC envelope)
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32000,
    "message": "sandbox terminated",
    "data": { "error_slug": "sandbox_terminated" }
  }
}`}
          />
        </div>

        {/* Billing */}
        <div style={active === 'billing' ? activeSectionStyle : sectionStyle}>
          <SectionHeading label="Billing & Tiers" number="04" />
          <p style={bodyText}>
            Sandboxes are billed per second from the moment they reach <span style={mono}>running</span> state.
            Pause to stop the clock. Billing resumes on resume.
            Terminate to end billing permanently.
          </p>

          <h3 style={h3Style}>Tiers</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px', marginBottom: '28px' }}>
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  border: '1px solid var(--bg-border)',
                  borderRadius: '6px',
                  backgroundColor: 'var(--bg-surface)',
                }}
              >
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-primary)', minWidth: '100px' }}>
                    {tier.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {tier.specs}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--accent-btc)' }}>
                    {tier.sats} sats/sec
                  </span>
                </div>
              </div>
            ))}
          </div>

          <h3 style={h3Style}>Billing methods</h3>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Method</th>
                <th style={thStyle}>Token</th>
                <th style={thStyle}>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tdStyle}>Credits</td>
                <td style={tdStyle}><span style={mono}>billingMethod: 'credits'</span></td>
                <td style={tdStyle}>Pre-funded USD credit balance. Requires API key.</td>
              </tr>
              <tr>
                <td style={tdStyle}>Lightning (L402)</td>
                <td style={tdStyle}><span style={mono}>billingMethod: 'lightning'</span></td>
                <td style={tdStyle}>Pay-per-second in sats. Agent pays its own invoice. Any Lightning wallet works.</td>
              </tr>
            </tbody>
          </table>

          <h3 style={h3Style}>Pricing endpoint</h3>
          <p style={bodyText}>
            Live tier pricing is available publicly at <span style={mono}>GET /v1/pricing</span> — returns an array of{' '}
            <span style={mono}>{'{ Tier, MsatsPerSecond, USDCentsPerSecondX100 }'}</span> rows.
          </p>
          <CodeBlock
            code={`GET https://api.sockt.dev/v1/pricing

// Response
[
  { "Tier": "nano",     "MsatsPerSecond": 500,   "USDCentsPerSecondX100": 0 },
  { "Tier": "micro",    "MsatsPerSecond": 2000,  "USDCentsPerSecondX100": 0 },
  { "Tier": "standard", "MsatsPerSecond": 4000,  "USDCentsPerSecondX100": 0 },
  { "Tier": "rtx5090",  "MsatsPerSecond": 8000,  "USDCentsPerSecondX100": 0 },
  { "Tier": "a100",     "MsatsPerSecond": 15000, "USDCentsPerSecondX100": 0 }
]`}
          />
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ label, number }: { label: string; number: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginBottom: '36px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '56px', color: 'var(--bg-border)', lineHeight: 1 }}>
        {number}
      </span>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 0.95,
          margin: 0,
        }}
      >
        {label}
      </h1>
    </div>
  );
}

const bodyText: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '15px',
  color: 'var(--text-secondary)',
  lineHeight: 1.8,
  marginBottom: '18px',
};

const h3Style: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  letterSpacing: '0.04em',
  marginTop: '36px',
  marginBottom: '0',
};

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '13px',
  color: 'var(--text-mono)',
  backgroundColor: 'var(--bg-raised)',
  padding: '1px 5px',
  borderRadius: '3px',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '14px',
  marginBottom: '28px',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 14px',
  borderBottom: '1px solid var(--bg-border)',
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  color: 'var(--text-secondary)',
  letterSpacing: '0.08em',
  fontWeight: 400,
};

const tdStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderBottom: '1px solid var(--bg-border)',
  color: 'var(--text-secondary)',
  lineHeight: 1.5,
  verticalAlign: 'top',
};
