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

export class RemoteDevice {
	private static server = createServer();
	private static wss = new WebSocketServer({ noServer: true });
	private static socket: ExtendedWebSocket | null = null;

	static start() {
		this.server.on('upgrade', async (request, socket, head) => {
			// Only allow one connection at a time
			if (this.wss.clients.size > 0) {
				socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
				socket.destroy();
				return;
			}

			this.wss.handleUpgrade(request, socket, head, (ws) => {
				const socket = ws as ExtendedWebSocket;
				socket.device = {
					id: '123',
					name: 'Unnamed Device'
				};

				this.wss.emit('connection', socket, request);
			});
		});

		this.wss.on('connection', (ws: ExtendedWebSocket) => {
			this.socket = ws;

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
				this.server.closeAllConnections();
				this.socket = null;
			});
		});

		this.server.listen(3000);
	}

	static handleDeviceInfoUpdate(data: { id: string; name: string }) {
		this.socket!.device = data;

		BrowserWindow.getAllWindows()[0]?.webContents.send('device-on-update', data);
	}

	static async handleAddLog(data: LogItem) {
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
			this.socket!.send(JSON.stringify(formatValidationError(result.error.issues)));
			return;
		}

		try {
			await database.logs.addLog(result.data);
			this.socket!.send(JSON.stringify({ success: true }));
		} catch (err) {
			this.socket!.send(JSON.stringify({ success: false, error: (err as Error).message }));
		}
	}

	static async handleClearLogs() {
		try {
			await database.logs.clear();
			this.socket!.send(JSON.stringify({ success: true }));
		} catch (err) {
			this.socket!.send(JSON.stringify({ success: false, error: (err as Error).message }));
		}
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
