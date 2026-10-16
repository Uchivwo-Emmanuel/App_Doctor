# Backend Task 05 — Demo Applications and Target Registration

## Goal

Let the seeded demo user register a real Lovable app they are authorised to test, ready for a queued scan tomorrow.

## Implementation

- Add an `applications` migration and Drizzle repository with UUID, owner reference, name, normalised base URL, environment, authorisation attestation, archive state, and timestamps.
- Add validated tRPC procedures to list, get, create, update, and archive an application.
- Enforce ownership-ready repository/service queries; never rely on hidden UI controls.
- Record basic audit metadata for create/update/archive actions.
- Validate normal HTTPS public URLs now; detailed SSRF and redirect enforcement is the next task.
- Keep the first form intentionally small: name, base URL, environment, and testing-authorisation attestation.

## Local acceptance criteria

- The seeded user can create, list, edit, and archive a real public Lovable-app record.
- Invalid URL and missing authorisation attestation are rejected clearly.
- Archive does not erase historical records.

## Mandatory cross-check before Backend Task 06

Create, edit, and archive a disposable Lovable-app record through the API. Verify anonymous access is rejected, URL and attestation validation work, and migrations apply from an empty schema. Do not begin Task 06 until all checks pass.
