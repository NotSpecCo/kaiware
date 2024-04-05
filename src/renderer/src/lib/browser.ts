export class Browser {
	static openUrl(url: string): Promise<void> {
		return window.api.browser.openUrl(url);
	}

	static downloadUrl(url: string): Promise<void> {
		return window.api.browser.downloadUrl(url);
	}
}
