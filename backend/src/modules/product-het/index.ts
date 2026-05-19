import { createApp } from "../../lib/typed-app.js"
import { crudRoute } from "./route.js"
import { importRoute } from "./import/route.js"

export const productHetRoute = createApp().route("/", crudRoute).route("/", importRoute)