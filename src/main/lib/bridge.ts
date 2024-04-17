import { database } from '$main/lib/database.js';
import { server } from '$main/lib/server';
import { Channel } from '$shared/enums/channel.js';
import { formatCode } from '$shared/utils/formatCode.js';
import { MessageType } from '@nothing-special/kaiware-lib/enums';
import {
	DeviceInfo,
	GetElementDataResPayload,
	GetElementStylesResPayload,
	GetElementsResPayload,
	GetLogResPayload,
	GetStorageResPayload
} from '@nothing-special/kaiware-lib/types';
import { BrowserWindow, ipcMain } from 'electron';

export function registerChannelHandlers() {
	ipcMain.handle(Channel.GetLogs, database.logs.getLogs);
	ipcMain.handle(Channel.ClearLogs, database.logs.clear);

	ipcMain.handle(Channel.GetDeviceInfo, () =>
		server.sendRequest({
			type: MessageType.GetDeviceInfo,
			data: null
		})
	);

	ipcMain.handle(Channel.GetElements, async () => {
		const response = await server.sendRequest<GetElementsResPayload>({
			type: MessageType.GetElements,
			data: null
		});

		return formatCode(response, 'html');
	});

	ipcMain.handle(Channel.GetElementStyles, (_, index: number) =>
		server.sendRequest<GetElementStylesResPayload>({
			type: MessageType.GetElementStyles,
			data: { index }
		})
	);

	ipcMain.handle(Channel.GetElementData, (_, index: number) =>
		server.sendRequest<GetElementDataResPayload>({
			type: MessageType.GetElementData,
			data: { index }
		})
	);

	ipcMain.handle(Channel.GetStorage, (_, storageType: 'local' | 'session') =>
		server.sendRequest<GetStorageResPayload>({
			type: MessageType.GetStorage,
			data: { storageType }
		})
	);
}

// Listen for new logs
server.onReceiveMessage(MessageType.NewLog, async (message) => {
	const createdLog = await database.logs.addLog(message.data as GetLogResPayload);
	BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.NewLog, createdLog);
});

// Listen for clear logs
server.onReceiveMessage(MessageType.ClearLogs, async () => {
	await database.logs.clear();
	BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.ClearLogs);
});

export const Browser = {
	updateDeviceInfo(device: DeviceInfo | null) {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.RefreshDeviceInfo, device);
	}
};
