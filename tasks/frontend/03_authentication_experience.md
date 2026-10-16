# Frontend Task 03 — Local Demo Entry (No Login Screen)

## Goal

Enter the seeded local-demo session without making registration, login, email, or password reset block tomorrow's testing.

## Implementation

- Build a minimal local-only entry screen or automatic development bootstrap that calls the backend's safe local-demo session endpoint.
- Label it clearly as development access and show no password field, reset flow, or public sign-up claim.
- Route an established demo session into the dashboard; handle disabled/missing access honestly.
- Ensure the UI cannot choose or impersonate another user.

## Local acceptance criteria

- A developer can enter the seeded demo session and reach protected pages.
- Disabled/expired/missing demo access shows an actionable local-development message.

## Mandatory cross-check before Frontend Task 04

Test a fresh browser profile, disabled backend shortcut, expired/missing session, and forged query/local-storage identity attempt. Confirm no credential or secret is in the browser. Do not begin Task 04 until all checks pass.
