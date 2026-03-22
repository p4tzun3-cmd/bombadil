<script lang="ts">
	import type { ValidationError } from '$lib/engine/types';

	let {
		errors,
		ondismiss
	}: {
		errors: ValidationError[];
		ondismiss?: () => void;
	} = $props();

	let criticalErrors = $derived(errors.filter((e) => e.severity === 'error'));
	let warnings = $derived(errors.filter((e) => e.severity === 'warning'));
	let hasCritical = $derived(criticalErrors.length > 0);

	// Group errors by catalog
	let grouped = $derived.by(() => {
		const map = new Map<string, ValidationError[]>();
		for (const err of errors) {
			const list = map.get(err.catalog) ?? [];
			list.push(err);
			map.set(err.catalog, list);
		}
		return map;
	});
</script>

<div class="flex items-center justify-center min-h-screen p-8" style:background-color="var(--color-bg, #1a1a2e)">
	<div class="max-w-[800px] w-full">
		<h1 class="text-4xl font-bold mb-2" style:color="var(--color-text, #e0e0e0)">
			{hasCritical ? 'Quiz kann nicht gestartet werden' : 'Warnungen'}
		</h1>
		<p class="text-lg opacity-60 mb-8" style:color="var(--color-text, #e0e0e0)">
			{criticalErrors.length} Fehler, {warnings.length} Warnungen
		</p>

		{#each grouped as [catalog, errs] (catalog)}
			<div class="mb-6">
				<h2 class="text-xl font-semibold mb-2 font-mono" style:color="var(--color-text, #e0e0e0)">
					{catalog}
				</h2>
				<div class="flex flex-col gap-2">
					{#each errs as err (`${err.field}-${err.message}`)}
						<div class="flex items-start gap-3 px-4 py-3 rounded-lg
							{err.severity === 'error' ? 'bg-red-900/40 border border-red-700' : 'bg-yellow-900/30 border border-yellow-700'}">
							<span class="text-sm font-bold mt-0.5
								{err.severity === 'error' ? 'text-red-400' : 'text-yellow-400'}">
								{err.severity === 'error' ? 'FEHLER' : 'WARNUNG'}
							</span>
							<div>
								<p class="text-sm" style:color="var(--color-text, #e0e0e0)">
									{err.message}
								</p>
								<p class="text-xs opacity-50 mt-1" style:color="var(--color-text, #e0e0e0)">
									{err.field}
									{#if err.category} · Kategorie: {err.category}{/if}
									{#if err.question} · Frage {err.question}{/if}
								</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/each}

		{#if !hasCritical && ondismiss}
			<button
				class="mt-4 px-6 py-3 rounded-xl bg-[var(--color-card)] text-[var(--color-text)] text-lg cursor-pointer hover:bg-[var(--color-card-hover)]"
				onclick={ondismiss}
			>
				Trotzdem starten
			</button>
		{/if}
	</div>
</div>
