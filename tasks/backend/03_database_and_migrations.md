# Backend Task 03 — Hosted Supabase Schema and Seeded Local Demo User

## Goal

Prepare the existing hosted Supabase development project for tomorrow's localhost demo. Create a small, reversible schema and one clearly marked seeded **development-only** user. This is not the final authentication system.

## Implementation

- Use the existing hosted Supabase development database from the uncommitted `DATABASE_URL`; do not use a production database for development.
- Configure Drizzle ORM and Drizzle Kit with that dedicated development database URL.
- Add baseline migration and migration scripts.
- Add a minimal local-demo identity record with a stable non-secret ID, display name, and the developer's email. Store a one-way password hash only if a password check is needed; never seed or commit a plaintext password.
- Provide an idempotent seed command which creates or updates only the marked development demo user. Read the email/password from ignored local environment variables, not source control.
- Add a database health/readiness check that verifies connectivity without returning internals.
- Document reset/seed procedure and its clear separation from a real Better Auth user/session.

## Local acceptance criteria

- A developer can apply reviewed migrations, seed the local-demo identity, and inspect the expected schema from documented commands.
- Reapplying migrations and the seed is safe and predictable.
- The API readiness check reports database availability correctly.

## Mandatory cross-check before Backend Task 04

First confirm that `DATABASE_URL` targets the Supabase development project. Then run migration generation/apply, run the seed twice to prove idempotency, start the API, and verify readiness. Review generated SQL for unintended destructive operations and prove neither the seed password nor a database URL is logged. Do not begin Task 04 until all checks pass.
