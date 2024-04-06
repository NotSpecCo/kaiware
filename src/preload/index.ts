import type { LogItem } from '$shared/types/LogItem.js';
import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

export const api = {
	logs: {
		getLogs: (): Promise<LogItem[]> => ipcRenderer.invoke('logs-get'),
		addLog: (log: LogItem): Promise<void> => ipcRenderer.invoke('logs-add', log),
		clearLogs: (): Promise<void> => ipcRenderer.invoke('logs-clear'),
		onNewLog: (callback: (log: LogItem) => void) =>
			ipcRenderer.on('logs-on-add', (_, log) => callback(log)),
		onClearLogs: (callback: () => void) => ipcRenderer.on('logs-on-clear', () => callback())
	},
	kaiDevice: {
		getInfo: () => ipcRenderer.invoke('device-info'),
		getRunningApps: () => ipcRenderer.invoke('device-running-apps'),
		getInstalledApps: () => ipcRenderer.invoke('device-installed-apps'),
		installApp: (url: string) => ipcRenderer.invoke('device-install', url),
		installLocalApp: (url: string) => ipcRenderer.invoke('device-install-local', url),
		uninstallApp: (appId: string) => ipcRenderer.invoke('device-uninstall', appId),
		launchApp: (appId: string) => ipcRenderer.invoke('device-launch-app', appId),
		closeApp: (appId: string) => ipcRenderer.invoke('device-close-app', appId)
	},
	browser: {
		openUrl: (url: string) => ipcRenderer.invoke('open-url', url),
		downloadUrl: (url: string) => ipcRenderer.invoke('download-url', url)
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
