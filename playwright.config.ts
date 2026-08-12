import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.e2e.ts',
  timeout: 60_000,
  use: { baseURL: 'http://localhost:3000' },
  retries: 0,
  workers: 1,
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:65535',
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'dummy-anon-key',
      NEXT_PUBLIC_CONSOLE_API_URL: 'http://localhost:8080/console',
      NEXT_PUBLIC_IDENTITY_URL: 'http://localhost:3003',
    },
  },
});