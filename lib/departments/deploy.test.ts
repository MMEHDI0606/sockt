import { test, expect, describe, mock, beforeEach } from 'bun:test';
import { deployDepartment, type DeployApi } from './deploy';
import type { Team, AgentDef, Deployment } from '@/lib/console/types';
import { DEPARTMENT_TEMPLATES, getTemplate } from './templates';

function makeTeam(id: string, name: string, department: string): Team {
  return {
    id,
    tenant_id: 't',
    name,
    department,
    created_by: 'u',
    status: 'inactive',
    created_at: 1,
    updated_at: 1,
  };
}

function makeAgent(id: string, teamId: string, name: string): AgentDef {
  return {
    id,
    tenant_id: 't',
    team_id: teamId,
    name,
    role: 'worker',
    system_prompt: 'p',
    llm_config: { provider: 'anthropic', model: 'm' },
    tools: [],
    created_at: 1,
    updated_at: 1,
  };
}

function makeDeployment(id: string, teamId: string): Deployment {
  return {
    id,
    tenant_id: 't',
    team_id: teamId,
    slack_workspace_id: null,
    channels: [],
    status: 'deploying',
    runtime_endpoint: null,
    last_health_at: null,
    created_at: 1,
    updated_at: 1,
  };
}

function makeApi(): DeployApi & {
  createTeam: ReturnType<typeof mock>;
  createAgent: ReturnType<typeof mock>;
  linkAgentToTeam: ReturnType<typeof mock>;
  createDeployment: ReturnType<typeof mock>;
} {
  return {
    createTeam: mock(async (data: { name: string; department?: string }) =>
      makeTeam('team_1', data.name, data.department ?? ''),
    ),
    createAgent: mock(async () => makeAgent('agent_1', 'team_1', 'a')),
    linkAgentToTeam: mock(async () => undefined),
    createDeployment: mock(async (data: { team_id: string }) =>
      makeDeployment('dep_1', data.team_id),
    ),
  };
}

describe('deployDepartment', () => {
  let api: ReturnType<typeof makeApi>;

  beforeEach(() => {
    api = makeApi();
  });

  test('creates exactly one team named for the template with department set to template id', async () => {
    const tpl = getTemplate('growth')!;
    await deployDepartment(api, {
      templateId: 'growth',
      provider: tpl.provider,
      model: tpl.model,
    });
    expect(api.createTeam).toHaveBeenCalledTimes(1);
    expect(api.createTeam.mock.calls[0][0]).toEqual({
      name: tpl.name,
      department: tpl.id,
    });
  });

  test('creates one agent per template agent and links each to the team', async () => {
    const tpl = getTemplate('content')!;
    const createdTeam = makeTeam('team_x', tpl.name, tpl.id);
    api.createTeam.mockImplementation(async () => ({ ...createdTeam }));
    let i = 0;
    api.createAgent.mockImplementation(async () =>
      makeAgent(`a_${++i}`, 'team_x', 'a'),
    );

    const res = await deployDepartment(api, {
      templateId: 'content',
      provider: tpl.provider,
      model: tpl.model,
    });

    expect(api.createAgent).toHaveBeenCalledTimes(tpl.agents.length);
    expect(api.linkAgentToTeam).toHaveBeenCalledTimes(tpl.agents.length);
    expect(res.agents).toHaveLength(tpl.agents.length);
    for (const call of api.linkAgentToTeam.mock.calls) {
      expect(call[0]).toBe('team_x');
    }
    expect(new Set(api.linkAgentToTeam.mock.calls.map((c: string[]) => c[1])).size).toBe(
      tpl.agents.length,
    );
  });

  test('passes llm_config with provider/model and agent role/prompt/tools', async () => {
    const tpl = getTemplate('product-dev')!;
    const createdTeam = makeTeam('team_y', tpl.name, tpl.id);
    api.createTeam.mockImplementation(async () => ({ ...createdTeam }));
    api.createAgent.mockImplementation(async () => makeAgent('a1', 'team_y', 'a'));

    await deployDepartment(api, {
      templateId: 'product-dev',
      provider: 'openai',
      model: 'gpt-4o',
    });

    for (const [payload] of api.createAgent.mock.calls) {
      const ta = tpl.agents.find((a) => a.name === payload.name);
      expect(ta).toBeDefined();
      expect(payload.role).toBe(ta!.role);
      expect(payload.system_prompt).toBe(ta!.system_prompt);
      expect(payload.tools).toEqual(ta!.tools);
      expect(payload.llm_config).toEqual({
        provider: 'openai',
        model: 'gpt-4o',
        temperature: 0.7,
        maxTokens: 4096,
      });
    }
  });

  test('forwards slack workspace + channels to createDeployment', async () => {
    const tpl = getTemplate('engops')!;
    const createdTeam = makeTeam('team_z', tpl.name, tpl.id);
    api.createTeam.mockImplementation(async () => ({ ...createdTeam }));
    api.createAgent.mockImplementation(async () => makeAgent('a', 'team_z', 'a'));

    await deployDepartment(api, {
      templateId: 'engops',
      provider: tpl.provider,
      model: tpl.model,
      slackWorkspaceId: 'ws_42',
      channels: ['incidents', '#ops'],
    });

    expect(api.createDeployment).toHaveBeenCalledTimes(1);
    expect(api.createDeployment.mock.calls[0][0]).toEqual({
      team_id: 'team_z',
      slack_workspace_id: 'ws_42',
      channels: ['incidents', '#ops'],
    });
  });

  test('omits channels when none provided', async () => {
    const tpl = getTemplate('growth')!;
    api.createTeam.mockImplementation(async () => makeTeam('team_a', tpl.name, tpl.id));
    api.createAgent.mockImplementation(async () => makeAgent('a', 'team_a', 'a'));

    await deployDepartment(api, {
      templateId: 'growth',
      provider: tpl.provider,
      model: tpl.model,
    });

    expect(api.createDeployment.mock.calls[0][0].channels).toBeUndefined();
    expect(api.createDeployment.mock.calls[0][0].slack_workspace_id).toBeUndefined();
  });

  test('returns team, agents, and deployment', async () => {
    const tpl = getTemplate('growth')!;
    api.createTeam.mockImplementation(async () => makeTeam('tt', tpl.name, tpl.id));
    api.createAgent.mockImplementation(async () => makeAgent('aa', 'tt', 'a'));
    api.createDeployment.mockImplementation(async () => makeDeployment('dd', 'tt'));

    const res = await deployDepartment(api, {
      templateId: 'growth',
      provider: tpl.provider,
      model: tpl.model,
    });
    expect(res.team.id).toBe('tt');
    expect(res.agents).toHaveLength(tpl.agents.length);
    expect(res.deployment.id).toBe('dd');
  });

  test('throws when template id is unknown', async () => {
    await expect(
      deployDepartment(api, {
        templateId: 'nonexistent',
        provider: 'anthropic',
        model: 'm',
      }),
    ).rejects.toThrow(/unknown department template/i);
    expect(api.createTeam).not.toHaveBeenCalled();
  });

  test('propagates error when createTeam fails', async () => {
    api.createTeam.mockImplementation(async () => {
      throw new Error('boom');
    });
    await expect(
      deployDepartment(api, {
        templateId: 'growth',
        provider: 'anthropic',
        model: 'm',
      }),
    ).rejects.toThrow('boom');
    expect(api.createAgent).not.toHaveBeenCalled();
  });

  test('works for all four templates', async () => {
    for (const tpl of DEPARTMENT_TEMPLATES) {
      const a = makeApi();
      const res = await deployDepartment(a, {
        templateId: tpl.id,
        provider: tpl.provider,
        model: tpl.model,
      });
      expect(res.agents.length).toBe(tpl.agents.length);
      expect(a.createTeam).toHaveBeenCalledTimes(1);
      expect(a.createDeployment).toHaveBeenCalledTimes(1);
    }
  });
});