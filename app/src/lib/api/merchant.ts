import { createHonoClient } from "../hono-client"
import type { MerchantAppType } from "backend/merchant"

export const merchantClient = createHonoClient<MerchantAppType>("/api/merchant")
