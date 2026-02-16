/**
 * Core SEO validation logic, shared between the Docusaurus plugin and the standalone CLI script.
 */
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SeoValidatorOptions {
  /** Directories (relative to siteDir) containing markdown content */
  contentDirs: string[];
  /** Minimum description length (chars) */
  minDescriptionLength: number;
  /** Maximum description length (chars) */
  maxDescriptionLength: number;
  /** Minimum internal links per page */
  minInternalLinks: number;
  /** Maximum internal links per page */
  maxInternalLinks: number;
  /**
   * Maximum allowed repetitions of any single word (as a fraction of total
   * words) before it's flagged as keyword stuffing. Default 0.03 (3 %).
   */
  keywordStuffingThreshold: number;
  /** Fail the build when critical errors are found */
  failOnError: boolean;
  /** File patterns to exclude from validation (glob-style basenames) */
  excludePatterns: string[];
  /** Maximum number of frontmatter keywords allowed */
  maxKeywords: number;
  /** Words to ignore when detecting keyword stuffing (e.g. project/module names) */
  keywordStuffingIgnore: string[];
}

export interface ValidationIssue {
  file: string;
  severity: "error" | "warning";
  message: string;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

export const DEFAULT_OPTIONS: SeoValidatorOptions = {
  contentDirs: ["docs", "comparisons"],
  minDescriptionLength: 50,
  maxDescriptionLength: 200,
  minInternalLinks: 2,
  maxInternalLinks: 30,
  keywordStuffingThreshold: 0.03,
  maxKeywords: 10,
  failOnError: true,
  excludePatterns: ["_category_.json", "index.md", "changelog.md"],
  keywordStuffingIgnore: [],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Recursively collect all .md / .mdx files under `dir`. */
export function collectMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMarkdownFiles(full));
    } else if (/\.mdx?$/.test(entry.name)) {
      results.push(full);
    }
  }
  return results;
}

/** Very small frontmatter parser – extracts YAML between leading `---`. */
function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const yaml = match[1]!;
  const result: Record<string, unknown> = {};

  let currentKey = "";
  let currentList: string[] | null = null;

  for (const line of yaml.split("\n")) {
    // List item continuation
    const listItem = line.match(/^\s+-\s+(.+)/);
    if (listItem && currentList) {
      currentList.push(listItem[1]!.replace(/^["']|["']$/g, ""));
      continue;
    }

    // Flush previous list
    if (currentList) {
      result[currentKey] = currentList;
      currentList = null;
    }

    // Key: value
    const kv = line.match(/^(\w[\w_-]*):\s*(.*)/);
    if (kv) {
      currentKey = kv[1]!;
      const value = kv[2]!.trim();
      if (value === "" || value === "|" || value === ">") {
        currentList = [];
      } else {
        result[currentKey] = value.replace(/^["']|["']$/g, "");
      }
    }
  }
  if (currentList) {
    result[currentKey] = currentList;
  }
  return result;
}

/** Strip frontmatter and MDX/JSX blocks to get the markdown body. */
function getMarkdownBody(content: string): string {
  let body = content.replace(/^---[\s\S]*?---/, "");
  body = body.replace(/<head>[\s\S]*?<\/head>/gi, "");
  body = body.replace(/^import\s+.*$/gm, "");
  // Remove self-closing JSX tags: <Component prop="value" />
  body = body.replace(/<[A-Z]\w+[^>]*\/>/g, "");
  // Remove JSX/HTML opening and closing tags but keep their text content
  // e.g. <Accordion title="...">text</Accordion> → text
  body = body.replace(/<\/?[A-Za-z][\w.-]*[^>]*>/g, " ");
  // Remove Mermaid diagram content (inline or in code blocks tagged mermaid)
  body = body.replace(/```mermaid[\s\S]*?```/g, "");
  // Remove inline Mermaid value props (Mermaid component with value={`...`})
  body = body.replace(/value=\{`[\s\S]*?`\}/g, "");
  // Remove JSX inline expressions: {(() => { ... })()}
  body = body.replace(/\{(?:\(\)\s*=>|function)\s*\{[\s\S]*?\}\s*\)?\(\)\}/g, "");
  // Remove CSS/style properties that leak through (e.g. stroke-width, font-family)
  body = body.replace(/style=\{\{[^}]*\}\}/g, "");
  return body;
}

/** Extract the first H1 heading text from the markdown body. */
function extractH1Words(body: string): string[] {
  const stripped = body.replace(/```[\s\S]*?```/g, "");
  const match = stripped.match(/^#\s+(.+)$/m);
  if (!match) return [];
  // Strip markdown/emoji formatting from the heading
  const raw = match[1]!
    .replace(/[^\w\s-]/g, " ")  // remove emoji and special chars
    .toLowerCase();
  return raw.split(/\s+/).filter((w) => w.length >= 4);
}

/** Extract words from H2 headings — these define the page's subtopics. */
function extractH2Words(body: string): string[] {
  const stripped = body.replace(/```[\s\S]*?```/g, "");
  const words: string[] = [];
  for (const line of stripped.split("\n")) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      const raw = match[1]!
        .replace(/[^\w\s-]/g, " ")
        .toLowerCase();
      words.push(...raw.split(/\s+/).filter((w) => w.length >= 4));
    }
  }
  return words;
}

/** Extract words from frontmatter description — defines the page's SEO topic. */
function extractDescriptionWords(description: string): string[] {
  return description
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4);
}

/** Extract JSX/HTML tag names used in the body (e.g. Accordion, Highlight, span). */
function extractJsxTagNames(body: string): string[] {
  const tagPattern = /<\/?([A-Za-z][\w.-]*)/g;
  const names = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = tagPattern.exec(body)) !== null) {
    names.add(m[1]!.toLowerCase());
  }
  return [...names];
}

/** Extract heading levels from markdown body. */
function extractHeadingLevels(body: string): number[] {
  const stripped = body.replace(/```[\s\S]*?```/g, "");
  const levels: number[] = [];
  for (const line of stripped.split("\n")) {
    const match = line.match(/^(#{1,6})\s+/);
    if (match) {
      levels.push(match[1]!.length);
    }
  }
  return levels;
}

/** Count markdown internal links (relative links starting with / or ./) */
function countInternalLinks(body: string): number {
  const linkPattern = /\[([^\]]+)\]\((?!https?:\/\/)(?!#)([^)]+)\)/g;
  let count = 0;
  while (linkPattern.exec(body) !== null) {
    count++;
  }
  return count;
}

/**
 * Detect keyword stuffing: any single word appearing more than
 * `threshold` fraction of total words.
 *
 * `ignoreWords` are skipped entirely (global config + per-page frontmatter).
 * `autoIgnoreWords` are words extracted from the page's H1 and JSX tag names,
 * automatically excluded because they are the page's primary subject or markup.
 */
function detectKeywordStuffing(
  body: string,
  threshold: number,
  ignoreWords: string[] = [],
  autoIgnoreWords: string[] = [],
): string | null {
  const cleaned = body
    .replace(/```[\s\S]*?```/g, "")     // remove code blocks
    .replace(/`[^`]+`/g, "")            // remove inline code
    .replace(/https?:\/\/[^\s)]+/g, "") // remove URLs
    .replace(/&\w+;/g, " ")             // remove HTML entities
    .replace(/\{[^}]*\}/g, " ");        // remove JSX expressions like {(() => { ... })()}
  const words = cleaned
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4)
    // Exclude hex color codes, pure numbers, table separators, and hyphen-prefixed/suffixed tokens
    .filter((w) => !/^[0-9a-f]{6,}$/.test(w) && !/^\d+$/.test(w) && !/^-{2,}$/.test(w) && !/^-|-$/.test(w));

  if (words.length < 50) return null;

  const STOP_WORDS = new Set([
    // English stop words
    "this", "that", "with", "from", "your", "have", "will", "been",
    "more", "when", "also", "each", "than", "them", "into", "only",
    "over", "such", "after", "other", "which", "their", "about",
    "would", "make", "like", "just", "should", "could", "every",
    "does", "most", "some", "what", "there", "these", "those",
    "then", "they", "here", "were", "very", "well", "much",
    // French stop words (for bilingual docs)
    "avec", "dans", "pour", "plus", "cette", "sont", "mais",
    "tout", "tous", "elle", "elles", "nous", "vous", "leur",
    "leurs", "entre", "comme", "sans", "encore", "aussi",
    // HTML/markup artifacts that leak through stripping
    "nbsp", "https", "http", "quot", "amp",
    // CSS/SVG properties that leak from Mermaid diagrams and inline styles
    "stroke", "style", "color", "width", "fill", "font",
    "classdef", "linkstyle",
    // Explicit ignore lists
    ...ignoreWords.map((w) => w.toLowerCase()),
    ...autoIgnoreWords.map((w) => w.toLowerCase()),
  ]);

  const freq = new Map<string, number>();
  for (const w of words) {
    if (STOP_WORDS.has(w)) continue;
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }

  for (const [word, count] of freq) {
    if (count / words.length > threshold) {
      return `"${word}" appears ${count}/${words.length} times (${((count / words.length) * 100).toFixed(1)}%)`;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Validation logic
// ---------------------------------------------------------------------------

export function validateFile(
  filePath: string,
  relativePath: string,
  opts: SeoValidatorOptions,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const content = fs.readFileSync(filePath, "utf-8");
  const fm = parseFrontmatter(content);
  const body = getMarkdownBody(content);

  // --- Frontmatter: title ---
  if (!fm.title || String(fm.title).trim().length === 0) {
    issues.push({ file: relativePath, severity: "error", message: "Missing frontmatter `title`" });
  }

  // --- Frontmatter: description ---
  const desc = fm.description ? String(fm.description).trim() : "";
  if (desc.length === 0) {
    issues.push({ file: relativePath, severity: "error", message: "Missing frontmatter `description`" });
  } else if (desc.length < opts.minDescriptionLength) {
    issues.push({ file: relativePath, severity: "warning", message: `Description too short (${desc.length} chars, min ${opts.minDescriptionLength})` });
  } else if (desc.length > opts.maxDescriptionLength) {
    issues.push({ file: relativePath, severity: "warning", message: `Description too long (${desc.length} chars, max ${opts.maxDescriptionLength})` });
  }

  // --- Frontmatter: keywords ---
  const kw = fm.keywords;
  if (kw) {
    let kwCount = 0;
    if (Array.isArray(kw)) {
      kwCount = kw.length;
    } else if (typeof kw === "string") {
      kwCount = kw.split(",").filter((k) => k.trim().length > 0).length;
    }
    if (kwCount > opts.maxKeywords) {
      issues.push({ file: relativePath, severity: "error", message: `Too many \`keywords\` (${kwCount}). Maximum allowed is ${opts.maxKeywords}.` });
    }
  }

  // --- Heading hierarchy ---
  const headings = extractHeadingLevels(body);
  const h1Count = headings.filter((h) => h === 1).length;
  if (h1Count > 1) {
    issues.push({ file: relativePath, severity: "error", message: `Multiple H1 headings found (${h1Count}). Only one H1 per page is allowed.` });
  }
  for (let i = 1; i < headings.length; i++) {
    const prev = headings[i - 1]!;
    const curr = headings[i]!;
    if (curr > prev + 1) {
      issues.push({ file: relativePath, severity: "error", message: `Heading level skipped: H${prev} → H${curr} (should not skip levels)` });
      break;
    }
  }

  // --- Internal links count ---
  const linkCount = countInternalLinks(body);
  if (linkCount < opts.minInternalLinks) {
    issues.push({ file: relativePath, severity: "warning", message: `Only ${linkCount} internal link(s) found (recommended: ${opts.minInternalLinks}–${opts.maxInternalLinks})` });
  } else if (linkCount > opts.maxInternalLinks) {
    issues.push({ file: relativePath, severity: "warning", message: `Too many internal links (${linkCount}, max ${opts.maxInternalLinks})` });
  }

  // --- Keyword stuffing ---
  // Auto-ignore: words from the page's H1 heading, H2 subheadings,
  // frontmatter title and description (they define the page's subject)
  // and JSX/HTML tag names (markup, not content)
  const h1Words = extractH1Words(body);
  const h2Words = extractH2Words(body);
  const jsxTags = extractJsxTagNames(body);
  const titleWords = fm.title
    ? String(fm.title).toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((w) => w.length >= 4)
    : [];
  const descWords = fm.description
    ? extractDescriptionWords(String(fm.description))
    : [];
  // Per-page frontmatter override: keyword_stuffing_ignore
  const perPageIgnore: string[] = [];
  const fmIgnore = fm["keyword_stuffing_ignore"];
  if (Array.isArray(fmIgnore)) {
    perPageIgnore.push(...fmIgnore.map(String));
  } else if (typeof fmIgnore === "string") {
    perPageIgnore.push(...fmIgnore.split(",").map((s) => s.trim()).filter(Boolean));
  }

  const stuffing = detectKeywordStuffing(
    body,
    opts.keywordStuffingThreshold,
    [...opts.keywordStuffingIgnore, ...perPageIgnore],
    [...h1Words, ...h2Words, ...jsxTags, ...titleWords, ...descWords],
  );
  if (stuffing) {
    issues.push({ file: relativePath, severity: "warning", message: `Possible keyword stuffing: ${stuffing}` });
  }

  return issues;
}

// ---------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------

export function runValidation(baseDir: string, opts: SeoValidatorOptions): ValidationIssue[] {
  const allIssues: ValidationIssue[] = [];

  for (const dir of opts.contentDirs) {
    const absDir = path.resolve(baseDir, dir);
    const files = collectMarkdownFiles(absDir);

    for (const file of files) {
      const basename = path.basename(file);
      if (opts.excludePatterns.some((p) => basename === p)) continue;

      const relativePath = path.relative(baseDir, file);
      allIssues.push(...validateFile(file, relativePath, opts));
    }
  }

  return allIssues;
}

export function reportIssues(
  issues: ValidationIssue[],
  filter: "all" | "errors" | "warnings" = "all",
): { errors: number; warnings: number } {
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  const displayed =
    filter === "errors" ? errors :
    filter === "warnings" ? warnings :
    issues;

  if (displayed.length > 0) {
    const label = filter === "all" ? "" : ` (${filter} only)`;
    console.log(`\n🔍 SEO Validator Results${label}\n`);
    for (const issue of displayed) {
      const icon = issue.severity === "error" ? "❌" : "⚠️";
      console.log(`  ${icon} [${issue.file}] ${issue.message}`);
    }
    console.log(`\n  Summary: ${errors.length} error(s), ${warnings.length} warning(s)\n`);
  } else {
    console.log("\n✅ SEO Validator: All checks passed!\n");
  }

  return { errors: errors.length, warnings: warnings.length };
}
