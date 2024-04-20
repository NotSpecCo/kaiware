/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = function (knex) {
	console.log('20240403042349_testing.js up');
	return knex.schema
		.createTable('logs', (table) => {
			table.increments('id').primary();
			table.string('data').notNullable();
			table.string('level').notNullable();
			table.string('source').nullable();
			table.string('timestamp').notNullable();
		})
		.createTable('network_requests', (table) => {
			table.increments('id').primary();
			table.string('requestId').notNullable();
			table.string('url').nullable();
			table.string('method').nullable();
			table.string('lifecycleStatus').nullable();
			table.string('headers').nullable();
			table.string('body').nullable();
			table.integer('startTime').nullable();
			table.integer('endTime').nullable();
			table.integer('responseStatus').nullable();
			table.string('responseHeaders').nullable();
			table.string('responseBody').nullable();
			table.integer('responseSize').nullable();
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
