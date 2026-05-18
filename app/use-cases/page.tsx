"use client";

import React, { useEffect, useRef } from 'react';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';
import HowItWorksSection from '@/components/sections/HowItWorksSection';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function UseCasesPage() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!containerRef.current) return;

    gsap.fromTo(
      ".hero-anim",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );
  }, []);

  return (
    <>
      <Nav />
      <main
        ref={containerRef}
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-void)',
          color: 'var(--text-primary)',
          paddingTop: '120px',
        }}
      >
        <section style={{ maxWidth: '920px', margin: '0 auto', padding: '0 24px 64px', textAlign: 'center' }}>
          <h1
            className="hero-anim"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              marginBottom: '24px',
            }}
          >
            AI Agent Workflows
          </h1>
          <p
            className="hero-anim"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
              fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
              lineHeight: 1.6,
              maxWidth: '700px',
              margin: '0 auto 48px',
            }}
          >
            From simple data extraction to autonomous model training and complete codebase evaluations. Give your agents the ephemeral compute they need to execute complex tasks.
          </p>
        </section>

        {/* Existing Grid of Use Cases */}
        <HowItWorksSection hideViewAll={true} />

        {/* Deep Dive 1: Model Training */}
        <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '140px 24px', display: 'flex', flexDirection: 'column', gap: '80px' }}>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: 'var(--bg-raised)', border: '1px solid var(--accent-btc)', color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', borderRadius: '4px', marginBottom: '24px' }}>Deep Dive 01</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '24px' }}>Autonomous Model Training</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                Agents can dynamically provision GPU clusters (A100s or RTX 5090s) to run bespoke model fine-tuning or evaluation loops. Payment is settled via Lightning network in real-time, paying per epoch completed rather than per hour reserved.
              </p>
              <ul style={{ color: 'var(--text-mono)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><span style={{ color: 'var(--accent-green)' }}>✓</span> 0s idle waste</li>
                <li><span style={{ color: 'var(--accent-green)' }}>✓</span> Secure isolated GPU environments</li>
                <li><span style={{ color: 'var(--accent-green)' }}>✓</span> Full metrics pipeline returned</li>
              </ul>
            </div>

            <div style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Terminal Output</div>
              <div style={{ color: 'var(--accent-btc)', marginBottom: '8px' }}>&gt; agent run train.py --epochs 10</div>
              <div style={{ color: 'var(--text-mono)' }}>Provisioning GPU_SMALL tier...</div>
              <div style={{ color: 'var(--text-mono)' }}>Loading dataset /mnt/data/v2...</div>
              <div style={{ color: 'var(--text-mono)' }}>Epoch 1/10 [======&gt;             ] 34%</div>
              <div style={{ color: 'var(--text-mono)', opacity: 0.5 }}>...</div>
              <div style={{ color: 'var(--accent-green)', marginTop: '8px' }}>Training complete. Settling 4,500 sats.</div>
            </div>
          </div>

          {/* Deep Dive 2: Codebase Evaluation */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div style={{ order: 2 }}>
              <div style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: 'var(--bg-raised)', border: '1px solid var(--accent-btc)', color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', borderRadius: '4px', marginBottom: '24px' }}>Deep Dive 02</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '24px' }}>Codebase Evaluation Loops</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                Agents writing code need a safe place to test it. Provision micro or standard sandboxes to run unit tests, check for regressions, and validate builds securely before pushing to master.
              </p>
              <ul style={{ color: 'var(--text-mono)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><span style={{ color: 'var(--accent-green)' }}>✓</span> Instant boot times (~200ms)</li>
                <li><span style={{ color: 'var(--accent-green)' }}>✓</span> Isolated dependency resolutions</li>
                <li><span style={{ color: 'var(--accent-green)' }}>✓</span> Seamless CI/CD integration</li>
              </ul>
            </div>

            <div style={{ order: 1, padding: '24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Terminal Output</div>
              <div style={{ color: 'var(--accent-btc)', marginBottom: '8px' }}>&gt; agent run "npm ci && npm test"</div>
              <div style={{ color: 'var(--text-mono)' }}>Provisioning STANDARD tier...</div>
              <div style={{ color: 'var(--text-mono)' }}>added 421 packages, and audited 422 packages in 3s</div>
              <div style={{ color: 'var(--text-mono)' }}>PASS src/utils.test.ts</div>
              <div style={{ color: 'var(--text-mono)', opacity: 0.5 }}>...</div>
              <div style={{ color: 'var(--accent-green)', marginTop: '8px' }}>Test suite passed. Duration: 14s. Cost: $2.</div>
            </div>
          </div>

          {/* Deep Dive 3: Research Batch Processing */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-block', padding: '4px 8px', backgroundColor: 'var(--bg-raised)', border: '1px solid var(--accent-btc)', color: 'var(--accent-btc)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', borderRadius: '4px', marginBottom: '24px' }}>Deep Dive 03</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', marginBottom: '24px' }}>Research Batch Processing</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
                Spawn hundreds of high-memory instances instantly for web scraping, complex calculations, or multi-agent simulations. Shut them down immediately after the results are gathered.
              </p>
              <ul style={{ color: 'var(--text-mono)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li><span style={{ color: 'var(--accent-green)' }}>✓</span> Extremely high concurrency</li>
                <li><span style={{ color: 'var(--accent-green)' }}>✓</span> High-memory limits for heavy tasks</li>
                <li><span style={{ color: 'var(--accent-green)' }}>✓</span> Consolidated billing dashboard</li>
              </ul>
            </div>

            <div style={{ padding: '24px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--bg-border)', borderRadius: '8px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Terminal Output</div>
              <div style={{ color: 'var(--accent-btc)', marginBottom: '8px' }}>&gt; agent spawn --count 50 --script scrape.py</div>
              <div style={{ color: 'var(--text-mono)' }}>Provisioning 50x MICRO tiers...</div>
              <div style={{ color: 'var(--text-mono)' }}>Jobs dispatched. Awaiting results...</div>
              <div style={{ color: 'var(--text-mono)', opacity: 0.5 }}>...</div>
              <div style={{ color: 'var(--text-mono)' }}>Gathering artifacts and tearing down.</div>
              <div style={{ color: 'var(--accent-green)', marginTop: '8px' }}>Batch complete. Settlement summary: 34,200 sats.</div>
            </div>
          </div>

        </section>

      </main>
      <Footer />
    </>
  );
}
