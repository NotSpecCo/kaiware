import { database } from '$main/database.js';
import express from 'express';
import { z } from 'zod';

export function startServer() {
	const app = express();
	app.use(express.json());

	app.get('/api/heartbeat', (req, res) => {
		res.status(200).send(new Date().toISOString());
	});

	app.post('/api/logs/clear', async (req, res) => {
		try {
			await database.logs.clear();
			res.status(200).send();
		} catch (err) {
			res.status(500).send({ error: (err as Error).message });
		}
	});

	app.post('/api/logs/add', async (req, res) => {
		try {
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

			const result = schema.safeParse(req.body);
			if (!result.success) {
				return res.status(400).send(formatValidationError(result.error.issues));
			}

			await database.logs.addLog(result.data);

			res.status(201).send();
		} catch (err) {
			res.status(500).send({ error: (err as Error).message });
		}
	});

	app.listen(3000, () => {
		console.log('Server started on port 3000');
	});
}

function formatValidationError(issues: z.ZodIssue[]) {
	return issues.reduce(
		(acc: { error: { [key: string]: string } }, issue) => {
			acc.error[issue.path.join('.')] = issue.message;
			return acc;
		},
		{ error: {} }
	);
}
