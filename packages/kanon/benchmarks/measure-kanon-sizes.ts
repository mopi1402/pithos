#!/usr/bin/env npx tsx
/**
 * Measure Kanon bundle sizes with tree-shaking
 * 
 * Usage: cd packages/kanon/benchmarks && npx tsx measure-kanon-sizes.ts
 */

import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync, unlinkSync, mkdirSync } from "node:fs";
import { gzipSync, brotliCompressSync } from "node:zlib";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const tmpDir = join(__dirname, ".tmp");

interface BundleResult {
  name: string;
  rawBytes: number;
  gzipBytes: number;
  brotliBytes: number;
}

// Use the actual compiled files path
const kanonBasePath = "/Users/pmoati/Projects/_labs/pithos/dist/pithos/src/kanon";

// Test cases with inline code
const testCases = [
  {
    name: "Kanon - string only",
    code: `
import { string, parse } from "${kanonBasePath}/index.js";
const schema = string({ minLength: 1 });
export const result = parse(schema, "test");
`,
  },
  {
    name: "Kanon - object simple",
    code: `
import { object, string, number, boolean, parse } from "${kanonBasePath}/index.js";
const schema = object({
  name: string(),
  age: number(),
  active: boolean(),
});
export const result = parse(schema, { name: "test", age: 25, active: true });
`,
  },
  {
    name: "Kanon - comprehensive",
    code: `
import {
  string, number, int, boolean, object, array, record,
  enum_, unionOf, discriminatedUnion, literal, date, unknown,
  optional, nullable, parse, coerceNumber, coerceBoolean, coerceDate
} from "${kanonBasePath}/index.js";

const stringSchema = string({ minLength: 1, maxLength: 100, format: "email" });
const numberSchema = int({ min: 0, max: 1000 });

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

const nestedSchema = object({
  user: userSchema,
  createdAt: date(),
  updatedAt: optional(date()),
});

const responseSchema = unionOf([
  object({ success: literal(true), data: userSchema }),
  object({ success: literal(false), error: string() }),
]);

const eventSchema = discriminatedUnion("type", [
  object({ type: literal("click"), x: number(), y: number() }),
  object({ type: literal("scroll"), offset: number() }),
  object({ type: literal("keypress"), key: string() }),
]);

const coerceSchema = object({
  count: coerceNumber(),
  flag: coerceBoolean(),
  date: coerceDate(),
});

export const schemas = {
  stringSchema, numberSchema, userSchema, nestedSchema,
  responseSchema, eventSchema, coerceSchema,
  parse,
};
`,
  },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  return `${kb.toFixed(2)} kB`;
}

function bundleCode(name: string, code: string): string | null {
  if (!existsSync(tmpDir)) {
    mkdirSync(tmpDir, { recursive: true });
  }
  
  const inputPath = join(tmpDir, "input.ts");
  const outPath = join(tmpDir, "out.js");
  
  writeFileSync(inputPath, code);
  
  try {
    const esbuildPath = "/Users/pmoati/Projects/_labs/pithos/packages/tmp/zod/node_modules/.bin/esbuild";
    execSync(
      `"${esbuildPath}" "${inputPath}" --bundle --format=esm --outfile="${outPath}" --minify --tree-shaking=true 2>&1`,
      { cwd: join(__dirname, "../../.."), stdio: "pipe" }
    );
    
    const content = readFileSync(outPath, "utf-8");
    return content;
  } catch (error) {
    const err = error as { stderr?: Buffer; stdout?: Buffer; message: string };
    console.error(`  ❌ Bundle failed for ${name}:`);
    if (err.stderr) console.error(err.stderr.toString());
    if (err.stdout) console.error(err.stdout.toString());
    return null;
  }
}

function measureBundle(name: string, code: string): BundleResult | null {
  console.log(`📦 Bundling: ${name}...`);
  
  const content = bundleCode(name, code);
  if (!content) return null;
  
  const rawBytes = Buffer.byteLength(content, "utf-8");
  const gzipBytes = gzipSync(content).length;
  const brotliBytes = brotliCompressSync(content).length;
  
  return { name, rawBytes, gzipBytes, brotliBytes };
}

async function main() {
  console.log("🔬 Measuring Kanon bundle sizes with tree-shaking...\n");
  
  const results: BundleResult[] = [];
  
  for (const { name, code } of testCases) {
    const result = measureBundle(name, code);
    if (result) {
      results.push(result);
      console.log(`   Raw: ${formatBytes(result.rawBytes)}, Gzip: ${formatBytes(result.gzipBytes)}, Brotli: ${formatBytes(result.brotliBytes)}\n`);
    }
  }
  
  // Cleanup
  if (existsSync(tmpDir)) {
    execSync(`rm -rf "${tmpDir}"`);
  }
  
  // Print summary
  console.log("\n" + "=".repeat(80));
  console.log("📊 KANON BUNDLE SIZE (with tree-shaking)");
  console.log("=".repeat(80) + "\n");
  
  console.log("| Test | Raw | Gzip | Brotli |");
  console.log("|------|-----|------|--------|");
  
  for (const r of results) {
    console.log(`| ${r.name} | ${formatBytes(r.rawBytes)} | ${formatBytes(r.gzipBytes)} | ${formatBytes(r.brotliBytes)} |`);
  }
  
  // Save results
  const outputPath = join(__dirname, "kanon-sizes.json");
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\n✅ Results saved to: ${outputPath}`);
}

main().catch(console.error);

