/**
 * Script to verify Stryker disable comments follow the rules:
 * - Only "Stryker disable next-line" is allowed
 * - "Stryker disable" without "next-line" is forbidden
 * - "Stryker restore" is forbidden
 */

import * as fs from "fs";
import * as path from "path";

const SRC_DIR = "packages/pithos/src";

interface Violation {
  file: string;
  line: number;
  content: string;
  type: "block-disable" | "restore";
}

function findViolations(filePath: string, content: string): Violation[] {
  const violations: Violation[] = [];
  const lines = content.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNumber = i + 1;

    // Check for "Stryker disable" without "next-line"
    if (
      line.includes("Stryker disable") &&
      !line.includes("Stryker disable next-line")
    ) {
      violations.push({
        file: filePath,
        line: lineNumber,
        content: line.trim(),
        type: "block-disable",
      });
    }

    // Check for "Stryker restore"
    if (line.includes("Stryker restore")) {
      violations.push({
        file: filePath,
        line: lineNumber,
        content: line.trim(),
        type: "restore",
      });
    }
  }

  return violations;
}

function walkDir(dir: string, callback: (filePath: string) => void): void {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else if (file.endsWith(".ts") && !file.endsWith(".test.ts")) {
      callback(filePath);
    }
  }
}

function main(): void {
  const allViolations: Violation[] = [];

  walkDir(SRC_DIR, (filePath) => {
    const content = fs.readFileSync(filePath, "utf-8");
    const violations = findViolations(filePath, content);
    allViolations.push(...violations);
  });

  if (allViolations.length === 0) {
    console.log("✅ All Stryker comments follow the rules (next-line only)");
    process.exit(0);
  }

  console.error("❌ Found invalid Stryker comments:\n");

  for (const v of allViolations) {
    const typeMsg =
      v.type === "block-disable"
        ? 'Use "Stryker disable next-line" instead of block disable'
        : '"Stryker restore" is forbidden';

    console.error(`  ${v.file}:${v.line}`);
    console.error(`    ${v.content}`);
    console.error(`    → ${typeMsg}\n`);
  }

  console.error(
    `\nTotal: ${allViolations.length} violation(s) found.`
  );
  console.error(
    "\nRule: Only 'Stryker disable next-line' is allowed. Block disable/restore patterns are forbidden."
  );

  process.exit(1);
}

main();
