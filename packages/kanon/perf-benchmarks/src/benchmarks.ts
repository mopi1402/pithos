#!/usr/bin/env node

/**
 * Main benchmark runner for all performance tests
 *
 * This script runs all compiled performance benchmarks to provide
 * accurate performance measurements with proper TypeScript compilation optimizations.
 */

import { execSync } from "child_process";
import { existsSync } from "fs";

console.log("🚀 Running Kanon Performance Benchmarks (Compiled)");
console.log("=================================================");
console.log("");

// Check if dist directory exists
if (!existsSync("./dist")) {
  console.log("📦 Building benchmarks...");
  try {
    execSync("npm run build", { stdio: "inherit" });
    console.log("✅ Build completed!\n");
  } catch (error) {
    console.error("❌ Build failed:", error);
    process.exit(1);
  }
}

// Test 1: Type Guards vs typeof
console.log("📊 Test 1: Type Guards vs Direct typeof");
console.log("--------------------------------------");
try {
  execSync("node dist/type-guards-vs-typeof.js", { stdio: "inherit" });
} catch (error) {
  console.error("❌ Type guards test failed:", error);
}
console.log("");

// Test 2: Messages Arrow Functions vs Strings
console.log("📊 Test 2: Messages Arrow Functions vs Strings");
console.log("---------------------------------------------");
try {
  execSync("node dist/messages-arrow-functions-vs-strings.js", {
    stdio: "inherit",
  });
} catch (error) {
  console.error("❌ Messages test failed:", error);
}
console.log("");

// Test 3: as any vs Proper Types
console.log("📊 Test 3: as any vs Proper Types");
console.log("--------------------------------");
try {
  execSync("node dist/as-any-vs-proper-types.js", { stdio: "inherit" });
} catch (error) {
  console.error("❌ as any test failed:", error);
}
console.log("");

console.log("✅ All performance benchmarks completed!");
console.log("");
console.log(
  "📝 These benchmarks justify the optimization choices made in Kanon V3:"
);
console.log("   - Direct typeof checks instead of type guards");
console.log("   - Direct strings instead of arrow functions for messages");
console.log("   - Proper type handling instead of 'as any' casts");
console.log("");
console.log(
  "🎯 Note: These tests use compiled TypeScript for accurate performance measurements."
);




