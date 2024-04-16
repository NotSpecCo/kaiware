import { Channel } from '$shared/enums/channel.js';
import type { DeviceStorage } from '$shared/types/DeviceStorage.js';
import { electronAPI } from '@electron-toolkit/preload';
import type {
	GetDeviceInfoResPayload,
	GetElementDataResPayload,
	GetElementStylesResPayload,
	Log
} from '@nothing-special/kaiware-lib/types';
import { contextBridge, ipcRenderer } from 'electron';

export const api = {
	// Methods
	async getLogs(): Promise<Log[]> {
		return ipcRenderer.invoke(Channel.GetLogs);
	},
	clearLogs(): Promise<void> {
		return ipcRenderer.invoke(Channel.ClearLogs);
	},
	async getDeviceInfo(): Promise<GetDeviceInfoResPayload | null> {
		return ipcRenderer.invoke(Channel.GetDeviceInfo);
	},
	async getElements(): Promise<string> {
		return ipcRenderer.invoke(Channel.GetElements);
	},
	async getElementStyles(index: number): Promise<GetElementStylesResPayload> {
		return ipcRenderer.invoke(Channel.GetElementStyles, index);
	},
	async getElementData(index: number): Promise<GetElementDataResPayload> {
		return ipcRenderer.invoke(Channel.GetElementStyles, index);
	},
	async getStorage(storageType: 'local' | 'session'): Promise<DeviceStorage> {
		return ipcRenderer.invoke(Channel.GetStorage, storageType);
	},

	// Events
	onNewLog(callback: (log: Log) => void) {
		ipcRenderer.on(Channel.NewLog, (_, log) => callback(log));
	},
	onClearLogs(callback: () => void) {
		ipcRenderer.on(Channel.ClearLogs, callback);
	},
	onDeviceInfoChange(callback: (device: GetDeviceInfoResPayload) => void) {
		ipcRenderer.on(Channel.RefreshDeviceInfo, (_, device) => callback(device));
	}
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
