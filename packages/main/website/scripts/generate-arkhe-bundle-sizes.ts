#!/usr/bin/env npx tsx
/* eslint-disable no-console */
/**
 * Generate bundle size comparison data for Arkhe and Taphos utilities
 *
 * This script:
 * 1. Discovers utilities from both Arkhe and Taphos modules
 * 2. Reads alias files to find equivalents in other libraries
 * 3. Measures bundle sizes with tree-shaking using esbuild
 * 4. Generates a JSON report with separate sections for each module
 *
 * Usage: npx tsx scripts/generate-arkhe-bundle-sizes.ts
 *
 * The output is written to src/data/arkhe-bundle-sizes.json
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, readdirSync } from "node:fs";
import { gzipSync, brotliCompressSync } from "node:zlib";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const tmpDir = join(__dirname, ".tmp-bundle");
const outputDir = join(__dirname, "../src/data");
const outputPath = join(outputDir, "arkhe-bundle-sizes.json");
const aliasDir = join(__dirname, "../../documentation/alias");

// Paths
const projectRoot = join(__dirname, "../../../..");
const esbuildPath = join(projectRoot, "node_modules/.bin/esbuild");

// Module configurations
const MODULES = ["arkhe", "taphos"] as const;
type Module = (typeof MODULES)[number];

// Number of top utilities to include per module
const TOP_UTILS_COUNT = 50;

// Libraries to compare - different for each module
const ARKHE_LIBRARIES = ["lodash", "es-toolkit", "remeda", "radashi"] as const;
const TAPHOS_LIBRARIES = ["lodash", "es-toolkit", "es-toolkit/compat", "remeda", "radashi"] as const;
type Library = "lodash" | "es-toolkit" | "es-toolkit/compat" | "remeda" | "radashi";

// Alias key mapping (how libraries are named in alias files)
const ALIAS_KEY_MAP: Record<Library, string> = {
  lodash: "lodash",
  "es-toolkit": "es-toolkit",
  "es-toolkit/compat": "es-toolkit", // Same key, but we check group === "compat"
  remeda: "remeda",
  radashi: "radashi",
};

interface AliasEntry {
  name: string;
  group: string;
}

interface AliasData {
  [utilName: string]: {
    [library: string]: AliasEntry | null;
  };
}

interface BundleResult {
  utilName: string;
  category: string;
  library: string;
  libraryFunctionName: string | null;
  rawBytes: number | null;
  gzipBytes: number | null;
  brotliBytes: number | null;
  error?: string;
}

interface LibraryVersions {
  pithos: string;
  [key: string]: string;
}

interface ModuleData {
  topUtils: string[];
  libraries: string[];
  results: BundleResult[];
}

interface BundleData {
  generatedAt: string;
  versions: LibraryVersions;
  modules: {
    arkhe: ModuleData;
    taphos: ModuleData;
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  return `${kb.toFixed(2)} kB`;
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function cleanup(): void {
  if (existsSync(tmpDir)) {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

// ============================================
// VERSION DETECTION
// ============================================

function getVersions(): LibraryVersions {
  const pithosPkg = JSON.parse(
    readFileSync(join(projectRoot, "packages/pithos/package.json"), "utf-8")
  );

  const versions: LibraryVersions = {
    pithos: pithosPkg.version,
  };

  // All unique libraries to get versions for
  const allLibraries = ["lodash", "es-toolkit", "remeda", "radashi"] as const;

  // Package names for version lookup
  const libraryPackageNames: Record<string, string> = {
    lodash: "lodash-es",
    "es-toolkit": "es-toolkit",
    remeda: "remeda",
    radashi: "radashi",
  };

  for (const lib of allLibraries) {
    const pkgName = libraryPackageNames[lib];
    try {
      const pkgPath = join(projectRoot, "node_modules", pkgName, "package.json");
      if (existsSync(pkgPath)) {
        versions[lib] = JSON.parse(readFileSync(pkgPath, "utf-8")).version;
      } else {
        versions[lib] = "not installed";
      }
    } catch {
      versions[lib] = "not installed";
    }
  }

  return versions;
}

// ============================================
// ALIAS DATA LOADING
// ============================================

function loadAllAliasData(): AliasData {
  const combined: AliasData = {};
  
  // Read all JSON files in alias directory
  const files = readdirSync(aliasDir).filter(f => f.endsWith(".json"));
  
  for (const file of files) {
    const filePath = join(aliasDir, file);
    try {
      const data = JSON.parse(readFileSync(filePath, "utf-8"));
      Object.assign(combined, data);
    } catch {
      console.warn(`Warning: Could not parse ${file}`);
    }
  }

  return combined;
}

// ============================================
// FILE DISCOVERY
// ============================================

interface FileInfo {
  utilName: string;
  filePath: string;
  exportName: string;
}

function discoverModuleFiles(moduleName: Module): Map<string, FileInfo> {
  const distPath = join(projectRoot, "packages/pithos/dist", moduleName);
  const fileMap = new Map<string, FileInfo>();
  
  function walkDir(dir: string): void {
    if (!existsSync(dir)) return;
    
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      
      if (entry.isDirectory()) {
        if (!["test", "tests", "__tests__", "types"].includes(entry.name)) {
          walkDir(fullPath);
        }
      } else if (entry.name.endsWith(".js") && !entry.name.endsWith(".test.js")) {
        const baseName = basename(entry.name, ".js");
        const camelName = baseName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        
        fileMap.set(camelName, {
          utilName: camelName,
          filePath: fullPath,
          exportName: camelName,
        });
        
        if (baseName !== camelName) {
          fileMap.set(baseName, {
            utilName: camelName,
            filePath: fullPath,
            exportName: camelName,
          });
        }
      }
    }
  }
  
  walkDir(distPath);
  return fileMap;
}

// ============================================
// BUNDLE MEASUREMENT
// ============================================

function bundleCode(code: string, cwd: string): string | null {
  ensureDir(tmpDir);

  const inputPath = join(tmpDir, "input.ts");
  const outPath = join(tmpDir, "out.js");

  writeFileSync(inputPath, code);

  try {
    execSync(
      `"${esbuildPath}" "${inputPath}" --bundle --format=esm --outfile="${outPath}" --minify --tree-shaking=true 2>&1`,
      { cwd, stdio: "pipe" }
    );

    return readFileSync(outPath, "utf-8");
  } catch {
    return null;
  }
}

function measureBundle(code: string, cwd: string): { rawBytes: number; gzipBytes: number; brotliBytes: number } | null {
  const content = bundleCode(code, cwd);
  if (!content) return null;

  const rawBytes = Buffer.byteLength(content, "utf-8");
  const gzipBytes = gzipSync(content).length;
  const brotliBytes = brotliCompressSync(content).length;

  return { rawBytes, gzipBytes, brotliBytes };
}

// ============================================
// IMPORT CODE GENERATION
// ============================================

function getPithosImportCode(fileInfo: FileInfo): string {
  return `import { ${fileInfo.exportName} } from "${fileInfo.filePath}";\nexport { ${fileInfo.exportName} };`;
}

function getLibraryImportCode(library: Library, functionName: string, alias?: AliasEntry): string {
  let packageName: string;
  
  if (library === "es-toolkit" && alias) {
    // Use the correct import path based on alias group
    packageName = getEsToolkitImportPath(alias);
  } else {
    const packageNames: Record<Library, string> = {
      lodash: "lodash-es",
      "es-toolkit": "es-toolkit",
      "es-toolkit/compat": "es-toolkit/compat",
      remeda: "remeda",
      radashi: "radashi",
    };
    packageName = packageNames[library];
  }
  
  return `import { ${functionName} } from "${packageName}";\nexport { ${functionName} };`;
}

// ============================================
// ALIAS LOOKUP
// ============================================

/**
 * Get alias for a library, handling es-toolkit vs es-toolkit/compat distinction
 * For Arkhe: merge es-toolkit and es-toolkit/compat into one "es-toolkit" column
 * For Taphos: keep them separate
 */
function getAliasForLibrary(
  aliases: { [library: string]: AliasEntry | null } | undefined,
  library: Library,
  moduleName: Module
): AliasEntry | null {
  if (!aliases) return null;
  
  const esToolkitAlias = aliases["es-toolkit"];
  
  if (library === "es-toolkit") {
    if (moduleName === "arkhe") {
      // For Arkhe: return any es-toolkit alias (normal or compat)
      return esToolkitAlias ?? null;
    } else {
      // For Taphos: only return if it's NOT a compat function
      if (esToolkitAlias && esToolkitAlias.group !== "compat") {
        return esToolkitAlias;
      }
      return null;
    }
  }
  
  if (library === "es-toolkit/compat") {
    // Only return if it IS a compat function
    if (esToolkitAlias && esToolkitAlias.group === "compat") {
      return esToolkitAlias;
    }
    return null;
  }
  
  // For other libraries, use direct lookup
  return aliases[ALIAS_KEY_MAP[library]] ?? null;
}

/**
 * Get the import path for es-toolkit based on the alias group
 */
function getEsToolkitImportPath(alias: AliasEntry): string {
  return alias.group === "compat" ? "es-toolkit/compat" : "es-toolkit";
}

// ============================================
// TOP UTILS SELECTION
// ============================================

interface UtilScore {
  name: string;
  score: number;
  category: string;
}

function selectTopUtils(
  moduleFiles: Map<string, FileInfo>,
  aliasData: AliasData,
  moduleName: Module,
  count: number
): string[] {
  const scores: UtilScore[] = [];
  const distPath = join(projectRoot, "packages/pithos/dist", moduleName);
  const librariesToCheck = moduleName === "arkhe" ? ARKHE_LIBRARIES : TAPHOS_LIBRARIES;

  for (const [utilName, fileInfo] of moduleFiles) {
    if (utilName.includes("-")) continue;

    const aliases = aliasData[utilName];
    if (!aliases) continue;

    // Count how many libraries have this util
    let score = 0;
    const seenLibs = new Set<string>();
    
    for (const lib of librariesToCheck) {
      const alias = getAliasForLibrary(aliases, lib, moduleName);
      if (alias) {
        // Don't double-count es-toolkit variants
        const baseLib = lib.startsWith("es-toolkit") ? "es-toolkit" : lib;
        if (!seenLibs.has(baseLib)) {
          seenLibs.add(baseLib);
          score++;
        }
      }
    }

    if (score >= 2) {
      const category = detectCategory(fileInfo, distPath);
      scores.push({ name: utilName, score, category });
    }
  }

  scores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.name.localeCompare(b.name);
  });

  return scores.slice(0, count).map((s) => s.name);
}

function detectCategory(fileInfo: FileInfo, distPath: string): string {
  const relativePath = fileInfo.filePath.replace(distPath + "/", "");
  const parts = relativePath.split("/");
  if (parts.length > 1) {
    return parts[0];
  }
  return "unknown";
}

// ============================================
// PROCESS MODULE
// ============================================

function processModule(
  moduleName: Module,
  moduleFiles: Map<string, FileInfo>,
  aliasData: AliasData,
  versions: LibraryVersions
): ModuleData {
  const distPath = join(projectRoot, "packages/pithos/dist", moduleName);
  const librariesToCompare = moduleName === "arkhe" ? ARKHE_LIBRARIES : TAPHOS_LIBRARIES;
  
  const topUtils = selectTopUtils(moduleFiles, aliasData, moduleName, TOP_UTILS_COUNT);
  console.log(`\n🎯 Selected ${topUtils.length} top utilities for ${moduleName.toUpperCase()}\n`);

  const results: BundleResult[] = [];

  for (const utilName of topUtils) {
    const fileInfo = moduleFiles.get(utilName) || moduleFiles.get(toKebabCase(utilName));
    const category = fileInfo ? detectCategory(fileInfo, distPath) : "unknown";
    
    console.log(`📦 ${utilName} (${category})...`);

    // Measure Pithos
    if (fileInfo) {
      const pithosCode = getPithosImportCode(fileInfo);
      const pithosResult = measureBundle(pithosCode, projectRoot);

      results.push({
        utilName,
        category,
        library: "pithos",
        libraryFunctionName: fileInfo.exportName,
        rawBytes: pithosResult?.rawBytes ?? null,
        gzipBytes: pithosResult?.gzipBytes ?? null,
        brotliBytes: pithosResult?.brotliBytes ?? null,
        error: pithosResult ? undefined : "Bundle failed",
      });

      if (pithosResult) {
        console.log(`   ✓ Pithos: ${formatBytes(pithosResult.gzipBytes)} gzip`);
      } else {
        console.log(`   ✗ Pithos: bundle failed`);
      }
    } else {
      results.push({
        utilName,
        category,
        library: "pithos",
        libraryFunctionName: null,
        rawBytes: null,
        gzipBytes: null,
        brotliBytes: null,
        error: "Not found",
      });
      console.log(`   - Pithos: not found`);
    }

    // Measure each comparison library
    const aliases = aliasData[utilName];
    
    for (const library of librariesToCompare) {
      const alias = getAliasForLibrary(aliases, library, moduleName);

      if (!alias) {
        results.push({
          utilName,
          category,
          library,
          libraryFunctionName: null,
          rawBytes: null,
          gzipBytes: null,
          brotliBytes: null,
          error: "Not available",
        });
        console.log(`   - ${library}: not available`);
        continue;
      }

      // Check if library is installed
      const baseLib = library.startsWith("es-toolkit") ? "es-toolkit" : library;
      if (versions[baseLib] === "not installed") {
        results.push({
          utilName,
          category,
          library,
          libraryFunctionName: alias.name,
          rawBytes: null,
          gzipBytes: null,
          brotliBytes: null,
          error: "Library not installed",
        });
        console.log(`   - ${library}: not installed`);
        continue;
      }

      const code = getLibraryImportCode(library, alias.name, alias);
      const result = measureBundle(code, projectRoot);

      results.push({
        utilName,
        category,
        library,
        libraryFunctionName: alias.name,
        rawBytes: result?.rawBytes ?? null,
        gzipBytes: result?.gzipBytes ?? null,
        brotliBytes: result?.brotliBytes ?? null,
        error: result ? undefined : "Bundle failed",
      });

      if (result) {
        console.log(`   ✓ ${library} (${alias.name}): ${formatBytes(result.gzipBytes)} gzip`);
      } else {
        console.log(`   ✗ ${library} (${alias.name}): bundle failed`);
      }
    }

    console.log();
  }

  return { topUtils, libraries: ["pithos", ...librariesToCompare], results };
}

// ============================================
// MAIN
// ============================================

async function main(): Promise<void> {
  console.log("🔬 Generating bundle size comparison data for Arkhe & Taphos...\n");

  for (const mod of MODULES) {
    const distPath = join(projectRoot, "packages/pithos/dist", mod);
    if (!existsSync(distPath)) {
      console.error(`❌ ${mod} dist not found. Run 'pnpm build' first.`);
      process.exit(1);
    }
  }

  if (!existsSync(esbuildPath)) {
    console.error("❌ esbuild not found. Run 'pnpm install' at project root first.");
    process.exit(1);
  }

  const versions = getVersions();
  const aliasData = loadAllAliasData();
  
  console.log("📦 Library versions:");
  for (const [lib, version] of Object.entries(versions)) {
    console.log(`   ${lib}: ${version}`);
  }

  const arkheFiles = discoverModuleFiles("arkhe");
  const taphosFiles = discoverModuleFiles("taphos");
  
  console.log(`\n📂 Discovered ${arkheFiles.size} Arkhe utilities`);
  console.log(`📂 Discovered ${taphosFiles.size} Taphos utilities`);

  console.log("\n" + "═".repeat(60));
  console.log("━━━ ARKHE ━━━");
  console.log("═".repeat(60));
  const arkheData = processModule("arkhe", arkheFiles, aliasData, versions);

  console.log("\n" + "═".repeat(60));
  console.log("━━━ TAPHOS ━━━");
  console.log("═".repeat(60));
  const taphosData = processModule("taphos", taphosFiles, aliasData, versions);

  cleanup();

  ensureDir(outputDir);

  const data: BundleData = {
    generatedAt: new Date().toISOString(),
    versions,
    modules: {
      arkhe: arkheData,
      taphos: taphosData,
    },
  };

  writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log("═".repeat(60));
  console.log("✅ Bundle data generated successfully!");
  console.log(`   Output: ${outputPath}`);
  console.log(`   Arkhe: ${arkheData.topUtils.length} utilities`);
  console.log(`   Taphos: ${taphosData.topUtils.length} utilities`);
  console.log("═".repeat(60) + "\n");

  printSummaryTable("ARKHE", arkheData);
  printSummaryTable("TAPHOS", taphosData);
}

function printSummaryTable(moduleName: string, moduleData: ModuleData): void {
  console.log(`\n📊 ${moduleName} Summary - Top ${moduleData.topUtils.length} Utils (gzip bytes):\n`);
  
  const header = moduleData.libraries.map(s => s.padEnd(14)).join(" | ");
  console.log(`| ${header} |`);
  console.log(`|${"-".repeat(header.length + 2)}|`);

  for (const utilName of moduleData.topUtils.slice(0, 15)) {
    const cells = [utilName.padEnd(14)];
    
    for (const lib of moduleData.libraries.slice(1)) { // Skip "pithos" in first position, it's in utilName
      const r = moduleData.results.find(r => r.utilName === utilName && r.library === lib);
      const value = r?.gzipBytes ? formatBytes(r.gzipBytes) : "-";
      cells.push(value.padEnd(14));
    }
    
    console.log(`| ${cells.join(" | ")} |`);
  }
  
  if (moduleData.topUtils.length > 15) {
    console.log(`| ... and ${moduleData.topUtils.length - 15} more utilities |`);
  }
}

main().catch((error) => {
  console.error(error);
  cleanup();
  process.exit(1);
});
