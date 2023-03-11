import type { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  webServer: {
    command: 'npm run build && npm run start',
    port: 3000
  },
  testDir: 'tests'
};

export default config;
