import { defineConfig, devices } from '@playwright/test';

const BASE_WEB_URL = process.env.WEMINE_WEB_URL || 'https://wemineoffice.example.com';
const BASE_API_URL = process.env.WEMINE_API_URL || 'https://api.wemine.example.com';

export default defineConfig({
  timeout: 60000,
  expect: {
    timeout: 15000
  },
  use: {
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'web',
      testDir: './web/tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BASE_WEB_URL
      }
    },
    {
      name: 'api',
      testDir: './api/tests',
      use: {
        baseURL: BASE_API_URL
      }
    }
  ],
  reporter: [['list'], ['html', { outputFolder: 'reports/playwright-html' }]]
});