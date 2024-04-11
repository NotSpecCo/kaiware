import { database } from '$main/lib/database.js';
import { server } from '$main/lib/server.js';
import { Channel } from '$shared/enums/channel.js';
import { DeviceInfo } from '$shared/types/DeviceInfo.js';
import { DeviceStorage } from '$shared/types/DeviceStorage.js';
import { LogItem } from '$shared/types/LogItem.js';
import { formatCode } from '$shared/utils/formatCode.js';
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

export const Browser = {
	updateDeviceInfo(device: DeviceInfo | null) {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.DeviceInfoChange, device);
	},
	updateElements(htmlStr: string) {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.ElementsChange, htmlStr);
	},
	updateStorage(storage: DeviceStorage) {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.StorageChange, storage);
	},
	addLog(log: LogItem) {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.NewLog, log);
	},
	clearLogs() {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.ClearLogs);
	}
};
