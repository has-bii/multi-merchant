import { createApp } from "../../lib/typed-app.js"
import { crudRoute } from "./route.js"

export const userRoute = createApp().route("/", crudRoute)

export type UserAppType = typeof userRoute

export type { UserListItem, UserListResponse, GetUserQueryDto } from "./schema.js"
