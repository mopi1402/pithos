/**
 * Build the practical-example demo and copy it to static/demos/
 * Also generates a JSON file with the source code for display
 */

import { execSync } from "child_process";
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEBSITE_ROOT = join(__dirname, "..");
const DEMO_ROOT = join(WEBSITE_ROOT, "..", "..", "pithos", "examples", "practical-example");
const STATIC_DEMO_DIR = join(WEBSITE_ROOT, "static", "demos", "practical-example");
const DATA_DIR = join(WEBSITE_ROOT, "src", "data");

// Source files to include in the code viewer
const SOURCE_FILES = [
  { path: "src/lib/schemas.ts", label: "schemas.ts", step: 1 },
  { path: "src/lib/api.ts", label: "api.ts", step: 2 },
  { path: "src/lib/transformers.ts", label: "transformers.ts", step: 3 },
  { path: "src/lib/types.ts", label: "types.ts", step: 0 },
  { path: "src/hooks/useDashboard.ts", label: "useDashboard.ts", step: 5 },
  { path: "src/components/Dashboard/index.tsx", label: "Dashboard.tsx", step: 5 },
];

function buildDemo() {
  console.log("🔨 Building practical-example demo...");
  
  // Build the demo app
  execSync("pnpm build", { 
    cwd: DEMO_ROOT, 
    stdio: "inherit" 
  });
  
  // Create static directory
  mkdirSync(STATIC_DEMO_DIR, { recursive: true });
  
  // Copy dist to static
  const distDir = join(DEMO_ROOT, "dist");
  cpSync(distDir, STATIC_DEMO_DIR, { recursive: true });
  
  console.log(`✅ Demo copied to ${STATIC_DEMO_DIR}`);
}

function generateSourceData() {
  console.log("📄 Generating source code data...");
  
  mkdirSync(DATA_DIR, { recursive: true });
  
  const sources: Record<string, { content: string; label: string; step: number }> = {};
  
  for (const file of SOURCE_FILES) {
    const filePath = join(DEMO_ROOT, file.path);
    if (existsSync(filePath)) {
      const content = readFileSync(filePath, "utf-8");
      sources[file.path] = {
        content,
        label: file.label,
        step: file.step,
      };
    } else {
      console.warn(`⚠️ File not found: ${filePath}`);
    }
  }
  
  const outputPath = join(DATA_DIR, "demo-sources.json");
  writeFileSync(outputPath, JSON.stringify(sources, null, 2));
  
  console.log(`✅ Source data written to ${outputPath}`);
}

function main() {
  buildDemo();
  generateSourceData();
  console.log("🎉 Demo build complete!");
}

main();
