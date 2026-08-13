---
name: "[Feature] Frontend implementation"
about: A frontend build task in rezzident_FE, implementing an approved Figma design.
title: "[Feature]: "
labels: ["frontend", "needs-triage"]
assignees: []
---

### Directory
RezzidentEcosystem/apps/rezzident_FE
<!-- narrow it further if useful, e.g. RezzidentEcosystem/apps/rezzident_FE/src/features/onboarding -->

### Design ref
Closes design task: #<design issue number>
<!-- Every frontend feature issue should point back to the design issue it implements.
     If there is no design issue (pure technical/infra work), write "N/A — no design required". -->

### Description
<!--
What is being built, in plain language, and what "UI-only" vs "wired to a
real API" means for this ticket if relevant. State the entry point (where in
the app does the user reach this) and the exit point (what happens on
completion/submit).
-->

### User Story
As a **[persona]**, I want to **[goal]**, so that **[benefit]**.

### Requirements
<!--
- Entry point: where this flow/screen is reached from.
- List every screen/state covered, referencing the Figma file — "build to
  match Figma exactly, not to this ticket's summary" is the standard here.
- Call out any shared UI primitives required (Button, Input, Select,
  AlertBox, ProgressStepper, FileUpload, Carousel, etc.) — these MUST live in
  `shared/components/ui` and be reused, not re-implemented locally.
- Call out any screen-specific component that is NOT reusable — it stays
  scoped to its own feature folder.
- State data/state requirements: does state persist across steps/screens
  client-side? Is this wired to a live API or mocked?
-->
-
-
-

### Acceptance Criteria
- [ ] Every screen/state in the Figma file is implemented and matches spacing, typography, and interaction states (default, focus, error, disabled).
- [ ] Navigation preserves previously entered data where applicable.
- [ ] All generic UI elements used are sourced from `shared/components/ui`; no duplicate local buttons/inputs/alerts.
- [ ] Any screen-specific component is scoped to its own screen/feature folder, not shared.
- [ ] Responsive per Figma (mobile-first, as shown in screens).
- [ ] No console errors/warnings introduced.
- [ ] Entry point (CTA/route) correctly routes into this flow.

### Expected Outcome
<!-- One paragraph describing the fully working, clickable result. -->

### Links
| [`FIGMA LINK`] ()
| Design issue: #

### Images
<!-- Drag in the relevant Figma screenshots -->