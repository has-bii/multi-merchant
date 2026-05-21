import { createHonoClient } from "../hono-client"
import type { UserAppType } from "backend/user"

export const userClient = createHonoClient<UserAppType>("/api/user")
