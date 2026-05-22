import { HTTPException } from "hono/http-exception"

import { db } from "../../lib/db.js"
import { paginate } from "../../lib/paginate.js"
import type { GetUserQueryDto } from "./schema.js"

const sortableFields = {
  name: "name",
  createdAt: "createdAt",
} as const

export abstract class UserService {
  static async list({ page, limit, orderBy, order, search }: GetUserQueryDto) {
    const field = sortableFields[orderBy]
    const where = search ? { name: { startsWith: search, mode: "insensitive" as const } } : {}

    return paginate(
      (l, o) =>
        db.user.findMany({
          select: { id: true, name: true, email: true, role: true, createdAt: true },
          where,
          take: l,
          skip: o,
          orderBy: { [field]: order },
        }),
      async () => db.user.count({ where }),
      page,
      limit,
    )
  }

  static async delete(id: string, currentUserId: string) {
    const target = await db.user.findUnique({ where: { id } })
    if (!target) {
      throw new HTTPException(404, { message: "Pengguna tidak ditemukan" })
    }

    if (target.id === currentUserId) {
      throw new HTTPException(403, { message: "Tidak dapat menghapus akun sendiri" })
    }

    if (target.role === "admin") {
      const adminCount = await db.user.count({ where: { role: "admin" } })
      if (adminCount <= 1) {
        throw new HTTPException(403, { message: "Tidak dapat menghapus admin terakhir" })
      }
    }

    await db.user.delete({ where: { id } })
  }
}
