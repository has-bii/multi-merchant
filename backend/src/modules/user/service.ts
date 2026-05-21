import { HTTPException } from "hono/http-exception"

import * as repo from "./repository.js"
import type { GetUserQueryDto } from "./schema.js"

export async function listUsers(query: GetUserQueryDto) {
  return repo.list(query)
}

export async function deleteUser(id: string, currentUserId: string) {
  const target = await repo.findById(id)
  if (!target) {
    throw new HTTPException(404, { message: "Pengguna tidak ditemukan" })
  }

  if (target.id === currentUserId) {
    throw new HTTPException(403, { message: "Tidak dapat menghapus akun sendiri" })
  }

  if (target.role === "admin") {
    const adminCount = await repo.countAdmins()
    if (adminCount <= 1) {
      throw new HTTPException(403, { message: "Tidak dapat menghapus admin terakhir" })
    }
  }

  await repo.remove(id)
}
