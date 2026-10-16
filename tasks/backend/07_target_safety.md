# Backend Task 07 — Safe Public-Lovable Target Gate

## Goal

Allow an authorised public Lovable app to be scanned while preventing the browser worker from reaching the local machine, VPS, or cloud-internal services.

## Implementation

- Build a reusable target-safety service that canonicalises public HTTPS URLs and permits controlled localhost fixtures only under an explicit development rule.
- Resolve hostnames and reject loopback, private, link-local, multicast, unspecified, cloud-metadata, and equivalent IPv6 addresses.
- Revalidate every redirect and set a small maximum redirect count.
- Require the scan target to match the saved application's authorised origin. Tomorrow's demo supports one explicit approved app origin rather than arbitrary per-run URLs.
- Establish an isolated local fixture strategy for deterministic automated tests.
- Create audit-safe rejection reasons; do not expose internal network details to users.

## Local acceptance criteria

- Unsafe URLs are rejected before a job is queued or browser is opened.
- An approved public Lovable origin and an approved local fixture work only under their respective explicit rules.
- Redirect safety is ready for worker enforcement.

## Mandatory cross-check before Backend Task 08

Run the complete malicious-target test suite, including localhost/private/metadata/redirect cases, plus a real approved Lovable URL dry-run. Confirm every rejection is logged without exposing sensitive addresses. Do not begin Task 08 until all checks pass.
