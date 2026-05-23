import { createApp } from "../../lib/typed-app.js"
import { crudRoute } from "./route.js"

export const productRoute = createApp().route("/", crudRoute)

export type ProductAppType = typeof productRoute

export type { CreateProductDto, UpdateProductDto, GetProductQueryDto } from "./schema.js"
