import { Browser } from '$main/lib/bridge';
import { MessageType } from '@nothing-special/kaiware-lib/enums';
import {
	GetDeviceInfoResPayload,
	Message,
	MessageWithId,
	rawMessageSchema
} from '@nothing-special/kaiware-lib/types';
import { isJson } from '@nothing-special/kaiware-lib/utils';
import { createServer } from 'http';
import { RawData, WebSocket, WebSocketServer } from 'ws';

export const server = {
	startServer: () => httpServer.listen(3000),
	stopServer: () => {
		httpServer.closeAllConnections();
		Browser.updateDeviceInfo(null);
	},
	sendRequest,
	onReceiveMessage(
		messageType: MessageType,
		callback: (message: MessageWithId) => Promise<void>
	) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		listeners.set(messageType, callback as any);
	}
};

const listeners = new Map<MessageType, (message: Message) => Promise<void>>();

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
		.sendRequest<GetDeviceInfoResPayload>({
			type: MessageType.GetDeviceInfo,
			data: null
		})
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
				const message = validateMessage(rawMessage);
				await listener(message);
			} catch (err) {
				console.log('Listener encountered an error:', err);
			}
		}
	});
});

function validateMessage(rawMessage: RawData): MessageWithId {
	const message = rawMessageSchema.safeParse(rawMessage.toString());
	if (!message.success) {
		console.error('Invalid message:', {
			name: 'ValidationError',
			input: rawMessage.toString(),
			errors: message.error.issues.map(
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(issue: any) => `${issue.path.join('.')}: ${issue.message}`
			)
		});
		throw new Error('Invalid message');
	}

	return message.data as MessageWithId;
}

// TODO: Infer TRequest and TResponse from the message type
// TODO: Better solution than caller passsing in the response message type
async function sendRequest<TResponse = null>(message: Message): Promise<TResponse> {
	const socket = socketServer.getActiveSocket();
	if (!socket) {
		throw new Error('No device connected');
	}

	return new Promise((resolve) => {
		const requestId = crypto.randomUUID();

		socket.send(JSON.stringify({ requestId, type: message.type, data: message.data }));

		const listener = (rawMessage: RawData) => {
			const response = validateMessage(rawMessage);

			if (response.requestId === requestId) {
				resolve(response.data as TResponse);
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
