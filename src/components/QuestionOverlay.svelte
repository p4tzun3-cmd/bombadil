<script lang="ts">
	import type { Question, CycleStep } from '$lib/engine/types';
	import SolutionQuestion from './questions/SolutionQuestion.svelte';
	import EstimationQuestion from './questions/EstimationQuestion.svelte';
	import RiskQuestion from './questions/RiskQuestion.svelte';
	import LuckyQuestion from './questions/LuckyQuestion.svelte';
	import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion.svelte';

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
		<EstimationQuestion {question} {cycleStep} />
	{:else if question.type === 'risk'}
		<RiskQuestion {question} {cycleStep} />
	{:else if question.type === 'lucky'}
		<LuckyQuestion {question} {cycleStep} />
	{:else if question.type === 'multiplechoice'}
		<MultipleChoiceQuestion {question} {cycleStep} />
	{/if}
</div>
