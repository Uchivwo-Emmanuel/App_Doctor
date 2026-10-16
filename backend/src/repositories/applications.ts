import { and, desc, eq, isNull } from "drizzle-orm";

import { db } from "../db/client.js";
import { applications } from "../db/schema.js";

function requireDatabase() {
  if (!db) throw new Error("Database is unavailable");
  return db;
}

export async function listApplicationsForOwner(ownerId: string) {
  return requireDatabase()
    .select()
    .from(applications)
    .where(and(eq(applications.ownerId, ownerId), isNull(applications.archivedAt)))
    .orderBy(desc(applications.createdAt));
}

export async function getApplicationForOwner(ownerId: string, id: string) {
  const [application] = await requireDatabase()
    .select()
    .from(applications)
    .where(and(eq(applications.id, id), eq(applications.ownerId, ownerId), isNull(applications.archivedAt)));
  return application ?? null;
}

export async function createApplication(input: {
  ownerId: string;
  name: string;
  baseUrl: string;
  environment: string;
}) {
  const [application] = await requireDatabase()
    .insert(applications)
    .values({ ...input, authorizationAttestedAt: new Date() })
    .returning();
  return application;
}

export async function updateApplicationForOwner(
  ownerId: string,
  id: string,
  input: { name: string; baseUrl: string; environment: string },
) {
  const [application] = await requireDatabase()
    .update(applications)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(applications.id, id), eq(applications.ownerId, ownerId), isNull(applications.archivedAt)))
    .returning();
  return application ?? null;
}

export async function archiveApplicationForOwner(ownerId: string, id: string) {
  const [application] = await requireDatabase()
    .update(applications)
    .set({ archivedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(applications.id, id), eq(applications.ownerId, ownerId), isNull(applications.archivedAt)))
    .returning();
  return application ?? null;
}
