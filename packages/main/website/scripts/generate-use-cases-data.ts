#!/usr/bin/env npx tsx
/* eslint-disable no-console */
/**
 * Generate use cases data from markdown files
 *
 * This script:
 * 1. Parses all use case markdown files using remark (AST-based parsing)
 * 2. Extracts structured data (title, description, code, etc.)
 * 3. Generates embeddings for semantic search (at build time)
 * 4. Outputs JSON files for the website
 *
 * Usage: npx tsx scripts/generate-use-cases-data.ts
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { unified } from "unified";
import remarkParse from "remark-parse";
import { toString } from "mdast-util-to-string";
import type { Root, Heading } from "mdast";

const __dirname = dirname(fileURLToPath(import.meta.url));
const useCasesDir = join(__dirname, "../../documentation/use_cases");
const outputDir = join(__dirname, "../src/data");
const staticUseCasesDir = join(__dirname, "../static/use_cases");
const outputPath = join(outputDir, "use-cases.json");
const embeddingsOutputPath = join(staticUseCasesDir, "use-cases-embeddings.json");

interface UseCase {
  title: string;
  primary: boolean;
  description: string;
  code: string;
  keywords: string[];
}

interface UtilData {
  id: string;
  module: string;
  category: string;
  name: string;
  popular: boolean;
  useCases: UseCase[];
}

interface UseCasesData {
  generatedAt: string;
  totalUtils: number;
  totalUseCases: number;
  utils: UtilData[];
}

interface EmbeddingEntry {
  id: string;
  text: string;
  utilId: string;
  useCaseIndex: number;
}

interface EmbeddingsData {
  generatedAt: string;
  entries: EmbeddingEntry[];
}

const parser = unified().use(remarkParse);

function ensureDir(dir: string): void {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Extract the title text from a heading node
 * Handles formats like:
 * - **Title** 📍
 * - **Title** rest of title 📍
 * - 1. **Title** rest of title 📍
 */
function extractHeadingTitle(heading: Heading): { title: string; primary: boolean } {
  const text = toString(heading);
  const primary = text.includes("📍");

  // Remove the 📍 emoji and any leading numbers like "1. "
  const title = text
    .replace(/📍/g, "")
    .replace(/^\d+\.\s*/, "")
    .trim();

  return { title, primary };
}

/**
 * Extract util name and popularity from the main heading (## `utilName` ⭐)
 */
function extractUtilHeader(heading: Heading): { name: string; popular: boolean } | null {
  const text = toString(heading);
  const match = text.match(/^`?(\w+)`?\s*(⭐)?/);
  if (!match) return null;

  return {
    name: match[1],
    popular: !!match[2],
  };
}

/**
 * Parse a markdown file using remark AST
 */
function parseMarkdownFile(filePath: string, module: string, category: string): UtilData | null {
  const content = readFileSync(filePath, "utf-8");
  const fileName = basename(filePath, ".md");

  if (fileName === "index") {
    return null;
  }

  const tree = parser.parse(content) as Root;
  const children = tree.children;

  // Find the main heading (## `utilName`)
  const mainHeading = children.find(
    (node): node is Heading => node.type === "heading" && node.depth === 2
  );

  if (!mainHeading) {
    console.warn(`  ⚠️ Could not find main heading in ${filePath}`);
    return null;
  }

  const utilHeader = extractUtilHeader(mainHeading);
  if (!utilHeader) {
    console.warn(`  ⚠️ Could not parse util header in ${filePath}`);
    return null;
  }

  const useCases: UseCase[] = [];
  let currentUseCase: Partial<UseCase> | null = null;

  // Iterate through all nodes to find use cases
  for (let i = 0; i < children.length; i++) {
    const node = children[i];

    // Check for use case heading (### **Title** ...)
    if (node.type === "heading" && node.depth === 3) {
      // Save previous use case if exists
      if (currentUseCase && currentUseCase.title) {
        useCases.push(currentUseCase as UseCase);
      }

      const { title, primary } = extractHeadingTitle(node);
      currentUseCase = {
        title,
        primary,
        description: "",
        code: "",
        keywords: [],
      };
      continue;
    }

    // Skip if we haven't found a use case heading yet
    if (!currentUseCase) continue;

    // Handle paragraph nodes (description or @keywords)
    if (node.type === "paragraph") {
      const text = toString(node).trim();

      // Check for @keywords line
      if (text.startsWith("@keywords:")) {
        currentUseCase.keywords = text
          .replace("@keywords:", "")
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean);
      } else if (!currentUseCase.description && text) {
        // First non-keywords paragraph is the description
        currentUseCase.description = text;
      }
    }

    // Handle code blocks
    if (node.type === "code" && !currentUseCase.code) {
      currentUseCase.code = node.value;
    }
  }

  // Save last use case
  if (currentUseCase && currentUseCase.title) {
    useCases.push(currentUseCase as UseCase);
  }

  if (useCases.length === 0) {
    console.warn(`  ⚠️ No use cases found in ${filePath}`);
    return null;
  }

  return {
    id: `${module}-${category}-${utilHeader.name}`,
    module,
    category,
    name: utilHeader.name,
    popular: utilHeader.popular,
    useCases,
  };
}

function walkDirectory(dir: string, module: string, category: string = ""): UtilData[] {
  const results: UtilData[] = [];

  if (!existsSync(dir)) {
    return results;
  }

  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      const newCategory = category ? `${category}/${entry}` : entry;
      results.push(...walkDirectory(fullPath, module, newCategory));
    } else if (entry.endsWith(".md") && entry !== "index.md") {
      const util = parseMarkdownFile(fullPath, module, category);
      if (util) {
        results.push(util);
      }
    }
  }

  return results;
}

function generateEmbeddingEntries(utils: UtilData[]): EmbeddingEntry[] {
  const entries: EmbeddingEntry[] = [];

  for (const util of utils) {
    for (let i = 0; i < util.useCases.length; i++) {
      const uc = util.useCases[i];
      const text = [
        uc.title,
        uc.description,
        ...uc.keywords,
        util.name,
        util.category.replace("/", " "),
        util.module,
      ].join(" ");

      entries.push({
        id: `${util.id}-${i}`,
        text,
        utilId: util.id,
        useCaseIndex: i,
      });
    }
  }

  return entries;
}

async function main(): Promise<void> {
  console.log("🔍 Generating use cases data...\n");

  if (!existsSync(useCasesDir)) {
    console.error(`❌ Use cases directory not found: ${useCasesDir}`);
    process.exit(1);
  }

  const allUtils: UtilData[] = [];

  const modules = readdirSync(useCasesDir).filter((entry) => {
    const fullPath = join(useCasesDir, entry);
    return statSync(fullPath).isDirectory();
  });

  console.log(`📦 Found modules: ${modules.join(", ")}\n`);

  for (const module of modules) {
    console.log(`\n━━━ Processing ${module} ━━━\n`);
    const moduleDir = join(useCasesDir, module);
    const utils = walkDirectory(moduleDir, module);
    console.log(`   Found ${utils.length} utilities`);
    allUtils.push(...utils);
  }

  const totalUseCases = allUtils.reduce((sum, u) => sum + u.useCases.length, 0);

  const data: UseCasesData = {
    generatedAt: new Date().toISOString(),
    totalUtils: allUtils.length,
    totalUseCases,
    utils: allUtils,
  };

  ensureDir(outputDir);
  writeFileSync(outputPath, JSON.stringify(data));
  console.log(`\n✅ Use cases data written to ${outputPath}`);

  const embeddingEntries = generateEmbeddingEntries(allUtils);
  const embeddingsData: EmbeddingsData = {
    generatedAt: new Date().toISOString(),
    entries: embeddingEntries,
  };

  ensureDir(staticUseCasesDir);
  writeFileSync(embeddingsOutputPath, JSON.stringify(embeddingsData));
  console.log(`✅ Embedding entries written to ${embeddingsOutputPath}`);

  console.log("\n" + "═".repeat(50));
  console.log("📊 Summary:");
  console.log(`   Modules: ${modules.length}`);
  console.log(`   Utilities: ${allUtils.length}`);
  console.log(`   Use cases: ${totalUseCases}`);
  console.log(`   Embedding entries: ${embeddingEntries.length}`);
  console.log("═".repeat(50) + "\n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
