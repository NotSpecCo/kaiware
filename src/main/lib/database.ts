import { LogLevel } from '@nothing-special/kaiware-lib/enums';
import type { Log } from '@nothing-special/kaiware-lib/types';
import knex from 'knex';

export async function initDatabase() {
	await db.migrate.latest();

	const existingLogs = await db<Log>('logs').count({ count: '*' }).first();
	if (existingLogs?.count !== 0) return;

	const logs: Omit<Log, 'id' | 'timestamp'>[] = Array.from({ length: 50 }, (_, i) => ({
		source: 'my-app',
		level: i % 3 === 0 ? LogLevel.Error : i % 3 === 1 ? LogLevel.Warn : LogLevel.Info,
		data: [
			JSON.stringify({
				name: 'Error',
				message: 'some not so bad error happend',
				stack: `Error: some not so bad error happend\n    at <anonymous>:1:16`
			})
		],
		timestamp: new Date().toISOString()
	}));

	await db<Log>('logs').insert(logs);
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
			return db<Log>('logs').select('*').orderBy('timestamp', 'desc');
		},
		addLog: async (log: Omit<Log, 'id'>): Promise<Log> => {
			const newLog = (await db<Log>('logs').insert(log, '*')).at(0);
			return newLog as Log;
		},
		clear: async () => {
			await db<Log>('logs').delete();
		}
	}
};
