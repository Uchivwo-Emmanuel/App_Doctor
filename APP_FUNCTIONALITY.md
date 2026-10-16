# App Doctor / Launch Guard — Functionality Specification

## 1. Product introduction

App Doctor is an independent, evidence-based quality-assurance service for web applications built with AI-assisted tools. A user supplies an application they are authorized to test, runs focused browser checks, and receives an understandable report of what was observed. It is an independent QA engineer—not an AI coding assistant, security scanner, or guarantee that an application is defect-free.

The MVP has three connected capabilities: **App Health Scan**, **Bug Verification**, and **Regression Guard**. Every conclusion must retain its supporting run, steps, timestamps, logs, and artifacts where available.

## 2. Audience and problems

Primary users are nontechnical founders, vibe coders, indie hackers, and small development teams using Lovable, Bolt, Replit, Cursor, Claude Code, Codex, or similar tools. Secondary users are developers who need a lightweight, repeatable pre-release check.

The product addresses uncertain AI-produced fixes, regressions after a feature change, opaque API/browser failures, slow manual testing, and uncertainty about whether an app is ready to release. It does not infer all business rules from a URL and must never describe a scan as proof that an application is bug-free.

## 3. Objectives and boundaries

App Doctor should make it simple to add an authorized public or staging application, run safe automated checks, understand the results, preserve known-good workflows, and verify a claimed fix with the same reproduction conditions.

The MVP deliberately does not modify customer code, perform automatic Git rollback, crawl arbitrary private infrastructure, execute purchases or destructive actions by default, promise universal AI-generated tests, or offer GitHub-triggered test runs. Such capabilities require later consent, safeguards, and product validation.

## 4. Core concepts and result language

| Term | Meaning |
|---|---|
| Check | One deterministic assertion or observation, such as “login form is visible.” |
| Test definition | A saved, versioned workflow and its allowed inputs, prerequisites, and assertions. |
| Test run | One asynchronous execution of one or more checks against an application environment. |
| Artifact | Evidence such as a screenshot, sanitized console entry, network summary, or trace reference. |
| Baseline | A selected successful result for a saved regression test. |

- **Passed / successful test:** all required assertions completed under the declared preconditions with no configured blocking error.
- **Failed test:** a required assertion was reached and demonstrably did not hold; the report names the assertion and evidence.
- **Inconclusive:** the platform could not establish a result—for example a test account was invalid, environment was unavailable, selector ambiguity prevented safe interaction, or a prerequisite was missing.
- **Skipped:** deliberately not attempted, with a reason such as disabled credentialed flow or unsafe side effect.
- **Verified fix:** the same approved reproduction test that previously reproduced the defect passes after the fix, under comparable conditions. It is not a claim that all related defects are fixed.

Customer-facing reports label claims as **confirmed observation**, **warning**, or **hypothesis**. A diagnostic hypothesis is never presented as fact.

## 5. App Health Scan

### Purpose

A Health Scan supplies a quick, bounded view of an application’s reachable pages and configured critical flows. It starts with deterministic browser checks and produces a clear health summary plus evidence.

### Inputs

- Application name, authorized base URL, and environment label (for example, staging).
- Optional allowed paths and configured critical journeys.
- Optional dedicated test credentials stored securely; never entered into a report.
- Explicit consent for any flow that can change data; the MVP defaults to read-only and safe form-validation actions.

### Process

1. Validate the target and authorization declaration before scheduling work.
2. A worker revalidates DNS and every redirect, then starts an isolated browser context.
3. It performs bounded availability, rendering, navigation/link, console-error, failed-request, visible-control, and safe form-validation checks.
4. It executes only selected credentialed or critical journeys; it captures relevant evidence on failure.
5. The system classifies each check, saves a result, and presents a plain-language summary.

### Example

**Input:** `Staging Store`, `https://staging.example.test`, with `/`, `/products`, and a read-only navigation journey.  
**Process:** home and products pages render; the products API returns HTTP 500; product links cannot populate.  
**Output:** “2 pages loaded; product data check failed.” The report includes the time, URL, sanitized failed request metadata, screenshot, and a statement that the scan cannot assess untested business rules.

## 6. Bug Verification

### Purpose

Bug Verification turns a user-reported issue into a reviewable, repeatable test—not a model’s unsupported opinion about whether a fix worked.

### Inputs and guided intake

The user provides a plain-language description, affected URL/flow, expected and actual behavior, prerequisites, test data or account access if needed, and explicit permission for any state-changing steps. The UI asks follow-up questions when those details are insufficient.

### Process and output

The platform records the report, creates a draft reproduction workflow, and clearly identifies any assumptions for user review. A worker attempts the workflow in an isolated context. It saves exact outcome, completed steps, failure point, and evidence. Later verification reruns the approved test and compares it with the earlier attempt.

**Example:** “Applying a discount makes checkout stop working.” The user supplies a staging account, test product, coupon, and permission to use the sandbox checkout. The run applies the coupon and observes a disabled checkout action despite valid cart state. Output: **reproduced**, with timestamped screenshot and console/network evidence. After an external fix, the same test reaches the sandbox confirmation page: **verified fixed for this scenario**.

If the coupon is expired or the setup cannot be completed, output is **inconclusive**, not “not reproduced.” “Not reproduced” means the approved test completed and the claimed failure did not occur, while still recording scope limitations.

## 7. Regression Guard

Users can promote important passing tests to protected workflows, such as registration, login, product creation, dashboard navigation, profile update, or logout. Each has an explicit baseline result and test-definition version.

On a manual rerun, App Doctor compares equivalent required assertions with the baseline. A regression is reported only when a previously passing required assertion now fails or is inconclusive in a way that blocks the workflow. Changed test definitions, materially different environments, or altered test data invalidate comparison and require a new baseline instead of a false regression claim.

**Example:** Login and product creation still pass after a release, but the saved checkout workflow now fails at “submit order.” Output: “Potential regression: checkout passed in baseline run on 12 Oct and failed in this run,” with comparison links and evidence. The user can rerun, investigate, or explicitly replace the baseline after review.

## 8. AI-assisted diagnostics

AI is optional and used after deterministic execution when evidence needs interpretation. It may receive a minimized, redacted package of the failing assertion, sanitized console/network data, selected screenshot reference or content, reproduction steps, and relevant history. It returns a plain-English explanation, confirmed facts, clearly labeled hypotheses, suggested next checks, and a copyable repair prompt.

Example output: confirmed fact—`POST /api/orders` returned 500 during the failed action; possible cause—server validation may reject the discount payload; next step—inspect server logs for the correlated request. If evidence is weak or the provider is unavailable, the report says so and preserves the deterministic evidence without inventing a diagnosis.

## 9. Dashboard and reporting

The dashboard shows owned applications, recent runs, queued/running/completed status, pass/fail/skipped/inconclusive counts, open bugs, regression alerts, saved tests, and a simple application-health trend. A run detail page explains what was checked, what was not checked, each result, evidence access, and recommended next action. Filters, pagination, and retention notices keep history usable.

Artifacts are private to authorized project members and opened through time-limited access, not public URLs. Credentials, tokens, sensitive form values, and raw secrets are redacted from UI, logs, artifacts, and AI requests.

## 10. Expected user journey

1. Create an account and sign in.
2. Register an authorized staging or public application.
3. Run a first Health Scan and read its bounded summary.
4. Open failed checks and evidence.
5. Submit a bug with expected behavior and prerequisites.
6. Review/approve its repeatable reproduction test and run it.
7. Apply a repair outside App Doctor, then rerun verification.
8. Save key passing flows as Regression Guard tests and rerun them after future changes.

## 11. Expected system behavior

Runs are asynchronous, cancellable, time-bounded, and isolated. The product updates progress honestly; it does not show a pass before the worker persists a final result. A cancelled or crashed job preserves partial evidence and is marked accordingly. The user can distinguish a platform execution problem from an observed app problem.

The system rejects unsafe/unverifiable targets, prevents access to private or metadata networks, limits browser and queue resources, and requires explicit authorization for side effects. It should guide users toward staging environments and dedicated accounts.

## 12. MVP limitations and deferred work

The MVP has manual test starts and configuration, public/explicitly permitted targets, a small set of safe checks, user-reviewed test definitions, and a single-user ownership model (with future collaboration designed but not required). Defer GitHub connection/webhooks, deployment triggers, source-code-aware analysis, visual-diff testing, mobile/native testing, broad authenticated SSO, multi-region workers, automatic test authoring without review, code writing, and automatic rollback.

## 13. Success criteria

The MVP succeeds when a new user can register an authorized staging application, complete a first scan, understand a failure from evidence, create/re-run a focused verification, and identify a changed result against a saved baseline without needing testing expertise. Product measures include successful first-run completion, time from submission to understandable result, reproducible-bug rate, regression-test reuse, false-positive feedback, queue reliability, and diagnostic usefulness feedback. No metric permits weakening target safety or evidence standards.
