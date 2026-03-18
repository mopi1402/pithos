import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const pithosRoot = path.resolve(__dirname, "../../../dist");

export default defineConfig({
  plugins: [react()],
  base: "/demos/design-patterns/mediator/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@arkhe": path.join(pithosRoot, "arkhe"),
      "@kanon": path.join(pithosRoot, "kanon"),
      "@zygos": path.join(pithosRoot, "zygos"),
      "@sphalma": path.join(pithosRoot, "sphalma"),
      "@taphos": path.join(pithosRoot, "taphos"),
      "@eidos": path.join(pithosRoot, "eidos"),
    },
  },
});
