import { index, integer, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const localDemoUsers = pgTable("local_demo_users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  displayName: varchar("display_name", { length: 120 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: varchar("owner_id", { length: 64 })
      .notNull()
      .references(() => localDemoUsers.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 120 }).notNull(),
    baseUrl: text("base_url").notNull(),
    environment: varchar("environment", { length: 32 }).notNull(),
    authorizationAttestedAt: timestamp("authorization_attested_at", { withTimezone: true }).notNull(),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("applications_owner_active_idx").on(table.ownerId, table.archivedAt)],
);

export const testRuns = pgTable(
  "test_runs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    applicationId: uuid("application_id").notNull().references(() => applications.id, { onDelete: "restrict" }),
    ownerId: varchar("owner_id", { length: 64 }).notNull().references(() => localDemoUsers.id, { onDelete: "restrict" }),
    status: varchar("status", { length: 24 }).notNull(),
    idempotencyKey: varchar("idempotency_key", { length: 128 }).notNull().unique(),
    targetUrl: text("target_url").notNull(),
    failureReason: text("failure_reason"),
    startedAt: timestamp("started_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("test_runs_owner_created_idx").on(table.ownerId, table.createdAt)],
);

export const testResults = pgTable(
  "test_results",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    runId: uuid("run_id").notNull().references(() => testRuns.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 24 }).notNull(),
    checkName: varchar("check_name", { length: 100 }).notNull(),
    message: text("message").notNull(),
    detail: jsonb("detail").notNull().default({}),
    durationMs: integer("duration_ms"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("test_results_run_created_idx").on(table.runId, table.createdAt)],
);

export const artifacts = pgTable(
  "artifacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    runId: uuid("run_id").notNull().references(() => testRuns.id, { onDelete: "cascade" }),
    kind: varchar("kind", { length: 32 }).notNull(),
    storageKey: text("storage_key").notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("artifacts_run_idx").on(table.runId)],
);

export const issues = pgTable(
  "issues",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    ownerId: varchar("owner_id", { length: 64 }).notNull().references(() => localDemoUsers.id, { onDelete: "restrict" }),
    runId: uuid("run_id").references(() => testRuns.id, { onDelete: "set null" }),
    resultId: uuid("result_id").references(() => testResults.id, { onDelete: "set null" }),
    title: varchar("title", { length: 160 }).notNull(),
    expectedBehavior: text("expected_behavior").notNull(),
    actualBehavior: text("actual_behavior").notNull(),
    prerequisites: text("prerequisites"),
    status: varchar("status", { length: 24 }).notNull().default("open"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("issues_owner_created_idx").on(table.ownerId, table.createdAt)],
);
