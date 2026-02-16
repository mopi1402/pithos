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

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

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
const DEFAULT_FORMATS = ["avif", "webp", "png"];

interface ImageTask {
  src: string;
  widths: number[];
  formats: string[];
  sourcePath: string;
  origin: string;
}

interface DynamicPicture {
  file: string;
  widths: number[];
  formats: string[];
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

// ─── Picture scanning ────────────────────────────────────────────

function scanPictures(filePath: string): { static: ImageTask[]; dynamic: DynamicPicture[] } {
  const content = readFileSync(filePath, "utf-8");
  const staticTasks: ImageTask[] = [];
  const dynamicPictures: DynamicPicture[] = [];

  const pictureRegex = /<Picture\b([^>]*?)\/?>(?:\s*<\/Picture>)?/gs;
  let match: RegExpExecArray | null;

  while ((match = pictureRegex.exec(content)) !== null) {
    const attrs = match[1]!;

    const widthsMatch = attrs.match(/\bwidths=\{(\[[^\]]+\])\}/);
    const widths = widthsMatch
      ? (parseArrayProp(widthsMatch[1]!) as number[])
      : DEFAULT_WIDTHS;

    const formatsMatch = attrs.match(/\bformats=\{(\[[^\]]+\])\}/);
    const formats = formatsMatch
      ? (parseArrayProp(formatsMatch[1]!) as string[])
      : DEFAULT_FORMATS;

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
          origin: filePath.replace(websiteRoot + "/", ""),
        });
      }
      continue;
    }

    // Dynamic src={variable}
    if (attrs.match(/\bsrc=\{/)) {
      dynamicPictures.push({ file: filePath, widths, formats });
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
      });
    }
  }

  return tasks;
}

// ─── Generation ──────────────────────────────────────────────────

async function generateVariants(task: ImageTask): Promise<number> {
  const sourceStats = statSync(task.sourcePath);
  let generated = 0;

  for (const width of task.widths) {
    for (const fmt of task.formats) {
      const outPath = join(staticDir, `${task.src}-${width}.${fmt}`);
      const outDir = dirname(outPath);

      if (existsSync(outPath)) {
        const outStats = statSync(outPath);
        if (outStats.mtimeMs >= sourceStats.mtimeMs) continue;
      }

      if (!existsSync(outDir)) {
        mkdirSync(outDir, { recursive: true });
      }

      await sharp(task.sourcePath)
        .resize(width)
        [fmt as "avif" | "webp" | "png" | "jpeg"]()
        .toFile(outPath);
      generated++;
      console.log(`  + ${task.src}-${width}.${fmt}`);
    }
  }

  return generated;
}

// ─── Main ────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("🖼️  Scanning for <Picture> usages...\n");

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

  for (const task of tasks) {
    console.log(`📸 ${task.src} (from ${task.origin})`);
    console.log(`   widths: [${task.widths.join(", ")}] formats: [${task.formats.join(", ")}]`);
    console.log(`   source: ${task.sourcePath.replace(assetsDir + "/", "assets/")}`);

    const generated = await generateVariants(task);

    if (generated === 0) {
      console.log("   ✅ All variants up to date");
    } else {
      console.log(`   ✅ Generated ${generated} variant(s)`);
    }

    totalGenerated += generated;
    console.log();
  }

  console.log("═".repeat(50));
  if (errors > 0) {
    console.error(`⚠️  ${errors} source image(s) not found`);
  }
  if (totalGenerated === 0) {
    console.log("✅ All image variants are up to date!");
  } else {
    console.log(`✅ Generated ${totalGenerated} image variant(s)`);
  }
  console.log("═".repeat(50));

  if (errors > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("❌ Error generating images:", error);
  process.exit(1);
});
