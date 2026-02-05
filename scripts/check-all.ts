import { execSync } from "node:child_process";

interface CheckResult {
  name: string;
  success: boolean;
}

const checks = [
  { name: "lint", command: "pnpm run lint" },
  { name: "types", command: "pnpm run check:types" },
  { name: "tsdoc", command: "pnpm run check:tsdoc" },
  { name: "multiple-jsdoc", command: "pnpm run check:multiple-jsdoc" },
  { name: "test-imports", command: "pnpm run check:test-imports" },
  { name: "stryker-comments", command: "pnpm run check:stryker-comments" },
  { name: "dependencies", command: "pnpm run check:dependencies" },
];

const results: CheckResult[] = [];

for (const check of checks) {
  process.stdout.write(`\n📋 Running ${check.name}...\n`);
  try {
    execSync(check.command, { stdio: "inherit" });
    results.push({ name: check.name, success: true });
  } catch {
    results.push({ name: check.name, success: false });
  }
}

console.log("\n" + "═".repeat(40));
console.log("SUMMARY");
console.log("═".repeat(40));

for (const result of results) {
  const icon = result.success ? "✅" : "❌";
  console.log(`${icon} ${result.name}`);
}

const failed = results.filter((r) => !r.success);
if (failed.length > 0) {
  console.log("\n" + "─".repeat(40));
  console.log(`❌ ${failed.length} check(s) failed`);
  process.exit(1);
} else {
  console.log("\n" + "─".repeat(40));
  console.log("✅ All checks passed");
}
