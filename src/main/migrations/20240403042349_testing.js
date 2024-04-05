/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
	console.log('20240403042349_testing.js up');
	return knex.schema.createTable('logs', (table) => {
		table.increments('id').primary();
		table.string('data').notNullable();
		table.string('level').notNullable();
		table.string('source').nullable();
		table.string('timestamp').notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = function (knex) {
	console.log('20240403042349_testing.js down');
	return knex.schema.dropTable('logs');
};
