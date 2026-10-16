# Backend Task 06 — Install and Prove Local Redis, BullMQ, and Worker Lifecycle

## Goal

Run asynchronous scan jobs locally without holding an HTTP/tRPC request open.

## Implementation

- Install reviewed `bullmq` and Redis-client dependencies in the backend.
- Run Redis locally for development (Docker is preferred) through `REDIS_URL`; configure localhost-only networking, persistence, and a conservative memory limit.
- Create BullMQ queue producer, worker entry point, payload validation, job-status model, and idempotency-key strategy.
- Add `test_runs` migration with queued/running/completed/failed/cancelled/timed-out terminal semantics.
- Start worker concurrency at `1`; use per-run timeout/cancellation placeholders.
- Persist failed-job reasons safely and reconcile stale running runs.
- Document separate local commands for Redis, API, and worker.

## Local acceptance criteria

- Redis responds locally, is unavailable from a non-local address, and its documented start/stop command works.
- BullMQ connects through development `REDIS_URL`.
- A local-demo protected procedure creates one queued run and returns promptly.
- A separate worker processes a harmless fixture job and persists a terminal result.
- Duplicate submission does not create duplicate active work.

## Mandatory cross-check before Backend Task 07

Submit fixture jobs, stop the worker mid-job, restart it, and verify stale/failed states are reconciled honestly. Test cancellation and duplicate submission. Confirm Redis is not exposed outside localhost. Do not begin Task 07 until all checks pass.
