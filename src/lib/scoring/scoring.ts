import type { ScoringConfig } from '../engine/types';

export function calculateScore(
	config: ScoringConfig,
	difficulty: number,
	fixedPoints?: number
): number {
	if (config.mode === 'fixed') {
		if (fixedPoints === undefined) {
			throw new Error("Scoring mode 'fixed' requires points value");
		}
		return Math.floor(fixedPoints);
	}
	return Math.floor(config.baseScore * difficulty * config.multiplier);
}

export function createScoreboard(teams: number): number[] {
	return new Array(teams).fill(0);
}

export function addScore(
	scores: readonly number[],
	teamIndex: number,
	points: number
): number[] {
	const updated = [...scores];
	const current = updated[teamIndex];
	if (current !== undefined) {
		updated[teamIndex] = current + points;
	}
	return updated;
}

export function subtractScore(
	scores: readonly number[],
	teamIndex: number,
	points: number
): number[] {
	const updated = [...scores];
	const current = updated[teamIndex];
	if (current !== undefined) {
		updated[teamIndex] = current - points;
	}
	return updated;
}
