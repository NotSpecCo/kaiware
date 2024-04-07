export function isJson(str: string): boolean {
	try {
		JSON.parse(str);
		return true;
	} catch (e) {
		return false;
	}
}
