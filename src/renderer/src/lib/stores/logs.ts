import type { LogItem } from '$types/LogItem';
import { writable } from 'svelte/store';

function createStore() {
	const { subscribe, set, update } = writable<LogItem[]>([]);

	async function load(): Promise<void> {
		const logs = await window.api.logs.getLogs();
		set(logs);

		window.api.logs.onNewLog((log) => {
			update((previous) => [log, ...previous]);
		});

		window.api.logs.onClearLogs(() => {
			set([]);
		});
	}

	return {
		subscribe,
		set,
		load
	};
}

export const logs = createStore();
