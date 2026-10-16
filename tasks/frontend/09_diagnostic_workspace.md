# Frontend Task 09 — Deferred Authentication and Diagnostic Workspace

## Goal

After the local demo works, add the real account experience and evidence-first OpenAI diagnostic workspace.

## Implementation

- Replace local-demo entry with Better Auth sign-up, sign-in, logout, session restoration, email verification/reset, and protected routes.
- Build the original diagnostic workspace with evidence, observations, hypotheses, recommendations, limitations, and repair-prompt card.
- Use the backend OpenAI API only; no API key in the browser.
- Show an honest unavailable state if email or OpenAI services are not configured.

## Local acceptance criteria

- Real account flows and diagnostics preserve deterministic evidence and safe error states.

## Mandatory cross-check before Frontend Task 10

Test fresh account, invalid credentials, expired session, complete/unavailable/insufficient-evidence diagnostics, and browser network/bundle secrecy. Do not begin Task 10 until all checks pass.
