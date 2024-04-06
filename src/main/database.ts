import { LogItem } from '$shared/types/LogItem.js';
import { BrowserWindow, ipcMain } from 'electron';
import knex from 'knex';

export async function initDatabase() {
	await db.migrate.latest();

	const existingLogs = await db<LogItem>('logs').count({ count: '*' }).first();
	if (existingLogs?.count !== 0) return;

	const logs: Omit<LogItem, 'id' | 'timestamp'>[] = Array.from({ length: 50 }, (_, i) => ({
		source: 'my-app',
		level: i % 3 === 0 ? 'error' : i % 3 === 1 ? 'warn' : 'info',
		data: JSON.stringify({
			name: 'Error',
			message: 'some not so bad error happend',
			stack: `Error: some not so bad error happend\n    at <anonymous>:1:16`
		}),
		timestamp: new Date().toISOString()
	}));

	await db<LogItem>('logs').insert(logs);
}

const db = knex({
	client: 'sqlite3',
	connection: {
		filename: 'db-test.sqlite'
	},
	useNullAsDefault: true,
	migrations: {
		directory: './src/main/migrations'
	},
	debug: false
});

export const database = {
	logs: {
		getLogs: async () => {
			return db<LogItem>('logs').select('*').orderBy('timestamp', 'desc');
		},
		addLog: async (log: Omit<LogItem, 'id'>) => {
			const newLog = (await db<LogItem>('logs').insert(log, '*')).at(0);
			BrowserWindow.getAllWindows()[0]?.webContents.send('logs-on-add', newLog);
		},
		clear: async () => {
			await db<LogItem>('logs').delete();
			BrowserWindow.getAllWindows()[0]?.webContents.send('logs-on-clear');
		}
	}
};

export function registerDatabaseHandlers() {
	ipcMain.handle('logs-get', database.logs.getLogs);
	ipcMain.handle('logs-add', (_, log) => database.logs.addLog(log));
}
