import { eq } from "drizzle-orm";

import { LOCAL_DEMO_USER_ID } from "../auth/constants.js";
import { env } from "../config/env.js";
import { closeDatabaseConnection, db } from "./client.js";
import { localDemoUsers } from "./schema.js";

async function seedLocalDemoUser() {
  if (!env.LOCAL_DEMO_ACCESS_ENABLED || !env.LOCAL_DEMO_EMAIL) {
    throw new Error("LOCAL_DEMO_ACCESS_ENABLED and LOCAL_DEMO_EMAIL must be set before seeding");
  }

  if (!db) {
    throw new Error("DATABASE_URL must be set before seeding");
  }

  await db
    .insert(localDemoUsers)
    .values({ id: LOCAL_DEMO_USER_ID, email: env.LOCAL_DEMO_EMAIL, displayName: "Local Demo User" })
    .onConflictDoUpdate({
      target: localDemoUsers.id,
      set: { email: env.LOCAL_DEMO_EMAIL, displayName: "Local Demo User", updatedAt: new Date() },
    });

  const [user] = await db.select({ id: localDemoUsers.id }).from(localDemoUsers).where(eq(localDemoUsers.id, LOCAL_DEMO_USER_ID));
  if (!user) {
    throw new Error("Local demo user was not created");
  }
}

seedLocalDemoUser()
  .then(() => console.info("Local demo user seed succeeded"))
  .finally(async () => closeDatabaseConnection());
