import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Field, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { productHetKeys } from "@/features/product-het/queries/product-het.queries"
import { productHetClient } from "@/lib/api/product-het"
import { formatPriceString } from "@/lib/format"

import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ImportExecuteResultDto, ImportPreviewResponseDto } from "backend/product-het"
import { ChevronDownIcon } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { importFormSchema } from "../schemas/product-het-import.schema"
import type { ImportFormValues } from "../schemas/product-het-import.schema"
import { ProductHetImportConfirmDialog } from "./product-het-import-confirm-dialog"

interface ProductHetImportPreviewProps {
  data: ImportPreviewResponseDto
  onSuccess: (data: ImportExecuteResultDto) => void
  onReset: () => void
}

export function ProductHetImportPreview({
  data,
  onSuccess,
  onReset,
}: ProductHetImportPreviewProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const queryClient = useQueryClient()

  const executeMutation = useMutation({
    mutationFn: async (values: ImportFormValues): Promise<ImportExecuteResultDto> => {
      const res = await productHetClient.import.execute.$post({
        json: {
          willCreate: values.willCreate,
          willUpdate: values.willUpdate,
        },
      })
      if (!res.ok) throw new Error("Gagal menjalankan import")
      return await res.json()
    },
    onSuccess: (resData) => {
      setConfirmOpen(false)
      onSuccess(resData)
      queryClient.invalidateQueries({ queryKey: productHetKeys.all })
      const total = resData.created.length + resData.updated.length
      if (total > 0) toast.success(`${total} produk berhasil diimport`)
      if (resData.errors.length > 0) toast.warning(`${resData.errors.length} produk gagal diimport`)
    },
    onError: (err) => {
      setConfirmOpen(false)
      toast.error(err.message)
    },
  })

  const form = useForm({
    defaultValues: {
      willCreate: data.willCreate.map((item) => ({ ...item, selected: true })),
      willUpdate: data.willUpdate.map((item) => ({ ...item, selected: true })),
    },
    validators: {
      onChange: importFormSchema,
    },
    onSubmit: async ({ value }) => {
      await executeMutation.mutateAsync({
        willCreate: value.willCreate.filter((v) => v.selected),
        willUpdate: value.willUpdate.filter((v) => v.selected),
      })
    },
  })

  const hasData = data.willCreate.length > 0 || data.willUpdate.length > 0

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void,
  ) => {
    const raw = e.target.value.replace(/\D/g, "")
    onChange(raw === "" ? 0 : Number(raw))
  }

  // Empty State
  if (!hasData) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
        <p className="text-sm text-yellow-800 mb-1.5">⚠ Tidak ada data untuk diimport</p>
        <p className="mb-3 text-sm text-yellow-700">
          Semua baris diabaikan. Periksa file CSV Anda.
        </p>

        <Button variant="outline" onClick={onReset}>
          Kembali
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {/* Will Create */}
      <Card className="w-full py-4">
        <CardContent className="px-4">
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="group w-full aria-expanded:bg-transparent hover:aria-expanded:bg-muted"
              >
                {data.willCreate.length} Produk akan dibuat ✅
                <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <form.Field name="willCreate" mode="array">
                {(field) =>
                  field.state.value.length > 0 ? (
                    <div className="rounded-md border mt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <form.Subscribe selector={(state) => state.values.willCreate}>
                                {() => (
                                  <form.Field name="willCreate">
                                    {(subField) => {
                                      const isAllNotChecked = subField.state.value.some(
                                        (i) => !i.selected,
                                      )
                                      return (
                                        <Checkbox
                                          checked={!isAllNotChecked}
                                          onCheckedChange={(checked) => {
                                            subField.handleChange(
                                              subField.state.value.map((v) => ({
                                                ...v,
                                                selected: checked as boolean,
                                              })),
                                            )
                                          }}
                                        />
                                      )
                                    }}
                                  </form.Field>
                                )}
                              </form.Subscribe>
                            </TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead className="w-48">Harga</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {field.state.value.map((_, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <form.Field name={`willCreate[${i}].selected`}>
                                  {(subField) => (
                                    <Checkbox
                                      checked={subField.state.value}
                                      onCheckedChange={(checked) =>
                                        subField.handleChange(!!checked)
                                      }
                                    />
                                  )}
                                </form.Field>
                              </TableCell>
                              <TableCell className="capitalize">
                                <form.Field name={`willCreate[${i}].name`}>
                                  {(subField) => subField.state.value}
                                </form.Field>
                              </TableCell>
                              <TableCell>
                                <form.Field name={`willCreate[${i}].price`}>
                                  {(subField) => (
                                    <Field className="gap-1.5">
                                      <Input
                                        type="text"
                                        inputMode="numeric"
                                        value={
                                          subField.state.value > 0
                                            ? formatPriceString(subField.state.value)
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handlePriceChange(e, subField.handleChange)
                                        }
                                        className={
                                          subField.state.meta.errors.length > 0
                                            ? "border-destructive"
                                            : ""
                                        }
                                        aria-invalid={subField.state.meta.errors.length > 0}
                                      />
                                      {subField.state.meta.errors.length > 0 && (
                                        <FieldError errors={subField.state.meta.errors} />
                                      )}
                                    </Field>
                                  )}
                                </form.Field>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Tidak ada produk baru
                    </p>
                  )
                }
              </form.Field>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Will Update */}
      <Card className="w-full py-4">
        <CardContent className="px-4">
          <Collapsible defaultOpen>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="group w-full aria-expanded:bg-transparent hover:aria-expanded:bg-muted"
              >
                {data.willUpdate.length} Produk akan diperbarui ⚠️
                <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <form.Field name="willUpdate" mode="array">
                {(field) =>
                  field.state.value.length > 0 ? (
                    <div className="rounded-md border mt-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12">
                              <form.Subscribe selector={(state) => state.values.willUpdate}>
                                {() => (
                                  <form.Field name="willUpdate">
                                    {(subField) => {
                                      const isAllNotChecked = subField.state.value.some(
                                        (i) => !i.selected,
                                      )
                                      return (
                                        <Checkbox
                                          checked={!isAllNotChecked}
                                          onCheckedChange={(checked) => {
                                            subField.handleChange(
                                              subField.state.value.map((v) => ({
                                                ...v,
                                                selected: checked as boolean,
                                              })),
                                            )
                                          }}
                                        />
                                      )
                                    }}
                                  </form.Field>
                                )}
                              </form.Subscribe>
                            </TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead className="w-32">Harga Lama</TableHead>
                            <TableHead className="w-48">Harga Baru</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {field.state.value.map((item, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <form.Field name={`willUpdate[${i}].selected`}>
                                  {(subField) => (
                                    <Checkbox
                                      checked={subField.state.value}
                                      onCheckedChange={(checked) =>
                                        subField.handleChange(!!checked)
                                      }
                                    />
                                  )}
                                </form.Field>
                              </TableCell>
                              <TableCell className="capitalize">
                                <form.Field name={`willUpdate[${i}].name`}>
                                  {(subField) => subField.state.value}
                                </form.Field>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatPriceString(item.oldPrice)}
                              </TableCell>
                              <TableCell>
                                <form.Field name={`willUpdate[${i}].price`}>
                                  {(subField) => (
                                    <Field className="gap-1.5">
                                      <Input
                                        type="text"
                                        inputMode="numeric"
                                        value={
                                          subField.state.value > 0
                                            ? formatPriceString(subField.state.value)
                                            : ""
                                        }
                                        onChange={(e) =>
                                          handlePriceChange(e, subField.handleChange)
                                        }
                                        className={
                                          subField.state.meta.errors.length > 0
                                            ? "border-destructive"
                                            : ""
                                        }
                                        aria-invalid={subField.state.meta.errors.length > 0}
                                      />
                                      {subField.state.meta.errors.length > 0 && (
                                        <FieldError errors={subField.state.meta.errors} />
                                      )}
                                    </Field>
                                  )}
                                </form.Field>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Tidak ada produk untuk diperbarui
                    </p>
                  )
                }
              </form.Field>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Ignored */}
      <Card className="w-full py-4">
        <CardContent className="px-4">
          <Collapsible defaultOpen={false}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="group w-full aria-expanded:bg-transparent hover:aria-expanded:bg-muted"
              >
                {data.ignored.length} Baris dikecualikan ❌
                <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {data.ignored.length > 0 ? (
                <div className="rounded-md border mt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Row</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Alasan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.ignored.map((item) => (
                        <TableRow key={item.row}>
                          <TableCell>{item.row}</TableCell>
                          <TableCell className="capitalize">{item.name ?? "—"}</TableCell>
                          <TableCell>{item.reason}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Tidak ada baris dikecualikan
                </p>
              )}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="link" className="text-muted-foreground" onClick={onReset}>
          Kembali
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <form.Subscribe selector={(state) => [state.isValid, state.isSubmitting]}>
            {([isValid, isSubmitting]) => (
              <Button onClick={() => setConfirmOpen(true)} disabled={!isValid || isSubmitting}>
                {isSubmitting ? "Mengimport..." : "Import"}
              </Button>
            )}
          </form.Subscribe>
        </div>
      </div>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <form.Subscribe selector={(state) => state.values}>
            {(values) => (
              <ProductHetImportConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                onConfirm={() => form.handleSubmit()}
                isPending={isSubmitting}
                summary={{
                  willCreate: values.willCreate.filter((i) => i.selected).length,
                  willUpdate: values.willUpdate.filter((i) => i.selected).length,
                }}
              />
            )}
          </form.Subscribe>
        )}
      </form.Subscribe>
    </div>
  )
}
