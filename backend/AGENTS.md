# BACKEND (API) — PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-19

## STRUCTURE
```
backend/
├── src/
│   ├── modules/                    # Feature modules (layered)
│   │   └── product-het/
│   │       ├── index.ts            # Public export
│   │       ├── schema.ts           # Zod validation + DTO types
│   │       ├── repository.ts       # DB adapter (Drizzle queries)
│   │       ├── service.ts          # Business logic
│   │       └── route.ts            # HTTP wiring
│   ├── schemas/
│   │   └── query.schema.ts         # Shared pagination/query base
│   ├── middlewares/
│   │   ├── auth.ts                 # requireAuth, requireAdmin
│   │   ├── session.ts              # Better Auth session
│   │   └── validator.ts            # Shared zValidator (throws HTTPException)
│   ├── lib/
│   │   ├── auth.ts                 # Better Auth config
│   │   ├── db.ts                   # Drizzle + Neon client
│   │   ├── email.ts                # Email sending
│   │   ├── paginate.ts             # Generic paginate<T>()
│   │   └── typed-app.ts            # createApp() with AuthType
│   ├── db/
│   │   ├── schema.ts               # Centralized Drizzle tables
│   │   └── seed.ts                 # Admin seeder
│   ├── config/
│   │   └── env.ts                  # Typed env vars
│   ├── app.ts                      # Hono app (CORS, auth, routes)
│   └── dev.ts                      # Dev server entry
├── docs/                           # Architecture documentation
│   ├── MODULES.md                  # Module conventions
│   ├── SCHEMA.md                   # Validation + DTO patterns
│   ├── REPOSITORY.md               # DB adapter layer patterns
│   ├── SERVICE.md                   # Business logic layer patterns
│   └── ROUTE.md                     # HTTP wiring layer patterns
├── CONTEXT.md                      # Domain glossary + architecture decisions
├── drizzle/                        # Migration files
├── drizzle.config.ts
├── .prettierrc
├── tsconfig.json
└── .env.example
```

## COMMANDS
| Action | Command |
|--------|---------|
| Install | `pnpm install` |
| Dev | `pnpm dev` (port 3000) |
| Format | `pnpm format` |
| DB Generate | `pnpm db:generate` |
| DB Migrate | `pnpm db:migrate` |
| DB Studio | `pnpm db:studio` |
| DB Seed | `pnpm db:seed` |

## CODING STANDARDS
- **Language**: TypeScript (strict mode, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`)
- **Style**: Prettier (`printWidth: 100`, `semi: false`) + `@trivago/prettier-plugin-sort-imports`
- **Lint**: No dedicated linter
- **Framework**: Hono with `.basePath("/api")`
- **DB**: Drizzle ORM with Neon serverless, `uuid_generate_v7()` for PKs, camelCase columns
- **Validation**: Zod v4 (import from `zod/v4`)
- **Module pattern**: Layered — see [docs/MODULES.md](docs/MODULES.md)

## WHERE TO LOOK
- **Modules**: `src/modules/<name>/` — layered: schema → repository → service → route → index
- **Shared schemas**: `src/schemas/`
- **Shared middlewares**: `src/middlewares/`
- **Shared libs**: `src/lib/`
- **DB schema**: `src/db/schema.ts`
- **Auth config**: `src/lib/auth.ts`
- **DB client**: `src/lib/db.ts`
- **Env vars**: `src/config/env.ts`
- **Hono app**: `src/app.ts`
- **Domain glossary**: `CONTEXT.md`

## NOTES
- **Auth**: Better Auth with admin plugin, signup disabled. Admin seeder creates initial user. Cross-subdomain cookies enabled.
- **CORS**: Allows `ORIGIN_ADMIN` and `ORIGIN_CLIENT` origins.
- **Language**: Validation messages in Indonesian.
- **DB Migrations**: Use `drizzle-kit generate` → `drizzle-kit migrate`. Neon serverless driver.
- **Monorepo**: Separate `pnpm-lock.yaml`, `package.json`, `.env`. Run commands from `backend/` directory.

## DOCUMENTATION
- **Module conventions**: [docs/MODULES.md](docs/MODULES.md)
- **Schema patterns**: [docs/SCHEMA.md](docs/SCHEMA.md)
- **Repository patterns**: [docs/REPOSITORY.md](docs/REPOSITORY.md)
- **Service patterns**: [docs/SERVICE.md](docs/SERVICE.md)
- **Route patterns**: [docs/ROUTE.md](docs/ROUTE.md)