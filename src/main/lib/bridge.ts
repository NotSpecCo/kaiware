import { database } from '$main/lib/database.js';
import { server } from '$main/lib/server';
import { Channel } from '$shared/enums/channel.js';
import { formatCode } from '$shared/utils/formatCode.js';
import { MessageType } from '@nothing-special/kaiware-lib/enums';
import type {
	ClearLogsPayload,
	GetElementDataPayload,
	GetElementDataResPayload,
	GetElementStylesResPayload,
	GetElementsPayload,
	GetElementsResPayload,
	GetLogResPayload
} from '@nothing-special/kaiware-lib/types';
import {
	DeviceInfo,
	GetDeviceInfoPayload,
	GetDeviceInfoResPayload,
	GetElementStylesPayload,
	GetStoragePayload,
	GetStorageResPayload
} from '@nothing-special/kaiware-lib/types';
import { BrowserWindow, ipcMain } from 'electron';

export function registerChannelHandlers() {
	ipcMain.handle(Channel.GetLogs, database.logs.getLogs);
	ipcMain.handle(Channel.ClearLogs, database.logs.clear);

	ipcMain.handle(Channel.GetDeviceInfo, () =>
		server.sendRequest<GetDeviceInfoPayload, GetDeviceInfoResPayload>(
			{
				type: MessageType.GetDeviceInfo,
				data: null
			},
			MessageType.GetDeviceInfoRes
		)
	);

	ipcMain.handle(Channel.GetElements, async () => {
		const response = await server.sendRequest<GetElementsPayload, GetElementsResPayload>(
			{
				type: MessageType.GetElements,
				data: null
			},
			MessageType.GetElementsRes
		);

		return formatCode(response, 'html');
	});

	ipcMain.handle(Channel.GetElementStyles, (_, index: number) =>
		server.sendRequest<GetElementStylesPayload, GetElementStylesResPayload>(
			{
				type: MessageType.GetElementStyles,
				data: { index }
			},
			MessageType.GetElementStylesRes
		)
	);

	ipcMain.handle(Channel.GetElementData, (_, index: number) =>
		server.sendRequest<GetElementDataPayload, GetElementDataResPayload>(
			{
				type: MessageType.GetElementData,
				data: { index }
			},
			MessageType.GetElementDataRes
		)
	);

	ipcMain.handle(Channel.GetStorage, (_, storageType: 'local' | 'session') =>
		server.sendRequest<GetStoragePayload, GetStorageResPayload>(
			{
				type: MessageType.GetStorage,
				data: { storageType }
			},
			MessageType.GetStorageRes
		)
	);
}

// Listen for new logs
server.onReceiveMessage<GetLogResPayload>(MessageType.NewLog, async (message) => {
	const createdLog = await database.logs.addLog(message.data);
	BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.NewLog, createdLog);
});

// Listen for clear logs
server.onReceiveMessage<ClearLogsPayload>(MessageType.ClearLogs, async () => {
	await database.logs.clear();
	BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.ClearLogs);
});

export const Browser = {
	updateDeviceInfo(device: DeviceInfo | null) {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.RefreshDeviceInfo, device);
	}
};
