import { type Config } from "prettier"

const config: Config = {
  printWidth: 100,
  semi: false,
  trailingComma: "all",
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["^@/(.*)$", "<THIRD_PARTY_MODULES>", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderParserOpts: {
    plugins: ["jsx", "typescript"],
  },
}

export default config
