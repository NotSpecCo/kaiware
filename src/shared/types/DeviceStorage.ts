export type DeviceStorage = {
	type: 'local' | 'session';
	data?: { [key: string | number]: unknown };
};
