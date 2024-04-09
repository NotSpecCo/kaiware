import type { DeviceInfo } from '$shared/types/DeviceInfo';
import { writable } from 'svelte/store';

function createStore() {
	const { subscribe, set } = writable<DeviceInfo | null>(null);

	window.api.onDeviceInfoChange((device) => set(device));

	function reset() {
		set(null);
	}

	return {
		subscribe,
		set,
		reset
	};
}

export const device = createStore();
