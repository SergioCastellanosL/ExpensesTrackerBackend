/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('transaction_users', (table) => {
    table.increments('id').primary(); // unique ID for this entry
    table.integer('transaction_id').unsigned().notNullable()
         .references('id').inTable('transactions')
         .onDelete('CASCADE'); // if transaction deleted, remove entries
    table.integer('user_id').unsigned().notNullable()
         .references('id').inTable('users')
         .onDelete('CASCADE'); // if user deleted, remove entries
    table.decimal('share_percent', 5, 2).defaultTo(100); // percentage of transaction this user is responsible for
    table.timestamps(true, true); // created_at and updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
 await knex.schema.dropTableIfExists('transaction_users');
};
