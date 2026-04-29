# Frontend Roadmap

## Product assumptions (to validate)

- Users may be first-time visitors, stressed, and time-constrained.
- Mixed literacy: UI must work with minimal reading.
- Kiosk usage: large touch targets, short steps, high contrast.
- Three languages initially; content must be swappable per language.

## UX principles we’ll apply (from lawsofux.com)

- Hick’s Law: reduce options; show 1–3 suggestions.
- Chunking + Cognitive Load: step-by-step flow; one decision per screen.
- Fitts’s Law: large primary buttons; avoid tiny targets.
- Goal-Gradient Effect: show clear progress through steps.
- Jakob’s Law: familiar patterns (wizard, clear CTAs).
- Aesthetic-Usability Effect: clean, consistent visual system.
- Serial Position + Peak-End Rule: strongest clarity at start and finish.

## Development workflow (professional)

- Trunk-based with short-lived feature branches (recommended):
  - Branch names like `feat/ui-shell`, `feat/wizard-flow`.
  - PR per checkpoint; small reviewable diffs.
  - `main` is releasable; merge only when checkpoint passes.
- Definition of Done per checkpoint:
  - Works at `pnpm dev` with no console errors.
  - Responsive on mobile/tablet/desktop.
  - Light/dark mode looks correct.
  - Basic a11y: focus visible, labels present.

## Checkpoints

- Checkpoint 1: shadcn/ui + tokens + app shell + wizard scaffold.
- Checkpoint 2: full UI flow with mock service data and validations.
- Checkpoint 3: a11y + kiosk ergonomics + loading/error states.
