import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAvailableProductsQueryOptions } from "@/features/product/queries/product.queries"
import { formatPriceNumber, formatPriceString } from "@/lib/format"

import { useSuspenseQuery } from "@tanstack/react-query"

import { useProductForm } from "../hooks/use-product-form"

interface ProductFormProps {
  initialData?: {
    id: string
    productHetId: string
    price: number
  }
}

export function ProductForm({ initialData }: ProductFormProps) {
  const { form, error, isEdit } = useProductForm({ initialData })

  // Fetch available product HET options (only for create mode)
  const { data: availableProducts } = useSuspenseQuery(getAvailableProductsQueryOptions())

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
          name="productHetId"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Produk HET</FieldLabel>
                <Select
                  value={field.state.value || undefined}
                  onValueChange={(value) => field.handleChange(value)}
                  disabled={isEdit}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih produk HET" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProducts?.map((item: { id: string; name: string; price: string }) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}{" "}
                        <span className="text-muted-foreground">
                          — {formatPriceString(Number(item.price))}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                  onChange={(e) => field.handleChange(formatPriceNumber(e.target.value))}
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
