# Repository Guidelines

## Project Structure & Module Organization

This repository is a TypeScript/Express backend for blogs, posts, users, comments, authentication, and security devices. Application code lives in `src/`. Feature code is grouped under `src/modules/<feature>/`, usually with `handlers/`, `service/`, `repository/`, `mappers/`, `types/`, and `middlewares/`. Express routers are in `src/routers/`; shared middleware, adapters, types, and utilities are in `src/core/`. MongoDB setup is in `src/db/`. End-to-end tests and reusable test helpers live in `__tests__/e2e/` and `__tests__/utils/`.

## Build, Test, and Development Commands

Use Node.js 20.19+ and pnpm 10.

- `pnpm dev` starts the development server; its predev hook starts MongoDB with Docker Compose.
- `pnpm test` runs Jest in test mode. Tests use Supertest and an in-memory MongoDB server.
- `pnpm typecheck` runs TypeScript without emitting files.
- `pnpm build` compiles the production sources using `tsconfig.build.json`.
- `pnpm lint` runs ESLint; `pnpm format:check` checks Prettier formatting.
- `pnpm start` runs the compiled app from `dist/`.

## Coding Style & Naming Conventions

Write TypeScript using the existing feature-module layout and two-space formatting enforced by Prettier. Use camelCase for variables and functions, PascalCase for types, and descriptive kebab-case filenames such as `get-all-users.handler.ts`. Keep HTTP handling in handlers, business rules in services, persistence in repositories, and response shaping in mappers. Validate request data with the existing Zod middleware patterns. Update Swagger definitions in the relevant module's `docs/` when changing an API contract.

## Testing Guidelines

Use Jest with Supertest for API behavior. Name suites `*.spec.ts` and place them under `__tests__/e2e/<feature>/`; put shared request helpers and test data builders under `__tests__/utils/`. Follow nearby tests: initialize isolated database state with `setupDbLifecycle()`, assert HTTP status and response shape, and cover authentication, validation, and relevant not-found or ownership cases. Run a focused spec with `pnpm test -- --runInBand __tests__/e2e/<feature>/<file>.spec.ts`.

## Commit & Pull Request Guidelines

Recent commits use short, lowercase, imperative summaries (for example, `add user sessions` and `refactor with validData/rm locals`). Keep commits focused and follow that style. Pull requests should explain the behavior change, link the relevant issue or task, and list validation commands and results. Include request/response examples or screenshots only when they help reviewers understand an API or user-visible change.

## Security & Configuration

Copy `.env.example` to `.env` for local configuration. Keep secrets out of source control; production settings belong in the deployment environment. Use the test environment for automated tests and avoid pointing tests at a development or production database.
