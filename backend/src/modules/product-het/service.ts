import { HTTPException } from "hono/http-exception"

import { db } from "../../lib/db.js"
import { paginate } from "../../lib/paginate.js"
import type { GetProductHetQueryDto } from "./schema.js"

const sortableFields = {
  name: "name",
  price: "price",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const

export abstract class ProductHetService {
  static async list({ page, limit, orderBy, order, search }: GetProductHetQueryDto) {
    const field = sortableFields[orderBy]
    const where = search ? { name: { startsWith: search, mode: "insensitive" as const } } : {}

    return paginate(
      (l, o) =>
        db.productHets.findMany({
          select: { id: true, name: true, price: true, createdAt: true, updatedAt: true },
          where,
          take: l,
          skip: o,
          orderBy: { [field]: order },
        }),
      async () => db.productHets.count({ where }),
      page,
      limit,
    )
  }

  static async getById(id: string) {
    const product = await db.productHets.findUnique({ where: { id } })
    if (!product) {
      throw new HTTPException(404, { message: "Produk tidak ditemukan" })
    }
    return product
  }

  static async create(data: { name: string; price: number }) {
    const existing = await this.findByName(data.name)
    if (existing) {
      throw new HTTPException(409, { message: "Nama produk sudah digunakan" })
    }
    return db.productHets.create({
      data: { name: data.name, price: String(data.price) },
    })
  }

  static async update(id: string, data: { name: string; price: number }) {
    const product = await db.productHets.findUnique({ where: { id } })
    if (!product) {
      throw new HTTPException(404, { message: "Produk tidak ditemukan" })
    }

    const nameConflict = await this.findByName(data.name)
    if (nameConflict && nameConflict.id !== id) {
      throw new HTTPException(409, { message: "Nama produk sudah digunakan" })
    }

    return db.productHets.update({
      where: { id },
      data: { name: data.name, price: String(data.price) },
    })
  }

  static async delete(id: string) {
    const product = await db.productHets.findUnique({ where: { id } })
    if (!product) {
      throw new HTTPException(404, { message: "Produk tidak ditemukan" })
    }
    await db.productHets.delete({ where: { id } })
  }

  static async bulkDelete(ids: string[]) {
    if (ids.length === 0) {
      throw new HTTPException(400, { message: "ID tidak boleh kosong" })
    }
    await db.productHets.deleteMany({ where: { id: { in: ids } } })
  }

  static async listAll() {
    return db.productHets.findMany({
      select: { id: true, name: true, price: true },
    })
  }

  private static async findByName(name: string) {
    return db.productHets.findUnique({ where: { name } })
  }
}
