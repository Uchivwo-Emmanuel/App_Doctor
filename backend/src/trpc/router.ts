import { TRPCError, initTRPC } from "@trpc/server";
import { z } from "zod";

import {
  archiveApplicationForOwner,
  createApplication,
  getApplicationForOwner,
  listApplicationsForOwner,
  updateApplicationForOwner,
} from "../repositories/applications.js";
import { createIssue, createQueuedRun, getRun, listIssues, listResultsForRun, listRuns } from "../repositories/runs.js";
import { enqueueScan } from "../queues/scans.js";
import { assertSafePublicTarget } from "../services/target-safety.js";
import type { Context } from "./context.js";

const t = initTRPC.context<Context>().create();
const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.actorId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({ ctx: { ...ctx, actorId: ctx.actorId } });
});

const applicationInput = z.object({
  name: z.string().trim().min(1).max(120),
  baseUrl: z.url().refine((value) => new URL(value).protocol === "https:", "A public HTTPS URL is required"),
  environment: z.enum(["development", "staging", "production"]),
  testingAuthorization: z.literal(true),
});

function normaliseBaseUrl(value: string) {
  const url = new URL(value);
  url.hash = "";
  url.search = "";
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  return url.toString();
}

export const appRouter = t.router({
  health: t.procedure.output(z.object({ status: z.literal("ok") })).query(() => ({ status: "ok" })),
  applications: t.router({
    list: protectedProcedure.query(({ ctx }) => listApplicationsForOwner(ctx.actorId)),
    get: protectedProcedure.input(z.object({ id: z.uuid() })).query(async ({ ctx, input }) => {
      const application = await getApplicationForOwner(ctx.actorId, input.id);
      if (!application) throw new TRPCError({ code: "NOT_FOUND" });
      return application;
    }),
    create: protectedProcedure.input(applicationInput).mutation(({ ctx, input }) =>
      createApplication({
        ownerId: ctx.actorId,
        name: input.name,
        baseUrl: normaliseBaseUrl(input.baseUrl),
        environment: input.environment,
      }),
    ),
    update: protectedProcedure.input(applicationInput.extend({ id: z.uuid() })).mutation(async ({ ctx, input }) => {
      const application = await updateApplicationForOwner(ctx.actorId, input.id, {
        name: input.name,
        baseUrl: normaliseBaseUrl(input.baseUrl),
        environment: input.environment,
      });
      if (!application) throw new TRPCError({ code: "NOT_FOUND" });
      return application;
    }),
    archive: protectedProcedure.input(z.object({ id: z.uuid() })).mutation(async ({ ctx, input }) => {
      const application = await archiveApplicationForOwner(ctx.actorId, input.id);
      if (!application) throw new TRPCError({ code: "NOT_FOUND" });
      return application;
    }),
  }),
  runs: t.router({
    list: protectedProcedure.query(({ ctx }) => listRuns(ctx.actorId)),
    get: protectedProcedure.input(z.object({ id: z.uuid() })).query(async ({ ctx, input }) => {
      const run = await getRun(ctx.actorId, input.id);
      if (!run) throw new TRPCError({ code: "NOT_FOUND" });
      return run;
    }),
    start: protectedProcedure.input(z.object({ applicationId: z.uuid(), idempotencyKey: z.string().uuid() })).mutation(async ({ ctx, input }) => {
      const application = await getApplicationForOwner(ctx.actorId, input.applicationId);
      if (!application) throw new TRPCError({ code: "NOT_FOUND" });
      try {
        const targetUrl = await assertSafePublicTarget(application.baseUrl);
        const run = await createQueuedRun({ applicationId: application.id, ownerId: ctx.actorId, idempotencyKey: input.idempotencyKey, targetUrl });
        await enqueueScan({ runId: run.id, targetUrl });
        return run;
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This target cannot be scanned safely right now" });
      }
    }),
    results: protectedProcedure.input(z.object({ runId: z.uuid() })).query(async ({ ctx, input }) => {
      const data = await listResultsForRun(ctx.actorId, input.runId);
      if (!data) throw new TRPCError({ code: "NOT_FOUND" });
      return data;
    }),
  }),
  issues: t.router({
    list: protectedProcedure.query(({ ctx }) => listIssues(ctx.actorId)),
    create: protectedProcedure.input(z.object({
      title: z.string().trim().min(1).max(160),
      expectedBehavior: z.string().trim().min(1).max(10_000),
      actualBehavior: z.string().trim().min(1).max(10_000),
      prerequisites: z.string().trim().max(10_000).optional(),
      runId: z.uuid().optional(),
      resultId: z.uuid().optional(),
    })).mutation(({ ctx, input }) => createIssue({ ownerId: ctx.actorId, ...input })),
  }),
});

export type AppRouter = typeof appRouter;
