<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { loadAllRounds } from '$lib/loader/loader';
	import { loadTheme, applyThemeToDOM } from '$lib/theme/theme.svelte';
	import { GameState } from '$lib/engine/state-machine.svelte';
	import type { Round, ValidationError } from '$lib/engine/types';

	let { children } = $props();

	let rounds = $state<Round[]>([]);
	let errors = $state<ValidationError[]>([]);
	let game = $state<GameState | null>(null);
	let loaded = $state(false);

	$effect(() => {
		loadAllRounds().then(async (result) => {
			rounds = result.rounds;
			errors = result.errors;

			// Load theme from first round or fallback
			const themeName = rounds[0]?.meta.theme;
			const theme = await loadTheme(themeName);
			applyThemeToDOM(theme);

			game = new GameState(rounds[0]?.settings.teams ?? 4);
			loaded = true;
		});
	});

	function handleKeydown(e: KeyboardEvent) {
		if (!game) return;

		switch (e.key) {
			case 'Enter':
				if (game.phase === 'QUESTION_ACTIVE') game.advanceCycle();
				break;
			case 'Escape':
				if (game.phase === 'QUESTION_ACTIVE') game.retreatCycle();
				break;
			case ' ':
				if (game.phase === 'INTRO' || game.phase === 'SUBINTRO') game.skipIntro();
				e.preventDefault();
				break;
			case '1': case '2': case '3': case '4': {
				const team = parseInt(e.key) - 1;
				if (game.phase === 'QUESTION_ACTIVE' && game.cycleStep === 'SCORING') {
					const round = rounds[game.currentRoundIndex];
					if (round && game.currentQuestion) {
						const config = round.settings.scoring;
						const pts = config.mode === 'fixed'
							? (game.currentQuestion.points ?? 0)
							: config.baseScore * game.currentQuestion.difficulty * config.multiplier;
						game.awardPoints(team, pts);
					}
				}
				break;
			}
			case 'q': case 'w': case 'e': case 'r': {
				const teamMap: Record<string, number> = { q: 0, w: 1, e: 2, r: 3 };
				const team = teamMap[e.key];
				if (team !== undefined && game.phase === 'QUESTION_ACTIVE') {
					const round = rounds[game.currentRoundIndex];
					if (round && game.currentQuestion) {
						const config = round.settings.scoring;
						const pts = config.mode === 'fixed'
							? (game.currentQuestion.points ?? 0)
							: config.baseScore * game.currentQuestion.difficulty * config.multiplier;
						game.deductPoints(team, pts);
					}
				}
				break;
			}
			case 'a':
				game.toggleAnimations();
				break;
		}
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

{#if loaded && game}
	{@render children?.({ game, rounds, errors })}
{:else}
	<div class="flex items-center justify-center h-screen bg-[var(--color-bg)]">
		<p class="text-2xl text-[var(--color-text)] animate-pulse">Lade Quiz...</p>
	</div>
{/if}
