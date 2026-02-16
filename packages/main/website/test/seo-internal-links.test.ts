/**
 * Property-based tests for internal linking.
 *
 * **Property 11: Bidirectional internal linking**
 * **Validates: Requirements 4.2, 4.3**
 *
 * **Property 13: Minimum internal links per page**
 * **Validates: Requirements 4.5**
 *
 * **Property 14: Descriptive anchor texts**
 * **Validates: Requirements 4.6**
 */
import { test, fc } from "@fast-check/vitest";
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join, extname } from "node:path";

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

interface LinkInfo {
  text: string;
  href: string;
  line: number;
}

/** Extract markdown links from content, excluding code blocks and frontmatter */
function extractLinks(content: string): LinkInfo[] {
  const lines = content.split("\n");
  const links: LinkInfo[] = [];
  let inCodeBlock = false;
  let frontmatterCount = 0;
  let inFrontmatter = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === "---") {
      frontmatterCount++;
      if (frontmatterCount === 1) inFrontmatter = true;
      if (frontmatterCount === 2) inFrontmatter = false;
      continue;
    }
    if (inFrontmatter) continue;

    if (line.trim().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Match markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = linkRegex.exec(line)) !== null) {
      links.push({ text: match[1], href: match[2], line: i + 1 });
    }
  }
  return links;
}

/** Check if a link is internal (starts with / or ./) */
function isInternalLink(href: string): boolean {
  return href.startsWith("/") || href.startsWith("./") || href.startsWith("../");
}

const GENERIC_ANCHORS = [
  "click here",
  "cliquez ici",
  "here",
  "ici",
  "read more",
  "en savoir plus",
  "link",
  "lien",
  "this",
  "ceci",
];

// --- Collect pages ---

const moduleFiles = collectFiles(DOCS_DIR, [".md", ".mdx"]).filter(
  (f) => f.includes("/modules/") && !f.endsWith("index.md"),
);

const comparisonFiles = collectFiles(COMPARISONS_DIR, [".md", ".mdx"]).filter(
  (f) => f.includes("-vs-"),
);

const allContentFiles = [
  ...collectFiles(DOCS_DIR, [".md", ".mdx"]),
  ...collectFiles(COMPARISONS_DIR, [".md", ".mdx"]),
].filter((f) => !f.endsWith("index.md") && !f.endsWith("_category_.json"));

interface PageLinks {
  filePath: string;
  relPath: string;
  links: LinkInfo[];
  internalLinks: LinkInfo[];
}

function analyzePageLinks(filePath: string): PageLinks {
  const content = readFileSync(filePath, "utf-8");
  const links = extractLinks(content);
  const internalLinks = links.filter((l) => isInternalLink(l.href));
  return {
    filePath,
    relPath: filePath.replace(WEBSITE_ROOT + "/", ""),
    links,
    internalLinks,
  };
}

const modulePages = moduleFiles.map(analyzePageLinks);
const comparisonPages = comparisonFiles.map(analyzePageLinks);
const allPages = allContentFiles.map(analyzePageLinks);

// --- Tests ---

describe("SEO Internal Links Properties", () => {
  /**
   * Property 11: Bidirectional internal linking
   * **Validates: Requirements 4.2, 4.3**
   *
   * Module pages should link to their comparison pages, and comparison pages
   * should link back to the module pages.
   */
  describe("Property 11: Bidirectional internal linking", () => {
    const bidirectionalPairs = [
      {
        module: modulePages.find((p) => p.relPath.includes("arkhe")),
        comparison: comparisonPages.find((p) => p.relPath.includes("arkhe-vs-lodash")),
        moduleSlug: "arkhe",
        comparisonSlug: "arkhe-vs-lodash",
      },
      {
        module: modulePages.find((p) => p.relPath.includes("kanon")),
        comparison: comparisonPages.find((p) => p.relPath.includes("kanon-vs-zod")),
        moduleSlug: "kanon",
        comparisonSlug: "kanon-vs-zod",
      },
      {
        module: modulePages.find((p) => p.relPath.includes("zygos")),
        comparison: comparisonPages.find((p) => p.relPath.includes("zygos-vs-neverthrow")),
        moduleSlug: "zygos",
        comparisonSlug: "zygos-vs-neverthrow",
      },
    ].filter((p) => p.module && p.comparison);

    it("should have found bidirectional pairs to test", () => {
      expect(bidirectionalPairs.length).toBeGreaterThanOrEqual(3);
    });

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, bidirectionalPairs.length - 1) })],
      { numRuns: bidirectionalPairs.length },
    )(
      "module pages should link to their comparison pages",
      (index) => {
        const pair = bidirectionalPairs[index];
        const moduleLinks = pair.module!.internalLinks;
        const hasLinkToComparison = moduleLinks.some(
          (l) => l.href.includes(pair.comparisonSlug) || l.href.includes("comparisons"),
        );
        expect(
          hasLinkToComparison,
          `${pair.module!.relPath}: should link to comparison page (${pair.comparisonSlug})`,
        ).toBe(true);
      },
    );

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, bidirectionalPairs.length - 1) })],
      { numRuns: bidirectionalPairs.length },
    )(
      "comparison pages should link back to their module pages",
      (index) => {
        const pair = bidirectionalPairs[index];
        const compLinks = pair.comparison!.internalLinks;
        const hasLinkToModule = compLinks.some(
          (l) => l.href.includes(`/modules/${pair.moduleSlug}`) || l.href.includes(`modules/${pair.moduleSlug}`),
        );
        expect(
          hasLinkToModule,
          `${pair.comparison!.relPath}: should link back to module page (${pair.moduleSlug})`,
        ).toBe(true);
      },
    );
  });

  /**
   * Property 13: Minimum internal links per page
   * **Validates: Requirements 4.5**
   *
   * Every module and comparison page should have at least 3 internal links.
   */
  describe("Property 13: Minimum internal links per page", () => {
    const contentPages = [...modulePages, ...comparisonPages];

    it("should have found content pages to test", () => {
      expect(contentPages.length).toBeGreaterThan(0);
    });

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, contentPages.length - 1) })],
      { numRuns: Math.min(100, contentPages.length) },
    )(
      "every module/comparison page should have at least 3 internal links",
      (index) => {
        const page = contentPages[index];
        expect(
          page.internalLinks.length,
          `${page.relPath}: has ${page.internalLinks.length} internal links (minimum 3 required)`,
        ).toBeGreaterThanOrEqual(3);
      },
    );
  });

  /**
   * Property 14: Descriptive anchor texts
   * **Validates: Requirements 4.6**
   *
   * No internal link should use generic anchor text like "click here", "here", "read more".
   */
  describe("Property 14: Descriptive anchor texts", () => {
    const pagesWithLinks = allPages.filter((p) => p.internalLinks.length > 0);

    it("should have found pages with internal links to test", () => {
      expect(pagesWithLinks.length).toBeGreaterThan(0);
    });

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, pagesWithLinks.length - 1) })],
      { numRuns: Math.min(100, pagesWithLinks.length) },
    )(
      "no internal link should use generic anchor text",
      (index) => {
        const page = pagesWithLinks[index];
        for (const link of page.internalLinks) {
          const lowerText = link.text.toLowerCase().trim();
          const isGeneric = GENERIC_ANCHORS.some((g) => lowerText === g);
          expect(
            isGeneric,
            `${page.relPath} line ${link.line}: generic anchor text "${link.text}" for link to ${link.href}`,
          ).toBe(false);
        }
      },
    );
  });
});
