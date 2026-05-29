'use client';

import { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/nav/Nav';

type Section = 'overview' | 'cli' | 'api' | 'ts-sdk' | 'py-sdk' | 'mcp';

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'cli', label: 'CLI Reference' },
  { id: 'api', label: 'REST API Reference' },
  { id: 'ts-sdk', label: 'TypeScript SDK' },
  { id: 'py-sdk', label: 'Python SDK' },
  { id: 'mcp', label: 'MCP Server' },
];

const CODE = {
  cursorMcp: `{
  "mcpServers": {
    "sockt": {
      "url": "https://api.sockt.dev/v1/mcp"
    }
  }
}`,
  vscodeMcp: `{
  "github.copilot.chat.mcpServers": {
    "sockt": {
      "url": "https://api.sockt.dev/v1/mcp"
    }
  }
}`,
  claudeCodeMcp: `claude mcp add --transport http sockt https://api.sockt.dev/v1/mcp`,
  walletMcp: `{
  "mcpServers": {
    "lnbot": {
      "type": "url",
      "url": "https://api.ln.bot/v1/wallets/wal_.../mcp",
      "headers": {
        "Authorization": "Bearer uk_..."
      }
    }
  }
}`,
  sdkTs: `import { ComputeClient } from '@sockt/client';

// Initialise the client (reads SOCKT_API_KEY from environment automatically if omitted)
const client = new ComputeClient({ apiKey: process.env.SOCKT_API_KEY });

// Create a secure compute sandbox environment
const sandbox = await client.createSandbox({
  tier: 'micro',
  billingMethod: 'credits', // or 'lightning'
});

// Wait until the container orchestration completes and reaches a running state
await sandbox.waitUntilRunning();

// Execute a shell command and wait for output
const result = await sandbox.execSync('python eval.py --dataset cifar10');
console.log(result.stdout);

// Permanently destroy the sandbox when complete to stop active billing
await sandbox.terminate();`,

  sdkPy: `from sockt import ComputeClient
import os

# Initialise client (reads SOCKT_API_KEY from environment automatically if omitted)
client = ComputeClient(api_key=os.environ.get("SOCKT_API_KEY"))

# Create a secure compute sandbox environment using context manager
with client.create_sandbox(tier="micro", billing_method="credits") as sandbox:
    # Wait until orchestration completes and reaches a running state
    sandbox.wait_until_running()

    # Write a script file into the sandbox
    sandbox.write_file("eval.py", "print('orchestration complete')", create_dirs=True)

    # Execute and stream stdout/stderr automatically
    result = sandbox.exec_sync("python eval.py")
    print(result.stdout)
    # terminate() called automatically upon exiting the context block`,
  
  cliSetup: `# Set your API Key (Credits billing)
export SOCKT_API_KEY="sockt_live_your_key_here"

# Provision standard tier sandbox and wait for it to reach running state
sockt sandbox create --tier standard --wait

# Execute commands (Flags like --timeout and --workdir must precede the sandbox ID!)
sockt exec --timeout 60000 --workdir /home/sandbox <sandbox-id> python3 eval.py

# Terminate the sandbox to halt all billing
sockt sandbox terminate <sandbox-id>`,

  restWorkflowCredits: `# 1. Create sandbox (wait until Status is 'running' — takes 30-90s)
CREATE=$(curl -sS -X POST "https://api.sockt.dev/v1/sandboxes" \\
  -H "Authorization: Bearer sockt_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"billing_method":"credits","tier":"micro"}')
SID=$(echo "$CREATE" | jq -r '.ID')

# 2. Write executable file to sandbox filesystem
curl -sS -X POST "https://api.sockt.dev/v1/sandboxes/$SID/files/write" \\
  -H "Authorization: Bearer sockt_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"path":"main.py","content":"print(\\"hello world\\")\\n","encoding":"utf8","create_dirs":true}'

# 3. Start asynchronous execution (returns immediately with execution_id)
EXEC=$(curl -sS -X POST "https://api.sockt.dev/v1/sandboxes/$SID/exec" \\
  -H "Authorization: Bearer sockt_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"command":"python3 main.py","timeout_ms":30000}')
EID=$(echo "$EXEC" | jq -r '.execution_id')

# 4. Poll execution result until status is completed
until [ "$(curl -sS "https://api.sockt.dev/v1/executions/$EID" -H "Authorization: Bearer sockt_live_YOUR_KEY" | jq -r '.status')" != "running" ]; do sleep 1; done
curl -sS "https://api.sockt.dev/v1/executions/$EID" -H "Authorization: Bearer sockt_live_YOUR_KEY" | jq .

# 5. Terminate the sandbox when done
curl -sS -X DELETE "https://api.sockt.dev/v1/sandboxes/$SID" -H "Authorization: Bearer sockt_live_YOUR_KEY"`,

  restWorkflowLightning: `# 1. Provision anonymous sandbox
CREATE=$(curl -sS -X POST "https://api.sockt.dev/v1/sandboxes" \\
  -H "Content-Type: application/json" \\
  -d '{"billing_method":"lightning","tier":"micro"}')
SID=$(echo "$CREATE" | jq -r '.sandbox_id')
TOK=$(echo "$CREATE" | jq -r '.sandbox_token')
INVOICE=$(echo "$CREATE" | jq -r '.invoice')

# Pay the BOLT11 INVOICE from any wallet, then poll status until running
until [ "$(curl -sS "https://api.sockt.dev/v1/sandboxes/$SID?sandbox_token=$TOK" | jq -r '.status')" = "running" ]; do sleep 5; done

# 2. Write file, exec command, poll executions (Same as credits, passing sandbox_token)
# 3. Terminate when finished (optionally passing lightning_address in body for refund)
curl -sS -X DELETE "https://api.sockt.dev/v1/sandboxes/$SID?sandbox_token=$TOK"`,
};

const MCP_TOOLS = [
  { name: 'sandbox_create', desc: 'Provision a new sandbox on the specified tier. Returns sandbox ID, token and proxy URL.' },
  { name: 'sandbox_exec', desc: 'Run a shell command inside a sandbox asynchronously. Returns execution ID.' },
  { name: 'sandbox_exec_result', desc: 'Get buffered stdout, stderr and lifecycle state of a running execution.' },
  { name: 'sandbox_exec_cancel', desc: 'Cancel a running shell command.' },
  { name: 'sandbox_write_file', desc: 'Write a file into the sandbox filesystem at a given path.' },
  { name: 'sandbox_read_file', desc: 'Read the contents of a file from the sandbox filesystem.' },
  { name: 'sandbox_list_files', desc: 'List files and directories at a path inside the sandbox.' },
  { name: 'sandbox_status', desc: 'Get current sandbox state: running, paused, terminated, warning levels.' },
  { name: 'sandbox_pause', desc: 'Pause billing and execution for an idle sandbox.' },
  { name: 'sandbox_resume', desc: 'Resume a paused sandbox.' },
  { name: 'sandbox_terminate', desc: 'Destroy the sandbox, free orchestrator capacity, and stop billing.' },
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
          zIndex: 10,
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
        color: 'var(--text-primary)',
      }}
    >
      <Nav />
      
      {/* 2-Column Responsive Layout */}
      <div
        className="flex flex-col lg:flex-row w-full max-w-[1440px] mx-auto pt-[67px]"
        style={{ minHeight: 'calc(100vh - 67px)' }}
      >
        {/* Sleek Vertical Left Sidebar Navigation */}
        <aside
          className="w-full lg:w-[260px] shrink-0 border-b lg:border-b-0 lg:border-r border-[var(--bg-border)] overflow-y-auto px-6 py-6 lg:px-8 lg:py-10"
          style={{
            position: 'sticky',
            top: '67px',
            maxHeight: 'calc(100vh - 67px)',
            zIndex: 40,
            backgroundColor: 'var(--bg-void)',
          }}
        >
          <div className="font-mono text-[10px] tracking-[0.1em] text-[var(--text-secondary)] uppercase mb-6 px-3">
            DOCUMENTATION
          </div>
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActive(item.id);
                  if (window.innerWidth < 1024) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className="w-full text-left font-mono text-[13px] tracking-[0.06em] px-4 py-3 rounded-lg border-0 cursor-pointer transition-all duration-150"
                style={{
                  backgroundColor: active === item.id ? 'rgba(194, 122, 54, 0.15)' : 'transparent',
                  color: active === item.id ? 'var(--accent-btc)' : 'var(--text-secondary)',
                }}
                onMouseEnter={(e) => {
                  if (active !== item.id) {
                    e.currentTarget.style.color = 'var(--accent-btc)';
                    e.currentTarget.style.backgroundColor = 'rgba(194, 122, 54, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (active !== item.id) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 w-full max-w-full lg:max-w-[1180px] px-6 py-8 lg:px-12 lg:py-12 overflow-x-hidden">
          
          {/* OVERVIEW SECTION */}
          <div style={active === 'overview' ? activeSectionStyle : sectionStyle}>
            <SectionHeading label="Overview" number="00" />
            <p style={bodyText}>
              sockt.dev is a secure, sandboxed compute-on-demand platform built specifically for autonomous AI agents.
              Agents can provision isolated sandboxes, execute command suites, read and write files, pay per second in sats via Bitcoin Lightning or using pre-loaded account credits, and terminate their own environments with zero human intervention.
            </p>
            <p style={bodyText}>
              We offer two integration routes: the <span style={mono}>MCP Server</span> (Model Context Protocol) at <span style={mono}>https://api.sockt.dev/v1/mcp</span> (for LLM agents using built-in tool use), or the programmatic SDK clients and REST API (for traditional script-driven logic).
            </p>

            <h3 style={h3Style}>Video Walkthrough</h3>
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%', /* 16:9 aspect ratio */
              height: 0,
              overflow: 'hidden',
              borderRadius: '8px',
              border: '1px solid var(--bg-border)',
              marginTop: '14px',
              marginBottom: '28px',
              boxShadow: '0 0 20px rgba(247, 147, 26, 0.1)'
            }}>
              <iframe
                src="https://www.youtube.com/embed/_I2zN5MxLHY"
                title="Sockt Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>

            <h3 style={h3Style}>Base URL</h3>
            <CodeBlock code="https://api.sockt.dev" />

            <h3 style={h3Style}>Authentication</h3>
            <p style={bodyText}>
              sockt.dev supports two billing systems depending on your API credential context:
            </p>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Billing Model</th>
                  <th style={thStyle}>Credential Header</th>
                  <th style={thStyle}>Autonomous Behavior</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><strong style={{ color: 'var(--accent-btc)' }}>Credits Billing</strong></td>
                  <td style={tdStyle}><span style={mono}>Authorization: Bearer sockt_live_...</span></td>
                  <td style={tdStyle}>Usage is debited automatically from your account's USD credit balance.</td>
                </tr>
                <tr>
                  <td style={tdStyle}><strong style={{ color: 'var(--accent-btc)' }}>Lightning Billing</strong></td>
                  <td style={tdStyle}><span style={mono}>Authorization: Bearer sbx_...</span></td>
                  <td style={tdStyle}>Anonymous pay-as-you-go. Create the sandbox anonymously, pay the BOLT11 invoice, and manage it with the returned token. Connect any external Lightning wallet as an MCP tool and allow the agent to pay its own way.</td>
                </tr>
              </tbody>
            </table>

            <h3 style={h3Style}>Rate Limits</h3>
            <p style={bodyText}>
              Default rate limit is **300 requests per minute** per credentials principal. Excess API transactions will receive a HTTP <span style={mono}>429 rate limited</span> plain-text envelope.
            </p>
          </div>

          {/* CLI REFERENCE SECTION */}
          <div style={active === 'cli' ? activeSectionStyle : sectionStyle}>
            <SectionHeading label="CLI Reference" number="01" />
            <p style={bodyText}>
              The <span style={mono}>sockt</span> Go binary is a fast, cross-platform CLI for orchestrating compute sandboxes directly from the console or scripts.
            </p>

            <h3 style={h3Style}>Installation</h3>
            <p style={bodyText}>Build directly from source or compile release binaries:</p>
            <CodeBlock code={`# Build the binary locally\ngo build -o sockt .\n\n# Or build cross-platform release archives\nmake release VERSION=0.2.0\n\n# Move to path\nmv sockt /usr/local/bin/`} />

            <h3 style={h3Style}>Quick Start</h3>
            <CodeBlock code={CODE.cliSetup} />

            <h3 style={h3Style}>Global Configuration</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Env Variable</th>
                  <th style={thStyle}>Global Flag</th>
                  <th style={thStyle}>Priority / Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><span style={mono}>SOCKT_API_KEY</span></td>
                  <td style={tdStyle}>—</td>
                  <td style={tdStyle}>API key for Credits-based sandboxes (e.g. <span style={mono}>sockt_live_...</span>)</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>SOCKT_SANDBOX_TOKEN</span></td>
                  <td style={tdStyle}>—</td>
                  <td style={tdStyle}>Active Lightning billing sandbox token (<span style={mono}>sbx_...</span>)</td>
                </tr>
                <tr>
                  <td style={tdStyle}>—</td>
                  <td style={tdStyle}><span style={mono}>--token &lt;token&gt;</span></td>
                  <td style={tdStyle}>Overrides any active environment variables. Takes absolute highest precedence.</td>
                </tr>
              </tbody>
            </table>

            <h3 style={h3Style}>Commands</h3>

            <div className="space-y-6 mt-4">
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt tiers</div>
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  List active hardware specifications, credit costs, and Lightning sats burn rates per second.
                </div>
                <CodeBlock code={`sockt tiers`} />
              </div>

              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt sandbox create</div>
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  Provision a new secure sandbox. When using Lightning billing, it creates the sandbox anonymously and returns a BOLT11 payment request.
                </div>
                <table style={tableStyle} className="my-2">
                  <thead>
                    <tr>
                      <th style={thStyle}>Flag</th>
                      <th style={thStyle}>Default</th>
                      <th style={thStyle}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}><span style={mono}>-t, --tier</span></td>
                      <td style={tdStyle}><span style={mono}>nano</span></td>
                      <td style={tdStyle}>Hardware tier: <span style={mono}>nano</span>, <span style={mono}>micro</span>, <span style={mono}>standard</span>, <span style={mono}>gpu-small</span> etc.</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><span style={mono}>-b, --billing</span></td>
                      <td style={tdStyle}><span style={mono}>credits</span></td>
                      <td style={tdStyle}>Payment system: <span style={mono}>credits</span> or <span style={mono}>lightning</span></td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--prepaid-sats</span></td>
                      <td style={tdStyle}>0</td>
                      <td style={tdStyle}>Prepaid satoshis (Lightning only)</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><span style={mono}>-w, --wait</span></td>
                      <td style={tdStyle}>false</td>
                      <td style={tdStyle}>Block and poll until the sandbox reaches "running" state</td>
                    </tr>
                  </tbody>
                </table>
                <CodeBlock code={`sockt sandbox create --tier micro --billing credits --wait`} />
              </div>

              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt exec</div>
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  Execute a command inside the sandbox and stream outputs as they are generated.
                </div>
                <div className="p-3 bg-[rgba(194,122,54,0.1)] border border-[rgba(194,122,54,0.3)] text-xs text-[var(--accent-btc)] font-mono rounded mb-3">
                  ⚠️ CRITICAL FLAG ORDER: Cobra command parsing rules mandate that execution flags (such as --timeout or --workdir) MUST be placed BEFORE the sandbox ID.
                </div>
                <CodeBlock code={`# CORRECT syntax (flags first)\nsockt exec --timeout 60000 --workdir /home/sandbox <sandbox-id> python3 eval.py\n\n# INCORRECT syntax (will fail command parsing)\nsockt exec <sandbox-id> python3 eval.py --timeout 60000`} />
              </div>

              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt sandbox pause / resume / terminate</div>
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  Manage sandbox state. Pausing stops active compute charges. Terminating destroys the container permanently.
                </div>
                <CodeBlock code={`sockt sandbox pause <sandbox-id>\nsockt sandbox resume <sandbox-id>\nsockt sandbox terminate <sandbox-id>`} />
              </div>
            </div>
          </div>

          {/* REST API REFERENCE */}
          <div style={active === 'api' ? activeSectionStyle : sectionStyle}>
            <SectionHeading label="REST API Reference" number="02" />
            <p style={bodyText}>
              For raw HTTP client integrations, sockt.dev exposes a powerful high-performance REST API. All endpoints process JSON request bodies and return structured JSON responses.
            </p>

            <h3 style={h3Style}>12 Sandbox REST Endpoints</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Method</th>
                  <th style={thStyle}>REST Route</th>
                  <th style={thStyle}>MCP Equivalent</th>
                  <th style={thStyle}>Authentication Required</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { method: 'GET', path: '/v1/sandboxes/tiers', tool: 'sandbox_list_tiers', auth: 'No (Public)' },
                  { method: 'POST', path: '/v1/sandboxes', tool: 'sandbox_create', auth: 'Only for credits billing' },
                  { method: 'GET', path: '/v1/sandboxes/{id}', tool: 'sandbox_status', auth: 'Yes (API key / Token)' },
                  { method: 'POST', path: '/v1/sandboxes/{id}/exec', tool: 'sandbox_exec', auth: 'Yes (API key / Token)' },
                  { method: 'GET', path: '/v1/executions/{execution_id}', tool: 'sandbox_exec_result', auth: 'Yes (Same execution key)' },
                  { method: 'DELETE', path: '/v1/executions/{execution_id}', tool: 'sandbox_exec_cancel', auth: 'Yes (Same execution key)' },
                  { method: 'POST', path: '/v1/sandboxes/{id}/files/write', tool: 'sandbox_write_file', auth: 'Yes (API key / Token)' },
                  { method: 'POST', path: '/v1/sandboxes/{id}/files/read', tool: 'sandbox_read_file', auth: 'Yes (API key / Token)' },
                  { method: 'GET', path: '/v1/sandboxes/{id}/files', tool: 'sandbox_list_files', auth: 'Yes (API key / Token)' },
                  { method: 'POST', path: '/v1/sandboxes/{id}/pause', tool: 'sandbox_pause', auth: 'Yes (API key / Token)' },
                  { method: 'POST', path: '/v1/sandboxes/{id}/resume', tool: 'sandbox_resume', auth: 'Yes (API key / Token)' },
                  { method: 'DELETE', path: '/v1/sandboxes/{id}', tool: 'sandbox_terminate', auth: 'Yes (API key / Token)' }
                ].map((route, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        backgroundColor: route.method === 'GET' ? 'rgba(194, 122, 54, 0.15)' : route.method === 'DELETE' ? 'rgba(229, 62, 62, 0.15)' : 'rgba(34, 208, 122, 0.15)',
                        color: route.method === 'GET' ? 'var(--accent-btc)' : route.method === 'DELETE' ? 'var(--accent-red)' : 'var(--accent-green)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontWeight: 600
                      }}>{route.method}</span>
                    </td>
                    <td style={tdStyle}><span style={mono}>{route.path}</span></td>
                    <td style={tdStyle}><span style={mono}>{route.tool}</span></td>
                    <td style={tdStyle}>{route.auth}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={h3Style}>Path Construction & Logical Scopes</h3>
            <p style={bodyText}>
              The default sandbox home directory is <span style={mono}>/home/sandbox</span>. For files write/read, the <span style={mono}>path</span> argument maps logically under this folder. Traversing above the home path using <span style={mono}>..</span> is prohibited and returns a <span style={mono}>400 bad_request</span> error.
            </p>

            <h3 style={h3Style}>Asynchronous Command Model</h3>
            <p style={bodyText}>
              Command execution inside sandboxes is strictly non-blocking:
            </p>
            <ol style={{ listStyleType: 'decimal', paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.8 }} className="space-y-2 mb-4">
              <li>Submit command to <span style={mono}>POST /v1/sandboxes/{"{id}"}/exec</span>. This returns immediately with an <span style={mono}>execution_id</span> and status <span style={mono}>running</span>.</li>
              <li>Poll <span style={mono}>GET /v1/executions/{"{execution_id}"}</span> periodically.</li>
              <li>Each poll returns **only** the new stdout/stderr chunks buffered since the previous client poll.</li>
              <li>When the status moves to <span style={mono}>completed</span>, <span style={mono}>failed</span>, or <span style={mono}>cancelled</span>, polling concludes and the final terminal exit code is returned.</li>
            </ol>

            <h3 style={h3Style}>Detailed Workflow Scripts</h3>
            <h4 style={{ ...h3Style, fontSize: '0.9rem' }}>Credits Billing Pathway Example</h4>
            <CodeBlock code={CODE.restWorkflowCredits} />
            <h4 style={{ ...h3Style, fontSize: '0.9rem' }}>Lightning Sats Billing Pathway Example</h4>
            <CodeBlock code={CODE.restWorkflowLightning} />

            <h3 style={h3Style}>Detailed Endpoint Specifications</h3>
            <p style={bodyText}>Complete schema payload mappings, query arguments, path parameters, and request/response payloads for all 12 Rest API routes.</p>

            <div className="space-y-8 mt-6">
              {/* Endpoint 1 */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-[rgba(194,122,54,0.15)] text-[var(--accent-btc)] px-2.5 py-1 rounded font-semibold">GET</span>
                  <span className="font-mono text-sm font-semibold">/v1/sandboxes/tiers</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">List all sandbox hardware sizes, credit billing rates (cents/sec), Lightning billing rates (msats/sec), and cost estimates.</p>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (200 OK)</div>
                <CodeBlock code={`{
  "note": "usd_cents_per_second applies to credits billing; msats_per_second to lightning billing.",
  "tiers": [
    {
      "tier": "nano",
      "msats_per_second": 500,
      "sats_per_second": 0.5,
      "usd_cents_per_second": 0.000277,
      "cost_per_minute_sats": 30,
      "cost_per_hour_sats": 1800,
      "cost_per_day_sats": 43200,
      "cost_per_hour_usd": 0.01
    },
    {
      "tier": "micro",
      "msats_per_second": 1000,
      "sats_per_second": 1.0,
      "usd_cents_per_second": 0.000555,
      "cost_per_minute_sats": 60,
      "cost_per_hour_sats": 3600,
      "cost_per_day_sats": 86400,
      "cost_per_hour_usd": 0.02
    }
  ]
}`} />
              </div>

              {/* Endpoint 2 */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-[rgba(34,208,122,0.15)] text-[var(--accent-green)] px-2.5 py-1 rounded font-semibold">POST</span>
                  <span className="font-mono text-sm font-semibold">/v1/sandboxes</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Provision a new secure compute sandbox environment. Requires API Key bearer for credits billing, or runs anonymously for Lightning billing.</p>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Request Body (JSON)</div>
                <CodeBlock code={`{
  "tier": "nano",
  "billing_method": "lightning", // 'credits' or 'lightning'
  "label": "my-agent-task",      // optional label
  "prepaid_sats": 5000           // optional satoshis prepay (lightning only)
}`} />
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (201 Created — Lightning)</div>
                <CodeBlock code={`{
  "status": "awaiting_payment",
  "sandbox_id": "sb_9f8a3d2e1c0b",
  "sandbox_token": "sbx_a1b2c3d4e5f6g7h8",
  "billing_method": "lightning",
  "tier": "nano",
  "runtime": "cpu",
  "invoice": "lnbc50u1p1z...",
  "payment_hash": "a1b2c3d4e5f6...",
  "amount_msats": 5000000,
  "amount_sats": 5000,
  "msats_per_second": 500,
  "prepaid_seconds": 10000,
  "expires_at": "2026-05-29T16:00:00Z"
}`} />
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (201 Created — Credits)</div>
                <CodeBlock code={`{
  "ID": "sb_9f8a3d2e1c0b",
  "Status": "pending",
  "BillingMethod": "credits",
  "Tier": "nano",
  "Template": "sockt-nano",
  "Runtime": "runpod_cpu",
  "PrepaidBalanceSubcents": 1000000,
  "UserID": "usr_abc123"
}`} />
              </div>

              {/* Endpoint 3 */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-[rgba(194,122,54,0.15)] text-[var(--accent-btc)] px-2.5 py-1 rounded font-semibold">GET</span>
                  <span className="font-mono text-sm font-semibold">/v1/sandboxes/{"{id}"}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Retrieve current sandbox metadata, status state, metric logs, warning levels, and Lightning top-up invoice states.</p>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Query Parameters</div>
                <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] mb-3 space-y-1">
                  <li><span style={mono}>sandbox_token</span> (string) — Required for Lightning billing if not passed as Bearer authorization header.</li>
                </ul>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (200 OK)</div>
                <CodeBlock code={`{
  "sandbox_id": "sb_9f8a3d2e1c0b",
  "status": "running",
  "tier": "nano",
  "billing_method": "lightning",
  "prepaid_balance_msats": 4500000,
  "seconds_remaining": 9000,
  "warning_level": "ok",
  "next_poll_secs": 15,
  "metrics_stale": false,
  "runtime_consumed_total": 500000
}`} />
              </div>

              {/* Endpoint 4 */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-[rgba(34,208,122,0.15)] text-[var(--accent-green)] px-2.5 py-1 rounded font-semibold">POST</span>
                  <span className="font-mono text-sm font-semibold">/v1/sandboxes/{"{id}"}/exec</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Start asynchronous execution of a command. Returns an opaque ID immediately. Buffers outputs to the executions worker.</p>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Request Body (JSON)</div>
                <CodeBlock code={`{
  "command": "python3 eval.py",
  "working_dir": ".",      // default: . (home)
  "timeout_ms": 60000,     // default: 30000
  "sandbox_token": ""      // alternative token auth
}`} />
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (200 OK)</div>
                <CodeBlock code={`{
  "execution_id": "exec_abc123f4g5",
  "status": "running",
  "sandbox_id": "sb_9f8a3d2e1c0b",
  "command": "python3 eval.py",
  "next_step": "Poll the execution result endpoint using the execution_id"
}`} />
              </div>

              {/* Endpoint 5 */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-[rgba(194,122,54,0.15)] text-[var(--accent-btc)] px-2.5 py-1 rounded font-semibold">GET</span>
                  <span className="font-mono text-sm font-semibold">/v1/executions/{"{execution_id}"}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Poll current stdout/stderr chunks and execution state. Each request consumes and deletes the read buffer, returning only **new** lines since your last poll.</p>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Query Parameters</div>
                <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] mb-3 space-y-1">
                  <li><span style={mono}>sandbox_token</span> (string) — Required for Lightning billing token auth.</li>
                </ul>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (200 OK)</div>
                <CodeBlock code={`{
  "execution_id": "exec_abc123f4g5",
  "status": "completed", // 'running', 'completed', 'failed', 'cancelled'
  "output": [
    {
      "stream": "stdout",
      "chunk": "Accuracy: 94.2%\\n"
    },
    {
      "stream": "stdout",
      "chunk": "Finished evaluation.\\n"
    }
  ],
  "exit_code": 0
}`} />
              </div>

              {/* Endpoint 6 */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-[rgba(229,62,62,0.15)] text-[var(--accent-red)] px-2.5 py-1 rounded font-semibold">DELETE</span>
                  <span className="font-mono text-sm font-semibold">/v1/executions/{"{execution_id}"}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Request cancellation of an active, running shell execution. Terminates the underlying process group on the container.</p>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (200 OK)</div>
                <CodeBlock code={`{
  "execution_id": "exec_abc123f4g5",
  "status": "cancelled"
}`} />
              </div>

              {/* Endpoint 7 */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-[rgba(34,208,122,0.15)] text-[var(--accent-green)] px-2.5 py-1 rounded font-semibold">POST</span>
                  <span className="font-mono text-sm font-semibold">/v1/sandboxes/{"{id}"}/files/write</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Create a new file or completely overwrite an existing file inside the sandboxed container filesystem.</p>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Request Body (JSON)</div>
                <CodeBlock code={`{
  "path": "eval.py",
  "content": "print('hello')",   // plain string or base64 encoded
  "encoding": "utf8",         // 'utf8' or 'base64'
  "create_dirs": true        // automatically create parent directories
}`} />
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (200 OK)</div>
                <CodeBlock code={`{
  "path": "/home/sandbox/eval.py",
  "bytes_written": 14,
  "created_dirs": false
}`} />
              </div>

              {/* Endpoint 8 */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-[rgba(34,208,122,0.15)] text-[var(--accent-green)] px-2.5 py-1 rounded font-semibold">POST</span>
                  <span className="font-mono text-sm font-semibold">/v1/sandboxes/{"{id}"}/files/read</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Read file contents from the sandbox filesystem. Returns raw text or base64 representation.</p>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Request Body (JSON)</div>
                <CodeBlock code={`{
  "path": "eval.py",
  "encoding": "utf8",         // 'utf8' or 'base64'
  "max_bytes": 100000         // optional byte ceiling
}`} />
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (200 OK — UTF-8)</div>
                <CodeBlock code={`{
  "path": "/home/sandbox/eval.py",
  "size_bytes": 14,
  "encoding": "utf8",
  "truncated": false,
  "content": "print('hello')"
}`} />
              </div>

              {/* Endpoint 9 */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-[rgba(194,122,54,0.15)] text-[var(--accent-btc)] px-2.5 py-1 rounded font-semibold">GET</span>
                  <span className="font-mono text-sm font-semibold">/v1/sandboxes/{"{id}"}/files</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">List files and directories in a given sandbox directory path (single level).</p>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Query Parameters</div>
                <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] mb-3 space-y-1">
                  <li><span style={mono}>path</span> (string) — Logical directory path. Default `/`.</li>
                  <li><span style={mono}>sandbox_token</span> (string) — Required for Lightning anonymous auth.</li>
                </ul>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (200 OK)</div>
                <CodeBlock code={`{
  "entries": [
    {
      "name": "eval.py",
      "size": 14,
      "mod_ts": 1716982800,
      "is_dir": false,
      "is_file": true
    },
    {
      "name": "src",
      "size": 4096,
      "mod_ts": 1716982950,
      "is_dir": true,
      "is_file": false
    }
  ],
  "total_entries": 2
}`} />
              </div>

              {/* Endpoint 10 */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-[rgba(34,208,122,0.15)] text-[var(--accent-green)] px-2.5 py-1 rounded font-semibold">POST</span>
                  <span className="font-mono text-sm font-semibold">/v1/sandboxes/{"{id}"}/pause</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Pause execution on the cloud orchestrator. Halts ongoing active billing charges.</p>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (200 OK)</div>
                <CodeBlock code={`{
  "sandbox_id": "sb_9f8a3d2e1c0b",
  "status": "paused"
}`} />
              </div>

              {/* Endpoint 11 */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-[rgba(34,208,122,0.15)] text-[var(--accent-green)] px-2.5 py-1 rounded font-semibold">POST</span>
                  <span className="font-mono text-sm font-semibold">/v1/sandboxes/{"{id}"}/resume</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Resume a paused sandbox environment. Restarts container processes and reactivates pricing billing meters.</p>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (200 OK)</div>
                <CodeBlock code={`{
  "sandbox_id": "sb_9f8a3d2e1c0b",
  "status": "running"
}`} />
              </div>

              {/* Endpoint 12 */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs bg-[rgba(229,62,62,0.15)] text-[var(--accent-red)] px-2.5 py-1 rounded font-semibold">DELETE</span>
                  <span className="font-mono text-sm font-semibold">/v1/sandboxes/{"{id}"}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mb-4">Permanently terminate the sandbox environment. Deletes container assets. For Lightning billing, returns remaining balance refund details if a refund address is provided.</p>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Request Body (JSON — Optional)</div>
                <CodeBlock code={`{
  "lightning_address": "agent-sats@wallet.example", // Lightning refund address (Lightning billing only)
  "sandbox_token": ""                               // Alternative token auth
}`} />
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (200 OK — Lightning with refund)</div>
                <CodeBlock code={`{
  "sandbox_id": "sb_9f8a3d2e1c0b",
  "status": "terminated",
  "consumed_msats_total": 1250000,
  "terminated_at": "2026-05-29T10:15:30Z",
  "refund": {
    "status": "sent",
    "amount_sats": 3750,
    "address": "agent-sats@wallet.example"
  }
}`} />
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Response Example (200 OK — Credits with refund)</div>
                <CodeBlock code={`{
  "sandbox_id": "sb_9f8a3d2e1c0b",
  "status": "terminated",
  "consumed_msats_total": 0,
  "terminated_at": "2026-05-29T10:15:30Z",
  "refund": {
    "status": "credited",
    "amount_cents": 85
  }
}`} />
              </div>
            </div>

            <h3 style={h3Style}>Error Envelope Schema</h3>
            <CodeBlock code={`{
  "code": "forbidden",
  "error": "forbidden",
  "message": "execution belongs to another caller",
  "hint": "Ensure your request Authorization header matches the credential used to start this execution"
}`} />

            <h3 style={h3Style}>Common REST Error Codes</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Error Code</th>
                  <th style={thStyle}>HTTP Status</th>
                  <th style={thStyle}>Meaning</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { c: 'invalid_params', h: '400 Bad Request', m: 'Missing, misformatted, or invalid parameter values' },
                  { c: 'unauthorized', h: '401 Unauthorized', m: 'Missing or bad API Key or sandbox token' },
                  { c: 'forbidden', h: '403 Forbidden', m: 'Ownership mismatch or invalid security scope' },
                  { c: 'not_found', h: '404 Not Found', m: 'Unknown sandbox ID or expired execution session' },
                  { c: 'insufficient_credits', h: '402 Payment Required', m: 'Credits balance depleted' },
                  { c: 'too_many_executions', h: '429 Too Many Requests', m: 'Maximum concurrent execution ceiling (10) reached' },
                  { c: 'pod_unreachable', h: '400 Bad Request', m: 'Sandbox is booting and has no active communication plane yet' }
                ].map((err, i) => (
                  <tr key={i}>
                    <td style={tdStyle}><span style={mono}>{err.c}</span></td>
                    <td style={tdStyle}><strong>{err.h}</strong></td>
                    <td style={tdStyle}>{err.m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TS/JS SDK SECTION */}
          <div style={active === 'ts-sdk' ? activeSectionStyle : sectionStyle}>
            <SectionHeading label="TypeScript/JavaScript SDK" number="03" />
            <p style={bodyText}>
              The official <span style={mono}>@sockt/client</span> package provides a robust, fully-typed TypeScript interface for interacting with sockt.dev. It manages network state, handles execution polling under the hood, and parses error envelopes.
            </p>

            <h3 style={h3Style}>Installation</h3>
            <CodeBlock code={`npm install @sockt/client`} />

            <h3 style={h3Style}>Quick Start</h3>
            <CodeBlock code={CODE.sdkTs} />

            <h3 style={h3Style}>API Reference</h3>

            <div className="space-y-6 mt-4">
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">ComputeClient</div>
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  Initializes the core API link client. Options accept:
                </div>
                <CodeBlock code={`interface ComputeClientOptions {\n  apiKey?: string;        // fallback to SOCKT_API_KEY env\n  sandboxToken?: string;  // fallback to SOCKT_SANDBOX_TOKEN env\n  baseUrl?: string;       // default: https://api.sockt.dev\n  timeoutMs?: number;     // default: 120000\n}`} />
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed my-2">Client Methods:</div>
                <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] space-y-1 mb-2">
                  <li><span style={mono}>listTiers(): Promise&lt;Tier[]&gt;</span> — Lists pricing catalog.</li>
                  <li><span style={mono}>createSandbox(opts): Promise&lt;Sandbox&gt;</span> — Provisions new sandbox.</li>
                  <li><span style={mono}>getSandbox(sandboxId): Promise&lt;Sandbox&gt;</span> — Retrieves status.</li>
                </ul>
              </div>

              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">Sandbox Instance</div>
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  Methods representing a provisioned container environment.
                </div>
                <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] space-y-2 mb-2">
                  <li>
                    <span style={mono}>waitUntilRunning(opts?: WaitOptions): Promise&lt;void&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Blocks execution locally until the container orchestration completes (default poll interval 2000ms).</p>
                  </li>
                  <li>
                    <span style={mono}>execSync(command: string, opts?: ExecOptions): Promise&lt;ExecResult&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Convenience method that starts the command, polls results asynchronously, streams outputs, and blocks until finished.</p>
                  </li>
                  <li>
                    <span style={mono}>writeFile(path: string, content: string, opts?: WriteOptions): Promise&lt;void&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Write UTF-8 text or Base64 binary file content into the sandbox.</p>
                  </li>
                  <li>
                    <span style={mono}>readFile(path: string): Promise&lt;string&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Read string contents of files inside the sandbox environment.</p>
                  </li>
                  <li>
                    <span style={mono}>pause() / resume() / terminate()</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Manage billing meters and orchestrator lifecycles.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* PYTHON SDK SECTION */}
          <div style={active === 'py-sdk' ? activeSectionStyle : sectionStyle}>
            <SectionHeading label="Python SDK" number="04" />
            <p style={bodyText}>
              The official <span style={mono}>sockt</span> Python SDK delivers an idiomatic, thread-safe, and asynchronous/synchronous client for orchestrating sandboxes in AI agent loops. It features automatic resource management via standard context managers.
            </p>

            <h3 style={h3Style}>Installation</h3>
            <CodeBlock code={`pip install sockt`} />

            <h3 style={h3Style}>Quick Start</h3>
            <CodeBlock code={CODE.sdkPy} />

            <h3 style={h3Style}>API Reference</h3>

            <div className="space-y-6 mt-4">
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">ComputeClient</div>
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  Instantiates the Python REST HTTP client. Fully supports context managers to close open TCP connections automatically:
                </div>
                <CodeBlock code={`with ComputeClient(api_key="...", base_url="...") as client:\n    sandbox = client.create_sandbox(tier="nano")`} />
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed my-2">Client Methods:</div>
                <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] space-y-1 mb-2">
                  <li><span style={mono}>list_tiers() -&gt; list[Tier]</span> — Returns available hardware sizes.</li>
                  <li><span style={mono}>create_sandbox(tier, billing_method, prepaid_sats, label) -&gt; Sandbox</span> — Provisions container.</li>
                  <li><span style={mono}>get_sandbox(sandbox_id) -&gt; Sandbox</span> — Restores sandbox handle.</li>
                  <li><span style={mono}>close()</span> — Closes active connection pools (not needed when using context manager).</li>
                </ul>
              </div>

              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">Sandbox Instance (snake_case)</div>
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3">
                  Python methods map precisely to the TypeScript SDK, utilizing pythonic snake_case styling conventions:
                </div>
                <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] space-y-2 mb-2">
                  <li>
                    <span style={mono}>wait_until_running(timeout=120.0, poll_interval=2.0)</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Blocks execution thread until the orchestrator launches the container.</p>
                  </li>
                  <li>
                    <span style={mono}>exec_sync(command, working_dir=None, timeout_ms=None) -&gt; ExecResult</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Executes shell command synchronously, polling chunks automatically until exit.</p>
                  </li>
                  <li>
                    <span style={mono}>write_file(path, content, encoding="utf8", create_dirs=False)</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Write UTF-8 or Base64 file contents into the sandbox filesystem.</p>
                  </li>
                  <li>
                    <span style={mono}>read_file(path, encoding="utf8", max_bytes=None) -&gt; str</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Read file contents inside the sandbox.</p>
                  </li>
                  <li>
                    <span style={mono}>pause() / resume() / terminate(lightning_address=None)</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Free resource allocations and control billing state.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* MCP SERVER SECTION */}
          <div style={active === 'mcp' ? activeSectionStyle : sectionStyle}>
            <SectionHeading label="MCP Server" number="05" />
            <p style={bodyText}>
              Model Context Protocol (MCP) allows secure, native integration of sockt.dev sandbox tools directly inside leading LLM agent client tools such as Cursor, Claude Code, and VS Code.
            </p>
            <p style={bodyText}>
              Point your client configuration directly to our public MCP server route: <span style={mono}>https://api.sockt.dev/v1/mcp</span>.
            </p>

            <h3 style={h3Style}>Claude Code</h3>
            <p style={bodyText}>
              Add the Sockt MCP server using the CLI:
            </p>
            <CodeBlock code={CODE.claudeCodeMcp} />

            <h3 style={h3Style}>VS Code (GitHub Copilot)</h3>
            <p style={bodyText}>
              Add the server in your VS Code <span style={mono}>settings.json</span>:
            </p>
            <CodeBlock code={CODE.vscodeMcp} />

            <h3 style={h3Style}>Cursor</h3>
            <p style={bodyText}>
              Add via Settings &gt; Features &gt; MCP Servers, or configure in your project <span style={mono}>.cursor/mcp.json</span>:
            </p>
            <CodeBlock code={CODE.cursorMcp} />

            <h3 style={h3Style}>Autonomous Agent Wallet Payments</h3>
            <p style={bodyText}>
              sockt.dev delivers isolated compute sandboxes but does **not** host active Bitcoin wallets. AI agents achieve true economic autonomy by linking an **external** wallet MCP server (such as <span style={mono}>lnbot</span>) alongside the Sockt MCP server. Under this flow, the agent detects payment invoices autonomously, issues payment through the wallet tool, and starts compute sandboxes completely on its own!
            </p>
            <p style={bodyText}>Here is a configuration sample representing a standard wallet linkage:</p>
            <CodeBlock code={CODE.walletMcp} />

            <h3 style={h3Style}>Available MCP Tools</h3>
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

          {/* Related Links footer */}
          <div
            style={{
              marginTop: '64px',
              paddingTop: '32px',
              borderTop: '1px solid var(--bg-border)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                letterSpacing: '0.08em',
                marginBottom: '14px',
              }}
            >
              RELATED LINKS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <Link href="/#pricing" style={relatedLinkStyle}>Pricing Table</Link>
              <Link href="/#use-cases" style={relatedLinkStyle}>Core Use Cases</Link>
              <Link href="/terms" style={relatedLinkStyle}>Terms of Service</Link>
              <Link href="/privacy" style={relatedLinkStyle}>Privacy Policy</Link>
            </div>
          </div>

        </main>
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
  fontSize: '1.05rem',
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

const relatedLinkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  color: 'var(--text-secondary)',
  border: '1px solid var(--bg-border)',
  padding: '8px 12px',
  borderRadius: '4px',
  letterSpacing: '0.05em',
  transition: 'color 0.15s, border-color 0.15s',
};
