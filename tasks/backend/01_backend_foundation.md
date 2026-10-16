# Backend Task 01 — Create the Local Backend Foundation

## Goal

Create the `backend` Node.js/TypeScript project for local development. Establish Express, tRPC, consistent scripts, linting, type-checking, a test runner, and a small health endpoint. Do not add product features yet.

## Implementation

- Initialise `backend/package.json` and TypeScript with strict settings.
- Create a clear source layout: `src/server`, `src/trpc`, `src/config`, `src/services`, `src/repositories`, `src/workers`, and `src/lib`.
- Add Express with `GET /healthz` and `GET /readyz`; mount a minimal tRPC router at the chosen local API path.
- Add scripts for `dev`, `build`, `start`, `typecheck`, `lint`, and `test`.
- Enable structured request logging with a generated correlation ID. Never log request bodies, passwords, credentials, or secrets by default.
- Document Node version, localhost ports, and the command to start the API.

## Local acceptance criteria

- API starts locally with one documented command.
- `GET /healthz` returns a successful response.
- A typed tRPC health procedure responds locally.
- Build, lint, type-check, and test commands all pass.

## Mandatory cross-check before Backend Task 02

Run every project script from a clean install, call both HTTP health routes and the tRPC procedure, and inspect logs to confirm no environment values are printed. Record the commands and results in the task PR/implementation notes. Do not begin Task 02 until all checks pass.
