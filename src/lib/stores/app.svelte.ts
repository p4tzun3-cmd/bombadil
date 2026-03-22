import type { Round, ValidationError } from '../engine/types';
import { GameState } from '../engine/state-machine.svelte';

class AppState {
	rounds = $state<Round[]>([]);
	errors = $state<ValidationError[]>([]);
	game = $state<GameState | null>(null);
	loaded = $state(false);

	currentRound = $derived(
		this.game ? this.rounds[this.game.currentRoundIndex] : undefined
	);

	init(rounds: Round[], errors: ValidationError[]) {
		this.rounds = rounds;
		this.errors = errors;
		this.game = new GameState(rounds[0]?.settings.teams ?? 4);
		this.loaded = true;
	}
}

export const app = new AppState();
