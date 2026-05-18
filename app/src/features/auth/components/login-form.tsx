import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useLoginForm } from "../hooks/use-login-form"

export function LoginForm() {
  const { form, error } = useLoginForm()

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Masuk</CardTitle>
        <CardDescription>Masuk ke akun Anda untuk melanjutkan.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Gagal Masuk</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form.Field
              name="email"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="email@gmail.com"
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="password"
                      placeholder="********"
                      autoComplete="off"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />

            <form.Subscribe
              selector={({ canSubmit, isDirty, isSubmitting }) => [
                canSubmit,
                isDirty,
                isSubmitting,
              ]}
              children={([canSubmit, isDirty, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || !isDirty || isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
