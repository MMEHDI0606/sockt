export interface Team {
  id: string;
  tenant_id: string;
  name: string;
  department: string | null;
  created_by: string;
  status: 'inactive' | 'active' | 'paused';
  created_at: number;
  updated_at: number;
}

export interface AgentDef {
  id: string;
  tenant_id: string;
  team_id: string | null;
  name: string;
  role: 'architect' | 'worker';
  system_prompt: string;
  llm_config: LlmConfig;
  tools: string[];
  created_at: number;
  updated_at: number;
}

export interface LlmConfig {
  provider: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface Deployment {
  id: string;
  tenant_id: string;
  team_id: string;
  slack_workspace_id: string | null;
  channels: string[];
  status: 'deploying' | 'active' | 'paused' | 'failed';
  runtime_endpoint: string | null;
  last_health_at: number | null;
  created_at: number;
  updated_at: number;
}

export interface SlackWorkspace {
  id: string;
  tenant_id: string;
  workspace_id: string;
  team_id: string;
  bot_user_id: string | null;
  bot_token_secret_ref: string | null;
  installed_by: string;
  installed_at: number;
}

export interface ToolConfig {
  id: string;
  tenant_id: string;
  team_id: string | null;
  tool_name: string;
  config: Record<string, unknown>;
  enabled: boolean;
  created_at: number;
  updated_at: number;
}

export interface LlmKey {
  id: string;
  provider: string;
  label: string;
  key_prefix: string;
  created_at: number;
}

export interface TaskSummary {
  id: string;
  tenantId: string;
  status: TaskStatus;
  summary: string;
  costUsd: number;
  startedAt: number;
  completedAt?: number;
  hitlTier: number;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'escalated' | 'blocked' | 'cancelled';

export interface Approval {
  id: string;
  tenantId: string;
  taskId: string;
  action: string;
  tier: number;
  context: Record<string, unknown>;
  requestedAt: number;
  expiresAt: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CostSummary {
  totalUsd: number;
  byModel: Record<string, number>;
  bySkill: Record<string, number>;
}

export interface IntegrationHealth {
  integrationId: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastSeen: number;
  metrics: Record<string, number>;
}

export interface ConsoleAlert {
  id: string;
  integrationId: string;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  status: 'active' | 'acknowledged' | 'resolved';
  createdAt: number;
}

export interface FleetBenchmark {
  metric: string;
  p50: number;
  p75: number;
  p90: number;
  p99: number;
  timestamp: number;
}
