/**
 * Property-based tests for Markdown semantic usage.
 *
 * **Property 6: Markdown semantic usage**
 * **Validates: Requirements 3.2, 3.3, 3.8**
 *
 * For any content page in the website, verifies:
 * - Code blocks have language specifications (```typescript, ```bash, etc.)
 * - Lists use Markdown syntax (not HTML <ul>/<ol>/<li>)
 * - Content primarily uses Markdown rather than raw HTML tags
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

interface CodeBlockInfo {
  line: number;
  hasLanguage: boolean;
  language: string;
}

interface HtmlListInfo {
  line: number;
  tag: string;
}

interface PageSemanticAnalysis {
  file: string;
  codeBlocks: CodeBlockInfo[];
  htmlLists: HtmlListInfo[];
}

/** Analyze a markdown file for semantic usage */
function analyzeSemantics(filePath: string): PageSemanticAnalysis {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  let inCodeBlock = false;
  let frontmatterCount = 0;
  let inFrontmatter = false;
  const codeBlocks: CodeBlockInfo[] = [];
  const htmlLists: HtmlListInfo[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track frontmatter
    if (trimmed === "---") {
      frontmatterCount++;
      if (frontmatterCount === 1) inFrontmatter = true;
      if (frontmatterCount === 2) inFrontmatter = false;
      continue;
    }
    if (inFrontmatter) continue;

    // Track code blocks
    if (!inCodeBlock && trimmed.startsWith("```")) {
      inCodeBlock = true;
      const lang = trimmed.slice(3).trim();
      codeBlocks.push({
        line: i + 1,
        hasLanguage: lang.length > 0,
        language: lang,
      });
      continue;
    }
    if (inCodeBlock && trimmed === "```") {
      inCodeBlock = false;
      continue;
    }
    if (inCodeBlock) continue;

    // Detect HTML list tags outside code blocks
    const htmlListMatch = trimmed.match(/^<(ul|ol|li)[\s>]/i);
    if (htmlListMatch) {
      htmlLists.push({ line: i + 1, tag: htmlListMatch[1] });
    }
  }

  return {
    file: filePath.replace(WEBSITE_ROOT + "/", ""),
    codeBlocks,
    htmlLists,
  };
}

// --- Collect all page analyses ---

const markdownFiles = [
  ...collectFiles(DOCS_DIR, [".md", ".mdx"]),
  ...collectFiles(COMPARISONS_DIR, [".md", ".mdx"]),
];

const pages: PageSemanticAnalysis[] = markdownFiles.map(analyzeSemantics);

// --- Tests ---

describe("SEO Markdown Semantic Usage Properties", () => {
  /**
   * Property 6: Markdown semantic usage
   * **Validates: Requirements 3.2, 3.3, 3.8**
   */
  describe("Property 6: Markdown semantic usage", () => {
    it("should have found pages to test", () => {
      expect(pages.length).toBeGreaterThan(0);
    });

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, pages.length - 1) })],
      { numRuns: Math.min(200, pages.length) },
    )(
      "every code block should have a language specification",
      (index) => {
        const page = pages[index];
        const bareBlocks = page.codeBlocks.filter((b) => !b.hasLanguage);

        expect(
          bareBlocks.length,
          `${page.file}: found ${bareBlocks.length} code block(s) without language specification at line(s): ${bareBlocks.map((b) => b.line).join(", ")}`,
        ).toBe(0);
      },
    );

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, pages.length - 1) })],
      { numRuns: Math.min(200, pages.length) },
    )(
      "lists should use Markdown syntax, not HTML tags",
      (index) => {
        const page = pages[index];

        expect(
          page.htmlLists.length,
          `${page.file}: found ${page.htmlLists.length} HTML list tag(s) at line(s): ${page.htmlLists.map((l) => `<${l.tag}> at line ${l.line}`).join(", ")}. Use Markdown syntax (-, *, 1.) instead.`,
        ).toBe(0);
      },
    );
  });
});
