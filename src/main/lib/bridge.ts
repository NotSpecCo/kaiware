import { database } from '$main/lib/database.js';
import { server } from '$main/lib/server.js';
import { Channel } from '$shared/enums/channel.js';
import { DeviceStorage } from '$shared/types/DeviceStorage.js';
import { formatCode } from '$shared/utils/formatCode.js';
import type { ElementStylesUpdate, Log } from '@nothing-special/kaiware-lib/types';
import { DeviceInfo } from '@nothing-special/kaiware-lib/types';
import { BrowserWindow, ipcMain } from 'electron';

export function registerChannelHandlers() {
	// Logs
	ipcMain.handle(Channel.GetLogs, database.logs.getLogs);
	ipcMain.handle(Channel.ClearLogs, database.logs.clear);
	// ipcMain.handle('logs-add', (_, log) => database.logs.addLog(log));

	// Requests
	ipcMain.handle(Channel.RefreshElements, () => server.requestElements());
	ipcMain.handle(Channel.RefreshDeviceInfo, () => server.requestDeviceInfo());
	ipcMain.handle(Channel.RefreshStorage, (_, storageType: 'local' | 'session') =>
		server.requestStorage(storageType)
	);

	ipcMain.handle(Channel.GetElementStyles, (_, index: number) =>
		server.requestElementStyles(index)
	);
}

// Handle websocket messages
server.onReceiveDeviceInfo((device) => {
	Browser.updateDeviceInfo(device);
});

server.onReceiveElements(async (htmlStr) => {
	const formatted = await formatCode(htmlStr, 'html');
	Browser.updateElements(formatted);
});

server.onReceiveStorage((storage) => {
	Browser.updateStorage(storage);
});

server.onReceiveLog(async (log) => {
	const createdLog = await database.logs.addLog(log);
	Browser.addLog(createdLog);
});

server.onReceiveClearLogs(() => {
	database.logs.clear();
	Browser.clearLogs();
});

server.onReceiveElementStyles((data: ElementStylesUpdate) => {
	Browser.updateElementStyles(data);
});

export const Browser = {
	updateDeviceInfo(device: DeviceInfo | null) {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.DeviceInfoChange, device);
	},
	updateElements(htmlStr: string) {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.ElementsChange, htmlStr);
	},
	updateElementStyles(data: ElementStylesUpdate) {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.ElementStylesChange, data);
	},
	updateStorage(storage: DeviceStorage) {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.StorageChange, storage);
	},
	addLog(log: Log) {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.NewLog, log);
	},
	clearLogs() {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.ClearLogs);
	}
};
