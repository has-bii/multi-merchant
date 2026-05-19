import { createApp } from "../../lib/typed-app.js"
import { importRoute } from "./import/route.js"
import { crudRoute } from "./route.js"

export const productHetRoute = createApp().route("/", crudRoute).route("/", importRoute)

export type ProductHetAppType = typeof productHetRoute

export type {
  ProductHetListItem,
  ProductHetListResponse,
  ProductHetDto,
  GetProductHetQueryDto,
} from "./schema.js"
