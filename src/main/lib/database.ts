import { LogLevel } from '@nothing-special/kaiware-lib/enums';
import type { Log } from '@nothing-special/kaiware-lib/types';
import { isJson } from '@nothing-special/kaiware-lib/utils';
import knex from 'knex';

export async function initDatabase() {
	await db.migrate.latest();

	const existingLogs = await db<Log>('logs').count({ count: '*' }).first();
	if (existingLogs?.count !== 0) return;

	const logs: Omit<LogEntity, 'id' | 'timestamp'>[] = Array.from({ length: 1 }, (_, i) => ({
		source: 'my-app',
		level: i % 3 === 0 ? LogLevel.Error : i % 3 === 1 ? LogLevel.Warn : LogLevel.Info,
		data: JSON.stringify([
			{
				name: 'Error',
				message: 'some not so bad error happend',
				stack: `Error: some not so bad error happend\n    at <anonymous>:1:16`
			}
		]),
		timestamp: new Date().toISOString()
	}));

	await db<LogEntity>('logs').insert(logs);
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
		getLogs: async (): Promise<Log[]> => {
			const logs = await db<LogEntity>('logs').select('*').orderBy('timestamp', 'desc');

			return logs.map(mappers.logEntityToLog);
		},
		addLog: async (log: Omit<Log, 'id'>): Promise<Log> => {
			const newLog = (
				await db<LogEntity>('logs').insert(mappers.logToLogEntity(log), '*')
			).at(0) as LogEntity;

			return mappers.logEntityToLog(newLog);
		},
		clear: async () => {
			await db<LogEntity>('logs').delete();
		}
	}
};

const mappers = {
	logEntityToLog: (log: LogEntity): Log => {
		const data: string[] = JSON.parse(log.data).map((a: string) =>
			isJson(a) ? JSON.parse(a) : a
		);

		return { ...log, data };
	},
	logToLogEntity: (log: Omit<Log, 'id'>): Omit<LogEntity, 'id'> => {
		const data = JSON.stringify(log.data);

		return { ...log, data };
	}
};

type LogEntity = Omit<Log, 'data'> & { data: string };
