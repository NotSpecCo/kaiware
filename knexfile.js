/** @type {import('knex').Knex.Config<any>} */
export default {
	client: 'sqlite3',
	connection: {
		filename: './db-test.sqlite'
	},
	migrations: {
		directory: './src/main/migrations'
	},
	useNullAsDefault: true
};
