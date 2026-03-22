import { describe, it, expect } from 'vitest';
import { validateRound } from './schema';

const validRound = {
	meta: { title: 'Test Quiz' },
	settings: {
		teams: 4,
		scoring: { mode: 'formula', baseScore: 100, multiplier: 1, display: 'decimal' },
		animations: true
	},
	categories: [
		{
			name: 'Cat 1',
			questions: [
				{
					type: 'solution',
					difficulty: 1,
					media: { type: 'image', src: 'test.jpg' },
					answer: { text: 'Answer' }
				}
			]
		}
	]
};

describe('validateRound', () => {
	it('returns no errors for valid round', () => {
		const result = validateRound(validRound, 'test.json');
		expect(result.errors.filter((e) => e.severity === 'error')).toHaveLength(0);
	});

	it('reports missing meta.title', () => {
		const round = { ...validRound, meta: {} };
		const result = validateRound(round, 'test.json');
		expect(result.errors.some((e) => e.severity === 'error')).toBe(true);
	});

	it('reports empty categories', () => {
		const round = { ...validRound, categories: [] };
		const result = validateRound(round, 'test.json');
		expect(result.errors.some((e) => e.severity === 'error')).toBe(true);
	});

	it('reports category with no questions', () => {
		const round = { ...validRound, categories: [{ name: 'Empty', questions: [] }] };
		const result = validateRound(round, 'test.json');
		expect(result.errors.some((e) => e.severity === 'error')).toBe(true);
	});

	it('reports unknown question type', () => {
		const round = {
			...validRound,
			categories: [
				{ name: 'Cat', questions: [{ type: 'unknown', difficulty: 1, answer: { text: 'A' } }] }
			]
		};
		const result = validateRound(round, 'test.json');
		expect(result.errors.some((e) => e.severity === 'error')).toBe(true);
	});

	it('reports missing media for solution type', () => {
		const round = {
			...validRound,
			categories: [
				{ name: 'Cat', questions: [{ type: 'solution', difficulty: 1, answer: { text: 'A' } }] }
			]
		};
		const result = validateRound(round, 'test.json');
		expect(result.errors.some((e) => e.severity === 'error')).toBe(true);
	});

	it('reports missing prompt for multiplechoice', () => {
		const round = {
			...validRound,
			categories: [
				{
					name: 'Cat',
					questions: [
						{
							type: 'multiplechoice',
							difficulty: 1,
							answer: { text: 'A' },
							options: ['A', 'B'],
							correctOption: 0
						}
					]
				}
			]
		};
		const result = validateRound(round, 'test.json');
		expect(result.errors.some((e) => e.severity === 'error')).toBe(true);
	});

	it('reports missing wager for risk type', () => {
		const round = {
			...validRound,
			categories: [
				{
					name: 'Cat',
					questions: [
						{
							type: 'risk',
							difficulty: 1,
							media: { type: 'image', src: 'x.jpg' },
							answer: { text: 'A' }
						}
					]
				}
			]
		};
		const result = validateRound(round, 'test.json');
		expect(result.errors.some((e) => e.severity === 'error')).toBe(true);
	});

	it('reports missing points for fixed scoring', () => {
		const round = {
			...validRound,
			settings: {
				...validRound.settings,
				scoring: { mode: 'fixed', baseScore: 100, multiplier: 1, display: 'decimal' }
			},
			categories: [
				{
					name: 'Cat',
					questions: [
						{
							type: 'solution',
							difficulty: 1,
							media: { type: 'image', src: 'x.jpg' },
							answer: { text: 'A' }
						}
					]
				}
			]
		};
		const result = validateRound(round, 'test.json');
		expect(result.errors.some((e) => e.message.includes('points'))).toBe(true);
	});

	it('accepts valid multiplechoice question', () => {
		const round = {
			...validRound,
			categories: [
				{
					name: 'Cat',
					questions: [
						{
							type: 'multiplechoice',
							difficulty: 2,
							prompt: 'Welcher Prozessor?',
							options: ['Z80', 'MOS 6510', 'Intel 8080', 'MC68000'],
							correctOption: 1,
							answer: { text: 'MOS 6510' }
						}
					]
				}
			]
		};
		const result = validateRound(round, 'test.json');
		expect(result.errors.filter((e) => e.severity === 'error')).toHaveLength(0);
	});

	it('accepts valid risk question', () => {
		const round = {
			...validRound,
			categories: [
				{
					name: 'Cat',
					questions: [
						{
							type: 'risk',
							difficulty: 3,
							media: { type: 'image', src: 'mystery.jpg' },
							wager: { min: 50, max: 500 },
							answer: { text: 'Amiga 500' }
						}
					]
				}
			]
		};
		const result = validateRound(round, 'test.json');
		expect(result.errors.filter((e) => e.severity === 'error')).toHaveLength(0);
	});

	it('reports too few options for multiplechoice', () => {
		const round = {
			...validRound,
			categories: [
				{
					name: 'Cat',
					questions: [
						{
							type: 'multiplechoice',
							difficulty: 1,
							prompt: 'Frage?',
							options: ['A'],
							correctOption: 0,
							answer: { text: 'A' }
						}
					]
				}
			]
		};
		const result = validateRound(round, 'test.json');
		expect(result.errors.some((e) => e.severity === 'error')).toBe(true);
	});
});
