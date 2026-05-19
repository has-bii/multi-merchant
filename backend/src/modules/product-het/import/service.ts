import { parse } from "csv-parse/sync"
import { HTTPException } from "hono/http-exception"

import * as repo from "../repository.js"
import { productHetSchema } from "../schema.js"
import type {
  ImportPreviewResponseDto,
  ImportExecuteResultDto,
} from "./types.js"
import type { ImportExecutePayloadDto } from "./schema.js"

const MAX_ROWS = 100
const VALID_EXTENSIONS = [".csv"] as const

function parsePrice(raw: unknown): number | null {
  if (raw === null || raw === undefined) return null
  const str = String(raw).trim()
  if (!str) return null
  const cleaned = str.replace(/[.,]/g, "")
  const num = Number(cleaned)
  if (!Number.isInteger(num) || num <= 0) return null
  return num
}

function parseFileBuffer(buffer: Buffer): string[][] {
  const text = buffer.toString("utf-8")
  return parse(text, {
    columns: false,
    skip_empty_lines: true,
    trim: true,
  }) as string[][]
}

export async function previewImportProduct(file: File): Promise<ImportPreviewResponseDto> {
  const ext = "." + file.name.split(".").pop()?.toLowerCase()
  if (!VALID_EXTENSIONS.includes(ext as (typeof VALID_EXTENSIONS)[number])) {
    throw new HTTPException(400, { message: "Format file tidak didukung. Gunakan .csv" })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const rows = parseFileBuffer(buffer)

  if (rows.length > MAX_ROWS) {
    throw new HTTPException(400, {
      message: `Maksimum ${MAX_ROWS} baris. File berisi ${rows.length} baris.`,
    })
  }

  const existingProducts = await repo.listAll()
  const existingMap = new Map<string, { id: string; name: string; price: number }>()
  for (const p of existingProducts) {
    existingMap.set(p.name, { id: p.id, name: p.name, price: Number(p.price) })
  }

  const willCreate: ImportPreviewResponseDto["willCreate"] = []
  const willUpdate: ImportPreviewResponseDto["willUpdate"] = []
  const ignored: ImportPreviewResponseDto["ignored"] = []
  const seenNames = new Set<string>()

  for (let i = 0; i < rows.length; i++) {
    const rowIdx = i + 1
    const row = rows[i]!

    const rawName = row[0]
    const rawPrice = row[1]

    if (!rawName || !String(rawName).trim()) {
      ignored.push({ row: rowIdx, reason: "Kolom nama kosong" })
      continue
    }

    const name = productHetSchema.shape.name.parse(String(rawName).trim())
    const price = parsePrice(rawPrice)

    if (price === null) {
      ignored.push({ row: rowIdx, name, reason: "Harga tidak valid" })
      continue
    }

    if (seenNames.has(name)) {
      ignored.push({ row: rowIdx, name, reason: "Nama duplikat dalam file" })
      continue
    }
    seenNames.add(name)

    const existing = existingMap.get(name)
    if (existing) {
      willUpdate.push({
        row: rowIdx,
        id: existing.id,
        name,
        oldPrice: existing.price,
        price,
      })
    } else {
      willCreate.push({ row: rowIdx, name, price })
    }
  }

  return { willCreate, willUpdate, ignored }
}

function isUniqueViolation(e: unknown): boolean {
  return e instanceof Error && "code" in e && (e as { code: string }).code === "23505"
}

export async function executeImportProduct(
  data: ImportExecutePayloadDto,
): Promise<ImportExecuteResultDto> {
  const created: ImportExecuteResultDto["created"] = []
  const updated: ImportExecuteResultDto["updated"] = []
  const errors: ImportExecuteResultDto["errors"] = []

  const createResults = await Promise.all(
    data.willCreate.map(async (item) => {
      try {
        const result = await repo.create({ name: item.name, price: item.price })
        return {
          ok: true as const,
          data: { row: item.row, id: result!.id, name: result!.name, price: Number(result!.price) },
        }
      } catch (e) {
        const reason = isUniqueViolation(e) ? "Nama produk sudah ada" : "Gagal membuat produk"
        return { ok: false as const, error: { row: item.row, name: item.name, reason } }
      }
    }),
  )
  for (const r of createResults) {
    if (r.ok) created.push(r.data)
    else errors.push(r.error)
  }

  const updateResults = await Promise.all(
    data.willUpdate.map(async (item) => {
      try {
        const result = await repo.update(item.id, { name: item.name, price: item.price })
        if (!result)
          return {
            ok: false as const,
            error: { row: item.row, name: item.name, reason: "Produk tidak ditemukan" },
          }
        return {
          ok: true as const,
          data: { row: item.row, id: result.id, name: result.name, price: Number(result.price) },
        }
      } catch (e) {
        const reason = isUniqueViolation(e) ? "Nama produk sudah digunakan" : "Gagal memperbarui produk"
        return { ok: false as const, error: { row: item.row, name: item.name, reason } }
      }
    }),
  )
  for (const r of updateResults) {
    if (r.ok) updated.push(r.data)
    else errors.push(r.error)
  }

  return { created, updated, errors }
}