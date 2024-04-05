declare module '@cliqz-oss/firefox-client' {
	import { AppsActor } from '$types/AppsActor.ts';
	import { DeviceActor } from '$types/DeviceActor.ts';

	export default class FirefoxClient {
		constructor();
		connect(port: number, host: string, callback: (err: unknown) => void): void;
		on(event: string, callback: (err: unknown) => void): void;
		disconnect(): void;
		getDevice(callback: (err: unknown, result: DeviceActor) => void): void;
		getWebapps(callback: (err: unknown, result: AppsActor) => void): void;
	}
}
