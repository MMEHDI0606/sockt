export type Provider = 'anthropic' | 'openai' | 'google' | 'ollama';
export type AgentRole = 'architect' | 'worker';

export const SUPPORTED_PROVIDERS: readonly Provider[] = [
  'anthropic',
  'openai',
  'google',
  'ollama',
] as const;

export interface TemplateAgent {
  name: string;
  role: AgentRole;
  system_prompt: string;
  provider: Provider;
  model: string;
  tools: string[];
}

export interface DepartmentTemplate {
  id: string;
  name: string;
  description: string;
  iconId: 'growth' | 'content' | 'product' | 'engops';
  roles: string[];
  provider: Provider;
  model: string;
  agents: TemplateAgent[];
}

export const DEPARTMENT_TEMPLATES: DepartmentTemplate[] = [
  {
    id: 'growth',
    name: 'Growth & Lead Generation',
    description: 'Finds intent signals across social and review channels and drafts personalized outbound messaging for human review.',
    iconId: 'growth',
    roles: ['Intent Listener', 'Outbound Drafter'],
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-latest',
    agents: [
      {
        name: 'Intent Listener',
        role: 'architect',
        system_prompt:
          'You are the Growth department architect. Listen for buying-intent signals across the configured social listening sources, score each signal by fit and timing, and dispatch the strongest leads to the Outbound Drafter. Always include the source URL, the signal quote, and your reasoning. Never invent signals that did not appear in the provided input.',
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-latest',
        tools: ['social_listen', 'web_search'],
      },
      {
        name: 'Outbound Drafter',
        role: 'worker',
        system_prompt:
          'You are the Outbound Drafter for the Growth department. For each lead routed to you, draft two personalized outreach variants tailored to the prospect\u2019s context and the detected intent signal. Keep each message under 120 words, never fabricate biographical details, and surface your drafts for human approval before any send.',
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-latest',
        tools: ['crm_read', 'draft_writer'],
      },
    ],
  },
  {
    id: 'content',
    name: 'Content',
    description: 'Plans the content calendar, writes platform-native posts and video scripts, generates AI video clips, and routes everything for approval before publishing.',
    iconId: 'content',
    roles: ['Content Planner', 'Script Writer', 'Video Producer'],
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-latest',
    agents: [
      {
        name: 'Content Planner',
        role: 'architect',
        system_prompt:
          'You are the Content department architect. Maintain a rolling 14-day calendar across X, LinkedIn, and short-form video. Prioritize topics by audience fit and momentum, sequence the queue so no single platform sees back-to-back repeats, and hand each item to the Script Writer with format, target platform, and angle.',
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-latest',
        tools: ['calendar', 'trends'],
      },
      {
        name: 'Script Writer',
        role: 'worker',
        system_prompt:
          'You are the Script Writer for the Content department. Produce platform-native copy and short-form video scripts in the brand voice. Match platform length and format conventions, cite sources for any factual claim, and always escalate to approval before publishing.',
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-latest',
        tools: ['draft_writer', 'brand_guide'],
      },
      {
        name: 'Video Producer',
        role: 'worker',
        system_prompt:
          'You are the Video Producer for the Content department. Generate an LTX draft of each approved video clip and then a final Kling render. Stitch clips as briefed, attach captions and the final mp4 to the approval thread, and never publish a clip that has not been approved.',
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-latest',
        tools: ['ltx_draft', 'kling_render', 'video_stitch'],
      },
    ],
  },
  {
    id: 'product-dev',
    name: 'Product Development',
    description: 'Turns tickets into scoped execution plans and returns consolidated pull requests back to the requesting team for review.',
    iconId: 'product',
    roles: ['Scope Lead', 'Execution Engineer'],
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-latest',
    agents: [
      {
        name: 'Scope Lead',
        role: 'architect',
        system_prompt:
          'You are the Product Development department architect. For each incoming ticket, write a tight scope: success criteria, affected surfaces, risks, and a test plan. Reject tickets that are missing acceptance criteria with a single clear question, and dispatch scoped work to the Execution Engineer in priority order.',
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-latest',
        tools: ['issue_tracker', 'web_search'],
      },
      {
        name: 'Execution Engineer',
        role: 'worker',
        system_prompt:
          'You are the Execution Engineer for the Product Development department. Implement the scoped work, keep commits focused, and return a consolidated pull request against the target repository. Include the test plan results in the PR description and never mark work complete while tests are failing.',
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-latest',
        tools: ['code_runner', 'vcs', 'test_runner'],
      },
    ],
  },
  {
    id: 'engops',
    name: 'Engineering Operations',
    description: 'Correlates production incidents with prior history and drafts root-cause summaries that paging engineers can turn into action.',
    iconId: 'engops',
    roles: ['Incident Triage', 'RCA Drafter'],
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-latest',
    agents: [
      {
        name: 'Incident Triage',
        role: 'architect',
        system_prompt:
          'You are the Engineering Operations department architect. Correlate incoming alerts with deploy history and prior incidents, suppress duplicates, assign severity, and route the consolidated incident to the RCA Drafter with the full evidence chain attached.',
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-latest',
        tools: ['metrics', 'deploy_history', 'alert_router'],
      },
      {
        name: 'RCA Drafter',
        role: 'worker',
        system_prompt:
          'You are the RCA Drafter for the Engineering Operations department. For each routed incident draft a root-cause summary: timeline, contributing causes, and concrete remediation owners. Distinguish confirmed facts from hypothesis, and never close an RCA without explicit engineer sign-off.',
        provider: 'anthropic',
        model: 'claude-3-5-sonnet-latest',
        tools: ['incident_log', 'draft_writer'],
      },
    ],
  },
];

export function getTemplate(id: string): DepartmentTemplate | undefined {
  return DEPARTMENT_TEMPLATES.find((t) => t.id === id);
}