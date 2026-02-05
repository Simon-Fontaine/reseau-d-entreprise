import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

async function runMigrations() {
  const connectionConfig = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || "db",
        port: parseInt(process.env.DB_PORT || "5432", 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      };

  if (!process.env.DATABASE_URL && !process.env.DB_USER) {
    console.error("❌ DATABASE_URL or DB_USER/DB_PASSWORD/DB_NAME must be set");
    process.exit(1);
  }

  console.log("🔄 Connecting to database...");

  const pool = new Pool({
    ...connectionConfig,
    max: 1,
  });

  const db = drizzle(pool);

  try {
    console.log("🔄 Running migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }

  process.exit(0);
}

runMigrations();
