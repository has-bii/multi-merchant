import { HTTPException } from "hono/http-exception"

import { db } from "../../lib/db.js"
import { paginate } from "../../lib/paginate.js"
import type { CreateProductDto, GetProductQueryDto, UpdateProductDto } from "./schema.js"

const productSelect = {
  id: true,
  price: true,
  createdAt: true,
  updatedAt: true,
  userId: true,
  merchantId: true,
  productHetId: true,
  merchant: { select: { id: true, name: true } },
  productHet: { select: { id: true, name: true, price: true } },
} as const

const sortableFields = {
  createdAt: "createdAt",
  price: "price",
} as const

async function resolveMerchantByUserId(userId: string) {
  const merchant = await db.merchant.findUnique({ where: { userId } })
  if (!merchant) {
    throw new HTTPException(404, { message: "Merchant tidak ditemukan" })
  }
  return merchant
}

export abstract class ProductService {
  static async list(query: GetProductQueryDto, userId: string, role: string | undefined) {
    const field = sortableFields[query.orderBy]
    const where: Record<string, unknown> = {}

    if (role === "user") {
      const merchant = await resolveMerchantByUserId(userId)
      where.merchantId = merchant.id
    }

    if (query.name) {
      where.productHet = { name: { startsWith: query.name, mode: "insensitive" as const } }
    }

    if (query.productHetId) {
      where.productHetId = query.productHetId
    }

    return paginate(
      (l, o) =>
        db.product.findMany({
          select: productSelect,
          where,
          take: l,
          skip: o,
          orderBy: { [field]: query.order },
        }),
      async () => db.product.count({ where }),
      query.page,
      query.limit,
    )
  }

  static async getAvailable(userId: string) {
    const existing = await db.product.findMany({
      where: { userId },
      select: { productHetId: true },
    })
    const existingIds = existing.map((p) => p.productHetId)

    return db.productHets.findMany({
      where: { id: { notIn: existingIds } },
      select: { id: true, name: true, price: true },
    })
  }

  static async getById(id: string, userId: string, role: string | undefined) {
    const product = await db.product.findUnique({
      where: { id },
      select: productSelect,
    })
    if (!product) {
      throw new HTTPException(404, { message: "Produk tidak ditemukan" })
    }

    if (role === "user") {
      const merchant = await resolveMerchantByUserId(userId)
      if (product.merchantId !== merchant.id) {
        throw new HTTPException(404, { message: "Produk tidak ditemukan" })
      }
    }

    return product
  }

  static async create(data: CreateProductDto, userId: string) {
    const merchant = await resolveMerchantByUserId(userId)

    const productHet = await db.productHets.findUnique({
      where: { id: data.productHetId },
    })
    if (!productHet) {
      throw new HTTPException(404, { message: "Product HET tidak ditemukan" })
    }

    if (data.price > Number(productHet.price)) {
      throw new HTTPException(400, { message: "Harga tidak boleh lebih dari harga HET" })
    }

    const existing = await db.product.findUnique({
      where: {
        userId_productHetId: { userId, productHetId: data.productHetId },
      },
    })
    if (existing) {
      throw new HTTPException(409, { message: "Produk sudah ada" })
    }

    return db.product.create({
      data: {
        price: String(data.price),
        merchantId: merchant.id,
        userId,
        productHetId: data.productHetId,
      },
    })
  }

  static async update(
    id: string,
    data: UpdateProductDto,
    userId: string,
    role: string | undefined,
  ) {
    const product = await db.product.findUnique({
      where: { id },
      include: { productHet: true },
    })
    if (!product) {
      throw new HTTPException(404, { message: "Produk tidak ditemukan" })
    }

    if (role === "user" && product.userId !== userId) {
      throw new HTTPException(403, { message: "Akses ditolak" })
    }

    if (data.price > Number(product.productHet.price)) {
      throw new HTTPException(400, { message: "Harga tidak boleh lebih dari harga HET" })
    }

    return db.product.update({
      where: { id },
      data: { price: String(data.price) },
    })
  }

  static async delete(id: string, userId: string, role: string | undefined) {
    const product = await db.product.findUnique({ where: { id } })
    if (!product) {
      throw new HTTPException(404, { message: "Produk tidak ditemukan" })
    }

    if (role === "user" && product.userId !== userId) {
      throw new HTTPException(403, { message: "Akses ditolak" })
    }

    await db.product.delete({ where: { id } })
  }
}
