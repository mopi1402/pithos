import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const pithosRoot = path.resolve(__dirname, "../../../dist");

export default defineConfig({
  plugins: [react()],
  base: "/demos/design-patterns/singleton/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@pithos/core": pithosRoot,
    },
  },
});
