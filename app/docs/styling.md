# Styling

## Tailwind CSS v4

No `tailwind.config.ts` — configuration is in `src/styles.css` via `@theme inline` and CSS custom properties.

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/inter";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: "Inter Variable", sans-serif;
  /* ... CSS variable mappings ... */
}
```

- **Dark mode:** class-based (`@custom-variant dark`)
- **Font:** Inter Variable via `@fontsource-variable/inter`
- **Animations:** `tw-animate-css` for shadcn transitions

## shadcn/ui Theme

Neutral base color, CSS variables for all design tokens. Defined in `:root` and `.dark` in `styles.css`.

Key tokens: `--background`, `--foreground`, `--primary`, `--destructive`, `--border`, `--radius`, sidebar tokens.

**Don't edit `components/ui/` component styles directly.** Override via CSS variables or `className` props.

## Container Queries

Project uses **container queries** for responsive layouts within the sidebar context, not viewport breakpoints.

```tsx
// Visible only below lg container breakpoint (mobile)
<HeaderBack className="@lg/main:hidden" />

// Visible only at lg container breakpoint and above (desktop)
<HeaderBreadcrumb className="hidden @lg/main:flex" />
```

The `@lg/main:` prefix targets the `main` container (sidebar inset area), not the viewport. This keeps layouts responsive within the sidebar context.

**Prefer container queries over viewport breakpoints** (`md:`, `lg:`) for content inside the sidebar layout.

## Prettier

Config in `.prettierrc`:

```json
{
  "printWidth": 100,
  "semi": false,
  "trailingComma": "all",
  "plugins": ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"]
}
```

### Import Order

Imports are auto-sorted into 3 groups:

1. **`@/*`** — project imports (alias paths)
2. **Third-party** — external packages
3. **Relative** — `./` and `../` imports

Groups are separated by blank lines. This is enforced by `@trivago/prettier-plugin-sort-imports`.

```ts
// 1. Project imports
import { Button } from "@/components/ui/button"
import { useListState } from "@/hooks/use-list-state"

// 2. Third-party
import { useNavigate } from "@tanstack/react-router"
import { Trash2 } from "lucide-react"

// 3. Relative
import { useProductHetForm } from "../hooks/use-product-het-form"
```

## ESLint

Uses `@tanstack/eslint-config` with overrides in `eslint.config.js`:

- `import/no-cycle: off`
- `import/order: off` (handled by Prettier)
- `@typescript-eslint/array-type: off`
- `@typescript-eslint/require-await: off`

## Class Name Utilities

`cn()` from `src/lib/utils.ts` — merges Tailwind classes with conflict resolution:

```ts
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Always use `cn()` when conditionally applying classes.

## Tailwind CSS Class Sorting

`prettier-plugin-tailwindcss` auto-sorts Tailwind classes. Don't sort manually — Prettier handles it.

## UI Strings

All user-facing strings are in **Indonesian** (e.g., "Menyimpan...", "Gagal memuat data", "Cari produk..."). Validation messages in Zod schemas are also Indonesian.
