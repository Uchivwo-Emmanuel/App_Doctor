# Backend Task 09 — Tomorrow's Issue Intake and Evidence Record

## Goal

Support the minimum evidence-based workflow for capturing a real Lovable issue after its initial scan. Advanced approval and retest automation follows later.

## Implementation

- Add a minimal `issues` table with title, expected/actual behaviour, prerequisites, linked run/result, status, and timestamps.
- Add protected procedures to create, update, and view an issue and its scan evidence.
- Preserve an explicit note that a scan finding is evidence, not proof of root cause.
- Record missing prerequisites and scanner limits as inconclusive.
- Defer automated reproduction, approval workflow, and verified-fix claims to a later phase.

## Local acceptance criteria

- A local user can record a real issue and link it to truthful scan evidence.
- Missing prerequisites and scanner limits do not become false passes.

## Mandatory cross-check before Backend Task 10

Test issue creation, update, missing-prerequisite, unauthorised, and evidence-link paths against fixtures. Review wording to ensure it does not claim a root cause or verified fix. Do not begin Task 10 until all checks pass.
