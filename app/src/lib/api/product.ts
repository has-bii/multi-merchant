import type { ProductAppType } from "backend/product"

import { createHonoClient } from "../hono-client"

export const productClient = createHonoClient<ProductAppType>("/api/product")
