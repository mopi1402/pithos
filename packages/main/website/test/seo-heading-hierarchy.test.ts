/**
 * Property-based tests for heading hierarchy correctness.
 *
 * **Property 5: Heading hierarchy correctness**
 * **Validates: Requirements 3.1**
 *
 * For any Markdown page in the website, verifies:
 * - There is exactly one H1 heading per page (either in content or via frontmatter title)
 * - No heading levels are skipped (e.g., H2 → H4 is forbidden)
 */
import { test, fc } from "@fast-check/vitest";
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join, extname } from "node:path";

const WEBSITE_ROOT = resolve(__dirname, "..");
const DOCS_DIR = resolve(WEBSITE_ROOT, "docs");
const COMPARISONS_DIR = resolve(WEBSITE_ROOT, "comparisons");

// --- Helpers ---

/** Recursively collect files matching extensions */
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

interface HeadingInfo {
  level: number;
  line: number;
  text: string;
}

interface PageAnalysis {
  file: string;
  hasFrontmatterTitle: boolean;
  headings: HeadingInfo[];
}

/** Analyze a markdown file for heading structure */
function analyzePage(filePath: string): PageAnalysis {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  let inCodeBlock = false;
  let frontmatterCount = 0;
  let inFrontmatter = false;
  let hasFrontmatterTitle = false;
  const headings: HeadingInfo[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track frontmatter delimiters
    if (line.trim() === "---") {
      frontmatterCount++;
      if (frontmatterCount === 1) inFrontmatter = true;
      if (frontmatterCount === 2) inFrontmatter = false;
      continue;
    }

    if (inFrontmatter) {
      if (/^title:/.test(line)) hasFrontmatterTitle = true;
      continue;
    }

    // Track code blocks
    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Match headings
    const match = line.match(/^(#{1,6})\s/);
    if (match) {
      headings.push({ level: match[1].length, line: i + 1, text: line.trim() });
    }
  }

  return {
    file: filePath.replace(WEBSITE_ROOT + "/", ""),
    hasFrontmatterTitle,
    headings,
  };
}

// --- Collect all page analyses ---

const markdownFiles = [
  ...collectFiles(DOCS_DIR, [".md", ".mdx"]),
  ...collectFiles(COMPARISONS_DIR, [".md", ".mdx"]),
];

const pages: PageAnalysis[] = markdownFiles.map(analyzePage);

// --- Tests ---

describe("SEO Heading Hierarchy Properties", () => {
  /**
   * Property 5: Heading hierarchy correctness
   * **Validates: Requirements 3.1**
   */
  describe("Property 5: Heading hierarchy correctness", () => {
    it("should have found pages to test", () => {
      expect(pages.length).toBeGreaterThan(0);
    });

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, pages.length - 1) })],
      { numRuns: Math.min(200, pages.length) },
    )(
      "every page should have exactly one H1 (content or frontmatter title)",
      (index) => {
        const page = pages[index];
        const h1Count = page.headings.filter((h) => h.level === 1).length;

        // Docusaurus generates H1 from frontmatter title, so either:
        // - The page has exactly one H1 in content (with or without frontmatter title)
        // - The page has a frontmatter title and zero H1 in content (Docusaurus generates it)
        const hasH1 = h1Count === 1 || (h1Count === 0 && page.hasFrontmatterTitle);

        expect(
          hasH1,
          `${page.file}: expected exactly one H1 (found ${h1Count} in content, frontmatter title: ${page.hasFrontmatterTitle})`,
        ).toBe(true);

        // Should never have more than one H1 in content
        expect(
          h1Count,
          `${page.file}: found ${h1Count} H1 headings in content (max 1 allowed)`,
        ).toBeLessThanOrEqual(1);
      },
    );

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, pages.length - 1) })],
      { numRuns: Math.min(200, pages.length) },
    )(
      "no heading levels should be skipped (e.g., H2 → H4 is forbidden)",
      (index) => {
        const page = pages[index];
        const { headings } = page;

        for (let i = 1; i < headings.length; i++) {
          const prev = headings[i - 1].level;
          const curr = headings[i].level;

          expect(
            curr <= prev + 1,
            `${page.file}: skipped heading level H${prev} → H${curr} at line ${headings[i].line}: "${headings[i].text}"`,
          ).toBe(true);
        }
      },
    );
  });
});
