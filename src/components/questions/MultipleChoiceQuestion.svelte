<script lang="ts">
	import type { Question, CycleStep } from '$lib/engine/types';

	let {
		question,
		cycleStep
	}: {
		question: Extract<Question, { type: 'multiplechoice' }>;
		cycleStep: CycleStep;
	} = $props();

	let revealed = $state(false);

	$effect(() => {
		if (cycleStep === 'ANSWER') {
			revealed = true;
		} else {
			revealed = false;
		}
	});

	const optionLabels = ['A', 'B', 'C', 'D'];
</script>

<div class="flex flex-col items-center justify-center h-full gap-8 px-12">
	{#if cycleStep === 'PROMPT'}
		<p class="text-5xl font-bold text-[var(--color-text)] text-center leading-tight">
			{question.prompt}
		</p>

	{:else if cycleStep === 'OPTIONS' || cycleStep === 'ANSWER'}
		<p class="text-3xl text-[var(--color-text)] text-center mb-4">{question.prompt}</p>
		<div class="grid grid-cols-2 gap-4 w-full max-w-[800px]">
			{#each question.options as option, i (`opt-${i}`)}
				<div
					class="flex items-center gap-4 px-6 py-5 rounded-xl text-2xl font-semibold
						{revealed && i === question.correctOption
							? 'bg-green-600 text-white scale-105'
							: revealed
								? 'bg-black/20 text-[var(--color-text)] opacity-50'
								: 'bg-[var(--color-card)] text-[var(--color-text)]'}
						transition-all"
				>
					<span class="text-lg font-mono opacity-60">{optionLabels[i]}</span>
					<span>{option}</span>
				</div>
			{/each}
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
