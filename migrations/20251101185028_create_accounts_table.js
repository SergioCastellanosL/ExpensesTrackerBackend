/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('accounts', (table) => {
    table.increments('id').primary();
    table.string('name', 100).notNullable();
    table.string('type', 50).notNullable();
    table.decimal('balance', 14, 2).defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down =async function(knex) {
  await knex.schema.dropTableIfExists('accounts');
};
