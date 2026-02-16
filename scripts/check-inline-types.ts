/**
 * Checks that all documentation files in _generated/final have fully inline types
 * in their Parameters and Returns sections.
 *
 * "Inline type" = wrapped in backticks or <code> tags, NOT a markdown link [Type](path.md).
 *
 * Reports files where parameter types or return types reference external .md files
 * instead of being self-contained inline types.
 *
 * @since 2.0.0
 */

import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";

const FINAL_DIR = join(
  process.cwd(),
  "packages/main/documentation/_generated/final"
);

// Matches markdown links to .md files: [TypeName](./path.md)
const MD_LINK_RE = /\[([^\]]+)\]\([^)]*\.md[^)]*\)/g;

interface Issue {
  file: string;
  section: string;
  line: number;
  content: string;
}

function collectMdFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results.push(...collectMdFiles(full));
    } else if (entry.endsWith(".md") && !entry.startsWith("_") && !entry.startsWith("index")) {
      results.push(full);
    }
  }
  return results;
}

function checkFile(filePath: string): Issue[] {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const issues: Issue[] = [];
  const relPath = relative(FINAL_DIR, filePath);

  let currentSection: string | null = null;
  // Track if we're in a relevant zone (Parameters, Returns, or sub-blocks of Returns)
  let inRelevantZone = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    const trimmed = line.trim();

    // Detect section headers
    if (trimmed.startsWith("## ")) {
      const sectionName = trimmed.slice(3).trim().replace(/:.*/, "");
      currentSection = sectionName;
      // Parameters and Returns are the zones we care about
      inRelevantZone =
        sectionName === "Parameters" ||
        sectionName.startsWith("Returns");
      continue;
    }

    // Also detect sub-headers within sections (### param: type)
    if (trimmed.startsWith("### ") || trimmed.startsWith("#### ")) {
      // Stay in the relevant zone if we're in Parameters or Returns
      continue;
    }

    // Reset zone on new top-level section
    if (trimmed.startsWith("## ")) {
      inRelevantZone = false;
      continue;
    }

    if (!inRelevantZone) continue;

    // Check for markdown links to .md files in this line
    // Links inside <TypeRef>...</TypeRef> are allowed (monospace + clickable)
    const lineWithoutTypeRef = line.replace(/<TypeRef>.*?<\/TypeRef>/g, "");
    const matches = [...lineWithoutTypeRef.matchAll(MD_LINK_RE)];
    if (matches.length > 0) {
      issues.push({
        file: relPath,
        section: currentSection ?? "unknown",
        line: i + 1,
        content: trimmed,
      });
    }
  }

  return issues;
}

function main(): void {
  const files = collectMdFiles(FINAL_DIR);
  const allIssues: Issue[] = [];

  for (const file of files) {
    allIssues.push(...checkFile(file));
  }

  if (allIssues.length === 0) {
    console.log("✅ All types are inline. No issues found.");
    return;
  }

  // Group by file
  const byFile = new Map<string, Issue[]>();
  for (const issue of allIssues) {
    const list = byFile.get(issue.file) ?? [];
    list.push(issue);
    byFile.set(issue.file, list);
  }

  console.log(
    `⚠️  Found ${allIssues.length} non-inline type reference(s) in ${byFile.size} file(s):\n`
  );

  for (const [file, issues] of byFile) {
    console.log(`📄 ${file}`);
    for (const issue of issues) {
      console.log(`   L${issue.line} [${issue.section}]`);
      console.log(`   ${issue.content}`);
    }
    console.log();
  }

  process.exit(1);
}

main();
