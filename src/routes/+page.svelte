<script lang="ts">
	import { app } from '$lib/stores/app.svelte';
	import Launcher from '../components/Launcher.svelte';
	import Board from '../components/Board.svelte';
	import ScoreBar from '../components/ScoreBar.svelte';
	import QuestionOverlay from '../components/QuestionOverlay.svelte';
	import RoundEnd from '../components/RoundEnd.svelte';
</script>

{#if app.game}
	{@const game = app.game}

	{#if game.phase === 'LAUNCHER'}
		<Launcher rounds={app.rounds} onselect={(i) => game.selectRound(i)} />

	{:else if game.phase === 'INTRO'}
		<div class="flex flex-col items-center justify-center h-screen gap-4"
			style:background-color="var(--color-bg)">
			{#if app.currentRound}
				<h1 class="text-5xl font-bold" style:color="var(--color-text)">
					{app.currentRound.meta.title}
				</h1>
				{#if app.currentRound.meta.subtitle}
					<p class="text-2xl opacity-60" style:color="var(--color-text)">
						{app.currentRound.meta.subtitle}
					</p>
				{/if}
				{#if app.currentRound.meta.roundLabel}
					<p class="text-xl opacity-40" style:color="var(--color-text)">
						{app.currentRound.meta.roundLabel}
					</p>
				{/if}
			{/if}
			<button
				class="mt-8 text-3xl px-8 py-4 rounded-xl bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] cursor-pointer"
				style:color="var(--color-text)"
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
		<!-- Runde beenden Button -->
		<button
			class="fixed bottom-4 right-4 z-50 px-4 py-2 rounded-lg text-sm opacity-40 hover:opacity-100
				bg-[var(--color-card)] cursor-pointer transition-opacity"
			style:color="var(--color-text)"
			onclick={() => game.endRound()}
		>
			Runde beenden
		</button>

	{:else if game.phase === 'QUESTION_ACTIVE' && game.currentQuestion && game.cycleStep}
		{#if app.currentRound}
			<ScoreBar scores={game.scores} display={app.currentRound.settings.scoring.display} />
		{/if}
		<QuestionOverlay question={game.currentQuestion} cycleStep={game.cycleStep} />

	{:else if game.phase === 'ROUND_END' && app.currentRound}
		<RoundEnd
			scores={game.scores}
			display={app.currentRound.settings.scoring.display}
			onback={() => game.backToLauncher()}
		/>
	{/if}
{/if}
