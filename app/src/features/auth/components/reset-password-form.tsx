import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useResetPasswordForm } from "../hooks/use-reset-password-form"

export function ResetPasswordForm({ token }: { token: string }) {
  const { form, error, success } = useResetPasswordForm(token)

  if (success) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Password Berhasil Direset</CardTitle>
          <CardDescription>
            Password Anda telah berhasil diubah. Silakan masuk dengan password baru.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" asChild>
            <a href="/login">Masuk</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>Masukkan password baru Anda.</CardDescription>
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
                <AlertTitle>Gagal Mereset</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form.Field
              name="password"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Password Baru</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="password"
                      placeholder="********"
                      autoComplete="new-password"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />

            <form.Field
              name="confirmPassword"
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Konfirmasi Password</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      type="password"
                      placeholder="********"
                      autoComplete="new-password"
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
                  {isSubmitting ? "Loading..." : "Reset Password"}
                </Button>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}