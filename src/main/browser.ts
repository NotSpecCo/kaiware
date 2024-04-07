import { ConnectedDevice } from '$shared/types/ConnectedDevice.js';
import { BrowserWindow } from 'electron';

export const Browser = {
	updateConnectedDevice(device: ConnectedDevice | null) {
		BrowserWindow.getAllWindows()[0]?.webContents.send('device-on-connection-change', device);
	}
};
