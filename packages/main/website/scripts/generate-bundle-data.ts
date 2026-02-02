#!/usr/bin/env npx tsx
/* eslint-disable no-console */
/**
 * Generate bundle size comparison data for documentation
 *
 * This script measures bundle sizes for Kanon and Zod with tree-shaking,
 * and outputs a JSON file that can be consumed by the documentation.
 *
 * Usage: npx tsx scripts/generate-bundle-data.ts
 *
 * The output is written to src/data/bundle-sizes.json
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { gzipSync, brotliCompressSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const tmpDir = join(__dirname, ".tmp");
const outputDir = join(__dirname, "../src/data");
const outputPath = join(outputDir, "bundle-sizes.json");

// Paths
const projectRoot = join(__dirname, "../../../..");
const kanonDistPath = join(projectRoot, "packages/pithos/dist/kanon/v3/index.js");
const kanonKPath = join(projectRoot, "packages/pithos/dist/kanon/v3/helpers/k.js");
const kanonZShimPath = join(
  projectRoot,
  "packages/pithos/dist/kanon/v3/helpers/as-zod.shim.js"
);
const kanonValidationPath = join(
  projectRoot,
  "packages/pithos/dist/kanon/v3/validation.js"
);
const zodPath = join(projectRoot, "node_modules/zod");
const zod3Path = join(projectRoot, "node_modules/zod3");
const esbuildPath = join(projectRoot, "node_modules/.bin/esbuild");

// Package.json paths for versions
const kanonPackageJsonPath = join(projectRoot, "packages/pithos/package.json");
const zodPackageJsonPath = join(zodPath, "package.json");

function getVersions(includeZod3: boolean): VersionInfo {
  const kanonPkg = JSON.parse(readFileSync(kanonPackageJsonPath, "utf-8"));
  const zodPkg = JSON.parse(readFileSync(zodPackageJsonPath, "utf-8"));

  const versions: VersionInfo = {
    kanon: kanonPkg.version,
    zod4: zodPkg.version,
  };

  if (includeZod3) {
    const zod3PackageJsonPath = join(
      projectRoot,
      "node_modules/zod3/package.json"
    );
    if (!existsSync(zod3PackageJsonPath)) {
      throw new Error("Zod 3 not found but required for version info");
    }
    const zod3Pkg = JSON.parse(readFileSync(zod3PackageJsonPath, "utf-8"));
    versions.zod3 = zod3Pkg.version;
  }

  return versions;
}

interface BundleResult {
  name: string;
  variant: string;
  category: string;
  test: string;
  description: string;
  rawBytes: number;
  gzipBytes: number;
  brotliBytes: number;
}

interface VersionInfo {
  kanon: string;
  zod3?: string;
  zod4: string;
}

interface BundleData {
  generatedAt: string;
  versions: VersionInfo;
  results: BundleResult[];
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
  name: string,
  variant: string,
  category: string,
  test: string,
  description: string,
  code: string,
  cwd: string
): BundleResult | null {
  console.log(`📦 ${name} - ${test}...`);

  const content = bundleCode(code, cwd);
  if (!content) return null;

  const rawBytes = Buffer.byteLength(content, "utf-8");
  const gzipBytes = gzipSync(content).length;
  const brotliBytes = brotliCompressSync(content).length;

  console.log(`   ✓ ${formatBytes(gzipBytes)} gzip`);

  return {
    name,
    variant,
    category,
    test,
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

async function main(): Promise<void> {
  console.log("🔬 Generating bundle size data for documentation...\n");

  // Check prerequisites
  if (!existsSync(kanonDistPath)) {
    console.error("❌ Kanon dist not found. Run 'pnpm build' first.");
    process.exit(1);
  }

  if (!existsSync(esbuildPath)) {
    console.error(
      "❌ esbuild not found. Run 'pnpm install' at project root first."
    );
    process.exit(1);
  }

  const results: BundleResult[] = [];

  // ============================================
  // KANON - REAL WORLD USE CASES (Tree-shaked)
  // ============================================
  console.log("\n━━━ Kanon v3 - Real World Use Cases ━━━\n");

  const kanonRealWorldTests = [
    {
      test: "login-form",
      description: "Login form validation",
      code: `
import { object, string, parse } from "${kanonDistPath}";
const loginSchema = object({
  email: string({ format: "email" }),
  password: string({ minLength: 8 }),
});
export const validate = (data: unknown) => parse(loginSchema, data);
`,
    },
    {
      test: "user-profile",
      description: "User profile with optional fields",
      code: `
import { object, string, number, boolean, array, optional, parse } from "${kanonDistPath}";
const userSchema = object({
  id: string({ format: "uuid" }),
  name: string({ minLength: 1 }),
  email: string({ format: "email" }),
  age: optional(number({ min: 0, max: 150 })),
  isActive: boolean(),
  roles: array(string()),
});
export const validate = (data: unknown) => parse(userSchema, data);
`,
    },
    {
      test: "api-response",
      description: "API response with discriminated union",
      code: `
import { object, string, array, number, unionOf, literal, parse } from "${kanonDistPath}";
const itemSchema = object({ id: number(), name: string() });
const responseSchema = unionOf([
  object({ success: literal(true), data: array(itemSchema) }),
  object({ success: literal(false), error: string() }),
]);
export const validate = (data: unknown) => parse(responseSchema, data);
`,
    },
    {
      test: "config-validation",
      description: "App configuration validation",
      code: `
import { object, string, number, boolean, enum_, optional, parse } from "${kanonDistPath}";
const configSchema = object({
  apiUrl: string({ format: "url" }),
  port: number({ min: 1, max: 65535 }),
  debug: boolean(),
  environment: enum_(["development", "staging", "production"]),
  timeout: optional(number({ min: 0 })),
});
export const validate = (data: unknown) => parse(configSchema, data);
`,
    },
    {
      test: "form-with-coercion",
      description: "Form data with type coercion",
      code: `
import { object, string, coerceNumber, coerceBoolean, coerceDate, parse } from "${kanonDistPath}";
const formSchema = object({
  name: string(),
  age: coerceNumber({ min: 0 }),
  subscribed: coerceBoolean(),
  birthDate: coerceDate(),
});
export const validate = (data: unknown) => parse(formSchema, data);
`,
    },
    {
      test: "full-app",
      description: "Complete app schemas (comprehensive)",
      code: `
import {
  string, number, int, boolean, object, array, record,
  enum_, unionOf, discriminatedUnion, literal, date, unknown,
  optional, nullable, parse, coerceNumber, coerceBoolean, coerceDate
} from "${kanonDistPath}";

const userSchema = object({
  id: string({ format: "uuid" }),
  name: string({ minLength: 1 }),
  email: string({ format: "email" }),
  age: int({ min: 0, max: 150 }),
  isActive: boolean(),
  role: enum_(["admin", "user", "guest"]),
  tags: array(string()),
  metadata: optional(record(string(), unknown())),
});

const responseSchema = unionOf([
  object({ success: literal(true), data: userSchema }),
  object({ success: literal(false), error: string() }),
]);

const eventSchema = discriminatedUnion("type", [
  object({ type: literal("click"), x: number(), y: number() }),
  object({ type: literal("scroll"), offset: number() }),
]);

const coerceSchema = object({
  count: coerceNumber(),
  flag: coerceBoolean(),
  date: coerceDate(),
});

export const schemas = { userSchema, responseSchema, eventSchema, coerceSchema, parse };
`,
    },
  ];

  for (const { test, description, code } of kanonRealWorldTests) {
    const result = measureBundle(
      "Kanon v3",
      "kanon",
      "real-world",
      test,
      description,
      code,
      projectRoot
    );
    if (result) results.push(result);
  }

  // ============================================
  // KANON - HELPERS IMPACT (k, z shim, validation)
  // ============================================
  console.log("\n━━━ Kanon v3 - Helpers Impact ━━━\n");

  const kanonHelperTests = [
    {
      test: "k-namespace",
      description: "Using k namespace (no tree-shaking)",
      code: `
import { k } from "${kanonKPath}";
const schema = k.object({
  email: k.string(),
  password: k.string(),
});
export const validate = (data: unknown) => k.parse(schema, data);
`,
    },
    {
      test: "z-shim",
      description: "Using z shim for Zod compatibility",
      code: `
import { z } from "${kanonZShimPath}";
const schema = z.object({
  email: z.string(),
  password: z.string(),
});
export const validate = (data: unknown) => schema.parse(data);
`,
    },
    {
      test: "validation-helper",
      description: "Using validation helper",
      code: `
import { object, string } from "${kanonDistPath}";
import { validation } from "${kanonValidationPath}";
const schema = object({
  email: string({ format: "email" }),
  password: string({ minLength: 8 }),
});
export const validate = (data: unknown) => validation.safeParse(schema, data);
`,
    },
  ];

  for (const { test, description, code } of kanonHelperTests) {
    const result = measureBundle(
      "Kanon v3",
      "kanon",
      "helpers",
      test,
      description,
      code,
      projectRoot
    );
    if (result) results.push(result);
  }

  // ============================================
  // ZOD 4 CLASSIC - SAME USE CASES
  // ============================================
  console.log("\n━━━ Zod 4 Classic - Real World Use Cases ━━━\n");

  const zod4ClassicTests = [
    {
      test: "login-form",
      description: "Login form validation",
      code: `
import * as z from "zod/v4";
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export const validate = (data: unknown) => loginSchema.safeParse(data);
`,
    },
    {
      test: "user-profile",
      description: "User profile with optional fields",
      code: `
import * as z from "zod/v4";
const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(0).max(150).optional(),
  isActive: z.boolean(),
  roles: z.array(z.string()),
});
export const validate = (data: unknown) => userSchema.safeParse(data);
`,
    },
    {
      test: "api-response",
      description: "API response with discriminated union",
      code: `
import * as z from "zod/v4";
const itemSchema = z.object({ id: z.number(), name: z.string() });
const responseSchema = z.union([
  z.object({ success: z.literal(true), data: z.array(itemSchema) }),
  z.object({ success: z.literal(false), error: z.string() }),
]);
export const validate = (data: unknown) => responseSchema.safeParse(data);
`,
    },
    {
      test: "config-validation",
      description: "App configuration validation",
      code: `
import * as z from "zod/v4";
const configSchema = z.object({
  apiUrl: z.string().url(),
  port: z.number().min(1).max(65535),
  debug: z.boolean(),
  environment: z.enum(["development", "staging", "production"]),
  timeout: z.number().min(0).optional(),
});
export const validate = (data: unknown) => configSchema.safeParse(data);
`,
    },
    {
      test: "form-with-coercion",
      description: "Form data with type coercion",
      code: `
import * as z from "zod/v4";
const formSchema = z.object({
  name: z.string(),
  age: z.coerce.number().min(0),
  subscribed: z.coerce.boolean(),
  birthDate: z.coerce.date(),
});
export const validate = (data: unknown) => formSchema.safeParse(data);
`,
    },
    {
      test: "full-app",
      description: "Complete app schemas (comprehensive)",
      code: `
import * as z from "zod/v4";

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  isActive: z.boolean(),
  role: z.enum(["admin", "user", "guest"]),
  tags: z.array(z.string()),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const responseSchema = z.union([
  z.object({ success: z.literal(true), data: userSchema }),
  z.object({ success: z.literal(false), error: z.string() }),
]);

const eventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("click"), x: z.number(), y: z.number() }),
  z.object({ type: z.literal("scroll"), offset: z.number() }),
]);

const coerceSchema = z.object({
  count: z.coerce.number(),
  flag: z.coerce.boolean(),
  date: z.coerce.date(),
});

export const schemas = { userSchema, responseSchema, eventSchema, coerceSchema };
`,
    },
  ];

  for (const { test, description, code } of zod4ClassicTests) {
    const result = measureBundle(
      "Zod 4 Classic",
      "zod4-classic",
      "real-world",
      test,
      description,
      code,
      zodPath
    );
    if (result) results.push(result);
  }

  // ============================================
  // ZOD 4 MINI - SAME USE CASES
  // ============================================
  console.log("\n━━━ Zod 4 Mini - Real World Use Cases ━━━\n");

  const zod4MiniTests = [
    {
      test: "login-form",
      description: "Login form validation",
      code: `
import * as z from "zod/mini";
const loginSchema = z.object({
  email: z.string().check(z.email()),
  password: z.string().check(z.minLength(8)),
});
export const validate = (data: unknown) => loginSchema.safeParse(data);
`,
    },
    {
      test: "user-profile",
      description: "User profile with optional fields",
      code: `
import * as z from "zod/mini";
const userSchema = z.object({
  id: z.string().check(z.uuid()),
  name: z.string().check(z.minLength(1)),
  email: z.string().check(z.email()),
  age: z.number().check(z.minimum(0), z.maximum(150)).optional(),
  isActive: z.boolean(),
  roles: z.array(z.string()),
});
export const validate = (data: unknown) => userSchema.safeParse(data);
`,
    },
    {
      test: "api-response",
      description: "API response with discriminated union",
      code: `
import * as z from "zod/mini";
const itemSchema = z.object({ id: z.number(), name: z.string() });
const responseSchema = z.union([
  z.object({ success: z.literal(true), data: z.array(itemSchema) }),
  z.object({ success: z.literal(false), error: z.string() }),
]);
export const validate = (data: unknown) => responseSchema.safeParse(data);
`,
    },
    {
      test: "config-validation",
      description: "App configuration validation",
      code: `
import * as z from "zod/mini";
const configSchema = z.object({
  apiUrl: z.string().check(z.url()),
  port: z.number().check(z.minimum(1), z.maximum(65535)),
  debug: z.boolean(),
  environment: z.enum(["development", "staging", "production"]),
  timeout: z.number().check(z.minimum(0)).optional(),
});
export const validate = (data: unknown) => configSchema.safeParse(data);
`,
    },
    {
      test: "form-with-coercion",
      description: "Form data with type coercion",
      code: `
import * as z from "zod/mini";
const formSchema = z.object({
  name: z.string(),
  age: z.coerce.number().check(z.minimum(0)),
  subscribed: z.coerce.boolean(),
  birthDate: z.coerce.date(),
});
export const validate = (data: unknown) => formSchema.safeParse(data);
`,
    },
    {
      test: "full-app",
      description: "Complete app schemas (comprehensive)",
      code: `
import * as z from "zod/mini";

const userSchema = z.object({
  id: z.string().check(z.uuid()),
  name: z.string().check(z.minLength(1)),
  email: z.string().check(z.email()),
  age: z.number().check(z.int(), z.minimum(0), z.maximum(150)),
  isActive: z.boolean(),
  role: z.enum(["admin", "user", "guest"]),
  tags: z.array(z.string()),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const responseSchema = z.union([
  z.object({ success: z.literal(true), data: userSchema }),
  z.object({ success: z.literal(false), error: z.string() }),
]);

const eventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("click"), x: z.number(), y: z.number() }),
  z.object({ type: z.literal("scroll"), offset: z.number() }),
]);

const coerceSchema = z.object({
  count: z.coerce.number(),
  flag: z.coerce.boolean(),
  date: z.coerce.date(),
});

export const schemas = { userSchema, responseSchema, eventSchema, coerceSchema };
`,
    },
  ];

  for (const { test, description, code } of zod4MiniTests) {
    const result = measureBundle(
      "Zod 4 Mini",
      "zod4-mini",
      "real-world",
      test,
      description,
      code,
      zodPath
    );
    if (result) results.push(result);
  }

  // ============================================
  // ZOD 3 - SAME USE CASES (optional)
  // ============================================
  if (existsSync(zod3Path)) {
    console.log("\n━━━ Zod 3 - Real World Use Cases ━━━\n");

    const zod3Tests = [
      {
        test: "login-form",
        description: "Login form validation",
        code: `
import * as z from "${zod3Path}";
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export const validate = (data: unknown) => loginSchema.safeParse(data);
`,
      },
      {
        test: "user-profile",
        description: "User profile with optional fields",
        code: `
import * as z from "${zod3Path}";
const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(0).max(150).optional(),
  isActive: z.boolean(),
  roles: z.array(z.string()),
});
export const validate = (data: unknown) => userSchema.safeParse(data);
`,
      },
      {
        test: "api-response",
        description: "API response with discriminated union",
        code: `
import * as z from "${zod3Path}";
const itemSchema = z.object({ id: z.number(), name: z.string() });
const responseSchema = z.union([
  z.object({ success: z.literal(true), data: z.array(itemSchema) }),
  z.object({ success: z.literal(false), error: z.string() }),
]);
export const validate = (data: unknown) => responseSchema.safeParse(data);
`,
      },
      {
        test: "config-validation",
        description: "App configuration validation",
        code: `
import * as z from "${zod3Path}";
const configSchema = z.object({
  apiUrl: z.string().url(),
  port: z.number().min(1).max(65535),
  debug: z.boolean(),
  environment: z.enum(["development", "staging", "production"]),
  timeout: z.number().min(0).optional(),
});
export const validate = (data: unknown) => configSchema.safeParse(data);
`,
      },
      {
        test: "form-with-coercion",
        description: "Form data with type coercion",
        code: `
import * as z from "${zod3Path}";
const formSchema = z.object({
  name: z.string(),
  age: z.coerce.number().min(0),
  subscribed: z.coerce.boolean(),
  birthDate: z.coerce.date(),
});
export const validate = (data: unknown) => formSchema.safeParse(data);
`,
      },
      {
        test: "full-app",
        description: "Complete app schemas (comprehensive)",
        code: `
import * as z from "${zod3Path}";

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  isActive: z.boolean(),
  role: z.enum(["admin", "user", "guest"]),
  tags: z.array(z.string()),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const responseSchema = z.union([
  z.object({ success: z.literal(true), data: userSchema }),
  z.object({ success: z.literal(false), error: z.string() }),
]);

const eventSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("click"), x: z.number(), y: z.number() }),
  z.object({ type: z.literal("scroll"), offset: z.number() }),
]);

const coerceSchema = z.object({
  count: z.coerce.number(),
  flag: z.coerce.boolean(),
  date: z.coerce.date(),
});

export const schemas = { userSchema, responseSchema, eventSchema, coerceSchema };
`,
      },
    ];

    for (const { test, description, code } of zod3Tests) {
      const result = measureBundle(
        "Zod 3",
        "zod3",
        "real-world",
        test,
        description,
        code,
        projectRoot
      );
      if (result) results.push(result);
    }
  } else {
    console.log("\n⚠️  Zod 3 not found, skipping Zod 3 benchmarks\n");
  }

  // Cleanup
  cleanup();

  // Write results
  ensureDir(outputDir);

  const hasZod3 = existsSync(zod3Path);
  const versions = getVersions(hasZod3);
  const data: BundleData = {
    generatedAt: new Date().toISOString(),
    versions,
    results,
  };

  writeFileSync(outputPath, JSON.stringify(data, null, 2));

  const versionInfo = versions.zod3
    ? `Kanon ${versions.kanon}, Zod 3 ${versions.zod3}, Zod 4 ${versions.zod4}`
    : `Kanon ${versions.kanon}, Zod ${versions.zod4}`;
  console.log(`\n📦 Versions: ${versionInfo}`);

  console.log("\n" + "═".repeat(60));
  console.log("✅ Bundle data generated successfully!");
  console.log(`   Output: ${outputPath}`);
  console.log("═".repeat(60) + "\n");

  // Print summary table
  console.log("📊 Summary - Real World Use Cases (gzip):\n");
  console.log("| Use Case | Kanon v3 | Zod 4 Mini | Zod 4 Classic |");
  console.log("|----------|----------|------------|---------------|");

  const realWorldTests = [
    "login-form",
    "user-profile",
    "api-response",
    "config-validation",
    "form-with-coercion",
    "full-app",
  ];
  for (const test of realWorldTests) {
    const kanon = results.find(
      (r) =>
        r.variant === "kanon" && r.test === test && r.category === "real-world"
    );
    const zod4Mini = results.find(
      (r) => r.variant === "zod4-mini" && r.test === test
    );
    const zod4Classic = results.find(
      (r) => r.variant === "zod4-classic" && r.test === test
    );

    console.log(
      `| ${test.padEnd(18)} | ${kanon ? formatBytes(kanon.gzipBytes).padEnd(8) : "N/A".padEnd(8)
      } | ${zod4Mini ? formatBytes(zod4Mini.gzipBytes).padEnd(10) : "N/A".padEnd(10)
      } | ${zod4Classic
        ? formatBytes(zod4Classic.gzipBytes).padEnd(13)
        : "N/A".padEnd(13)
      } |`
    );
  }

  console.log("\n📊 Kanon Helpers Impact (gzip):\n");
  const helperResults = results.filter((r) => r.category === "helpers");
  for (const result of helperResults) {
    console.log(`   ${result.test}: ${formatBytes(result.gzipBytes)}`);
  }
}

main().catch((error) => {
  console.error(error);
  cleanup();
  process.exit(1);
});
