import { sql } from "drizzle-orm";

import { closeDatabaseConnection, db } from "./client.js";

if (!db) {
  throw new Error("DATABASE_URL must be configured before checking the database connection");
}

try {
  await db.execute(sql`select 1 as database_connection_ok`);
  console.info("Database connection check succeeded");
} finally {
  await closeDatabaseConnection();
}
