#!/usr/bin/env node
/**
 * Script to verify that modules from @arkhe/test are only imported in test files (*.test.ts)
 *
 * This script:
 * 1. Scans all files in packages/pithos/src/arkhe/test to discover test modules
 * 2. Finds all imports of these modules across the codebase
 * 3. Verifies that imports only occur in *.test.ts files
 */

import { readFile } from "fs/promises";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";
import { findTypeScriptFiles, isTestFile } from "./common/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, "..");
const TEST_MODULE_DIR = join(ROOT_DIR, "packages/pithos/src/arkhe/test");
const SOURCE_DIR = join(ROOT_DIR, "packages/pithos/src");

interface ImportViolation {
  file: string;
  importPath: string;
  line: number;
}

/**
 * Discovers all test modules by scanning the test directory
 */
async function discoverTestModules(): Promise<Set<string>> {
  const testFiles = await findTypeScriptFiles(TEST_MODULE_DIR);
  const modulePaths = new Set<string>();

  for (const file of testFiles) {
    const relativePath = relative(TEST_MODULE_DIR, file);
    const moduleName = relativePath.replace(/\.ts$/, "");

    // Add both alias path and relative path patterns
    modulePaths.add(`@arkhe/test/${moduleName}`);
    modulePaths.add(`arkhe/test/${moduleName}`);
    modulePaths.add(`@arkhe/test/${moduleName.replace(/\\/g, "/")}`);
    modulePaths.add(`arkhe/test/${moduleName.replace(/\\/g, "/")}`);
  }

  return modulePaths;
}

/**
 * Extracts import statements from a file
 */
function extractImports(content: string): Array<{ path: string; line: number }> {
  const imports: Array<{ path: string; line: number }> = [];

  // Match import statements:
  // - import ... from "path"
  // - import ... from 'path'
  // - import("path")
  // - require("path")
  const importRegex =
    /(?:import\s+(?:.*?\s+from\s+)?|import\s*\(|require\s*\()["']([^"']+)["']/g;

  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    const lineNumber =
      content.substring(0, match.index).split("\n").length;

    imports.push({ path: importPath, line: lineNumber });
  }

  return imports;
}

/**
 * Checks if an import path matches any test module pattern
 */
function matchesTestModule(
  importPath: string,
  testModules: Set<string>
): boolean {
  // Normalize path separators
  const normalizedPath = importPath.replace(/\\/g, "/");

  for (const testModule of testModules) {
    // Check exact match or if the import path contains the test module
    if (
      normalizedPath === testModule ||
      normalizedPath.includes(testModule) ||
      normalizedPath.endsWith(testModule) ||
      normalizedPath.startsWith(testModule)
    ) {
      return true;
    }

    // Also check without @ prefix (for relative imports)
    const moduleWithoutAt = testModule.replace(/^@/, "");
    if (
      normalizedPath === moduleWithoutAt ||
      normalizedPath.includes(moduleWithoutAt) ||
      normalizedPath.endsWith(moduleWithoutAt)
    ) {
      return true;
    }
  }

  return false;
}



/**
 * Main function to check test imports
 */
async function checkTestImports(): Promise<void> {
  console.log("🔍 Discovering test modules...");
  const testModules = await discoverTestModules();

  if (testModules.size === 0) {
    console.log("⚠️  No test modules found in", TEST_MODULE_DIR);
    return;
  }

  console.log(`✅ Found ${testModules.size} test module patterns to check\n`);

  console.log("🔍 Scanning source files for imports...");
  const sourceFiles = await findTypeScriptFiles(SOURCE_DIR);
  const violations: ImportViolation[] = [];

  for (const file of sourceFiles) {
    // Skip test files themselves
    if (file.startsWith(TEST_MODULE_DIR)) {
      continue;
    }

    const content = await readFile(file, "utf-8");
    const imports = extractImports(content);

    for (const imp of imports) {
      // Check if this import matches any test module pattern
      if (matchesTestModule(imp.path, testModules)) {
        // Check if it's a test file
        if (!isTestFile(file)) {
          const relativePath = relative(ROOT_DIR, file);
          violations.push({
            file: relativePath,
            importPath: imp.path,
            line: imp.line,
          });
        }
      }
    }
  }

  // Report results
  if (violations.length === 0) {
    console.log("✅ All test module imports are correctly restricted to test files!\n");
    process.exit(0);
  } else {
    console.error(
      `❌ Found ${violations.length} violation(s) of test module import rules:\n`
    );

    for (const violation of violations) {
      console.error(
        `  ${violation.file}:${violation.line} - imports "${violation.importPath}"`
      );
    }

    console.error(
      `\n⚠️  Test modules from @arkhe/test should only be imported in *.test.ts files.\n`
    );
    process.exit(1);
  }
}

// Run the check
checkTestImports().catch((error) => {
  console.error("❌ Error running check:", error);
  process.exit(1);
});

