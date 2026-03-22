import { describe, it, expect } from 'vitest';
import { calculateScore, createScoreboard, addScore, subtractScore } from './scoring';
import type { ScoringConfig } from '../engine/types';

const formulaConfig: ScoringConfig = {
	mode: 'formula',
	baseScore: 128,
	multiplier: 1,
	display: 'decimal'
};

describe('calculateScore', () => {
	it('calculates formula mode: baseScore * difficulty * multiplier', () => {
		expect(calculateScore(formulaConfig, 1)).toBe(128);
		expect(calculateScore(formulaConfig, 3)).toBe(384);
		expect(calculateScore(formulaConfig, 5)).toBe(640);
	});

	it('applies multiplier in formula mode', () => {
		const config: ScoringConfig = { ...formulaConfig, baseScore: 100, multiplier: 2 };
		expect(calculateScore(config, 3)).toBe(600);
	});

	it('returns fixed points when mode is fixed', () => {
		const config: ScoringConfig = { ...formulaConfig, mode: 'fixed' };
		expect(calculateScore(config, 1, 500)).toBe(500);
	});

	it('throws when fixed mode has no points', () => {
		const config: ScoringConfig = { ...formulaConfig, mode: 'fixed' };
		expect(() => calculateScore(config, 1)).toThrow();
	});

	it('always returns integers', () => {
		const config: ScoringConfig = { ...formulaConfig, baseScore: 7, multiplier: 3 };
		expect(Number.isInteger(calculateScore(config, 3))).toBe(true);
	});
});

describe('scoreboard', () => {
	it('creates scoreboard with N teams at 0', () => {
		expect(createScoreboard(4)).toEqual([0, 0, 0, 0]);
	});

	it('creates scoreboard with 2 teams', () => {
		expect(createScoreboard(2)).toEqual([0, 0]);
	});

	it('adds score to specific team', () => {
		expect(addScore([0, 0, 0, 0], 0, 128)).toEqual([128, 0, 0, 0]);
	});

	it('adds score to last team', () => {
		expect(addScore([0, 0, 0, 0], 3, 256)).toEqual([0, 0, 0, 256]);
	});

	it('subtracts score from specific team', () => {
		expect(subtractScore([500, 300, 200, 100], 1, 150)).toEqual([500, 150, 200, 100]);
	});

	it('allows negative scores', () => {
		expect(subtractScore([0, 0, 0, 0], 0, 100)).toEqual([-100, 0, 0, 0]);
	});

	it('does not mutate original array', () => {
		const original = [100, 200, 300, 400];
		addScore(original, 0, 50);
		expect(original).toEqual([100, 200, 300, 400]);
	});
});
