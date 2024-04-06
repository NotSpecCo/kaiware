import type { DeviceApp } from '$shared/types/DeviceApp';
import type { DeviceInfo } from '$shared/types/DeviceInfo';

export const KaiDevice = {
	getInfo(): Promise<DeviceInfo> {
		return window.api.kaiDevice.getInfo();
	},

	getRunningApps(): Promise<DeviceApp[]> {
		return window.api.kaiDevice.getRunningApps();
	},

	getInstalledApps(): Promise<DeviceApp[]> {
		return window.api.kaiDevice.getInstalledApps();
	},

	installApp(url: string): Promise<DeviceApp> {
		return window.api.kaiDevice.installApp(url);
	},

	installLocalApp(filePath: string): Promise<DeviceApp> {
		return window.api.kaiDevice.installLocalApp(filePath);
	},

	uninstallApp(appId: string): Promise<void> {
		return window.api.kaiDevice.uninstallApp(appId);
	},

	launchApp(appId: string): Promise<void> {
		return window.api.kaiDevice.launchApp(appId);
	},

	closeApp(appId: string): Promise<void> {
		return window.api.kaiDevice.closeApp(appId);
	}
};
