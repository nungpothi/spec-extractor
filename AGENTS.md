# Repository Guidelines

## Project Structure & Module Organization
Workspace uses two npm workspaces: `client/` (React + Vite) and `server/` (Express + TypeScript). Frontend code lives in `client/src` with components and Tailwind styling. Backend logic sits in `server/src` across `routes/`, `services/`, `entities/`, and `utils/`, compiling to `server/dist`. Generated uploads land in `data/uploads` (gitignored).

## Build, Test, and Development Commands
- `npm run dev`: launch Vite (5173) and API (3001) together with hot reload.
- `npm run dev:client` / `npm run dev:server`: run either workspace in isolation.
- `npm run build`: type-check and build both workspaces, then boot the compiled server.
- `npm run start`: serve the latest production build via `server/dist/index.js`.
- `npm --prefix client run preview`: inspect the built frontend against the compiled API.

## Coding Style & Naming Conventions
Stick to TypeScript; avoid plain JS. Maintain two-space indentation, single quotes, trailing commas where valid. React components and hooks use PascalCase, utility helpers use camelCase. Prefer descriptive async names (`compilePrompt`, `requestSpecification`) and colocate component styles with their owners. Keep environment-aware logic in `server/src/services` or `utils` helpers.

## Testing Guidelines
No automated suite yet—exercise `/api/compile-prompt` through the UI and watch server logs. Add frontend specs under `client/src/__tests__` (Vitest) and backend specs under `server/src/__tests__` (Jest or Vitest). Mock external AI providers; never hit live endpoints in CI.

## Commit & Pull Request Guidelines
History uses Conventional Commits (`feat:`, `chore:`). Keep subject lines under 72 characters and describe scope succinctly. For PRs, link the relevant issue, summarize the change set, call out env variable updates, and attach screenshots or console output when UI or API behavior shifts. Ensure the branch is rebased on main, CI status is green, and new configuration docs or prompts are included in the same review.

## Security & Configuration Tips
Store secrets in `.env` files that remain untracked. Set `LLM_PROVIDER` plus the corresponding key (`OPENAI_API_KEY`, `OPENROUTER_API_KEY`, or `OLLAMA_ENDPOINT`), along with `DATABASE_URL` for PostgreSQL. Run `npm run start` locally once after rotating keys to confirm connectivity. Never commit generated specs or user uploads; scrub `data/uploads` before pushing.

## prompt-compiler
- purpose: Convert human natural language requirements into full developer specifications.
- input: userText, sessionId
- output: summary, uiMock, apiSpec, dbSchema
- database: conversation_history
- language: English (accepts Thai input)
- logic:
  - Store conversation to DB
  - Call configured LLM provider
  - Return structured result for frontend rendering
- prompt: ./PROMPTS/prompt-compiler.md
