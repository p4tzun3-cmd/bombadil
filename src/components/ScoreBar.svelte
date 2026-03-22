<script lang="ts">
	import type { ScoreDisplay } from '$lib/engine/types';
	import { formatScore } from '$lib/scoring/formatter';

	let {
		scores,
		display = 'decimal'
	}: {
		scores: number[];
		display?: ScoreDisplay;
	} = $props();

	const teamLabels = ['Team 1', 'Team 2', 'Team 3', 'Team 4'];
</script>

<div class="fixed top-0 right-0 z-50 flex flex-col gap-1 p-2">
	{#each scores as score, i (i)}
		<div
			class="flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg min-w-[140px]
				text-white font-bold text-lg shadow-md"
			style:background-color="var(--color-team-{i + 1})"
		>
			<span class="text-xs opacity-80">{teamLabels[i]}</span>
			<span class="font-mono">{formatScore(score, display)}</span>
		</div>
	{/each}
</div>
