const path = require("path");

require("dotenv").config();

const {
  DATABASE_URL = "postgresql://postgres@127.0.0.1/postgres",
} = process.env;

const migrationDirectory = path.join(__dirname, "src", "db", "migrations");
const seedDirectory = path.join(__dirname, "src", "db", "seeds");

function isLocalDatabase(connectionString) {
  return (
    connectionString.includes("@localhost") ||
    connectionString.includes("@127.0.0.1")
  );
}

function buildPostgresConfig(connectionString) {
  const connection = isLocalDatabase(connectionString)
    ? connectionString
    : {
        connectionString,
        ssl: { rejectUnauthorized: false },
      };

  return {
    client: "postgresql",
    connection,
    pool: { min: 0, max: 5 },
    migrations: {
      directory: migrationDirectory,
    },
    seeds: {
      directory: seedDirectory,
    },
  };
}

module.exports = {
  development: buildPostgresConfig(DATABASE_URL),
  production: buildPostgresConfig(DATABASE_URL),
  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    migrations: {
      directory: migrationDirectory,
    },
    seeds: {
      directory: seedDirectory,
    },
    useNullAsDefault: true,
  },
};
