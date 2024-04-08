import type { LogItem } from '$shared/types/LogItem';
import { writable } from 'svelte/store';

function createStore() {
	const { subscribe, set, update } = writable<LogItem[]>([]);

	async function load(): Promise<void> {
		const logs = await window.api.getLogs();
		set(logs);
		window.api.onNewLog((log) => {
			update((previous) => [log, ...previous]);
		});
		window.api.onClearLogs(() => {
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
