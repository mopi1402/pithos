/**
 * Build-time script that pre-computes comparison ratios from benchmark/bundle JSON data.
 *
 * This avoids shipping ~50 KB+ of raw benchmark JSON in the client bundle.
 * The generated file exports only the numeric ratios needed by homepage components.
 *
 * Run: pnpm exec tsx scripts/generate-precomputed-comparisons.ts
 */

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = resolve(__dirname, "../src/data");

// ── Load JSON data ──────────────────────────────────────────────────────────

function loadJSON<T>(path: string): T | null {
  try {
    return require(path) as T;
  } catch {
    return null;
  }
}

interface BenchmarkScenario {
  name: string;
  results: { library: string; opsPerSecond: number }[];
}
interface BenchmarkReport {
  scenarios: BenchmarkScenario[];
}

interface ArkheBundleResult {
  utilName: string;
  library: string;
  gzipBytes: number;
}
interface ArkheBundleData {
  modules: { arkhe: { results: ArkheBundleResult[] } };
}

interface KanonBundleResult {
  variant: string;
  test: string;
  gzipBytes: number;
}
interface KanonBundleData {
  results: KanonBundleResult[];
}

interface ZygosBundleResult {
  variant: string;
  module: string;
  category: string;
  gzipBytes: number;
}
interface ZygosBundleData {
  results: ZygosBundleResult[];
}

const arkheBenchmark = loadJSON<BenchmarkReport>(resolve(DATA_DIR, "benchmarks/arkhe-benchmark.json"));
const kanonBenchmark = loadJSON<BenchmarkReport>(resolve(DATA_DIR, "benchmarks/kanon-benchmark-realworld.json"));
const zygosBenchmark = loadJSON<BenchmarkReport>(resolve(DATA_DIR, "benchmarks/zygos-benchmark.json"));
const arkheBundleSizes = loadJSON<ArkheBundleData>(resolve(DATA_DIR, "comparisons/arkhe-taphos-bundle-sizes.json"));
const kanonBundleSizes = loadJSON<KanonBundleData>(resolve(DATA_DIR, "generated/kanon-bundle-sizes.json"));
const zygosBundleSizes = loadJSON<ZygosBundleData>(resolve(DATA_DIR, "comparisons/zygos-bundle-sizes.json"));

// ── Compute ratios (same logic as calculations.ts) ──────────────────────────

function computeArkheBundleRatio(): number | null {
  if (!arkheBundleSizes?.modules?.arkhe?.results) return null;
  const results = arkheBundleSizes.modules.arkhe.results;
  const utils = new Set(results.map((r) => r.utilName));
  let total = 0, count = 0;
  for (const util of utils) {
    const arkhe = results.find((r) => r.utilName === util && r.library === "pithos" && r.gzipBytes)?.gzipBytes;
    const lodash = results.find((r) => r.utilName === util && r.library === "lodash" && r.gzipBytes)?.gzipBytes;
    if (arkhe && lodash && arkhe > 0) { total += lodash / arkhe; count++; }
  }
  return count > 0 ? total / count : null;
}

function computeArkhePerfRatio(): number | null {
  if (!arkheBenchmark?.scenarios) return null;
  let total = 0, count = 0;
  for (const s of arkheBenchmark.scenarios) {
    const arkhe = s.results.find((r) => r.library === "arkhe")?.opsPerSecond;
    const lodash = s.results.find((r) => r.library === "lodash-es")?.opsPerSecond;
    if (arkhe && lodash && lodash > 0) { total += arkhe / lodash; count++; }
  }
  return count > 0 ? total / count : null;
}

function computeKanonBundleRatio(): number | null {
  if (!kanonBundleSizes?.results) return null;
  const kanon = kanonBundleSizes.results.find((r) => r.variant === "kanon" && r.test === "full-app");
  const zod = kanonBundleSizes.results.find((r) => r.variant === "zod4-classic" && r.test === "full-app");
  if (kanon && zod && kanon.gzipBytes > 0) return zod.gzipBytes / kanon.gzipBytes;
  return null;
}

function computeKanonJITRatio(): number | null {
  if (!kanonBenchmark?.scenarios) return null;
  let total = 0, count = 0;
  for (const s of kanonBenchmark.scenarios) {
    const jit = s.results.find((r) => r.library === "@kanon/JIT")?.opsPerSecond;
    const zod = s.results.find((r) => r.library === "Zod")?.opsPerSecond;
    if (jit && zod && zod > 0) { total += jit / zod; count++; }
  }
  return count > 0 ? total / count : null;
}

function computeKanonV3Ratio(): number | null {
  if (!kanonBenchmark?.scenarios) return null;
  let total = 0, count = 0;
  for (const s of kanonBenchmark.scenarios) {
    const v3 = s.results.find((r) => r.library === "@kanon/V3.0")?.opsPerSecond;
    const zod = s.results.find((r) => r.library === "Zod")?.opsPerSecond;
    if (v3 && zod && zod > 0) { total += v3 / zod; count++; }
  }
  return count > 0 ? total / count : null;
}

function computeZygosBundleRatio(): number | null {
  if (!zygosBundleSizes?.results) return null;
  const mods = ["result", "result-async", "result-all", "safe"];
  let total = 0, count = 0;
  for (const mod of mods) {
    const zygos = zygosBundleSizes.results.find((r) => r.variant === "zygos" && r.module === mod && r.category === "result-pattern" && r.gzipBytes)?.gzipBytes;
    const nev = zygosBundleSizes.results.find((r) => r.variant === "neverthrow" && r.module === mod && r.category === "result-pattern" && r.gzipBytes)?.gzipBytes;
    if (zygos && nev && zygos > 0) { total += nev / zygos; count++; }
  }
  return count > 0 ? total / count : null;
}

function computeZygosPerfRatio(): number | null {
  if (!zygosBenchmark?.scenarios) return null;
  let total = 0, count = 0;
  for (const s of zygosBenchmark.scenarios) {
    if (!s.name.startsWith("result/")) continue;
    const zygos = s.results.find((r) => r.library === "zygos")?.opsPerSecond;
    const nev = s.results.find((r) => r.library === "neverthrow")?.opsPerSecond;
    if (zygos && nev && nev > 0) { total += zygos / nev; count++; }
  }
  return count > 0 ? total / count : null;
}

// ── Generate output ─────────────────────────────────────────────────────────

const fmt = (v: number | null) => v === null ? "null" : v.toFixed(4);

const output = `// AUTO-GENERATED — do not edit manually.
// Run: pnpm run generate:comparisons

/**
 * Pre-computed comparison ratios from benchmark and bundle-size data.
 * These values are computed at build time so the raw JSON data (~50 KB+)
 * is NOT shipped in the client bundle.
 */

// ── Arkhe vs Lodash ─────────────────────────────────────────────────────────
/** Average ratio: lodash gzip / arkhe gzip (e.g. 2.7 = "2.7× smaller") */
export const ARKHE_BUNDLE_RATIO: number | null = ${fmt(computeArkheBundleRatio())};
/** Average ratio: arkhe ops / lodash ops (e.g. 1.4 = "1.4× faster") */
export const ARKHE_PERF_RATIO: number | null = ${fmt(computeArkhePerfRatio())};

// ── Kanon vs Zod ────────────────────────────────────────────────────────────
/** Average ratio: zod gzip / kanon gzip */
export const KANON_BUNDLE_RATIO: number | null = ${fmt(computeKanonBundleRatio())};
/** Average ratio: kanon JIT ops / zod ops */
export const KANON_JIT_RATIO: number | null = ${fmt(computeKanonJITRatio())};
/** Average ratio: kanon V3 ops / zod ops */
export const KANON_V3_RATIO: number | null = ${fmt(computeKanonV3Ratio())};

// ── Zygos vs Neverthrow ─────────────────────────────────────────────────────
/** Average ratio: neverthrow gzip / zygos gzip */
export const ZYGOS_BUNDLE_RATIO: number | null = ${fmt(computeZygosBundleRatio())};
/** Average ratio: zygos ops / neverthrow ops */
export const ZYGOS_PERF_RATIO: number | null = ${fmt(computeZygosPerfRatio())};
`;

const outPath = resolve(DATA_DIR, "generated/pre-computed-comparisons.ts");
writeFileSync(outPath, output, "utf-8");
console.log(`✅ Pre-computed comparisons written to ${outPath}`);
