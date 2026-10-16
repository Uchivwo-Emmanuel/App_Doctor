import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "../config/env.js";

// `prepare: false` keeps this client compatible with transaction-pooler deployments.
const queryClient = env.DATABASE_URL
  ? postgres(env.DATABASE_URL, {
      max: 5,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    })
  : undefined;

export const db = queryClient ? drizzle(queryClient) : undefined;

export async function databaseIsReady() {
  if (!db) return false;
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch {
    return false;
  }
}

export async function closeDatabaseConnection() {
  await queryClient?.end({ timeout: 5 });
}
