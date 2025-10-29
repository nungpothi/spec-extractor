# Repository Guidelines

## Project Structure & Module Organization
- Root npm workspace with `frontend/` (React + Vite) and `backend/` (Express + TypeORM). Key frontend dirs: `src/components`, `src/pages`, `src/stores`; backend layers span `domain/`, `usecases/`, `infrastructure/`, and `interface/`.
- Shared assets include `database_schema.sql`, JSON samples (`sample-spec.json`, `test.json`), and generated PDFs in `storage/pdfs`.
- Automation helpers live at the root: `dev-start.sh`, Docker compose files, and the `Makefile` for container workflows.

## Build, Test, and Development Commands
- `npm run dev` — launch both services (frontend :3000, backend :8000) via concurrently.
- `npm run dev:frontend` / `npm run dev:backend` — target one workspace for focused development.
- `npm run build` — compile Vite and TypeScript outputs; run before shipping or building images.
- `npm start` — serve the compiled backend from `backend/dist`.
- Database tasks (from `backend/`): `npm run migration:generate`, `npm run migration:run`, `npm run schema:sync`, `npm run schema:drop`.

## Coding Style & Naming Conventions
- TypeScript throughout with 2-space indentation, single quotes, trailing commas, and grouped imports.
- React components in PascalCase files, hooks/Zustand stores in camelCase, backend services and use cases matching their directory names.
- Frontend linting: `cd frontend && npm run lint` (ESLint + TypeScript). Resolve or justify every warning before pushing.
- Respect clean-architecture seams—business rules stay in `domain/` and `usecases/`, controllers in `interface/`, adapters in `infrastructure/`.

## Testing Guidelines
- No automated suite exists yet; at minimum run `npm run build` and manually exercise spec creation, preview, and PDF export before merging.
- New tests should sit beside source as `*.test.ts[x]`; expose run scripts in the owning `package.json` (Vitest for UI, Jest or supertest for API).
- Pair schema tweaks with reversible migrations and run `npm run migration:run` against a database seeded via `database_schema.sql`.

## Commit & Pull Request Guidelines
- Commits follow short, imperative subjects (`Integrate PDF feature`, `Update PDF generation`) and focus on one concern.
- PRs must explain motivation, outline the approach, note migrations or env var changes, and document local verification (commands, UI screenshots).
- Request review after checks pass and flag any manual follow-up such as clearing `storage/pdfs`.

## Environment & Configuration
- Copy `backend/.env.example` to `backend/.env`; supply database credentials, allowed origins, and Puppeteer settings without committing secrets.
- PostgreSQL 14+ is assumed. Initialize with `database_schema.sql` or use Docker Compose when local services are unavailable.
- Keep `storage/` writable and purge obsolete PDFs during deployments to avoid leaking user data.
