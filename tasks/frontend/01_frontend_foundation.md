# Frontend Task 01 — Local Frontend Foundation

## Goal

Create the smallest reliable React/TypeScript frontend that can talk to the local API tomorrow.

## Implementation

- Initialise React, Vite, TypeScript strict mode, Tailwind, linting, tests, and production build scripts.
- Configure safe `VITE_` variables, including only `VITE_API_URL`; never put Supabase, OpenAI, Redis, S3, or email secrets in the browser.
- Add a tRPC/query client, global error boundary, not-found route, and an API-unavailable screen.
- Document the localhost command and expected backend URL.

## Local acceptance criteria

- The app starts locally and can call the backend health endpoint.
- Type-check, lint, tests, and build pass.

## Mandatory cross-check before Frontend Task 02

Run a clean install/build, load the app in a browser, stop the API to confirm the unavailable state, and inspect the client bundle/environment for secrets. Do not begin Task 02 until all checks pass.
