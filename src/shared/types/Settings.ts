import { Animations } from '$shared/enums/animations';
import { Density } from '$shared/enums/density';
import { TextSize } from '$shared/enums/textSize';

export declare type ThemeConfig = {
	id: string;
	values: ThemeSettings;
};

export type ThemeSettings = {
	// Main
	mainBackgroundColorH: number;
	mainBackgroundColorS: number;
	mainBackgroundColorL: number;
	mainBackgroundColorA: number;

	// Panel
	panelBackgroundColorH: number;
	panelBackgroundColorS: number;
	panelBackgroundColorL: number;
	panelBackgroundColorA: number;

	// General Colors
	accentColorH: number;
	accentColorS: number;
	accentColorL: number;
	accentColorA: number;

	errorColorH: number;
	errorColorS: number;
	errorColorL: number;
	errorColorA: number;

	warningColorH: number;
	warningColorS: number;
	warningColorL: number;
	warningColorA: number;

	successColorH: number;
	successColorS: number;
	successColorL: number;
	successColorA: number;

	// Text
	primaryTextColorH: number;
	primaryTextColorS: number;
	primaryTextColorL: number;
	primaryTextColorA: number;

	secondaryTextColorH: number;
	secondaryTextColorS: number;
	secondaryTextColorL: number;
	secondaryTextColorA: number;

	tertiaryTextColorH: number;
	tertiaryTextColorS: number;
	tertiaryTextColorL: number;
	tertiaryTextColorA: number;

	// Other
	dividerColorH: number;
	dividerColorS: number;
	dividerColorL: number;
	dividerColorA: number;
};

export type Settings = {
	textSize: TextSize;
	displayDensity: Density;
	borderRadius: number;
	animationSpeed: Animations;
	themeId: string;

	// Toaster
	toasterLocation: 'top' | 'bottom';
	toasterDuration: number;

	showHelpText: boolean;
};
