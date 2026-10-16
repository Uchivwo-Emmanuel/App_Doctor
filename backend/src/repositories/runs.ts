import { and, desc, eq } from "drizzle-orm";

import { db } from "../db/client.js";
import { artifacts, issues, testResults, testRuns } from "../db/schema.js";

function database() { if (!db) throw new Error("Database is unavailable"); return db; }

export async function createQueuedRun(input: { applicationId: string; ownerId: string; idempotencyKey: string; targetUrl: string }) {
  const [existing] = await database().select().from(testRuns).where(eq(testRuns.idempotencyKey, input.idempotencyKey));
  if (existing) return existing;
  const [run] = await database().insert(testRuns).values({ ...input, status: "queued" }).returning();
  return run;
}

export async function listRuns(ownerId: string) {
  return database().select().from(testRuns).where(eq(testRuns.ownerId, ownerId)).orderBy(desc(testRuns.createdAt));
}

export async function getRun(ownerId: string, id: string) {
  const [run] = await database().select().from(testRuns).where(and(eq(testRuns.id, id), eq(testRuns.ownerId, ownerId)));
  return run ?? null;
}

export async function createIssue(input: { ownerId: string; runId?: string; resultId?: string; title: string; expectedBehavior: string; actualBehavior: string; prerequisites?: string }) {
  const [issue] = await database().insert(issues).values(input).returning();
  return issue;
}

export async function listIssues(ownerId: string) {
  return database().select().from(issues).where(eq(issues.ownerId, ownerId)).orderBy(desc(issues.createdAt));
}

export async function listResultsForRun(ownerId: string, runId: string) {
  const run = await getRun(ownerId, runId);
  if (!run) return null;
  const [results, runArtifacts] = await Promise.all([
    database().select().from(testResults).where(eq(testResults.runId, runId)).orderBy(desc(testResults.createdAt)),
    database().select({ id: artifacts.id, kind: artifacts.kind, createdAt: artifacts.createdAt }).from(artifacts).where(eq(artifacts.runId, runId)),
  ]);
  return { run, results, artifacts: runArtifacts };
}

export async function getArtifactPathForOwner(ownerId: string, artifactId: string) {
  const [artifact] = await database()
    .select({ storageKey: artifacts.storageKey })
    .from(artifacts)
    .innerJoin(testRuns, eq(artifacts.runId, testRuns.id))
    .where(and(eq(artifacts.id, artifactId), eq(testRuns.ownerId, ownerId)));
  return artifact?.storageKey ?? null;
}
