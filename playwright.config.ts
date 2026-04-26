import { defineConfig } from '@playwright/test';

export default defineConfig({
	testDir: './tests',
	// These tests are pure Node.js file validation — no browser needed.
	// Playwright will not launch a browser since no test requests the `page` fixture.
});
