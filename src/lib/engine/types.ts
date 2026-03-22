// === Helpers ===

export function assertNever(x: never): never {
	throw new Error(`Unexpected value: ${JSON.stringify(x)}`);
}

// === Game Phases ===

export const GamePhase = {
	LAUNCHER: 'LAUNCHER',
	INTRO: 'INTRO',
	BOARD: 'BOARD',
	QUESTION_ACTIVE: 'QUESTION_ACTIVE',
	SUBINTRO: 'SUBINTRO',
	ROUND_END: 'ROUND_END',
} as const satisfies Record<string, string>;
export type GamePhase = (typeof GamePhase)[keyof typeof GamePhase];

// === Cycle Steps ===

export const CycleStep = {
	MEDIA: 'MEDIA',
	PROMPT: 'PROMPT',
	OPTIONS: 'OPTIONS',
	ANSWER: 'ANSWER',
	WAGER: 'WAGER',
	SCORING: 'SCORING',
} as const satisfies Record<string, string>;
export type CycleStep = (typeof CycleStep)[keyof typeof CycleStep];

// === Question Status ===

export const QuestionStatus = {
	OPEN: 'open',
	ACTIVE: 'active',
	DONE: 'done',
} as const satisfies Record<string, string>;
export type QuestionStatus = (typeof QuestionStatus)[keyof typeof QuestionStatus];

// === Media ===

export type MediaType = 'image' | 'audio' | 'video' | 'image_pair';

export interface Media {
	readonly type: MediaType;
	readonly src: string;
	readonly src2?: string;
}

// === Answer ===

export interface Answer {
	readonly text: string;
	readonly detail?: string;
	readonly media?: Media;
}

// === Questions — Discriminated Union ===

export type Question =
	| {
			readonly type: 'solution';
			readonly difficulty: number;
			readonly points?: number;
			readonly media: Media;
			readonly answer: Answer;
	  }
	| {
			readonly type: 'estimation';
			readonly difficulty: number;
			readonly points?: number;
			readonly prompt: string;
			readonly media?: Media;
			readonly answer: Answer;
	  }
	| {
			readonly type: 'risk';
			readonly difficulty: number;
			readonly points?: number;
			readonly media: Media;
			readonly wager: { readonly min: number; readonly max: number };
			readonly answer: Answer;
	  }
	| {
			readonly type: 'lucky';
			readonly difficulty: number;
			readonly points?: number;
			readonly media: Media;
			readonly answer: Answer;
	  }
	| {
			readonly type: 'multiplechoice';
			readonly difficulty: number;
			readonly points?: number;
			readonly prompt: string;
			readonly options: readonly string[];
			readonly correctOption: number;
			readonly answer: Answer;
	  };

export type QuestionType = Question['type'];

// === Categories & Rounds ===

export interface Category {
	readonly name: string;
	readonly questions: readonly Question[];
}

export const ScoringMode = {
	FORMULA: 'formula',
	FIXED: 'fixed',
} as const satisfies Record<string, string>;
export type ScoringMode = (typeof ScoringMode)[keyof typeof ScoringMode];

export const ScoreDisplay = {
	DECIMAL: 'decimal',
	BINARY: 'binary',
	OCTAL: 'octal',
	HEX: 'hex',
} as const satisfies Record<string, string>;
export type ScoreDisplay = (typeof ScoreDisplay)[keyof typeof ScoreDisplay];

export interface ScoringConfig {
	readonly mode: ScoringMode;
	readonly baseScore: number;
	readonly multiplier: number;
	readonly display: ScoreDisplay;
}

export interface RoundSettings {
	readonly teams: number;
	readonly scoring: ScoringConfig;
	readonly animations: boolean;
}

export interface RoundMeta {
	readonly title: string;
	readonly subtitle?: string;
	readonly roundLabel?: string;
	readonly theme?: string;
	readonly intro?: string;
	readonly subintros?: readonly string[];
}

export interface Round {
	readonly meta: RoundMeta;
	readonly settings: RoundSettings;
	readonly categories: readonly Category[];
}

// === Theme ===

export interface ThemeColors {
	readonly background: string;
	readonly card: string;
	readonly cardHover: string;
	readonly cardDone: string;
	readonly text: string;
	readonly overlay: string;
	readonly teams: readonly string[];
}

export interface Theme {
	readonly name: string;
	readonly colors: ThemeColors;
	readonly logo?: string;
	readonly backgroundImage?: string;
	readonly font?: string;
	readonly cursorHidden?: boolean;
	readonly sounds?: {
		readonly think?: string;
		readonly risk?: string;
		readonly lucky?: string;
	};
}

// === Validation ===

export interface ValidationError {
	readonly catalog: string;
	readonly category?: string;
	readonly question?: number;
	readonly field: string;
	readonly message: string;
	readonly severity: 'error' | 'warning';
}
