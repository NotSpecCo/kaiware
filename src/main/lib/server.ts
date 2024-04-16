import { Browser } from '$main/lib/bridge';
import { MessageType } from '@nothing-special/kaiware-lib/enums';
import {
	GetDeviceInfoPayload,
	GetDeviceInfoResPayload,
	Message,
	buildRawMessageSchema,
	getDeviceInfoPayloadSchema,
	getDeviceInfoResPayloadSchema,
	getElementDataPayloadSchema,
	getElementDataResPayloadSchema,
	getElementStylesPayloadSchema,
	getElementStylesResPayloadSchema,
	getElementsPayloadSchema,
	getElementsResPayloadSchema,
	getStoragePayloadSchema,
	getStorageResPayloadSchema,
	setStoragePayloadSchema,
	setStorageResPayloadSchema
} from '@nothing-special/kaiware-lib/types';
import { isJson } from '@nothing-special/kaiware-lib/utils';
import { createServer } from 'http';
import { RawData, WebSocket, WebSocketServer } from 'ws';
import { z } from 'zod';

export const server = {
	startServer: () => httpServer.listen(3000),
	stopServer: () => {
		httpServer.closeAllConnections();
		Browser.updateDeviceInfo(null);
	},
	sendRequest,
	onReceiveMessage<T>(messageType: MessageType, callback: (message: Message<T>) => void) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		listeners.set(messageType, callback as any);
	}
};

const listeners = new Map<MessageType, (message: Message<unknown>) => Promise<void>>();

const socketServer = {
	server: new WebSocketServer({ noServer: true }),
	hasActiveConnection(): boolean {
		return this.server.clients.size > 0;
	},
	getActiveSocket(): ExtendedWebSocket | undefined {
		return this.server.clients.values().next()?.value;
	}
};

const httpServer = createServer();
httpServer.on('upgrade', async (request, socket, head) => {
	// Only allow one connection at a time
	if (socketServer.hasActiveConnection()) {
		socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
		socket.destroy();
		return;
	}

	socketServer.server.handleUpgrade(request, socket, head, (ws) => {
		socketServer.server.emit('connection', ws, request);
	});
});

socketServer.server.on('connection', async (ws: WebSocket) => {
	console.log('Device connected');

	const socket = ws as ExtendedWebSocket;
	socket.device = {
		id: 'unknown-device',
		name: 'Unknown Device'
	};

	Browser.updateDeviceInfo({
		...socket.device,
		connectionType: 'wifi'
	});

	// Get real device info
	server
		.sendRequest<GetDeviceInfoPayload, GetDeviceInfoResPayload>(
			{
				type: MessageType.GetDeviceInfo,
				data: null
			},
			MessageType.GetDeviceInfoRes
		)
		.then((info) => {
			Browser.updateDeviceInfo({
				...info,
				connectionType: 'wifi'
			});
		})
		.catch((err) => {
			console.error('Failed to get device info:', err);
		});

	socket.on('error', (err) => {
		console.error('Device error:', err);
	});

	socket.on('close', () => {
		console.log('Device disconnected');
		server.stopServer();
	});

	// Handle incoming messages that we didn't request
	socket.on('message', async (rawMessage: RawData) => {
		const messageType = isJson(rawMessage.toString())
			? (JSON.parse(rawMessage.toString()).type as MessageType)
			: null;

		if (!messageType) return;

		const listener = listeners.get(messageType);
		if (listener) {
			try {
				const message = validateMessage<unknown>(messageType, rawMessage);
				await listener(message);
			} catch (err) {
				console.log('Listener encountered an error:', err);
			}
		}
	});
});

function validateMessage<TData>(messageType: MessageType, rawMessage: RawData): Message<TData> {
	let dataSchema: z.ZodType<unknown> = z.unknown();

	switch (messageType) {
		case MessageType.GetDeviceInfo:
			dataSchema = getDeviceInfoPayloadSchema;
			break;
		case MessageType.GetDeviceInfoRes:
			dataSchema = getDeviceInfoResPayloadSchema;
			break;
		case MessageType.GetElements:
			dataSchema = getElementsPayloadSchema;
			break;
		case MessageType.GetElementsRes:
			dataSchema = getElementsResPayloadSchema;
			break;
		case MessageType.GetElementStyles:
			dataSchema = getElementStylesPayloadSchema;
			break;
		case MessageType.GetElementStylesRes:
			dataSchema = getElementStylesResPayloadSchema;
			break;
		case MessageType.GetElementData:
			dataSchema = getElementDataPayloadSchema;
			break;
		case MessageType.GetElementDataRes:
			dataSchema = getElementDataResPayloadSchema;
			break;
		case MessageType.GetStorage:
			dataSchema = getStoragePayloadSchema;
			break;
		case MessageType.GetStorageRes:
			dataSchema = getStorageResPayloadSchema;
			break;
		case MessageType.SetStorage:
			dataSchema = setStoragePayloadSchema;
			break;
		case MessageType.SetStorageRes:
			dataSchema = setStorageResPayloadSchema;
			break;
		default:
			console.log('Unknown message type:', messageType);
			break;
	}

	const messageSchema = buildRawMessageSchema(dataSchema);

	const message = messageSchema.safeParse(rawMessage.toString());
	if (!message.success) {
		console.error('Invalid message:', {
			name: 'ValidationError',
			input: rawMessage.toString(),
			errors: message.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`)
		});
		throw new Error('Invalid message');
	}

	return message.data as Message<TData>;
}

async function sendRequest<TRequest, TResponse>(
	message: Omit<Message<TRequest>, 'requestId'>,
	responseMessageType: MessageType
): Promise<TResponse> {
	const socket = socketServer.getActiveSocket();
	if (!socket) {
		throw new Error('No device connected');
	}

	return new Promise((resolve) => {
		const requestId = crypto.randomUUID();

		socket.send(JSON.stringify({ requestId, type: message.type, data: message.data }));

		const listener = (rawMessage: RawData) => {
			const response = validateMessage<TResponse>(responseMessageType, rawMessage);

			if (response.requestId === requestId) {
				resolve(response.data);
				socket.off('message', listener);
			}
		};

		socket.on('message', listener);
	});
}

type ExtendedWebSocket = WebSocket & {
	device: {
		id: string;
		name: string;
	};
};
