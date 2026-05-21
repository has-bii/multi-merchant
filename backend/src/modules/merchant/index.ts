import { createApp } from "../../lib/typed-app.js"
import { crudRoute } from "./route.js"

export const merchantRoute = createApp().route("/", crudRoute)

export type MerchantAppType = typeof merchantRoute

export type {
  MerchantListItem,
  MerchantListResponse,
  MerchantDetailResponse,
  GetMerchantQueryDto,
  CreateMerchantDto,
  UpdateMerchantDto,
} from "./schema.js"
