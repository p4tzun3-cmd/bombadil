import { test, expect } from '@playwright/test';

test.describe('Quiz Game Flow', () => {
	test('shows launcher on start', async ({ page }) => {
		await page.goto('/');
		await expect(page.locator('h1', { hasText: 'Bombadil' })).toBeVisible();
		await expect(page.getByRole('button', { name: /OCM Demo-Quiz/ })).toBeVisible();
	});

	test('navigates from launcher to intro to board', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /OCM Demo-Quiz/ }).click();
		await expect(page.getByRole('button', { name: /Start/ })).toBeVisible();
		await page.getByRole('button', { name: /Start/ }).click();
		await expect(page.getByText('Rechnerraten')).toBeVisible();
		await expect(page.getByText('Wissen')).toBeVisible();
		await expect(page.getByText('Risiko')).toBeVisible();
		await expect(page.getByText('Multiple Choice')).toBeVisible();
	});

	test('plays a solution question through full cycle', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /OCM Demo-Quiz/ }).click();
		await page.getByRole('button', { name: /Start/ }).click();

		// Click first card (128 points)
		await page.getByRole('button', { name: '128' }).first().click();

		// MEDIA step — press Enter
		await page.keyboard.press('Enter');

		// ANSWER step
		await expect(page.getByText('Commodore 64')).toBeVisible();
		await page.keyboard.press('Enter');

		// SCORING step
		await expect(page.getByText('Punkte vergeben')).toBeVisible();
		await page.keyboard.press('1');
		await page.keyboard.press('Enter');

		// Back to board
		await expect(page.getByText('Rechnerraten')).toBeVisible();
	});

	test('esc on first step returns to board without marking done', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /OCM Demo-Quiz/ }).click();
		await page.getByRole('button', { name: /Start/ }).click();

		await page.getByRole('button', { name: '128' }).first().click();
		await page.keyboard.press('Escape');

		await expect(page.getByText('Rechnerraten')).toBeVisible();
		// Card should still be clickable (not done)
		await expect(page.getByRole('button', { name: '128' }).first()).toBeVisible();
	});

	test('estimation question shows prompt first', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /OCM Demo-Quiz/ }).click();
		await page.getByRole('button', { name: /Start/ }).click();

		// Click second column first card (Wissen = estimation)
		await page.getByRole('button', { name: '128' }).nth(1).click();

		await expect(page.getByText(/OCM gegründet/)).toBeVisible();
	});

	test('multiplechoice question shows options', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /OCM Demo-Quiz/ }).click();
		await page.getByRole('button', { name: /Start/ }).click();

		// Click 4th column first card (Multiple Choice)
		await page.getByRole('button', { name: '128' }).nth(3).click();

		// PROMPT
		await expect(page.getByText(/Prozessor.*C64/)).toBeVisible();
		await page.keyboard.press('Enter');

		// OPTIONS
		await expect(page.getByText('Zilog Z80')).toBeVisible();
		await expect(page.getByText('MOS 6510')).toBeVisible();
	});

	test('round end shows scores and returns to launcher', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /OCM Demo-Quiz/ }).click();
		await page.getByRole('button', { name: /Start/ }).click();

		await page.getByRole('button', { name: /Runde beenden/ }).click();
		await expect(page.getByText('Zwischenstand')).toBeVisible();

		await page.getByRole('button', { name: /Weiter/ }).click();
		await expect(page.locator('h1', { hasText: 'Bombadil' })).toBeVisible();
	});

	test('keyboard a toggles animations without crash', async ({ page }) => {
		await page.goto('/');
		await page.getByRole('button', { name: /OCM Demo-Quiz/ }).click();
		await page.getByRole('button', { name: /Start/ }).click();

		await page.keyboard.press('a');
		await expect(page.getByText('Rechnerraten')).toBeVisible();
	});
});
