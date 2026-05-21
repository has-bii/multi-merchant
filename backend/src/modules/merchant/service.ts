import { HTTPException } from "hono/http-exception"

import * as repo from "./repository.js"
import type {
  CreateMerchantDto,
  GetMerchantQueryDto,
  MerchantDetailResponse,
  UpdateMerchantDto,
} from "./schema.js"

export async function listMerchants(query: GetMerchantQueryDto) {
  return repo.list(query)
}

export async function getMerchant(id: string, userId: string): Promise<MerchantDetailResponse> {
  const resolvedId = id === "me" ? (await repo.findByUserId(userId))?.id : id

  if (!resolvedId) {
    throw new HTTPException(404, { message: "Merchant tidak ditemukan" })
  }

  const merchant = await repo.findById(resolvedId)
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

export async function createMerchant(data: CreateMerchantDto, userId: string) {
  const existing = await repo.findByUserId(userId)
  if (existing) {
    throw new HTTPException(409, { message: "Anda sudah memiliki merchant" })
  }

  return repo.create({ ...data, userId })
}

export async function updateMerchant(data: UpdateMerchantDto, userId: string) {
  const merchant = await repo.findByUserId(userId)
  if (!merchant) {
    throw new HTTPException(404, { message: "Merchant tidak ditemukan" })
  }

  return repo.update(merchant.id, data)
}
