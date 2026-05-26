'use client';

import { useState } from 'react';
import Link from 'next/link';
import Nav from '@/components/nav/Nav';

type Section = 'overview' | 'mcp' | 'sdk' | 'sandbox' | 'billing';

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'mcp', label: 'MCP Server' },
  { id: 'sdk', label: 'SDK' },
  // { id: 'sandbox', label: 'Sandbox API' },
  // { id: 'billing', label: 'Billing & Tiers' },
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
  claudeCodeMcp: `claude mcp add sockt https://api.sockt.dev/v1/mcp`,
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
            justifyContent: 'center',
            gap: '6px',
            height: '52px',
          }}
        >
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
            pay per second in sats via Lightning, execute commands, and terminate with no human in the loop.
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

        {/* MCP Server */}
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
        <div style={{ ...(active === 'sdk' ? activeSectionStyle : sectionStyle), position: 'relative' }}>
          <div style={{ filter: 'blur(5px)', pointerEvents: 'none', userSelect: 'none' }}>
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

          {/* Coming Soon Overlay */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--accent-amber)',
                letterSpacing: '0.2em',
                backgroundColor: 'rgba(0,0,0,0.4)',
                padding: '20px 40px',
                borderRadius: '8px',
                border: '1px solid var(--accent-amber)',
                backdropFilter: 'blur(2px)',
                boxShadow: '0 0 40px rgba(194,122,54,0.2)',
              }}
            >
              COMING SOON
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: '44px',
            paddingTop: '24px',
            borderTop: '1px solid var(--bg-border)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.08em',
              marginBottom: '10px',
            }}
          >
            RELATED
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <Link href="/#pricing" style={relatedLinkStyle}>Pricing</Link>
            {/* <Link href="/sdk" style={relatedLinkStyle}>SDK overview</Link> */}
            <Link href="/#use-cases" style={relatedLinkStyle}>Use cases</Link>
            {/* <Link href="/" style={relatedLinkStyle}>Homepage</Link> */}
            <Link href="/terms" style={relatedLinkStyle}>Terms</Link>
            <Link href="/privacy" style={relatedLinkStyle}>Privacy</Link>
          </div>
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

const relatedLinkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-mono)',
  fontSize: '12px',
  color: 'var(--text-secondary)',
  border: '1px solid var(--bg-border)',
  padding: '8px 12px',
  borderRadius: '4px',
  letterSpacing: '0.05em',
};
