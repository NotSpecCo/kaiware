import { Channel } from '$shared/enums/channel.js';
import { ConnectedDevice } from '$shared/types/ConnectedDevice.js';
import type { LogItem } from '$shared/types/LogItem.js';
import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

export const api = {
	// Methods
	getLogs: (): Promise<LogItem[]> => ipcRenderer.invoke(Channel.GetLogs),
	// addLog: (log: LogItem): Promise<void> => ipcRenderer.invoke('logs-add', log),
	clearLogs: (): Promise<void> => ipcRenderer.invoke(Channel.ClearLogs),

	// Events
	onNewLog: (callback: (log: LogItem) => void) =>
		ipcRenderer.on(Channel.OnNewLog, (_, log) => callback(log)),
	onClearLogs: (callback: () => void) => ipcRenderer.on(Channel.OnClearLogs, () => callback()),
	onDeviceInfoChange: (callback: (device: ConnectedDevice | null) => void) =>
		ipcRenderer.on(Channel.OnDeviceInfoChange, (_, device) => callback(device))
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld('api', api);
		contextBridge.exposeInMainWorld('electron', electronAPI);
	} catch (error) {
		console.error(error);
	}
} else {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).electron = electronAPI;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(window as any).api = api;
}
