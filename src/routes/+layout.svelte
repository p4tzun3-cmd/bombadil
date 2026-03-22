<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { loadAllRounds } from '$lib/loader/loader';
	import { loadTheme, applyThemeToDOM } from '$lib/theme/theme.svelte';
	import { app } from '$lib/stores/app.svelte';
	import { playLoop, stopLoop, stopAll, playSound, preloadAudio } from '$lib/audio/audio.svelte';
	import type { Theme } from '$lib/engine/types';
	import ErrorScreen from '../components/ErrorScreen.svelte';

	let { children } = $props();
	let currentTheme = $state<Theme | null>(null);
	let dismissed = $state(false);
	let hasCriticalErrors = $derived(app.errors.some((e) => e.severity === 'error'));
	let hasAnyErrors = $derived(app.errors.length > 0);

	onMount(async () => {
		try {
			const result = await loadAllRounds();
			const themeName = result.rounds[0]?.meta.theme;
			const theme = await loadTheme(themeName);
			currentTheme = theme;
			applyThemeToDOM(theme);

			const sounds = theme.sounds;
			if (sounds) {
				const srcs = [sounds.think, sounds.risk, sounds.lucky].filter((s): s is string => !!s);
				preloadAudio(srcs);
			}

			app.init(result.rounds, result.errors);
		} catch (e) {
			console.error('Failed to load quiz:', e);
			app.init([], [{ catalog: 'system', field: 'loader', message: `Laden fehlgeschlagen: ${e}`, severity: 'error' }]);
		}
	});

	// Audio triggers — react to game phase changes
	let prevPhase = $state('');
	$effect(() => {
		const game = app.game;
		if (!game) return;

		if (game.phase === 'QUESTION_ACTIVE' && prevPhase !== 'QUESTION_ACTIVE') {
			if (currentTheme?.sounds?.think) playLoop(currentTheme.sounds.think);
			if (game.currentQuestion?.type === 'risk' && currentTheme?.sounds?.risk) playSound(currentTheme.sounds.risk);
			if (game.currentQuestion?.type === 'lucky' && currentTheme?.sounds?.lucky) playSound(currentTheme.sounds.lucky);
		}
		if (prevPhase === 'QUESTION_ACTIVE' && game.phase !== 'QUESTION_ACTIVE') {
			stopLoop();
		}
		prevPhase = game.phase;
	});

	function handleKeydown(e: KeyboardEvent) {
		const game = app.game;
		if (!game) return;

		switch (e.key) {
			case 'Enter':
				if (game.phase === 'QUESTION_ACTIVE') game.advanceCycle();
				break;
			case 'Escape':
				if (game.phase === 'QUESTION_ACTIVE') game.retreatCycle();
				break;
			case ' ':
				if (game.phase === 'INTRO' || game.phase === 'SUBINTRO') {
					game.skipIntro();
					stopAll();
				}
				e.preventDefault();
				break;
			case '1': case '2': case '3': case '4': {
				const team = parseInt(e.key) - 1;
				if (game.phase === 'QUESTION_ACTIVE' && game.cycleStep === 'SCORING') {
					const round = app.currentRound;
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
					const round = app.currentRound;
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

{#if !app.loaded}
	<div class="flex items-center justify-center h-screen bg-[var(--color-bg)]">
		<p class="text-2xl text-[var(--color-text)] animate-pulse">Lade Quiz...</p>
	</div>
{:else if (hasCriticalErrors || (hasAnyErrors && !dismissed))}
	<ErrorScreen errors={app.errors} ondismiss={hasCriticalErrors ? undefined : () => dismissed = true} />
{:else}
	{@render children()}
{/if}
