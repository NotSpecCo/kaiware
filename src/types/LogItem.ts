export type LogItem = {
	id: number;
	level: 'info' | 'warn' | 'error';
	source?: string;
	data: string;
	timestamp: string;
};
