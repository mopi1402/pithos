/**
 * Property-based tests for URL optimization.
 *
 * **Property 10: URL optimization**
 * **Validates: Requirements 4.1**
 *
 * For any page URL, the URL path segments should:
 * - Be lowercase
 * - Use hyphens as separators (no underscores, spaces, or special chars)
 * - Contain at least one relevant keyword
 */
import { test, fc } from "@fast-check/vitest";
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join, extname, basename, relative, dirname } from "node:path";

const WEBSITE_ROOT = resolve(__dirname, "..");
const DOCS_DIR = resolve(WEBSITE_ROOT, "docs");
const COMPARISONS_DIR = resolve(WEBSITE_ROOT, "comparisons");

// --- Helpers ---

/** Recursively collect markdown files */
function collectFiles(dir: string, extensions: string[]): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".docusaurus") {
      results.push(...collectFiles(fullPath, extensions));
    } else if (entry.isFile() && extensions.includes(extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

/** Extract frontmatter slug if present */
function extractSlug(content: string): string | null {
  const lines = content.split("\n");
  let inFrontmatter = false;
  let frontmatterCount = 0;

  for (const line of lines) {
    if (line.trim() === "---") {
      frontmatterCount++;
      if (frontmatterCount === 1) inFrontmatter = true;
      if (frontmatterCount === 2) break;
      continue;
    }
    if (inFrontmatter) {
      const match = line.match(/^slug:\s*["']?([^"'\n]+)["']?\s*$/);
      if (match) return match[1].trim();
    }
  }
  return null;
}

/**
 * Derive the URL path for a markdown file based on Docusaurus routing rules.
 *
 * Route base paths:
 * - docs/ → /guide/
 * - comparisons/ → /comparisons/
 *
 * If a frontmatter `slug` is present, it overrides the filename segment.
 * Index files (index.md) resolve to the parent directory path.
 */
function deriveUrlPath(filePath: string): string {
  const content = readFileSync(filePath, "utf-8");
  const slug = extractSlug(content);
  const relToDocs = relative(DOCS_DIR, filePath);
  const relToComparisons = relative(COMPARISONS_DIR, filePath);

  let routeBase: string;
  let relPath: string;

  if (!relToDocs.startsWith("..")) {
    routeBase = "/guide";
    relPath = relToDocs;
  } else if (!relToComparisons.startsWith("..")) {
    routeBase = "/comparisons";
    relPath = relToComparisons;
  } else {
    return filePath; // fallback
  }

  // Remove extension
  const withoutExt = relPath.replace(/\.(md|mdx)$/, "");

  if (slug) {
    // Slug can be absolute (starts with /) or relative
    if (slug.startsWith("/")) {
      return `${routeBase}${slug}`;
    }
    const dir = dirname(withoutExt);
    return dir === "." ? `${routeBase}/${slug}` : `${routeBase}/${dir}/${slug}`;
  }

  // index files resolve to parent directory
  const name = basename(withoutExt);
  if (name === "index") {
    const dir = dirname(withoutExt);
    return dir === "." ? routeBase : `${routeBase}/${dir}`;
  }

  return `${routeBase}/${withoutExt}`;
}

/** Known relevant keywords for the Pithos ecosystem */
const RELEVANT_KEYWORDS = [
  // Module names
  "arkhe", "kanon", "zygos", "sphalma", "taphos", "pithos",
  // Technical terms
  "guide", "api", "modules", "comparisons", "comparison",
  "get-started", "installation", "basics", "overview",
  "lodash", "zod", "neverthrow",
  "bundle", "size", "performances", "performance",
  "philosophy", "design", "architecture", "features",
  "contribution", "contributing",
  "changelog", "testing", "strategy",
  "best-practices", "practices",
  "example", "practical",
  "equivalence", "interoperability",
  "innovations", "transformations",
  "error", "handling",
  "typescript", "immutability",
  "documentation", "data-first",
  "synergistic", "ecosystem",
];

// Valid URL segment pattern: lowercase letters, numbers, hyphens only
const VALID_SEGMENT_REGEX = /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/;

interface PageUrl {
  filePath: string;
  relPath: string;
  urlPath: string;
  segments: string[];
}

// --- Collect all pages ---

const allFiles = [
  ...collectFiles(DOCS_DIR, [".md", ".mdx"]),
  ...collectFiles(COMPARISONS_DIR, [".md", ".mdx"]),
].filter((f) => !f.endsWith("_category_.json"));

const pages: PageUrl[] = allFiles.map((f) => {
  const urlPath = deriveUrlPath(f);
  // Split URL into segments, filtering out empty strings from leading /
  const segments = urlPath.split("/").filter(Boolean);
  return {
    filePath: f,
    relPath: f.replace(WEBSITE_ROOT + "/", ""),
    urlPath,
    segments,
  };
});

// --- Tests ---

describe("SEO URL Optimization Properties", () => {
  /**
   * Property 10: URL optimization
   * **Validates: Requirements 4.1**
   */
  describe("Property 10: URL optimization", () => {
    it("should have found pages to test", () => {
      expect(pages.length).toBeGreaterThan(0);
    });

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, pages.length - 1) })],
      { numRuns: Math.min(200, pages.length) },
    )(
      "URL path segments should be lowercase with hyphens only",
      (index) => {
        const page = pages[index];
        for (const segment of page.segments) {
          // Each segment should be lowercase
          expect(
            segment,
            `${page.relPath}: URL segment "${segment}" should be lowercase (URL: ${page.urlPath})`,
          ).toBe(segment.toLowerCase());

          // Each segment should only contain lowercase letters, numbers, and hyphens
          expect(
            VALID_SEGMENT_REGEX.test(segment),
            `${page.relPath}: URL segment "${segment}" contains invalid characters — only lowercase, numbers, and hyphens allowed (URL: ${page.urlPath})`,
          ).toBe(true);
        }
      },
    );

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, pages.length - 1) })],
      { numRuns: Math.min(200, pages.length) },
    )(
      "URL path should contain at least one relevant keyword",
      (index) => {
        const page = pages[index];
        const urlLower = page.urlPath.toLowerCase();
        const hasKeyword = RELEVANT_KEYWORDS.some((kw) => urlLower.includes(kw));
        expect(
          hasKeyword,
          `${page.relPath}: URL "${page.urlPath}" should contain at least one relevant keyword`,
        ).toBe(true);
      },
    );
  });
});
