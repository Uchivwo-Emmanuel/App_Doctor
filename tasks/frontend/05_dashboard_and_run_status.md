# Frontend Task 05 — Dashboard and Honest Run Status

## Goal

Show the registered app and its queued/running/completed scan state without fake progress or invented statistics.

## Implementation

- Build application summary, recent runs, status counts, and useful empty states.
- Build run-status page with queued, running, completed, failed, cancelled, and timed-out states.
- Poll/refetch efficiently for localhost and make run ID, target, and time visible.
- Use plain language for passed, failed, skipped, and inconclusive.

## Local acceptance criteria

- A fixture run appears and transitions honestly through all states.
- Empty/loading/failure/populated screens are useful.

## Mandatory cross-check before Frontend Task 06

Drive a fixture run through each terminal state and confirm there are no duplicate requests or stale success messages. Test responsive and accessible status descriptions. Do not begin Task 06 until all checks pass.
