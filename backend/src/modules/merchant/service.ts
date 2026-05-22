import { HTTPException } from "hono/http-exception"

import { db } from "../../lib/db.js"
import { paginate } from "../../lib/paginate.js"
import type {
  CreateMerchantDto,
  GetMerchantQueryDto,
  MerchantDetailResponse,
  UpdateMerchantDto,
} from "./schema.js"

const sortableFields = {
  name: "name",
  createdAt: "createdAt",
} as const

export abstract class MerchantService {
  static async list({ page, limit, orderBy, order, name }: GetMerchantQueryDto) {
    const field = sortableFields[orderBy]
    const where = name ? { name: { startsWith: name, mode: "insensitive" as const } } : {}

    return paginate(
      (l, o) =>
        db.merchant.findMany({
          select: { id: true, name: true, address: true, createdAt: true },
          where,
          take: l,
          skip: o,
          orderBy: { [field]: order },
        }),
      async () => db.merchant.count({ where }),
      page,
      limit,
    )
  }

  static async getById(id: string, userId: string): Promise<MerchantDetailResponse> {
    const resolvedId = id === "me" ? (await this.findByUserId(userId))?.id : id

    if (!resolvedId) {
      throw new HTTPException(404, { message: "Merchant tidak ditemukan" })
    }

    const merchant = await db.merchant.findUnique({
      where: { id: resolvedId },
      include: { user: { select: { name: true, email: true } } },
    })

    if (!merchant) {
      throw new HTTPException(404, { message: "Merchant tidak ditemukan" })
    }

    const { user, ...rest } = merchant

    return {
      ...rest,
      description: rest.description,
      createdAt: rest.createdAt.toISOString(),
      updatedAt: rest.updatedAt.toISOString(),
      user: { name: user.name, email: user.email },
    }
  }

  static async create(data: CreateMerchantDto, userId: string) {
    const existing = await this.findByUserId(userId)
    if (existing) {
      throw new HTTPException(409, { message: "Anda sudah memiliki merchant" })
    }

    return db.merchant.create({
      data: { ...data, userId, description: data.description ?? null },
    })
  }

  static async update(data: UpdateMerchantDto, userId: string) {
    const merchant = await this.findByUserId(userId)
    if (!merchant) {
      throw new HTTPException(404, { message: "Merchant tidak ditemukan" })
    }

    const updateData: Record<string, unknown> = {}
    if (data.name !== undefined) updateData.name = data.name
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.address !== undefined) updateData.address = data.address
    if (data.description !== undefined) updateData.description = data.description

    return db.merchant.update({ where: { id: merchant.id }, data: updateData })
  }

  private static async findByUserId(userId: string) {
    return db.merchant.findUnique({ where: { userId } })
  }
}
