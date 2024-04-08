import type { ConnectedDevice } from '$shared/types/ConnectedDevice';
import { writable } from 'svelte/store';

function createStore() {
	const { subscribe, set } = writable<ConnectedDevice | null>(null);

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
