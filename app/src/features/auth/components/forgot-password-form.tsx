import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { useForgotPasswordForm } from "../hooks/use-forgot-password-form"

export function ForgotPasswordForm() {
  const { form, error, success } = useForgotPasswordForm()

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Lupa Password</CardTitle>
        <CardDescription>Masukkan email Anda untuk menerima link reset password.</CardDescription>
      </CardHeader>
      <CardContent>
        {success ? (
          <div className="text-center space-y-4">
            <Alert>
              <AlertTitle>Email Terkirim</AlertTitle>
              <AlertDescription>
                Jika akun dengan email tersebut terdaftar, link reset password telah dikirim.
              </AlertDescription>
            </Alert>
            <Button variant="outline" className="w-full" asChild>
              <a href="/login">Kembali ke Masuk</a>
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Gagal Mengirim</AlertTitle>
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

              <form.Subscribe
                selector={({ canSubmit, isDirty, isSubmitting }) => [
                  canSubmit,
                  isDirty,
                  isSubmitting,
                ]}
                children={([canSubmit, isDirty, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || !isDirty || isSubmitting}>
                    {isSubmitting ? "Loading..." : "Kirim Link Reset"}
                  </Button>
                )}
              />
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  )
}