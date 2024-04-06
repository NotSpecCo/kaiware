import { database } from '$main/database.js';
import { LogItem } from '$shared/types/LogItem.js';
import { BrowserWindow } from 'electron';
import { createServer } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { z } from 'zod';

type Message =
	| { type: 'update-device-info'; data: { id: string; name: string } }
	| { type: 'add-log'; data: LogItem }
	| { type: 'clear-logs' };

const server = createServer();
const wss = new WebSocketServer({ noServer: true });
let socket: ExtendedWebSocket | null = null;

export const RemoteDevice = {
	start(): void {
		server.on('upgrade', async (request, socket, head) => {
			// Only allow one connection at a time
			if (wss.clients.size > 0) {
				socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
				socket.destroy();
				return;
			}

			wss.handleUpgrade(request, socket, head, (ws) => {
				const socket = ws as ExtendedWebSocket;
				socket.device = {
					id: '123',
					name: 'Unnamed Device'
				};

				wss.emit('connection', socket, request);
			});
		});

		wss.on('connection', (ws: ExtendedWebSocket) => {
			socket = ws;

			ws.on('message', (data) => {
				const message = JSON.parse(data.toString()) as Message;
				console.log('onmessage', message);

				switch (message.type) {
					case 'update-device-info':
						this.handleDeviceInfoUpdate(message.data);
						break;
					case 'add-log':
						this.handleAddLog(message.data);
						break;
					case 'clear-logs':
						this.handleClearLogs();
						break;
					default:
						console.log('Unknown message type', message);
				}
			});
			ws.on('error', console.error);
			ws.on('close', () => {
				console.log('Client disconnected');
				server.closeAllConnections();
				socket = null;
			});
		});

		server.listen(3000);
	},

	handleDeviceInfoUpdate(data: { id: string; name: string }): void {
		socket!.device = data;

		BrowserWindow.getAllWindows()[0]?.webContents.send('device-on-update', data);
	},

	async handleAddLog(data: LogItem): Promise<void> {
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
			socket!.send(JSON.stringify(formatValidationError(result.error.issues)));
			return;
		}

		try {
			await database.logs.addLog(result.data);
			socket!.send(JSON.stringify({ success: true }));
		} catch (err) {
			socket!.send(JSON.stringify({ success: false, error: (err as Error).message }));
		}
	},

	async handleClearLogs(): Promise<void> {
		try {
			await database.logs.clear();
			socket!.send(JSON.stringify({ success: true }));
		} catch (err) {
			socket!.send(JSON.stringify({ success: false, error: (err as Error).message }));
		}
	}
};

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
