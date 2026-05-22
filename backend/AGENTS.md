# BACKEND (API) — PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-19
**Updated:** 2026-05-23

## STRUCTURE
```
backend/
├── src/
│   ├── modules/                    # Feature modules (layered)
│   │   └── product-het/
│   │       ├── index.ts            # Route composition (CRUD + sub-module)
│   │       ├── schema.ts           # Zod schemas + z.infer DTO types
│   │       ├── service.ts          # Business logic + DB access (abstract class)
│   │       ├── route.ts            # HTTP wiring (CRUD)
│   │       └── import/             # Sub-module: bulk import
│   │           ├── schema.ts       # Import schemas + z.infer types
│   │           ├── types.ts        # Residual types (not z.infer-able)
│   │           ├── service.ts      # Import logic (abstract class)
│   │           └── route.ts        # Import routes
│   ├── schemas/
│   │   └── query.schema.ts         # Shared pagination/query base
│   ├── middlewares/
│   │   ├── auth.ts                 # requireAuth, requireAdmin
│   │   ├── session.ts              # Better Auth session
│   │   └── validator.ts            # Shared zValidator (throws HTTPException)
│   ├── lib/
│   │   ├── auth.ts                 # Better Auth config
│   │   ├── db.ts                   # Prisma client (Neon adapter)
│   │   ├── email.ts                # Email sending
│   │   ├── paginate.ts             # Generic paginate<T>()
│   │   └── typed-app.ts            # createApp() with AuthType
│   ├── config/
│   │   └── env.ts                  # Typed env vars
│   ├── app.ts                      # Hono app (CORS, auth, routes)
│   └── dev.ts                      # Dev server entry
├── prisma/
│   ├── schema.prisma               # Prisma schema (models, relations)
│   ├── seed.ts                     # Admin seeder
│   └── migrations/                 # Migration files
├── docs/                           # Architecture documentation
│   ├── MODULES.md                  # Module + sub-module conventions
│   ├── SCHEMA.md                   # Validation + DTO patterns
│   ├── TYPES.md                    # When to use types.ts vs z.infer
│   ├── SERVICE.md                  # Service layer patterns (abstract class)
│   └── ROUTE.md                    # HTTP wiring layer patterns
├── CONTEXT.md                      # Domain glossary + architecture decisions
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
| DB Generate | `pnpm db:generate` (prisma generate) |
| DB Migrate | `pnpm db:migrate` (prisma migrate dev) |
| DB Migrate Prod | `pnpm db:migrate:prod` (prisma migrate deploy) |
| DB Studio | `pnpm db:studio` |
| DB Seed | `pnpm db:seed` |
| DB Push | `pnpm db:push` |

## CODING STANDARDS
- **Language**: TypeScript (strict mode, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`)
- **Style**: Prettier (`printWidth: 100`, `semi: false`) + `@trivago/prettier-plugin-sort-imports`
- **Lint**: No dedicated linter
- **Framework**: Hono with `.basePath("/api")`
- **DB**: Prisma ORM with Neon serverless adapter, `uuid_generate_v7()` for PKs, camelCase columns
- **Validation**: Zod v4 (import from `zod/v4`)
- **Module pattern**: Layered — see [docs/MODULES.md](docs/MODULES.md)

## WHERE TO LOOK
- **Modules**: `src/modules/<name>/` — layered: schema → service → route → index
- **Shared schemas**: `src/schemas/`
- **Shared middlewares**: `srcmiddlewares/`
- **Shared libs**: `src/lib/`
- **Prisma schema**: `prisma/schema.prisma`
- **Auth config**: `src/lib/auth.ts`
- **DB client**: `src/lib/db.ts`
- **Env vars**: `src/config/env.ts`
- **Hono app**: `src/app.ts`
- **Domain glossary**: `CONTEXT.md`

## NOTES
- **Auth**: Better Auth with admin plugin, signup disabled. Admin seeder creates initial user. Cross-subdomain cookies enabled.
- **CORS**: Allows `ORIGIN_ADMIN` and `ORIGIN_CLIENT` origins.
- **Language**: Validation messages in Indonesian.
- **DB Migrations**: Use `prisma migrate dev` (dev) / `prisma migrate deploy` (prod). Neon serverless driver via `@prisma/adapter-neon`.
- **Monorepo**: Separate `pnpm-lock.yaml`, `package.json`, `.env`. Run commands from `backend/` directory.
- **Service pattern**: Abstract class with static methods. No instantiation. DB access lives in service (no separate repository layer).

## DOCUMENTATION
- **Module conventions**: [docs/MODULES.md](docs/MODULES.md) — includes sub-module pattern
- **Schema patterns**: [docs/SCHEMA.md](docs/SCHEMA.md) — z.infer over manual types
- **Types patterns**: [docs/TYPES.md](docs/TYPES.md) — when types.ts vs z.infer
- **Service patterns**: [docs/SERVICE.md](docs/SERVICE.md) — abstract class + static methods
- **Route patterns**: [docs/ROUTE.md](docs/ROUTE.md) — route vs service responsibility split
