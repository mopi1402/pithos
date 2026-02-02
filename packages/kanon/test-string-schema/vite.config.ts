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
      "@arkhe": resolve(__dirname, "../../pithos/src/arkhe"),
      "@zygos": resolve(__dirname, "../../pithos/src/zygos"),
    },
  },
  build: {
    minify: "terser",
    terserOptions: {
      compress: {},
      mangle: {
        toplevel: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
