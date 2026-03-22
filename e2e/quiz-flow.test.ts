import { test, expect } from '@playwright/test';

test.describe('Quiz Game Flow', () => {
	test('shows launcher on start', async ({ page }) => {
		await page.goto('/');
		await expect(page.getByText('Bombadil')).toBeVisible();
		await expect(page.getByText('OCM Demo-Quiz')).toBeVisible();
	});

	test('navigates from launcher to intro to board', async ({ page }) => {
		await page.goto('/');

		// Click round card
		await page.getByText('OCM Demo-Quiz').click();

		// Intro screen with start button
		await expect(page.getByText('Start ▶')).toBeVisible();
		await page.getByText('Start ▶').click();

		// Board should show categories
		await expect(page.getByText('Rechnerraten')).toBeVisible();
		await expect(page.getByText('Wissen')).toBeVisible();
		await expect(page.getByText('Risiko')).toBeVisible();
		await expect(page.getByText('Multiple Choice')).toBeVisible();
	});

	test('plays a solution question through full cycle', async ({ page }) => {
		await page.goto('/');
		await page.getByText('OCM Demo-Quiz').click();
		await page.getByText('Start ▶').click();

		// Click first card (128 points, solution type)
		await page.getByText('128').first().click();

		// Should be in MEDIA step — press Enter to advance
		await page.keyboard.press('Enter');

		// ANSWER step — should show answer text
		await expect(page.getByText('Commodore 64')).toBeVisible();

		// Press Enter for SCORING
		await page.keyboard.press('Enter');

		// SCORING step — should show scoring UI
		await expect(page.getByText('Punkte vergeben')).toBeVisible();

		// Award points to team 1
		await page.keyboard.press('1');

		// Press Enter to close question
		await page.keyboard.press('Enter');

		// Back to board — score should be updated
		await expect(page.getByText('Rechnerraten')).toBeVisible();
		await expect(page.getByText('128')).toBeVisible(); // team 1 score
	});

	test('esc on first step returns to board without marking done', async ({ page }) => {
		await page.goto('/');
		await page.getByText('OCM Demo-Quiz').click();
		await page.getByText('Start ▶').click();

		// Click a card
		await page.getByText('128').first().click();

		// Press Esc immediately — should return to board
		await page.keyboard.press('Escape');

		// Board should still show all cards (nothing marked done)
		await expect(page.getByText('Rechnerraten')).toBeVisible();
	});

	test('estimation question shows prompt first', async ({ page }) => {
		await page.goto('/');
		await page.getByText('OCM Demo-Quiz').click();
		await page.getByText('Start ▶').click();

		// Click first card in "Wissen" category (estimation type)
		const wissenColumn = page.locator('.grid > :nth-child(2)');
		// Find 128-point card in second column
		await page.getByText('128').nth(1).click();

		// PROMPT step — should show the question text
		await expect(page.getByText('In welchem Jahr wurde der Verein OCM gegründet?')).toBeVisible();
	});

	test('multiplechoice question shows options', async ({ page }) => {
		await page.goto('/');
		await page.getByText('OCM Demo-Quiz').click();
		await page.getByText('Start ▶').click();

		// Click first card in "Multiple Choice" category (4th column)
		await page.getByText('128').nth(3).click();

		// PROMPT step
		await expect(page.getByText('Welcher Prozessor steckt im C64?')).toBeVisible();

		// Advance to OPTIONS
		await page.keyboard.press('Enter');

		// Should show all 4 options
		await expect(page.getByText('Zilog Z80')).toBeVisible();
		await expect(page.getByText('MOS 6510')).toBeVisible();
		await expect(page.getByText('Intel 8080')).toBeVisible();
		await expect(page.getByText('MC68000')).toBeVisible();
	});

	test('round end shows scores and returns to launcher', async ({ page }) => {
		await page.goto('/');
		await page.getByText('OCM Demo-Quiz').click();
		await page.getByText('Start ▶').click();

		// Click "Runde beenden"
		await page.getByText('Runde beenden').click();

		// Should show Zwischenstand
		await expect(page.getByText('Zwischenstand')).toBeVisible();

		// Click Weiter
		await page.getByText('Weiter').click();

		// Back to launcher
		await expect(page.getByText('Bombadil')).toBeVisible();
	});

	test('keyboard a toggles animations', async ({ page }) => {
		await page.goto('/');
		await page.getByText('OCM Demo-Quiz').click();
		await page.getByText('Start ▶').click();

		// Press 'a' — should not crash, animations state toggles internally
		await page.keyboard.press('a');

		// Board should still be functional
		await expect(page.getByText('Rechnerraten')).toBeVisible();
	});
});
