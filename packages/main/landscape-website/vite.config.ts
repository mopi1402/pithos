import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import preact from "@preact/preset-vite";

export default defineConfig({
  plugins: [
    preact(),
    process.env.ANALYZE === "true"
      ? visualizer({
          filename: "dist/bundle-visualizer.html",
          template: "treemap",
          gzipSize: true,
          brotliSize: true,
          open: false,
        })
      : undefined,
  ].filter(Boolean),
  server: {
    port: 3001,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: process.env.SOURCEMAP === "true",
    minify: "terser",
    cssMinify: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log"],
        passes: 2,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "preact-vendor": ["preact"],
        },
      },
    },
  },
  esbuild: {
    target: "es2020",
  },
});


