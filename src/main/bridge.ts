import { database } from '$main/database.js';
import { server } from '$main/server.js';
import { MessageType } from '$shared/enums/messageType.js';
import { ConnectedDevice } from '$shared/types/ConnectedDevice.js';
import { BrowserWindow, ipcMain } from 'electron';
import { Channel } from '../shared/enums/channel.js';

export function registerHandlers() {
	// Logs
	ipcMain.handle(Channel.GetLogs, database.logs.getLogs);
	ipcMain.handle(Channel.ClearLogs, database.logs.clear);
	// ipcMain.handle('logs-add', (_, log) => database.logs.addLog(log));

	// Elements
	ipcMain.handle(Channel.GetElements, () => server.sendMessageToDevice(MessageType.GetElements));
}

export const Browser = {
	updateConnectedDevice(device: ConnectedDevice | null) {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.OnDeviceInfoChange, device);
	}
};
