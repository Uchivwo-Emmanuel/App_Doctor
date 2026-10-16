import { Queue } from "bullmq";

import { env } from "../config/env.js";

export type ScanJob = { runId: string; targetUrl: string };

const connection = env.REDIS_URL ? { url: env.REDIS_URL, maxRetriesPerRequest: null } : undefined;

export const scanQueue = connection ? new Queue<ScanJob>("health-scan", { connection, prefix: "app-doctor" }) : undefined;

export async function enqueueScan(job: ScanJob) {
  if (!scanQueue) throw new Error("Redis is not configured");
  await scanQueue.add("health-scan", job, { jobId: job.runId, removeOnComplete: 100, removeOnFail: 100 });
}
