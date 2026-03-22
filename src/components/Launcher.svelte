<script lang="ts">
	import type { Round } from '$lib/engine/types';

	let {
		rounds,
		onselect
	}: {
		rounds: Round[];
		onselect: (index: number) => void;
	} = $props();
</script>

<div class="flex flex-col items-center justify-center h-screen gap-8 p-8">
	<h1 class="text-5xl font-bold text-[var(--color-text)]">Bombadil</h1>
	<p class="text-xl text-[var(--color-text)] opacity-70">Runde wählen</p>

	<div class="flex flex-wrap justify-center gap-6">
		{#each rounds as round, i (round.meta.title)}
			<button
				class="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl
					bg-[var(--color-card)] hover:bg-[var(--color-card-hover)]
					border-2 border-transparent hover:border-[var(--color-text)]
					transition-colors cursor-pointer min-w-[200px]"
				onclick={() => onselect(i)}
			>
				<span class="text-2xl font-bold text-[var(--color-text)]">{round.meta.title}</span>
				{#if round.meta.subtitle}
					<span class="text-sm text-[var(--color-text)] opacity-60">{round.meta.subtitle}</span>
				{/if}
				{#if round.meta.roundLabel}
					<span class="text-xs px-3 py-1 rounded-full bg-[var(--color-overlay)] text-[var(--color-text)]">
						{round.meta.roundLabel}
					</span>
				{/if}
			</button>
		{/each}
	</div>
</div>
