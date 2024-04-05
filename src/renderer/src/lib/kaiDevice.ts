import type { DeviceApp } from '$types/DeviceApp';
import type { DeviceInfo } from '$types/DeviceInfo';

export class KaiDevice {
	static getInfo(): Promise<DeviceInfo> {
		return window.api.kaiDevice.getInfo();
	}

	static getRunningApps(): Promise<DeviceApp[]> {
		return window.api.kaiDevice.getRunningApps();
	}

	static getInstalledApps(): Promise<DeviceApp[]> {
		return window.api.kaiDevice.getInstalledApps();
	}

	static installApp(url: string): Promise<DeviceApp> {
		return window.api.kaiDevice.installApp(url);
	}

	static installLocalApp(filePath: string): Promise<DeviceApp> {
		return window.api.kaiDevice.installLocalApp(filePath);
	}

	static uninstallApp(appId: string): Promise<void> {
		return window.api.kaiDevice.uninstallApp(appId);
	}

	static launchApp(appId: string): Promise<void> {
		return window.api.kaiDevice.launchApp(appId);
	}

	static closeApp(appId: string): Promise<void> {
		return window.api.kaiDevice.closeApp(appId);
	}
}
