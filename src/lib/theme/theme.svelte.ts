import type { Theme } from '../engine/types';

const FALLBACK_THEME: Theme = {
	name: 'Default',
	colors: {
		background: '#1a1a2e',
		card: '#16213e',
		cardHover: '#0f3460',
		cardDone: 'transparent',
		text: '#e0e0e0',
		overlay: '#1a1a2e',
		teams: ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f']
	},
	font: 'system-ui, -apple-system, sans-serif',
	cursorHidden: true
};

export async function loadTheme(name?: string): Promise<Theme> {
	if (!name) return FALLBACK_THEME;
	try {
		const res = await fetch(`/themes/${name}/theme.json`);
		if (!res.ok) {
			console.warn(`Theme '${name}' not found, using fallback`);
			return FALLBACK_THEME;
		}
		return await res.json();
	} catch {
		console.warn(`Failed to load theme '${name}', using fallback`);
		return FALLBACK_THEME;
	}
}

export function applyThemeToDOM(theme: Theme): void {
	const root = document.documentElement;
	root.style.setProperty('--color-bg', theme.colors.background);
	root.style.setProperty('--color-card', theme.colors.card);
	root.style.setProperty('--color-card-hover', theme.colors.cardHover);
	root.style.setProperty('--color-card-done', theme.colors.cardDone);
	root.style.setProperty('--color-text', theme.colors.text);
	root.style.setProperty('--color-overlay', theme.colors.overlay);
	theme.colors.teams.forEach((color, i) => {
		root.style.setProperty(`--color-team-${i + 1}`, color);
	});
	if (theme.font) root.style.setProperty('--font-main', theme.font);
	root.style.setProperty('--cursor', theme.cursorHidden ? 'none' : 'auto');
	if (theme.backgroundImage) {
		root.style.setProperty('--bg-image', `url(${theme.backgroundImage})`);
	} else {
		root.style.setProperty('--bg-image', 'none');
	}
}

export { FALLBACK_THEME };
