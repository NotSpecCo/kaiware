import type { DeviceStorage } from '$shared/types/DeviceStorage';
import type { LogItem } from '$shared/types/LogItem';
import { writable } from 'svelte/store';

export const logs = createLogsStore();
export const elements = createElementsStore();
export const localStorage = createLocalStorageStore();
export const sessionStorage = createSessionStorageStore();

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

function createLocalStorageStore() {
	const { subscribe, set } = writable<DeviceStorage | null>(null);

	function load(): void {
		window.api.refreshStorage();
	}

	function clear(): void {
		set(null);
	}

	window.api.onStorageChange((storage) => {
		if (storage.type !== 'local') return;
		set(storage);
	});

	// TODO: Add methods to update storage

	return {
		subscribe,
		set,
		load,
		clear
	};
}
function createSessionStorageStore() {
	const { subscribe, set } = writable<DeviceStorage | null>(null);

	function load(): void {
		window.api.refreshStorage();
	}

	function clear(): void {
		set(null);
	}

	window.api.onStorageChange((storage) => {
		if (storage.type !== 'session') return;
		set(storage);
	});

	// TODO: Add methods to update storage

	return {
		subscribe,
		set,
		load,
		clear
	};
}

function createElementsStore() {
	const { subscribe, set } = writable<string>('');

	function load(): void {
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
