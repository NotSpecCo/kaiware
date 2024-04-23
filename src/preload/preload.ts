import { Channel } from '$shared/enums/channel.js';
import type { DeviceStorage } from '$shared/types/DeviceStorage.js';
import { electronAPI } from '@electron-toolkit/preload';
import type {
	ConsoleCommandResPayload,
	GetDeviceInfoResPayload,
	GetElementDataResPayload,
	GetElementStylesResPayload,
	Log,
	NetworkRequest
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
	async setElementStyles(index: number, styles: { [key: string]: string }): Promise<void> {
		return ipcRenderer.invoke(Channel.SetElementStyles, index, styles);
	},
	async getElementData(index: number): Promise<GetElementDataResPayload> {
		return ipcRenderer.invoke(Channel.GetElementData, index);
	},
	async setElementData(index: number, data: { [key: string]: unknown }): Promise<void> {
		return ipcRenderer.invoke(Channel.SetElementData, index, data);
	},
	async getStorage(storageType: 'local' | 'session'): Promise<DeviceStorage> {
		return ipcRenderer.invoke(Channel.GetStorage, storageType);
	},
	async getNetworkRequests(): Promise<NetworkRequest[]> {
		return ipcRenderer.invoke(Channel.GetNetworkRequests);
	},
	async clearNetworkRequests(): Promise<void> {
		return ipcRenderer.invoke(Channel.ClearNetworkRequests);
	},
	async getNetworkRequestById(id: number): Promise<NetworkRequest> {
		return ipcRenderer.invoke(Channel.GetNetworkRequestById, id);
	},
	async executeConsoleCommand(
		command: string,
		parseDepth = 0
	): Promise<ConsoleCommandResPayload> {
		return ipcRenderer.invoke(Channel.ExecuteConsoleCommand, command, parseDepth);
	},

	// Events
	onNewLog(callback: (log: Log) => void) {
		ipcRenderer.on(Channel.NewLog, (_, log) => callback(log));
	},
	onClearLogs(callback: () => void) {
		ipcRenderer.on(Channel.ClearLogs, callback);
	},
	onDeviceInfoChange(callback: (device: GetDeviceInfoResPayload | null) => void) {
		ipcRenderer.on(Channel.RefreshDeviceInfo, (_, device) => callback(device));
	},
	onNetworkRequestUpdate(callback: (request: NetworkRequest) => void) {
		ipcRenderer.on(Channel.NetworkRequestUpdate, (_, request) => callback(request));
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
