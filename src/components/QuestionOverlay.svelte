<script lang="ts">
	import type { Question, CycleStep } from '$lib/engine/types';
	import SolutionQuestion from './questions/SolutionQuestion.svelte';

	let {
		question,
		cycleStep
	}: {
		question: Question;
		cycleStep: CycleStep;
	} = $props();
</script>

<div class="fixed inset-0 z-40 flex items-center justify-center"
	style:background-color="var(--color-overlay)">

	{#if question.type === 'solution'}
		<SolutionQuestion {question} {cycleStep} />

	{:else if question.type === 'estimation'}
		<!-- TODO Task 12 -->
		<div class="text-4xl text-[var(--color-text)]">Estimation: {cycleStep}</div>

	{:else if question.type === 'risk'}
		<!-- TODO Task 12 -->
		<div class="text-4xl text-[var(--color-text)]">Risk: {cycleStep}</div>

	{:else if question.type === 'lucky'}
		<!-- TODO Task 12 -->
		<div class="text-4xl text-[var(--color-text)]">Lucky: {cycleStep}</div>

	{:else if question.type === 'multiplechoice'}
		<!-- TODO Task 12 -->
		<div class="text-4xl text-[var(--color-text)]">Multiple Choice: {cycleStep}</div>
	{/if}
</div>
