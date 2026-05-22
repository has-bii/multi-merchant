import { PrismaNeon } from "@prisma/adapter-neon"

import { env } from "../config/env.js"
import { PrismaClient } from "../generated/prisma/client.js"

const adapter = new PrismaNeon({
  connectionString: env.DB.URL,
})

export const db = new PrismaClient({ adapter })
