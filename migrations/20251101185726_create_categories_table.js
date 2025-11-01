/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('categories', (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable();
    table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    table.string('color').notNullable().defaultTo('#000000');
    table.string('icon').notNullable().defaultTo('tag');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('categories');
};
