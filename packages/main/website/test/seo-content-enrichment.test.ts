/**
 * Property-based tests for enriched content quality.
 *
 * **Property 8: Code block context**
 * **Validates: Requirements 3.5**
 *
 * For any code block in the documentation, there should be explanatory text
 * (at least 10 words) within 2 paragraphs before or after the code block.
 *
 * **Property 9: Natural keyword usage (no stuffing)**
 * **Validates: Requirements 3.7**
 *
 * For any page with target keywords, the content should use natural variations
 * rather than repeating the exact same phrase excessively (density <= 3%).
 */
import { test, fc } from "@fast-check/vitest";
import { describe, it, expect, afterAll } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join, extname } from "node:path";

// ---------------------------------------------------------------------------
// Custom matchers – messages are displayed as-is by Vitest (no red diff)
// ---------------------------------------------------------------------------

declare module "vitest" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T> {
    toHaveNoBareCodeBlocks(): T;
    toHaveNoKeywordStuffing(): T;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining {
    toHaveNoBareCodeBlocks(): unknown;
    toHaveNoKeywordStuffing(): unknown;
  }
}

interface SeoMatcherResult {
  pass: boolean;
  message: () => string;
  actual?: unknown;
  expected?: unknown;
}

// ANSI color helpers
const blue = (s: string) => `\x1b[34m${s}\x1b[0m`;
const blueBold = (s: string) => `\x1b[1;34m${s}\x1b[0m`;
const B = (c: string) => blue(c); // shorthand for box-drawing chars

/** Box inner width (between the two │) */
const BOX_W = 69;
const HR = "─".repeat(BOX_W);

/** Pad a line to BOX_W visible chars, accounting for wide emojis (2-col each). */
function boxLine(text: string, format?: (s: string) => string): string {
  // Measure visible terminal width:
  // - Most emojis are 2 columns wide
  // - Variation selectors (U+FE0F) and ZWJ (U+200D) are zero-width
  // - → (U+2192) is 1 column in most terminals
  let visibleWidth = 0;
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    // Zero-width: variation selectors, ZWJ, combining marks
    if (cp === 0xFE0F || cp === 0xFE0E || cp === 0x200D) continue;
    // Emoji ranges (simplified): typically 2 columns
    if (
      (cp >= 0x1F300 && cp <= 0x1F9FF) || // Misc Symbols, Emoticons, etc.
      cp === 0x270F ||                      // ✏
      cp === 0x2728 ||                      // ✨
      cp === 0x26A0                         // ⚠
    ) {
      visibleWidth += 2;
      continue;
    }
    visibleWidth += 1;
  }
  const padding = Math.max(0, BOX_W - visibleWidth);
  const content = format ? format(text) : text;
  return `${B("│")}${content}${" ".repeat(padding)}${B("│")}`;
}

expect.extend({
  toHaveNoBareCodeBlocks(
    page: PageContentAnalysis,
  ): SeoMatcherResult {
    const bareBlocks = page.codeBlockContexts.filter(
      (cb) => cb.textBeforeWordCount < 10 && cb.textAfterWordCount < 10,
    );
    const pass = bareBlocks.length === 0;
    if (!pass) {
      const lines = [
        `${B("┌")}${B(HR)}${B("┐")}`,
        boxLine(`  📄 ${page.file}`, (s) => s.replace(page.file, blueBold(page.file))),
        boxLine(`  Found ${bareBlocks.length} code block(s) without enough explanatory text nearby.`),
        boxLine(`  Each code block needs at least 10 words before or after it.`),
        `${B("├")}${B(HR)}${B("┤")}`,
        ...bareBlocks.flatMap((b) => [
          boxLine(`  ✏️  Line ${b.line} (${b.language || "no lang"}): ${b.textBeforeWordCount} words before, ${b.textAfterWordCount} words after`),
          boxLine(`  → Add a sentence above or below this code block.`),
        ]),
        `${B("└")}${B(HR)}${B("┘")}`,
      ];
      deferredMessages.push(lines.join("\n"));
    }
    return {
      pass,
      message: () => `${page.file}: ${bareBlocks.length} code block(s) without enough context`,
    };
  },

  toHaveNoKeywordStuffing(
    analysis: KeywordAnalysis,
  ): SeoMatcherResult {
    const { totalWords, keywordCounts, file } = analysis;

    if (totalWords < 50) return { pass: true, message: () => "" };

    const stuffed: string[] = [];
    for (const [keyword, count] of Object.entries(keywordCounts)) {
      const kwWords = keyword.split(/\s+/).filter((w) => w.length > 0).length;
      const density = (count * kwWords) / totalWords;
      if (density > 0.03) {
        stuffed.push(
          `"${keyword}" appears ${count} times (${(density * 100).toFixed(1)}% density)`,
        );
      }
    }

    const pass = stuffed.length === 0;
    if (!pass) {
      const lines = [
        `${B("┌")}${B(HR)}${B("┐")}`,
        boxLine(`  📄 ${file}`, (s) => s.replace(file, blueBold(file))),
        boxLine(`  Keyword stuffing detected (> 3% density).`),
        boxLine(`  Rephrase or use synonyms to reduce repetition.`),
        `${B("├")}${B(HR)}${B("┤")}`,
        ...stuffed.map((s) => boxLine(`  ⚠️  ${s}`)),
        boxLine(``),
        boxLine(`  Total words: ${totalWords}`),
        boxLine(`  Aim for < 3% density per keyword.`),
        `${B("└")}${B(HR)}${B("┘")}`,
      ];
      deferredMessages.push(lines.join("\n"));
    }
    return {
      pass,
      message: () => `${file}: keyword stuffing detected in ${stuffed.length} keyword(s)`,
    };
  },
});

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

// --- Types ---

interface CodeBlockContext {
  line: number;
  language: string;
  textBeforeWordCount: number;
  textAfterWordCount: number;
}

interface KeywordAnalysis {
  file: string;
  totalWords: number;
  keywords: string[];
  keywordCounts: Record<string, number>;
}

interface PageContentAnalysis {
  file: string;
  codeBlockContexts: CodeBlockContext[];
  keywordAnalysis: KeywordAnalysis;
}

/** Count words in a text string, ignoring empty strings */
function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => w.length > 0).length;
}

/**
 * Extract nearby text around a code block position.
 * Looks at lines before/after the code block, including list items and headings
 * as contextual text (since they often introduce or explain code).
 */
function getContextWordCount(lines: string[], startIdx: number, direction: "before" | "after"): number {
  const textParts: string[] = [];
  const step = direction === "before" ? -1 : 1;
  const start = direction === "before" ? startIdx - 1 : startIdx + 1;
  const limit = direction === "before" ? Math.max(0, startIdx - 15) : Math.min(lines.length - 1, startIdx + 15);

  let blankCount = 0;
  for (let j = start; direction === "before" ? j >= limit : j <= limit; j += step) {
    const trimmed = lines[j].trim();

    // Stop at another code block
    if (trimmed.startsWith("```")) break;
    // Stop at frontmatter delimiter
    if (trimmed === "---") break;
    // Stop at import statements
    if (trimmed.startsWith("import ")) break;

    // Skip blank lines but stop after 2 consecutive blanks
    if (trimmed === "") {
      blankCount++;
      if (blankCount >= 2) break;
      continue;
    }
    blankCount = 0;

    // Skip Docusaurus components, admonitions, and common HTML wrappers
    if (/^:::/.test(trimmed)) continue;
    // Extract text content from JSX/HTML tags instead of skipping entirely
    if (/^<\/?[A-Za-z]/.test(trimmed)) {
      // Extract text content from tags like <Accordion title="...">, <Code>text</Code>, etc.
      const titleMatch = trimmed.match(/title="([^"]+)"/);
      const textContent = trimmed.replace(/<[^>]+>/g, "").trim();
      const extracted = [titleMatch?.[1], textContent].filter(Boolean).join(" ").trim();
      if (extracted.length > 0) {
        textParts.push(extracted);
      }
      continue;
    }

    // Include headings, list items, and regular text as context
    // Strip markdown formatting for word counting
    const cleaned = trimmed
      .replace(/^#{1,6}\s+/, "") // Remove heading markers
      .replace(/^\s*[-*]\s+/, "") // Remove list markers
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Remove bold
      .replace(/\*([^*]+)\*/g, "$1") // Remove italic
      .replace(/`([^`]+)`/g, "$1") // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links, keep text
      .replace(/^<[^>]+>.*$/, "") // Remove JSX/HTML tags
      .trim();

    if (cleaned.length > 0) {
      textParts.push(cleaned);
    }
  }

  return countWords(textParts.join(" "));
}

/** Analyze a markdown file for code block context and keyword usage */
function analyzeContent(filePath: string): PageContentAnalysis {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const relFile = filePath.replace(WEBSITE_ROOT + "/", "");

  let inCodeBlock = false;
  let frontmatterCount = 0;
  let inFrontmatter = false;
  let inKeywordsBlock = false;
  const keywords: string[] = [];
  const codeBlockContexts: CodeBlockContext[] = [];

  // First pass: extract frontmatter keywords and find code blocks
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track frontmatter
    if (trimmed === "---") {
      frontmatterCount++;
      if (frontmatterCount === 1) inFrontmatter = true;
      if (frontmatterCount === 2) {
        inFrontmatter = false;
        inKeywordsBlock = false;
      }
      continue;
    }

    if (inFrontmatter) {
      // Detect start of keywords block
      if (/^keywords\s*:/.test(trimmed)) {
        inKeywordsBlock = true;
        // Check for inline value (keywords: [a, b, c])
        const inlineMatch = trimmed.match(/^keywords\s*:\s*\[(.+)\]/);
        if (inlineMatch) {
          const kws = inlineMatch[1].split(",").map((k) => k.trim().replace(/^["']|["']$/g, ""));
          keywords.push(...kws.map((k) => k.toLowerCase()).filter((k) => k.length > 0));
          inKeywordsBlock = false;
        }
        continue;
      }
      // Collect keyword list items
      if (inKeywordsBlock) {
        const kwMatch = trimmed.match(/^-\s+(.+)/);
        if (kwMatch) {
          const kw = kwMatch[1].replace(/^["']|["']$/g, "").trim();
          if (kw) keywords.push(kw.toLowerCase());
        } else if (!trimmed.startsWith("-") && trimmed.length > 0) {
          // End of keywords block (next frontmatter key)
          inKeywordsBlock = false;
        }
      }
      continue;
    }

    // Track code blocks
    if (!inCodeBlock && trimmed.startsWith("```")) {
      inCodeBlock = true;
      const lang = trimmed.slice(3).trim();

      codeBlockContexts.push({
        line: i + 1,
        language: lang,
        textBeforeWordCount: getContextWordCount(lines, i, "before"),
        textAfterWordCount: 0, // Filled when we find closing ```
      });
      continue;
    }
    if (inCodeBlock && trimmed === "```") {
      inCodeBlock = false;
      if (codeBlockContexts.length > 0) {
        codeBlockContexts[codeBlockContexts.length - 1].textAfterWordCount =
          getContextWordCount(lines, i, "after");
      }
      continue;
    }
  }

  // Post-process: for code blocks inside <Tabs>/<TabItem> or <Accordion>, share the best context
  // across all blocks in the same group (they're alternative representations or grouped content)
  let tabsDepth = 0;
  let tabGroupStart = -1;
  const componentGroups: { start: number; end: number }[] = [];
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (/<Tabs[\s>]/.test(trimmed) || trimmed === "<Tabs>") {
      if (tabsDepth === 0) tabGroupStart = i;
      tabsDepth++;
    }
    if (/<\/Tabs>/.test(trimmed)) {
      tabsDepth--;
      if (tabsDepth === 0 && tabGroupStart >= 0) {
        componentGroups.push({ start: tabGroupStart, end: i });
        tabGroupStart = -1;
      }
    }
  }
  // For code blocks inside component groups, recalculate context from outside the group
  for (const group of componentGroups) {
    const blocksInGroup = codeBlockContexts.filter(
      (cb) => cb.line - 1 >= group.start && cb.line - 1 <= group.end,
    );
    if (blocksInGroup.length > 0) {
      // Calculate context from before/after the entire group
      const contextBefore = getContextWordCount(lines, group.start, "before");
      const contextAfter = getContextWordCount(lines, group.end, "after");
      const maxBefore = Math.max(contextBefore, ...blocksInGroup.map((b) => b.textBeforeWordCount));
      const maxAfter = Math.max(contextAfter, ...blocksInGroup.map((b) => b.textAfterWordCount));
      for (const b of blocksInGroup) {
        b.textBeforeWordCount = maxBefore;
        b.textAfterWordCount = maxAfter;
      }
    }
  }
  // Also handle Accordion components — code blocks inside get context from the section
  // heading and intro text that appears before the Accordion group
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (/<Accordion[\s>]/.test(trimmed)) {
      const accStart = i;
      for (let j = i + 1; j < lines.length; j++) {
        if (/<\/Accordion>/.test(lines[j].trim())) {
          const blocksInAcc = codeBlockContexts.filter(
            (cb) => cb.line - 1 > accStart && cb.line - 1 < j,
          );
          if (blocksInAcc.length > 0) {
            // Look back past other Accordion closings and code blocks to find the real section context
            let contextStart = accStart;
            let inNestedCode = false;
            for (let k = accStart - 1; k >= 0; k--) {
              const t = lines[k].trim();
              if (t === "" || /<\/Accordion>/.test(t) || /<Accordion[\s>]/.test(t)) continue;
              // Skip code block content and markers
              if (t === "```" || t.startsWith("```")) {
                inNestedCode = !inNestedCode;
                continue;
              }
              if (inNestedCode) continue;
              // Skip Code component lines
              if (/^<Code>/.test(t) || /<\/Code>/.test(t)) continue;
              contextStart = k + 1;
              break;
            }
            const contextBefore = getContextWordCount(lines, contextStart, "before");
            for (const b of blocksInAcc) {
              b.textBeforeWordCount = Math.max(b.textBeforeWordCount, contextBefore);
            }
          }
          break;
        }
      }
    }
  }

  // Build text content for keyword analysis (excluding code blocks, frontmatter, imports, JSX)
  inCodeBlock = false;
  frontmatterCount = 0;
  inFrontmatter = false;
  const contentParts: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (trimmed === "---") {
      frontmatterCount++;
      if (frontmatterCount === 1) inFrontmatter = true;
      if (frontmatterCount === 2) inFrontmatter = false;
      continue;
    }
    if (inFrontmatter) continue;

    if (!inCodeBlock && trimmed.startsWith("```")) {
      inCodeBlock = true;
      continue;
    }
    if (inCodeBlock && trimmed === "```") {
      inCodeBlock = false;
      continue;
    }
    if (inCodeBlock) continue;

    // Skip imports, JSX, admonitions, table separators
    if (trimmed.startsWith("import ")) continue;
    if (trimmed.startsWith("<") && !trimmed.startsWith("<details") && !trimmed.startsWith("<summary")) continue;
    if (trimmed === ":::") continue;
    if (/^:::/.test(trimmed)) continue;
    if (trimmed === "") continue;

    // Clean markdown formatting
    const cleaned = trimmed
      .replace(/^#{1,6}\s+/, "")
      .replace(/^\s*[-*]\s+/, "")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .trim();

    if (cleaned.length > 0) {
      contentParts.push(cleaned);
    }
  }

  const fullText = contentParts.join(" ").toLowerCase();
  const totalWords = countWords(fullText);

  // Count keyword occurrences
  const keywordCounts: Record<string, number> = {};
  for (const kw of keywords) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    const matches = fullText.match(regex);
    keywordCounts[kw] = matches ? matches.length : 0;
  }

  return {
    file: relFile,
    codeBlockContexts,
    keywordAnalysis: {
      file: relFile,
      totalWords,
      keywords,
      keywordCounts,
    },
  };
}

// --- Collect all page analyses ---

const markdownFiles = [
  ...collectFiles(DOCS_DIR, [".md", ".mdx"]),
  ...collectFiles(COMPARISONS_DIR, [".md", ".mdx"]),
];

const pages: PageContentAnalysis[] = markdownFiles.map(analyzeContent);

// Filter to pages that actually have code blocks (for Property 8)
// Exclude internal contribution docs (design principles, architecture) — they are developer-facing
// internal guides, not SEO-relevant user documentation (Requirement 3.5 targets user-facing content)
const pagesWithCode = pages.filter(
  (p) => p.codeBlockContexts.length > 0 && !p.file.includes("contribution/"),
);

// Filter to pages that have keywords defined (for Property 9)
const pagesWithKeywords = pages.filter((p) => p.keywordAnalysis.keywords.length > 0);

// --- Tests ---

/** Deferred diagnostic messages, printed after all tests complete. */
const deferredMessages: string[] = [];

describe("SEO Content Enrichment Properties", () => {
  afterAll(() => {
    if (deferredMessages.length > 0) {
      console.log("\n" + deferredMessages.join("\n\n"));
    }
  });

  /**
   * Property 8: Code block context
   * **Validates: Requirements 3.5**
   */
  describe("Property 8: Code block context", () => {
    it("should have found pages with code blocks to test", () => {
      expect(pagesWithCode.length).toBeGreaterThan(0);
    });

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, pagesWithCode.length - 1) })],
      { numRuns: Math.min(200, pagesWithCode.length) },
    )(
      "every code block should have explanatory text nearby (at least 10 words before or after)",
      (index) => {
        const page = pagesWithCode[index];
        expect(page).toHaveNoBareCodeBlocks();
      },
    );
  });

  /**
   * Property 9: Natural keyword usage (no stuffing)
   * **Validates: Requirements 3.7**
   */
  describe("Property 9: Natural keyword usage (no stuffing)", () => {
    it("should have found pages with keywords to test", () => {
      expect(pagesWithKeywords.length).toBeGreaterThan(0);
    });

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, pagesWithKeywords.length - 1) })],
      { numRuns: Math.min(200, pagesWithKeywords.length) },
    )(
      "no keyword should exceed 3% density (keyword stuffing threshold)",
      (index) => {
        const page = pagesWithKeywords[index];
        expect(page.keywordAnalysis).toHaveNoKeywordStuffing();
      },
    );
  });
});
