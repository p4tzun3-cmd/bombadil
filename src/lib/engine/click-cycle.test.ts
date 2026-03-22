import { describe, it, expect } from 'vitest';
import { getCycleSteps, nextStep, previousStep } from './click-cycle';

describe('getCycleSteps', () => {
	it('returns MEDIA→ANSWER→SCORING for solution', () => {
		expect(getCycleSteps('solution')).toEqual(['MEDIA', 'ANSWER', 'SCORING']);
	});
	it('returns PROMPT→MEDIA→ANSWER→SCORING for estimation', () => {
		expect(getCycleSteps('estimation')).toEqual(['PROMPT', 'MEDIA', 'ANSWER', 'SCORING']);
	});
	it('returns MEDIA→WAGER→ANSWER→SCORING for risk', () => {
		expect(getCycleSteps('risk')).toEqual(['MEDIA', 'WAGER', 'ANSWER', 'SCORING']);
	});
	it('returns MEDIA→ANSWER→SCORING for lucky', () => {
		expect(getCycleSteps('lucky')).toEqual(['MEDIA', 'ANSWER', 'SCORING']);
	});
	it('returns PROMPT→OPTIONS→ANSWER→SCORING for multiplechoice', () => {
		expect(getCycleSteps('multiplechoice')).toEqual(['PROMPT', 'OPTIONS', 'ANSWER', 'SCORING']);
	});
	it('returns a copy, not the original array', () => {
		const a = getCycleSteps('solution');
		const b = getCycleSteps('solution');
		expect(a).not.toBe(b);
		expect(a).toEqual(b);
	});
});

describe('nextStep', () => {
	it('advances from MEDIA to ANSWER for solution', () => {
		const result = nextStep('solution', 'MEDIA', ['MEDIA']);
		expect(result.step).toBe('ANSWER');
		expect(result.history).toEqual(['MEDIA', 'ANSWER']);
	});
	it('advances through full solution cycle', () => {
		let result = nextStep('solution', 'MEDIA', ['MEDIA']);
		expect(result.step).toBe('ANSWER');
		result = nextStep('solution', 'ANSWER', result.history);
		expect(result.step).toBe('SCORING');
	});
	it('returns null at end of cycle', () => {
		const result = nextStep('solution', 'SCORING', ['MEDIA', 'ANSWER', 'SCORING']);
		expect(result.step).toBeNull();
	});
	it('returns null for unknown current step', () => {
		const result = nextStep('solution', 'WAGER', ['WAGER']);
		expect(result.step).toBeNull();
	});
	it('does not mutate input history', () => {
		const original = ['MEDIA'] as const;
		nextStep('solution', 'MEDIA', original);
		expect(original).toEqual(['MEDIA']);
	});
});

describe('previousStep', () => {
	it('goes back from ANSWER to MEDIA', () => {
		const result = previousStep(['MEDIA', 'ANSWER']);
		expect(result.step).toBe('MEDIA');
		expect(result.history).toEqual(['MEDIA']);
	});
	it('goes back through full risk cycle', () => {
		let result = previousStep(['MEDIA', 'WAGER', 'ANSWER']);
		expect(result.step).toBe('WAGER');
		result = previousStep(result.history);
		expect(result.step).toBe('MEDIA');
	});
	it('returns null at first step', () => {
		const result = previousStep(['MEDIA']);
		expect(result.step).toBeNull();
		expect(result.history).toEqual([]);
	});
	it('returns null for empty history', () => {
		const result = previousStep([]);
		expect(result.step).toBeNull();
		expect(result.history).toEqual([]);
	});
});
