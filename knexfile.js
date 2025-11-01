// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
import dotenv from "dotenv";
dotenv.config();
module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations'
    }
  }

};
