const activeElements: Set<HTMLMediaElement> = new Set();
let thinkLoopElement: HTMLAudioElement | null = null;

export function playSound(src: string): void {
	try {
		const audio = new Audio(src);
		activeElements.add(audio);
		audio.addEventListener('ended', () => activeElements.delete(audio));
		audio.play().catch(() => {});
	} catch {
		// Runtime guard: missing audio file should not crash the quiz
	}
}

export function playLoop(src: string): void {
	stopLoop();
	try {
		thinkLoopElement = new Audio(src);
		thinkLoopElement.loop = true;
		activeElements.add(thinkLoopElement);
		fadeIn(thinkLoopElement, 1000);
	} catch {
		// Silent fail
	}
}

export function stopLoop(): void {
	if (thinkLoopElement) {
		fadeOut(thinkLoopElement, 500);
		thinkLoopElement = null;
	}
}

export function stopAll(): void {
	for (const el of activeElements) {
		el.pause();
		el.currentTime = 0;
	}
	activeElements.clear();
	thinkLoopElement = null;
}

export function fadeIn(element: HTMLMediaElement, durationMs: number = 1000): void {
	element.volume = 0;
	element.play().catch(() => {});

	const steps = 20;
	const stepDuration = durationMs / steps;
	const volumeStep = 1 / steps;
	let currentStep = 0;

	function tick() {
		currentStep++;
		if (currentStep >= steps) {
			element.volume = 1;
			return;
		}
		element.volume = Math.min(1, currentStep * volumeStep);
		requestAnimationFrame(() => setTimeout(tick, stepDuration));
	}

	tick();
}

export function fadeOut(element: HTMLMediaElement, durationMs: number = 500): void {
	const steps = 10;
	const stepDuration = durationMs / steps;
	const startVolume = element.volume;
	const volumeStep = startVolume / steps;
	let currentStep = 0;

	function tick() {
		currentStep++;
		if (currentStep >= steps) {
			element.volume = 0;
			element.pause();
			element.currentTime = 0;
			activeElements.delete(element);
			return;
		}
		element.volume = Math.max(0, startVolume - currentStep * volumeStep);
		requestAnimationFrame(() => setTimeout(tick, stepDuration));
	}

	tick();
}

export function preloadAudio(sources: string[]): void {
	for (const src of sources) {
		const audio = new Audio();
		audio.preload = 'auto';
		audio.src = src;
	}
}
