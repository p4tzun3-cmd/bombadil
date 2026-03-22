<script lang="ts">
	import type { Media } from '$lib/engine/types';

	let {
		media,
		fullscreen = true
	}: {
		media: Media;
		fullscreen?: boolean;
	} = $props();

	let imgError = $state(false);
</script>

{#if media.type === 'image'}
	{#if imgError}
		<div class="flex items-center justify-center h-full bg-black/20 rounded-lg">
			<p class="text-[var(--color-text)] opacity-50">Bild nicht gefunden</p>
		</div>
	{:else}
		<img
			src={media.src}
			alt=""
			class={fullscreen ? 'max-h-[70vh] max-w-[90vw] object-contain mx-auto' : 'max-h-full max-w-full object-contain'}
			onerror={() => imgError = true}
		/>
	{/if}

{:else if media.type === 'image_pair'}
	<div class="flex gap-4 items-center justify-center h-full">
		<img src={media.src} alt="" class="max-h-[60vh] max-w-[44vw] object-contain" />
		{#if media.src2}
			<img src={media.src2} alt="" class="max-h-[60vh] max-w-[44vw] object-contain" />
		{/if}
	</div>

{:else if media.type === 'audio'}
	<div class="flex items-center justify-center h-full">
		<div class="text-8xl animate-pulse">🎵</div>
	</div>

{:else if media.type === 'video'}
	<video
		src={media.src}
		class="max-h-[70vh] max-w-[90vw] mx-auto"
		controls
		autoplay
	>
		<track kind="captions" />
	</video>
{/if}
