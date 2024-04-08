import { Browser } from '$main/lib/bridge.js';
import { database } from '$main/lib/database.js';
import { isJson } from '$main/lib/isJson.js';
import { MessageType } from '$shared/enums/messageType.js';
import { ConnectedDevice } from '$shared/types/ConnectedDevice.js';
import { LogItem } from '$shared/types/LogItem.js';
import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { z } from 'zod';

type Message =
	| { type: MessageType.OnUpdateDeviceInfo; data: Omit<ConnectedDevice, 'connectionType'> }
	| { type: MessageType.OnAddLog; data: LogItem }
	| { type: MessageType.OnClearLogs };

const httpServer = createServer();
const wss = new WebSocketServer({ noServer: true });

export const server = {
	startServer: () => httpServer.listen(3000),
	stopServer: () => {
		httpServer.closeAllConnections();
		Browser.updateConnectedDevice(null);
	},
	sendMessageToDevice: (type: MessageType, data?: unknown) => {
		const socket = wss.clients.values().next().value as ExtendedWebSocket;
		if (!socket) {
			throw new Error('No device connected');
		}

		socket.send(JSON.stringify({ type, data }));
	}
};

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

	Browser.updateConnectedDevice({
		connectionType: 'wifi',
		...socket.device
	});

	socket.on('message', (message) => {
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

		const result = schema.safeParse(message.toString());

		if (!result.success) {
			socket.send(JSON.stringify(formatValidationError(result.error.issues)));
			return;
		}

		const messageData = result.data as Message;
		console.log('Device message:', messageData);

		if (messageData.type === MessageType.OnUpdateDeviceInfo)
			handleDeviceInfoUpdate(socket, messageData.data);
		else if (messageData.type === MessageType.OnAddLog) handleAddLog(socket, messageData.data);
		else if (messageData.type === MessageType.OnClearLogs) handleClearLogs(socket);
	});

	socket.on('error', (err) => {
		console.log('Device error:', err);
	});

	socket.on('close', () => {
		console.log('Device disconnected');
		server.stopServer();
	});
});

function handleDeviceInfoUpdate(
	socket: ExtendedWebSocket,
	data: Omit<ConnectedDevice, 'connectionType'>
): void {
	const schema = z.object({
		id: z.string(),
		name: z.string()
	});

	const result = schema.safeParse(data);
	if (!result.success) {
		socket.send(JSON.stringify(formatValidationError(result.error.issues)));
		return;
	}

	socket.device = data;
	Browser.updateConnectedDevice({
		connectionType: 'wifi',
		...data
	});
}

async function handleAddLog(socket: ExtendedWebSocket, data: LogItem): Promise<void> {
	const schema = z.object({
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

	const result = schema.safeParse(data);
	if (!result.success) {
		socket.send(JSON.stringify(formatValidationError(result.error.issues)));
		return;
	}

	try {
		await database.logs.addLog(result.data);
		socket.send(JSON.stringify({ success: true }));
	} catch (err) {
		socket.send(JSON.stringify({ success: false, error: (err as Error).message }));
	}
}

async function handleClearLogs(socket: ExtendedWebSocket): Promise<void> {
	try {
		await database.logs.clear();
		socket.send(JSON.stringify({ success: true }));
	} catch (err) {
		socket.send(JSON.stringify({ success: false, error: (err as Error).message }));
	}
}

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
