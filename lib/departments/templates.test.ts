import { test, expect, describe } from 'bun:test';
import {
  DEPARTMENT_TEMPLATES,
  getTemplate,
  SUPPORTED_PROVIDERS,
  type DepartmentTemplate,
} from './templates';

describe('DEPARTMENT_TEMPLATES', () => {
  test('ships exactly four templates with stable ids', () => {
    expect(DEPARTMENT_TEMPLATES.map((t) => t.id).sort()).toEqual(
      ['content', 'engops', 'growth', 'product-dev'].sort(),
    );
    expect(DEPARTMENT_TEMPLATES).toHaveLength(4);
  });

  test('every template has non-empty name, description, roles, and iconId', () => {
    for (const t of DEPARTMENT_TEMPLATES) {
      expect(typeof t.id).toBe('string');
      expect(t.id.length).toBeGreaterThan(0);
      expect(t.name.length).toBeGreaterThan(0);
      expect(t.description.length).toBeGreaterThan(0);
      expect(t.iconId.length).toBeGreaterThan(0);
      expect(Array.isArray(t.roles)).toBe(true);
      expect(t.roles.length).toBeGreaterThan(0);
      for (const r of t.roles) expect(r.length).toBeGreaterThan(0);
    }
  });

  test('every template ships at least one architect and one worker', () => {
    for (const t of DEPARTMENT_TEMPLATES) {
      const roles = t.agents.map((a) => a.role);
      expect(roles).toContain('architect');
      expect(roles).toContain('worker');
      expect(t.agents.length).toBeGreaterThanOrEqual(2);
    }
  });

  test('agent system prompts are non-empty', () => {
    for (const t of DEPARTMENT_TEMPLATES) {
      for (const a of t.agents) {
        expect(a.system_prompt.length).toBeGreaterThan(40);
        expect(a.name.length).toBeGreaterThan(0);
      }
    }
  });

  test('provider(s) on template agents are within the supported set', () => {
    expect(SUPPORTED_PROVIDERS.length).toBeGreaterThan(0);
    for (const t of DEPARTMENT_TEMPLATES) {
      expect(t.provider).toBeDefined();
      expect(SUPPORTED_PROVIDERS).toContain(t.provider);
      for (const a of t.agents) {
        expect(SUPPORTED_PROVIDERS).toContain(a.provider);
        expect(a.model.length).toBeGreaterThan(0);
        expect(Array.isArray(a.tools)).toBe(true);
      }
    }
  });

  test('each template declares a default provider + model used when seeding', () => {
    for (const t of DEPARTMENT_TEMPLATES) {
      expect(t.provider.length).toBeGreaterThan(0);
      expect(t.model.length).toBeGreaterThan(0);
    }
  });

  test('DepartmentTemplate type narrows provider to supported set', () => {
    const t: DepartmentTemplate = DEPARTMENT_TEMPLATES[0];
    expect(SUPPORTED_PROVIDERS).toContain(t.provider);
  });
});

describe('getTemplate', () => {
  test('returns matching template', () => {
    const t = getTemplate('growth');
    expect(t).toBeDefined();
    expect(t?.name.toLowerCase()).toContain('growth');
  });

  test('returns undefined for unknown id', () => {
    expect(getTemplate('nonexistent')).toBeUndefined();
  });
});