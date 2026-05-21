import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { useForm } from "@tanstack/react-form"
import { useSuspenseQuery } from "@tanstack/react-query"
import type { MerchantDetailResponse } from "backend/merchant"
import { useState } from "react"

import {
  getMerchantByUserQueryOptions,
  useUpdateMerchantMutation,
} from "../queries/merchant.queries"
import { merchantFormSchema } from "../schemas/merchant.schema"

export function MerchantDetailForm() {
  const { data: merchant } = useSuspenseQuery(getMerchantByUserQueryOptions())

  if (!merchant) {
    return <p className="text-muted-foreground">Anda belum memiliki merchant.</p>
  }

  return <MerchantDetailFormInner merchant={merchant} />
}

function MerchantDetailFormInner({ merchant }: { merchant: MerchantDetailResponse }) {
  const updateMutation = useUpdateMerchantMutation()
  const [error, setError] = useState("")

  const form = useForm({
    defaultValues: {
      name: merchant.name,
      phone: merchant.phone,
      address: merchant.address,
      description: merchant.description ?? "",
    },
    validators: {
      onSubmit: merchantFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        setError("")
        await updateMutation.mutateAsync(value)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Terjadi kesalahan")
      }
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="max-w-lg"
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
                <FieldLabel htmlFor={field.name}>Nama Merchant</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  data-invalid={isInvalid}
                  placeholder="Masukkan nama merchant"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Field
          name="phone"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Nomor Telepon</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  data-invalid={isInvalid}
                  placeholder="08xxxxxxxxxx"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Field
          name="address"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Alamat</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  data-invalid={isInvalid}
                  placeholder="Masukkan alamat merchant"
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Field
          name="description"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Deskripsi</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  data-invalid={isInvalid}
                  placeholder="Deskripsi singkat merchant (opsional)"
                  rows={3}
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
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </Button>
          )}
        />
      </FieldGroup>
    </form>
  )
}
