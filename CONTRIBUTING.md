# Contributing

## Branching strategy (pragmatic GitFlow-lite)

- `main`: production-only.
  - Merge into `main` only from `develop`.
  - Use tags for releases (e.g. `v0.1.0`).
- `develop`: integration branch.
  - Default target for feature PRs.
  - Must stay green (CI passing).

### Branch naming

- `feat/<short-scope>`
- `fix/<short-scope>`
- `chore/<short-scope>`
- `docs/<short-scope>`

Examples:

- `feat/service-wizard-matching`
- `chore/ci-workflow`

## Local dev

- Install: `pnpm install`
- Dev: `pnpm dev`
- Lint: `pnpm lint`
- Build: `pnpm build`

## Pull requests

- Keep PRs small (one checkpoint / one concern).
- Prefer squash-merge into `develop`.
- PR must include:
  - What changed and why
  - Screenshots for UI changes
  - Notes about any follow-up work

## Definition of Done (UI)

- No console errors
- Keyboard accessible basics (focus visible, labels)
- Works in light and dark mode
- Responsive across common sizes
