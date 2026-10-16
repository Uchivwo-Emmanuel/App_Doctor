# Drizzle migrations

## Local development workflow

1. Copy `.env.example` to `.env` and provide the hosted **development** `DATABASE_URL`.
2. Review generated SQL before applying it: `npm run db:generate`.
3. Apply approved migrations: `npm run db:migrate`.
4. For the temporary localhost demo shortcut only, set `LOCAL_DEMO_ACCESS_ENABLED=true`, `LOCAL_DEMO_EMAIL`, and a unique 32+ character `LOCAL_DEMO_SESSION_SECRET` in ignored `backend/.env`.
5. Seed/update the one development-only user: `npm run db:seed:local-demo`.

The seed has no plaintext password and is idempotent. It is not a Better Auth account, and the access shortcut must remain disabled outside localhost development.

This folder contains generated, reviewed PostgreSQL migrations.

Do not edit generated migration files after they are applied. Generate migrations from `src/db/schema.ts`, inspect the SQL, test it against the dedicated Supabase development project, then commit the migration and its metadata together. No migration is applied automatically by application startup.
