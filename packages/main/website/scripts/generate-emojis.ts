#!/usr/bin/env npx tsx
/* eslint-disable no-console */
/**
 * Generate optimized WebP emoji images
 *
 * Converts source emoji PNGs (256×256) to smaller WebP files (128px max)
 * for faster loading. At 64px max display size, 2× density (128px) covers
 * Retina screens — 3× adds no perceptible benefit at these small sizes.
 *
 * Convention:
 *   - Source:    assets/img/emoji/{name}.png
 *   - Output:   static/img/emoji/{name}.webp
 *
 * The script is idempotent: it skips emojis whose output is newer than
 * the source (mtime check). Corrupted or unreadable sources are warned
 * and skipped.
 *
 * Usage: pnpm exec tsx scripts/generate-emojis.ts
 */

import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

import { EMOJI_CONFIG } from "./image-config.js";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const websiteRoot = join(__dirname, "..");
const emojiSourceDir = join(websiteRoot, "assets/img/emoji");
const emojiOutputDir = join(websiteRoot, "static/img/emoji");

async function main(): Promise<void> {
  const start = performance.now();
  console.log("😀 Scanning emoji sources...\n");

  const pngFiles = readdirSync(emojiSourceDir).filter((f) => f.endsWith(".png"));

  if (pngFiles.length === 0) {
    console.log("No emoji PNGs found.");
    return;
  }

  console.log(`Found ${pngFiles.length} emoji(s) to process.\n`);

  if (!existsSync(emojiOutputDir)) {
    mkdirSync(emojiOutputDir, { recursive: true });
  }

  let generated = 0;
  let skipped = 0;
  let upToDate = 0;
  let totalSourceBytes = 0;
  let totalOutputBytes = 0;

  for (const file of pngFiles) {
    const name = file.replace(/\.png$/, "");
    const sourcePath = join(emojiSourceDir, file);
    const outPath = join(emojiOutputDir, `${name}.webp`);

    const srcSize = statSync(sourcePath).size;
    totalSourceBytes += srcSize;

    // ── Mtime check: skip if output is up to date ──
    if (existsSync(outPath)) {
      const srcMtime = statSync(sourcePath).mtimeMs;
      const outStats = statSync(outPath);
      if (outStats.mtimeMs >= srcMtime) {
        totalOutputBytes += outStats.size;
        upToDate++;
        continue;
      }
    }

    // ── Read source and compute target size ──
    let metadata: sharp.Metadata;
    try {
      metadata = await sharp(sourcePath).metadata();
    } catch {
      console.warn(`⚠️  Skipping ${file}: unable to read image (corrupted or unreadable)`);
      skipped++;
      continue;
    }

    const sourceWidth = metadata.width;
    if (!sourceWidth) {
      console.warn(`⚠️  Skipping ${file}: could not determine source width`);
      skipped++;
      continue;
    }

    // No upscaling: use the smaller of targetSize and sourceWidth
    const targetWidth = Math.min(EMOJI_CONFIG.targetSize, sourceWidth);

    try {
      await sharp(sourcePath)
        .resize(targetWidth)
        .webp({ quality: EMOJI_CONFIG.webpQuality })
        .toFile(outPath);

      totalOutputBytes += statSync(outPath).size;
      generated++;
      console.log(`  + ${name}.webp (${sourceWidth}px → ${targetWidth}px)`);
    } catch {
      console.warn(`⚠️  Skipping ${file}: conversion failed`);
      skipped++;
    }
  }

  const elapsed = ((performance.now() - start) / 1000).toFixed(2);

  console.log();
  console.log("═".repeat(50));
  if (generated === 0 && skipped === 0) {
    console.log("✅ All emoji variants are up to date!");
  } else {
    if (generated > 0) console.log(`✅ Generated ${generated} emoji(s)`);
    if (upToDate > 0) console.log(`⏭️  ${upToDate} emoji(s) already up to date`);
    if (skipped > 0) console.warn(`⚠️  ${skipped} emoji(s) skipped (warnings above)`);
  }
  console.log(`⏱️  Done in ${elapsed}s`);
  if (totalSourceBytes > 0) {
    const pct = ((1 - totalOutputBytes / totalSourceBytes) * 100).toFixed(0);
    console.log(`📊 ${formatBytes(totalSourceBytes)} → ${formatBytes(totalOutputBytes)} (−${pct}%)`);
  }
  console.log("═".repeat(50));
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
