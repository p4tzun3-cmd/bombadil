import { describe, it, expect } from 'vitest';
import { GameState } from './state-machine.svelte';

const solutionQ = {
	type: 'solution' as const,
	difficulty: 1,
	media: { type: 'image' as const, src: 'x.jpg' },
	answer: { text: 'Answer' }
};

const riskQ = {
	type: 'risk' as const,
	difficulty: 2,
	media: { type: 'image' as const, src: 'y.jpg' },
	wager: { min: 50, max: 500 },
	answer: { text: 'Answer' }
};

describe('GameState — initialization', () => {
	it('starts in LAUNCHER phase', () => {
		const game = new GameState(4);
		expect(game.phase).toBe('LAUNCHER');
		expect(game.scores).toEqual([0, 0, 0, 0]);
		expect(game.currentQuestion).toBeNull();
		expect(game.animationsEnabled).toBe(true);
	});

	it('creates scoreboard for 2 teams', () => {
		const game = new GameState(2);
		expect(game.scores).toEqual([0, 0]);
	});
});

describe('GameState — round selection', () => {
	it('transitions to INTRO on selectRound', () => {
		const game = new GameState(4);
		game.selectRound(0);
		expect(game.phase).toBe('INTRO');
		expect(game.currentRoundIndex).toBe(0);
	});

	it('transitions to BOARD on skipIntro', () => {
		const game = new GameState(4);
		game.selectRound(0);
		game.skipIntro();
		expect(game.phase).toBe('BOARD');
	});
});

describe('GameState — question flow', () => {
	it('transitions to QUESTION_ACTIVE on selectQuestion', () => {
		const game = new GameState(4);
		game.selectRound(0);
		game.skipIntro();
		game.selectQuestion(solutionQ, 0, 0);
		expect(game.phase).toBe('QUESTION_ACTIVE');
		expect(game.currentQuestion).toBe(solutionQ);
		expect(game.cycleStep).toBe('MEDIA');
		expect(game.getQuestionStatus(0, 0)).toBe('active');
	});

	it('advances cycle step', () => {
		const game = new GameState(4);
		game.selectRound(0);
		game.skipIntro();
		game.selectQuestion(solutionQ, 0, 0);
		game.advanceCycle();
		expect(game.cycleStep).toBe('ANSWER');
		game.advanceCycle();
		expect(game.cycleStep).toBe('SCORING');
	});

	it('closes question and returns to BOARD when cycle ends', () => {
		const game = new GameState(4);
		game.selectRound(0);
		game.skipIntro();
		game.selectQuestion(solutionQ, 0, 0);
		game.advanceCycle(); // ANSWER
		game.advanceCycle(); // SCORING
		game.advanceCycle(); // end → close
		expect(game.phase).toBe('BOARD');
		expect(game.currentQuestion).toBeNull();
		expect(game.getQuestionStatus(0, 0)).toBe('done');
	});

	it('retreats cycle step via Esc', () => {
		const game = new GameState(4);
		game.selectRound(0);
		game.skipIntro();
		game.selectQuestion(solutionQ, 0, 0);
		game.advanceCycle(); // ANSWER
		game.retreatCycle(); // back to MEDIA
		expect(game.cycleStep).toBe('MEDIA');
	});

	it('closes without marking done when Esc on first step', () => {
		const game = new GameState(4);
		game.selectRound(0);
		game.skipIntro();
		game.selectQuestion(solutionQ, 0, 0);
		game.retreatCycle(); // first step → close without done
		expect(game.phase).toBe('BOARD');
		expect(game.getQuestionStatus(0, 0)).toBe('open');
	});

	it('marks question done on explicit closeQuestion(true)', () => {
		const game = new GameState(4);
		game.selectRound(0);
		game.skipIntro();
		game.selectQuestion(solutionQ, 0, 0);
		game.closeQuestion(true);
		expect(game.phase).toBe('BOARD');
		expect(game.getQuestionStatus(0, 0)).toBe('done');
	});
});

describe('GameState — scoring', () => {
	it('awards points to team', () => {
		const game = new GameState(4);
		game.awardPoints(0, 128);
		expect(game.scores[0]).toBe(128);
	});

	it('deducts points from team', () => {
		const game = new GameState(4);
		game.awardPoints(0, 500);
		game.deductPoints(0, 200);
		expect(game.scores[0]).toBe(300);
	});

	it('allows negative scores', () => {
		const game = new GameState(4);
		game.deductPoints(2, 100);
		expect(game.scores[2]).toBe(-100);
	});

	it('preserves other team scores', () => {
		const game = new GameState(4);
		game.awardPoints(0, 100);
		game.awardPoints(1, 200);
		game.awardPoints(2, 300);
		expect(game.scores).toEqual([100, 200, 300, 0]);
	});
});

describe('GameState — round lifecycle', () => {
	it('toggles animations', () => {
		const game = new GameState(4);
		expect(game.animationsEnabled).toBe(true);
		game.toggleAnimations();
		expect(game.animationsEnabled).toBe(false);
		game.toggleAnimations();
		expect(game.animationsEnabled).toBe(true);
	});

	it('transitions to ROUND_END', () => {
		const game = new GameState(4);
		game.selectRound(0);
		game.skipIntro();
		game.endRound();
		expect(game.phase).toBe('ROUND_END');
	});

	it('returns to LAUNCHER and clears question states', () => {
		const game = new GameState(4);
		game.selectRound(0);
		game.skipIntro();
		game.selectQuestion(solutionQ, 0, 0);
		game.closeQuestion(true);
		game.endRound();
		game.backToLauncher();
		expect(game.phase).toBe('LAUNCHER');
		expect(game.getQuestionStatus(0, 0)).toBe('open');
	});

	it('preserves scores across rounds', () => {
		const game = new GameState(4);
		game.awardPoints(0, 500);
		game.selectRound(0);
		game.skipIntro();
		game.endRound();
		game.backToLauncher();
		expect(game.scores[0]).toBe(500);
	});
});
