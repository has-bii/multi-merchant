# APP (Frontend) — PROJECT KNOWLEDGE BASE

**Generated:** 2026-05-19

## STRUCTURE
```
app/
├── src/
│   ├── routes/             # TanStack Router file-based routes
│   │   ├── __root.tsx
│   │   ├── _authenticated.tsx    # Auth guard layout
│   │   ├── _authenticated/index.tsx
│   │   ├── _auth.tsx            # Unauthenticated layout
│   │   └── _auth/login.tsx
│   ├── features/           # Feature modules (schemas, components, hooks)
│   │   └── auth/
│   ├── components/ui/     # shadcn/ui components
│   ├── lib/                # Utilities + auth client
│   │   ├── utils.ts
│   │   └── auth-client.ts
│   ├── auth.tsx            # AuthProvider context
│   ├── app.tsx             # App root (AuthProvider → RouterProvider)
│   ├── main.tsx            # Entry point
│   ├── router.tsx          # Router config
│   ├── routeTree.gen.ts    # Auto-generated route tree
│   ├── types.ts            # Router context types
│   └── styles.css          # Tailwind + shadcn theme
├── components.json         # shadcn config (radix-vega style)
├── vite.config.ts          # Vite + React Compiler + Tailwind + TanStack Router plugin
├── eslint.config.js        # @tanstack/eslint-config
├── .prettierrc              # Prettier + import sorting
└── tsconfig.json            # Strict, ES2022, @/* paths
```

## COMMANDS
| Action | Command |
|--------|---------|
| Install | `pnpm install` |
| Dev | `pnpm dev` (port 5173) |
| Build | `pnpm build` |
| Test | `pnpm test` (vitest) |
| Lint | `pnpm lint` |
| Format | `pnpm format` |

## CODING STANDARDS
- **Language**: TypeScript (strict mode, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`)
- **Style**: Prettier (`printWidth: 100`, `semi: false`) + `@trivago/prettier-plugin-sort-imports`
- **Lint**: `@tanstack/eslint-config`
- **Imports**: Path alias `@/*` → `./src/*`
- **Framework**: TanStack Router file-based routing, route context for auth, feature-folder structure
- **UI**: shadcn/ui (radix-vega style), Tailwind CSS v4, Inter Variable font
- **Validation**: Zod v4 (import from `zod/v4`)
- **React Compiler**: Enabled via `babel-plugin-react-compiler`

## WHERE TO LOOK
- **Routes**: `src/routes/`
- **Features**: `src/features/`
- **UI components**: `src/components/ui/`
- **Auth client**: `src/lib/auth-client.ts`
- **Auth provider**: `src/auth.tsx`
- **Router config**: `src/router.tsx`

## NOTES
- **Auth flow**: `AuthProvider` wraps `RouterProvider`. Authenticated routes check `context.auth.isAuthenticated` in `beforeLoad`, redirect to `/login`.
- **React Compiler**: Active. Auto-optimizes re-renders. Don't wrap with `useMemo`/`useCallback` unnecessarily.
- **TanStack Router**: Route tree auto-generated (`routeTree.gen.ts`). Run dev server to regenerate after route file changes.
- **Language**: UI strings in Indonesian (e.g., validation messages: "Email tidak valid", "Password minimal 6 karakter").
- **Monorepo**: Separate `pnpm-lock.yaml`, `package.json`, `.env`. Run commands from `app/` directory.