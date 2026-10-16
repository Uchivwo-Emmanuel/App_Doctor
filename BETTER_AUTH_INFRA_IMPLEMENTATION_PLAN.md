# Better Auth Infrastructure — Implementation Plan

## Purpose

This plan describes how App Doctor will use Better Auth Infrastructure after the frontend and backend Node projects have been initialised and Better Auth itself is working. It is a future implementation plan only; it does not install packages, create an account, add API keys, or change authentication behaviour today.

The plan covers three connected pieces:

1. The `@better-auth/infra` package.
2. The `dash()` and `dashClient()` plugins for authentication operations, audit visibility, and administration features.
3. The `sentinel()` and `sentinelClient()` plugins for security and abuse protection.

## Why App Doctor needs this

App Doctor will have user registration, login, password recovery, user-owned applications, test credentials, and potentially valuable diagnostic evidence. Authentication needs more than a sign-in form: it needs traceability and protection against automated abuse.

- **Dash** gives the team Better Auth Infrastructure dashboard and audit capabilities, helping investigate authentication activity such as sign-ins, sessions, and administrative actions.
- **Sentinel** adds protection against abuse patterns such as credential stuffing and suspicious traffic. Its browser client can solve an approved proof-of-work challenge automatically when required.
- **The package** is the integration bridge that provides both server and web-client plugins.

This does not replace App Doctor’s own application audit log. We still keep product events such as “Health Scan started” and “artifact opened” in our PostgreSQL `audit_events` table.

## Where each part belongs

| Part | Location | Why it belongs there |
|---|---|---|
| `@better-auth/infra` package | `backend/package.json` and `frontend/package.json` | The backend needs server plugins; the browser needs client plugins. In a future npm workspace, each package declares the dependency it imports. |
| `dash()` | Backend Better Auth configuration, proposed `backend/src/auth/auth.ts` | The server registers Better Auth dashboard/analytics/audit features and uses the private API key. |
| `sentinel()` | Same backend Better Auth configuration | Enforcement happens on the server. `sentinelClient()` alone cannot protect authentication routes. |
| `dashClient()` | Frontend auth-client configuration, proposed `frontend/src/lib/auth-client.ts` | Lets authorised UI features call supported dashboard/audit client actions. |
| `sentinelClient()` | Same frontend auth-client configuration | Adds browser identification/challenge handling for authentication requests. |
| `BETTER_AUTH_API_KEY` | `backend/.env` or VPS secret manager only | This is a private Better Auth Infrastructure credential and must never be exposed through `VITE_` variables or committed to Git. |

## Planned dependency installation

After both Node projects exist, install the package in the package(s) that import it:

```bash
npm install @better-auth/infra
```

Do not run this in an empty folder. First create the approved frontend/backend project structure and their `package.json` files. Dependency versions will be captured in lockfiles and reviewed before deployment.

## Backend plan: Dash and Sentinel

The future backend Better Auth setup will import both plugins:

```ts
import { betterAuth } from "better-auth";
import { dash, sentinel } from "@better-auth/infra";

export const auth = betterAuth({
  // database, email/password, trusted origins, and other Better Auth config
  plugins: [
    dash({ apiKey: process.env.BETTER_AUTH_API_KEY }),
    sentinel({
      apiKey: process.env.BETTER_AUTH_API_KEY,
      security: {
        // Start in observation/log mode and tune after real traffic is measured.
      },
    }),
  ],
});
```

`dash()` and `sentinel()` have different responsibilities. Dash is for management/telemetry/admin capabilities. Sentinel is the server-side security enforcement plugin. The initial Sentinel configuration should favour logging and challenges over automatic blocking so legitimate early users are not incorrectly locked out.

Before enabling it in production:

1. Create a Better Auth Infrastructure project and obtain its API key.
2. Add `BETTER_AUTH_API_KEY=...` only to the backend VPS secret environment.
3. Set Better Auth trusted origins and reverse-proxy/client-IP handling correctly.
4. Test registration, login, logout, reset-password, rate-limit/challenge behaviour, and false-positive recovery in staging.
5. Monitor events before increasing security thresholds.

## Frontend plan: Dash Client and Sentinel Client

The future web auth client will pair with the backend plugins:

```ts
import { createAuthClient } from "better-auth/client";
import { dashClient, sentinelClient } from "@better-auth/infra/client";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  plugins: [
    dashClient(),
    sentinelClient({ autoSolveChallenge: true }),
  ],
});
```

The frontend only receives the public backend API URL. It does **not** receive `BETTER_AUTH_API_KEY`. Sentinel’s browser plugin assists with an approved challenge; the backend remains the authority that permits, challenges, or blocks an authentication request.

## Required environment variables

Add this placeholder to the backend environment template during Better Auth implementation:

```dotenv
# Better Auth Infrastructure; server/VPS only.
BETTER_AUTH_API_KEY=CHANGE_ME
```

No new frontend environment variable is required for the Better Auth Infrastructure key. `VITE_API_URL` is sufficient for the browser to reach the backend auth endpoint.

## Security and privacy rules

- Never commit `.env` files or Better Auth Infrastructure keys.
- Never use `VITE_BETTER_AUTH_API_KEY` or send the private key to the browser.
- Configure and verify trusted proxy headers before using client IP information for abuse decisions.
- Start Sentinel conservatively and review false positives before turning on blocks.
- Restrict any Dash administration UI/API actions to authorised App Doctor administrators; it must not become a public user-management surface.
- Continue using the application’s own ownership checks and audit records; this integration does not grant users access to other users’ applications, runs, or artifacts.

## Implementation order and acceptance criteria

1. Initialise approved TypeScript frontend/backend projects and Better Auth base configuration.
2. Create Better Auth Infrastructure project; add the server-only key through the VPS secrets process.
3. Install `@better-auth/infra` where imported.
4. Add backend `dash()` and conservative `sentinel()` configuration.
5. Add frontend `dashClient()` and `sentinelClient({ autoSolveChallenge: true })` configuration.
6. Test the full authentication flow in staging, including an intentionally triggered Sentinel challenge.
7. Enable production monitoring; retain observation/challenge mode until traffic patterns and support handling are proven.

The integration is complete only when normal auth works, the browser can satisfy a permitted challenge, sensitive keys are absent from frontend bundles, unauthorised Dash actions are rejected, and the team can inspect the resulting authentication activity safely.

## Source

This plan follows the current [Better Auth Infrastructure getting-started guide](https://better-auth.com/docs/infrastructure/getting-started) and [Sentinel security guidance](https://better-auth.com/docs/infrastructure/plugins/sentinel).
