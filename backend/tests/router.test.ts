import { describe, expect, it } from "vitest";

import { createApp } from "../src/server/app.js";
import { appRouter } from "../src/trpc/router.js";

describe("health router", () => {
  it("returns an ok status", async () => {
    const caller = appRouter.createCaller({ requestId: "test-request" });

    await expect(caller.health()).resolves.toEqual({ status: "ok" });
  });

  it("rejects protected application procedures without a local demo session", async () => {
    const caller = appRouter.createCaller({ requestId: "test-request", actorId: null });

    await expect(caller.applications.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("serves the HTTP health and readiness endpoints", async () => {
    const app = createApp();
    const server = app.listen(0);
    const address = server.address();

    if (!address || typeof address === "string") {
      throw new Error("Expected a TCP listener");
    }

    try {
      const health = await fetch(`http://127.0.0.1:${address.port}/healthz`);
      const readiness = await fetch(`http://127.0.0.1:${address.port}/readyz`);

      await expect(health.json()).resolves.toEqual({ status: "ok" });
      await expect(readiness.json()).resolves.toEqual({ status: "ok", database: "ready" });
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });
});
