import type { QuestionType, CycleStep } from './types';

const CYCLES = {
	solution: ['MEDIA', 'ANSWER', 'SCORING'],
	estimation: ['PROMPT', 'MEDIA', 'ANSWER', 'SCORING'],
	risk: ['MEDIA', 'WAGER', 'ANSWER', 'SCORING'],
	lucky: ['MEDIA', 'ANSWER', 'SCORING'],
	multiplechoice: ['PROMPT', 'OPTIONS', 'ANSWER', 'SCORING']
} as const satisfies Record<QuestionType, readonly CycleStep[]>;

export function getCycleSteps(type: QuestionType): CycleStep[] {
	return [...CYCLES[type]];
}

export function nextStep(
	type: QuestionType,
	current: CycleStep,
	history: readonly CycleStep[]
): { step: CycleStep | null; history: CycleStep[] } {
	const steps = CYCLES[type];
	const idx = steps.indexOf(current);
	if (idx === -1 || idx >= steps.length - 1) {
		return { step: null, history: [...history] };
	}
	const next = steps[idx + 1]!;
	return { step: next, history: [...history, next] };
}

export function previousStep(
	history: readonly CycleStep[]
): { step: CycleStep | null; history: CycleStep[] } {
	if (history.length <= 1) {
		return { step: null, history: [] };
	}
	const newHistory = history.slice(0, -1);
	return { step: newHistory[newHistory.length - 1]!, history: newHistory };
}
