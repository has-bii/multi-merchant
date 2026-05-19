import { createHonoClient } from "../hono-client"
import type { ProductHetAppType } from "backend/product-het"

export const productHetClient = createHonoClient<ProductHetAppType>("/api/product-het")
