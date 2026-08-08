'use client';

import { identityFetch, getAccessToken } from '@/utils/identity/client';
import type {
  Team,
  AgentDef,
  LlmConfig,
  Deployment,
  SlackWorkspace,
  ToolConfig,
  LlmKey,
  TaskSummary,
  TaskStatus,
  Approval,
  CostSummary,
  IntegrationHealth,
  ConsoleAlert,
  FleetBenchmark,
} from './types';

const CONSOLE_URL = process.env.NEXT_PUBLIC_CONSOLE_API_URL || 'http://localhost:8080/console';

async function cFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await identityFetch(`${CONSOLE_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Console API error ${res.status}: ${body.error || 'unknown'}`);
  }
  return res.json() as Promise<T>;
}

async function cFetchList<T>(path: string): Promise<T[]> {
  return cFetch<T[]>(path);
}

// ═══ Teams ═══
export async function getTeams(): Promise<Team[]> { return cFetchList('/teams'); }
export async function getTeam(id: string): Promise<Team> { return cFetch(`/teams/${id}`); }
export async function createTeam(data: { name: string; department?: string }): Promise<Team> {
  return cFetch('/teams', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateTeam(id: string, data: Partial<Team>): Promise<Team> {
  return cFetch(`/teams/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteTeam(id: string): Promise<{ ok: boolean }> {
  return cFetch(`/teams/${id}`, { method: 'DELETE' });
}

// ═══ Agents ═══
export async function getAgents(): Promise<AgentDef[]> { return cFetchList('/agents'); }
export async function getAgent(id: string): Promise<AgentDef> { return cFetch(`/agents/${id}`); }
export async function createAgent(data: Omit<AgentDef, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>): Promise<AgentDef> {
  return cFetch('/agents', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateAgent(id: string, data: Partial<AgentDef>): Promise<AgentDef> {
  return cFetch(`/agents/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteAgent(id: string): Promise<{ ok: boolean }> {
  return cFetch(`/agents/${id}`, { method: 'DELETE' });
}
export async function getTeamAgents(teamId: string): Promise<AgentDef[]> {
  return cFetchList(`/teams/${teamId}/agents`);
}
export async function linkAgentToTeam(teamId: string, agentDefId: string): Promise<void> {
  await cFetch(`/teams/${teamId}/agents`, { method: 'POST', body: JSON.stringify({ agent_def_id: agentDefId }) });
}
export async function unlinkAgentFromTeam(teamId: string, agentDefId: string): Promise<void> {
  await cFetch(`/teams/${teamId}/agents/${agentDefId}`, { method: 'DELETE' });
}

// ═══ Deployments ═══
export async function getDeployments(): Promise<Deployment[]> { return cFetchList('/deployments'); }
export async function getDeployment(id: string): Promise<Deployment> { return cFetch(`/deployments/${id}`); }
export async function createDeployment(data: { team_id: string; slack_workspace_id?: string; channels?: string[] }): Promise<Deployment> {
  return cFetch('/deployments', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateDeployment(id: string, data: Partial<Deployment>): Promise<Deployment> {
  return cFetch(`/deployments/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function pauseDeployment(id: string): Promise<Deployment> {
  return cFetch(`/deployments/${id}/pause`, { method: 'POST' });
}
export async function resumeDeployment(id: string): Promise<Deployment> {
  return cFetch(`/deployments/${id}/resume`, { method: 'POST' });
}

// ═══ Slack Workspaces ═══
export async function getSlackWorkspaces(): Promise<SlackWorkspace[]> { return cFetchList('/slack-workspaces'); }
export async function createSlackWorkspace(data: { workspace_id: string; team_id: string; bot_user_id?: string; bot_token_secret_ref?: string }): Promise<SlackWorkspace> {
  return cFetch('/slack-workspaces', { method: 'POST', body: JSON.stringify(data) });
}
export async function deleteSlackWorkspace(id: string): Promise<{ ok: boolean }> {
  return cFetch(`/slack-workspaces/${id}`, { method: 'DELETE' });
}

// ═══ Tool Configs ═══
export async function getToolConfigs(): Promise<ToolConfig[]> { return cFetchList('/tool-configs'); }
export async function createToolConfig(data: { tool_name: string; config?: Record<string, unknown>; team_id?: string; enabled?: boolean }): Promise<ToolConfig> {
  return cFetch('/tool-configs', { method: 'POST', body: JSON.stringify(data) });
}
export async function updateToolConfig(id: string, data: Partial<ToolConfig>): Promise<ToolConfig> {
  return cFetch(`/tool-configs/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
}
export async function deleteToolConfig(id: string): Promise<{ ok: boolean }> {
  return cFetch(`/tool-configs/${id}`, { method: 'DELETE' });
}

// ═══ LLM Keys ═══
export async function getLlmKeys(): Promise<LlmKey[]> { return cFetchList('/llm-keys'); }
export async function createLlmKey(data: { provider: string; label?: string; key_plaintext: string }): Promise<LlmKey> {
  return cFetch('/llm-keys', { method: 'POST', body: JSON.stringify(data) });
}
export async function deleteLlmKey(id: string): Promise<{ ok: boolean }> {
  return cFetch(`/llm-keys/${id}`, { method: 'DELETE' });
}

// ═══ Tasks (audit) ═══
export async function getTasks(status?: TaskStatus): Promise<TaskSummary[]> {
  const query = status ? `?status=${status}` : '';
  return cFetchList(`/tasks${query}`);
}
export async function getTask(id: string): Promise<TaskSummary> { return cFetch(`/tasks/${id}`); }

// ═══ Approvals (audit) ═══
export async function getApprovals(): Promise<Approval[]> { return cFetchList('/approvals'); }
export async function decideApproval(id: string, approved: boolean, note?: string): Promise<Approval> {
  return cFetch(`/approvals/${id}/${approved ? 'approve' : 'reject'}`, { method: 'POST', body: JSON.stringify({ note }) });
}

// ═══ Cost (audit) ═══
export async function getCostSummary(): Promise<CostSummary> { return cFetch('/cost/summary'); }

// ═══ Observability (monitor) ═══
export async function getIntegrationHealth(): Promise<IntegrationHealth[]> { return cFetchList('/health/integrations'); }
export async function getAlerts(): Promise<ConsoleAlert[]> { return cFetchList('/alerts'); }
export async function acknowledgeAlert(id: string): Promise<ConsoleAlert> {
  return cFetch(`/alerts/${id}/acknowledge`, { method: 'POST' });
}
export async function resolveAlert(id: string): Promise<ConsoleAlert> {
  return cFetch(`/alerts/${id}/resolve`, { method: 'POST' });
}

// ═══ Benchmarks (fleet telemetry) ═══
export async function getFleetBenchmarks(metric?: string): Promise<FleetBenchmark[]> {
  const query = metric ? `?metric=${metric}` : '';
  return cFetchList(`/benchmarks${query}`);
}

// ═══ Rate Limits (monitor) ═══
export interface RateLimit { id: string; name: string; current: number; max: number; windowMs: number; }
export async function getRateLimits(): Promise<RateLimit[]> { return cFetchList('/rate-limits'); }

// ═══ Identity — users & RBAC (calls identity service directly) ═══
const IDENTITY_URL = process.env.NEXT_PUBLIC_IDENTITY_URL || 'http://localhost:3003';

async function iFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await identityFetch(`${IDENTITY_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Identity API error ${res.status}: ${body.error || 'unknown'}`);
  }
  return res.json() as Promise<T>;
}

export interface IdentityUser {
  id: string; tenantId: string; email: string; displayName: string;
  role: string; departmentId?: string; active: boolean; createdAt: number;
}
export async function getIdentityUsers(): Promise<IdentityUser[]> {
  const r = await iFetch<{ users: IdentityUser[] }>('/api/users');
  return r.users;
}
export async function updateIdentityUserRole(userId: string, role: string): Promise<IdentityUser> {
  const r = await iFetch<{ user: IdentityUser }>(`/api/rbac/users/${userId}/role`, { method: 'POST', body: JSON.stringify({ role }) });
  return r.user;
}
export async function updateIdentityUserDepartment(userId: string, departmentId: string | null): Promise<IdentityUser> {
  const r = await iFetch<{ user: IdentityUser }>(`/api/rbac/users/${userId}/department`, { method: 'PUT', body: JSON.stringify({ departmentId }) });
  return r.user;
}

// ═══ Identity — sessions ═══
export interface ActiveSession { id: string; userId: string; ipAddress?: string; userAgent?: string; createdAt: number; expiresAt: number; }
export async function getActiveSessions(): Promise<ActiveSession[]> {
  const r = await iFetch<{ sessions: ActiveSession[] }>('/api/sessions/active');
  return r.sessions ?? [];
}
export async function revokeSession(sessionId: string): Promise<void> {
  await iFetch('/api/sessions/revoke', { method: 'POST', body: JSON.stringify({ sessionId }) });
}

export {
  identityFetch,
  getAccessToken,
};

export type {
  Team,
  AgentDef,
  LlmConfig,
  Deployment,
  SlackWorkspace,
  ToolConfig,
  LlmKey,
  TaskSummary,
  TaskStatus,
  Approval,
  CostSummary,
  IntegrationHealth,
  ConsoleAlert,
  FleetBenchmark,
};
