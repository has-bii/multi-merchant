import { createHonoClient } from "../hono-client"
import type { ProductAppType } from "backend/product"

export const productClient = createHonoClient<ProductAppType>("/api/product")
