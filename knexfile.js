// Update with your config settings.
require('dotenv').config();

module.exports = {

  development: {
    client: 'pg',
    connection: process.env.DATABASE_URI,
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/migrations'
    }
  },

  testing: {
    client: 'pg',
    connection: process.env.TEST_DATABASE_URI,
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/migrations'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URI,
    migrations: {
      directory: './data/migrations'
    },
    seeds: {
      directory: './data/migrations'
    }
  }

};
