import { test, expect, describe } from 'bun:test';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import DeployWizard from './DeployWizard';
import type { SlackWorkspace, LlmKey } from '@/lib/console/types';
import type { DeployDepartmentInput } from '@/lib/departments/deploy';

function ws(id: string, name: string): SlackWorkspace {
  return {
    id,
    tenant_id: 't',
    workspace_id: name,
    team_id: 't',
    bot_user_id: null,
    bot_token_secret_ref: null,
    installed_by: 'u',
    installed_at: 1,
  };
}

function key(id: string, provider: string, label: string): LlmKey {
  return {
    id,
    provider,
    label,
    key_prefix: 'sk-',
    created_at: 1,
  };
}

interface RenderResult {
  container: HTMLElement;
  rerender: (next: React.ReactNode) => void;
  unmount: () => void;
}

function render(node: React.ReactNode): RenderResult {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(node);
  });
  return {
    container,
    rerender: (next: React.ReactNode) => act(() => root.render(next)),
    unmount: () =>
      act(() => {
        root.unmount();
        container.remove();
      }),
  };
}

function findByText(container: HTMLElement, needle: string): HTMLElement | null {
  const all = Array.from(container.querySelectorAll('button,h1,h2,h3,div,span,label,a,li,p'));
  return all.find((el) => (el.textContent ?? '').trim() === needle) as HTMLElement | null;
}

function clickByText(container: HTMLElement, text: string) {
  const el = findByText(container, text);
  if (!el) throw new Error(`cannot find element with text "${text}"`);
  act(() => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

function clickByTest(container: HTMLElement, testId: string) {
  const el = container.querySelector(`[data-test="${testId}"]`) as HTMLElement;
  if (!el) throw new Error(`cannot find [data-test="${testId}"]`);
  act(() => {
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

function setNativeInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')!.set!;
  setter.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function clickCard(container: HTMLElement, idx: number) {
  const card = container.querySelectorAll('[data-test="department-card"]')[idx] as HTMLElement;
  if (!card) throw new Error(`no department card at index ${idx}`);
  act(() => {
    card.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

const noOpHref = '/dashboard/configure/slack';

function defaultProps(overrides: Partial<Parameters<typeof DeployWizard>[0]> = {}) {
  return {
    workspaces: [] as SlackWorkspace[],
    keys: [] as LlmKey[],
    onDeploy: async () => {},
    deploying: false,
    error: null,
    configureSlackHref: '/dashboard/configure/slack',
    configureKeysHref: '/dashboard/configure/keys',
    ...overrides,
  };
}

describe('DeployWizard', () => {
  test('renders the Workspaces step first', () => {
    const { container, unmount } = render(<DeployWizard {...defaultProps()} />);
    expect(container.textContent).toContain('Workspaces');
    expect(container.textContent).toContain('Connect Slack');
    unmount();
  });

  test('blocks advancement when no Slack workspace is connected', () => {
    const { container, unmount } = render(
      <DeployWizard {...defaultProps({ workspaces: [], keys: [key('k1', 'anthropic', 'x')] })} />,
    );
    const next = container.querySelector('button[data-test="next"]') as HTMLButtonElement;
    expect(next).toBeTruthy();
    expect(next.disabled).toBe(true);
    const link = container.querySelector(
      `a[href="/dashboard/configure/slack"]`,
    ) as HTMLAnchorElement;
    expect(link).toBeTruthy();
    unmount();
  });

  test('reveals the Keys step after selecting a workspace and blocks when no BYOK key', () => {
    const workspaces = [ws('w1', 'Acme Inc')];
    const { container, unmount } = render(
      <DeployWizard {...defaultProps({ workspaces, keys: [] })} />,
    );
    const next = container.querySelector('button[data-test="next"]') as HTMLButtonElement;
    expect(next.disabled).toBe(false);
    clickByTest(container, 'next');
    expect(container.textContent).toContain('Keys');
    const next2 = container.querySelector('button[data-test="next"]') as HTMLButtonElement;
    expect(next2.disabled).toBe(true);
    const link = container.querySelector(
      'a[href="/dashboard/configure/keys"]',
    ) as HTMLAnchorElement;
    expect(link).toBeTruthy();
    unmount();
  });

  test('shows exactly four department templates on the Department step', () => {
    const workspaces = [ws('w1', 'Acme')];
    const keys = [key('k1', 'anthropic', 'Anthropic')];
    const { container, unmount } = render(
      <DeployWizard {...defaultProps({ workspaces, keys })} />,
    );
    clickByTest(container, 'next'); // -> Keys
    clickByTest(container, 'next'); // -> Department
    const cards = container.querySelectorAll('[data-test="department-card"]');
    expect(cards.length).toBe(4);
    const names = Array.from(cards).map((c) => c.getAttribute('data-id'));
    expect(names.sort()).toEqual(['content', 'engops', 'growth', 'product-dev']);
    unmount();
  });

  test('requires selecting a department before Next', () => {
    const workspaces = [ws('w1', 'Acme')];
    const keys = [key('k1', 'anthropic', 'Anthropic')];
    const { container, unmount } = render(
      <DeployWizard {...defaultProps({ workspaces, keys })} />,
    );
    clickByTest(container, 'next');
    clickByTest(container, 'next');
    const next = container.querySelector('button[data-test="next"]') as HTMLButtonElement;
    expect(next.disabled).toBe(true);
    clickCard(container, 0);
    const next2 = container.querySelector('button[data-test="next"]') as HTMLButtonElement;
    expect(next2.disabled).toBe(false);
    unmount();
  });

  test('Back returns to the previous step', () => {
    const workspaces = [ws('w1', 'Acme')];
    const keys = [key('k1', 'anthropic', 'Anthropic')];
    const { container, unmount } = render(
      <DeployWizard {...defaultProps({ workspaces, keys })} />,
    );
    clickByTest(container, 'next');
    clickByTest(container, 'back');
    expect(container.textContent).toContain('Workspaces');
    unmount();
  });

  test('on Deploy, calls onDeploy with template id, provider, model, workspace and channels', async () => {
    const workspaces = [ws('w1', 'Acme')];
    const keys = [key('k1', 'anthropic', 'Anthropic')];
    let captured: DeployDepartmentInput | null = null;
    const onDeploy = async (input: DeployDepartmentInput) => {
      captured = input;
    };
    const { container, unmount } = render(
      <DeployWizard {...defaultProps({ workspaces, keys, onDeploy })} />,
    );
    clickByTest(container, 'next'); // -> Keys
    clickByTest(container, 'next'); // -> Department
    clickCard(container, 2); // product-dev
    clickByTest(container, 'next'); // -> Channels
    const input = container.querySelector('input[data-test="channels"]') as HTMLInputElement;
    expect(input).toBeTruthy();
    act(() => {
      setNativeInputValue(input, 'incidents, #ops');
    });
    clickByTest(container, 'next'); // -> Review
    expect(container.textContent).toContain('Review');
    const deploy = container.querySelector('button[data-test="deploy"]') as HTMLButtonElement;
    expect(deploy).toBeTruthy();
    await act(async () => {
      deploy.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(captured).not.toBeNull();
    expect(captured!.templateId).toBe('product-dev');
    expect(captured!.provider).toBe('anthropic');
    expect(captured!.model.length).toBeGreaterThan(0);
    expect(captured!.slackWorkspaceId).toBe('w1');
    expect(captured!.channels).toEqual(['incidents', '#ops']);
    unmount();
  });

  test('shows the supplied error message', () => {
    const workspaces = [ws('w1', 'Acme')];
    const keys = [key('k1', 'anthropic', 'Anthropic')];
    const { container, unmount } = render(
      <DeployWizard
        {...defaultProps({ workspaces, keys, error: 'deploy failed: no quota' })}
      />,
    );
    expect(container.textContent).toContain('deploy failed: no quota');
    unmount();
  });

  test('disables Deploy button while deploying', () => {
    const workspaces = [ws('w1', 'Acme')];
    const keys = [key('k1', 'anthropic', 'Anthropic')];
    const { container, unmount } = render(
      <DeployWizard
        {...defaultProps({ workspaces, keys, deploying: true })}
      />,
    );
    clickByTest(container, 'next');
    clickByTest(container, 'next');
    clickCard(container, 0);
    clickByTest(container, 'next');
    clickByTest(container, 'next'); // -> Review
    const deploy = container.querySelector('button[data-test="deploy"]') as HTMLButtonElement;
    expect(deploy.disabled).toBe(true);
    unmount();
  });

  test('uses template default provider/model (anthropic/claude) for all four templates', async () => {
    const workspaces = [ws('w1', 'Acme')];
    const keys = [key('k1', 'anthropic', 'Anthropic')];
    for (let i = 0; i < 4; i++) {
      let captured: DeployDepartmentInput | null = null;
      const onDeploy = async (input: DeployDepartmentInput) => {
        captured = input;
      };
      const { container, unmount } = render(
        <DeployWizard {...defaultProps({ workspaces, keys, onDeploy })} />,
      );
      clickByTest(container, 'next');
      clickByTest(container, 'next');
      clickCard(container, i);
      clickByTest(container, 'next');
      clickByTest(container, 'next'); // -> Review
      const deploy = container.querySelector('button[data-test="deploy"]') as HTMLButtonElement;
      await act(async () => {
        deploy.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      });
      expect(captured!.provider).toBe('anthropic');
      unmount();
    }
  });
});