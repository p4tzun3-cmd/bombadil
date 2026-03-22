<script lang="ts">
	import type { QuestionStatus, ScoreDisplay } from '$lib/engine/types';
	import { formatScore } from '$lib/scoring/formatter';

	let {
		points,
		status = 'open',
		display = 'decimal',
		onselect
	}: {
		points: number;
		status?: QuestionStatus;
		display?: ScoreDisplay;
		onselect?: () => void;
	} = $props();
</script>

{#if status === 'done'}
	<div class="h-full rounded-xl opacity-30"></div>
{:else}
	<button
		class="h-full w-full rounded-xl flex items-center justify-center text-3xl font-bold
			transition-colors cursor-pointer
			{status === 'active'
				? 'bg-[var(--color-overlay)] border-2 border-[var(--color-text)]'
				: 'bg-[var(--color-card)] hover:bg-[var(--color-card-hover)] border-2 border-transparent'}"
		style:color="var(--color-text)"
		onclick={() => onselect?.()}
		disabled={status === 'active'}
	>
		{formatScore(points, display)}
	</button>
{/if}
