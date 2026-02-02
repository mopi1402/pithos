// scripts/merge-docs.ts
// Merge api-docs + use_cases (from documentation folder) + overrides → MDX final
// Run: pnpm doc:merge

import * as fs from "node:fs";
import * as path from "node:path";
import { OUTPUT, countFiles, INTERMEDIATE_BASE } from "./common/index.js";
import { loadAliases } from "./merge-docs/loaders.js";
import { processApiDocs } from "./merge-docs/processor.js";
import { generateIndexFiles } from "./merge-docs/index-generator.js";
import type { FunctionUseCases } from "./merge-docs/types.js";

/**
 * Main entry point for documentation merging.
 * Use cases are now loaded directly from packages/main/documentation/use_cases/
 * during file processing (like how-it-works).
 */
function main() {
  console.log("Loading aliases...");
  const aliasesMap = loadAliases();
  console.log(`Loaded ${aliasesMap.size} function aliases`);

  console.log("Cleaning output directory...");
  if (fs.existsSync(OUTPUT)) {
    fs.rmSync(OUTPUT, { recursive: true });
  }
  fs.mkdirSync(OUTPUT, { recursive: true });

  console.log("Processing API docs (use cases loaded from documentation/use_cases)...");
  const allUseCases: FunctionUseCases[] = [];
  processApiDocs(aliasesMap, allUseCases);

  // Write Use Cases JSON Index
  const useCasesJsonPath = path.join(INTERMEDIATE_BASE, "use-cases.json");
  if (!fs.existsSync(INTERMEDIATE_BASE)) {
    fs.mkdirSync(INTERMEDIATE_BASE, { recursive: true });
  }
  fs.writeFileSync(useCasesJsonPath, JSON.stringify(allUseCases, null, 2));
  console.log(`✅ Generated Use Cases Index: ${useCasesJsonPath} (${allUseCases.length} items)`);

  console.log("Generating index files...");
  generateIndexFiles();

  // Count output files
  const count = countFiles(OUTPUT);
  console.log(`✅ Generated ${count} files in ${OUTPUT}`);
}

main();

