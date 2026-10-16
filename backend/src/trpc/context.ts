import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";

import { getLocalDemoUserId } from "../auth/local-demo.js";

export function createContext({ req }: CreateExpressContextOptions) {
  return {
    requestId: req.headers["x-request-id"]?.toString() ?? "unknown",
    actorId: getLocalDemoUserId(req.headers.cookie),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
