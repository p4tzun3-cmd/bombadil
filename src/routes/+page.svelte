<script lang="ts">
	import { app } from '$lib/stores/app.svelte';
	import Launcher from '../components/Launcher.svelte';
	import Board from '../components/Board.svelte';
	import ScoreBar from '../components/ScoreBar.svelte';
</script>

{#if app.game}
	{@const game = app.game}

	{#if game.phase === 'LAUNCHER'}
		<Launcher rounds={app.rounds} onselect={(i) => game.selectRound(i)} />

	{:else if game.phase === 'INTRO'}
		<div class="flex items-center justify-center h-screen" style:background-color="var(--color-bg)">
			<button
				class="text-3xl px-8 py-4 rounded-xl bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] text-[var(--color-text)] cursor-pointer"
				onclick={() => game.skipIntro()}
			>
				Start ▶
			</button>
		</div>

	{:else if game.phase === 'BOARD' && app.currentRound}
		<ScoreBar scores={game.scores} display={app.currentRound.settings.scoring.display} />
		<Board
			round={app.currentRound}
			{game}
			onselect={(question, ci, qi) => game.selectQuestion(question, ci, qi)}
		/>

	{:else if game.phase === 'QUESTION_ACTIVE'}
		<div class="flex flex-col items-center justify-center h-screen gap-4" style:background-color="var(--color-overlay)">
			<p class="text-4xl text-[var(--color-text)]">
				{game.cycleStep}
			</p>
			<p class="text-xl text-[var(--color-text)] opacity-60">
				Enter = weiter | Esc = zurück | 1-4 = Punkte
			</p>
			{#if app.currentRound}
				<ScoreBar scores={game.scores} display={app.currentRound.settings.scoring.display} />
			{/if}
		</div>

	{:else if game.phase === 'ROUND_END'}
		<div class="flex flex-col items-center justify-center h-screen gap-4" style:background-color="var(--color-bg)">
			<p class="text-4xl text-[var(--color-text)]">Runde beendet</p>
			<button
				class="text-xl px-6 py-3 rounded-xl bg-[var(--color-card)] text-[var(--color-text)] cursor-pointer"
				onclick={() => game.backToLauncher()}
			>
				Zurück zur Auswahl
			</button>
		</div>
	{/if}
{/if}
