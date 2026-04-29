# Git Workflow

## Why this workflow

- Protect production (`main`).
- Keep ongoing work in `develop`.
- Keep changes reviewable via PRs.

## Branches

- `main`: production-only
  - Always releasable
  - Only merges from `develop`
- `develop`: integration
  - PR target for normal work

## Daily workflow

1. Create a branch from `develop`:
   - `git checkout develop`
   - `git pull`
   - `git checkout -b feat/<scope>`
2. Commit small increments:
   - Prefer “checkpoint commits” over huge commits.
3. Open PR → target `develop`.
4. After CI + review → squash-merge.

## Release workflow

1. Create release PR from `develop` → `main`.
2. Merge to `main`.
3. Tag release (example): `v0.1.0`.

## Line endings (Windows note)

- Avoid noisy diffs from CRLF/LF by using a repo-wide `.gitattributes` policy.
- If you already have mixed line endings, normalize in a dedicated PR to avoid conflicts.
