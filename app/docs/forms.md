# Forms

## Pattern: Schema → Hook → Component

Forms follow a 3-layer pattern across the feature module:

```
schemas/{name}-form.schema.ts   →   hooks/use-{name}-form.ts   →   components/{name}-form.tsx
```

## 1. Schema

Zod v4 schema in `schemas/`. Import from `zod/v4`.

```ts
import { z } from "zod/v4"

export const productHetFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  price: z.string().min(1, "Harga wajib diisi"),
})

export type ProductHetFormValues = z.infer<typeof productHetFormSchema>
```

- Export schema + inferred type
- Validation messages in **Indonesian**
- Form schemas separate from search/API schemas

## 2. Hook

`useForm` from `@tanstack/react-form`. Validation via `onSubmit` only.

```ts
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState } from "react"

import { productHetFormSchema } from "../schemas/product-het-form.schema"

export function useProductHetForm({ initialData }: Options = {}) {
  const [error, setError] = useState("")
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const isEdit = !!initialData

  const mutation = useMutation({
    mutationFn: async (data: ProductHetFormValues) => { /* ... */ },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productHetKeys.all })
      navigate({ to: "/admin/produk-het" })
    },
  })

  const form = useForm({
    defaultValues: {
      name: initialData?.name ?? "",
      price: initialData?.price != null ? String(initialData.price) : "",
    },
    validators: {
      onSubmit: productHetFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setError("")
        const parsed = productHetFormSchema.parse(value)
        if (isEdit) {
          await updateMutation.mutateAsync(parsed)
        } else {
          await createMutation.mutateAsync(parsed)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan")
      }
    },
  })

  return { form, error, isEdit }
}
```

Key conventions:
- **`validators: { onSubmit: schema }`** — validate on submit only. Do not use `onChange` validators.
- **`useState` for error** — top-level form error displayed in `<Alert>`
- **`isEdit` flag** — derived from `initialData`, toggles create vs update mutation
- **`navigate` on success** — redirect to list page after mutation
- **`invalidateQueries`** — refresh list data after mutation
- **`try/catch`** in `onSubmit` — catch API errors, set `error` state

## 3. Component

Form component consumes the hook. Uses `form.Field` with render props.

```tsx
export function ProductHetForm({ initialData }: ProductHetFormProps) {
  const { form, error, isEdit } = useProductHetForm({ initialData })

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
      <FieldGroup>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Gagal</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form.Field
          name="name"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Nama</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  data-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Subscribe
          selector={({ canSubmit, isDirty, isSubmitting }) => [canSubmit, isDirty, isSubmitting]}
          children={([canSubmit, isDirty, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit || !isDirty || isSubmitting}>
              {isSubmitting ? "Menyimpan..." : isEdit ? "Perbarui" : "Simpan"}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  )
}
```

Field rendering conventions:
- **`isTouched && !isValid`** for invalid state — don't show errors before interaction
- **`data-invalid`** on `<Field>` and `<Input>` — drives CSS validation styles
- **`<FieldError>`** — renders Zod error messages
- **`<form.Subscribe>`** for submit button — only re-renders button when `canSubmit`/`isDirty`/`isSubmitting` change
- **`e.preventDefault()` + `form.handleSubmit()`** on form submit
- **`htmlFor`** on `<FieldLabel>` matches `id` on `<Input>` — accessibility

## Edit vs Create

Same component + hook handles both:
- Pass `initialData` prop for edit mode
- Hook detects `isEdit = !!initialData`
- `defaultValues` populated from `initialData` when editing
- Button text: "Simpan" (create) / "Perbarui" (edit)
