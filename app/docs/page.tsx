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
            
            {/* GitHub URL Link */}
            <div style={{ marginBottom: '24px', marginTop: '-12px' }}>
              <a
                href="https://github.com/SocktDev/cli"
                target="_blank"
                rel="noopener noreferrer"
                style={githubLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-btc)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--bg-border)';
                  e.currentTarget.style.color = 'var(--accent-btc)';
                }}
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                github.com/SocktDev/cli ↗
              </a>
            </div>

            <p style={bodyText}>
              The <span style={mono}>sockt</span> Go binary is a fast, cross-platform CLI for orchestrating compute sandboxes directly from the console or shell scripts.
            </p>

            <h3 style={h3Style}>Installation</h3>
            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>From Source</h4>
            <CodeBlock code={`go build -o sockt .\n\n# Move binary to PATH\nmv sockt /usr/local/bin/`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>Release Builds</h4>
            <p style={bodyText}>Build cross-platform release artifacts (binaries, <span style={mono}>.tar.gz</span>/<span style={mono}>.zip</span> archives, and <span style={mono}>checksums.txt</span>) directly into the <span style={mono}>dist/</span> directory:</p>
            <CodeBlock code={`make release\n\n# Override the embedded version parameter\nmake release VERSION=0.2.0`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>Other Useful Build Targets</h4>
            <CodeBlock code={`make build    # build sockt for your current local platform\nmake test     # execute the CLI test suites\nmake clean    # remove local builds and the dist/ directory`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>Requirements</h4>
            <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] space-y-1 mb-4">
              <li>Go 1.26.2+ compiler toolchain</li>
              <li>GNU Make (for build shortcuts and targets)</li>
              <li>ZIP compression utility (required for Windows build packaging)</li>
            </ul>

            <h3 style={h3Style}>Global Configuration</h3>
            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>Environment Variables</h4>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Variable</th>
                  <th style={thStyle}>Description</th>
                  <th style={thStyle}>Default</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><span style={mono}>SOCKT_API_KEY</span></td>
                  <td style={tdStyle}>API Key token used for account-tied Credits billing (<span style={mono}>sockt_live_...</span>)</td>
                  <td style={tdStyle}>—</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>SOCKT_SANDBOX_TOKEN</span></td>
                  <td style={tdStyle}>Per-sandbox authorization token scoped strictly to a single Lightning billing container (<span style={mono}>sbx_...</span>)</td>
                  <td style={tdStyle}>—</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>SOCKT_API_URL</span></td>
                  <td style={tdStyle}>Base URL routing override for all REST endpoints</td>
                  <td style={tdStyle}><span style={mono}>https://api.sockt.dev</span></td>
                </tr>
              </tbody>
            </table>

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>Global Flags</h4>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Flag</th>
                  <th style={thStyle}>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><span style={mono}>--token &lt;token&gt;</span></td>
                  <td style={tdStyle}>Overrides any active environment variables. Takes absolute highest priority for credentials.</td>
                </tr>
              </tbody>
            </table>

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>Token Authentication Priority</h4>
            <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }} className="text-xs text-[var(--text-secondary)] space-y-1 mb-4">
              <li>Passed <span style={mono}>--token</span> command-line flag (Highest priority)</li>
              <li>Active <span style={mono}>SOCKT_SANDBOX_TOKEN</span> environment variable</li>
              <li>Active <span style={mono}>SOCKT_API_KEY</span> environment variable (Lowest priority)</li>
            </ol>

            <h3 style={h3Style}>Quick Start Reference</h3>
            <CodeBlock code={CODE.cliSetup} />

            <h3 style={h3Style}>Sandbox Paths & Working Directories</h3>
            <p style={bodyText}>
              The default sandbox environment home directory is <span style={mono}>/home/sandbox</span>. Always provide absolute paths for file upload operations (e.g. <span style={mono}>/home/sandbox/app.py</span>). For file read tasks, passing paths relative to the home folder (e.g. <span style={mono}>app.py</span>) is accepted.
            </p>
            <div className="p-3 bg-[rgba(194,122,54,0.1)] border border-[rgba(194,122,54,0.3)] text-xs text-[var(--accent-btc)] font-mono rounded mb-3">
              ⚠️ CRITICAL FLAG ORDER: Cobra command parsing rules mandate that execution flags (such as --timeout or --workdir) MUST be placed BEFORE the sandbox ID.
            </div>
            <CodeBlock code={`# CORRECT syntax (flags before sandbox-id)\nsockt exec --timeout 60000 <sandbox-id> npm install\nsockt exec --workdir /home/sandbox/project <sandbox-id> python3 main.py\n\n# INCORRECT syntax (will fail command execution)\nsockt exec <sandbox-id> npm install --timeout 60000`} />

            <h3 style={h3Style}>Commands Reference</h3>

            <div className="space-y-8 mt-6">
              {/* tiers */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt tiers</div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">List available compute sizes, specifications, and costs in Lightning sats and Credits billing models.</p>
                <CodeBlock code={`sockt tiers`} />
              </div>

              {/* create */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt sandbox create</div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Provision and orchestrate a new sandbox environment.</p>
                <div className="font-mono text-[10px] text-[var(--text-secondary)] uppercase tracking-[0.08em] mb-2">Subcommand Flags</div>
                <table style={tableStyle} className="my-2">
                  <thead>
                    <tr>
                      <th style={thStyle}>Flag</th>
                      <th style={thStyle}>Short</th>
                      <th style={thStyle}>Default</th>
                      <th style={thStyle}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--tier</span></td>
                      <td style={tdStyle}><span style={mono}>-t</span></td>
                      <td style={tdStyle}><span style={mono}>nano</span></td>
                      <td style={tdStyle}>Hardware tier capacity (nano, micro, small, medium, large, gpu-small)</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--billing</span></td>
                      <td style={tdStyle}><span style={mono}>-b</span></td>
                      <td style={tdStyle}><span style={mono}>credits</span></td>
                      <td style={tdStyle}>Billing pathway billing: <span style={mono}>credits</span> or <span style={mono}>lightning</span></td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--prepaid-sats</span></td>
                      <td style={tdStyle}>—</td>
                      <td style={tdStyle}><span style={mono}>0</span></td>
                      <td style={tdStyle}>Prepaid satoshis to fund Lightning invoices (Lightning only)</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--initial-credits</span></td>
                      <td style={tdStyle}>—</td>
                      <td style={tdStyle}><span style={mono}>0</span></td>
                      <td style={tdStyle}>Initial USD cents to allocate from budget (Credits only)</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--label</span></td>
                      <td style={tdStyle}><span style={mono}>-l</span></td>
                      <td style={tdStyle}>—</td>
                      <td style={tdStyle}>Human-readable label for records</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--wait</span></td>
                      <td style={tdStyle}><span style={mono}>-w</span></td>
                      <td style={tdStyle}><span style={mono}>false</span></td>
                      <td style={tdStyle}>Block and poll until the sandbox reaches "running" state</td>
                    </tr>
                  </tbody>
                </table>
                <CodeBlock code={`# Examples\nsockt sandbox create --tier micro --wait\nsockt sandbox create --tier nano --billing lightning --prepaid-sats 5000\nsockt sandbox create --tier small --label "dev-sandbox" --wait`} />
              </div>

              {/* status */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt sandbox status</div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Fetch active status metadata, consumed allocations, remaining compute durations, and unpaid invoice warnings.</p>
                <CodeBlock code={`sockt sandbox status <sandbox-id>`} />
              </div>

              {/* pause / resume */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt sandbox pause / resume</div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Freeze and unfreeze sandbox run states to stop compute billing meters.</p>
                <CodeBlock code={`sockt sandbox pause <sandbox-id>\nsockt sandbox resume <sandbox-id>`} />
              </div>

              {/* terminate */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt sandbox terminate</div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Permanently delete a sandbox and tear down underlying pods. Stops all billing immediately. For Lightning, remaining balances will refund if a Lightning Address is linked.</p>
                <CodeBlock code={`sockt sandbox terminate <sandbox-id>`} />
              </div>

              {/* exec */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt exec</div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Run non-interactive shell commands synchronously inside the container workspace. Streams outputs in real time.</p>
                <table style={tableStyle} className="my-2">
                  <thead>
                    <tr>
                      <th style={thStyle}>Flag</th>
                      <th style={thStyle}>Short</th>
                      <th style={thStyle}>Default</th>
                      <th style={thStyle}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--workdir</span></td>
                      <td style={tdStyle}><span style={mono}>-d</span></td>
                      <td style={tdStyle}><span style={mono}>.</span></td>
                      <td style={tdStyle}>Working directory inside the sandbox environment</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--timeout</span></td>
                      <td style={tdStyle}>—</td>
                      <td style={tdStyle}>—</td>
                      <td style={tdStyle}>Max execution duration ceiling (milliseconds)</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--poll</span></td>
                      <td style={tdStyle}>—</td>
                      <td style={tdStyle}><span style={mono}>500</span></td>
                      <td style={tdStyle}>Buffer poll check frequency (milliseconds)</td>
                    </tr>
                  </tbody>
                </table>
                <CodeBlock code={`sockt exec abc123-def456 echo "test"\nsockt exec --timeout 60000 abc123-def456 npm install`} />
              </div>

              {/* exec-cancel */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt exec-cancel</div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Cancel a running execution process by ID.</p>
                <CodeBlock code={`sockt exec-cancel <execution-id>`} />
              </div>

              {/* shell */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt shell</div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Launch an interactive terminal shell session using secure WebSocket PTY connections. Supports resizing and Ctrl+C propagation.</p>
                <CodeBlock code={`sockt shell <sandbox-id>`} />
              </div>

              {/* files write */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt files write</div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Write or upload files into the sandbox filesystem. Reads stdin if no source file is passed.</p>
                <table style={tableStyle} className="my-2">
                  <thead>
                    <tr>
                      <th style={thStyle}>Flag</th>
                      <th style={thStyle}>Short</th>
                      <th style={thStyle}>Default</th>
                      <th style={thStyle}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--file</span></td>
                      <td style={tdStyle}><span style={mono}>-f</span></td>
                      <td style={tdStyle}>—</td>
                      <td style={tdStyle}>Path to local file to upload</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--encoding</span></td>
                      <td style={tdStyle}>—</td>
                      <td style={tdStyle}><span style={mono}>utf8</span></td>
                      <td style={tdStyle}>Encoding mode: <span style={mono}>utf8</span> or <span style={mono}>base64</span></td>
                    </tr>
                  </tbody>
                </table>
                <CodeBlock code={`sockt files write abc123 /home/sandbox/app.py --file ./app.py\necho "test" | sockt files write abc123 /home/sandbox/greeting.txt\nbase64 img.png | sockt files write abc123 /home/sandbox/img.png --encoding base64`} />
              </div>

              {/* files read */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt files read</div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">Read file content from the container filesystem directly into stdout.</p>
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
                      <td style={tdStyle}><span style={mono}>--encoding</span></td>
                      <td style={tdStyle}><span style={mono}>utf8</span></td>
                      <td style={tdStyle}>Encoding mode: <span style={mono}>utf8</span> or <span style={mono}>base64</span></td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--max-bytes</span></td>
                      <td style={tdStyle}>—</td>
                      <td style={tdStyle}>Maximum bytes to read (truncates if exceeded)</td>
                    </tr>
                  </tbody>
                </table>
                <CodeBlock code={`sockt files read abc123 /home/sandbox/output.txt\nsockt files read abc123 /home/sandbox/output.txt --max-bytes 1024`} />
              </div>

              {/* files ls */}
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">sockt files ls</div>
                <p className="text-xs text-[var(--text-secondary)] mb-3">List files and directories in a given sandbox directory path.</p>
                <table style={tableStyle} className="my-2">
                  <thead>
                    <tr>
                      <th style={thStyle}>Flag</th>
                      <th style={thStyle}>Short</th>
                      <th style={thStyle}>Default</th>
                      <th style={thStyle}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--recursive</span></td>
                      <td style={tdStyle}><span style={mono}>-r</span></td>
                      <td style={tdStyle}><span style={mono}>false</span></td>
                      <td style={tdStyle}>List files recursively</td>
                    </tr>
                    <tr>
                      <td style={tdStyle}><span style={mono}>--max-depth</span></td>
                      <td style={tdStyle}>—</td>
                      <td style={tdStyle}>—</td>
                      <td style={tdStyle}>Directory tree depth limit for recursive lists</td>
                    </tr>
                  </tbody>
                </table>
                <CodeBlock code={`sockt files ls abc123\nsockt files ls abc123 /home/sandbox/project --recursive --max-depth 3`} />
              </div>
            </div>

            <h3 style={h3Style}>Comprehensive Workflow Examples</h3>
            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>Account Credits Workflow</h4>
            <CodeBlock code={`export SOCKT_API_KEY="sockt_live_abc123"\n\n# Create and wait\nSANDBOX_ID=$(sockt sandbox create --tier small --wait)\n\n# Install dependencies and run\nsockt exec $SANDBOX_ID pip install requests\nsockt exec $SANDBOX_ID python -c "import requests; print(requests.get('https://httpbin.org/ip').text)"\n\n# Check status\nsockt sandbox status $SANDBOX_ID\n\n# Clean up\nsockt sandbox terminate $SANDBOX_ID`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>Lightning Pay-As-You-Go Workflow</h4>
            <CodeBlock code={`# Create with lightning billing (no API key needed)\nsockt sandbox create --tier nano --billing lightning --prepaid-sats 5000\n\n# Output includes a BOLT11 invoice - pay it with your Lightning wallet\n# After payment confirms, the sandbox starts (~30-90s)\n\n# Set the sandbox token for subsequent commands\nexport SOCKT_SANDBOX_TOKEN="sbx_returned_token"\n\n# Use the sandbox\nsockt exec <sandbox-id> whoami\n\n# Terminate (remaining balance refundable)\nsockt sandbox terminate <sandbox-id>`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>Automation Bash Script with Cleanup</h4>
            <CodeBlock code={`#!/bin/bash\nset -e\n\nexport SOCKT_API_KEY="sockt_live_abc123"\nSANDBOX_ID=""\n\ncleanup() {\n    if [ -n "$SANDBOX_ID" ]; then\n        sockt sandbox terminate "$SANDBOX_ID" 2>/dev/null || true\n    fi\n}\ntrap cleanup EXIT\n\nSANDBOX_ID=\$(sockt sandbox create --tier small --wait)\n\n# Upload project files\nsockt files write "$SANDBOX_ID" /home/sandbox/main.py --file ./main.py\nsockt files write "$SANDBOX_ID" /home/sandbox/requirements.txt --file ./requirements.txt\n\n# Run tests\nsockt exec "$SANDBOX_ID" pip install -r /home/sandbox/requirements.txt\nsockt exec "$SANDBOX_ID" --workdir /home/sandbox python -m pytest\n\n# Download results\nsockt files read "$SANDBOX_ID" /home/sandbox/test-results.xml > test-results.xml`} />

            <h3 style={h3Style}>Exit Status Codes</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Exit Code</th>
                  <th style={thStyle}>Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><span style={mono}>0</span></td>
                  <td style={tdStyle}>Success</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>1</span></td>
                  <td style={tdStyle}>CLI error (invalid arguments, connection failure, API error envelope response)</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>N</span></td>
                  <td style={tdStyle}>For <span style={mono}>sockt exec</span>: mirrors the remote command exit code directly</td>
                </tr>
              </tbody>
            </table>

            <h3 style={h3Style}>Troubleshooting & Mitigation</h3>
            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>"API error (401): unauthorized"</h4>
            <p style={bodyText}>Verify your API key or sandbox token credentials. Ensure you are passing the correct header type for your billing pathway (Credits vs Lightning).</p>

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>"API error (503): no capacity"</h4>
            <p style={bodyText}>The requested compute tier is currently fully occupied. Try selecting another hardware size or wait and retry.</p>

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>"API error (400): pod unreachable" / host_error 404</h4>
            <p style={bodyText}>The sandbox container is still booting. Use <span style={mono}>--wait</span> during create command sequences or poll status until running.</p>

            <h3 style={h3Style}>Development & Compilation Reference</h3>
            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>Project Directory Structure</h4>
            <CodeBlock code={`cli/\n├── main.go              # Entry point\n├── go.mod               # Go module definition\n├── go.sum               # Dependency checksums\n├── cmd/\n│   ├── root.go          # Root command, global flags, client factory\n│   ├── sandbox.go       # sandbox create/status/pause/resume/terminate\n│   ├── exec.go          # exec and exec-cancel commands\n│   ├── shell.go         # Interactive WebSocket shell\n│   ├── files.go         # files write/read/ls commands\n│   └── tiers.go         # tiers listing command\n└── internal/\n    └── api/\n        ├── client.go    # HTTP client with auth and retry logic\n        └── models.go    # Request/response data structures`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>Development Dependencies</h4>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Package</th>
                  <th style={thStyle}>Version</th>
                  <th style={thStyle}>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><span style={mono}>github.com/spf13/cobra</span></td>
                  <td style={tdStyle}>v1.9.1</td>
                  <td style={tdStyle}>CLI command framework</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>github.com/gorilla/websocket</span></td>
                  <td style={tdStyle}>v1.5.0</td>
                  <td style={tdStyle}>WebSocket transport shell</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>golang.org/x/term</span></td>
                  <td style={tdStyle}>v0.43.0</td>
                  <td style={tdStyle}>Terminal raw mode controls</td>
                </tr>
              </tbody>
            </table>

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '18px' }}>Cross-Compilation Targets</h4>
            <CodeBlock code={`# Darwin (macOS ARM64)\nGOOS=darwin GOARCH=arm64 go build -o sockt-darwin-arm64 .\n\n# Linux (AMD64)\nGOOS=linux GOARCH=amd64 go build -o sockt-linux-amd64 .\n\n# Windows (AMD64)\nGOOS=windows GOARCH=amd64 go build -o sockt.exe .`} />
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

            {/* GitHub URL Link */}
            <div style={{ marginBottom: '24px', marginTop: '-12px' }}>
              <a
                href="https://github.com/SocktDev/sockt-js"
                target="_blank"
                rel="noopener noreferrer"
                style={githubLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-btc)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--bg-border)';
                  e.currentTarget.style.color = 'var(--accent-btc)';
                }}
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                github.com/SocktDev/sockt-js ↗
              </a>
            </div>

            <p style={bodyText}>
              Official TypeScript/JavaScript SDK client for orchestrating Sockt sandboxes programmatically. Supports Node.js 18+ environments.
            </p>

            <h3 style={h3Style}>Installation</h3>
            <CodeBlock code={`npm install @sockt/client`} />
            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Build from Source</h4>
            <CodeBlock code={`npm install\nnpm run build`} />
            <p style={bodyText}><strong>Dependencies:</strong> Requires <span style={mono}>ws</span> (^8.18.0) for Node.js WebSocket support.</p>

            <h3 style={h3Style}>Quick Start</h3>
            <CodeBlock code={CODE.sdkTs} />

            <h3 style={h3Style}>Authentication Configuration</h3>
            <p style={bodyText}>The JS SDK handles both Credits and Lightning sandboxes transparently:</p>
            <CodeBlock code={`// 1. Credits Billing (API Key)\nconst client = new ComputeClient({ apiKey: "sockt_live_abc123" });\n\n// 2. Lightning Billing (Sandbox Token)\nconst client = new ComputeClient({ sandboxToken: "sbx_abc123" });\nconst sandbox = await client.getSandbox("sandbox-id-here");`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Environment Variables Mapping</h4>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Variable Name</th>
                  <th style={thStyle}>Description / Fallback Usage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><span style={mono}>SOCKT_API_KEY</span></td>
                  <td style={tdStyle}>API key for credits billing. Used if constructor <span style={mono}>apiKey</span> is omitted.</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>SOCKT_SANDBOX_TOKEN</span></td>
                  <td style={tdStyle}>Token scoped to one sandbox. Used if constructor <span style={mono}>sandboxToken</span> is omitted.</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>SOCKT_API_URL</span></td>
                  <td style={tdStyle}>API base URL override. Used if constructor <span style={mono}>baseUrl</span> is omitted.</td>
                </tr>
              </tbody>
            </table>

            <h3 style={h3Style}>Core Architectural Design</h3>
            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>1. Sandbox Lifecycle States</h4>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Lifecycle State</th>
                  <th style={thStyle}>State Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><span style={mono}>starting</span></td>
                  <td style={tdStyle}>The compute container pod is being allocated and provisioned by the orchestrator (takes 30-90s).</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>running</span></td>
                  <td style={tdStyle}>Container is online, socket channels are open, and is fully ready to process commands and files.</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>paused</span></td>
                  <td style={tdStyle}>Container processes are frozen, and active billing meters are halted. Can be resumed.</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>terminated</span></td>
                  <td style={tdStyle}>Container resources are permanently destroyed. Unrecoverable.</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>failed</span></td>
                  <td style={tdStyle}>Container orchestration or boot process encountered a terminal system execution error.</td>
                </tr>
              </tbody>
            </table>

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>2. Billing Methods Control Flow</h4>
            <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] space-y-1 mb-4">
              <li><strong>Credits Billing:</strong> Budget limits pause sandboxes when depleted. Terminating refunds unused allocations.</li>
              <li><strong>Lightning Billing:</strong> Pay invoice BOLT11 to boot pod anonymously. Triggers status events <span style={mono}>pending_invoice</span>, <span style={mono}>low_balance</span>, and <span style={mono}>out_of_balance</span> to allow proactive Alby/LND wallet top-ups.</li>
            </ul>

            <h3 style={h3Style}>API Reference</h3>

            <div className="space-y-6 mt-4">
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">ComputeClient</div>
                <CodeBlock code={`// Constructor Signature\nnew ComputeClient(options?: {\n  apiKey?: string;\n  sandboxToken?: string;\n  baseUrl?: string;\n  timeoutMs?: number; // default: 120000\n})`} />
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed my-2">Methods:</div>
                <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] space-y-2 mb-2">
                  <li><span style={mono}>listTiers(): Promise&lt;Tier[]&gt;</span> — Lists hardware catalogs.</li>
                  <li><span style={mono}>createSandbox(opts): Promise&lt;Sandbox&gt;</span> — Instantiates and provisions a container. Accepts <span style={mono}>tier</span>, <span style={mono}>billingMethod</span>, <span style={mono}>prepaidSats</span>, <span style={mono}>initialCreditsCents</span>, and <span style={mono}>label</span>.</li>
                  <li><span style={mono}>getSandbox(sandboxId: string): Promise&lt;Sandbox&gt;</span> — Loads and refreshes an existing sandbox.</li>
                </ul>
              </div>

              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">Sandbox Handles</div>
                <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] space-y-3 mb-2">
                  <li>
                    <span style={mono}>waitUntilRunning(opts?: &#123; timeoutMs?: number; pollIntervalMs?: number &#125;): Promise&lt;void&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Blocks execution thread until pod boot completes. Throws <span style={mono}>SandboxNotRunningError</span> on timeout.</p>
                  </li>
                  <li>
                    <span style={mono}>refreshStatus(): Promise&lt;SandboxStatus&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Pulls latest status models and metrics from remote REST controllers.</p>
                  </li>
                  <li>
                    <span style={mono}>pause() / resume()</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Freezes/unfreezes resource allocations and billing states.</p>
                  </li>
                  <li>
                    <span style={mono}>terminate(opts?: &#123; lightningAddress?: string &#125;): Promise&lt;object&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Permanently destroys container pod. Accepts a Lightning refund address.</p>
                  </li>
                  <li>
                    <span style={mono}>execSync(command: string, opts?: &#123; workingDir?: string; timeoutMs?: number; pollIntervalMs?: number &#125;): Promise&lt;ExecResult&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Synchronously processes process execution. Streams data blocks until final terminal exit code is received.</p>
                  </li>
                  <li>
                    <span style={mono}>exec(command: string, opts?: &#123; workingDir?: string; timeoutMs?: number &#125;): Promise&lt;Execution&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Asynchronous process trigger. Returns execution handles immediately.</p>
                  </li>
                  <li>
                    <span style={mono}>execResult(executionId: string): Promise&lt;ExecResult&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Retrieves pending stdout/stderr chunks buffered since last poll.</p>
                  </li>
                  <li>
                    <span style={mono}>execCancel(executionId: string): Promise&lt;void&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Cancels and kills running process group inside the sandbox.</p>
                  </li>
                  <li>
                    <span style={mono}>writeFile(path: string, content: string, opts?: &#123; encoding?: 'utf8'|'base64'; createDirs?: boolean &#125;): Promise&lt;void&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Creates or overwrites files on container. Base64 is supported for binary assets.</p>
                  </li>
                  <li>
                    <span style={mono}>readFile(path: string, opts?: &#123; encoding?: 'utf8'|'base64'; maxBytes?: number &#125;): Promise&lt;string&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Reads file content. Binary reads return Base64 strings.</p>
                  </li>
                  <li>
                    <span style={mono}>listFiles(path?: string, opts?: &#123; recursive?: boolean; maxDepth?: number &#125;): Promise&lt;FileEntry[]&gt;</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Lists contents of directories recursively.</p>
                  </li>
                  <li>
                    <span style={mono}>shell(): ShellSession</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Instantiates a WebSocket-based interactive shell session.</p>
                  </li>
                  <li>
                    <span style={mono}>on(event: string, callback: Function) / off(event: string, callback: Function)</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Subscribes/unsubscribes to billing warnings (<span style={mono}>pending_invoice</span>, <span style={mono}>low_balance</span>, <span style={mono}>out_of_balance</span>).</p>
                  </li>
                </ul>
              </div>

              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">ShellSession API</div>
                <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] space-y-2 mb-2">
                  <li><span style={mono}>connect(): Promise&lt;void&gt;</span> — Opens PTY WebSocket link.</li>
                  <li><span style={mono}>close(): void</span> — Terminates connection.</li>
                  <li><span style={mono}>send(text: string) / sendLine(text: string): void</span> — Transmits keystrokes.</li>
                  <li><span style={mono}>resize(cols: number, rows: number): void</span> — Sets remote PTY screen limits.</li>
                  <li><span style={mono}>recv(timeoutMs?: number): Promise&lt;ShellFrame&gt;</span> — Receives output blocks (stdout, stderr, billing frame).</li>
                  <li><span style={mono}>on(event: ShellFrameType, callback: Function) / off(event, callback)</span> — Binds callback hooks to frame streams.</li>
                </ul>
              </div>
            </div>

            <h3 style={h3Style}>SDK Type Models</h3>
            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Tier</h4>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Field</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { f: 'name', t: 'string', d: 'Unique identifier for the tier (nano, micro, small, medium, gpu-small etc)' },
                  { f: 'msatsPerSecond', t: 'number', d: 'Burn rate in Lightning millisatoshis per second' },
                  { f: 'satsPerSecond', t: 'number', d: 'Burn rate in satoshis per second' },
                  { f: 'usdCentsPerSecond', t: 'number', d: 'Burn rate in USD cents per second (Credits model)' },
                  { f: 'costPerMinuteSats', t: 'number', d: 'Estimated cost to run 60 seconds (Lightning)' },
                  { f: 'costPerHourSats', t: 'number', d: 'Estimated cost to run 1 hour (Lightning)' },
                  { f: 'costPerDaySats', t: 'number', d: 'Estimated cost to run 24 hours (Lightning)' },
                  { f: 'costPerHourUsd', t: 'number', d: 'Estimated cost to run 1 hour in USD (Credits)' }
                ].map((item, i) => (
                  <tr key={i}>
                    <td style={tdStyle}><span style={mono}>{item.f}</span></td>
                    <td style={tdStyle}><span style={mono}>{item.t}</span></td>
                    <td style={tdStyle}>{item.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>SandboxStatus</h4>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Field</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { f: 'sandboxId', t: 'string', d: 'Unique UUID mapping' },
                  { f: 'status', t: 'string', d: 'State (starting, running, paused, terminated, failed)' },
                  { f: 'tier', t: 'string', d: 'Compute hardware capacity' },
                  { f: 'runtime', t: 'string', d: 'System runtime profile' },
                  { f: 'billingMethod', t: 'string', d: 'credits or lightning' },
                  { f: 'template', t: 'string', d: 'Base workspace template' },
                  { f: 'consumedMsats', t: 'number', d: 'Total consumed millisatoshis since launch' },
                  { f: 'msatsPerSecond', t: 'number | null', d: 'Burn rate msats/second' },
                  { f: 'satsPerSecond', t: 'number | null', d: 'Burn rate sats/second' },
                  { f: 'prepaidBalanceMsats', t: 'number | null', d: 'Remaining prepaid Lightning balance' },
                  { f: 'secondsRemaining', t: 'number | null', d: 'Approximate seconds left' },
                  { f: 'warningLevel', t: 'string | null', d: 'low_balance or out_of_balance' },
                  { f: 'nextPollSecs', t: 'number | null', d: 'Recommended status check pacing interval' },
                  { f: 'pendingInvoice', t: 'PendingInvoice | null', d: 'Unpaid deposit invoice' },
                  { f: 'sandboxToken', t: 'string | null', d: 'Lightning credential token' }
                ].map((item, i) => (
                  <tr key={i}>
                    <td style={tdStyle}><span style={mono}>{item.f}</span></td>
                    <td style={tdStyle}><span style={mono}>{item.t}</span></td>
                    <td style={tdStyle}>{item.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>ExecResult</h4>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Field</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { f: 'executionId', t: 'string', d: 'Unique execution identifier' },
                  { f: 'status', t: 'string', d: 'running, completed, failed, cancelled' },
                  { f: 'output', t: 'array', d: 'List of text chunks: [{stream: "stdout"|"stderr", chunk: "..."}]' },
                  { f: 'exitCode', t: 'number | null', d: 'Command exit status' },
                  { f: 'error', t: 'string | null', d: 'Detailed system error description' }
                ].map((item, i) => (
                  <tr key={i}>
                    <td style={tdStyle}><span style={mono}>{item.f}</span></td>
                    <td style={tdStyle}><span style={mono}>{item.t}</span></td>
                    <td style={tdStyle}>{item.d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={bodyText}><strong>Convenience properties:</strong> <span style={mono}>result.stdout</span> and <span style={mono}>result.stderr</span> automatically join the array chunks into a single clean string block.</p>

            <h3 style={h3Style}>SDK Exception Handlers</h3>
            <CodeBlock code={`// SDK Error Hierarchy Tree\nSocktError (base class)\n├── AuthenticationError    (HTTP 401/403: Credentials revoked or bad)\n├── NoCapacityError        (HTTP 503 slug 'no_capacity': Tier empty)\n├── SandboxNotRunningError (Wait blocks timed out or boot failed)\n├── TopUpFailedError       (HTTP 402: Account credits depleted)\n├── HostUnreachableError   (HTTP 502/503: Runtime connectivity lost)\n├── RateLimitedError       (HTTP 429: Transacted above 300 req/min)\n└── APIError               (Other unmapped HTTP errors)`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Exception Properties</h4>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Property</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><span style={mono}>message</span></td>
                  <td style={tdStyle}>string</td>
                  <td style={tdStyle}>Human-readable error details</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>slug</span></td>
                  <td style={tdStyle}>string</td>
                  <td style={tdStyle}>Machine-readable error label code</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>statusCode</span></td>
                  <td style={tdStyle}>number</td>
                  <td style={tdStyle}>HTTP status code returned by the REST gateway</td>
                </tr>
              </tbody>
            </table>

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Error Handling Pattern Example</h4>
            <CodeBlock code={`import {\n  ComputeClient,\n  AuthenticationError,\n  NoCapacityError,\n  RateLimitedError,\n  SocktError\n} from "@sockt/client";\n\ntry {\n  const client = new ComputeClient({ apiKey: "sockt_live_..." });\n  const sandbox = await client.createSandbox({ tier: "gpu-small" });\n} catch (e) {\n  if (e instanceof AuthenticationError) {\n    console.error("Invalid API credentials key");\n  } else if (e instanceof NoCapacityError) {\n    console.error("No active pods available for GPU workloads");\n  } else if (e instanceof RateLimitedError) {\n    console.error("SDK calls rate-limited. Throttling requests.");\n  } else if (e instanceof SocktError) {\n    console.error(\`API Error (\${e.statusCode}): \${e.message}\`);\n  }\n}`} />

            <h3 style={h3Style}>Default Configuration Constants</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Constant Name</th>
                  <th style={thStyle}>Value</th>
                  <th style={thStyle}>Functional Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><span style={mono}>Base URL</span></td>
                  <td style={tdStyle}><span style={mono}>https://api.sockt.dev</span></td>
                  <td style={tdStyle}>Target control plane endpoint routing link</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>Request Timeout</span></td>
                  <td style={tdStyle}><span style={mono}>120,000ms</span></td>
                  <td style={tdStyle}>Standard HTTP API client call ceiling</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>Poll Interval</span></td>
                  <td style={tdStyle}><span style={mono}>500ms</span></td>
                  <td style={tdStyle}>Output check frequency mapping for sync calls</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>Wait Timeout</span></td>
                  <td style={tdStyle}><span style={mono}>120,000ms</span></td>
                  <td style={tdStyle}>Standard timeout limits during orchestrator container creation</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>Max Auto-Retries</span></td>
                  <td style={tdStyle}><span style={mono}>3 attempts</span></td>
                  <td style={tdStyle}>Automatic retry limit when receiving HTTP 503 pod starting exceptions (with a 2-second backoff delay)</td>
                </tr>
              </tbody>
            </table>

            <h3 style={h3Style}>Programmatic Code Recipes</h3>
            
            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Credits Mode Workflows</h4>
            <CodeBlock code={`import { ComputeClient } from "@sockt/client";\n\nconst client = new ComputeClient({ apiKey: "sockt_live_..." });\nconst sandbox = await client.createSandbox({ tier: "small" });\nawait sandbox.waitUntilRunning();\n\nconst version = await sandbox.execSync("python --version");\nconsole.log(version.stdout);\n\nawait sandbox.writeFile("hello.py", 'print("Hello from Sockt!")');\nconst result = await sandbox.execSync("python hello.py");\nconsole.log(result.stdout);\n\nconst entries = await sandbox.listFiles();\nfor (const entry of entries) {\n  console.log(\`\${entry.isDir ? "d" : "-"} \${entry.size} \${entry.name}\`);\n}\nawait sandbox.terminate();`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Lightning Pay-As-You-Go with Event Binds</h4>
            <CodeBlock code={CODE.restWorkflowLightning.replace('# 1.', '// 1.').replace(/curl/g, '// curl')} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Binary Files (Base64 Mode)</h4>
            <CodeBlock code={`import { readFileSync, writeFileSync } from "fs";\n\n// 1. Upload base64 encoded binary file\nconst encoded = readFileSync("model.bin").toString("base64");\nawait sandbox.writeFile("model.bin", encoded, { encoding: "base64" });\n\n// 2. Download binary file\nconst b64 = await sandbox.readFile("output.png", { encoding: "base64" });\nwriteFileSync("output.png", Buffer.from(b64, "base64"));`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Interactive WebSocket PTY Shell</h4>
            <CodeBlock code={`const session = sandbox.shell();\nawait session.connect();\n\nsession.sendLine("cd /tmp && mkdir myproject");\nconst frame1 = await session.recv(5000);\nconsole.log(frame1.data);\n\nsession.resize(120, 40);\nsession.sendLine("for i in 1 2 3; do echo $i; sleep 1; done");\nfor (let i = 0; i < 3; i++) {\n  const frame = await session.recv(5000);\n  process.stdout.write(frame.data || "");\n}\nsession.close();`} />
          </div>

          {/* PYTHON SDK SECTION */}
          <div style={active === 'py-sdk' ? activeSectionStyle : sectionStyle}>
            <SectionHeading label="Python SDK" number="04" />

            {/* GitHub URL Link */}
            <div style={{ marginBottom: '24px', marginTop: '-12px' }}>
              <a
                href="https://github.com/SocktDev/sockt-python"
                target="_blank"
                rel="noopener noreferrer"
                style={githubLinkStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-btc)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--bg-border)';
                  e.currentTarget.style.color = 'var(--accent-btc)';
                }}
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                github.com/SocktDev/sockt-python ↗
              </a>
            </div>

            <p style={bodyText}>
              Official Python SDK for programmatic orchestration of ephemeral sandboxes. Thread-safe, utilizing modern pythonic asynchronous PTY frameworks. Requires Python 3.10+.
            </p>

            <h3 style={h3Style}>Installation</h3>
            <CodeBlock code={`pip install sockt`} />
            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Build from Source</h4>
            <CodeBlock code={`pip install -e .`} />
            <p style={bodyText}><strong>Dependencies:</strong> Automatically provisions `httpx` (&gt;=0.27, &lt;1) and `websockets` (&gt;=14, &lt;16).</p>

            <h3 style={h3Style}>Quick Start</h3>
            <CodeBlock code={CODE.sdkPy} />

            <h3 style={h3Style}>Authentication</h3>
            <CodeBlock code={`# 1. Credits Billing (API Key)\nclient = ComputeClient(api_key="sockt_live_abc123")\n\n# 2. Lightning Billing (Sandbox Token)\nclient = ComputeClient(sandbox_token="sbx_abc123")\nsandbox = client.get_sandbox("sandbox-id-here")`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Environment variables priority</h4>
            <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }} className="text-xs text-[var(--text-secondary)] space-y-1 mb-4">
              <li>Constructor <span style={mono}>api_key</span> / <span style={mono}>sandbox_token</span> parameters (Highest priority)</li>
              <li><span style={mono}>SOCKT_API_KEY</span> / <span style={mono}>SOCKT_SANDBOX_TOKEN</span> system variables</li>
              <li>Defaults (Lowest priority)</li>
            </ol>

            <h3 style={h3Style}>API Reference</h3>

            <div className="space-y-6 mt-4">
              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">ComputeClient</div>
                <CodeBlock code={`# Constructor Signature\nComputeClient(\n    api_key: str | None = None,\n    sandbox_token: str | None = None,\n    base_url: str | None = None,\n    timeout: float = 120.0 # seconds\n)`} />
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed my-2">Methods:</div>
                <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] space-y-2 mb-2">
                  <li><span style={mono}>list_tiers() -&gt; list[Tier]</span> — Returns available tiers.</li>
                  <li><span style={mono}>create_sandbox(tier, billing_method, prepaid_sats, initial_credits_cents, label) -&gt; Sandbox</span> — Provisions container.</li>
                  <li><span style={mono}>get_sandbox(sandbox_id: str) -&gt; Sandbox</span> — Restores active sandbox.</li>
                  <li><span style={mono}>close()</span> — Closes active HTTPX connection pools (not needed when using context managers).</li>
                </ul>
              </div>

              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">Sandbox Instance (snake_case)</div>
                <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] space-y-3 mb-2">
                  <li>
                    <span style={mono}>wait_until_running(timeout: float = 120.0, poll_interval: float = 2.0)</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Blocks execution locally until orchestration completes. Raises <span style={mono}>SandboxNotRunningError</span> on failure.</p>
                  </li>
                  <li>
                    <span style={mono}>refresh_status() -&gt; SandboxStatus</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Pulls latest status models.</p>
                  </li>
                  <li>
                    <span style={mono}>pause() / resume()</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Freezes/unfreezes resource allocations.</p>
                  </li>
                  <li>
                    <span style={mono}>terminate(lightning_address: str | None = None) -&gt; dict</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Destroys pod permanently.</p>
                  </li>
                  <li>
                    <span style={mono}>exec_sync(command: str, working_dir=None, timeout_ms=30000, poll_interval=0.5) -&gt; ExecResult</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Synchronously executes commands. Streams logs until exit.</p>
                  </li>
                  <li>
                    <span style={mono}>exec(command: str, working_dir=None, timeout_ms=30000) -&gt; Execution</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Asynchronous process trigger. Returns execution ID handles immediately.</p>
                  </li>
                  <li>
                    <span style={mono}>exec_result(execution_id: str) -&gt; ExecResult</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Pulls output chunks since last query.</p>
                  </li>
                  <li>
                    <span style={mono}>exec_cancel(execution_id: str) -&gt; None</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Cancels running process group.</p>
                  </li>
                  <li>
                    <span style={mono}>write_file(path, content, encoding="utf8", create_dirs=True) -&gt; dict</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Creates or overwrites files. Base64 encoding supported.</p>
                  </li>
                  <li>
                    <span style={mono}>read_file(path, encoding="utf8", max_bytes=None) -&gt; str</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Reads file content.</p>
                  </li>
                  <li>
                    <span style={mono}>list_files(path=".", recursive=False, max_depth=None) -&gt; list[FileEntry]</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">Lists directory files.</p>
                  </li>
                  <li>
                    <span style={mono}>shell() -&gt; ShellSession</span>
                    <p className="text-[11px] text-[var(--text-secondary)] mt-1">PTY WebSocket interactive terminal session creator.</p>
                  </li>
                </ul>
              </div>

              <div className="border border-[var(--bg-border)] rounded-lg p-5 bg-[var(--bg-surface)]">
                <div className="font-mono text-sm text-[var(--accent-btc)] font-semibold mb-2">ShellSession API</div>
                <ul className="list-disc pl-5 text-xs text-[var(--text-secondary)] space-y-2 mb-2">
                  <li><span style={mono}>connect()</span> — Establishes WebSocket link.</li>
                  <li><span style={mono}>close()</span> — Terminates connection.</li>
                  <li><span style={mono}>send(text) / send_line(text)</span> — Transmits keystrokes.</li>
                  <li><span style={mono}>resize(cols, rows)</span> — Configures screen size.</li>
                  <li><span style={mono}>recv(timeout=30.0) -&gt; dict</span> — Receives next output frame.</li>
                </ul>
              </div>
            </div>

            <h3 style={h3Style}>SDK Exception Handlers</h3>
            <CodeBlock code={`# Python Exception Hierarchy\nSocktError (base)\n├── AuthenticationError\n├── NoCapacityError\n├── SandboxNotRunningError\n├── TopUpFailedError\n├── HostUnreachableError\n├── RateLimitedError\n└── APIError`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Exception Properties</h4>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Property</th>
                  <th style={thStyle}>Type</th>
                  <th style={thStyle}>Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><span style={mono}>message</span></td>
                  <td style={tdStyle}>string</td>
                  <td style={tdStyle}>Error details description</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>slug</span></td>
                  <td style={tdStyle}>string</td>
                  <td style={tdStyle}>Machine-readable code</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>status_code</span></td>
                  <td style={tdStyle}>int</td>
                  <td style={tdStyle}>HTTP status code returned by the REST gateway</td>
                </tr>
              </tbody>
            </table>

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Error Handling Example</h4>
            <CodeBlock code={`from sockt import (\n    ComputeClient,\n    AuthenticationError,\n    NoCapacityError,\n    RateLimitedError,\n    SocktError\n)\n\ntry:\n    client = ComputeClient(api_key="sockt_live_...")\n    sandbox = client.create_sandbox(tier="gpu-small")\nexcept AuthenticationError:\n    print("Invalid API Key")\nexcept NoCapacityError:\n    print("Requested GPU tier currently has no available capacity")\nexcept RateLimitedError:\n    print("Excess requests rate limited")\nexcept SocktError as e:\n    print(f"API Error ({e.status_code}): {e.message}")`} />

            <h3 style={h3Style}>Default Configuration Constants</h3>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Constant</th>
                  <th style={thStyle}>Value</th>
                  <th style={thStyle}>Functional Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}><span style={mono}>Base URL</span></td>
                  <td style={tdStyle}><span style={mono}>https://api.sockt.dev</span></td>
                  <td style={tdStyle}>Target control plane routing URL</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>Request Timeout</span></td>
                  <td style={tdStyle}><span style={mono}>120.0s</span></td>
                  <td style={tdStyle}>Standard HTTP timeout limit</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>Poll Interval</span></td>
                  <td style={tdStyle}><span style={mono}>0.5s</span></td>
                  <td style={tdStyle}>Poll check frequency for sync executions</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>Wait Timeout</span></td>
                  <td style={tdStyle}><span style={mono}>120.0s</span></td>
                  <td style={tdStyle}>Boot block limit during container provisioning</td>
                </tr>
                <tr>
                  <td style={tdStyle}><span style={mono}>Max Auto-Retries</span></td>
                  <td style={tdStyle}><span style={mono}>3 attempts</span></td>
                  <td style={tdStyle}>Automatic retry limit on HTTP 503 pod starting exceptions (with 2.0s delay)</td>
                </tr>
              </tbody>
            </table>

            <h3 style={h3Style}>Programmatic Code Recipes</h3>
            
            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Context Manager / Automatic Cleanup Workflow</h4>
            <CodeBlock code={`from sockt import ComputeClient\n\nwith ComputeClient(api_key="sockt_live_...") as client:\n    sandbox = client.create_sandbox(tier="small")\n    try:\n        sandbox.wait_until_running()\n        result = sandbox.exec_sync("python --version")\n        print(result.stdout)\n\n        sandbox.write_file("hello.py", 'print("Hello from Sockt!")')\n        result = sandbox.exec_sync("python hello.py")\n        print(result.stdout)\n    finally:\n        sandbox.terminate()`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Binary Files (Base64 Mode)</h4>
            <CodeBlock code={`import base64\n\n# 1. Upload base64 encoded binary file\nwith open("model.bin", "rb") as f:\n    encoded = base64.b64encode(f.read()).decode()\nsandbox.write_file("model.bin", encoded, encoding="base64")\n\n# 2. Download binary file\nb64_content = sandbox.read_file("output.png", encoding="base64")\nwith open("output.png", "wb") as f:\n    f.write(base64.b64decode(b64_content))`} />

            <h4 style={{ ...h3Style, fontSize: '0.9rem', marginTop: '14px' }}>Interactive PTY Shell Context Block</h4>
            <CodeBlock code={`with sandbox.shell() as sh:\n    sh.send_line("cd /tmp && mkdir myproject")\n    frame = sh.recv(timeout=5.0)\n    print(frame.get("data", ""))\n\n    sh.send_line("echo $PWD")\n    frame = sh.recv(timeout=5.0)\n    print(frame.get("data", ""))\n\n    sh.resize(cols=120, rows=40)\n    sh.send_line("for i in 1 2 3; do echo $i; sleep 1; done")\n    for _ in range(3):\n        frame = sh.recv(timeout=5.0)\n        print(frame.get("data", ""), end="")`} />
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

const githubLinkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  color: 'var(--accent-btc)',
  border: '1px solid var(--bg-border)',
  backgroundColor: 'var(--bg-raised)',
  padding: '8px 14px',
  borderRadius: '6px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
  transition: 'border-color 0.15s, color 0.15s',
};
