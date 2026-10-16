# Backend Task 04 — Local Demo Access (Seeded User, No Email Flow)

## Goal

Let the local frontend exercise protected App Doctor flows immediately without registration, email delivery, password reset, or public accounts. This is a temporary localhost-only development access layer backed by the seeded demo user from Task 03.

## Implementation

- Implement one explicit development-only identity mechanism (for example a signed local cookie/session) that resolves only to the seeded user.
- Enable it only when `NODE_ENV=development` and an explicit `LOCAL_DEMO_ACCESS_ENABLED=true` setting is present. Fail closed outside localhost development.
- Add a protected tRPC context and ownership-ready `actorId`; do not accept a user ID supplied by the browser.
- Provide one documented local command or route to establish the demo session. It must not expose the seed password in logs, source control, or a browser URL.
- Write tests for enabled, disabled, missing-session, and forged-identity cases.

## Local acceptance criteria

- The seeded local user can establish a session and access protected procedures.
- A missing, forged, or disabled development session is rejected consistently.
- The backend cannot enable this shortcut in production configuration.

## Mandatory cross-check before Backend Task 05

Run the browser/API local access flow, inspect cookie/session settings, and verify protected procedures reject an unauthenticated and forged client. Start the app with production configuration and confirm the shortcut fails closed. Confirm no password or token appears in logs. Do not begin Task 05 until all checks pass.
