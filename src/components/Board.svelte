<script lang="ts">
	import type { Round, Question, QuestionStatus, ScoreDisplay } from '$lib/engine/types';
	import type { GameState } from '$lib/engine/state-machine.svelte';
	import { calculateScore } from '$lib/scoring/scoring';
	import Card from './Card.svelte';

	let {
		round,
		game,
		onselect
	}: {
		round: Round;
		game: GameState;
		onselect: (question: Question, catIndex: number, qIndex: number) => void;
	} = $props();

	const cols = $derived(round.categories.length);
	const maxRows = $derived(
		Math.max(...round.categories.map((c) => c.questions.length))
	);
</script>

<div class="h-screen w-screen p-4 flex flex-col" style:background-color="var(--color-bg)">
	<!-- Category Headers -->
	<div
		class="grid gap-2 mb-2"
		style:grid-template-columns="repeat({cols}, 1fr)"
	>
		{#each round.categories as cat (cat.name)}
			<div class="text-center font-bold text-xl py-2 border-b-2 border-[var(--color-text)]"
				style:color="var(--color-text)">
				{cat.name}
			</div>
		{/each}
	</div>

	<!-- Question Grid -->
	<div
		class="grid gap-2 flex-1"
		style:grid-template-columns="repeat({cols}, 1fr)"
		style:grid-template-rows="repeat({maxRows}, 1fr)"
	>
		{#each round.categories as cat, ci (cat.name)}
			{#each cat.questions as question, qi (`${ci}-${qi}`)}
				<Card
					points={calculateScore(round.settings.scoring, question.difficulty, question.points)}
					status={game.getQuestionStatus(ci, qi)}
					display={round.settings.scoring.display}
					onselect={() => onselect(question, ci, qi)}
				/>
			{/each}
			<!-- Fill empty cells if category has fewer questions -->
			{#each Array(maxRows - cat.questions.length) as _, fi (`empty-${ci}-${fi}`)}
				<div></div>
			{/each}
		{/each}
	</div>
</div>
