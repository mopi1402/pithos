#!/usr/bin/env tsx
/**
 * Check that all exported functions from arkhe/taphos have corresponding documentation pages.
 * 
 * This script:
 * 1. Scans all TypeScript files in arkhe/ and taphos/ directories
 * 2. Extracts exported function names
 * 3. Checks if corresponding .md files exist in the generated documentation
 * 4. Reports missing documentation pages
 * 
 * @since 1.1.0
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "packages/pithos/src");
const DOC_DIR = path.join(ROOT, "packages/main/documentation/_generated/final");

interface CheckResult {
  module: string;
  category: string;
  functionName: string;
  sourceFile: string;
  docPath: string;
  exists: boolean;
}

/**
 * Extract exported function names from a TypeScript file.
 */
function extractExportedFunctions(filePath: string): string[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const functions = new Set<string>();

  // Match: export function functionName
  // Match: export async function functionName
  const exportFunctionRegex = /export\s+(?:async\s+)?function\s+(\w+)/g;
  let match;
  while ((match = exportFunctionRegex.exec(content)) !== null) {
    const fnName = match[1];
    // Skip if it has @ignore or @internal
    const beforeMatch = content.substring(0, match.index);
    const lastCommentStart = beforeMatch.lastIndexOf("/**");
    if (lastCommentStart !== -1) {
      const comment = content.substring(lastCommentStart, match.index);
      if (comment.includes("@ignore") || comment.includes("@internal")) {
        continue;
      }
    }
    functions.add(fnName);
  }

  return Array.from(functions);
}

/**
 * Recursively scan a directory for TypeScript files.
 */
function scanDirectory(dir: string, baseDir: string): Map<string, string[]> {
  const results = new Map<string, string[]>();

  function scan(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        // Skip test, benchmark, and internal directories
        if (
          entry.name === "__tests__" ||
          entry.name === "benchmarks" ||
          entry.name === "_internal" ||
          entry.name === "test"
        ) {
          continue;
        }
        scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".ts")) {
        // Skip test and benchmark files
        if (
          entry.name.endsWith(".test.ts") ||
          entry.name.endsWith(".bench.ts") ||
          entry.name.endsWith(".spec.ts")
        ) {
          continue;
        }

        const functions = extractExportedFunctions(fullPath);
        if (functions.length > 0) {
          const relativePath = path.relative(baseDir, fullPath);
          results.set(relativePath, functions);
        }
      }
    }
  }

  scan(dir);
  return results;
}

/**
 * Check if documentation exists for a function.
 * Searches in the category folder and its subfolders.
 */
function checkDocumentation(
  module: string,
  category: string,
  functionName: string,
  sourceFile: string
): CheckResult {
  // Try direct path first: {module}/{category}/{functionName}.md
  const directPath = path.join(DOC_DIR, module, category, `${functionName}.md`);
  if (fs.existsSync(directPath)) {
    return {
      module,
      category,
      functionName,
      sourceFile,
      docPath: path.relative(ROOT, directPath),
      exists: true,
    };
  }

  // Try subfolders: {module}/{category}/**/{functionName}.md
  const categoryDir = path.join(DOC_DIR, module, category);
  if (fs.existsSync(categoryDir)) {
    const found = findFileRecursively(categoryDir, `${functionName}.md`);
    if (found) {
      return {
        module,
        category,
        functionName,
        sourceFile,
        docPath: path.relative(ROOT, found),
        exists: true,
      };
    }
  }

  return {
    module,
    category,
    functionName,
    sourceFile,
    docPath: path.relative(ROOT, directPath),
    exists: false,
  };
}

/**
 * Recursively search for a file in a directory.
 */
function findFileRecursively(dir: string, fileName: string): string | null {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isFile() && entry.name === fileName) {
      return fullPath;
    }
    if (entry.isDirectory()) {
      const found = findFileRecursively(fullPath, fileName);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Main check function.
 */
function checkDocPages() {
  console.log("🔍 Checking documentation pages for arkhe and taphos...\n");

  const modules = ["arkhe", "taphos"];
  const allResults: CheckResult[] = [];
  let missingCount = 0;

  for (const module of modules) {
    const moduleDir = path.join(SRC_DIR, module);
    if (!fs.existsSync(moduleDir)) {
      console.log(`⚠️  Module directory not found: ${module}`);
      continue;
    }

    console.log(`📦 Checking ${module}...`);

    const files = scanDirectory(moduleDir, moduleDir);

    for (const [relativePath, functions] of files.entries()) {
      // Extract category from path (e.g., "array/chunk.ts" -> "array")
      const parts = relativePath.split(path.sep);
      const category = parts[0];

      for (const functionName of functions) {
        const result = checkDocumentation(
          module,
          category,
          functionName,
          relativePath
        );
        allResults.push(result);

        if (!result.exists) {
          missingCount++;
        }
      }
    }
  }

  // Report results
  console.log("\n" + "=".repeat(80));
  console.log("📊 Results:");
  console.log("=".repeat(80) + "\n");

  if (missingCount === 0) {
    console.log("✅ All functions have documentation pages!");
    console.log(`   Total functions checked: ${allResults.length}`);
    return 0;
  }

  console.log(`❌ Found ${missingCount} missing documentation page(s):\n`);

  const missingByModule = new Map<string, CheckResult[]>();
  for (const result of allResults) {
    if (!result.exists) {
      const key = `${result.module}/${result.category}`;
      if (!missingByModule.has(key)) {
        missingByModule.set(key, []);
      }
      missingByModule.get(key)!.push(result);
    }
  }

  for (const [moduleCategory, results] of missingByModule.entries()) {
    console.log(`\n📁 ${moduleCategory}:`);
    for (const result of results) {
      console.log(`   ❌ ${result.functionName}`);
      console.log(`      Source: ${result.sourceFile}`);
      console.log(`      Expected: ${result.docPath}`);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log(`Total: ${allResults.length} functions, ${missingCount} missing`);
  console.log("=".repeat(80) + "\n");

  console.log("💡 Tip: Check if the function has @ignore or if TypeDoc failed to generate docs.");
  console.log("   Run: pnpm run doc:generate:api && pnpm run doc:merge\n");

  return 1;
}

// Run the check
const exitCode = checkDocPages();
process.exit(exitCode);
