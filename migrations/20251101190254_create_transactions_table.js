/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.string('description', 200);
    table.enum('type', ['income', 'expense']).notNullable();
    table.decimal('amount', 14, 2).notNullable();
    table.timestamp('date').defaultTo(knex.fn.now());
    table.integer('account_id').unsigned().references('id').inTable('accounts').onDelete('CASCADE');
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('transactions');
};
