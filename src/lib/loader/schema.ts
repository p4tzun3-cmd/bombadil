import { z } from 'zod';
import type { ValidationError } from '../engine/types';

// === Zod Schemas ===

const MediaSchema = z.object({
	type: z.enum(['image', 'audio', 'video', 'image_pair']),
	src: z.string(),
	src2: z.string().optional()
});

const AnswerSchema = z.object({
	text: z.string(),
	detail: z.string().optional(),
	media: MediaSchema.optional()
});

const BaseFields = {
	difficulty: z.number(),
	points: z.number().optional(),
	answer: AnswerSchema
};

const QuestionSchema = z.discriminatedUnion('type', [
	z.object({ type: z.literal('solution'), ...BaseFields, media: MediaSchema }),
	z.object({
		type: z.literal('estimation'),
		...BaseFields,
		prompt: z.string(),
		media: MediaSchema.optional()
	}),
	z.object({
		type: z.literal('risk'),
		...BaseFields,
		media: MediaSchema,
		wager: z.object({ min: z.number(), max: z.number() })
	}),
	z.object({ type: z.literal('lucky'), ...BaseFields, media: MediaSchema }),
	z.object({
		type: z.literal('multiplechoice'),
		...BaseFields,
		prompt: z.string(),
		options: z.array(z.string()).min(2),
		correctOption: z.number()
	})
]);

const ScoringConfigSchema = z.object({
	mode: z.enum(['formula', 'fixed']),
	baseScore: z.number(),
	multiplier: z.number(),
	display: z.enum(['decimal', 'binary', 'octal', 'hex'])
});

export const RoundSchema = z.object({
	meta: z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		roundLabel: z.string().optional(),
		theme: z.string().optional(),
		intro: z.string().optional(),
		subintros: z.array(z.string()).optional()
	}),
	settings: z.object({
		teams: z.number().min(1).max(4),
		scoring: ScoringConfigSchema,
		animations: z.boolean()
	}),
	categories: z
		.array(
			z.object({
				name: z.string(),
				questions: z.array(QuestionSchema).min(1)
			})
		)
		.min(1)
});

// === Validation Wrapper ===

export function validateRound(
	data: unknown,
	catalogName: string
): { errors: ValidationError[] } {
	const errors: ValidationError[] = [];
	const result = RoundSchema.safeParse(data);

	if (!result.success) {
		for (const issue of result.error.issues) {
			errors.push({
				catalog: catalogName,
				field: issue.path.join('.'),
				message: issue.message,
				severity: 'error'
			});
		}
		return { errors };
	}

	// Semantic check: fixed mode requires points on every question
	const round = result.data;
	if (round.settings.scoring.mode === 'fixed') {
		for (const cat of round.categories) {
			for (const [qi, q] of cat.questions.entries()) {
				if (q.points === undefined) {
					errors.push({
						catalog: catalogName,
						category: cat.name,
						question: qi + 1,
						field: 'points',
						message: "Scoring-Mode 'fixed' erfordert 'points'-Feld",
						severity: 'error'
					});
				}
			}
		}
	}

	return { errors };
}
