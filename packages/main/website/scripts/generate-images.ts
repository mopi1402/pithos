#!/usr/bin/env npx tsx
/* eslint-disable no-console */
/**
 * Generate responsive image variants for the Picture component
 *
 * This script intelligently scans the codebase to find all images that need
 * to be generated, including dynamic usages where src is passed via a variable.
 *
 * How it works:
 *   1. Scans .tsx/.mdx for <Picture> usages (static src="..." and dynamic src={var})
 *   2. For dynamic src, follows imports to find the actual /img/generated/ paths
 *      in data files (.ts), and associates them with the Picture's widths/formats
 *   3. Generates only the exact sizes requested by each component
 *
 * Convention:
 *   - Source image: assets/img/{path}.{png|jpg|jpeg} (highest quality original)
 *   - Generated:   static/img/generated/{path}-{width}.{format}
 *
 * The directory structure in assets/img/ is mirrored to static/img/generated/:
 *   assets/img/logos/pithos.png → static/img/generated/logos/pithos-{width}.{format}
 *
 * In the Picture component, use src="/img/generated/logos/pithos"
 *
 * Usage: pnpm exec tsx scripts/generate-images.ts
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { DEFAULT_QUALITY, type QualityConfig } from "./image-config.js";
import { computeDensities, computeWidths } from "../src/components/shared/Picture/picture-utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const websiteRoot = join(__dirname, "..");
const assetsDir = join(websiteRoot, "assets");
const staticDir = join(websiteRoot, "static");
const srcDir = join(websiteRoot, "src");
const docsDir = join(websiteRoot, "docs");

const comparisonsDir = join(websiteRoot, "comparisons");

const GENERATED_PREFIX = "/img/generated/";
const SOURCE_EXTENSIONS = [".png", ".jpg", ".jpeg"];
const DEFAULT_WIDTHS = [400, 800, 1200];
const DEFAULT_FORMATS = ["avif", "webp"];

/** --force flag: regenerate all variants regardless of mtime */
const FORCE = process.argv.includes("--force");

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

interface ImageTask {
  src: string;
  widths: number[];
  formats: string[];
  sourcePath: string;
  origin: string;
  /** Actual pixel width of the source image (populated before generation) */
  sourceWidth?: number;
  /** Density labels corresponding to each width (e.g. ["1x", "2x", "3x"]) */
  densityLabels?: string[];
  /** Display size from the component (density mode only) */
  displaySize?: number;
  /** Whether densities were explicitly set by the developer */
  hasExplicitDensities?: boolean;
  /** Developer-set maxDpr cap */
  maxDpr?: number;
}

interface DynamicPicture {
  file: string;
  widths: number[];
  formats: string[];
  densityLabels?: string[];
  displaySize?: number;
  hasExplicitDensities?: boolean;
  maxDpr?: number;
}

// ─── File helpers ────────────────────────────────────────────────

function collectFiles(dir: string, extensions: string[]): string[] {
  const results: string[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath, extensions));
    } else if (extensions.some((ext) => entry.name.endsWith(ext))) {
      results.push(fullPath);
    }
  }

  return results;
}

function parseArrayProp(raw: string): string[] | number[] {
  const inner = raw.replace(/^\[/, "").replace(/\]$/, "");
  const items = inner.split(",").map((s) => s.trim().replace(/['"]/g, ""));

  if (items.every((s) => /^\d+$/.test(s))) {
    return items.map(Number);
  }
  return items;
}

// ─── Source image lookup ─────────────────────────────────────────

function findSourceImage(src: string): string | null {
  const relativePath = src.startsWith(GENERATED_PREFIX)
    ? `/img/${src.slice(GENERATED_PREFIX.length)}`
    : src;

  for (const ext of SOURCE_EXTENSIONS) {
    const candidate = join(assetsDir, `${relativePath}${ext}`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}

// ─── Import resolution ──────────────────────────────────────────

function resolveImportPath(importPath: string, fromFile: string): string | null {
  // Handle @site/src/... alias
  let resolved: string;
  if (importPath.startsWith("@site/src/")) {
    resolved = join(srcDir, importPath.slice("@site/src/".length));
  } else if (importPath.startsWith(".")) {
    resolved = join(dirname(fromFile), importPath);
  } else {
    return null; // node_modules, skip
  }

  // Try extensions
  for (const ext of [".ts", ".tsx", ".js", ".jsx"]) {
    if (existsSync(resolved + ext)) return resolved + ext;
  }
  // Try index files
  for (const ext of [".ts", ".tsx", ".js", ".jsx"]) {
    const indexPath = join(resolved, `index${ext}`);
    if (existsSync(indexPath)) return indexPath;
  }
  if (existsSync(resolved)) return resolved;

  return null;
}

function extractImportPaths(content: string): string[] {
  const importRegex = /from\s+["']([^"']+)["']/g;
  const paths: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(content)) !== null) {
    paths.push(match[1]!);
  }
  return paths;
}

function findGeneratedPaths(content: string): string[] {
  const pathRegex = new RegExp(`["'](\\/img\\/generated\\/[^"']+)["']`, "g");
  const paths: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = pathRegex.exec(content)) !== null) {
    paths.push(match[1]!);
  }
  return paths;
}

// ─── Prop parsing helpers ────────────────────────────────────────

/**
 * Try to parse a numeric literal from a JSX prop value like `{125}`.
 * Returns the number if it's a pure numeric literal, or null if it's a dynamic expression.
 */
function parseNumericLiteralProp(attrs: string, propName: string): number | null | "dynamic" {
  const regex = new RegExp(`\\b${propName}=\\{([^}]+)\\}`);
  const match = attrs.match(regex);
  if (!match) return null;
  const value = match[1]!.trim();
  if (/^\d+$/.test(value)) return Number(value);
  // Non-literal expression (variable, ternary, etc.)
  return "dynamic";
}

/**
 * Try to parse a numeric array literal from a JSX prop value like `{[1, 2, 3]}`.
 * Returns the array if all elements are numeric literals, or null/"dynamic".
 */
function parseNumericArrayLiteralProp(attrs: string, propName: string): number[] | null | "dynamic" {
  const regex = new RegExp(`\\b${propName}=\\{(\\[[^\\]]+\\])\\}`);
  const match = attrs.match(regex);
  if (!match) return null;
  const inner = match[1]!.replace(/^\[/, "").replace(/\]$/, "");
  const items = inner.split(",").map((s) => s.trim());
  if (items.every((s) => /^\d+$/.test(s))) return items.map(Number);
  return "dynamic";
}

// ─── Picture scanning ────────────────────────────────────────────

function scanPictures(filePath: string): { static: ImageTask[]; dynamic: DynamicPicture[] } {
  const content = readFileSync(filePath, "utf-8");
  const staticTasks: ImageTask[] = [];
  const dynamicPictures: DynamicPicture[] = [];

  const pictureRegex = /<Picture\b([^>]*?)\/?>(?:\s*<\/Picture>)?/gs;
  let match: RegExpExecArray | null;
  const relativeFile = filePath.replace(websiteRoot + "/", "");

  while ((match = pictureRegex.exec(content)) !== null) {
    const attrs = match[1]!;

    const formatsMatch = attrs.match(/\bformats=\{(\[[^\]]+\])\}/);
    const formats = formatsMatch
      ? (parseArrayProp(formatsMatch[1]!) as string[])
      : DEFAULT_FORMATS;

    // ─── Parse displaySize, sourceWidth, densities ───────────
    const displaySizeRaw = parseNumericLiteralProp(attrs, "displaySize");
    const sourceWidthRaw = parseNumericLiteralProp(attrs, "sourceWidth");
    const densitiesRaw = parseNumericArrayLiteralProp(attrs, "densities");

    // Check for dynamic (non-literal) expressions → warn and skip
    if (displaySizeRaw === "dynamic" || sourceWidthRaw === "dynamic" || densitiesRaw === "dynamic") {
      const dynamicProps = [
        displaySizeRaw === "dynamic" ? "displaySize" : null,
        sourceWidthRaw === "dynamic" ? "sourceWidth" : null,
        densitiesRaw === "dynamic" ? "densities" : null,
      ].filter(Boolean).join(", ");
      console.warn(`   ⚠️  Non-literal prop value for ${dynamicProps} in ${relativeFile}, skipping image`);
      continue;
    }

    const displaySize = displaySizeRaw as number | null;
    const sourceWidth = sourceWidthRaw as number | null;
    const explicitDensities = densitiesRaw as number[] | null;

    // ─── Parse maxDpr ────────────────────────────────────────
    const maxDprRaw = parseNumericLiteralProp(attrs, "maxDpr");
    const maxDpr = (maxDprRaw != null && maxDprRaw !== "dynamic") ? maxDprRaw as number : undefined;

    // ─── Compute widths ──────────────────────────────────────
    let widths: number[];
    let densityLabels: string[] | undefined;

    if (displaySize != null) {
      // Density mode: use adaptive density calculation (same as component)
      const densities = computeDensities(displaySize, sourceWidth ?? undefined, explicitDensities ?? undefined, maxDpr);
      widths = computeWidths(displaySize, densities, sourceWidth ?? undefined);
      // Build density labels for reporting
      densityLabels = [];
      for (const d of densities) {
        let w = Math.round(displaySize * d);
        if (sourceWidth != null && w > sourceWidth) w = sourceWidth;
        const maxRetained = densityLabels.length > 0 ? widths[densityLabels.length - 1] : -1;
        if (w > (maxRetained ?? -1)) {
          densityLabels.push(`${d}x`);
        }
      }
    } else {
      // Fluid mode: use widths prop or defaults
      const widthsMatch = attrs.match(/\bwidths=\{(\[[^\]]+\])\}/);
      widths = widthsMatch
        ? (parseArrayProp(widthsMatch[1]!) as number[])
        : DEFAULT_WIDTHS;
    }

    // Static src="..."
    const srcMatch = attrs.match(/\bsrc=["']([^"']+)["']/);
    if (srcMatch) {
      const src = srcMatch[1]!;
      const sourcePath = findSourceImage(src);
      if (sourcePath) {
        staticTasks.push({
          src,
          widths,
          formats,
          sourcePath,
          origin: relativeFile,
          sourceWidth: sourceWidth ?? undefined,
          densityLabels,
          displaySize: displaySize ?? undefined,
          hasExplicitDensities: explicitDensities != null,
          maxDpr,
        });
      }
      continue;
    }

    // Dynamic src={variable}
    if (attrs.match(/\bsrc=\{/)) {
      dynamicPictures.push({ file: filePath, widths, formats, densityLabels, displaySize: displaySize ?? undefined, hasExplicitDensities: explicitDensities != null, maxDpr });
    }
  }

  return { static: staticTasks, dynamic: dynamicPictures };
}

/**
 * For a dynamic <Picture src={var}>, follow imports from the component file
 * to find /img/generated/ paths in imported data files.
 */
function resolvePathsForDynamicPicture(pic: DynamicPicture): ImageTask[] {
  const content = readFileSync(pic.file, "utf-8");
  const importPaths = extractImportPaths(content);
  const tasks: ImageTask[] = [];

  for (const importPath of importPaths) {
    const resolvedFile = resolveImportPath(importPath, pic.file);
    if (!resolvedFile) continue;

    const importedContent = readFileSync(resolvedFile, "utf-8");
    const generatedPaths = findGeneratedPaths(importedContent);

    for (const src of generatedPaths) {
      const sourcePath = findSourceImage(src);
      if (!sourcePath) {
        const tried = SOURCE_EXTENSIONS.map((ext) => `assets${src.replace(GENERATED_PREFIX, "/img/")}${ext}`).join(", ");
        console.error(`   ❌ Source image not found for ${src}! Looked for: ${tried}`);
        continue;
      }

      tasks.push({
        src,
        widths: pic.widths,
        formats: pic.formats,
        sourcePath,
        origin: `${pic.file.replace(websiteRoot + "/", "")} → ${resolvedFile.replace(websiteRoot + "/", "")}`,
        densityLabels: pic.densityLabels,
        displaySize: pic.displaySize,
        hasExplicitDensities: pic.hasExplicitDensities,
        maxDpr: pic.maxDpr,
      });
    }
  }

  return tasks;
}

// ─── Generation ──────────────────────────────────────────────────

async function generateVariants(task: ImageTask, qualityConfig: QualityConfig = DEFAULT_QUALITY): Promise<{
  generated: number;
  sourceBytes: number;
  outputBytes: number;
  bytesByFormat: Record<string, number>;
  bestFormatByWidth: { width: number; bytes: number; format: string }[];
  bytesByFormatByDensity: Record<string, Record<string, number>>;
  formats: string[];
}> {
  const sourceStats = statSync(task.sourcePath);
  let generated = 0;
  let sourceBytes = 0;
  let outputBytes = 0;
  const bytesByFormat: Record<string, number> = {};
  // Track best (smallest) format per width for "real user cost" summary
  const widthBest = new Map<number, { bytes: number; format: string }>();
  // Track bytes per format per density label
  const bytesByFormatByDensity: Record<string, Record<string, number>> = {};

  // Source size: the original file weight (counted once per image)
  sourceBytes = sourceStats.size;

  // ─── Upscaling prevention ─────────────────────────────────────
  // Get actual source width from sharp metadata
  const metadata = await sharp(task.sourcePath).metadata();
  const actualSourceWidth = task.sourceWidth ?? metadata.width;

  let effectiveWidths = task.widths;
  if (actualSourceWidth != null) {
    if (task.hasExplicitDensities) {
      // Explicit densities → allow upscale, but warn
      const upscaledWidths = task.widths.filter((w) => w > actualSourceWidth);
      for (const w of upscaledWidths) {
        console.warn(`   ⚠️  Upscaling ${task.src} to width ${w} (source is ${actualSourceWidth}) — forced by explicit densities`);
      }
      effectiveWidths = task.widths;
    } else {
      const validWidths = task.widths.filter((w) => w <= actualSourceWidth);
      const skippedWidths = task.widths.filter((w) => w > actualSourceWidth);

      for (const w of skippedWidths) {
        console.warn(`   ⚠️  Skipping ${task.src} at width ${w}: exceeds source width ${actualSourceWidth}`);
      }

      if (validWidths.length === 0) {
        // All widths exceed sourceWidth → generate a single variant at sourceWidth
        effectiveWidths = [actualSourceWidth];
      } else {
        effectiveWidths = validWidths;
      }
    }
  }

  for (let wi = 0; wi < effectiveWidths.length; wi++) {
    const width = effectiveWidths[wi]!;
    const densityLabel = task.densityLabels?.[wi] ?? `${wi + 1}x`;
    for (const fmt of task.formats) {
      const outPath = join(staticDir, `${task.src}-${width}.${fmt}`);
      const outDir = dirname(outPath);

      if (existsSync(outPath)) {
        const outStats = statSync(outPath);
        outputBytes += outStats.size;
        bytesByFormat[fmt] = (bytesByFormat[fmt] ?? 0) + outStats.size;
        bytesByFormatByDensity[fmt] ??= {};
        bytesByFormatByDensity[fmt]![densityLabel] = (bytesByFormatByDensity[fmt]![densityLabel] ?? 0) + outStats.size;
        // Track best format per width
        const cur = widthBest.get(width);
        if (!cur || outStats.size < cur.bytes) {
          widthBest.set(width, { bytes: outStats.size, format: fmt });
        }
        if (!FORCE && outStats.mtimeMs >= sourceStats.mtimeMs) continue;
        // Will be regenerated — subtract stale size, re-add after generation
        outputBytes -= outStats.size;
        bytesByFormat[fmt]! -= outStats.size;
        bytesByFormatByDensity[fmt]![densityLabel]! -= outStats.size;
      }

      if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
      }

      let pipeline = sharp(task.sourcePath).resize(width);
      switch (fmt) {
        case "avif":
          pipeline = pipeline.avif({ quality: qualityConfig.avif });
          break;
        case "webp":
          pipeline = pipeline.webp({ quality: qualityConfig.webp });
          break;
        case "png":
          pipeline = pipeline.png({ compressionLevel: Math.min(qualityConfig.png, 9) });
          break;
        case "jpeg":
        case "jpg":
          pipeline = pipeline.jpeg();
          break;
        default:
          pipeline = pipeline[fmt as "avif" | "webp" | "png" | "jpeg"]();
      }
      await pipeline.toFile(outPath);

      let newSize = statSync(outPath).size;

      // Post-check: if same format as source and generated is larger → copy source instead
      const sourceExt = task.sourcePath.split(".").pop()!.toLowerCase();
      const fmtNorm = fmt === "jpeg" ? "jpg" : fmt;
      const srcNorm = sourceExt === "jpeg" ? "jpg" : sourceExt;
      if (fmtNorm === srcNorm && newSize > sourceStats.size) {
        copyFileSync(task.sourcePath, outPath);
        newSize = sourceStats.size;
        console.log(`   ♻️  ${fmt} variant larger than source → kept original`);
      }
      outputBytes += newSize;
      bytesByFormat[fmt] = (bytesByFormat[fmt] ?? 0) + newSize;
      bytesByFormatByDensity[fmt] ??= {};
      bytesByFormatByDensity[fmt]![densityLabel] = (bytesByFormatByDensity[fmt]![densityLabel] ?? 0) + newSize;
      // Track best format per width (update after generation)
      const cur = widthBest.get(width);
      if (!cur || newSize < cur.bytes) {
        widthBest.set(width, { bytes: newSize, format: fmt });
      }
      generated++;
      console.log(`  + ${task.src}-${width}.${fmt}`);
    }
  }

  const bestFormatByWidth = effectiveWidths.map((w) => {
    const best = widthBest.get(w);
    return { width: w, bytes: best?.bytes ?? 0, format: best?.format ?? "?" };
  });

  return { generated, sourceBytes, outputBytes, bytesByFormat, bestFormatByWidth, bytesByFormatByDensity, formats: task.formats };
}

// ─── Main ────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("🖼️  Scanning for <Picture> usages...\n");
  if (FORCE) {
    const generatedDir = join(staticDir, "img", "generated");
    if (existsSync(generatedDir)) {
      rmSync(generatedDir, { recursive: true });
      console.log("🗑️  Cleaned static/img/generated/\n");
    }
  }

  // Ensure manifest exists (even empty) so webpack doesn't warn during parallel builds
  const manifestPath = join(staticDir, "img", "generated", "manifest.json");
  if (!existsSync(manifestPath)) {
    const manifestDir = dirname(manifestPath);
    if (!existsSync(manifestDir)) mkdirSync(manifestDir, { recursive: true });
    writeFileSync(manifestPath, "{}\n");
  }

  const files = [
    ...collectFiles(srcDir, [".tsx", ".mdx"]),
    ...collectFiles(docsDir, [".md", ".mdx"]),
    ...collectFiles(comparisonsDir, [".md", ".mdx"]),
  ];
  const taskMap = new Map<string, ImageTask>();
  let errors = 0;

  for (const file of files) {
    const { static: staticTasks, dynamic: dynamicPictures } = scanPictures(file);

    // Static <Picture src="..."> → direct match
    for (const task of staticTasks) {
      taskMap.set(task.src, task);
    }

    // Dynamic <Picture src={var}> → follow imports
    for (const pic of dynamicPictures) {
      const resolved = resolvePathsForDynamicPicture(pic);
      for (const task of resolved) {
        taskMap.set(task.src, task);
      }
    }
  }

  const tasks = [...taskMap.values()];

  if (tasks.length === 0) {
    console.log("No <Picture> usages found.");
    return;
  }

  console.log(`Found ${tasks.length} image(s) to process:\n`);

  let totalGenerated = 0;
  let totalSourceBytes = 0;
  let totalOutputBytes = 0;

  /** Manifest: maps each src to its effective maxDpr and generated widths */
  const manifestEntries: Record<string, { maxDpr: number; widths: number[] }> = {};

  // Separate accumulators for density-mode (fixed) vs fluid-mode (breakpoints)
  const fixed = {
    sourceBytes: 0,
    byFormatByDensity: {} as Record<string, Record<string, number>>,
    imageCountByFormat: {} as Record<string, number>,
  };
  const fluid = {
    sourceBytes: 0,
    byFormatByWidth: {} as Record<string, Record<string, number>>,
    imageCountByFormat: {} as Record<string, number>,
  };

  for (const task of tasks) {
    console.log(`📸 ${task.src} (from ${task.origin})`);
    console.log(`   widths: [${task.widths.join(", ")}] formats: [${task.formats.join(", ")}]`);
    console.log(`   source: ${task.sourcePath.replace(assetsDir + "/", "assets/")}`);

    const { generated, sourceBytes, outputBytes, bytesByFormatByDensity, formats } = await generateVariants(task);

    if (generated === 0) {
      console.log("   ✅ All variants up to date");
    } else {
      console.log(`   ✅ Generated ${generated} variant(s)`);
    }

    totalGenerated += generated;
    totalSourceBytes += sourceBytes;
    totalOutputBytes += outputBytes;

    const isDensityMode = task.densityLabels != null;

    // ─── Manifest data collection ─────────────────────────────────
    if (task.displaySize != null) {
      const meta = await sharp(task.sourcePath).metadata();
      const srcW = meta.width ?? Infinity;
      const naturalMaxDpr = Math.max(1, Math.floor(srcW / task.displaySize));
      const effectiveMaxDpr = Math.min(naturalMaxDpr, 3);
      // Use the widths that were actually generated (from the return value)
      const densities = computeDensities(task.displaySize, srcW, undefined, effectiveMaxDpr);
      const manifestWidths = computeWidths(task.displaySize, densities, srcW);
      manifestEntries[task.src] = {
        maxDpr: effectiveMaxDpr,
        widths: manifestWidths,
      };
    }

    if (isDensityMode) {
      fixed.sourceBytes += sourceBytes;
      for (const fmt of formats) {
        fixed.imageCountByFormat[fmt] = (fixed.imageCountByFormat[fmt] ?? 0) + 1;
      }
      for (const [fmt, densityMap] of Object.entries(bytesByFormatByDensity)) {
        fixed.byFormatByDensity[fmt] ??= {};
        for (const [density, bytes] of Object.entries(densityMap)) {
          fixed.byFormatByDensity[fmt]![density] = (fixed.byFormatByDensity[fmt]![density] ?? 0) + bytes;
        }
      }
    } else {
      fluid.sourceBytes += sourceBytes;
      for (const fmt of formats) {
        fluid.imageCountByFormat[fmt] = (fluid.imageCountByFormat[fmt] ?? 0) + 1;
      }
      for (const [fmt, densityMap] of Object.entries(bytesByFormatByDensity)) {
        fluid.byFormatByWidth[fmt] ??= {};
        for (const [density, bytes] of Object.entries(densityMap)) {
          // density here is the fallback "1x","2x"... but we remap to actual widths
          fluid.byFormatByWidth[fmt]![density] = (fluid.byFormatByWidth[fmt]![density] ?? 0) + bytes;
        }
      }
    }
    console.log();
  }

  if (errors > 0) {
    console.error(`⚠️  ${errors} source image(s) not found`);
  }
  if (totalGenerated === 0) {
    console.log("✅ All image variants are up to date!");
  } else {
    console.log(`✅ Generated ${totalGenerated} image variant(s)`);
  }

  const formatOrder = ['avif', 'webp', 'jpg', 'jpeg', 'png'];
  const colWidth = 18;
  const fmtColWidth = 10;
  const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
  const separatorAfter = new Set(['avif', 'webp']);

  function sortFormats(entries: [string, unknown][]): [string, unknown][] {
    return entries.sort((a, b) => {
      const ia = formatOrder.indexOf(a[0]);
      const ib = formatOrder.indexOf(b[0]);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  }

  function renderTable(
    title: string,
    srcBytes: number,
    cols: string[],
    byFormatByCol: Record<string, Record<string, number>>,
    countByFormat: Record<string, number>,
  ): void {
    const tableWidth = 3 + fmtColWidth + 1 + (colWidth + 1) * cols.length + 4;
    console.log("\n" + "═".repeat(tableWidth));
    console.log(`📊 ${title} — Sources: ${formatBytes(srcBytes)}`);

    function fmtCell(bytes: number): string {
      const pct = Math.round((1 - bytes / srcBytes) * 100);
      const sign = pct >= 0 ? "−" : "+";
      return `${formatBytes(bytes)} (${sign}${Math.abs(pct)}%)`;
    }

    const header = `   ${"Format".padEnd(fmtColWidth)} │${cols.map((d) => d.padStart(colWidth)).join(" │")}`;
    const sep = `   ${"─".repeat(fmtColWidth)}─┼${cols.map(() => "─".repeat(colWidth)).join("─┼")}`;
    console.log(header);
    console.log(sep);

    const dimSep = `   \x1b[2m${"─".repeat(fmtColWidth + 1)}\x1b[0m│\x1b[2m${cols.map(() => "─".repeat(colWidth + 1)).join(`\x1b[0m│\x1b[2m`)}\x1b[0m`;

    const formatEntries = sortFormats(Object.entries(countByFormat));
    for (const [fmt] of formatEntries) {
      const colMap = byFormatByCol[fmt] ?? {};
      const cells = cols.map((d) => {
        const bytes = colMap[d];
        return bytes != null ? fmtCell(bytes).padStart(colWidth) : "—".padStart(colWidth);
      }).join(" │");
      const count = countByFormat[fmt] ?? 0;
      const label = `${fmt.toUpperCase().padEnd(4)} (${count})`;
      console.log(`   ${label.padEnd(fmtColWidth)} │${cells}`);
      if (separatorAfter.has(fmt)) console.log(dimSep);
    }
    console.log("═".repeat(tableWidth));
  }

  // ─── Fixed (density mode) table ────────────────────────────────
  if (fixed.sourceBytes > 0) {
    const allDensities = new Set<string>();
    for (const densityMap of Object.values(fixed.byFormatByDensity)) {
      for (const d of Object.keys(densityMap)) allDensities.add(d);
    }
    const densityCols = [...allDensities].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (densityCols.length > 0) {
      renderTable("Fixed (density mode)", fixed.sourceBytes, densityCols, fixed.byFormatByDensity, fixed.imageCountByFormat);
    }
  }

  // ─── Fluid (breakpoints) table ─────────────────────────────────
  if (fluid.sourceBytes > 0) {
    // Remap fallback "1x","2x"... labels to actual "Nw" width labels
    // Collect all width labels and remap them
    const allWidthLabels = new Set<string>();
    for (const colMap of Object.values(fluid.byFormatByWidth)) {
      for (const d of Object.keys(colMap)) allWidthLabels.add(d);
    }
    // The fallback labels are "1x","2x","3x","4x" — we need to find the actual widths
    // from the fluid tasks to build proper "Nw" labels
    const fluidTasks = tasks.filter((t) => t.densityLabels == null);
    // Collect all unique widths from fluid tasks, sorted
    const allFluidWidths = [...new Set(fluidTasks.flatMap((t) => t.widths))].sort((a, b) => a - b);
    // Build mapping: "1x" → "400w", "2x" → "800w", etc.
    const labelToWidth: Record<string, string> = {};
    for (let i = 0; i < allFluidWidths.length; i++) {
      labelToWidth[`${i + 1}x`] = `${allFluidWidths[i]}w`;
    }
    // Remap the data
    const remapped: Record<string, Record<string, number>> = {};
    for (const [fmt, colMap] of Object.entries(fluid.byFormatByWidth)) {
      remapped[fmt] = {};
      for (const [label, bytes] of Object.entries(colMap)) {
        const wLabel = labelToWidth[label] ?? label;
        remapped[fmt]![wLabel] = (remapped[fmt]![wLabel] ?? 0) + bytes;
      }
    }
    const widthCols = allFluidWidths.map((w) => `${w}w`);
    if (widthCols.length > 0) {
      renderTable("Fluid (breakpoints)", fluid.sourceBytes, widthCols, remapped, fluid.imageCountByFormat);
    }
  }

  if (errors > 0) {
    process.exit(1);
  }

  // ─── Write manifest ────────────────────────────────────────────
  writeFileSync(manifestPath, JSON.stringify(manifestEntries, null, 2) + "\n");
  console.log(`\n📋 Manifest written: ${Object.keys(manifestEntries).length} entries → static/img/generated/manifest.json`);
}

main().catch((error) => {
  console.error("❌ Error generating images:", error);
  process.exit(1);
});
