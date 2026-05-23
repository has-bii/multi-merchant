import type { ImportPreviewRow } from "./schema.js"

export type { ImportPreviewRow } from "./schema.js"

export interface ImportPreviewWillUpdateRow extends ImportPreviewRow {
  id: string
  oldPrice: number
}

export interface ImportPreviewIgnoredRow {
  row: number
  name?: string
  reason: string
}

export interface ImportPreviewResponseDto {
  willCreate: ImportPreviewRow[]
  willUpdate: ImportPreviewWillUpdateRow[]
  ignored: ImportPreviewIgnoredRow[]
}

export interface ImportExecuteResultItem {
  id: string
  name: string
  price: number
}

export interface ImportExecuteErrorRow {
  row: number
  name?: string
  reason: string
}

export interface ImportExecuteResultDto {
  created: ImportExecuteResultItem[]
  updated: ImportExecuteResultItem[]
  errors: ImportExecuteErrorRow[]
}
