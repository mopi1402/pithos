import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    visualizer({
      filename: "dist/bundle-analysis.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: "treemap",
    }),
  ],
  resolve: {
    alias: {
      "@kanon/v3": resolve(__dirname, "../../pithos/src/kanon/v3"),
      "@pithos/kanon/v3": resolve(__dirname, "../../pithos/src/kanon/v3"),
      "@pithos/arkhe": resolve(__dirname, "../../pithos/src/arkhe"),
      "@pithos/zygos": resolve(__dirname, "../../pithos/src/zygos"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "kanon-core": ["@pithos/kanon/v3"],
        },
      },
    },
  },
});
