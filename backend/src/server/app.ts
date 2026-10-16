import { randomUUID } from "node:crypto";

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";

import { clearLocalDemoSessionCookie, createLocalDemoSessionCookie, getLocalDemoUserId, localDemoAccessIsEnabled } from "../auth/local-demo.js";
import { env } from "../config/env.js";
import { databaseIsReady } from "../db/client.js";
import { logger } from "../lib/logger.js";
import { getArtifactPathForOwner } from "../repositories/runs.js";
import { createContext } from "../trpc/context.js";
import { appRouter } from "../trpc/router.js";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "100kb" }));
  app.use((request: Request, response: Response, next: NextFunction) => {
    const requestId = request.headers["x-request-id"]?.toString() ?? randomUUID();
    const startedAt = performance.now();

    request.headers["x-request-id"] = requestId;
    response.setHeader("x-request-id", requestId);
    response.on("finish", () => {
      logger.info(
        {
          requestId,
          method: request.method,
          path: request.path,
          statusCode: response.statusCode,
          durationMs: Math.round(performance.now() - startedAt),
        },
        "request completed",
      );
    });
    next();
  });

  app.get("/healthz", (_request, response) => response.status(200).json({ status: "ok" }));
  app.get("/readyz", async (_request, response) => {
    const ready = await databaseIsReady();
    return response.status(ready ? 200 : 503).json({ status: ready ? "ok" : "unavailable", database: ready ? "ready" : "unavailable" });
  });
  app.post("/local-demo/session", (_request, response) => {
    if (!localDemoAccessIsEnabled()) {
      return response.status(404).json({ error: "Not found" });
    }
    response.setHeader("Set-Cookie", createLocalDemoSessionCookie());
    return response.status(204).end();
  });
  app.delete("/local-demo/session", (_request, response) => {
    response.setHeader("Set-Cookie", clearLocalDemoSessionCookie());
    return response.status(204).end();
  });
  app.get("/artifacts/:artifactId", async (request, response) => {
    const actorId = getLocalDemoUserId(request.headers.cookie);
    if (!actorId) return response.status(401).json({ error: "Unauthorized" });
    const storagePath = await getArtifactPathForOwner(actorId, request.params.artifactId);
    if (!storagePath) return response.status(404).json({ error: "Not found" });
    return response.sendFile(storagePath, (error) => {
      if (error && !response.headersSent) response.status(404).json({ error: "Evidence unavailable" });
    });
  });
  app.use("/trpc", createExpressMiddleware({ router: appRouter, createContext }));

  return app;
}
