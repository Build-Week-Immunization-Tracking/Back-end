// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./data/dev.db3"
    },
    migrations: {
      directory: "./data/migrations"
    },
    seeds: {
      directory: "./data/seeds/dev"
    },
    useNullAsDefault: true
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: { directory: "./data/migrations" },
    seeds: { directory: "./backend/seeds/dev" }
  }
};
