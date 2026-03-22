<script lang="ts">
	import type { Question, CycleStep } from '$lib/engine/types';
	import MediaPlayer from '../MediaPlayer.svelte';

	let {
		question,
		cycleStep
	}: {
		question: Extract<Question, { type: 'solution' }>;
		cycleStep: CycleStep;
	} = $props();
</script>

<div class="flex flex-col items-center justify-center h-full gap-6">
	{#if cycleStep === 'MEDIA'}
		<MediaPlayer media={question.media} />

	{:else if cycleStep === 'ANSWER'}
		<MediaPlayer media={question.media} />
		<div class="absolute bottom-[10%] left-[10%] right-[10%] text-center
			bg-[var(--color-card)] rounded-xl px-8 py-6 shadow-2xl">
			<p class="text-4xl font-bold text-[var(--color-text)]">{question.answer.text}</p>
			{#if question.answer.detail}
				<p class="text-xl text-[var(--color-text)] opacity-70 mt-2">{question.answer.detail}</p>
			{/if}
		</div>

	{:else if cycleStep === 'SCORING'}
		<div class="text-center">
			<p class="text-3xl text-[var(--color-text)] mb-4">Punkte vergeben</p>
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
