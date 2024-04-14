import { Browser } from '$main/lib/bridge.js';
import { isJson } from '$main/lib/isJson.js';
import { DeviceStorage } from '$shared/types/DeviceStorage.js';
import { Message } from '$shared/types/Message.js';
import { LogLevel, MessageType } from '@nothing-special/kaiware-lib/enums';
import type { DeviceInfo, ElementStylesUpdate, Log } from '@nothing-special/kaiware-lib/types';
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
	requestElementStyles: (index: number) =>
		sendMessageToDevice(MessageType.GetElementStyles, { index }),
	requestStorage: (storageType: 'local' | 'session') =>
		sendMessageToDevice(MessageType.RefreshStorage, { storageType }),

	// Receiving messages from the device
	onReceiveLog: (callback: (log: Log) => void) => {
		const dataSchema = z.object({
			level: z.nativeEnum(LogLevel),
			source: z.string(),
			data: z.string().array(),
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
		const dataSchema = z
			.object({
				id: z.string(),
				name: z.string()
			})
			.transform((val) => ({ ...val, connectionType: 'wifi' }));

		listeners.set(MessageType.DeviceInfoUpdate, { dataSchema, callback });
	},
	onReceiveElements: (callback: (htmlStr: string) => void) => {
		const dataSchema = z.string();
		listeners.set(MessageType.ElementsUpdate, { dataSchema, callback });
	},
	onReceiveClearLogs: (callback: () => void) => {
		const dataSchema = z.undefined();
		listeners.set(MessageType.ClearLogs, { dataSchema, callback });
	},
	onReceiveStorage: (callback: (storage: DeviceStorage) => void) => {
		const dataSchema = z.object({
			type: z.enum(['local', 'session']),
			data: z.record(z.unknown()).optional()
		});

		listeners.set(MessageType.StorageUpdate, { dataSchema, callback });
	},
	onReceiveElementStyles: (callback: (styles: ElementStylesUpdate) => void) => {
		const dataSchema = z.object({
			index: z.number(),
			styles: z.unknown()
		});

		listeners.set(MessageType.ElementStyleUpdate, { dataSchema, callback });
	}
};

function sendMessageToDevice(type: MessageType, data?: unknown) {
	const socket = wss.clients.values().next().value as ExtendedWebSocket;
	if (!socket) {
		throw new Error('No device connected');
	}

	socket.send(JSON.stringify({ type, data }));
}

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

	socket.on('message', async (rawMessage) => {
		const schema = z
			.string()
			.refine((val) => isJson(val), 'Must be a valid JSON string')
			.transform((val) => JSON.parse(val))
			.pipe(
				z.object({
					type: z.nativeEnum(MessageType),
					data: z.any().optional()
				})
			);

		const validateMessage = schema.safeParse(rawMessage.toString());
		if (!validateMessage.success) {
			socket.send(JSON.stringify(formatValidationErrorMessage(validateMessage.error.issues)));
			return;
		}

		const message = validateMessage.data as Message<unknown>;
		console.log('Received message:', message);

		const listener = listeners.get(message.type);
		if (!listener) {
			console.log('No listener found for message type:', message.type);
			return;
		}

		const validateData = listener.dataSchema.safeParse(message.data);
		if (!validateData.success) {
			socket.send(JSON.stringify(formatValidationErrorMessage(validateData.error.issues)));
			return;
		}

		try {
			await listener.callback(validateData.data);
			console.log('Message processed successfully');
		} catch (err) {
			console.log('Error processing message:', err);
		}
	});

	socket.on('error', (err) => {
		console.error('Device error:', err);
	});

	socket.on('close', () => {
		console.log('Device disconnected');
		server.stopServer();
	});

	// Get device info on initial connection
	server.requestDeviceInfo();
});

type ExtendedWebSocket = WebSocket & {
	device: {
		id: string;
		name: string;
	};
};

function formatValidationErrorMessage(issues: z.ZodIssue[]): Message<ErrorMessageData> {
	return {
		type: MessageType.Error,
		data: {
			name: 'ValidationError',
			errors: issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
		}
	};
}

type ErrorMessageData = {
	name?: string;
	errors: string[];
};
