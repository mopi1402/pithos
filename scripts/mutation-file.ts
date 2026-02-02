/**
 * Run mutation testing on a single file with its sidecar test file.
 * 
 * Usage: npx tsx scripts/mutation-file.ts <relative-path>
 * 
 * Example:
 *   npx tsx scripts/mutation-file.ts arkhe/array/chunk.ts
 *   → Runs: pnpm stryker run --mutate "packages/pithos/src/arkhe/array/chunk.ts" 
 *           --testFiles "packages/pithos/src/arkhe/array/chunk.test.ts"
 */

import { spawn } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

const SRC_BASE = "packages/pithos/src";

function main(): void {
  // Filter out "--" that pnpm adds when passing arguments
  const args = process.argv.slice(2).filter(arg => arg !== '--');
  
  if (args.length === 0) {
    console.error("❌ Missing file path argument");
    console.error("\nUsage: npx tsx scripts/mutation-file.ts <relative-path>");
    console.error("\nExamples:");
    console.error("  npx tsx scripts/mutation-file.ts arkhe/array/chunk.ts");
    console.error("  npx tsx scripts/mutation-file.ts arkhe/string/camel-case.ts");
    process.exit(1);
  }

  let relativePath = args[0];
  
  // Remove .ts extension if provided
  if (relativePath.endsWith(".ts")) {
    relativePath = relativePath.slice(0, -3);
  }
  
  // Remove .test suffix if accidentally provided
  if (relativePath.endsWith(".test")) {
    relativePath = relativePath.slice(0, -5);
  }

  const srcFile = join(SRC_BASE, `${relativePath}.ts`);
  const testFile = join(SRC_BASE, `${relativePath}.test.ts`);

  // Validate source file exists
  if (!existsSync(srcFile)) {
    console.error(`❌ Source file not found: ${srcFile}`);
    process.exit(1);
  }

  // Validate test file exists
  if (!existsSync(testFile)) {
    console.error(`❌ Test file not found: ${testFile}`);
    console.error(`   Expected sidecar test file at: ${testFile}`);
    process.exit(1);
  }

  console.log(`\n🧬 Running mutation tests on: ${srcFile}`);
  console.log(`   Test file: ${testFile}\n`);

  const child = spawn(
    "pnpm",
    [
      "stryker",
      "run",
      "--mutate",
      srcFile,
      "--testFiles",
      testFile,
    ],
    {
      stdio: "inherit",
      shell: false,
    }
  );

  child.on("close", (code) => {
    process.exit(code ?? 0);
  });
}

main();
