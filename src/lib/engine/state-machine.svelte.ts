import {
	GamePhase as GP,
	QuestionStatus as QS,
	type GamePhase,
	type CycleStep,
	type Question,
	type QuestionStatus
} from './types';
import { getCycleSteps, nextStep, previousStep } from './click-cycle';
import { addScore, subtractScore, createScoreboard } from '../scoring/scoring';

export class GameState {
	phase = $state<GamePhase>(GP.LAUNCHER);
	currentRoundIndex = $state(0);
	currentQuestion = $state.raw<Question | null>(null);
	currentQuestionCategory = $state(0);
	currentQuestionIndex = $state(0);
	cycleStep = $state<CycleStep | null>(null);
	cycleHistory = $state<CycleStep[]>([]);
	scores = $state<number[]>([]);
	animationsEnabled = $state(true);
	subintroIndex = $state(0);

	private questionStates = $state<Map<string, QuestionStatus>>(new Map());

	constructor(teams: number) {
		this.scores = createScoreboard(teams);
	}

	private qKey(cat: number, q: number): string {
		return `${cat}-${q}`;
	}

	getQuestionStatus(cat: number, q: number): QuestionStatus {
		return this.questionStates.get(this.qKey(cat, q)) ?? QS.OPEN;
	}

	selectRound(index: number) {
		this.currentRoundIndex = index;
		this.phase = GP.INTRO;
	}

	skipIntro() {
		this.phase = GP.BOARD;
	}

	selectQuestion(question: Question, catIndex: number, qIndex: number) {
		this.currentQuestion = question;
		this.currentQuestionCategory = catIndex;
		this.currentQuestionIndex = qIndex;
		const steps = getCycleSteps(question.type);
		this.cycleStep = steps[0] ?? null;
		this.cycleHistory = this.cycleStep ? [this.cycleStep] : [];
		this.questionStates.set(this.qKey(catIndex, qIndex), QS.ACTIVE);
		this.phase = GP.QUESTION_ACTIVE;
	}

	advanceCycle() {
		if (!this.currentQuestion || !this.cycleStep) return;
		const result = nextStep(this.currentQuestion.type, this.cycleStep, this.cycleHistory);
		if (result.step) {
			this.cycleStep = result.step;
			this.cycleHistory = result.history;
		} else {
			this.closeQuestion(true);
		}
	}

	retreatCycle() {
		const result = previousStep(this.cycleHistory);
		if (result.step) {
			this.cycleStep = result.step;
			this.cycleHistory = result.history;
		} else {
			this.closeQuestion(false);
		}
	}

	closeQuestion(markDone: boolean) {
		const key = this.qKey(this.currentQuestionCategory, this.currentQuestionIndex);
		this.questionStates.set(key, markDone ? QS.DONE : QS.OPEN);
		this.currentQuestion = null;
		this.cycleStep = null;
		this.cycleHistory = [];
		this.phase = GP.BOARD;
	}

	awardPoints(teamIndex: number, points: number) {
		this.scores = addScore(this.scores, teamIndex, points);
	}

	deductPoints(teamIndex: number, points: number) {
		this.scores = subtractScore(this.scores, teamIndex, points);
	}

	toggleAnimations() {
		this.animationsEnabled = !this.animationsEnabled;
	}

	endRound() {
		this.phase = GP.ROUND_END;
	}

	backToLauncher() {
		this.currentQuestion = null;
		this.questionStates = new Map();
		this.phase = GP.LAUNCHER;
	}
}
