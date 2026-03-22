import type { Round, ValidationError } from '../engine/types';
import { validateRound } from './schema';

export interface LoadResult {
	readonly rounds: Round[];
	readonly errors: ValidationError[];
}

export async function loadAllRounds(): Promise<LoadResult> {
	const errors: ValidationError[] = [];
	const rounds: Round[] = [];

	let manifest: string[];
	try {
		const res = await fetch('/data/manifest.json');
		if (!res.ok) {
			errors.push({
				catalog: 'manifest.json',
				field: 'file',
				message: 'manifest.json nicht gefunden — liegt die Datei in static/data/?',
				severity: 'error'
			});
			return { rounds, errors };
		}
		manifest = await res.json();
	} catch (e) {
		errors.push({
			catalog: 'manifest.json',
			field: 'json',
			message: `Manifest-Parsing fehlgeschlagen: ${e}`,
			severity: 'error'
		});
		return { rounds, errors };
	}

	if (!Array.isArray(manifest) || manifest.length === 0) {
		errors.push({
			catalog: 'manifest.json',
			field: 'content',
			message: 'Manifest ist leer oder kein Array',
			severity: 'error'
		});
		return { rounds, errors };
	}

	for (const filename of manifest) {
		try {
			const res = await fetch(`/data/${filename}`);
			if (!res.ok) {
				errors.push({
					catalog: filename,
					field: 'file',
					message: `Datei '${filename}' nicht gefunden`,
					severity: 'error'
				});
				continue;
			}

			const data: unknown = await res.json();
			const validation = validateRound(data, filename);
			errors.push(...validation.errors);

			const hasErrors = validation.errors.some((e) => e.severity === 'error');
			if (!hasErrors) {
				rounds.push(data as Round);
			}
		} catch (e) {
			errors.push({
				catalog: filename,
				field: 'json',
				message: `JSON-Parsing fehlgeschlagen: ${e}`,
				severity: 'error'
			});
		}
	}

	return { rounds, errors };
}
