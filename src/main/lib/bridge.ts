import { database } from '$main/lib/database.js';
import { server } from '$main/lib/server';
import { Channel } from '$shared/enums/channel.js';
import { formatCode } from '$shared/utils/formatCode.js';
import { MessageType } from '@nothing-special/kaiware-lib/enums';
import {
	ConsoleCommandResPayload,
	DeviceInfo,
	GetElementDataResPayload,
	GetElementStylesResPayload,
	GetElementsResPayload,
	GetLogResPayload,
	GetStorageResPayload,
	NetworkRequest
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

	ipcMain.handle(
		Channel.SetElementStyles,
		(_, index: number, styles: { [key: string]: string }) =>
			server.sendRequest({
				type: MessageType.SetElementStyles,
				data: { index, styles }
			})
	);

	ipcMain.handle(Channel.GetElementData, (_, index: number) =>
		server.sendRequest<GetElementDataResPayload>({
			type: MessageType.GetElementData,
			data: { index }
		})
	);

	ipcMain.handle(Channel.SetElementData, (_, index: number, data: { [key: string]: unknown }) =>
		server.sendRequest({
			type: MessageType.SetElementData,
			data: { index, data }
		})
	);

	ipcMain.handle(Channel.GetStorage, (_, storageType: 'local' | 'session') =>
		server.sendRequest<GetStorageResPayload>({
			type: MessageType.GetStorage,
			data: { storageType }
		})
	);

	ipcMain.handle(Channel.GetNetworkRequests, database.networkRequests.getRequests);
	ipcMain.handle(Channel.ClearNetworkRequests, database.networkRequests.clear);
	ipcMain.handle(Channel.GetNetworkRequestById, (_, id: number) =>
		database.networkRequests.getRequestById(id)
	);

	ipcMain.handle(Channel.ExecuteConsoleCommand, (_, command: string) =>
		server.sendRequest<ConsoleCommandResPayload>({
			type: MessageType.ExecuteConsoleCommand,
			data: { command }
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

// Listen for network requests
server.onReceiveMessage(MessageType.NetworkRequestUpdate, async (message) => {
	const createdRequest = await database.networkRequests.updateRequest(
		message.data as NetworkRequest
	);
	BrowserWindow.getAllWindows()[0]?.webContents.send(
		Channel.NetworkRequestUpdate,
		createdRequest
	);
});

export const Browser = {
	updateDeviceInfo(device: DeviceInfo | null) {
		BrowserWindow.getAllWindows()[0]?.webContents.send(Channel.RefreshDeviceInfo, device);
	}
};
