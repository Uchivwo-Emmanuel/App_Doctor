# App Doctor Diagnostic Chat Page — Frontend Plan

## Purpose

Create an authenticated App Doctor diagnostic workspace inspired by the supplied `Chat02` reference: a focused conversation-like interface in which a user asks about a failed test and receives evidence-backed diagnostic guidance. It borrows the interaction clarity of ChatGPT-style chat, but is an original product page, not a clone and not a general-purpose chatbot.

This is a plan only. It does not author the React component, backend API, or AI integration.

## Route and app context

Primary route: `/applications/:applicationId/runs/:runId/diagnostics`

Required context before the page renders:

- Authenticated user and ownership/authorisation check.
- Selected application and environment.
- A completed or terminal test run; queued/running tests instead show their run-progress page.
- Optional selected failed or inconclusive result.

The workspace sidebar belongs to the authenticated app shell and contains the application switcher, Dashboard, Test runs, Bugs, Regression Guard, and Settings. The diagnostic page owns the main conversation area.

## Design direction

Use the Chat02 reference’s spacious centre column, restrained user/assistant differentiation, composer, message actions, and bottom anchoring. Replace all generic AI controls and model-selection language with App Doctor concepts.

- User messages: questions or supplied reproduction details.
- Assistant messages: structured App Doctor diagnostic reports.
- Evidence is always visible or one click away; confirmed facts are visually distinct from hypotheses.
- No microphone, web-search, arbitrary model picker, “thinking level,” fake streaming, or general knowledge sample content in the MVP.
- Do not imitate ChatGPT branding, exact icons, text, colours, or behaviour.

## Main-page composition

1. **Context header** — application name, environment badge, run ID/date, terminal outcome, and link back to run details.
2. **Evidence summary rail/card** — selected failing assertion, screenshot thumbnail, console/network counts, and `View full evidence` action.
3. **Conversation viewport** — chronological user questions and App Doctor responses; empty state directs user to select a failure or request a diagnostic.
4. **Assistant report message** — plain-English summary; Confirmed observations; Possible causes; Recommended next steps; a copyable repair prompt; limitations/uncertainty.
5. **Message actions** — copy, helpful/not-helpful feedback, regenerate only when safe/allowed, open evidence. No unimplemented icons.
6. **Composer** — text area with `Ask about this result` placeholder, optional approved screenshot/diagnostic attachment in a later release, and send button.
7. **Right detail drawer on large screens (optional)** — current evidence/artifact list; on mobile, this becomes a dialog/sheet.

## Conversation data contract

The frontend must treat diagnostic content as structured evidence, not untrusted free-form HTML.

```ts
type DiagnosticMessage = {
  id: string;
  role: "user" | "assistant";
  createdAt: string;
  question?: string;
  report?: {
    summary: string;
    confirmedObservations: Array<{ text: string; resultId?: string }>;
    hypotheses: Array<{ text: string; confidence: "low" | "medium" | "high" }>;
    recommendedActions: string[];
    repairPrompt?: string;
    limitations: string[];
    diagnosticStatus: "complete" | "unavailable" | "insufficient_evidence";
  };
};
```

The backend provides authorised run/result metadata and short-lived artifact access separately. The client never receives credentials, raw cookies, unredacted headers, provider API keys, or a general AI model-control surface.

## States

| State | Page behaviour |
|---|---|
| Loading | Skeleton for context, evidence card, and messages; composer disabled. |
| No diagnosis yet | Explain what diagnostic analysis will use and offer `Generate diagnostic` if policy permits. |
| Complete | Render structured report with evidence links and explicit uncertainty labels. |
| Insufficient evidence | Explain what was missing and invite authorised reproduction details. |
| AI unavailable | Preserve deterministic test evidence and offer retry later; do not fabricate analysis. |
| Unauthorized/not found | Show safe generic state; do not reveal application existence. |
| Run still active | Link to live run progress and defer diagnostics. |

## Component plan

```text
src/
  features/diagnostics/
    components/
      diagnostic-context-header.tsx
      evidence-summary.tsx
      diagnostic-thread.tsx
      diagnostic-report.tsx
      evidence-observations.tsx
      hypotheses-list.tsx
      repair-prompt-card.tsx
      diagnostic-composer.tsx
      diagnostic-feedback-actions.tsx
    diagnostic-chat-page.tsx
```

Shared primitives live in `src/components/ui/`: `Button`, `Textarea`, `DropdownMenu`, `Sheet`/`Dialog`, `ScrollArea`, `Badge`, and `Tooltip`. Build the product-specific message bubble, report, and scrolling logic in the diagnostics feature rather than copying the reference’s `chat-02-utils` files verbatim.

## Reference-component adaptation

Keep: scroll-to-latest behaviour, keyboard-safe multiline composer, user-message editing before re-send, copy action, response feedback, responsive compact controls, and reduced-motion support.

Replace/remove: Venus seed conversation, simulated word-by-word responses, model list, reasoning-level selector, microphone behaviour, generic “search the web,” photo attachment, stop button, and any unsupported menu action. Real diagnostic execution is asynchronous: enqueue the request, show an honest pending state, then add a completed structured report after backend confirmation.

The pasted component requires `@tabler/icons-react`, Radix dropdown dependencies, shadcn primitives, `lucide-react`, `class-variance-authority`, and `@radix-ui/react-slot`. For App Doctor, standardise on `lucide-react` and shadcn primitives; add a dependency only when an approved interaction requires it. Avoid duplicate icon libraries.

## Responsive and accessibility requirements

- The message column remains readable (`max-width` near 42–48rem) and does not force horizontal scrolling.
- On mobile, sidebar and evidence drawer become accessible sheets; composer remains reachable above safe-area space.
- Each message is semantically labelled by speaker; status badges include text, not only colour; buttons have names/tooltips; focus returns predictably after dialogs and copy actions.
- Respect `prefers-reduced-motion`; announce asynchronous completion/errors with an `aria-live` region without reading the entire response repeatedly.

## Privacy and content safety

Render markdown/text with sanitisation and no arbitrary HTML. Redact sensitive values in UI as a defence in depth measure. Show explicit evidence scope and diagnostic limitations. Copying a repair prompt must copy only the approved, redacted prompt. Artifact links are requested after user authorisation and expire quickly.

## Acceptance criteria

- An authorised user can understand which application/run/result the conversation concerns.
- A completed report separates confirmed observations, hypotheses, recommended actions, and limitations.
- The page never claims a root cause or verified fix without supporting run/result evidence.
- Unavailable/insufficient AI outcomes are useful and honest.
- The page is responsive, keyboard operable, accessible, and visually distinct from ChatGPT while retaining the requested focused chat-workspace feel.
