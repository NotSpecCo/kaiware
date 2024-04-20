export enum Channel {
	GetLogs = 'get-logs',
	ClearLogs = 'clear-logs',
	NewLog = 'new-log',

	GetElements = 'get-elements',
	RefreshElements = 'refresh-elements',

	GetElementStyles = 'get-element-styles',
	SetElementStyles = 'set-element-styles',
	RefreshElementStyles = 'refresh-element-styles',

	GetElementData = 'get-element-data',
	SetElementData = 'set-element-data',
	RefreshElementData = 'refresh-element-data',

	GetDeviceInfo = 'get-device-info',
	RefreshDeviceInfo = 'refresh-device-info',

	GetStorage = 'get-storage',
	RefreshStorage = 'refresh-storage',

	GetNetworkRequests = 'get-network-requests',
	NetworkRequestUpdate = 'network-request-update',
	ClearNetworkRequests = 'clear-network-requests'
}
