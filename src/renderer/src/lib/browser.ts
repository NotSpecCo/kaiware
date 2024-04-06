export const Browser = {
	openUrl(url: string): Promise<void> {
		return window.api.browser.openUrl(url);
	},

	downloadUrl(url: string): Promise<void> {
		return window.api.browser.downloadUrl(url);
	}
};
