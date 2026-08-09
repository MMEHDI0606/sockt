import type { Team, AgentDef, Deployment } from '@/lib/console/types';
import { getTemplate, type Provider } from './templates';

export interface DeployApi {
  createTeam(data: { name: string; department?: string }): Promise<Team>;
  createAgent(
    data: Omit<AgentDef, 'id' | 'tenant_id' | 'created_at' | 'updated_at'>,
  ): Promise<AgentDef>;
  linkAgentToTeam(teamId: string, agentDefId: string): Promise<void>;
  createDeployment(data: {
    team_id: string;
    slack_workspace_id?: string;
    channels?: string[];
  }): Promise<Deployment>;
}

export interface DeployDepartmentInput {
  templateId: string;
  provider: Provider;
  model: string;
  slackWorkspaceId?: string;
  channels?: string[];
}

export interface DeployDepartmentResult {
  team: Team;
  agents: AgentDef[];
  deployment: Deployment;
}

const DEFAULT_TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 4096;

export async function deployDepartment(
  api: DeployApi,
  input: DeployDepartmentInput,
): Promise<DeployDepartmentResult> {
  const template = getTemplate(input.templateId);
  if (!template) {
    throw new Error(`Unknown department template: ${input.templateId}`);
  }

  const team = await api.createTeam({
    name: template.name,
    department: template.id,
  });

  const llm_config = {
    provider: input.provider,
    model: input.model,
    temperature: DEFAULT_TEMPERATURE,
    maxTokens: DEFAULT_MAX_TOKENS,
  };

  const agents: AgentDef[] = [];
  for (const ta of template.agents) {
    const agent = await api.createAgent({
      team_id: team.id,
      name: ta.name,
      role: ta.role,
      system_prompt: ta.system_prompt,
      llm_config,
      tools: ta.tools,
    });
    await api.linkAgentToTeam(team.id, agent.id);
    agents.push(agent);
  }

  const deploymentData: {
    team_id: string;
    slack_workspace_id?: string;
    channels?: string[];
  } = { team_id: team.id };
  if (input.slackWorkspaceId) deploymentData.slack_workspace_id = input.slackWorkspaceId;
  if (input.channels && input.channels.length > 0) deploymentData.channels = input.channels;

  const deployment = await api.createDeployment(deploymentData);

  return { team, agents, deployment };
}