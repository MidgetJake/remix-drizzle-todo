import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"
import * as schema from "./schema.server";
import pg from "postgres"

if (!process.env.DATABASE_URL) {
  throw new Error(
    "Missing environment variable: DATABASE_URL",
  )
}

export const client = pg(process.env.DATABASE_URL, { max: 1 });
export const db = drizzle(client, {schema});

// Automatically run migrations on startup
void migrate(db, {
  migrationsFolder: "app/drizzle/migrations",
});
