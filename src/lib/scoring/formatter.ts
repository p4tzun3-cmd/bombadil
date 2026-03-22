import type { ScoreDisplay } from '../engine/types';

export function formatScore(value: number, display: ScoreDisplay): string {
	const abs = Math.abs(value);
	const prefix = value < 0 ? '-' : '';

	switch (display) {
		case 'binary':
			return prefix + abs.toString(2);
		case 'octal':
			return prefix + abs.toString(8);
		case 'hex':
			return prefix + '0x' + abs.toString(16).toUpperCase();
		case 'decimal':
		default:
			return value.toString(10);
	}
}
