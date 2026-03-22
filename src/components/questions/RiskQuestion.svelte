<script lang="ts">
	import type { Question, CycleStep } from '$lib/engine/types';
	import MediaPlayer from '../MediaPlayer.svelte';

	let {
		question,
		cycleStep
	}: {
		question: Extract<Question, { type: 'risk' }>;
		cycleStep: CycleStep;
	} = $props();

	let wagerAmount = $state(question.wager.min);
</script>

<div class="flex flex-col items-center justify-center h-full gap-6">
	{#if cycleStep === 'MEDIA'}
		<MediaPlayer media={question.media} />
		<div class="absolute top-4 left-1/2 -translate-x-1/2 bg-red-700 text-white px-6 py-2 rounded-full text-2xl font-bold shadow-lg">
			RISIKO
		</div>

	{:else if cycleStep === 'WAGER'}
		<div class="text-center">
			<p class="text-3xl text-[var(--color-text)] mb-6">Einsatz wählen</p>
			<div class="flex items-center gap-6">
				<button
					class="text-4xl px-4 py-2 rounded-lg bg-[var(--color-card)] text-[var(--color-text)] cursor-pointer"
					onclick={() => wagerAmount = Math.max(question.wager.min, wagerAmount - 50)}
				>−</button>
				<span class="text-6xl font-bold font-mono text-[var(--color-text)] min-w-[200px] text-center">
					{wagerAmount}
				</span>
				<button
					class="text-4xl px-4 py-2 rounded-lg bg-[var(--color-card)] text-[var(--color-text)] cursor-pointer"
					onclick={() => wagerAmount = Math.min(question.wager.max, wagerAmount + 50)}
				>+</button>
			</div>
			<p class="text-sm text-[var(--color-text)] opacity-50 mt-4">
				Min: {question.wager.min} | Max: {question.wager.max} | Enter = bestätigen
			</p>
		</div>

	{:else if cycleStep === 'ANSWER'}
		<div class="text-center">
			<p class="text-xl text-[var(--color-text)] opacity-60 mb-2">Einsatz: {wagerAmount}</p>
			<div class="bg-[var(--color-card)] rounded-xl px-12 py-8 shadow-2xl">
				<p class="text-5xl font-bold text-[var(--color-text)]">{question.answer.text}</p>
				{#if question.answer.detail}
					<p class="text-xl text-[var(--color-text)] opacity-70 mt-3">{question.answer.detail}</p>
				{/if}
			</div>
		</div>

	{:else if cycleStep === 'SCORING'}
		<div class="text-center">
			<p class="text-3xl text-[var(--color-text)] mb-2">Punkte vergeben</p>
			<p class="text-lg text-[var(--color-text)] opacity-60 mb-4">Einsatz: {wagerAmount}</p>
			<p class="text-6xl font-bold text-[var(--color-text)] mb-6">{question.answer.text}</p>
			<div class="flex gap-4 justify-center">
				{#each [1, 2, 3, 4] as team (team)}
					<div class="flex flex-col items-center gap-1">
						<kbd class="text-2xl font-mono px-4 py-2 rounded-lg bg-black/20 text-[var(--color-text)]">{team}</kbd>
						<div class="w-4 h-4 rounded-full" style:background-color="var(--color-team-{team})"></div>
					</div>
				{/each}
			</div>
			<p class="text-sm text-[var(--color-text)] opacity-50 mt-4">Abzug: Q W E R | Weiter: Enter</p>
		</div>
	{/if}
</div>
