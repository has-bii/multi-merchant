import { count, eq, ilike } from "drizzle-orm"

import { user } from "../../db/schema.js"
import { db } from "../../lib/db.js"
import { paginate } from "../../lib/paginate.js"
import type { GetUserQueryDto } from "./schema.js"

const sortableFields = {
  name: "name",
  createdAt: "createdAt",
} as const

export async function list({ page, limit, orderBy, order, search }: GetUserQueryDto) {
  const field = sortableFields[orderBy]
  const where = search ? ilike(user.name, `${search}%`) : undefined

  return paginate(
    (l, o) =>
      db.query.user.findMany({
        columns: { id: true, name: true, email: true, role: true, createdAt: true },
        where,
        limit: l,
        offset: o,
        orderBy: (u, { asc, desc }) => [
          order === "asc" ? asc(u[field]) : desc(u[field]),
        ],
      }),
    async () => {
      const [row] = await db.select({ count: count() }).from(user).where(where)
      return row?.count ?? 0
    },
    page,
    limit,
  )
}

export async function findById(id: string) {
  return db.query.user.findFirst({
    where: eq(user.id, id),
  })
}

export async function countAdmins() {
  const [row] = await db.select({ count: count() }).from(user).where(eq(user.role, "admin"))
  return row?.count ?? 0
}

export async function remove(id: string) {
  await db.delete(user).where(eq(user.id, id))
}
