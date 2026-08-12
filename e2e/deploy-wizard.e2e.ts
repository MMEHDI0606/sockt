import { test, expect, type Page } from '@playwright/test';

const FIXTURES = {
  workspaces: [
    { id: 'ws-1', tenant_id: 't', workspace_id: 'Acme Inc', team_id: 'T1', bot_user_id: 'B1', bot_token_secret_ref: null, installed_by: 'u', installed_at: 1700000000 },
  ],
  keys: [
    { id: 'k-1', provider: 'anthropic', label: 'Anthropic', key_prefix: 'sk-ant', created_at: 1700000000 },
  ],
};

type Captor = {
  teams: any[];
  agents: any[];
  links: { teamId: string; agentId: string }[];
  deployments: any[];
};

function corsHeaders(page: Page): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': new URL(page.url()).origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    Vary: 'Origin',
  };
}

function mockIdentity(page: Page) {
  return page.route('**/api/auth/exchange', async (route) => {
    return route.fulfill({
      status: 201,
      json: { user: { id: 'u', tenantId: 't', email: 'e@t', role: 'admin', displayName: 'E2E' }, accessToken: 'at', accessExpiresAt: Date.now() + 3600000, sessionId: 's1' },
      headers: corsHeaders(page),
    });
  });
}

function setupConsole(page: Page, captor: Captor) {
  return page.route('**/console/**', async (route) => {
    const method = route.request().method();
    const url = route.request().url();
    const c = corsHeaders(page);

    if (method === 'OPTIONS') return route.fulfill({ status: 204, headers: c });

    if (url.endsWith('/console/slack-workspaces')) {
      return route.fulfill({ json: FIXTURES.workspaces, headers: c });
    }
    if (url.endsWith('/console/llm-keys')) {
      return route.fulfill({ json: FIXTURES.keys, headers: c });
    }
    if (url.endsWith('/console/tasks')) {
      return route.fulfill({ json: [], headers: c });
    }

    if (url.endsWith('/console/teams') && method === 'POST') {
      const body = route.request().postDataJSON();
      const team = { id: 'team-1', tenant_id: 't', name: body.name, department: body.department, created_by: 'u', status: 'inactive' as const, created_at: 1, updated_at: 1 };
      captor.teams.push({ ...body });
      return route.fulfill({ json: team, headers: c });
    }
    if (url.includes('/console/teams') && method === 'GET') {
      return route.fulfill({ json: [], headers: c });
    }

    if (url.endsWith('/console/agents') && method === 'POST') {
      const body = route.request().postDataJSON();
      const id = `agent-${captor.agents.length + 1}`;
      const agent = { id, tenant_id: 't', team_id: body.team_id, name: body.name, role: body.role, system_prompt: body.system_prompt, llm_config: body.llm_config, tools: body.tools, created_at: 1, updated_at: 1 };
      captor.agents.push({ ...body });
      return route.fulfill({ json: agent, headers: c });
    }
    if (url.includes('/console/agents') && method === 'GET') {
      return route.fulfill({ json: [], headers: c });
    }

    if (/\/console\/teams\/.+\/agents$/.test(url) && method === 'POST') {
      const body = route.request().postDataJSON();
      const teamId = url.match(/\/teams\/([^/]+)\/agents/)?.[1] ?? '';
      captor.links.push({ teamId, agentId: body.agent_def_id });
      return route.fulfill({ json: {}, headers: c });
    }

    if (url.endsWith('/console/deployments') && method === 'POST') {
      const body = route.request().postDataJSON();
      const deployment = { id: 'dep-1', tenant_id: 't', team_id: body.team_id, slack_workspace_id: body.slack_workspace_id ?? null, channels: body.channels ?? [], status: 'deploying' as const, runtime_endpoint: null, last_health_at: null, created_at: 1, updated_at: 1 };
      captor.deployments.push({ ...body });
      return route.fulfill({ json: deployment, headers: c });
    }
    if (url.includes('/console/deployments') && method === 'GET') {
      return route.fulfill({ json: [], headers: c });
    }

    return route.fulfill({ json: {}, headers: c });
  });
}

test.describe('Deploy wizard — first-time flow', () => {
  test.setTimeout(90_000);

  test('walks through workspace → keys → department → channels → review → deploy', async ({ page }) => {
    const captor: Captor = { teams: [], agents: [], links: [], deployments: [] };

    await mockIdentity(page);
    await setupConsole(page, captor);

    await page.goto('/dashboard/deploy');
    await page.waitForSelector('[data-test="next"]', { timeout: 30000 });
    await expect(page.getByText('Deploy a Department')).toBeVisible();

    // workspace step: one fixture → auto-selected → Next enabled
    await page.locator('[data-test="next"]').click();

    // keys step
    await expect(page.getByText('BYOK Provider Keys')).toBeVisible();
    await page.locator('[data-test="next"]').click();

    // department step
    await expect(page.locator('[data-test="department-card"]')).toHaveCount(4);
    await page.locator('[data-test="department-card"]').first().click();
    await page.locator('[data-test="next"]').click();

    // channels step
    await page.locator('[data-test="channels"]').fill('general, growth-alerts');
    await page.locator('[data-test="next"]').click();

    // review step
    await expect(page.getByRole('heading', { name: 'Review' })).toBeVisible();
    await page.locator('[data-test="deploy"]').click();

    // success state
    await expect(page.getByText('Department deployed')).toBeVisible({ timeout: 15000 });

    // orchestration assertions
    expect(captor.teams).toHaveLength(1);
    expect(captor.teams[0].name).toBe('Growth & Lead Generation');
    expect(captor.teams[0].department).toBe('growth');

    expect(captor.agents.length).toBeGreaterThanOrEqual(2);
    for (const a of captor.agents) {
      expect(a.llm_config).toBeDefined();
      expect(a.llm_config.provider).toBe('anthropic');
      expect(a.llm_config.temperature).toBe(0.7);
      expect(a.llm_config.maxTokens).toBe(4096);
      expect(a.role).toMatch(/^(architect|worker)$/);
      expect(a.system_prompt.length).toBeGreaterThan(40);
      expect(a.tools.length).toBeGreaterThan(0);
    }

    expect(captor.links).toHaveLength(captor.agents.length);
    for (const l of captor.links) {
      expect(l.teamId).toBe('team-1');
    }

    expect(captor.deployments).toHaveLength(1);
    expect(captor.deployments[0].team_id).toBe('team-1');
    expect(captor.deployments[0].slack_workspace_id).toBe('ws-1');
    expect(captor.deployments[0].channels).toEqual(['general', 'growth-alerts']);
  });
});