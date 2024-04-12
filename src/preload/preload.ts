import { Channel } from '$shared/enums/channel.js';
import type { DeviceStorage } from '$shared/types/DeviceStorage.js';
import { electronAPI } from '@electron-toolkit/preload';
import type { DeviceInfo, Log } from '@nothing-special/kaiware-lib/types';
import { contextBridge, ipcRenderer } from 'electron';

export const api = {
	// Methods
	getLogs: (): Promise<Log[]> => ipcRenderer.invoke(Channel.GetLogs),
	// addLog: (log: LogItem): Promise<void> => ipcRenderer.invoke('logs-add', log),
	clearLogs: (): Promise<void> => ipcRenderer.invoke(Channel.ClearLogs),
	refreshElements: (): Promise<void> => ipcRenderer.invoke(Channel.RefreshElements),
	refreshDeviceInfo: (): Promise<void> => ipcRenderer.invoke(Channel.RefreshDeviceInfo),
	refreshStorage: (): Promise<void> => ipcRenderer.invoke(Channel.RefreshStorage),

	// Events
	onNewLog: (callback: (log: Log) => void) =>
		ipcRenderer.on(Channel.NewLog, (_, log) => callback(log)),
	onClearLogs: (callback: () => void) => ipcRenderer.on(Channel.ClearLogs, () => callback()),
	onDeviceInfoChange: (callback: (device: DeviceInfo | null) => void) =>
		ipcRenderer.on(Channel.DeviceInfoChange, (_, device) => callback(device)),
	onElementsChange: (callback: (htmlString: string) => void) =>
		ipcRenderer.on(Channel.ElementsChange, (_, htmlString) => callback(htmlString)),
	onStorageChange: (callback: (storage: DeviceStorage) => void) =>
		ipcRenderer.on(Channel.StorageChange, (_, storage) => callback(storage))
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
