#!/usr/bin/env node

/**
 * Dependency verification script before publication
 *
 * This script verifies that there are no 'dependencies' or 'devDependencies'
 * in the pithos package.json to avoid any external dependencies.
 */

import { readFileSync } from "fs";
import { join } from "path";

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

function checkDependencies() {
  console.log("🔍 Checking dependencies for pithos...");

  try {
    // Read pithos package.json
    const packageJsonPath = join(process.cwd(), "packages/pithos/package.json");
    const packageJsonContent = readFileSync(packageJsonPath, "utf-8");
    const packageJson: PackageJson = JSON.parse(packageJsonContent);

    // Check if there are dependencies
    if (
      packageJson.dependencies &&
      Object.keys(packageJson.dependencies).length > 0
    ) {
      console.error(
        "❌ ERROR: Dependencies found in packages/pithos/package.json:"
      );
      console.error("");

      Object.entries(packageJson.dependencies).forEach(([name, version]) => {
        console.error(`  - ${name}: ${version}`);
      });

      console.error("");
      console.error("🚫 Publication blocked!");
      console.error("");
      console.error("💡 Solution:");
      console.error(
        "  1. Remove dependencies from packages/pithos/package.json"
      );
      console.error("  2. Move them to devDependencies if necessary");
      console.error("");

      process.exit(1);
    }

    // Check devDependencies
    if (
      packageJson.devDependencies &&
      Object.keys(packageJson.devDependencies).length > 0
    ) {
      console.error(
        "❌ ERROR: devDependencies found in packages/pithos/package.json:"
      );
      console.error("");

      Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
        console.error(`  - ${name}: ${version}`);
      });

      console.error("");
      console.error("🚫 Publication blocked!");
      console.error("");
      console.error("💡 Solution:");
      console.error(
        "  1. Remove devDependencies from packages/pithos/package.json"
      );
      console.error(
        "  2. Move them to root package.json devDependencies if necessary"
      );
      console.error("");

      process.exit(1);
    }

    console.log("✅ No dependencies found in pithos - Publication allowed!");
  } catch (error) {
    console.error("❌ Error reading packages/pithos/package.json:", error);
    process.exit(1);
  }
}

// Execute verification
checkDependencies();
