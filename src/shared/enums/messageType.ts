export enum MessageType {
	// Outgoing
	RefreshElements = 'refresh-elements',
	RefreshDeviceInfo = 'refresh-device-info',
	RefreshStorage = 'refresh-storage',

	// Incoming
	DeviceInfoUpdate = 'device-info-update',
	NewLog = 'new-log',
	ClearLogs = 'clear-logs',
	ElementsUpdate = 'elements-update',
	StorageUpdate = 'storage-update',

	// Misc
	Error = 'error'
}
