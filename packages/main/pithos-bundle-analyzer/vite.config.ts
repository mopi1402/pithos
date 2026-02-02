import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Point to pithos dist (tsc output)
const pithosDist = path.resolve(__dirname, "../../pithos/dist");

function collectJsFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    console.warn(`Warning: Directory ${dir} does not exist. Skipping.`);
    return [];
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const normalizedPath = full.replace(/\\/g, "/");

    if (entry.isDirectory()) {
      if (
        full.includes("benchmark") ||
        full.includes(`${path.sep}tmp${path.sep}`) ||
        normalizedPath.includes("/kanon/v1") ||
        normalizedPath.includes("/kanon/v2")
      ) {
        continue;
      }
      files.push(...collectJsFiles(full));
    } else if (
      entry.isFile() &&
      entry.name.endsWith(".js") &&
      !entry.name.endsWith(".test.js")
    ) {
      if (
        normalizedPath.includes("/kanon/v1/") ||
        normalizedPath.includes("/kanon/v2/")
      ) {
        continue;
      }
      files.push(full);
    }
  }
  return files;
}

export default defineConfig({
  base: "./",
  build: {
    sourcemap: false,
    outDir: "dist",
    rollupOptions: {
      input: [
        path.resolve(__dirname, "index.html"),
        ...collectJsFiles(pithosDist),
      ],
      output: {
        manualChunks(id) {
          const p = id.split(path.sep).join("/");
          if (p.includes("/arkhe/")) return "arkhe";
          if (p.includes("/kanon/")) return "kanon";
          if (p.includes("/taphos/")) return "taphos";
          if (p.includes("/zygos/")) return "zygos";
          if (p.includes("/sphalma/")) return "sphalma";
          return undefined;
        },
      },
      treeshake: false,
    },
  },
  resolve: {
    alias: {
      // Fallback to dist code (matches published package import paths)
      "@arkhe": path.resolve(__dirname, "../../pithos/dist/arkhe"),
      "@kanon": path.resolve(__dirname, "../../pithos/dist/kanon"),
      "@zygos": path.resolve(__dirname, "../../pithos/dist/zygos"),
      "@sphalma": path.resolve(__dirname, "../../pithos/dist/sphalma"),
      "@taphos": path.resolve(__dirname, "../../pithos/dist/taphos"),
    },
  },
  plugins: [preact()],
});
