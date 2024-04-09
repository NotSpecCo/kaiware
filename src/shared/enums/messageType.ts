export enum MessageType {
	// Outgoing
	RefreshElements = 'refresh-elements',
	RefreshDeviceInfo = 'refresh-device-info',

	// Incoming
	DeviceInfoUpdate = 'device-info-update',
	NewLog = 'new-log',
	ClearLogs = 'clear-logs',
	ElementsUpdate = 'elements-update'
}
