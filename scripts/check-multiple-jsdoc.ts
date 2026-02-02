#!/usr/bin/env tsx
/**
 * Detect functions with multiple JSDoc comments (one per overload) instead of a single JSDoc before all signatures.
 * 
 * This pattern causes TypeDoc to not generate documentation pages.
 * 
 * Correct pattern:
 * ```typescript
 * /**
 *  * Single JSDoc before all signatures
 *  *\/
 * export function fn(a: string): void;
 * export function fn(a: number): void;
 * export function fn(a: string | number): void { }
 * ```
 * 
 * Incorrect pattern:
 * ```typescript
 * /**
 *  * JSDoc on first overload
 *  *\/
 * export function fn(a: string): void;
 * /**
 *  * JSDoc on second overload
 *  *\/
 * export function fn(a: number): void;
 * export function fn(a: string | number): void { }
 * ```
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

interface Issue {
  file: string;
  functionName: string;
  line: number;
  jsdocCount: number;
}

/**
 * Check if a file has functions with multiple JSDoc comments.
 */
function checkFile(filePath: string): Issue[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const issues: Issue[] = [];

  // Find all export function declarations
  const functionRegex = /export\s+(?:async\s+)?function\s+(\w+)/g;
  let match;
  const functions = new Map<string, number[]>(); // functionName -> line numbers

  while ((match = functionRegex.exec(content)) !== null) {
    const fnName = match[1];
    const lineNumber = content.substring(0, match.index).split("\n").length;
    
    if (!functions.has(fnName)) {
      functions.set(fnName, []);
    }
    functions.get(fnName)!.push(lineNumber);
  }

  // For each function with multiple declarations (overloads), check JSDoc pattern
  for (const [fnName, lineNumbers] of functions.entries()) {
    if (lineNumbers.length <= 1) continue; // No overloads

    // Count how many of these declarations have JSDoc immediately before them
    let jsdocCount = 0;
    
    for (const lineNum of lineNumbers) {
      // Check if there's a JSDoc comment ending just before this line
      let checkLine = lineNum - 2; // -1 for 0-index, -1 more to check line before
      
      // Skip empty lines
      while (checkLine >= 0 && lines[checkLine].trim() === "") {
        checkLine--;
      }
      
      if (checkLine >= 0 && lines[checkLine].trim() === "*/") {
        // Found JSDoc end, check if it's not @ignore
        let jsdocStart = checkLine;
        while (jsdocStart >= 0 && !lines[jsdocStart].includes("/**")) {
          jsdocStart--;
        }
        
        const jsdocContent = lines.slice(jsdocStart, checkLine + 1).join("\n");
        if (!jsdocContent.includes("@ignore")) {
          jsdocCount++;
        }
      }
    }

    // If we have multiple JSDoc comments (more than 1), it's an issue
    if (jsdocCount > 1) {
      issues.push({
        file: path.relative(SRC_DIR, filePath),
        functionName: fnName,
        line: lineNumbers[0],
        jsdocCount,
      });
    }
  }

  return issues;
}

/**
 * Recursively scan directories for TypeScript files.
 */
function scanDirectory(dir: string): Issue[] {
  const allIssues: Issue[] = [];

  function scan(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
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
        if (
          entry.name.endsWith(".test.ts") ||
          entry.name.endsWith(".bench.ts") ||
          entry.name.endsWith(".spec.ts")
        ) {
          continue;
        }

        const issues = checkFile(fullPath);
        allIssues.push(...issues);
      }
    }
  }

  scan(dir);
  return allIssues;
}

/**
 * Main check function.
 */
function checkMultipleJSDoc() {
  console.log("🔍 Checking for functions with multiple JSDoc comments...\n");

  const modules = ["arkhe", "taphos"];
  const allIssues: Issue[] = [];

  for (const module of modules) {
    const moduleDir = path.join(SRC_DIR, module);
    if (!fs.existsSync(moduleDir)) {
      console.log(`⚠️  Module directory not found: ${module}`);
      continue;
    }

    console.log(`📦 Checking ${module}...`);
    const issues = scanDirectory(moduleDir);
    allIssues.push(...issues);
  }

  console.log("\n" + "=".repeat(80));
  console.log("📊 Results:");
  console.log("=".repeat(80) + "\n");

  if (allIssues.length === 0) {
    console.log("✅ No issues found! All functions follow the correct JSDoc pattern.");
    return 0;
  }

  console.log(`❌ Found ${allIssues.length} function(s) with multiple JSDoc comments:\n`);

  // Group by module
  const byModule = new Map<string, Issue[]>();
  for (const issue of allIssues) {
    const module = issue.file.split(path.sep)[0];
    if (!byModule.has(module)) {
      byModule.set(module, []);
    }
    byModule.get(module)!.push(issue);
  }

  for (const [module, issues] of byModule.entries()) {
    console.log(`\n📁 ${module}:`);
    for (const issue of issues) {
      console.log(`   ❌ ${issue.functionName} (${issue.jsdocCount} JSDoc comments)`);
      console.log(`      File: ${issue.file}:${issue.line}`);
    }
  }

  console.log("\n" + "=".repeat(80));
  console.log(`Total: ${allIssues.length} functions need fixing`);
  console.log("=".repeat(80) + "\n");

  console.log("💡 Fix: Move all JSDoc to BEFORE the first signature, keep only @ignore on implementation.");
  console.log("   See: .cursor/rules/tsdoc.mdc - 'Functions with Multiple Overloads'\n");

  return 1;
}

// Run the check
const exitCode = checkMultipleJSDoc();
process.exit(exitCode);
