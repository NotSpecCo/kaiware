import type { DeviceInfo } from '@nothing-special/kaiware-lib/types';
import { writable } from 'svelte/store';

function createStore() {
	const { subscribe, set } = writable<DeviceInfo | null>(null);

	async function refresh() {
		await window.api
			.getDeviceInfo()
			.then((res) => set(res))
			.catch((err) => console.log(err));
	}

	window.api.onDeviceInfoChange((device) => set(device));

	function reset() {
		set(null);
	}

	return {
		subscribe,
		set,
		refresh,
		reset
	};
}

export const device = createStore();
