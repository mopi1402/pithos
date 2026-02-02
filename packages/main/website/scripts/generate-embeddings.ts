#!/usr/bin/env npx tsx
/* eslint-disable */
/**
 * Generate precomputed embeddings at build time
 *
 * This script:
 * 1. Loads the Xenova/all-MiniLM-L6-v2 model in Node.js
 * 2. Reads entries from use-cases-embeddings.json
 * 3. Computes embeddings with {pooling: "mean", normalize: true}
 * 4. Generates MD5 checksum for integrity validation
 * 5. Saves to precomputed-embeddings.json with metadata
 *
 * Usage: npx tsx scripts/generate-embeddings.ts
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
// Dynamically import transformers to avoid sharp dependency issues
let pipeline: any;
let env: any;

async function loadTransformers() {
  const transformers = await import("@xenova/transformers");
  pipeline = transformers.pipeline;
  env = transformers.env;
  
  // Configure transformers.js for Node.js
  env.allowLocalModels = false;
  env.useBrowserCache = false; // Use Node.js cache instead
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = join(__dirname, "../static/use_cases/use-cases-embeddings.json");
const outputPath = join(__dirname, "../static/use_cases/precomputed-embeddings.json");

// Model configuration - must match runtime worker settings
const MODEL_NAME = "Xenova/all-MiniLM-L6-v2";
const EMBEDDING_DIMENSION = 384; // Dimension for all-MiniLM-L6-v2

interface EmbeddingEntry {
  id: string;
  text: string;
  utilId: string;
  useCaseIndex: number;
}

interface EmbeddingsInputData {
  generatedAt: string;
  entries: EmbeddingEntry[];
}

interface PrecomputedEmbeddingsFile {
  metadata: {
    generatedAt: string;
    modelName: string;
    modelVersion: string;
    entryCount: number;
    embeddingDimension: number;
    checksum: string;
  };
  embeddings: {
    [entryId: string]: number[];
  };
}

/**
 * Compute MD5 checksum of embeddings for integrity validation
 */
function computeChecksum(embeddings: { [key: string]: number[] }): string {
  const embeddingsStr = JSON.stringify(embeddings);
  return createHash("md5").update(embeddingsStr).digest("hex");
}

/**
 * Validate that an embedding has the correct dimension
 */
function validateEmbedding(embedding: number[], entryId: string): void {
  if (!Array.isArray(embedding)) {
    throw new Error(`Invalid embedding for ${entryId}: not an array`);
  }
  
  if (embedding.length !== EMBEDDING_DIMENSION) {
    throw new Error(
      `Invalid embedding dimension for ${entryId}: expected ${EMBEDDING_DIMENSION}, got ${embedding.length}`
    );
  }
  
  // Check for NaN or invalid values
  for (let i = 0; i < embedding.length; i++) {
    if (!Number.isFinite(embedding[i])) {
      throw new Error(`Invalid embedding value for ${entryId} at index ${i}: ${embedding[i]}`);
    }
  }
}

/**
 * Compute embedding for a single text using the model
 */
async function computeEmbedding(
  extractor: Awaited<ReturnType<typeof pipeline>>,
  text: string
): Promise<number[]> {
  const output = await extractor(text, { pooling: "mean", normalize: true });
  return Array.from(output.data as Float32Array);
}

/**
 * Main function to generate precomputed embeddings
 */
async function main(): Promise<void> {
  console.log("🚀 Starting precomputed embeddings generation...\n");
  const startTime = performance.now();

  // Step 0: Load transformers dynamically
  console.log("📦 Loading @xenova/transformers...");
  try {
    await loadTransformers();
    console.log("✅ Transformers loaded successfully\n");
  } catch (error) {
    console.error(`❌ Failed to load transformers:`, error);
    process.exit(1);
  }

  // Step 1: Check if input file exists
  if (!existsSync(inputPath)) {
    console.error(`❌ Input file not found: ${inputPath}`);
    console.error("   Please run 'pnpm run generate:use-cases' first.");
    process.exit(1);
  }

  // Step 2: Load input data
  console.log(`📖 Reading entries from ${inputPath}...`);
  let inputData: EmbeddingsInputData;
  try {
    const inputContent = readFileSync(inputPath, "utf-8");
    inputData = JSON.parse(inputContent);
  } catch (error) {
    console.error(`❌ Failed to read or parse input file:`, error);
    process.exit(1);
  }

  const { entries } = inputData;
  console.log(`   Found ${entries.length} entries to process\n`);

  if (entries.length === 0) {
    console.warn("⚠️  No entries found in input file. Generating empty embeddings file.");
  }

  // Step 3: Load the model
  console.log(`🤖 Loading model: ${MODEL_NAME}...`);
  const modelStartTime = performance.now();
  
  let extractor: Awaited<ReturnType<typeof pipeline>>;
  try {
    extractor = await pipeline("feature-extraction", MODEL_NAME, {
      progress_callback: (progress: { status?: string; progress?: number }) => {
        if (progress.status) {
          process.stdout.write(`\r   ${progress.status}...`);
        }
      },
    });
    process.stdout.write("\r"); // Clear progress line
    const modelDuration = performance.now() - modelStartTime;
    console.log(`✅ Model loaded in ${(modelDuration / 1000).toFixed(1)}s\n`);
  } catch (error) {
    console.error(`❌ Failed to load model:`, error);
    console.error("   Check your internet connection and try again.");
    process.exit(1);
  }

  // Step 4: Compute embeddings
  console.log(`🔄 Computing embeddings for ${entries.length} entries...`);
  const embeddings: { [entryId: string]: number[] } = {};
  const computeStartTime = performance.now();

  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const entryStartTime = performance.now();

    try {
      const embedding = await computeEmbedding(extractor, entry.text);
      
      // Validate embedding before saving
      validateEmbedding(embedding, entry.id);
      
      // Round to 6 decimal places to reduce file size
      embeddings[entry.id] = embedding.map((v) => Math.round(v * 1e6) / 1e6);
      
      const entryDuration = performance.now() - entryStartTime;
      
      // Log progress every 10 entries or on last entry
      if (i % 10 === 0 || i === entries.length - 1) {
        const progress = ((i + 1) / entries.length * 100).toFixed(1);
        console.log(`   [${progress}%] ${i + 1}/${entries.length} - ${entry.id} (${entryDuration.toFixed(0)}ms)`);
      }
    } catch (error) {
      console.error(`❌ Failed to compute embedding for entry ${entry.id}:`, error);
      process.exit(1);
    }
  }

  const computeDuration = performance.now() - computeStartTime;
  const avgTimePerEntry = computeDuration / entries.length;
  console.log(`✅ All embeddings computed in ${(computeDuration / 1000).toFixed(1)}s`);
  console.log(`   Average: ${avgTimePerEntry.toFixed(0)}ms per entry\n`);

  // Step 5: Generate checksum
  console.log(`🔐 Generating checksum...`);
  const checksum = computeChecksum(embeddings);
  console.log(`   Checksum: ${checksum}\n`);

  // Step 6: Get model version from package
  let modelVersion = "unknown";
  try {
    const packageJsonPath = join(__dirname, "../package.json");
    const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
    modelVersion = packageJson.dependencies["@xenova/transformers"] || "unknown";
  } catch (error) {
    console.warn("⚠️  Could not determine model version from package.json");
  }

  // Step 7: Create output file
  const outputData: PrecomputedEmbeddingsFile = {
    metadata: {
      generatedAt: new Date().toISOString(),
      modelName: MODEL_NAME,
      modelVersion,
      entryCount: entries.length,
      embeddingDimension: EMBEDDING_DIMENSION,
      checksum,
    },
    embeddings,
  };

  console.log(`💾 Writing precomputed embeddings to ${outputPath}...`);
  try {
    // Ensure output directory exists
    const outputDir = dirname(outputPath);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
      console.log(`   Created directory: ${outputDir}`);
    }
    
    writeFileSync(outputPath, JSON.stringify(outputData));
    const fileSize = (Buffer.byteLength(JSON.stringify(outputData)) / 1024 / 1024).toFixed(2);
    console.log(`✅ File written successfully (${fileSize} MB)\n`);
  } catch (error) {
    console.error(`❌ Failed to write output file:`, error);
    process.exit(1);
  }

  // Step 8: Summary
  const totalDuration = performance.now() - startTime;
  console.log("═".repeat(60));
  console.log("📊 Summary:");
  console.log(`   Model: ${MODEL_NAME}`);
  console.log(`   Entries processed: ${entries.length}`);
  console.log(`   Embedding dimension: ${EMBEDDING_DIMENSION}`);
  console.log(`   Checksum: ${checksum}`);
  console.log(`   Total time: ${(totalDuration / 1000).toFixed(1)}s`);
  console.log(`   Output: ${outputPath}`);
  console.log("═".repeat(60) + "\n");
  console.log("✨ Precomputed embeddings generation complete!");
}

// Run the script
main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  process.exit(1);
});
