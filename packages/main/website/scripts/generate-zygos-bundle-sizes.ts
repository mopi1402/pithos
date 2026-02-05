#!/usr/bin/env npx tsx
/* eslint-disable no-console */
/**
 * Generate bundle size comparison data for Zygos documentation
 *
 * This script measures bundle sizes for Zygos modules vs Neverthrow and fp-ts,
 * and outputs a JSON file consumed by the documentation website.
 *
 * Usage: npx tsx scripts/generate-zygos-bundle-sizes.ts
 *
 * The output is written to src/data/comparisons/zygos-bundle-sizes.json
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { gzipSync, brotliCompressSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const tmpDir = join(__dirname, ".tmp-zygos");
const outputDir = join(__dirname, "../src/data/comparisons");
const outputPath = join(outputDir, "zygos-bundle-sizes.json");

// Paths
const projectRoot = join(__dirname, "../../../..");
const esbuildPath = join(projectRoot, "node_modules/.bin/esbuild");

// Zygos dist paths
const zygosResultPath = join(
  projectRoot,
  "packages/pithos/dist/zygos/result/result.js"
);
const zygosResultAsyncPath = join(
  projectRoot,
  "packages/pithos/dist/zygos/result/result-async.js"
);
const zygosOptionPath = join(
  projectRoot,
  "packages/pithos/dist/zygos/option.js"
);
const zygosEitherPath = join(
  projectRoot,
  "packages/pithos/dist/zygos/either.js"
);
const zygosTaskPath = join(projectRoot, "packages/pithos/dist/zygos/task.js");
const zygosTaskEitherPath = join(
  projectRoot,
  "packages/pithos/dist/zygos/task-either.js"
);
const zygosSafePath = join(projectRoot, "packages/pithos/dist/zygos/safe.js");

// Comparison library paths
const neverthrowPath = join(projectRoot, "node_modules/neverthrow");
const fpTsEs6Path = join(projectRoot, "node_modules/fp-ts/es6");

// Package.json paths for versions
const pithosPackageJsonPath = join(
  projectRoot,
  "packages/pithos/package.json"
);
const neverthrowPackageJsonPath = join(neverthrowPath, "package.json");
const fpTsPackageJsonPath = join(
  projectRoot,
  "node_modules/fp-ts/package.json"
);

interface VersionInfo {
  pithos: string;
  neverthrow: string;
  "fp-ts": string;
}

interface BundleResult {
  module: string;
  variant: string;
  category: string;
  description: string;
  rawBytes: number;
  gzipBytes: number;
  brotliBytes: number;
}

interface BundleData {
  generatedAt: string;
  versions: VersionInfo;
  results: BundleResult[];
}

function getVersions(): VersionInfo {
  const pithosPkg = JSON.parse(
    readFileSync(pithosPackageJsonPath, "utf-8")
  );
  const neverthrowPkg = JSON.parse(
    readFileSync(neverthrowPackageJsonPath, "utf-8")
  );
  const fpTsPkg = JSON.parse(readFileSync(fpTsPackageJsonPath, "utf-8"));

  return {
    pithos: pithosPkg.version,
    neverthrow: neverthrowPkg.version,
    "fp-ts": fpTsPkg.version,
  };
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

    const content = readFileSync(outPath, "utf-8");
    return content;
  } catch (error) {
    const err = error as { stderr?: Buffer; stdout?: Buffer };
    console.error(`  ❌ Bundle failed:`);
    if (err.stderr) console.error(err.stderr.toString().slice(0, 500));
    return null;
  }
}

function measureBundle(
  module: string,
  variant: string,
  category: string,
  description: string,
  code: string,
  cwd: string
): BundleResult | null {
  console.log(`📦 ${variant} - ${module}...`);

  const content = bundleCode(code, cwd);
  if (!content) return null;

  const rawBytes = Buffer.byteLength(content, "utf-8");
  const gzipBytes = gzipSync(content).length;
  const brotliBytes = brotliCompressSync(content).length;

  console.log(`   ✓ ${formatBytes(gzipBytes)} gzip`);

  return {
    module,
    variant,
    category,
    description,
    rawBytes,
    gzipBytes,
    brotliBytes,
  };
}

function cleanup(): void {
  if (existsSync(tmpDir)) {
    execSync(`rm -rf "${tmpDir}"`);
  }
}

interface TestCase {
  module: string;
  description: string;
  code: string;
}

async function main(): Promise<void> {
  console.log("🔬 Generating Zygos bundle size data...\n");

  // Check prerequisites
  if (!existsSync(zygosResultPath)) {
    console.error("❌ Zygos dist not found. Run 'pnpm build' first.");
    process.exit(1);
  }

  if (!existsSync(esbuildPath)) {
    console.error(
      "❌ esbuild not found. Run 'pnpm install' at project root first."
    );
    process.exit(1);
  }

  if (!existsSync(neverthrowPath)) {
    console.error("❌ neverthrow not found. Run 'pnpm install' first.");
    process.exit(1);
  }

  if (!existsSync(fpTsEs6Path)) {
    console.error("❌ fp-ts not found. Run 'pnpm install' first.");
    process.exit(1);
  }

  const results: BundleResult[] = [];

  // ============================================
  // ZYGOS - Result Pattern modules
  // ============================================
  console.log("\n━━━ Zygos - Result Pattern ━━━\n");

  const zygosResultTests: TestCase[] = [
    {
      module: "result",
      description: "Result monad (ok, err, safeTry)",
      code: `
import { ok, err, safeTry } from "${zygosResultPath}";
export { ok, err, safeTry };
`,
    },
    {
      module: "result-async",
      description: "ResultAsync monad (okAsync, errAsync, fromPromise)",
      code: `
import { okAsync, errAsync, fromPromise } from "${zygosResultAsyncPath}";
export { okAsync, errAsync, fromPromise };
`,
    },
    {
      module: "result-all",
      description: "Result + ResultAsync combined",
      code: `
import { ok, err, safeTry } from "${zygosResultPath}";
import { okAsync, errAsync, fromPromise } from "${zygosResultAsyncPath}";
export { ok, err, safeTry, okAsync, errAsync, fromPromise };
`,
    },
    {
      module: "safe",
      description: "Safe wrapper for try/catch",
      code: `
import { safe } from "${zygosSafePath}";
export { safe };
`,
    },
  ];

  for (const { module, description, code } of zygosResultTests) {
    const result = measureBundle(
      module,
      "zygos",
      "result-pattern",
      description,
      code,
      projectRoot
    );
    if (result) results.push(result);
  }

  // ============================================
  // NEVERTHROW - Result Pattern
  // ============================================
  console.log("\n━━━ Neverthrow - Result Pattern ━━━\n");

  const neverthrowTests: TestCase[] = [
    {
      module: "result",
      description: "Result monad (ok, err)",
      code: `
import { ok, err } from "neverthrow";
export { ok, err };
`,
    },
    {
      module: "result-async",
      description: "ResultAsync monad (okAsync, errAsync, fromPromise)",
      code: `
import { okAsync, errAsync, fromPromise } from "neverthrow";
export { okAsync, errAsync, fromPromise };
`,
    },
    {
      module: "result-all",
      description: "Result + ResultAsync combined",
      code: `
import { ok, err, okAsync, errAsync, fromPromise } from "neverthrow";
export { ok, err, okAsync, errAsync, fromPromise };
`,
    },
    {
      module: "safe",
      description: "No equivalent in Neverthrow",
      code: `
import { ok } from "neverthrow";
export const safe = ok;
`,
    },
  ];

  for (const { module, description, code } of neverthrowTests) {
    const result = measureBundle(
      module,
      "neverthrow",
      "result-pattern",
      description,
      code,
      projectRoot
    );
    if (result) results.push(result);
  }

  // ============================================
  // ZYGOS - FP Monads
  // ============================================
  console.log("\n━━━ Zygos - FP Monads ━━━\n");

  const zygosFpTests: TestCase[] = [
    {
      module: "option",
      description: "Option monad (some, none, map, flatMap, fold)",
      code: `
import { some, none, isSome, isNone, map, flatMap, getOrElse, fold, fromNullable } from "${zygosOptionPath}";
export { some, none, isSome, isNone, map, flatMap, getOrElse, fold, fromNullable };
`,
    },
    {
      module: "either",
      description: "Either monad (left, right, map, flatMap, fold)",
      code: `
import { left, right, isLeft, isRight, map, flatMap, fold, fromNullable } from "${zygosEitherPath}";
export { left, right, isLeft, isRight, map, flatMap, fold, fromNullable };
`,
    },
    {
      module: "task",
      description: "Task monad (of, map, flatMap)",
      code: `
import { of, map, flatMap } from "${zygosTaskPath}";
export { of, map, flatMap };
`,
    },
    {
      module: "task-either",
      description: "TaskEither monad (left, right, tryCatch, map, flatMap, fold)",
      code: `
import { left, right, tryCatch, map, flatMap, fold } from "${zygosTaskEitherPath}";
export { left, right, tryCatch, map, flatMap, fold };
`,
    },
  ];

  for (const { module, description, code } of zygosFpTests) {
    const result = measureBundle(
      module,
      "zygos",
      "fp-monads",
      description,
      code,
      projectRoot
    );
    if (result) results.push(result);
  }

  // ============================================
  // FP-TS - FP Monads
  // ============================================
  console.log("\n━━━ fp-ts - FP Monads ━━━\n");

  const fpTsTests: TestCase[] = [
    {
      module: "option",
      description: "Option monad (fp-ts/Option)",
      code: `
import * as O from "${fpTsEs6Path}/Option.js";
export { O };
`,
    },
    {
      module: "either",
      description: "Either monad (fp-ts/Either)",
      code: `
import * as E from "${fpTsEs6Path}/Either.js";
export { E };
`,
    },
    {
      module: "task",
      description: "Task monad (fp-ts/Task)",
      code: `
import * as T from "${fpTsEs6Path}/Task.js";
export { T };
`,
    },
    {
      module: "task-either",
      description: "TaskEither monad (fp-ts/TaskEither)",
      code: `
import * as TE from "${fpTsEs6Path}/TaskEither.js";
export { TE };
`,
    },
  ];

  for (const { module, description, code } of fpTsTests) {
    const result = measureBundle(
      module,
      "fp-ts",
      "fp-monads",
      description,
      code,
      projectRoot
    );
    if (result) results.push(result);
  }

  // ============================================
  // COMBINED - Full library comparisons
  // ============================================
  console.log("\n━━━ Combined - Full Library ━━━\n");

  const combinedTests: TestCase[] = [
    // Zygos full result
    {
      module: "full-result",
      description: "All Result modules (Result + ResultAsync + Safe)",
      code: `
import { ok, err, safeTry } from "${zygosResultPath}";
import { okAsync, errAsync, fromPromise } from "${zygosResultAsyncPath}";
import { safe } from "${zygosSafePath}";
export { ok, err, safeTry, okAsync, errAsync, fromPromise, safe };
`,
    },
    // Zygos full FP
    {
      module: "full-fp",
      description: "All FP monads (Option + Either + Task + TaskEither)",
      code: `
import { some, none, isSome, map as mapO, flatMap as flatMapO, fold as foldO, fromNullable as fromNullableO } from "${zygosOptionPath}";
import { left, right, isLeft, map as mapE, flatMap as flatMapE, fold as foldE } from "${zygosEitherPath}";
import { of, map as mapT, flatMap as flatMapT } from "${zygosTaskPath}";
import { left as teLeft, right as teRight, tryCatch, map as mapTE, flatMap as flatMapTE, fold as foldTE } from "${zygosTaskEitherPath}";
export { some, none, isSome, mapO, flatMapO, foldO, fromNullableO, left, right, isLeft, mapE, flatMapE, foldE, of, mapT, flatMapT, teLeft, teRight, tryCatch, mapTE, flatMapTE, foldTE };
`,
    },
    // Zygos full library
    {
      module: "full-library",
      description: "All Zygos modules combined",
      code: `
import { ok, err, safeTry } from "${zygosResultPath}";
import { okAsync, errAsync, fromPromise } from "${zygosResultAsyncPath}";
import { safe } from "${zygosSafePath}";
import { some, none, isSome, map as mapO, flatMap as flatMapO, fold as foldO } from "${zygosOptionPath}";
import { left, right, isLeft, map as mapE, flatMap as flatMapE, fold as foldE } from "${zygosEitherPath}";
import { of, map as mapT, flatMap as flatMapT } from "${zygosTaskPath}";
import { left as teLeft, right as teRight, tryCatch, map as mapTE, flatMap as flatMapTE, fold as foldTE } from "${zygosTaskEitherPath}";
export { ok, err, safeTry, okAsync, errAsync, fromPromise, safe, some, none, isSome, mapO, flatMapO, foldO, left, right, isLeft, mapE, flatMapE, foldE, of, mapT, flatMapT, teLeft, teRight, tryCatch, mapTE, flatMapTE, foldTE };
`,
    },
  ];

  for (const test of combinedTests) {
    const result = measureBundle(
      test.module,
      "zygos",
      "combined",
      test.description,
      test.code,
      projectRoot
    );
    if (result) results.push(result);
  }

  // Neverthrow full
  const neverthrowFullResult = measureBundle(
    "full-result",
    "neverthrow",
    "combined",
    "Full Neverthrow library",
    `
import { ok, err, okAsync, errAsync, fromPromise, safeTry, ResultAsync } from "neverthrow";
export { ok, err, okAsync, errAsync, fromPromise, safeTry, ResultAsync };
`,
    projectRoot
  );
  if (neverthrowFullResult) results.push(neverthrowFullResult);

  const neverthrowFullLibrary = measureBundle(
    "full-library",
    "neverthrow",
    "combined",
    "Full Neverthrow library",
    `
import { ok, err, okAsync, errAsync, fromPromise, safeTry, ResultAsync } from "neverthrow";
export { ok, err, okAsync, errAsync, fromPromise, safeTry, ResultAsync };
`,
    projectRoot
  );
  if (neverthrowFullLibrary) results.push(neverthrowFullLibrary);

  // fp-ts full FP
  const fpTsFullFp = measureBundle(
    "full-fp",
    "fp-ts",
    "combined",
    "All FP monads (Option + Either + Task + TaskEither)",
    `
import * as O from "${fpTsEs6Path}/Option.js";
import * as E from "${fpTsEs6Path}/Either.js";
import * as T from "${fpTsEs6Path}/Task.js";
import * as TE from "${fpTsEs6Path}/TaskEither.js";
export { O, E, T, TE };
`,
    projectRoot
  );
  if (fpTsFullFp) results.push(fpTsFullFp);

  const fpTsFullLibrary = measureBundle(
    "full-library",
    "fp-ts",
    "combined",
    "All FP monads + pipe (Option + Either + Task + TaskEither + function)",
    `
import * as O from "${fpTsEs6Path}/Option.js";
import * as E from "${fpTsEs6Path}/Either.js";
import * as T from "${fpTsEs6Path}/Task.js";
import * as TE from "${fpTsEs6Path}/TaskEither.js";
import { pipe } from "${fpTsEs6Path}/function.js";
export { O, E, T, TE, pipe };
`,
    projectRoot
  );
  if (fpTsFullLibrary) results.push(fpTsFullLibrary);

  // Cleanup
  cleanup();

  // Write results
  ensureDir(outputDir);

  const versions = getVersions();
  const data: BundleData = {
    generatedAt: new Date().toISOString(),
    versions,
    results,
  };

  writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(
    `\n📦 Versions: Pithos ${versions.pithos}, Neverthrow ${versions.neverthrow}, fp-ts ${versions["fp-ts"]}`
  );

  console.log("\n" + "═".repeat(60));
  console.log("✅ Zygos bundle data generated successfully!");
  console.log(`   Output: ${outputPath}`);
  console.log("═".repeat(60) + "\n");

  // Print summary tables
  console.log("📊 Result Pattern (gzip):\n");
  console.log("| Module        | Zygos     | Neverthrow |");
  console.log("|---------------|-----------|------------|");

  for (const mod of ["result", "result-async", "result-all", "safe"]) {
    const zygos = results.find(
      (r) =>
        r.variant === "zygos" &&
        r.module === mod &&
        r.category === "result-pattern"
    );
    const nev = results.find(
      (r) =>
        r.variant === "neverthrow" &&
        r.module === mod &&
        r.category === "result-pattern"
    );

    console.log(
      `| ${mod.padEnd(13)} | ${zygos ? formatBytes(zygos.gzipBytes).padEnd(9) : "N/A".padEnd(9)} | ${nev ? formatBytes(nev.gzipBytes).padEnd(10) : "N/A".padEnd(10)} |`
    );
  }

  console.log("\n📊 FP Monads (gzip):\n");
  console.log("| Module        | Zygos     | fp-ts      |");
  console.log("|---------------|-----------|------------|");

  for (const mod of ["option", "either", "task", "task-either"]) {
    const zygos = results.find(
      (r) =>
        r.variant === "zygos" && r.module === mod && r.category === "fp-monads"
    );
    const fpTs = results.find(
      (r) =>
        r.variant === "fp-ts" && r.module === mod && r.category === "fp-monads"
    );

    console.log(
      `| ${mod.padEnd(13)} | ${zygos ? formatBytes(zygos.gzipBytes).padEnd(9) : "N/A".padEnd(9)} | ${fpTs ? formatBytes(fpTs.gzipBytes).padEnd(10) : "N/A".padEnd(10)} |`
    );
  }
}

main().catch((error) => {
  console.error(error);
  cleanup();
  process.exit(1);
});
