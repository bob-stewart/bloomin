import { defineConfig, devices } from '@playwright/test';

const hostResolverRules = [
  'MAP bloomin-production.up.railway.app 127.0.0.1',
  'MAP bloomin.institute 127.0.0.1',
  'MAP www.bloomin.institute 127.0.0.1',
  'MAP bloomin.foundation 127.0.0.1',
  'MAP www.bloomin.foundation 127.0.0.1',
  'MAP bloom.giving 127.0.0.1',
  'MAP www.bloom.giving 127.0.0.1',
  'MAP bloom.gdn 127.0.0.1',
  'MAP www.bloom.gdn 127.0.0.1'
].join(',');

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  webServer: {
    command: 'npm start',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000
  },
  use: {
    launchOptions: {
      args: [`--host-resolver-rules=${hostResolverRules}`]
    },
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 1000 }
      }
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 7']
      }
    }
  ]
});
