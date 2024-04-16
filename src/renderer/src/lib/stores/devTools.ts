import type { DeviceStorage } from '$shared/types/DeviceStorage';
import type { Log } from '@nothing-special/kaiware-lib/types';

import { writable } from 'svelte/store';

export const logs = createLogsStore();
export const elements = createElementsStore();
export const localStorage = createLocalStorageStore();
export const sessionStorage = createSessionStorageStore();

function createLogsStore() {
	const { subscribe, set, update } = writable<Log[]>([]);

	async function load(): Promise<void> {
		await window.api
			.getLogs()
			.then((res) => set(res))
			.catch((err) => console.log(err));
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

	async function refresh(): Promise<void> {
		await window.api
			.getStorage('local')
			.then((res) => set(res))
			.catch((err) => console.log(err));
	}

	// TODO: Add methods to update storage

	return {
		subscribe,
		set,
		refresh
	};
}
function createSessionStorageStore() {
	const { subscribe, set } = writable<DeviceStorage | null>(null);

	async function refresh(): Promise<void> {
		await window.api
			.getStorage('session')
			.then((res) => set(res))
			.catch((err) => console.log(err));
	}

	// TODO: Add methods to update storage

	return {
		subscribe,
		set,
		refresh
	};
}

function createElementsStore() {
	const { subscribe, set } = writable<string>('');

	async function refresh(): Promise<void> {
		await window.api
			.getElements()
			.then((res) => set(res))
			.catch((err) => console.log(err));
	}

	function clear(): void {
		set('');
	}

	return {
		subscribe,
		set,
		refresh,
		clear
	};
}
