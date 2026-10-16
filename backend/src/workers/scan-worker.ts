import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { Worker } from "bullmq";
import { chromium } from "playwright";
import { eq } from "drizzle-orm";

import { env } from "../config/env.js";
import { db, closeDatabaseConnection } from "../db/client.js";
import { artifacts, testResults, testRuns } from "../db/schema.js";
import { assertSafePublicTarget } from "../services/target-safety.js";
import type { ScanJob } from "../queues/scans.js";

if (!env.REDIS_URL) throw new Error("REDIS_URL is required for the scan worker");

const worker = new Worker<ScanJob>(
  "health-scan",
  async (job) => {
    if (!db) throw new Error("Database is unavailable");
    await db.update(testRuns).set({ status: "running", startedAt: new Date(), updatedAt: new Date() }).where(eq(testRuns.id, job.data.runId));
    const targetUrl = await assertSafePublicTarget(job.data.targetUrl);
    const browser = await chromium.launch({ headless: true });
    try {
      const context = await browser.newContext();
      const page = await context.newPage();
      const consoleErrors: string[] = [];
      page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text().slice(0, 500)); });
      const response = await page.goto(targetUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });
      const artifactDir = join(process.cwd(), ".artifacts", job.data.runId);
      await mkdir(artifactDir, { recursive: true });
      const screenshotPath = join(artifactDir, "page.png");
      await page.screenshot({ path: screenshotPath, fullPage: true });
      const statusCode = response?.status() ?? null;
      const status = statusCode && statusCode >= 400 ? "failed" : "passed";
      await db.insert(testResults).values({ runId: job.data.runId, status, checkName: "page-render", message: status === "passed" ? "Page rendered successfully" : `Page returned HTTP ${statusCode}`, detail: { title: await page.title(), consoleErrors }, durationMs: 0 });
      await db.insert(artifacts).values({ runId: job.data.runId, kind: "screenshot", storageKey: screenshotPath });
      await db.update(testRuns).set({ status: "completed", completedAt: new Date(), updatedAt: new Date() }).where(eq(testRuns.id, job.data.runId));
      return { statusCode, consoleErrors };
    } finally {
      await browser.close();
    }
  },
  { connection: { url: env.REDIS_URL, maxRetriesPerRequest: null }, concurrency: 1 },
);

worker.on("completed", (job, result) => console.info("Scan completed", { runId: job.data.runId, result }));
worker.on("failed", (job, error) => console.error("Scan failed", { runId: job?.data.runId, message: error.message }));
process.on("SIGINT", async () => { await worker.close(); await closeDatabaseConnection(); process.exit(0); });
