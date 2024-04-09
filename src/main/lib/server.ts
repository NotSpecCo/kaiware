import { Browser } from '$main/lib/bridge.js';
import { isJson } from '$main/lib/isJson.js';
import { MessageType } from '$shared/enums/messageType.js';
import { DeviceInfo } from '$shared/types/DeviceInfo.js';
import { LogItem } from '$shared/types/LogItem.js';
import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { z } from 'zod';

export const server = {
	startServer: () => httpServer.listen(3000),
	stopServer: () => {
		httpServer.closeAllConnections();
		Browser.updateDeviceInfo(null);
	},

	// Sending messages to the device
	requestDeviceInfo: () => sendMessageToDevice(MessageType.RefreshDeviceInfo),
	requestElements: () => sendMessageToDevice(MessageType.RefreshElements),

	// Receiving messages from the device
	onReceiveLog: (callback: (log: LogItem) => void) => {
		const dataSchema = z.object({
			level: z.enum(['info', 'warn', 'error']),
			source: z.string(),
			data: z.string(),
			timestamp: z
				.string()
				.refine(
					(val) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(val),
					'Must be in ISO 8601 format. example: 2024-04-05T00:51:08.639Z'
				)
				.default(() => new Date().toISOString())
		});

		listeners.set(MessageType.NewLog, { dataSchema, callback });
	},
	onReceiveDeviceInfo: (callback: (device: DeviceInfo) => void) => {
		const dataSchema = z.object({
			id: z.string(),
			name: z.string()
		});

		const cb = (device: DeviceInfo): void => {
			device.connectionType = 'wifi';
			callback(device);
		};

		listeners.set(MessageType.DeviceInfoUpdate, { dataSchema, callback: cb });
	},
	onReceiveElements: (callback: (htmlStr: string) => void) => {
		const dataSchema = z.string();
		listeners.set(MessageType.ElementsUpdate, { dataSchema, callback });
	},
	onReceiveClearLogs: (callback: () => void) => {
		const dataSchema = z.undefined();
		listeners.set(MessageType.ClearLogs, { dataSchema, callback });
	}
};

function sendMessageToDevice(type: MessageType, data?: unknown) {
	const socket = wss.clients.values().next().value as ExtendedWebSocket;
	if (!socket) {
		throw new Error('No device connected');
	}

	socket.send(JSON.stringify({ type, data }));
}

type Message = {
	type: MessageType;
	data?: unknown;
};

const httpServer = createServer();
const wss = new WebSocketServer({ noServer: true });

const listeners = new Map<
	MessageType,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	{ dataSchema: z.ZodSchema; callback: (data: any) => void }
>();

httpServer.on('upgrade', async (request, socket, head) => {
	// Only allow one connection at a time
	if (wss.clients.size > 0) {
		socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
		socket.destroy();
		return;
	}

	wss.handleUpgrade(request, socket, head, (ws) => {
		wss.emit('connection', ws, request);
	});
});

wss.on('connection', (ws: WebSocket) => {
	console.log('Device connected');

	const socket = ws as ExtendedWebSocket;
	socket.device = {
		id: 'unknown-device',
		name: 'Unknown Device'
	};

	Browser.updateDeviceInfo({
		connectionType: 'wifi',
		...socket.device
	});

	socket.on('message', async (message) => {
		const schema = z
			.string()
			.refine((val) => isJson(val), 'Must be a valid JSON string')
			.transform((val) => JSON.parse(val))
			.pipe(
				z.object({
					type: z.nativeEnum(MessageType),
					data: z.unknown().optional()
				})
			);

		const validateMessage = schema.safeParse(message.toString());
		if (!validateMessage.success) {
			socket.send(JSON.stringify(formatValidationError(validateMessage.error.issues)));
			return;
		}

		const messageData = validateMessage.data as Message;
		console.log('Device message:', messageData);

		const listener = listeners.get(messageData.type);
		if (!listener) return;

		const validateResult = listener.dataSchema.safeParse(messageData?.data);
		if (!validateResult.success) {
			socket.send(JSON.stringify(formatValidationError(validateResult.error.issues)));
			return;
		}

		try {
			await listener.callback(validateResult.data);
			socket.send(JSON.stringify({ success: true }));
		} catch (err) {
			socket.send(JSON.stringify({ success: false, error: (err as Error).message }));
		}
	});

	socket.on('error', (err) => {
		console.log('Device error:', err);
	});

	socket.on('close', () => {
		console.log('Device disconnected');
		server.stopServer();
	});

	// Get initial device info on connect
	server.requestDeviceInfo();
});

type ExtendedWebSocket = WebSocket & {
	device: {
		id: string;
		name: string;
	};
};

function formatValidationError(issues: z.ZodIssue[]) {
	return issues.reduce(
		(acc: { error: string; data: { [key: string]: string } }, issue) => {
			acc.data[issue.path.join('.')] = issue.message;
			return acc;
		},
		{ error: 'ValidationError', data: {} }
	);
}
