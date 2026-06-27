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
import NeuralField from '@/components/canvas/NeuralField';
import AmbientBlobs from '@/components/canvas/AmbientBlobs';
import SwarmOrbit from '@/components/svg/SwarmOrbit';
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

const wrap: React.CSSProperties = { maxWidth: 1160, margin: '0 auto', padding: '0 28px' };
const sep:  React.CSSProperties = { borderTop: `1px solid ${C.border}` };

const label = (color = C.secondary): React.CSSProperties => ({
  fontFamily: C.mono, fontSize: 10, letterSpacing: '0.18em',
  textTransform: 'uppercase', color, marginBottom: 22, display: 'block',
});

const H2 = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: C.headline, fontSize: 'clamp(2rem, 4vw, 3.8rem)',
  fontWeight: 700, lineHeight: 1.04, letterSpacing: '-0.03em',
  color: C.primary, margin: 0, ...extra,
});

// ─── Stats with count-up ──────────────────────────────────────────────────────
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState('—');
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
        fontFamily: C.headline,
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
  { v: '< 10 min', l: 'sign-up to active swarm' },
  { v: '< 2 hrs',  l: 'first enriched output' },
  { v: '60–75%',   l: 'token cost reduction (month 3)' },
  { v: 'N=∞',      l: 'fleet intelligence vs. self-hosted N=1' },
];

const CRISES = [
  { n:'01', title:'Runaway cost loops',
    body:'Two agents in a shared workspace with no structural coordination fall into open-ended peer-to-peer messaging. Token spend reaches $200–$3,000 before a manual cap fires — which kills the agent, not the loop.',
    fix:'Hierarchical FSM + SQLite task list. Every agent interaction is discrete, locked, auditable. Horizontal messaging is structurally impossible. Loops cannot form.' },
  { n:'02', title:'Amnesiac background jobs',
    body:"Hermes Agent's cron scheduler hardcodes skip_memory=True to prevent background prompts contaminating session history. What an agent learns at 2 AM disappears before the 8 AM run.",
    fix:"CADVP daemon. Background agents write to an isolated JSONL stream on disk. A host-layer monitor commits verified outputs to GBrain — foreground history stays clean." },
  { n:'03', title:'Credential leakage via injection',
    body:'Agents holding raw API keys in their active context are trivially exploitable. A malicious string in any processed content — a Slack message, a GitHub issue, a webpage — can exfiltrate credentials to an attacker.',
    fix:'OneCLI Secret Vault Proxy. Credentials live in a host-layer vault, never in agent scope. Agents hold placeholders; the proxy injects real keys at the network layer. A fully-compromised agent has nothing to exfiltrate.' },
];

const DEPARTMENTS = [
  { tag:'growth', name:'Growth & Lead Gen',
    desc:'Finds buying-intent signals on Reddit, HN, LinkedIn. Enriches leads, drafts hyper-personalized outreach for approval.',
    roles:['Social Listening Monitor','Lead Researcher','Outbound Specialist'],
    stat:'70–90% automation on first-contact drafting',
    detail:'First enriched lead list: within 2 hours of activation.',
    preview:[
      { a:true,  t:'Found 5 leads from r/SaaS + HN. Top 2 score 91/88. Drafting outreach.' },
      { a:false, t:'Send the top 2. Hold the rest.' },
      { a:true,  t:'✓ Sent. 1 held (74). 2 discarded. GBrain updated.' },
    ]},
  { tag:'product', name:'Product Development',
    desc:'Turns a ticket into a structured spec, executes approved steps in an isolated sandbox, runs tests, returns a consolidated PR.',
    roles:['Product Architect','Coder Agent','QA Tester'],
    stat:'60–80% automation on junior-to-mid dev tickets',
    detail:'Spec-gated execution prevents "write code first, think later" retry loops.',
    preview:[
      { a:true,  t:'Spec for #47 ready. Awaiting approval before writing code.' },
      { a:false, t:'Approved. Skip the refactor in step 3.' },
      { a:true,  t:'✓ PR #48 opened. Tests passing. 1 edge case flagged.' },
    ]},
  { tag:'eng ops', name:'Engineering Ops',
    desc:'Catches Sentry errors, correlates with recent commits, produces a root-cause hypothesis, and self-documents resolutions.',
    roles:['Sentry Monitor','Incident Triager','Docs Writer'],
    stat:'< 15 min from alert to root-cause hypothesis',
    detail:'Every resolved incident is committed to GBrain — the next triage is faster.',
    preview:[
      { a:true,  t:'🔔 Spike on api/enrich. Correlates with 2:14 AM deploy (#c7a3f8).' },
      { a:true,  t:'Root cause: Apollo rate limit change. Fix queued — approve?' },
      { a:false, t:'Approved.' },
    ]},
];

const TIERS = [
  { name:'Community', price:'Free',  note:'+ LLM costs',      badge:null,           detail:'Self-host on a $20 VPS. Full FSM + CADVP + GBrain + CLI.',                           features:['Full FSM loop prevention','CADVP memory protocol','All 3 departments','Unlimited GBrain (local)'] },
  { name:'Starter',   price:'$69',   note:'/mo + LLM',        badge:null,           detail:'Managed hosting, zero Docker. Ideal for non-technical founders.',                     features:['No Docker needed','1 department','90-day retention','Email support'] },
  { name:'Professional',price:'$149',note:'/mo + LLM',        badge:'Most popular', detail:'Fleet intelligence makes your agents smarter from collective deployment data.',        features:['Fleet intelligence','Threat feed < 60 min','2 departments','Weekly Dream-Cycle'] },
  { name:'Business',  price:'$399',  note:'/mo + LLM',        badge:null,           detail:'SOC 2 Type II inheritance — at a fraction of a $50K+ independent audit cost.',       features:['SOC 2 Type II','SSO / SCIM','3 departments','Nightly optimization'] },
  { name:'Agency',    price:'$249',  note:'/mo + $39/client', badge:null,           detail:'Per-client pricing aligns your cost with value delivered, not seats filled.',         features:['Multi-workspace','Cross-client skills','Agent federation','Unlimited staff seats'] },
  { name:'Enterprise',price:'$799',  note:'/mo + LLM',        badge:null,           detail:'Dedicated single-tenant TEE. HIPAA BAA. 99.5% SLA with financial credits.',          features:['Dedicated TEE','HIPAA BAA','99.5% SLA credits','Private skill marketplace'] },
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
        <span data-reveal style={label()}>Why this exists</span>
        <h2 data-reveal style={{ ...H2(), marginBottom:56, maxWidth:'22ch' }}>
          The three production failures that end AI deployments.
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:1 }}>
          {CRISES.map((c) => (
            <div key={c.n} data-reveal style={{ border:`1px solid ${C.border}`, background:C.surface, padding:'36px 32px', position:'relative' }}>
              <div style={{ fontFamily:C.mono, fontSize:56, fontWeight:400, color:'#1D1D22', lineHeight:1, position:'absolute', top:24, right:28, letterSpacing:'-0.04em', userSelect:'none' }}>
                {c.n}
              </div>
              <div style={{ fontFamily:C.headline, fontSize:'1.3rem', fontWeight:700, color:C.primary, marginBottom:14, letterSpacing:'-0.025em', lineHeight:1.2 }}>{c.title}</div>
              <p style={{ fontFamily:C.body, fontSize:14, color:C.secondary, lineHeight:1.72, marginBottom:24 }}>{c.body}</p>
              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:20, fontFamily:C.mono, fontSize:11, color:'#6D6D78', lineHeight:1.6 }}>
                <span style={{ color:C.primary, marginRight:8 }}>FIX ›</span>{c.fix}
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
    <section style={{ ...sep, padding:'96px 0' }}>
      <div style={wrap} ref={ref}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:20, flexWrap:'wrap', marginBottom:48 }}>
          <div>
            <span data-reveal style={label()}>Departments</span>
            <h2 data-reveal style={H2()}>Preconfigured for real workflows.</h2>
          </div>
          {/* SwarmOrbit — the animated GIF moment for this section */}
          <div data-reveal style={{ opacity:0.7 }}>
            <SwarmOrbit size={200} />
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:12 }}>
          {DEPARTMENTS.map((dept) => (
            <article key={dept.name} data-reveal className="dept-card"
              style={{ border:`1px solid ${C.border}`, background:C.surface, borderRadius:16, overflow:'hidden', display:'flex', flexDirection:'column', position:'relative' }}>
              <div style={{ padding:'24px 24px 16px' }}>
                <div style={{ fontFamily:C.mono, fontSize:9, color:C.secondary, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:12, border:`1px solid ${C.border}`, display:'inline-block', padding:'3px 8px', borderRadius:4 }}>{dept.tag}</div>
                <h3 style={{ fontFamily:C.headline, fontSize:'1.25rem', fontWeight:700, letterSpacing:'-0.025em', color:C.primary, margin:'0 0 10px' }}>{dept.name}</h3>
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
                <div style={{ fontFamily:C.mono, fontSize:10, color:C.primary, letterSpacing:'0.08em', marginBottom:4 }}>↗ {dept.stat}</div>
                <div style={{ fontFamily:C.body, fontSize:12, color:C.secondary, lineHeight:1.5 }}>{dept.detail}</div>
              </div>
              <div className="dept-stat-static" style={{ padding:'10px 24px 18px', fontFamily:C.mono, fontSize:10, color:'#46464E', letterSpacing:'0.08em' }}>↗ {dept.stat}</div>
            </article>
          ))}
        </div>

        {/* Coming soon */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:12, marginTop:12 }}>
          {[['Marketing Content','Q3 2026'],['Customer Success','Q4 2026']].map(([name,when]) => (
            <div key={name} data-reveal style={{ border:`1px dashed ${C.border}`, borderRadius:14, padding:'18px 22px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
              <span style={{ fontFamily:C.headline, fontSize:'1rem', color:C.secondary }}>{name}</span>
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
              {[['Connect Slack','OAuth into your workspace. Permission scopes are minimal and listed in plain English.'],
                ['Pick a department','Growth, Product Dev, or Eng Ops — each is a fully preconfigured multi-agent team.'],
                ['Seed memory','5 questions. Seeds GBrain with your ICP, offer, channels to watch, and approval rules.'],
                ['Bring your own key','Anthropic, OpenAI, Azure, Gemini, or self-hosted. Your bill, your rates, zero markup.'],
                ['Swarm activates','Agents DM you in Slack. First real output — leads, PR, or incident triage — within 2 hours.'],
              ].map(([title,body],i,arr) => (
                <div key={title} data-reveal>
                  <div style={{ display:'flex', gap:0 }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', width:32, flexShrink:0 }}>
                      <div style={{ width:24, height:24, borderRadius:'50%', border:`1px solid ${C.border}`, background:C.raised, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:C.mono, fontSize:9, color:C.secondary, flexShrink:0 }}>{String(i+1).padStart(2,'0')}</div>
                      {i < arr.length-1 && <div style={{ width:1, flex:1, minHeight:20, background:C.border }} />}
                    </div>
                    <div style={{ paddingLeft:14, paddingBottom:22 }}>
                      <div style={{ fontFamily:C.headline, fontSize:'1rem', fontWeight:600, color:C.primary, marginBottom:5, paddingTop:3 }}>{title}</div>
                      <div style={{ fontFamily:C.body, fontSize:13.5, color:C.secondary, lineHeight:1.62 }}>{body}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <span data-reveal style={label()}>Architecture</span>
            <h2 data-reveal style={{ ...H2(), marginBottom:36 }}>Three layers. Everything needed, nothing redundant.</h2>
            <div data-reveal><ArchFlow /></div>
            <div style={{ marginTop:28, display:'flex', flexDirection:'column', gap:1 }}>
              {[{ layer:'Execution', body:'Hermes agents run Plan→Act→Observe→Reflect inside AMD SEV-SNP / Intel SGX enclaves. Powered entirely by your own LLM key.' },
                { layer:'Coordination', body:'OpenClaw gateway + FSM task list. No horizontal agent messaging. Every interaction is a discrete, locked, logged task record with a defined terminal.' },
                { layer:'Memory', body:'GBrain: Git-backed Markdown knowledge graph. Every decision is immutable, human-readable, diff-able, and rollback-able in under 60 seconds.' },
              ].map((item) => (
                <div key={item.layer} data-reveal style={{ border:`1px solid ${C.border}`, padding:'16px 20px', background:C.raised }}>
                  <div style={{ fontFamily:C.mono, fontSize:10, color:C.primary, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:7 }}>{item.layer}</div>
                  <div style={{ fontSize:13, color:C.secondary, lineHeight:1.62 }}>{item.body}</div>
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
            <h2 data-reveal style={{ ...H2(), marginBottom:20 }}>You pay your LLM provider. We never see that line.</h2>
            <p data-reveal style={{ fontFamily:C.body, fontSize:'1rem', lineHeight:1.72, color:C.secondary, marginBottom:32 }}>
              Sockt charges only for orchestration infrastructure — FSM coordination, GBrain memory, TEE isolation, fleet intelligence. Your inference bill stays between you and your provider at their rates.
            </p>
            <div data-reveal style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {['Anthropic (Claude) — recommended','OpenAI (GPT-4o, GPT-4o-mini)','Azure OpenAI','Google Gemini','Self-hosted: Ollama · vLLM · LM Studio'].map((p) => (
                <div key={p} style={{ display:'flex', alignItems:'center', gap:10, fontFamily:C.mono, fontSize:11, color:C.secondary }}>
                  <span style={{ color:'#22D07A', flexShrink:0 }}>✓</span>{p}
                </div>
              ))}
            </div>
          </div>
          <div>
            <span data-reveal style={label()}>Security Architecture</span>
            <h2 data-reveal style={{ ...H2(), marginBottom:28 }}>No credentials in agent context. Ever.</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
              {[{ layer:'TEE Hardware Isolation', body:'AMD SEV-SNP / Intel SGX enclaves. Memory pages are CPU-encrypted — host admins, including Sockt, cannot inspect a running container.' },
                { layer:'Secret Vault Proxy', body:'Agents hold placeholder keys. A host-layer proxy intercepts every outbound call, injects real credentials, and forwards. A fully-compromised agent has mathematically nothing to exfiltrate.' },
                { layer:'Egress Allowlist', body:'All outbound traffic routes through per-customer domain rules. DNS covert channels blocked. Injection attempts logged and distributed to fleet in < 60 min.' },
                { layer:'HITL Gates', body:'Tier 1 auto-executes. Tier 2 needs human approval before any external action. Tier 3 is permanently blocked at the proxy layer — agent reasoning cannot override this.' },
              ].map((item) => (
                <div key={item.layer} data-reveal style={{ border:`1px solid ${C.border}`, borderLeft:'2px solid #46464E', padding:'16px 18px', background:C.raised }}>
                  <div style={{ fontFamily:C.mono, fontSize:10, color:C.primary, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:7 }}>{item.layer}</div>
                  <div style={{ fontSize:13, color:C.secondary, lineHeight:1.62 }}>{item.body}</div>
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
            <h2 data-reveal style={{ ...H2(), marginBottom:20 }}>Your agents learn from 200+ deployments — not just yours.</h2>
            <p data-reveal style={{ fontFamily:C.body, fontSize:'1rem', lineHeight:1.72, color:C.secondary }}>
              A self-hosted deployment has N=1 data — no baseline, no collective threat intelligence, no proactive API monitoring. Paid tiers tap a network that becomes more valuable with every deployment added.
            </p>
          </div>
          <div>
            <div data-reveal style={{ display:'flex', justifyContent:'center', marginBottom:32, opacity:0.75 }}>
              <MemoryPulse size={180} />
            </div>
            <div data-reveal style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1 }}>
              {[{ n:'< 60 min', l:'Detection to fleet-wide protection' },
                { n:'< 2 hrs',  l:'API change detected before your cron fails' },
                { n:'60–75%',   l:'Token cost reduction (compiled skills)' },
                { n:'N=1 → ∞', l:'Self-hosted vs. fleet data advantage' },
              ].map((item) => (
                <div key={item.l} style={{ border:`1px solid ${C.border}`, padding:'20px 18px', background:C.raised }}>
                  <div style={{ fontFamily:C.headline, fontSize:'clamp(1.1rem, 3vw, 1.6rem)', fontWeight:700, letterSpacing:'-0.03em', color:C.primary, lineHeight:1, marginBottom:8 }}>{item.n}</div>
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

function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { selector:'[data-reveal]', stagger:0.08, y:30, duration:0.85 });
  return (
    <section style={{ ...sep, padding:'96px 0' }}>
      <div style={wrap} ref={ref}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:24, flexWrap:'wrap', marginBottom:48 }}>
          <div>
            <span data-reveal style={label()}>Pricing</span>
            <h2 data-reveal style={{ ...H2(), maxWidth:'16ch' }}>Platform fee. Your LLM costs stay yours.</h2>
          </div>
          <p data-reveal style={{ fontFamily:C.mono, fontSize:11, color:C.secondary, maxWidth:'36ch', lineHeight:1.7, letterSpacing:'0.02em', margin:0 }}>
            No inference markup. No per-seat lock-in. Pay Sockt for orchestration intelligence.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(170px, 1fr))', gap:1 }}>
          {TIERS.map((tier) => (
            <article key={tier.name} data-reveal className="price-card"
              style={{ border:`1px solid ${tier.badge?'#46464E':C.border}`, background:tier.badge?C.raised:C.surface, padding:'24px 18px', position:'relative', display:'flex', flexDirection:'column', gap:14 }}>
              {tier.badge && (
                <div style={{ position:'absolute', top:-1, left:'50%', transform:'translateX(-50%)', background:C.primary, color:C.void, fontFamily:C.mono, fontSize:8, fontWeight:700, letterSpacing:'0.15em', padding:'3px 10px', whiteSpace:'nowrap' }}>
                  {tier.badge.toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ fontFamily:C.mono, fontSize:9, color:C.secondary, letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:12 }}>{tier.name}</div>
                <div style={{ fontFamily:C.headline, fontSize:'clamp(1.5rem, 3vw, 2rem)', fontWeight:700, letterSpacing:'-0.03em', color:C.primary, lineHeight:1, marginBottom:4 }}>{tier.price}</div>
                <div style={{ fontFamily:C.mono, fontSize:9, color:C.secondary, letterSpacing:'0.06em' }}>{tier.note}</div>
              </div>
              <div className="price-hover-detail" style={{ fontFamily:C.body, fontSize:12, color:C.secondary, lineHeight:1.55, marginTop:-4 }}>{tier.detail}</div>
              <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14, display:'flex', flexDirection:'column', gap:8 }}>
                {tier.features.map((f) => (
                  <div key={f} style={{ display:'flex', gap:8 }}>
                    <span style={{ color:'#46464E', fontSize:11, flexShrink:0 }}>›</span>
                    <span style={{ fontFamily:C.body, fontSize:12, color:C.secondary, lineHeight:1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div data-reveal style={{ marginTop:16 }}>
          <Link href="/pricing" style={{ fontFamily:C.mono, fontSize:10, color:C.secondary, letterSpacing:'0.1em' }}
            onMouseEnter={(e) => { e.currentTarget.style.color=C.primary; }}
            onMouseLeave={(e) => { e.currentTarget.style.color=C.secondary; }}>
            FULL PRICING + ADD-ONS + ANNUAL DISCOUNTS →
          </Link>
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
            <h2 data-reveal style={{ ...H2(), marginBottom:20 }}>AI infrastructure shouldn't be a black box.</h2>
            <p data-reveal style={{ fontFamily:C.body, fontSize:'1rem', lineHeight:1.72, color:C.secondary, marginBottom:32 }}>
              The core orchestration, FSM engine, and memory layer are open source under FSL-1.1-MIT — any engineer can verify that loop-prevention and memory architecture work as described. Self-host on a $20/month VPS, or let us run it.
            </p>
            <div data-reveal style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              <a href="https://github.com/MMEHDI0606/sockt" target="_blank" rel="noopener noreferrer"
                style={{ fontFamily:C.mono, fontSize:11, color:C.primary, border:`1px solid ${C.border}`, borderRadius:999, padding:'9px 20px', letterSpacing:'0.08em', display:'inline-block', transition:'border-color 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor='#46464E'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor=C.border; }}>GITHUB →</a>
              <Link href="/docs"
                style={{ fontFamily:C.mono, fontSize:11, color:C.secondary, border:`1px solid ${C.border}`, borderRadius:999, padding:'9px 20px', letterSpacing:'0.08em', display:'inline-block', transition:'color 0.15s ease, border-color 0.15s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.color=C.primary; e.currentTarget.style.borderColor='#46464E'; }}
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

  useEffect(() => {
    const s = createClient();
    s.auth.getUser().then(({ data }) => { if (data.user) router.replace('/dashboard'); });
  }, [router]);

  return (
    <>
      <PageLoader />
      <Nav />
      <main style={{ color:C.primary, background:C.void, overflowX:'hidden' }}>

        {/* ── HERO — atmospheric, living darkness ── */}
        <section style={{ position:'relative', minHeight:'92vh', display:'flex', alignItems:'center', paddingTop:96, paddingBottom:64, overflow:'hidden' }}>

          {/* Neural particle field — the background breathes */}
          <NeuralField />

          {/* Ambient blob glow — mist in the dark */}
          <AmbientBlobs variant="hero" />

          <div style={{ ...wrap, width:'100%', position:'relative', zIndex:1 }}>
            <div className="hero-grid" style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(0,1fr)', gap:'5vw', alignItems:'center' }}>

              {/* Left — direct, immediate, un-precious */}
              <div>
                <span style={{ ...label(), marginBottom:24 }}>AI Workforce Platform</span>
                <h1 style={{
                  fontFamily: C.headline,
                  fontSize: 'clamp(3.2rem, 7.5vw, 8rem)',
                  fontWeight: 800, lineHeight: 0.9, letterSpacing: '-0.048em',
                  color: C.primary, margin: '0 0 28px',
                }}>
                  Hire a team,<br />
                  <em style={{ fontStyle:'italic', color:C.secondary }}>not a tool.</em>
                </h1>
                <p style={{ fontFamily:C.body, fontSize:'1.05rem', lineHeight:1.72, color:C.secondary, maxWidth:'50ch', marginBottom:36 }}>
                  Preconfigured AI departments that live in Slack, share persistent memory, and coordinate safely — with structural loop prevention, hardware-isolated execution, and fleet intelligence that learns from every deployment.
                </p>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:36 }}>
                  <Link href="/pricing"
                    style={{ background:C.primary, color:C.void, padding:'13px 28px', borderRadius:999, fontFamily:C.mono, fontSize:12, fontWeight:700, letterSpacing:'0.06em', display:'inline-block', transition:'opacity 0.15s ease' }}
                    onMouseEnter={(e)=>{ e.currentTarget.style.opacity='0.85'; }}
                    onMouseLeave={(e)=>{ e.currentTarget.style.opacity='1'; }}>ADD TO SLACK</Link>
                  <Link href="/departments"
                    style={{ border:`1px solid ${C.border}`, color:C.secondary, padding:'12px 26px', borderRadius:999, fontFamily:C.mono, fontSize:12, letterSpacing:'0.06em', display:'inline-block', transition:'color 0.15s ease, border-color 0.15s ease' }}
                    onMouseEnter={(e)=>{ e.currentTarget.style.color=C.primary; e.currentTarget.style.borderColor='#46464E'; }}
                    onMouseLeave={(e)=>{ e.currentTarget.style.color=C.secondary; e.currentTarget.style.borderColor=C.border; }}>SEE DEPARTMENTS</Link>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                  {['BYOK — zero token markup','Loop prevention (FSM-enforced)','Open-core (FSL-1.1-MIT)'].map((t) => (
                    <div key={t} style={{ fontFamily:C.mono, fontSize:10, color:'#44444B', letterSpacing:'0.1em', display:'flex', alignItems:'center', gap:8 }}>
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

        {/* ── PROOF SECTIONS — Moranta "emerge from darkness" ── */}
        <CrisesSection />
        <HowItWorksSection />
        <DepartmentsSection />
        <SecuritySection />
        <FleetSection />
        <PricingSection />
        <OpenSourceSection />

        {/* ── FINAL CTA — fast / clear / ambient glow ── */}
        <section style={{ ...sep, padding:'128px 0', background:C.surface, textAlign:'center', position:'relative', overflow:'hidden' }}>
          <AmbientBlobs variant="cta" />
          <div style={{ ...wrap, position:'relative', zIndex:1 }}>
            <div style={{ maxWidth:600, margin:'0 auto', display:'flex', flexDirection:'column', alignItems:'center', gap:24 }}>
              <h2 style={{ fontFamily:C.headline, fontSize:'clamp(2.4rem, 6vw, 5.5rem)', fontWeight:800, letterSpacing:'-0.045em', lineHeight:0.96, color:C.primary, margin:0 }}>
                Launch an AI department this week.
              </h2>
              <p style={{ fontFamily:C.body, fontSize:'1rem', color:C.secondary, lineHeight:1.7, maxWidth:'44ch', margin:0 }}>
                Under 10 minutes to activate. First real output within 2 hours. GBrain transfers seamlessly if you change tiers.
              </p>
              <Link href="/pricing"
                style={{ background:C.primary, color:C.void, padding:'15px 40px', borderRadius:999, fontFamily:C.mono, fontSize:13, fontWeight:700, letterSpacing:'0.08em', display:'inline-block', marginTop:8, transition:'opacity 0.15s ease' }}
                onMouseEnter={(e)=>{ e.currentTarget.style.opacity='0.85'; }}
                onMouseLeave={(e)=>{ e.currentTarget.style.opacity='1'; }}>
                ADD SOCKT TO SLACK
              </Link>
              <p style={{ fontFamily:C.mono, fontSize:10, color:'#44444B', margin:0, letterSpacing:'0.1em' }}>
                COMMUNITY EDITION IS FREE · PAID PLANS FROM $69/MO
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      <style>{`
        @media (max-width: 720px) { .hero-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
