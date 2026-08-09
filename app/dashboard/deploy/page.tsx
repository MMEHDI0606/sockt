'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DeployWizard from '@/components/dashboard/DeployWizard';
import type { SlackWorkspace, LlmKey } from '@/lib/console/types';
import type { DeployDepartmentInput } from '@/lib/departments/deploy';
import { deployDepartment } from '@/lib/departments/deploy';
import { getTemplate } from '@/lib/departments/templates';
import {
  getSlackWorkspaces,
  getLlmKeys,
  createTeam,
  createAgent,
  linkAgentToTeam,
  createDeployment,
} from '@/lib/console/client';

const C = {
  void: 'var(--bg-void)', surface: 'var(--bg-surface)', raised: 'var(--bg-raised)', border: 'var(--bg-border)',
  primary: 'var(--text-primary)', secondary: 'var(--text-secondary)', mono: 'var(--font-mono)', body: 'var(--font-body)',
  headline: 'var(--font-headline)', green: 'var(--accent-green)', red: 'var(--accent-red)',
  radiusCard: 'var(--radius-card)',
};
const CARD = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: C.radiusCard, padding: 20 };

export default function DeployPage() {
  const router = useRouter();
  const [workspaces, setWorkspaces] = useState<SlackWorkspace[]>([]);
  const [keys, setKeys] = useState<LlmKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deploying, setDeploying] = useState(false);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ department: string } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [w, k] = await Promise.all([getSlackWorkspaces(), getLlmKeys()]);
      setWorkspaces(w);
      setKeys(k);
      setLoadError(null);
    } catch (e: any) {
      setLoadError(e.message || 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeploy = async (input: DeployDepartmentInput) => {
    setDeploying(true);
    setDeployError(null);
    try {
      await deployDepartment(
        { createTeam, createAgent, linkAgentToTeam, createDeployment },
        input,
      );
      setSuccess({ department: getTemplate(input.templateId)?.name ?? input.templateId });
    } catch (e: any) {
      setDeployError(e.message || 'Failed to deploy department');
    } finally {
      setDeploying(false);
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: C.mono, color: C.secondary, fontSize: 13, padding: 40 }}>
        Loading...
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ ...CARD, borderColor: C.red, color: C.red, fontFamily: C.mono, fontSize: 12 }}>
        {loadError}
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 560 }}>
        <div style={{ ...CARD, borderColor: C.green }}>
          <h1 style={{ margin: 0, fontFamily: C.headline, fontSize: 20, color: C.primary }}>
            Department deployed
          </h1>
          <p style={{ margin: '10px 0 0 0', fontFamily: C.body, fontSize: 13, color: C.secondary }}>
            The <code style={{ fontFamily: C.mono, color: C.primary }}>{success.department}</code> department
            is being provisioned and will appear in <b>Overview</b> once active.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              background: C.primary, color: C.void, fontFamily: C.mono, fontSize: 12, fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase', padding: '8px 18px', border: 'none',
              borderRadius: 8, cursor: 'pointer',
            }}
          >
            Go to Overview
          </button>
          <button
            onClick={() => { setSuccess(null); setDeployError(null); }}
            style={{
              background: 'transparent', border: `1px solid ${C.border}`, color: C.secondary, fontFamily: C.mono,
              fontSize: 11, letterSpacing: '0.06em', padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
            }}
          >
            Deploy another department
          </button>
        </div>
      </div>
    );
  }

  return (
    <DeployWizard
      workspaces={workspaces}
      keys={keys}
      onDeploy={handleDeploy}
      deploying={deploying}
      error={deployError}
      configureSlackHref="/dashboard/configure/slack"
      configureKeysHref="/dashboard/configure/keys"
    />
  );
}