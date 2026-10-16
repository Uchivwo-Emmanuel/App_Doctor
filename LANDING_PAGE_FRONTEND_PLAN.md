# App Doctor Landing Page — Frontend Plan

## Purpose

Create the public App Doctor landing page: a focused introduction that explains independent AI-assisted application testing and leads visitors to create an account or begin an authorised Health Scan. The supplied `Hero14` reference establishes the desired visual rhythm: centred copy, two calls to action, a prominent product preview, restrained motion, and a light trust row.

This is a plan only. It does not author the React component or install dependencies.

## Design direction

Use the Hero14 layout as an inspiration, not as a literal copy. App Doctor should feel calm, technical, and trustworthy rather than like a generic AI marketing page.

- Neutral, high-contrast base with one purposeful accent colour (initial proposal: deep indigo or teal).
- Generous whitespace, large clear headline, compact supporting copy.
- Rounded but not overly bubbly surfaces; subtle borders and shadows.
- Avoid stock landscape imagery, animated decorative effects, fabricated customer logos, or promises that the product can prove an app is bug-free.
- Respect reduced-motion settings. Motion is a brief optional reveal only, never needed to understand content.

## Route and composition

Route: `/`

1. **Header** — App Doctor wordmark; navigation to How it works, What we test, Security, and Sign in; primary button: `Start a health scan`.
2. **Hero** — product promise, supporting statement, two CTAs, and live-looking but clearly illustrative product preview.
3. **Trust/clarity strip** — `Independent verification`, `Evidence-based reports`, `Safe testing controls`.
4. **How it works** — three steps: add an authorised app, run a bounded test, review evidence and rerun after a fix.
5. **Capability cards** — App Health Scan, Bug Verification, Regression Guard.
6. **Example report preview** — show Pass, Failed, Inconclusive, and Hypothesis labels; reinforce that browser evidence is not a universal correctness guarantee.
7. **Security statement** — permitted targets, protected evidence, test accounts/staging recommendation.
8. **Final call to action** — account/start-scan action and sign-in link.
9. **Footer** — product links, support, privacy, and terms placeholders.

## Hero content

| Element | Proposed MVP content |
|---|---|
| Eyebrow | `Independent QA for AI-built web apps` |
| Heading | `Know what works before you ship.` |
| Description | `App Doctor runs repeatable browser checks, captures evidence, and helps you verify fixes—without pretending your app is bug-free.` |
| Primary CTA | `Start a health scan` → sign-up/onboarding when unauthenticated; application creation when authenticated. |
| Secondary CTA | `See how it works` → scrolls to the workflow section. |
| Product preview | A purpose-built static dashboard mockup: one application, scan status, result totals, and a visible failing checkout check. |

The Hero14 reference accepts title, description, CTA props, image, logos, animation, and variant. During implementation, replace its image-background/`BlockBuilderDemo` treatment with the App Doctor product preview. Do not ship the reference meadow image, generic block-builder copy, or invented logo row.

## Component plan

Suggested page components:

```text
src/
  features/marketing/
    components/
      marketing-header.tsx
      landing-hero.tsx
      app-doctor-preview.tsx
      workflow-steps.tsx
      capability-card.tsx
      result-status-example.tsx
      security-note.tsx
      marketing-footer.tsx
    landing-page.tsx
```

Reusable primitives belong in the shadcn convention `src/components/ui/`; feature-specific composition stays under `src/features/marketing/`. This avoids turning a single external reference into a permanent global component.

## Dependencies and setup prerequisites

The future app must use React, TypeScript, Tailwind CSS, and shadcn/ui-style primitives. Initialise shadcn only after the Vite/Tailwind project exists. Required primitives are expected to include `Button`, `Card`, `Badge`, and optionally `Separator`.

The supplied reference uses `motion/react`, `react-wrap-balancer`, `@radix-ui/react-slot`, and `class-variance-authority`. Only add `motion` and `react-wrap-balancer` if the approved design actually uses the reveal animation and balanced heading. `@radix-ui/react-slot` and `class-variance-authority` normally arrive through shadcn primitives. Use one icon library consistently—prefer `lucide-react` for this application.

## Responsive and accessible behaviour

- Desktop: full navigation and wide two-column product preview.
- Tablet: keep hierarchy, reduce preview density, wrap header actions.
- Mobile: collapse navigation into an accessible menu; stack CTAs; preserve readable preview without horizontal scrolling.
- One visible H1; semantic landmark structure; descriptive CTA labels; keyboard-visible focus; status does not rely on colour alone; motion responds to `prefers-reduced-motion`.

## Data and state

This public page needs no server data in its first iteration. Authentication state only changes primary-CTA destination. Product-preview values are explicit illustrative UI data, isolated from real test results. Analytics, if later approved, records CTA intent without test/application data.

## Acceptance criteria

- A visitor understands App Doctor’s purpose and limits within the hero section.
- Primary and secondary CTAs have working, distinct destinations.
- The preview visually communicates health checks and evidence-based results without misleading claims.
- The page is responsive, keyboard usable, and renders cleanly with JavaScript motion disabled.
- No external stock image, invented client logo, or reference-specific copy remains.
