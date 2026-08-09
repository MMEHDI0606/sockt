'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { SlackWorkspace, LlmKey } from '@/lib/console/types';
import { DEPARTMENT_TEMPLATES, type Provider } from '@/lib/departments/templates';
import type { DeployDepartmentInput } from '@/lib/departments/deploy';

export interface DeployWizardProps {
  workspaces: SlackWorkspace[];
  keys: LlmKey[];
  onDeploy: (input: DeployDepartmentInput) => Promise<void>;
  deploying: boolean;
  error: string | null;
  configureSlackHref: string;
  configureKeysHref: string;
}

type Step = 'workspaces' | 'keys' | 'department' | 'channels' | 'review';
const STEPS: Step[] = ['workspaces', 'keys', 'department', 'channels', 'review'];

const C = {
  void: 'var(--bg-void)', surface: 'var(--bg-surface)', raised: 'var(--bg-raised)', border: 'var(--bg-border)',
  primary: 'var(--text-primary)', secondary: 'var(--text-secondary)', mono: 'var(--font-mono)', body: 'var(--font-body)',
  headline: 'var(--font-headline)', radiusBtn: 'var(--radius-btn)', radiusCard: 'var(--radius-card)',
};
const BTN_PRIMARY = (p?: string) => ({
  background: C.primary, color: C.void, fontFamily: C.mono, fontSize: 'var(--mono-cta)',
  fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' as const,
  padding: p ?? '8px 20px', border: 'none', borderRadius: C.radiusBtn, cursor: 'pointer',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
});
const BTN_OUTLINE = {
  background: 'transparent', border: `1px solid ${C.border}`, color: C.secondary, fontFamily: C.mono,
  fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', padding: '6px 14px', borderRadius: C.radiusBtn, cursor: 'pointer',
};
const INPUT = {
  background: C.void, border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 12px',
  color: C.primary, fontFamily: C.mono, fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box' as const,
};
const LABEL = {
  fontFamily: C.mono, fontSize: 10, fontWeight: 600, color: C.secondary,
  textTransform: 'uppercase' as const, letterSpacing: '0.06em',
};
const CARD = {
  background: C.surface, border: `1px solid ${C.border}`, borderRadius: C.radiusCard, padding: 20,
};

function StepRow({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current);
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
      {STEPS.map((s, i) => (
        <div
          key={s}
          style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= idx ? C.primary : C.raised,
          }}
        />
      ))}
    </div>
  );
}

const STEP_LABEL: Record<Step, string> = {
  workspaces: 'Workspaces',
  keys: 'Keys',
  department: 'Department',
  channels: 'Channels',
  review: 'Review',
};

function DepartmentIcon({ iconId }: { iconId: string }) {
  const stroke = 'var(--accent-btc)';
  if (iconId === 'growth')
    return (
      <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
        <circle cx="10" cy="28" r="4" fill={stroke} />
        <circle cx="19" cy="19" r="4" fill={stroke} />
        <circle cx="28" cy="10" r="4" fill={stroke} />
        <path d="M10 28 L19 19 L28 10" stroke={stroke} strokeWidth="2" fill="none" />
      </svg>
    );
  if (iconId === 'content')
    return (
      <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
        <rect x="7" y="10" width="24" height="18" rx="4" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M12 16h14M12 20h10M12 24h7" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  if (iconId === 'product')
    return (
      <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
        <rect x="8" y="8" width="22" height="22" rx="5" fill="none" stroke={stroke} strokeWidth="2" />
        <path d="M14 19h10M19 14v10" stroke={stroke} strokeWidth="2" />
      </svg>
    );
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" aria-hidden="true">
      <path d="M19 8l9 5v12l-9 5-9-5V13l9-5z" fill="none" stroke={stroke} strokeWidth="2" />
      <circle cx="19" cy="19" r="4" fill={stroke} />
    </svg>
  );
}

export default function DeployWizard({
  workspaces,
  keys,
  onDeploy,
  deploying,
  error,
  configureSlackHref,
  configureKeysHref,
}: DeployWizardProps) {
  const [step, setStep] = useState<Step>('workspaces');
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>(
    workspaces[0]?.id ?? '',
  );
  const [templateId, setTemplateId] = useState<string>('');
  const [channels, setChannels] = useState<string>('');

  const stepIdx = STEPS.indexOf(step);
  const hasWorkspace = workspaces.length > 0;
  const hasKeys = keys.length > 0;
  const workspaceSelected = Boolean(selectedWorkspaceId);
  const templateChosen = Boolean(templateId);
  const channelsParsed = channels
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);

  const canAdvance: Record<Step, boolean> = {
    workspaces: hasWorkspace && workspaceSelected,
    keys: hasKeys,
    department: templateChosen,
    channels: true,
    review: true,
  };

  const next = () => {
    if (!canAdvance[step]) return;
    setStep(STEPS[Math.min(stepIdx + 1, STEPS.length - 1)]);
  };
  const back = () => setStep(STEPS[Math.max(stepIdx - 1, 0)]);

  const selectedTemplate = DEPARTMENT_TEMPLATES.find((t) => t.id === templateId);
  const selectedWorkspace = workspaces.find((w) => w.id === selectedWorkspaceId);

  const handleDeploy = async () => {
    if (!selectedTemplate) return;
    const input: DeployDepartmentInput = {
      templateId: selectedTemplate.id,
      provider: selectedTemplate.provider as Provider,
      model: selectedTemplate.model,
    };
    if (selectedWorkspace) input.slackWorkspaceId = selectedWorkspace.id;
    if (channelsParsed.length > 0) input.channels = channelsParsed;
    await onDeploy(input);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 760 }}>
      <div>
        <h1 style={{ fontSize: 22, fontFamily: C.headline, fontWeight: 700, color: C.primary, margin: 0 }}>
          Deploy a Department
        </h1>
        <p style={{ fontSize: 13, fontFamily: C.body, color: C.secondary, margin: '4px 0 0 0' }}>
          Step {stepIdx + 1} of {STEPS.length}: {STEP_LABEL[step]}
        </p>
      </div>

      <StepRow current={step} />

      {error && (
        <div
          data-test="error-banner"
          style={{
            ...CARD, borderColor: 'var(--accent-red)', color: 'var(--accent-red)',
            fontFamily: C.mono, fontSize: 12,
          }}
        >
          {error}
        </div>
      )}

      {step === 'workspaces' && (
        <div>
          <label style={LABEL}>Slack Workspace</label>
          {!hasWorkspace ? (
            <div style={{ ...CARD, marginTop: 10 }}>
              <p style={{ fontFamily: C.mono, fontSize: 12, color: C.secondary, margin: '0 0 14px 0' }}>
                Connect your Slack workspace to deploy departments into.
              </p>
              <Link href={configureSlackHref} style={{ ...BTN_PRIMARY(), textDecoration: 'none', display: 'inline-block' }}>
                Connect Slack
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
              {workspaces.map((w) => {
                const sel = w.id === selectedWorkspaceId;
                return (
                  <button
                    key={w.id}
                    data-test="workspace-option"
                    onClick={() => setSelectedWorkspaceId(w.id)}
                    style={{
                      textAlign: 'left', cursor: 'pointer', fontFamily: C.mono, fontSize: 13,
                      color: sel ? C.primary : C.secondary,
                      background: sel ? C.raised : C.void,
                      border: `1px solid ${sel ? C.primary : C.border}`,
                      borderRadius: 8, padding: '10px 14px',
                    }}
                  >
                    {w.workspace_id}
                  </button>
                );
              })}
              <Link href={configureSlackHref} style={{ fontFamily: C.mono, fontSize: 11, color: 'var(--accent-btc)', marginTop: 4 }}>
                Connect another workspace →
              </Link>
            </div>
          )}
        </div>
      )}

      {step === 'keys' && (
        <div>
          <label style={LABEL}>BYOK Provider Keys</label>
          {!hasKeys ? (
            <div style={{ ...CARD, marginTop: 10 }}>
              <p style={{ fontFamily: C.mono, fontSize: 12, color: C.secondary, margin: '0 0 14px 0' }}>
                Add at least one provider API key so your agents can run.
              </p>
              <Link href={configureKeysHref} style={{ ...BTN_PRIMARY(), textDecoration: 'none', display: 'inline-block' }}>
                Add a key
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              {Object.entries(
                keys.reduce<Record<string, number>>((acc, k) => {
                  acc[k.provider] = (acc[k.provider] ?? 0) + 1;
                  return acc;
                }, {}),
              ).map(([provider, count]) => (
                <div
                  key={provider}
                  style={{
                    display: 'flex', justifyContent: 'space-between',
                    fontFamily: C.mono, fontSize: 12, color: C.primary,
                    background: C.void, border: `1px solid ${C.border}`,
                    borderRadius: 6, padding: '8px 12px',
                  }}
                >
                  <span>{provider}</span>
                  <span style={{ color: C.secondary }}>{count} key{count > 1 ? 's' : ''}</span>
                </div>
              ))}
              <Link href={configureKeysHref} style={{ fontFamily: C.mono, fontSize: 11, color: 'var(--accent-btc)', marginTop: 4 }}>
                Manage keys →
              </Link>
            </div>
          )}
        </div>
      )}

      {step === 'department' && (
        <div>
          <label style={LABEL}>Department</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginTop: 10 }}>
            {DEPARTMENT_TEMPLATES.map((t) => {
              const sel = t.id === templateId;
              return (
                <button
                  key={t.id}
                  data-test="department-card"
                  data-id={t.id}
                  onClick={() => setTemplateId(t.id)}
                  style={{
                    cursor: 'pointer', textAlign: 'left',
                    background: sel ? C.raised : C.surface,
                    border: `1px solid ${sel ? C.primary : C.border}`,
                    borderRadius: C.radiusCard, padding: 16,
                    display: 'flex', flexDirection: 'column', gap: 10,
                  }}
                >
                  <DepartmentIcon iconId={t.iconId} />
                  <div style={{ fontFamily: C.headline, fontSize: 15, fontWeight: 700, color: C.primary }}>
                    {t.name}
                  </div>
                  <div style={{ fontFamily: C.body, fontSize: 12, color: C.secondary, lineHeight: 1.5 }}>
                    {t.description}
                  </div>
                  <div style={{ fontFamily: C.mono, fontSize: 10, color: 'var(--accent-btc)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {t.provider} · {t.agents.length} agents
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 'channels' && (
        <div>
          <label style={LABEL}>Channels (comma-separated)</label>
          <input
            data-test="channels"
            value={channels}
            onChange={(e) => setChannels(e.target.value)}
            style={INPUT}
            placeholder="e.g. general, growth-alerts"
          />
          <p style={{ fontFamily: C.mono, fontSize: 11, color: C.secondary, marginTop: 8 }}>
            Optional. The agents will listen in these channels. You can leave blank and configure later.
          </p>
        </div>
      )}

      {step === 'review' && (
        <div style={{ ...CARD, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 style={{ margin: 0, fontFamily: C.headline, fontSize: 16, color: C.primary }}>Review</h2>
          {selectedTemplate && (
            <div>
              <div style={LABEL}>Department</div>
              <div style={{ fontFamily: C.mono, fontSize: 13, color: C.primary }}>{selectedTemplate.name}</div>
              <div style={{ fontFamily: C.body, fontSize: 12, color: C.secondary, marginTop: 4 }}>
                {selectedTemplate.agents.length} agents · {selectedTemplate.provider} / {selectedTemplate.model}
              </div>
            </div>
          )}
          {selectedWorkspace && (
            <div>
              <div style={LABEL}>Slack Workspace</div>
              <div style={{ fontFamily: C.mono, fontSize: 13, color: C.primary }}>{selectedWorkspace.workspace_id}</div>
            </div>
          )}
          <div>
            <div style={LABEL}>Channels</div>
            <div style={{ fontFamily: C.mono, fontSize: 13, color: C.primary }}>
              {channelsParsed.length > 0 ? channelsParsed.join(', ') : '(none)'}
            </div>
          </div>
          <div>
            <div style={LABEL}>Provider / Model</div>
            <div style={{ fontFamily: C.mono, fontSize: 13, color: C.primary }}>
              {selectedTemplate?.provider} / {selectedTemplate?.model}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <button data-test="back" onClick={back} disabled={stepIdx === 0} style={BTN_OUTLINE}>
          Back
        </button>
        <div style={{ display: 'flex', gap: 8 }}>
          {step !== 'review' ? (
            <button data-test="next" onClick={next} disabled={!canAdvance[step]} style={BTN_PRIMARY()}>
              Next
            </button>
          ) : (
            <button
              data-test="deploy"
              onClick={handleDeploy}
              disabled={deploying}
              style={BTN_PRIMARY()}
            >
              {deploying ? 'Deploying...' : 'Deploy'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}