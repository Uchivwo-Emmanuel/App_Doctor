import "dotenv/config";

import { z } from "zod";

const logLevelSchema = z.enum(["fatal", "error", "warn", "info", "debug", "trace"]);

export const environmentSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
  APP_URL: z.string().url().default("http://localhost:3000"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  CORS_ORIGIN: z.string().url().default("http://localhost:5173"),
  LOG_LEVEL: logLevelSchema.default("info"),
  DATABASE_URL: z.string().url().optional(),
  REDIS_URL: z.string().url().optional(),
  BETTER_AUTH_SECRET: z.string().min(32).optional(),
  LOCAL_DEMO_ACCESS_ENABLED: z.coerce.boolean().default(false),
  LOCAL_DEMO_EMAIL: z.string().email().optional(),
  LOCAL_DEMO_SESSION_SECRET: z.string().min(32).optional(),
}).superRefine((value, context) => {
  if (!value.LOCAL_DEMO_ACCESS_ENABLED) {
    return;
  }

  if (value.NODE_ENV !== "development" && value.NODE_ENV !== "test") {
    context.addIssue({ code: "custom", path: ["LOCAL_DEMO_ACCESS_ENABLED"], message: "Local demo access is development-only" });
  }

  if (!value.LOCAL_DEMO_EMAIL) {
    context.addIssue({ code: "custom", path: ["LOCAL_DEMO_EMAIL"], message: "A demo email is required" });
  }

  if (!value.LOCAL_DEMO_SESSION_SECRET && !value.BETTER_AUTH_SECRET) {
    context.addIssue({ code: "custom", path: ["LOCAL_DEMO_SESSION_SECRET"], message: "A session secret is required" });
  }
});

export type Environment = z.infer<typeof environmentSchema>;

export function parseEnvironment(values: NodeJS.ProcessEnv): Environment {
  const parsedEnvironment = environmentSchema.safeParse(values);

  if (!parsedEnvironment.success) {
    const fields = parsedEnvironment.error.issues.map((issue) => issue.path.join(".")).join(", ");
    throw new Error(`Invalid backend configuration: ${fields}`);
  }

  return parsedEnvironment.data;
}

export const env = parseEnvironment(process.env);
