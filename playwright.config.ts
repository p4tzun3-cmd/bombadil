import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'npm run build && npm run preview -- --port 4177 --strictPort',
		port: 4177,
		reuseExistingServer: !process.env.CI,
		timeout: 30000
	},
	testDir: 'e2e',
	testMatch: '**/*.test.ts',
	use: {
		baseURL: 'http://localhost:4177'
	},
	projects: [
		{ name: 'chromium', use: { browserName: 'chromium' } }
	]
});
