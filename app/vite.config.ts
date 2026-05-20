import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("/react/")) return "react-vendor"
            if (id.includes("@tanstack")) return "tanstack"
            if (id.includes("radix-ui")) return "radix"
            if (id.includes("zod")) return "zod"
            if (
              id.includes("clsx") ||
              id.includes("tailwind-merge") ||
              id.includes("class-variance-authority") ||
              id.includes("date-fns") ||
              id.includes("lucide-react")
            )
              return "utils"
          }
        },
      },
    },
  },
})

export default config
