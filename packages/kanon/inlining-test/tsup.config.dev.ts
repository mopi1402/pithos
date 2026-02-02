import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false,
  minify: false, // Pas de minification pour voir le code source
  treeshake: true,
  splitting: false,
});




