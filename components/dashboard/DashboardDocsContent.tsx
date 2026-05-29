'use client';

import { useState } from 'react';
import Link from 'next/link';

type Section = 'overview' | 'mcp' | 'sdk' | 'api';

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'mcp', label: 'MCP Server' },
  { id: 'sdk', label: 'SDK' },
  { id: 'api', label: 'API Reference' },
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
};

const MCP_TOOLS = [
  { name: 'sandbox_create', desc: 'Provision a new sandbox on the specified tier. Returns sandbox ID and proxy URL.' },
  { name: 'sandbox_exec', desc: 'Run a shell command inside a sandbox. Returns stdout, stderr, and exit code.' },
  { name: 'sandbox_exec_result', desc: 'Get the result of a background shell command.' },
  { name: 'sandbox_exec_cancel', desc: 'Cancel a running shell command.' },
  { name: 'sandbox_write_file', desc: 'Write a file into the sandbox filesystem at a given path.' },
  { name: 'sandbox_read_file', desc: 'Read the contents of a file from the sandbox filesystem.' },
  { name: 'sandbox_list_files', desc: 'List files at a path inside the sandbox.' },
  { name: 'sandbox_status', desc: 'Get current sandbox state: running, paused, terminated, etc.' },
  { name: 'sandbox_pause', desc: 'Pause billing and execution for an idle sandbox.' },
  { name: 'sandbox_resume', desc: 'Resume a paused sandbox.' },
  { name: 'sandbox_terminate', desc: 'Destroy the sandbox and stop billing.' },
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
        backgroundColor: 'var(--dashboard-bg)',
        border: '0.5px solid var(--dashboard-border)',
        borderRadius: '8px',
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
          color: copied ? 'var(--accent-green)' : 'var(--dashboard-muted)',
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
          color: 'var(--dashboard-text)',
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

export default function DashboardDocsContent() {
  const [active, setActive] = useState<Section>('overview');

  const sectionStyle: React.CSSProperties = {
    display: 'none',
  };
  const activeSectionStyle: React.CSSProperties = {
    display: 'block',
  };

  return (
    <div className="w-full">
      {/* Tab bar within Workspace Dashboard style */}
      <div
        className="mb-8 flex flex-wrap gap-2 border-b-[0.5px] border-[var(--dashboard-border)] pb-3"
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`rounded-lg px-4 py-2 text-xs font-mono uppercase tracking-[0.08em] font-semibold transition-all ${
              active === item.id
                ? 'bg-[var(--dashboard-accent)] text-[var(--dashboard-bg)]'
                : 'border-[0.5px] border-[var(--dashboard-border)] text-[var(--dashboard-text)] hover:border-[var(--dashboard-accent)] hover:text-[var(--dashboard-accent)]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      <div style={active === 'overview' ? activeSectionStyle : sectionStyle}>
        <SectionHeading label="Overview" number="00" />
        <p style={bodyText}>
          Sockt is a compute-on-demand platform built for AI agents. Agents create sandboxes,
          pay per second in sats via Lightning, execute commands, and terminate with no human in the loop.
        </p>
        <p style={bodyText}>
          There are two integration paths: the <span style={mono}>MCP server</span> at{' '}
          <span style={mono}>https://api.sockt.dev/v1/mcp</span> (for LLM agents using tool-use),
          and the <span style={mono}>@sockt/client</span> SDK (for programmatic access from TypeScript, Python, or Go).
        </p>

        <h3 style={h3Style}>Video Walkthrough</h3>
        <div style={{
          position: 'relative',
          paddingBottom: '56.25%', /* 16:9 aspect ratio */
          height: 0,
          overflow: 'hidden',
          borderRadius: '12px',
          border: '0.5px solid var(--dashboard-border)',
          marginTop: '14px',
          marginBottom: '28px',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)'
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
          For credits billing, send <span style={mono}>Authorization: Bearer sockt_...</span>.
          For sats billing, connect any external Lightning wallet as an MCP server and let the agent pay autonomously.
        </p>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Mode</th>
              <th style={thStyle}>Request</th>
              <th style={thStyle}>What happens</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>Credits</td>
              <td style={tdStyle}><span style={mono}>Authorization: Bearer sockt_...</span></td>
              <td style={tdStyle}>Request is billed to your credits balance.</td>
            </tr>
            <tr>
              <td style={tdStyle}>Lightning wallet MCP</td>
              <td style={tdStyle}><span style={mono}>External wallet server connected</span></td>
              <td style={tdStyle}>Agent creates and pays for sandboxes in sats using your connected wallet.</td>
            </tr>
          </tbody>
        </table>
        
        <h3 style={h3Style}>Rate Limits</h3>
        <p style={bodyText}>
          300 requests/minute per API key. Excess requests receive <span style={mono}>429 rate limited</span>.
        </p>
      </div>

      {/* MCP Server Tab */}
      <div style={active === 'mcp' ? activeSectionStyle : sectionStyle}>
        <SectionHeading label="MCP Server" number="01" />
        <p style={bodyText}>
          Configure Sockt in your MCP client by pointing to{' '}
          <span style={mono}>https://api.sockt.dev/v1/mcp</span>.
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
          Add via Settings &gt; Features &gt; MCP Servers, or configure in <span style={mono}>.cursor/mcp.json</span>:
        </p>
        <CodeBlock code={CODE.cursorMcp} />

        <h3 style={h3Style}>External Wallet MCP (Example: lnbot)</h3>
        <p style={bodyText}>
          Sockt does not provide the wallet. Connect any Lightning wallet MCP server for agent payments.
        </p>
        <CodeBlock code={CODE.walletMcp} />

        <h3 style={h3Style}>Available Tools</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
          {MCP_TOOLS.map((tool) => (
            <div
              key={tool.name}
              className="flex flex-col md:flex-row gap-2 md:gap-6 p-4 border-[0.5px] border-[var(--dashboard-border)] rounded-xl bg-[var(--dashboard-card)] items-start"
            >
              <span
                className="font-mono text-xs text-[var(--dashboard-accent)] font-semibold min-w-[200px]"
              >
                {tool.name}
              </span>
              <span className="text-xs text-[var(--dashboard-muted)] leading-relaxed">
                {tool.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SDK Tab */}
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

      {/* API Reference Tab */}
      <div style={active === 'api' ? activeSectionStyle : sectionStyle}>
        <SectionHeading label="API Reference" number="03" />
        <p style={bodyText}>
          For direct HTTP client integrations, Sockt exposes a high-performance REST API.
          All requests must include your API Key in the headers.
        </p>

        <h3 style={h3Style}>Base URL</h3>
        <CodeBlock code="https://api.sockt.dev" />

        <h3 style={h3Style}>Authentication</h3>
        <p style={bodyText}>
          Inject your generated credits API Key in the headers as Bearer authentication.
        </p>
        <CodeBlock code="Authorization: Bearer sockt_live_..." />

        {/* Endpoint 1 */}
        <div style={{ marginTop: '36px', borderTop: '0.5px solid var(--dashboard-border)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              backgroundColor: 'rgba(34, 208, 122, 0.15)',
              color: 'var(--accent-green)',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 600
            }}>POST</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--dashboard-text)' }}>/v1/sandboxes</span>
          </div>
          <p style={bodyText}>Provision a new secure compute sandbox environment.</p>
          <h4 style={{ ...h3Style, fontSize: '0.85rem', marginTop: '14px' }}>Request Body</h4>
          <CodeBlock code={JSON.stringify({ tier: 'micro', billing_method: 'credits' }, null, 2)} />
          <h4 style={{ ...h3Style, fontSize: '0.85rem', marginTop: '14px' }}>Response</h4>
          <CodeBlock code={JSON.stringify({ id: 'sb_9f8a3d2e1c0b', status: 'running', tier: 'micro', created_at: '2026-05-28T12:00:00Z' }, null, 2)} />
        </div>

        {/* Endpoint 2 */}
        <div style={{ marginTop: '36px', borderTop: '0.5px solid var(--dashboard-border)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              backgroundColor: 'rgba(34, 208, 122, 0.15)',
              color: 'var(--accent-green)',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 600
            }}>POST</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--dashboard-text)' }}>/v1/sandboxes/{"{id}"}/exec</span>
          </div>
          <p style={bodyText}>Execute a shell command inside a provisioned sandbox.</p>
          <h4 style={{ ...h3Style, fontSize: '0.85rem', marginTop: '14px' }}>Request Body</h4>
          <CodeBlock code={JSON.stringify({ command: 'python eval.py --dataset cifar10' }, null, 2)} />
          <h4 style={{ ...h3Style, fontSize: '0.85rem', marginTop: '14px' }}>Response</h4>
          <CodeBlock code={JSON.stringify({ stdout: 'Accuracy: 92.4%...\n', stderr: '', exit_code: 0 }, null, 2)} />
        </div>

        {/* Endpoint 3 */}
        <div style={{ marginTop: '36px', borderTop: '0.5px solid var(--dashboard-border)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              backgroundColor: 'rgba(34, 208, 122, 0.15)',
              color: 'var(--accent-green)',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 600
            }}>POST</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--dashboard-text)' }}>/v1/sandboxes/{"{id}"}/files/write</span>
          </div>
          <p style={bodyText}>Write a file to the sandbox filesystem.</p>
          <h4 style={{ ...h3Style, fontSize: '0.85rem', marginTop: '14px' }}>Request Body</h4>
          <CodeBlock code={JSON.stringify({ path: '/workspace/eval.py', content: "print('training model')" }, null, 2)} />
          <h4 style={{ ...h3Style, fontSize: '0.85rem', marginTop: '14px' }}>Response</h4>
          <CodeBlock code={JSON.stringify({ success: true }, null, 2)} />
        </div>

        {/* Endpoint 4 */}
        <div style={{ marginTop: '36px', borderTop: '0.5px solid var(--dashboard-border)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              backgroundColor: 'rgba(194, 122, 54, 0.15)',
              color: 'var(--accent-btc)',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 600
            }}>GET</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--dashboard-text)' }}>/v1/sandboxes/{"{id}"}/files/read?path={"{path}"}</span>
          </div>
          <p style={bodyText}>Read the contents of a file from the sandbox.</p>
          <h4 style={{ ...h3Style, fontSize: '0.85rem', marginTop: '14px' }}>Response</h4>
          <CodeBlock code={JSON.stringify({ content: "print('training model')" }, null, 2)} />
        </div>

        {/* Endpoint 5 */}
        <div style={{ marginTop: '36px', borderTop: '0.5px solid var(--dashboard-border)', paddingTop: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              backgroundColor: 'rgba(229, 62, 62, 0.15)',
              color: 'var(--accent-red)',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 600
            }}>POST</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--dashboard-text)' }}>/v1/sandboxes/{"{id}"}/terminate</span>
          </div>
          <p style={bodyText}>Destroy the sandbox environment and halt all active billing.</p>
          <h4 style={{ ...h3Style, fontSize: '0.85rem', marginTop: '14px' }}>Response</h4>
          <CodeBlock code={JSON.stringify({ success: true }, null, 2)} />
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ label, number }: { label: string; number: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '14px', marginBottom: '24px' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '32px', color: 'var(--dashboard-border)', lineHeight: 1 }}>
        {number}
      </span>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          fontWeight: 700,
          color: 'var(--dashboard-text)',
          lineHeight: 0.95,
          margin: 0,
        }}
      >
        {label}
      </h2>
    </div>
  );
}

const bodyText: React.CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  color: 'var(--dashboard-muted)',
  lineHeight: 1.7,
  marginBottom: '14px',
};

const h3Style: React.CSSProperties = {
  fontFamily: 'var(--font-display)',
  fontSize: '0.95rem',
  fontWeight: 700,
  color: 'var(--dashboard-text)',
  letterSpacing: '0.04em',
  marginTop: '24px',
  marginBottom: '0',
};

const mono: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  color: 'var(--dashboard-text)',
  backgroundColor: 'var(--dashboard-bg)',
  border: '0.5px solid var(--dashboard-border)',
  padding: '1px 5px',
  borderRadius: '3px',
};

const tableStyle: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '14px',
  marginBottom: '28px',
  fontFamily: 'var(--font-body)',
  fontSize: '13px',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 12px',
  borderBottom: '0.5px solid var(--dashboard-border)',
  fontFamily: 'var(--font-mono)',
  fontSize: '9px',
  color: 'var(--dashboard-muted)',
  letterSpacing: '0.08em',
  fontWeight: 400,
};

const tdStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderBottom: '0.5px solid var(--dashboard-border)',
  color: 'var(--dashboard-muted)',
  lineHeight: 1.5,
  verticalAlign: 'top',
};
