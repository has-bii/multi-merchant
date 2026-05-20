import { HTTPException } from "hono/http-exception"

import * as repo from "./repository.js"
import type { GetProductHetQueryDto } from "./schema.js"

export async function listProducts(query: GetProductHetQueryDto) {
  return repo.list(query)
}

export async function getProduct(id: string) {
  const product = await repo.findById(id)
  if (!product) {
    throw new HTTPException(404, { message: "Produk tidak ditemukan" })
  }
  return product
}

export async function createProduct(data: { name: string; price: number }) {
  const existing = await repo.findByName(data.name)
  if (existing) {
    throw new HTTPException(409, { message: "Nama produk sudah digunakan" })
  }
  return repo.create(data)
}

export async function updateProduct(id: string, data: { name: string; price: number }) {
  const product = await repo.findById(id)
  if (!product) {
    throw new HTTPException(404, { message: "Produk tidak ditemukan" })
  }

  const nameConflict = await repo.findByName(data.name)
  if (nameConflict && nameConflict.id !== id) {
    throw new HTTPException(409, { message: "Nama produk sudah digunakan" })
  }

  return repo.update(id, data)
}

export async function deleteProduct(id: string) {
  const product = await repo.findById(id)
  if (!product) {
    throw new HTTPException(404, { message: "Produk tidak ditemukan" })
  }
  await repo.remove(id)
}

export async function bulkDeleteProducts(ids: string[]) {
  if (ids.length === 0) {
    throw new HTTPException(400, { message: "ID tidak boleh kosong" })
  }
  await repo.bulkRemove(ids)
}