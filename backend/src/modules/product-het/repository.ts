import { count, eq, ilike } from "drizzle-orm"

import { productHets } from "../../db/schema.js"
import { db } from "../../lib/db.js"
import { paginate } from "../../lib/paginate.js"
import type { GetProductHetQueryDto } from "./schema.js"

const sortableFields = {
  name: "name",
  price: "price",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
} as const

export async function list({ page, limit, orderBy, order, search }: GetProductHetQueryDto) {
  const field = sortableFields[orderBy]
  const where = search ? ilike(productHets.name, `${search}%`) : undefined

  return paginate(
    (l, o) =>
      db.query.productHets.findMany({
        columns: { id: true, name: true, price: true, createdAt: true, updatedAt: true },
        where,
        limit: l,
        offset: o,
        orderBy: (ph, { asc, desc }) => [
          order === "asc" ? asc(ph[field]) : desc(ph[field]),
        ],
      }),
    async () => {
      const [row] = await db.select({ count: count() }).from(productHets).where(where)
      return row?.count ?? 0
    },
    page,
    limit,
  )
}

export async function findById(id: string) {
  return db.query.productHets.findFirst({
    where: eq(productHets.id, id),
  })
}

export async function findByName(name: string) {
  return db.query.productHets.findFirst({
    where: eq(productHets.name, name),
  })
}

export async function create(data: { name: string; price: number }) {
  const [inserted] = await db
    .insert(productHets)
    .values({ name: data.name, price: String(data.price) })
    .returning()
  return inserted
}

export async function update(id: string, data: { name: string; price: number }) {
  const [updated] = await db
    .update(productHets)
    .set({ name: data.name, price: String(data.price) })
    .where(eq(productHets.id, id))
    .returning()
  return updated
}

export async function remove(id: string) {
  await db.delete(productHets).where(eq(productHets.id, id))
}

export async function listAll() {
  return db.query.productHets.findMany({
    columns: { id: true, name: true, price: true },
  })
}

