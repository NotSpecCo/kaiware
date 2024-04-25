import type { ThemeConfig } from '$shared/types/Settings';

export const themes: ThemeConfig[] = [
	{
		id: 'dark',
		values: {
			// Main
			mainBackgroundColorH: 219,
			mainBackgroundColorS: 23,
			mainBackgroundColorL: 12,
			mainBackgroundColorA: 100,

			// Panel
			panelBackgroundColorH: 219,
			panelBackgroundColorS: 24,
			panelBackgroundColorL: 16,
			panelBackgroundColorA: 100,

			// Accent Color
			accentColorH: 179,
			accentColorS: 51,
			accentColorL: 59,
			accentColorA: 100,

			errorColorH: 358,
			errorColorS: 65,
			errorColorL: 55,
			errorColorA: 100,

			warningColorH: 45,
			warningColorS: 93,
			warningColorL: 58,
			warningColorA: 100,

			successColorH: 118,
			successColorS: 49,
			successColorL: 48,
			successColorA: 100,

			// Text
			primaryTextColorH: 0,
			primaryTextColorS: 0,
			primaryTextColorL: 100,
			primaryTextColorA: 88,

			secondaryTextColorH: 0,
			secondaryTextColorS: 0,
			secondaryTextColorL: 100,
			secondaryTextColorA: 50,

			tertiaryTextColorH: 0,
			tertiaryTextColorS: 0,
			tertiaryTextColorL: 100,
			tertiaryTextColorA: 30,

			// Other
			dividerColorH: 0,
			dividerColorS: 0,
			dividerColorL: 100,
			dividerColorA: 10
		}
	}
];
