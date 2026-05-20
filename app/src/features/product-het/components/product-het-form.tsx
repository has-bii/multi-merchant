import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { formatPriceNumber, formatPriceString } from "@/lib/format"

import { useProductHetForm } from "../hooks/use-product-het-form"

interface ProductHetFormProps {
  initialData?: {
    id: string
    name: string
    price: number
  }
}

export function ProductHetForm({ initialData }: ProductHetFormProps) {
  const { form, error, isEdit } = useProductHetForm({ initialData })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
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
                <FieldLabel htmlFor={field.name}>Nama Produk</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  data-invalid={isInvalid}
                  placeholder="Nama produk HET"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Field
          name="price"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Harga</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  inputMode="numeric"
                  value={field.state.value ? formatPriceString(Number(field.state.value)) : ""}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(formatPriceNumber(e.target.value).toString())}
                  data-invalid={isInvalid}
                  placeholder="0"
                  autoComplete="off"
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
