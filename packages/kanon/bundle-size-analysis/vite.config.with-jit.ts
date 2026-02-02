import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@kanon/v3": resolve(__dirname, "../../pithos/src/kanon/v3"),
      "@pithos/kanon/v3": resolve(__dirname, "../../pithos/src/kanon/v3"),
      "@pithos/arkhe": resolve(__dirname, "../../pithos/src/arkhe"),
      "@pithos/zygos": resolve(__dirname, "../../pithos/src/zygos"),
    },
  },
  build: {
    outDir: "dist/with-jit",
    lib: {
      entry: resolve(__dirname, "src/with-jit.ts"),
      name: "WithJIT",
      fileName: "with-jit",
      formats: ["es"],
    },
    minify: "terser",
    rollupOptions: {
      external: [],
    },
  },
});
