# Backend Task 08 — Playwright Health Scan for a Real Lovable App

## Goal

Implement a bounded, isolated Health Scan worker that first proves itself on controlled fixtures, then safely scans one authorised public Lovable app.

## Implementation

- Install Playwright and browser binaries in the worker environment; record the exact local setup command.
- Add a controlled fixture site used only for deterministic browser-test development.
- Launch Playwright only from the dedicated worker after Task 07 safety checks.
- Use a fresh browser context per run; define navigation, step, and total-run timeouts with guaranteed browser cleanup.
- Implement deterministic checks: reachability, render, configured navigation/link checks, console errors, failed requests, and safe visible-control/form-validation checks. Do not submit forms or cause business side effects in tomorrow's workflow.
- Add `test_definitions`, `test_results`, and `artifacts` migrations/repositories as needed.
- Store screenshots/traces in a private local artifact directory behind an artifact-service interface; do not expose raw paths to clients.
- Persist passed, failed, skipped, and inconclusive outcomes with clear reasons.

## Local acceptance criteria

- Browser installation opens the controlled fixture.
- Fixtures produce known pass, failure, skip, and inconclusive outcomes.
- One authorised public Lovable app produces an honest bounded result.
- Browser processes close after success, error, cancellation, and timeout.

## Mandatory cross-check before Backend Task 09

Run scans against all fixtures and one authorised public Lovable app, inspect persisted results/artifacts, force timeout and worker-error paths, and verify no browser processes remain. Confirm an unauthorised client cannot request an artifact. Do not begin Task 09 until all checks pass.
