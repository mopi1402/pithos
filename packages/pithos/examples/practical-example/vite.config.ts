import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Pithos internal aliases - resolve to the dist folder
const pithosRoot = path.resolve(__dirname, "../../dist");

export default defineConfig({
  plugins: [react()],
  base: "/demos/practical-example/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Pithos internal aliases
      "@arkhe": path.join(pithosRoot, "arkhe"),
      "@kanon": path.join(pithosRoot, "kanon"),
      "@zygos": path.join(pithosRoot, "zygos"),
      "@sphalma": path.join(pithosRoot, "sphalma"),
      "@taphos": path.join(pithosRoot, "taphos"),
    },
  },
});
