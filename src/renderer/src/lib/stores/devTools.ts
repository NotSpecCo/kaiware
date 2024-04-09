import type { LogItem } from '$shared/types/LogItem';
import { writable } from 'svelte/store';

export const logs = createLogsStore();
export const elements = createElementsStore();

function createLogsStore() {
	const { subscribe, set, update } = writable<LogItem[]>([]);

	async function load(): Promise<void> {
		const logs = await window.api.getLogs();
		set(logs);
	}

	function clear(): void {
		set([]);
	}

	window.api.onNewLog((log) => {
		update((previous) => [log, ...previous]);
	});

	window.api.onClearLogs(() => {
		clear();
	});

	return {
		subscribe,
		set,
		load,
		clear
	};
}

function createElementsStore() {
	const { subscribe, set } = writable<string>('');

	async function load(): Promise<void> {
		window.api.refreshElements();
	}

	function clear(): void {
		set('');
	}

	window.api.onElementsChange((htmlString) => {
		set(htmlString);
	});

	return {
		subscribe,
		set,
		load,
		clear
	};
}
