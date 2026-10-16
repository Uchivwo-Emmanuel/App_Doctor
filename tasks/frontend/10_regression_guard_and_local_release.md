# Frontend Task 10 — Deferred Regression Guard and Release Readiness

## Goal

Finish the complete local product after authentication, email, and diagnostics are stable; only then prepare for VPS deployment.

## Implementation

- Build baseline selection, rerun, regression findings, comparison detail, and resolve/rebaseline flows.
- Explain invalid comparisons when test definition, environment, or prerequisites differ.
- Add end-to-end tests for the completed core journey.
- Document beta onboarding, known limitations, and feedback capture. Keep VPS/Redis-on-VPS/AWS deployment out of this task.

## Local acceptance criteria

- A comparable baseline failure displays a truthful regression finding.
- A new local tester can complete the documented workflow.

## Mandatory cross-check before Any VPS/Production Work

Run the complete local path with a fresh account: add app, health scan, inspect evidence, create issue, baseline/rerun/regression, and diagnostic. Run frontend/backend/security checks, record limitations, and obtain explicit approval before VPS, Redis-on-VPS, AWS S3, or production deployment work.
