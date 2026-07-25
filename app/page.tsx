'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';
import SlackMock from '@/components/sections/SlackMock';
import ArchFlow from '@/components/sections/ArchFlow';
import PageLoader from '@/components/sections/PageLoader';
import WaitlistModal from '@/components/WaitlistModal';
import AmbientBlobs from '@/components/canvas/AmbientBlobs';
import MemoryPulse from '@/components/svg/MemoryPulse';
import Marquee from '@/components/svg/Marquee';
import { useReveal } from '@/hooks/useReveal';

// ─── Tokens ───────────────────────────────────────────────────────────────────
const C = {
  mono:      'var(--font-mono)'      as const,
  body:      'var(--font-body)'      as const,
  headline:  'var(--font-headline)'  as const,
  primary:   'var(--text-primary)'   as const,
  secondary: 'var(--text-secondary)' as const,
  border:    'var(--bg-border)'      as const,
  surface:   'var(--bg-surface)'     as const,
  raised:    'var(--bg-raised)'      as const,
  void:      'var(--bg-void)'        as const,
};

const wrap: React.CSSProperties = { maxWidth: 1400, margin: '0 auto', padding: '0 48px' };
const sep:  React.CSSProperties = { borderTop: `1px solid ${C.border}` };

const label = (color = C.secondary): React.CSSProperties => ({
  fontFamily: C.mono, fontSize: 'var(--mono-micro)', letterSpacing: '0.16em',
  textTransform: 'uppercase', color, marginBottom: 22, display: 'block',
});

// Section headings — Geist at display sizes (≥ 2rem), weight 700
const H2 = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: 'var(--font-headline)', fontSize: 'clamp(2rem, 4vw, 3.8rem)',
  fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.045em',
  color: C.primary, margin: 0, ...extra,
});

// ─── Stats with count-up ──────────────────────────────────────────────────────
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState(value);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !startedRef.current) {
        startedRef.current = true;
        // After a brief delay, show the real value with a character-reveal effect
        let idx = 0;
        const reveal = () => {
          idx++;
          setDisplayed(value.slice(0, idx));
          if (idx < value.length) setTimeout(reveal, 60);
        };
        setTimeout(reveal, 200);
      }
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} style={{ padding: '28px 24px' }}>
      <div style={{
        fontFamily: 'var(--font-subhead)',
        fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
        fontWeight: 700, letterSpacing: '-0.03em',
        color: C.primary, lineHeight: 1, marginBottom: 8,
        fontVariantNumeric: 'tabular-nums',
        minHeight: '1.2em',
      }}>
        {displayed}
      </div>
      <div style={{ fontFamily: C.mono, fontSize: 10, color: C.secondary, letterSpacing: '0.08em' }}>
        {label}
      </div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { v: '< 10 min',    l: 'from signup to swarm live in your channel' },
  { v: '< 2 hrs',     l: 'until your first result lands in the channel' },
  { v: 'Open source', l: 'shared channel — your entire team sees every move' },
];

const CRISES = [
  { n:'01', title:'Steered, not unleashed',  label:'FSM task engine + multi-user oversight',        fix:'Agents follow a fixed checklist and can\'t talk to each other behind your back. Multiple humans can intervene at any step. There\'s no path for a cost loop to form, and no one person is the bottleneck.' },
  { n:'02', title:'Shared memory, shared progress', label:'Persistent memory / GBrain', fix:'Every lesson the swarm learns is saved automatically and visible to everyone. When Alice redirects, Bob benefits. Knowledge compounds across the whole team, not just one person\u2019s DM thread.' },
  { n:'03', title:'Safe to share the channel',   label:'Secret Vault Proxy',     fix:'Credentials are locked in a vault agents never see. You can safely invite your whole team into a channel with AI agents \u2014 compromised agents have nothing to steal, and every action is logged.' },
];

const DEPARTMENTS = [
  { tag:'growth', name:'Growth & Lead Gen',
    desc:'Finds intent signals. Enriches leads. Drafts outreach for approval.',
    roles:['Social Listening Monitor','Lead Researcher','Outbound Specialist'],
    stat:'70–90% automation on first-contact drafting',
    detail:'Everyone in the channel sees leads land in real time — redirect, approve, or escalate from the thread.',
    preview:[
      { a:true,  t:'Found 5 leads from r/SaaS + HN. Top 2 score 91/88. Drafting outreach.' },
      { a:false, t:'Send the top 2. Hold the rest.' },
      { a:true,  t:'\u2713 Sent. 1 held (74). 2 discarded. GBrain updated.' },
    ]},
  { tag:'product', name:'Product Development',
    desc:'Ticket \u2192 spec \u2192 sandboxed execution \u2192 consolidated PR.',
    roles:['Product Architect','Coder Agent','QA Tester'],
    stat:'60–80% automation on junior-to-mid dev tickets',
    detail:'The whole eng team watches PRs materialize — anyone can request a re-review or change priority.',
    preview:[
      { a:true,  t:'Spec for #47 ready. Awaiting approval before writing code.' },
      { a:false, t:'Approved. Skip the refactor in step 3.' },
      { a:true,  t:'\u2713 PR #48 opened. Tests passing. 1 edge case flagged.' },
    ]},
  { tag:'eng ops', name:'Engineering Ops',
    desc:'Error \u2192 commit correlation \u2192 root-cause hypothesis \u2192 runbook update.',
    roles:['Sentry Monitor','Incident Triager','Docs Writer'],
    stat:'< 15 min from alert to root-cause hypothesis',
    detail:'Incident triage visible to the full team — ops, dev, and management all see root-cause analysis as it happens.',
    preview:[
      { a:true,  t:'\uD83D\uDD14 Spike on api/enrich. Correlates with 2:14 AM deploy (#c7a3f8).' },
      { a:true,  t:'Root cause: Apollo rate limit change. Fix queued — approve?' },
      { a:false, t:'Approved.' },
    ]},
];

const OSS_MODULES = [
  { name:'OSS-Orch',   desc:'Hybrid orchestration bridge (Hermes inside OpenClaw)' },
  { name:'OSS-FSM',    desc:'Hierarchical FSM & SQLite task coordination engine' },
  { name:'OSS-Memory', desc:'Local GBrain deduplicator, Git sync, cosine-similarity dedupe at > 0.92' },
  { name:'OSS-CLI',    desc:'Docker-native TUI with onboarding wizard and local model connectors' },
];

// ─── Reveal-wired section components ──────────────────────────────────────────
function CrisesSection() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { selector:'[data-reveal]', stagger:0.14, y:44, duration:0.95 });
  return (
    <section style={{ padding:'96px 0' }}>
      <div style={wrap} ref={ref}>
        <span data-reveal style={label()}>The Trust Layer</span>
        <h2 data-reveal style={{ ...H2(), marginBottom:56, maxWidth:'22ch' }}>
          Multiplayer only works with trust. We built the framework.
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:1 }}>
          {CRISES.map((c) => (
            <div key={c.n} data-reveal style={{ border:`1px solid ${C.border}`, borderTop:`1px solid var(--border-top-highlight)`, background:C.surface, padding:'36px 32px', position:'relative', borderRadius:'var(--radius-card)' }}>
              <div style={{ fontFamily:C.mono, fontSize:56, fontWeight:400, color:'#1D1D22', lineHeight:1, position:'absolute', top:24, right:28, letterSpacing:'-0.04em', userSelect:'none' }}>
                {c.n}
              </div>
              <div style={{ fontFamily:'var(--font-subhead)', fontSize:'1.3rem', fontWeight:700, color:C.primary, marginBottom:10, letterSpacing:'-0.025em', lineHeight:1.2, paddingRight:'56px' }}>{c.title}</div>
              <div style={{ fontFamily:C.mono, fontSize:9, color:'#44444B', letterSpacing:'0.12em', textTransform:'uppercase', border:`1px solid ${C.border}`, display:'inline-block', padding:'2px 7px', borderRadius:3, marginBottom:14 }}>{c.label}</div>
              <div style={{ fontFamily:C.mono, fontSize:11, color:'#6D6D78', lineHeight:1.6 }}>
                {c.fix}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DepartmentsSection() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { selector:'[data-reveal]', stagger:0.13, y:40, duration:0.9 });
  return (
    <section style={{ ...sep, padding:'64px 0' }}>
      <div style={wrap} ref={ref}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:20, flexWrap:'wrap', marginBottom:24 }}>
          <div>
            <span data-reveal style={{ ...label(), marginBottom: 4 }}>Departments</span>
            <h2 data-reveal style={H2()}>Pick a swarm. Invite your team. Start steering.</h2>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:12 }}>
          {DEPARTMENTS.map((dept) => (
            <article key={dept.name} data-reveal className="dept-card"
              style={{ border:`1px solid ${C.border}`, borderTop:`1px solid var(--border-top-highlight)`, background:C.surface, borderRadius:'var(--radius-card)', overflow:'hidden', display:'flex', flexDirection:'column', position:'relative' }}>
              <div style={{ padding:'24px 24px 16px' }}>
                <div style={{ fontFamily:C.mono, fontSize:9, color:C.secondary, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:12, border:`1px solid ${C.border}`, display:'inline-block', padding:'3px 8px', borderRadius:4 }}>{dept.tag}</div>
                <h3 style={{ fontFamily:'var(--font-subhead)', fontSize:'1.25rem', fontWeight:700, letterSpacing:'-0.025em', color:C.primary, margin:'0 0 10px' }}>{dept.name}</h3>
                <p style={{ fontFamily:C.body, fontSize:13.5, color:C.secondary, lineHeight:1.62, margin:'0 0 14px' }}>{dept.desc}</p>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {dept.roles.map((r) => (
                    <span key={r} style={{ fontFamily:C.mono, fontSize:9, color:'#6D6D78', background:C.raised, border:`1px solid ${C.border}`, borderRadius:4, padding:'3px 8px', letterSpacing:'0.06em' }}>{r}</span>
                  ))}
                </div>
              </div>
              <div style={{ margin:'0 12px 12px', borderRadius:10, background:'#16181C', border:'1px solid #222428', padding:'12px 14px', flex:1 }}>
                {dept.preview.map((m, i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom:i < dept.preview.length-1 ? 8 : 0 }}>
                    <div style={{ width:18, height:18, borderRadius:4, background:m.a?'#242428':'#2A2A2F', border:`1px solid ${m.a?'#38383E':'#2A2A2F'}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:C.mono, fontSize:7, color:m.a?'#A09D98':'#6D6D78', flexShrink:0, marginTop:1 }}>{m.a?'✦':'U'}</div>
                    <span style={{ fontFamily:C.body, fontSize:11.5, color:'#A09D98', lineHeight:1.45 }}>{m.t}</span>
                  </div>
                ))}
              </div>
              {/* Hover reveal */}
              <div className="dept-hover-reveal" style={{ padding:'0 24px 20px', borderTop:`1px solid ${C.border}`, paddingTop:16 }}>
                <div style={{ fontFamily:C.mono, fontSize:10, color:'var(--accent-brass)', letterSpacing:'0.08em', marginBottom:4 }}>↗ {dept.stat}</div>
                <div style={{ fontFamily:C.body, fontSize:12, color:C.secondary, lineHeight:1.5 }}>{dept.detail}</div>
              </div>
              <div className="dept-stat-static" style={{ padding:'10px 24px 18px', fontFamily:C.mono, fontSize:10, color:'var(--accent-brass)', letterSpacing:'0.08em', opacity:0.6 }}>↗ {dept.stat}</div>
            </article>
          ))}
        </div>

        {/* Coming soon */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:12, marginTop:12 }}>
          {[['Marketing Content','Q3 2026'],['Customer Success','Q4 2026']].map(([name,when]) => (
            <div key={name} data-reveal style={{ border:`1px dashed ${C.border}`, borderRadius:14, padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
              <span style={{ fontFamily:'var(--font-subhead)', fontSize:'1rem', color:C.secondary }}>{name}</span>
              <span style={{ fontFamily:C.mono, fontSize:9, color:'#44444B', border:`1px solid ${C.border}`, borderRadius:4, padding:'3px 8px', letterSpacing:'0.1em' }}>{when}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`.dept-card:hover .dept-stat-static { opacity:0; } .dept-card:hover .dept-hover-reveal { display:block; }`}</style>
    </section>
  );
}

function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { selector:'[data-reveal]', stagger:0.1, y:32, duration:0.88 });
  return (
    <section style={{ ...sep, padding:'96px 0', background:C.surface }}>
      <div style={wrap} ref={ref}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'6vw', alignItems:'start' }}>
          <div>
            <span data-reveal style={label()}>Setup</span>
            <h2 data-reveal style={{ ...H2(), marginBottom:40 }}>Live in Slack in under 10 minutes.</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
              {['Connect Slack','Pick a swarm','Invite your team','Seed memory','Swarm activates — shared channel goes live'].map((title,i,arr) => (
                <div key={title} data-reveal>
                  <div style={{ display:'flex', gap:0 }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:32, flexShrink:0 }}>
                      <div style={{ width:24, height:24, borderRadius:'50%', border:`1px solid ${C.border}`, background:C.raised, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:C.mono, fontSize:9, color:C.secondary, flexShrink:0 }}>{String(i+1).padStart(2,'0')}</div>
                      {i < arr.length-1 && <div style={{ width:1, flex:1, minHeight:16, background:C.border }} />}
                    </div>
                    <div style={{ paddingLeft:14, paddingBottom:18 }}>
                      <div style={{ fontFamily:'var(--font-subhead)', fontSize:'1rem', fontWeight:600, color:C.primary, paddingTop:3 }}>{title}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span data-reveal style={label()}>Architecture</span>
            <div data-reveal style={{ marginBottom:28 }}><ArchFlow /></div>
            <div style={{ marginTop:28, display:'flex', flexDirection:'column', gap:1 }}>
              {[{ layer:'Execution', body:'Plan→Act→Observe→Reflect · TEE-isolated · your LLM key' },
                { layer:'Coordination', body:'FSM task list · no horizontal messaging · every action logged' },
                { layer:'Shared Context', body:'Channel-aware · multi-user steering · everyone sees the board' },
                { layer:'Memory', body:'GBrain · Git-backed · diff-able · rollback in < 60s' },
              ].map((item) => (
                <div key={item.layer} data-reveal style={{ border:`1px solid ${C.border}`, padding:'14px 18px', background:C.raised, display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{ fontFamily:C.mono, fontSize:10, color:C.primary, letterSpacing:'0.1em', textTransform:'uppercase', flexShrink:0, minWidth:114 }}>{item.layer}</div>
                  <div style={{ fontFamily:C.mono, fontSize:11, color:C.secondary }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SecuritySection() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { selector:'[data-reveal]', stagger:0.1, y:32, duration:0.85 });
  return (
    <section style={{ ...sep, padding:'96px 0' }}>
      <div style={wrap} ref={ref}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'6vw', alignItems:'start' }}>
          <div>
            <span data-reveal style={label()}>Bring Your Own Key</span>
            <h2 data-reveal style={{ ...H2(), marginBottom:28 }}>The platform. You bring the key. Your team brings the direction.</h2>
            <div data-reveal style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {['Anthropic (Claude) — recommended','OpenAI (GPT-4o, GPT-4o-mini)','Azure OpenAI','Google Gemini','Ollama · vLLM · LM Studio (local)'].map((p) => (
                <div key={p} style={{ display:'flex', alignItems:'center', gap:10, fontFamily:C.mono, fontSize:11, color:C.secondary }}>
                  <span style={{ color:'#22D07A', flexShrink:0 }}>✓</span>{p}
                </div>
              ))}
            </div>
          </div>
          <div>
            <span data-reveal style={label()}>Security Architecture</span>
            <h2 data-reveal style={{ ...H2(), marginBottom:28 }}>Safe enough to invite the whole team.</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
              {[{ layer:'TEE Isolation',     body:'Your agents run in hardware-isolated containers — even Sockt staff cannot inspect a running deployment.' },
                { layer:'Secret Vault',      body:'API keys stay locked away. Agents can use them but never see them — so a compromised agent has nothing to steal.' },
                { layer:'Egress Allowlist',  body:'You control exactly which external services your agents can reach. If a new attack pattern appears, every deployment is patched within 60 minutes.' },
                { layer:'HITL Gates',        body:'Every action your agents can take is classified: auto-approved, needs your sign-off, or permanently blocked. Multiple humans can approve or reject — no single point of failure, no bottleneck.' },
              ].map((item) => (
                <div key={item.layer} data-reveal style={{ border:`1px solid ${C.border}`, borderLeft:`2px solid var(--accent-brass)`, borderTop:`1px solid var(--border-top-highlight)`, padding:'14px 18px', background:C.raised }}>
                  <div style={{ fontFamily:C.mono, fontSize:10, color:C.primary, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:5 }}>{item.layer}</div>
                  <div style={{ fontSize:12, color:C.secondary, lineHeight:1.5 }}>{item.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FleetSection() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { selector:'[data-reveal]', stagger:0.1, y:36, duration:0.9 });
  return (
    <section style={{ ...sep, padding:'96px 0', background:C.surface }}>
      <div style={wrap} ref={ref}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'6vw', alignItems:'center' }}>
          <div>
            <span data-reveal style={label()}>Fleet Intelligence</span>
            <h2 data-reveal style={{ ...H2(), marginBottom:16 }}>The fleet learns. Your swarm benefits.</h2>
            <p data-reveal style={{ fontFamily:C.body, fontSize:'1rem', lineHeight:1.6, color:C.secondary, margin:0, maxWidth:'38ch' }}>Every swarm in every channel contributes anonymized patterns. When a new attack vector or API change is detected anywhere, every deployment is patched. Your team&apos;s swarm gets smarter because hundreds of others are running — no customer data is shared or pooled.</p>
          </div>
          <div>
            <div data-reveal style={{ display:'flex', justifyContent:'center', marginBottom:32, opacity:0.75 }}>
              <MemoryPulse size={180} />
            </div>
            <div data-reveal style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1 }}>
              {[{ n:'< 60 min',    l:'Detection to fleet-wide protection — same fix, every customer' },
                { n:'< 2 hrs',    l:'API change detected before your cron fails' },
                { n:'60–75%',     l:'Token cost reduction by month 3 (compiled skills)' },
                { n:'200+ teams', l:'Fleet data advantage over any single-deployment tool' },
              ].map((item) => (
                <div key={item.l} style={{ border:`1px solid ${C.border}`, padding:'20px 18px', background:C.raised }}>
                  <div style={{ fontFamily:'var(--font-subhead)', fontSize:'clamp(1.1rem, 3vw, 1.6rem)', fontWeight:700, letterSpacing:'-0.03em', color:C.primary, lineHeight:1, marginBottom:8 }}>{item.n}</div>
                  <div style={{ fontFamily:C.mono, fontSize:10, color:C.secondary, letterSpacing:'0.06em', lineHeight:1.5 }}>{item.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ComingSoonSection() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { selector:'[data-reveal]', stagger:0.1, y:32, duration:0.9 });
  return (
    <section style={{ ...sep, padding:'160px 0', textAlign:'center' }}>
      <div style={wrap} ref={ref}>
        <div style={{ maxWidth:640, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
          <span data-reveal style={label()}>Pricing</span>
          <h2 data-reveal style={{
            fontFamily:'var(--font-headline)', fontSize:'clamp(3rem, 7vw, 7rem)',
            lineHeight:0.92, letterSpacing:'-0.04em', margin:0,
          }}>
            <span style={{ display:'block', fontWeight:800, color:C.primary }}>Coming</span>
            <span style={{ display:'block', fontWeight:200, color:C.secondary }}>soon.</span>
          </h2>
            <p data-reveal style={{ fontFamily:C.body, fontSize:'1.05rem', lineHeight:1.6, color:C.secondary, maxWidth:'42ch', margin:0 }}>
              We&apos;re finalising pricing. Community Edition stays free and open-core — invite a swarm into a private channel today.
            </p>
          <a data-reveal href="https://github.com/sockt-dev/sockt" target="_blank" rel="noopener noreferrer"
            style={{ fontFamily:C.mono, fontSize:'var(--mono-body)', color:C.primary, border:`1px solid ${C.border}`, borderRadius:'var(--radius-btn)', padding:'11px 26px', letterSpacing:'0.08em', display:'inline-block', marginTop:8, transition:'border-color 0.12s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor='#3A3A42'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor=C.border; }}>
            GITHUB →
          </a>
        </div>
      </div>
    </section>
  );
}

function OpenSourceSection() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { selector:'[data-reveal]', stagger:0.1, y:32, duration:0.88 });
  return (
    <section style={{ ...sep, padding:'96px 0', background:C.surface }}>
      <div style={wrap} ref={ref}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'6vw', alignItems:'start' }}>
          <div>
            <span data-reveal style={label()}>Open-Core</span>
            <h2 data-reveal style={{ ...H2(), marginBottom:20 }}>Nothing hidden. Check the code yourself.</h2>
            <p data-reveal style={{ fontFamily:C.body, fontSize:'1rem', lineHeight:1.6, color:C.secondary, marginBottom:28 }}>
              The FSM engine, memory layer, and orchestration core are all open-source. Your team&apos;s shared command center runs on infrastructure they can inspect down to the last commit. Community Edition is free forever; you&apos;re never locked in.
            </p>
            <div data-reveal style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <a href="https://github.com/MMEHDI0606/sockt" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily:C.mono, fontSize:'var(--mono-body)', color:C.primary, border:`1px solid ${C.border}`, borderRadius:'var(--radius-btn)', padding:'9px 20px', letterSpacing:'0.08em', display:'inline-block', transition:'border-color 0.12s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor='#3A3A42'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor=C.border; }}>GITHUB →</a>
              <Link href="/docs"
                style={{ fontFamily:C.mono, fontSize:'var(--mono-body)', color:C.secondary, border:`1px solid ${C.border}`, borderRadius:'var(--radius-btn)', padding:'9px 20px', letterSpacing:'0.08em', display:'inline-block', transition:'color 0.12s ease, border-color 0.12s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.color=C.primary; e.currentTarget.style.borderColor='#3A3A42'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color=C.secondary; e.currentTarget.style.borderColor=C.border; }}>DOCS</Link>
            </div>
          </div>
          <div>
            <div data-reveal style={{ display:'flex', flexDirection:'column', gap:1 }}>
              {OSS_MODULES.map((m) => (
                <div key={m.name} style={{ display:'flex', border:`1px solid ${C.border}`, background:C.raised }}>
                  <div style={{ fontFamily:C.mono, fontSize:10, color:C.primary, letterSpacing:'0.06em', padding:'14px 16px', borderRight:`1px solid ${C.border}`, minWidth:104, flexShrink:0, display:'flex', alignItems:'center' }}>{m.name}</div>
                  <div style={{ padding:'14px 16px', fontSize:13, color:C.secondary, lineHeight:1.5 }}>{m.desc}</div>
                </div>
              ))}
              <div style={{ padding:'10px 16px', fontFamily:C.mono, fontSize:9, color:'#44444B', letterSpacing:'0.1em', border:`1px solid ${C.border}`, borderTop:'none' }}>
                FSL-1.1-MIT → MIT AFTER 2 YEARS
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const [showWaitlist, setShowWaitlist] = useState(false);

  useEffect(() => {
    const s = createClient();
    s.auth.getUser().then(({ data }) => { if (data.user) router.replace('/dashboard'); });
  }, [router]);

  return (
    <>
      <PageLoader />
      <Nav />
      <WaitlistModal open={showWaitlist} onClose={() => setShowWaitlist(false)} />
      <main style={{ color:C.primary, background:C.void, overflowX:'hidden' }}>

        {/* ── HERO ── */}
        <section style={{ minHeight:'76vh', display:'flex', alignItems:'center', paddingTop:96, paddingBottom:80 }}>
          <div style={{ ...wrap, width:'100%' }}>
            <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'minmax(0,1.1fr) minmax(0,0.9fr)', gap:'4vw', alignItems:'center' }}>

              {/* Left — direct, immediate, un-precious */}
              <div>
                <span style={{ ...label(), marginBottom:20, fontSize:11 }}>Collaborative AI Operations</span>
                <h1 className="hero-h1" style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: 'clamp(2.8rem, 5.2vw, 6rem)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.04em',
                  margin: '0 0 28px',
                }}>
                  <span style={{ display: 'block', fontWeight: 800, color: C.primary }}>
                    <em style={{ fontFamily: 'var(--font-serif-accent)', fontWeight: 300, fontStyle: 'italic', color: 'var(--accent-brass)' }}>AI</em>
                    {' '}that works
                  </span>
                  <span style={{ display: 'block', fontWeight: 200, color: C.secondary }}>
                    with your team.
                  </span>
                </h1>
                <p style={{ fontFamily:C.body, fontSize:'1.15rem', lineHeight:1.65, color:C.secondary, maxWidth:'40ch', marginBottom:36 }}>
                  Invite a Sockt swarm into a shared Slack channel. Everyone on your team — engineering, growth, product — can see what&apos;s happening, steer the agents, and watch the work compound. No babysitting, no black boxes.
                </p>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:36 }}>
                  <Link href="/install"
                    style={{ background:C.primary, color:C.void, padding:'13px 28px', borderRadius:'var(--radius-btn)', fontFamily:C.mono, fontSize:'var(--mono-cta)', fontWeight:700, letterSpacing:'0.06em', display:'inline-block', transition:'background 0.12s ease', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.18)' }}
                    onMouseEnter={(e)=>{ e.currentTarget.style.background='#FFFFFF'; }}
                    onMouseLeave={(e)=>{ e.currentTarget.style.background=C.primary; }}>INSTALL</Link>
                  <a href="https://github.com/sockt-dev/sockt" target="_blank" rel="noopener noreferrer"
                    style={{ border:`1px solid ${C.border}`, color:C.secondary, padding:'12px 26px', borderRadius:'var(--radius-btn)', fontFamily:C.mono, fontSize:'var(--mono-cta)', letterSpacing:'0.06em', display:'inline-block', transition:'color 0.12s ease, border-color 0.12s ease' }}
                    onMouseEnter={(e)=>{ e.currentTarget.style.color=C.primary; e.currentTarget.style.borderColor='#3A3A42'; }}
                    onMouseLeave={(e)=>{ e.currentTarget.style.color=C.secondary; e.currentTarget.style.borderColor=C.border; }}>VIEW ON GITHUB</a>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {['Works in a shared Slack channel — your whole team witnesses and steers','Use your own LLM key — pay your provider directly, we take zero margin','Open-core and free — the entire safety layer is inspectable on GitHub'].map((t) => (
                    <div key={t} style={{ fontFamily:C.mono, fontSize:11, color:'#44444B', letterSpacing:'0.1em', display:'flex', alignItems:'center', gap:8 }}>
                      <span style={{ width:3, height:3, borderRadius:'50%', background:'#44444B', flexShrink:0, display:'inline-block' }} />
                      {t}
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Slack mock with ambient glow corona */}
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <SlackMock glow />
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP — character-reveal on scroll ── */}
        <div style={{ borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, background:C.surface }}>
          <div style={wrap}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:0 }}>
              {STATS.map((s, i) => (
                <div key={s.l} style={{ borderRight:i < STATS.length-1 ? `1px solid ${C.border}` : 'none' }}>
                  <AnimatedStat value={s.v} label={s.l} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── MARQUEE — horizontal scrolling technical vocabulary (textural separator) ── */}
        <Marquee />

        {/* ── CHANNEL AS COMMAND CENTER ── */}
        <section style={{ ...sep, padding:'96px 0', background:C.surface }}>
          <div style={wrap}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'6vw', alignItems:'center' }}>
              <div>
                <span style={label()}>The Channel IS the Command Center</span>
                <h2 style={{ ...H2(), marginBottom:24 }}>No separate dashboard to check. No hidden DMs.</h2>
                <p style={{ fontFamily:C.body, fontSize:'1rem', lineHeight:1.68, color:C.secondary, marginBottom:20 }}>
                  Every task, every result, every approval request lives in a shared Slack channel. Your team watches the swarm work — and steers it — right from where they already are.
                </p>
                <p style={{ fontFamily:C.mono, fontSize:11, color:'#44444B', letterSpacing:'0.08em', lineHeight:1.6 }}>
                  No &ldquo;what&apos;s the agent doing right now?&rdquo; anxiety. No single-person bottleneck.
                  Transparency is built into the channel, not bolted on as a dashboard.
                </p>
              </div>
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <SlackMock glow />
              </div>
            </div>
          </div>
        </section>

        {/* ── PROOF SECTIONS — Moranta "emerge from darkness" ── */}
        <DepartmentsSection />
        <CrisesSection />
        <HowItWorksSection />
        <SecuritySection />
        <FleetSection />
        <OpenSourceSection />
        <ComingSoonSection />

        {/* ── FINAL CTA — fast / clear / ambient glow ── */}
        <section style={{ ...sep, padding:'160px 0', background:C.surface, textAlign:'center', position:'relative', overflow:'hidden' }}>
          <AmbientBlobs variant="cta" />
          <div style={{ ...wrap, position:'relative', zIndex:1 }}>
            <div style={{ maxWidth:600, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:24 }}>
              <h2 style={{ fontFamily:'var(--font-headline)', fontSize:'clamp(2.4rem, 6vw, 5.5rem)', fontWeight:800, letterSpacing:'-0.045em', lineHeight:1.0, color:C.primary, margin:0 }}>
                Your team. Your{' '}
                <em style={{ fontFamily:'var(--font-serif-accent)', fontWeight:300, fontStyle:'italic', color:'var(--accent-brass)' }}>swarm</em>
                . One shared channel.
              </h2>
              <p style={{ fontFamily:C.mono, fontSize:'var(--mono-body)', color:C.secondary, letterSpacing:'0.06em', margin:0 }}>
                Invite a swarm today. Your whole team watches it start working in under 10 minutes.
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <Link href="/install"
                  style={{ background:C.primary, color:C.void, padding:'15px 40px', borderRadius:'var(--radius-btn)', fontFamily:C.mono, fontSize:'var(--mono-cta)', fontWeight:700, letterSpacing:'0.08em', display:'inline-block', marginTop:8, transition:'background 0.12s ease', boxShadow:'inset 0 1px 0 rgba(255,255,255,0.18)' }}
                  onMouseEnter={(e)=>{ e.currentTarget.style.background='#FFFFFF'; }}
                  onMouseLeave={(e)=>{ e.currentTarget.style.background=C.primary; }}>
                  INSTALL
                </Link>
                <a href="https://github.com/sockt-dev/sockt" target="_blank" rel="noopener noreferrer"
                  style={{ border:`1px solid ${C.border}`, color:C.secondary, padding:'13px 38px', borderRadius:'var(--radius-btn)', fontFamily:C.mono, fontSize:'var(--mono-cta)', letterSpacing:'0.08em', display:'inline-block', marginTop:8, transition:'color 0.12s ease, border-color 0.12s ease' }}
                  onMouseEnter={(e)=>{ e.currentTarget.style.color=C.primary; e.currentTarget.style.borderColor='#3A3A42'; }}
                  onMouseLeave={(e)=>{ e.currentTarget.style.color=C.secondary; e.currentTarget.style.borderColor=C.border; }}>
                  VIEW ON GITHUB
                </a>
              </div>
              <p style={{ fontFamily:C.mono, fontSize:10, color:'#44444B', margin:0, letterSpacing:'0.1em' }}>
                COMMUNITY EDITION IS FREE · PAID PLANS AVAILABLE
              </p>
              <p style={{ fontFamily:C.body, fontSize:'0.85rem', color:'#44444B', margin:0, lineHeight:1.5 }}>
                Takes about 10 minutes. Deploy a swarm into a channel, invite your team, and watch them compound together.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      <style>{`
        @media (max-width: 720px) { .hero-grid { grid-template-columns: 1fr !important; } }
        /* Tighter stack for the two-line weight-contrast hero — the sitewide
           110% line-height rule (globals.css) reads as too loose at this
           display size, so it's overridden here specifically. */
        /* Target the h1 AND its child spans — the global "* { line-height }"
           rule sets line-height directly on the spans (not inherited),
           which otherwise wins over any rule set only on the parent h1. */
        .hero-h1, .hero-h1 * { line-height: 0.65 !important; }
      `}</style>
    </>
  );
}
