import { themes } from '$lib/themes';
import { Storage } from '$lib/utils/storage';
import { Animations } from '$shared/enums/animations';
import { Density } from '$shared/enums/density';
import { TextSize } from '$shared/enums/textSize';
import type { Settings } from '$shared/types/Settings';
import { writable } from 'svelte/store';

function createStore() {
	const { subscribe, set, update } = writable<Settings>(load());

	// Save settings to storage whenever they change
	subscribe((val) => {
		Storage.local.set('settings', val);
	});

	function load(): Settings {
		const defaultSettings: Settings = {
			textSize: TextSize.Small,
			displayDensity: Density.Normal,
			borderRadius: 12,
			animationSpeed: Animations.Normal,
			toasterLocation: 'bottom',
			toasterDuration: 3000,
			showHelpText: true,
			themeId: themes[0].id
		};
		const existingSettings = Storage.local.get<Settings>('settings') ?? {};

		const initialSettings = {
			...defaultSettings,
			...existingSettings
		};

		applySettings(initialSettings);

		return initialSettings;
	}

	function applySettings(settings: Partial<Settings>): void {
		// Text Size
		if (settings.textSize) {
			const textSize = {
				[TextSize.Smallest]: 8,
				[TextSize.Small]: 9,
				[TextSize.Medium]: 10,
				[TextSize.Large]: 11,
				[TextSize.Largest]: 12
			};
			document.documentElement.style.setProperty(
				'--base-font-size',
				`${textSize[settings.textSize]}px`
			);
		}

		// Display Density
		if (settings.displayDensity) {
			document.body.dataset.density = settings.displayDensity;
		}

		// Border Radius
		if (settings.borderRadius) {
			document.documentElement.style.setProperty('--radius', `${settings.borderRadius}px`);
		}

		// Animations
		if (settings.animationSpeed) {
			document.documentElement.style.setProperty(
				'--animation-speed',
				`${settings.animationSpeed}ms`
			);
		}

		// Theme
		if (settings.themeId) {
			const theme = themes.find((t) => t.id === settings.themeId)?.values;
			if (!theme) return;

			document.documentElement.style.setProperty(
				'--main-background-color',
				`hsla(${theme.mainBackgroundColorH}, ${theme.mainBackgroundColorS}%, ${theme.mainBackgroundColorL}%, ${theme.mainBackgroundColorA}%)`
			);

			document.documentElement.style.setProperty(
				'--panel-background-color',
				`hsla(${theme.panelBackgroundColorH}, ${theme.panelBackgroundColorS}%, ${theme.panelBackgroundColorL}%, ${theme.panelBackgroundColorA}%)`
			);

			document.documentElement.style.setProperty(
				'--panel-border-color',
				`hsla(${theme.panelBackgroundColorH}, ${theme.panelBackgroundColorS}%, ${theme.panelBackgroundColorL * 1.2}%, ${theme.panelBackgroundColorA}%)`
			);

			document.documentElement.style.setProperty(
				'--accent-color',
				`hsla(${theme.accentColorH}, ${theme.accentColorS}%, ${theme.accentColorL}%, ${theme.accentColorA}%)`
			);

			document.documentElement.style.setProperty(
				'--error-color',
				`hsla(${theme.errorColorH}, ${theme.errorColorS}%, ${theme.errorColorL}%, ${theme.errorColorA}%)`
			);

			document.documentElement.style.setProperty(
				'--warning-color',
				`hsla(${theme.warningColorH}, ${theme.warningColorS}%, ${theme.warningColorL}%, ${theme.warningColorA}%)`
			);

			document.documentElement.style.setProperty(
				'--success-color',
				`hsla(${theme.successColorH}, ${theme.successColorS}%, ${theme.successColorL}%, ${theme.successColorA}%)`
			);

			document.documentElement.style.setProperty(
				'--divider-color',
				`hsla(${theme.dividerColorH}, ${theme.dividerColorS}%, ${theme.dividerColorL}%, ${theme.dividerColorA}%)`
			);

			document.documentElement.style.setProperty(
				'--primary-text-color',
				`hsla(${theme.primaryTextColorH}, ${theme.primaryTextColorS}%, ${theme.primaryTextColorL}%, ${theme.primaryTextColorA}%)`
			);

			document.documentElement.style.setProperty(
				'--secondary-text-color',
				`hsla(${theme.secondaryTextColorH}, ${theme.secondaryTextColorS}%, ${theme.secondaryTextColorL}%, ${theme.secondaryTextColorA}%)`
			);

			document.documentElement.style.setProperty(
				'--tertiary-text-color',
				`hsla(${theme.tertiaryTextColorH}, ${theme.tertiaryTextColorS}%, ${theme.tertiaryTextColorL}%, ${theme.tertiaryTextColorA}%)`
			);
		}
	}

	function updateSettings(data: Partial<Settings>) {
		update((previous) => ({ ...previous, ...data }));
		applySettings(data);
	}

	return {
		subscribe,
		set,
		update: updateSettings,
		updateOne: function <T extends keyof Settings>(key: T, value: Settings[T]) {
			updateSettings({ [key]: value });
		}
	};
}

export const settings = createStore();
