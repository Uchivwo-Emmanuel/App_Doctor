# Backend Task 10 — Deferred Product Hardening: Better Auth, Email, Regression, and OpenAI

## Goal

After tomorrow's local demo is stable, replace local-demo access with Better Auth, add real email delivery, and build the advanced diagnosis/regression work.

## Implementation

- Generate Better Auth's supported Drizzle/PostgreSQL schema and replace local-demo access with registration, sign-in/out, secure sessions, email verification/reset, and rate limits.
- Use Mailpit only for local email testing and Resend with a verified sender domain for beta/production. Keep credentials server-side.
- Add regression baselines/findings with definition version and environment fingerprint; prevent invalid comparison after material changes.
- Add dashboard/report procedures for owned applications, runs, results, issues, regression findings, and signed/local artifact access.
- Implement the OpenAI diagnostics adapter only for failed/inconclusive results with approved, redacted evidence.
- Validate structured diagnostic output and add timeout, quota/cost, redaction, and unavailable-state controls.
- Keep S3 behind an artifact-storage interface; use local private storage for localhost and wire AWS only during deployment work.

## Local acceptance criteria

- Better Auth replaces local-demo access without weakening ownership controls.
- A comparable baseline pass followed by failure creates a regression finding.
- OpenAI failure leaves the deterministic report usable.

## Mandatory cross-check before VPS/Production Work

Run an end-to-end local path: register, add app, queue scan, inspect result/artifact, record an issue, set baseline, detect regression, and request a diagnostic. Verify ownership, redaction, email behaviour, OpenAI-key absence from responses/logs, and all migrations/tests. Do not begin VPS or production work until all checks pass.
