# Frontend Task 06 — Start a Safe Health Scan

## Goal

Let the user start one bounded scan against their saved, authorised Lovable app.

## Implementation

- Build the scan-start flow from a saved application, with safe initial checks and a clear side-effect boundary.
- Explain what will be inspected and that forms/actions will not be submitted in this demo.
- Disable duplicate submission and route immediately to run status.
- Render target-safety errors in clear non-technical language without leaking network internals.

## Local acceptance criteria

- A user can queue a fixture scan and authorised Lovable scan and immediately see queued status.
- Invalid/unsafe targets produce an error and no queued-run representation.

## Mandatory cross-check before Frontend Task 07

Test permitted target, missing input, duplicate click, safety rejection, cancellation, and API/network failure. Confirm no resolver/internal-address detail is displayed. Do not begin Task 07 until all checks pass.
