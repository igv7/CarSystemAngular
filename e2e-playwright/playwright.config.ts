import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, devices, PlaywrightTestProject } from '@playwright/test';
import { APP_BASE_URL } from './support/env';

/** The production build, made by `ng build --prod` in the project root. */
const DIST_INDEX = path.resolve(__dirname, '../dist/CarSystemAngular/index.html');
const PROD_PORT = 4400;
const hasProdBuild = fs.existsSync(DIST_INDEX);

/**
 * Projects:
 * - `mocked`: every backend call is answered by MockBackend (page.route), so the Spring server is not needed.
 *   Desktop Chrome.
 * - `firefox`, `webkit`: the same mocked tests in Firefox and WebKit (Safari's engine).
 * - `mobile-chrome`, `mobile-safari`: phone-sized checks (tests/mobile), mocked, on a Pixel 7 and an iPhone 14.
 * - `quality`: accessibility (axe) and visual regression (screenshot baselines), Chrome.
 * - `tools`: log-server.js on its own, no browser.
 * - `prod-build`: the mocked tests against the production build, served on :4400 (only when dist/ exists).
 * - `real-backend`: smoke tests and admin flows against the real backend on :8080; they create and delete
 *   their own data.
 *
 * All but `tools` and `prod-build` expect the Angular dev server on :4200 already running (`npm start` in the
 * project root, on Node 14).
 */
const prodProject: PlaywrightTestProject[] = hasProdBuild ? [{
  name: 'prod-build',
  testDir: './tests',
  testMatch: /[\\/](mocked|prod)[\\/].*\.spec\.ts$/,
  // The production build sends no logs (environment.prod.ts has no log server), so the specs that read
  // the logs don't apply to it.
  testIgnore: /[\\/](logging|remaining-ui)\.spec\.ts$/,
  use: { ...devices['Desktop Chrome'], baseURL: `http://localhost:${PROD_PORT}` },
}] : [];

export default defineConfig({
  testDir: './tests',
  globalSetup: './support/global-setup.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // `ng serve` builds lazily and slowly on first load; keep the parallel load moderate.
  workers: process.env.CI ? 2 : 4,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  // Serves dist/ for the prod-build project; a tiny static server, started and stopped by Playwright.
  webServer: hasProdBuild ? {
    command: 'node support/serve-dist.js',
    url: `http://localhost:${PROD_PORT}`,
    env: { PROD_PORT: String(PROD_PORT) },
    reuseExistingServer: true,
  } : undefined,
  use: {
    baseURL: APP_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mocked',
      testDir: './tests/mocked',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testDir: './tests/mocked',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testDir: './tests/mocked',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-chrome',
      testDir: './tests/mobile',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-safari',
      testDir: './tests/mobile',
      use: { ...devices['iPhone 14'] },
    },
    {
      // Accessibility (axe) and visual regression (screenshot baselines), mocked backend, Chrome only.
      name: 'quality',
      testDir: './tests/quality',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // No browser: tests of the project's Node scripts (log-server.js).
      name: 'tools',
      testDir: './tests/tools',
    },
    ...prodProject,
    {
      name: 'real-backend',
      testDir: './tests/real',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
