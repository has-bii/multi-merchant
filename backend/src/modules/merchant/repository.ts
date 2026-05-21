import { count, eq, ilike } from "drizzle-orm"

import { merchant } from "../../db/schema.js"
import { db } from "../../lib/db.js"
import { paginate } from "../../lib/paginate.js"
import type { GetMerchantQueryDto } from "./schema.js"

const sortableFields = {
  name: "name",
  createdAt: "createdAt",
} as const

export async function list({ page, limit, orderBy, order, name }: GetMerchantQueryDto) {
  const field = sortableFields[orderBy]
  const where = name ? ilike(merchant.name, `${name}%`) : undefined

  return paginate(
    (l, o) =>
      db.query.merchant.findMany({
        columns: { id: true, name: true, address: true, createdAt: true },
        where,
        limit: l,
        offset: o,
        orderBy: (m, { asc, desc }) => [order === "asc" ? asc(m[field]) : desc(m[field])],
      }),
    async () => {
      const [row] = await db.select({ count: count() }).from(merchant).where(where)
      return row?.count ?? 0
    },
    page,
    limit,
  )
}

export async function findById(id: string) {
  return db.query.merchant.findFirst({
    where: eq(merchant.id, id),
    with: { user: { columns: { name: true, email: true } } },
  })
}

export async function findByUserId(userId: string) {
  return db.query.merchant.findFirst({
    where: eq(merchant.userId, userId),
  })
}

export async function findByName(name: string) {
  return db.query.merchant.findFirst({
    where: eq(merchant.name, name),
  })
}

export async function create(data: {
  name: string
  userId: string
  phone: string
  address: string
  description?: string | undefined
}) {
  const [inserted] = await db.insert(merchant).values(data).returning()
  return inserted
}

export async function update(
  id: string,
  data: {
    name?: string | undefined
    phone?: string | undefined
    address?: string | undefined
    description?: string | undefined
  },
) {
  const [updated] = await db.update(merchant).set(data).where(eq(merchant.id, id)).returning()
  return updated
}
