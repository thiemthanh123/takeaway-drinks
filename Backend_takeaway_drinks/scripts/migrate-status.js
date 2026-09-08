const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config();

async function main() {
  const migrationsDir = path.join(__dirname, "..", "migrations");

  // Lấy tất cả file migration
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".js"))
    .sort();

  // Kết nối PostgreSQL
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();

  // Lấy danh sách migration đã chạy
  const result = await client.query(`
    SELECT name
    FROM pgmigrations
  `);

  const executedMigrations = new Set(
    result.rows.map((row) => row.name)
  );

  console.log("\nMigration status:\n");

  for (const file of migrationFiles) {
    // node-pg-migrate lưu name không có .js
    const migrationName = file.replace(".js", "");

    const status = executedMigrations.has(migrationName)
      ? "up"
      : "down";

    console.log(`${file.padEnd(40)} --- ${status}`);
  }

  console.log("");

  await client.end();
}

main().catch((error) => {
  console.error("❌ Error:", error.message);
  process.exit(1);
});