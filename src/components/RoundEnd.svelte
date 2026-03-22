<script lang="ts">
	import type { ScoreDisplay } from '$lib/engine/types';
	import { formatScore } from '$lib/scoring/formatter';

	let {
		scores,
		display = 'decimal',
		onback
	}: {
		scores: number[];
		display?: ScoreDisplay;
		onback: () => void;
	} = $props();

	const teamLabels = ['Team 1', 'Team 2', 'Team 3', 'Team 4'];

	let ranked = $derived.by(() => {
		return scores
			.map((score, i) => ({ score, index: i, label: teamLabels[i] ?? `Team ${i + 1}` }))
			.sort((a, b) => b.score - a.score);
	});

	const podiumStyles = [
		'text-6xl text-yellow-400',
		'text-4xl text-gray-300',
		'text-3xl text-amber-600',
		'text-2xl opacity-50'
	];
</script>

<div class="flex flex-col items-center justify-center h-screen gap-8 p-8"
	style:background-color="var(--color-bg)">

	<h1 class="text-5xl font-bold" style:color="var(--color-text)">Zwischenstand</h1>

	<div class="flex flex-col gap-4 w-full max-w-[500px]">
		{#each ranked as entry, i (`rank-${entry.index}`)}
			<div class="flex items-center justify-between px-6 py-4 rounded-xl {podiumStyles[i] ?? podiumStyles[3]}"
				style:background-color="var(--color-team-{entry.index + 1})"
			>
				<div class="flex items-center gap-4">
					<span class="font-mono opacity-60">#{i + 1}</span>
					<span class="font-bold">{entry.label}</span>
				</div>
				<span class="font-mono font-bold">{formatScore(entry.score, display)}</span>
			</div>
		{/each}
	</div>

	<button
		class="mt-4 px-8 py-4 rounded-xl text-xl cursor-pointer
			bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]"
		style:color="var(--color-text)"
		onclick={onback}
	>
		Weiter
	</button>
</div>
