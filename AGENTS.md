# Multi-Merchant — Agent Instructions

Rules for Pi Coding Agent working on this project.

## Project Overview

Multi-merchant backend API built with Hono + TypeScript, deployed to Vercel Edge. Uses Drizzle ORM for database access.

## Tech Stack

- **Runtime**: Vercel Edge (limited Node.js APIs — no `fs`, no `path`, no `child_process` in production code)
- **Framework**: Hono
- **Language**: TypeScript (very strict)
- **ORM**: Drizzle
- **Package manager**: pnpm
- **Entry point**: `backend/src/index.ts`

## TypeScript Strictness

Extend current `tsconfig.json` with:

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
}
```

Never use `any`. Use `unknown` + type guards. Avoid non-null assertions (`!`) — use proper narrowing.

## Project Structure

Feature-based organization. Each domain lives in its own folder under `src/`:

```
src/
  index.ts              # Hono app creation + route mounting
  merchants/
    routes.ts           # Hono sub-app, mounted at /merchants
    service.ts          # Business logic, DB queries via Drizzle
    types.ts            # Input/output types, Zod schemas
  products/
    routes.ts
    service.ts
    types.ts
  middleware/
    auth.ts
    tenant.ts
  db/
    index.ts            # Drizzle client + connection
    schema.ts           # Drizzle table definitions
```

### Rules

- One default export per file (the main thing that file provides)
- Named exports for utilities and types alongside the default
- Routes file = Hono sub-app, mounted in `index.ts`
- Service file = pure business logic, no HTTP concerns
- Types file = Request/response shapes, Zod schemas, Drizzle inferred types
- Shared middleware in `src/middleware/`
- DB schema centralized in `src/db/schema.ts`

## Naming Conventions

| Thing | Style | Example |
|-------|-------|---------|
| Files | kebab-case | `tenant-isolation.ts` |
| Variables/functions | camelCase | `merchantId`, `getMerchant()` |
| Types/interfaces | PascalCase | `Merchant`, `CreateMerchantInput` |
| Constants | SCREAMING_SNAKE | `MAX_PAGE_SIZE` |
| DB tables | snake_case (Drizzle) | `merchants`, `merchant_products` |

## Hono Patterns

- Route organization evolves naturally — start simple, refactor into sub-apps when needed
- Use `app.route('/path', subApp)` for feature groups
- Middleware via `app.use()` — keep middleware thin and composable
- Use Hono built-in validators (`zValidator`) with Zod schemas from `types.ts`

## Drizzle Conventions

- Define all tables in `src/db/schema.ts`
- Use Drizzle query builder, not raw SQL
- Repository pattern via service files — `service.ts` is the only file that imports `db`
- Use Drizzle's relational query API for joins

## Edge Runtime Constraints

Never use these in production code:
- `fs`, `path`, `child_process` — unavailable on Edge
- `setTimeout` / `setInterval` with long durations — Edge limits
- Node-specific globals like `process.env` — use Hono's `c.env` instead
- BigInt — not serializable in Edge JSON

For env vars, use Hono's type-safe env:

```typescript
type Env = {
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
};
```

## Code Style

- No `any` — ever. Use `unknown` with type guards.
- Prefer `const` over `let`. No `var`.
- Early returns over nested ifs.
- Extract functions > 20 lines into named helpers.
- Error handling: Hono `HTTPException` for HTTP errors, typed error responses.
- Avoid non-null assertions (`!`). Use proper type narrowing.

## Git Conventions

- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`
- Subject line ≤ 50 chars
- No committed `.env` files