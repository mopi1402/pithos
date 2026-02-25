#!/usr/bin/env npx tsx
/* eslint-disable no-console */
/**
 * Generate subset font files
 *
 * Takes the full font from assets/fonts/ and produces a minimal woff2
 * in static/fonts/ containing only the characters defined in font-config.ts.
 *
 * Requires: pyftsubset (from fonttools) + brotli
 *   pip install fonttools brotli
 *
 * Usage: pnpm exec tsx scripts/generate-fonts.ts [--force]
 */

import { existsSync, mkdirSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SUBSET_CHARS, FONT_CONFIG } from "./font-config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const websiteRoot = join(__dirname, "..");

const FORCE = process.argv.includes("--force");

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main(): Promise<void> {
  console.log("🔤 Font subsetting...\n");

  const sourcePath = join(websiteRoot, FONT_CONFIG.source);
  const outputPath = join(websiteRoot, FONT_CONFIG.output);

  if (!existsSync(sourcePath)) {
    console.error(`❌ Source font not found: ${FONT_CONFIG.source}`);
    process.exit(1);
  }

  // Mtime check (skip if output is newer than source)
  if (!FORCE && existsSync(outputPath)) {
    const srcMtime = statSync(sourcePath).mtimeMs;
    const outMtime = statSync(outputPath).mtimeMs;
    if (outMtime >= srcMtime) {
      const outSize = statSync(outputPath).size;
      console.log(`✅ Already up to date: ${FONT_CONFIG.output} (${formatBytes(outSize)})`);
      return;
    }
  }

  // Ensure output directory exists
  const outDir = dirname(outputPath);
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  // Deduplicate characters
  const uniqueChars = [...new Set(SUBSET_CHARS)].join("");
  console.log(`   Source: ${FONT_CONFIG.source} (${formatBytes(statSync(sourcePath).size)})`);
  console.log(`   Chars:  ${uniqueChars.length} unique glyphs`);
  console.log(`   Output: ${FONT_CONFIG.output}\n`);

  // Run pyftsubset
  try {
    execSync(
      `pyftsubset "${sourcePath}" --text="${uniqueChars}" --flavor=woff2 --output-file="${outputPath}"`,
      { stdio: "pipe" },
    );
  } catch (err) {
    console.error("❌ pyftsubset failed. Make sure fonttools + brotli are installed:");
    console.error("   pip install fonttools brotli");
    if (err instanceof Error && "stderr" in err) {
      console.error((err as { stderr: Buffer }).stderr.toString());
    }
    process.exit(1);
  }

  const srcSize = statSync(sourcePath).size;
  const outSize = statSync(outputPath).size;
  const pct = ((1 - outSize / srcSize) * 100).toFixed(0);

  console.log(`✅ ${formatBytes(srcSize)} → ${formatBytes(outSize)} (−${pct}%)`);
  console.log(`   ${uniqueChars.length} glyphs kept`);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
