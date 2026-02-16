/**
 * Property-based tests for comparison pages.
 *
 * **Property 15: Schema.org presence by page type**
 * **Validates: Requirements 5.4, 5.7, 8.5**
 *
 * For any comparison page ("*-vs-*"), the page should:
 * - Contain benchmark/performance content
 * - Have a valid Schema.org Article JSON-LD with required fields
 */
import { test, fc } from "@fast-check/vitest";
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join, extname } from "node:path";

const COMPARISONS_DIR = resolve(__dirname, "../comparisons");

// --- Helpers ---

/** Recursively collect files matching a name pattern */
function collectComparisonFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules") {
      results.push(...collectComparisonFiles(fullPath));
    } else if (
      entry.isFile() &&
      [".md", ".mdx"].includes(extname(entry.name).toLowerCase()) &&
      entry.name.includes("-vs-")
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

/** Extract the first JSON.stringify Schema.org block from MDX content */
function extractSchemaOrg(content: string): Record<string, unknown> | null {
  // Check for inline JSON.stringify (legacy)
  const inlineMatch = content.match(/JSON\.stringify\(\s*(\{[\s\S]*?\})\s*\)/);
  if (inlineMatch) {
    try {
      return JSON.parse(inlineMatch[1]);
    } catch {
      return null;
    }
  }

  // Check for <ArticleSchema> component usage
  const componentMatch = content.match(
    /<ArticleSchema\s+([\s\S]*?)\/>/
  );
  if (componentMatch) {
    const attrs = componentMatch[1];
    const headline = attrs.match(/headline="([^"]+)"/)?.[1];
    const description = attrs.match(/description="([^"]+)"/)?.[1];
    const datePublished = attrs.match(/datePublished="([^"]+)"/)?.[1];
    if (headline && description && datePublished) {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline,
        description,
        datePublished,
        author: { "@type": "Person", name: "Pierre Moati" },
        publisher: { "@type": "Organization", name: "Pithos" },
      };
    }
  }

  return null;
}

/** Check if content contains benchmark/performance references */
function containsBenchmarkContent(content: string): boolean {
  const lower = content.toLowerCase();
  const benchmarkTerms = [
    "benchmark",
    "performance",
    "bundle size",
    "ops/s",
    "gzipped",
    "faster",
    "smaller",
  ];
  return benchmarkTerms.some((term) => lower.includes(term));
}

// --- Collect comparison pages ---

const comparisonFiles = collectComparisonFiles(COMPARISONS_DIR);

const comparisonPages = comparisonFiles.map((filePath) => {
  const content = readFileSync(filePath, "utf-8");
  const relPath = filePath.replace(resolve(__dirname, "..") + "/", "");
  const schema = extractSchemaOrg(content);
  return { filePath, relPath, content, schema };
});

// --- Tests ---

describe("SEO Comparison Pages (Property 15: Schema.org presence by page type)", () => {
  it("should have found comparison pages to test", () => {
    expect(comparisonPages.length).toBeGreaterThanOrEqual(3);
  });

  /**
   * Property 15: Schema.org presence by page type (Article for comparisons)
   * **Validates: Requirements 5.4, 5.7, 8.5**
   */
  describe("Property 15: Schema.org Article presence and validity", () => {
    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, comparisonPages.length - 1) })],
      { numRuns: Math.min(100, comparisonPages.length) },
    )(
      "every comparison page should have a valid Schema.org Article JSON-LD",
      (index) => {
        const page = comparisonPages[index];

        // Schema.org must be present
        expect(
          page.schema,
          `${page.relPath}: missing Schema.org JSON-LD block`,
        ).not.toBeNull();

        const schema = page.schema!;

        // Must be Article type
        expect(schema["@context"]).toBe("https://schema.org");
        expect(
          schema["@type"],
          `${page.relPath}: Schema.org @type should be "Article"`,
        ).toBe("Article");

        // Required Article fields
        expect(
          typeof schema.headline,
          `${page.relPath}: Schema.org Article missing "headline"`,
        ).toBe("string");
        expect((schema.headline as string).length).toBeGreaterThan(0);

        expect(
          typeof schema.description,
          `${page.relPath}: Schema.org Article missing "description"`,
        ).toBe("string");

        // Author
        const author = schema.author as Record<string, unknown> | undefined;
        expect(
          author,
          `${page.relPath}: Schema.org Article missing "author"`,
        ).toBeDefined();
        expect(author!["@type"]).toBeTruthy();
        expect(typeof author!.name).toBe("string");

        // Publisher
        const publisher = schema.publisher as Record<string, unknown> | undefined;
        expect(
          publisher,
          `${page.relPath}: Schema.org Article missing "publisher"`,
        ).toBeDefined();
        expect(publisher!["@type"]).toBe("Organization");
        expect(publisher!.name).toBe("Pithos");

        // Dates
        expect(
          typeof schema.datePublished,
          `${page.relPath}: Schema.org Article missing "datePublished"`,
        ).toBe("string");
      },
    );
  });

  describe("Comparison pages contain benchmark content (Requirement 8.5)", () => {
    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, comparisonPages.length - 1) })],
      { numRuns: Math.min(100, comparisonPages.length) },
    )(
      "every comparison page should reference benchmarks or performance data",
      (index) => {
        const page = comparisonPages[index];
        expect(
          containsBenchmarkContent(page.content),
          `${page.relPath}: comparison page should contain benchmark or performance content`,
        ).toBe(true);
      },
    );
  });
});
