# Backend Task 02 — Validate Local Configuration and Secrets

## Goal

Make backend configuration explicit, validated at startup, and safe for localhost development.

## Implementation

- Implement a typed configuration module that reads `backend/.env` and validates required values with Zod or equivalent.
- Use `backend/.env.example` as the canonical safe template; add missing Better Auth Infrastructure placeholders only when that integration is implemented.
- Separate required-now local values from optional future values such as AWS S3, OpenAI, and Better Auth Infrastructure.
- Fail fast with field names only when required configuration is invalid; never echo a secret.
- Provide local defaults only for non-secret values, including ports, origins, and conservative worker limits.
- Create a redaction helper for logs/errors covering database URLs, Redis URLs, API keys, cookies, passwords, and authorization headers.

## Local acceptance criteria

- The server starts with a valid local `.env`.
- It stops with useful, secret-safe errors when a required value is absent or malformed.
- Optional production services do not prevent early localhost work.

## Mandatory cross-check before Backend Task 03

Start once with valid configuration and once with each required setting removed. Confirm that failures identify only the setting name, that test logs contain no secret placeholder/value, and that `.env` remains ignored by Git. Do not begin Task 03 until all checks pass.
