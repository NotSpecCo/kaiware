/// <reference types="svelte" />
/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/svelte" />

import { api } from '$preload/preload';

declare global {
	interface Window {
		// see preload.ts for implementation
		electron: {
			ipcRenderer: IpcRenderer;
			webFrame: WebFrame;
			process: NodeProcess;
		};
		api: typeof api;
	}
}
