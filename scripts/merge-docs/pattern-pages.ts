// scripts/merge-docs/pattern-pages.ts
// Copy pattern pages (index files for eidos patterns) to generated output

import * as fs from "node:fs";
import * as path from "node:path";
import { PATTERN_PAGES, PATTERN_PAGES_I18N, OUTPUT, WEBSITE_I18N } from "../common/constants.js";

/**
 * Top picks - most commonly used patterns in real-world applications.
 */
const EIDOS_TOP_PICKS = new Set([
  "strategy",
  "observer",
  "builder",
  "decorator",
  "chain",
  "state",
  "command",
]);

/**
 * Hidden gems - underrated patterns worth discovering.
 */
const EIDOS_HIDDEN_GEMS = new Set([
  "composite",
  "memento",
  "mediator",
  "iterator",
  "abstract-factory",
  "template",
  "adapter",
]);

/**
 * Add badge frontmatter properties for DocItem/Content to render badges.
 */
function addBadgeFrontmatter(content: string, patternName: string): string {
  const isTopPick = EIDOS_TOP_PICKS.has(patternName);
  const isHiddenGem = EIDOS_HIDDEN_GEMS.has(patternName);
  
  if (!isTopPick && !isHiddenGem) return content;
  
  // Find the end of frontmatter (second ---)
  const frontmatterEnd = content.indexOf("---", 4);
  if (frontmatterEnd === -1) return content;
  
  // Add both root-level props (for badge rendering) and sidebar_custom_props (for sidebar filter)
  const badgeProps = `important: ${isTopPick}
hiddenGem: ${isHiddenGem}
sidebar_custom_props:
  important: ${isTopPick}
  hiddenGem: ${isHiddenGem}
`;
  
  // Insert before the closing ---
  return content.slice(0, frontmatterEnd) + badgeProps + content.slice(frontmatterEnd);
}

/**
 * Add PatternNav component import and usage to pattern pages.
 */
function addPatternNav(content: string, moduleName: string): string {
  // Find the end of frontmatter
  const frontmatterEnd = content.indexOf("---", 4);
  if (frontmatterEnd === -1) return content;
  
  // Find where imports end (after frontmatter closing ---)
  const afterFrontmatter = content.slice(frontmatterEnd + 3);
  
  // Check if PatternNav is already imported
  if (content.includes("PatternNav")) return content;
  
  // Find the first heading (# Title)
  const headingMatch = afterFrontmatter.match(/\n(# .+)/);
  if (!headingMatch) return content;
  
  const headingIndex = frontmatterEnd + 3 + afterFrontmatter.indexOf(headingMatch[1]);
  
  // Insert PatternNav import and component
  const patternNavImport = `\nimport { PatternNav } from '@site/src/components/shared/PatternNav';\n`;
  const patternNavComponent = `\n<PatternNav module="${moduleName}" />\n\n`;
  
  // Check if there are existing imports
  const importSection = content.slice(frontmatterEnd + 3, headingIndex);
  const hasImports = importSection.includes("import ");
  
  if (hasImports) {
    // Add import after existing imports
    const lastImportEnd = content.lastIndexOf("import ", headingIndex);
    const lineEnd = content.indexOf("\n", lastImportEnd);
    const insertPos = content.indexOf("\n", lineEnd) + 1;
    
    // Find where to insert the component (just before the heading)
    return (
      content.slice(0, lineEnd + 1) +
      patternNavImport.trim() + "\n" +
      content.slice(lineEnd + 1, headingIndex) +
      patternNavComponent +
      content.slice(headingIndex)
    );
  } else {
    // No imports, add after frontmatter
    return (
      content.slice(0, frontmatterEnd + 3) +
      patternNavImport +
      content.slice(frontmatterEnd + 3, headingIndex) +
      patternNavComponent +
      content.slice(headingIndex)
    );
  }
}

/**
 * Copy pattern pages to the generated output directory.
 * These are custom index pages for eidos design patterns that appear
 * when clicking on a pattern name in the sidebar.
 * 
 * Source: documentation/pattern-pages/eidos/strategy.mdx
 * Output: _generated/final/eidos/strategy/index.mdx
 */
export function copyPatternPages(): void {
  if (!fs.existsSync(PATTERN_PAGES)) {
    console.log("  No pattern-pages directory found, skipping...");
    return;
  }

  let copiedCount = 0;

  // Copy default (English) pattern pages
  copiedCount += copyPagesFromDir(PATTERN_PAGES, OUTPUT, "en");

  // Copy i18n pattern pages
  if (fs.existsSync(PATTERN_PAGES_I18N)) {
    const locales = fs.readdirSync(PATTERN_PAGES_I18N).filter((f) =>
      fs.statSync(path.join(PATTERN_PAGES_I18N, f)).isDirectory()
    );

    for (const locale of locales) {
      const localeSource = path.join(PATTERN_PAGES_I18N, locale);
      const localeOutput = path.join(
        WEBSITE_I18N,
        locale,
        "docusaurus-plugin-content-docs-api",
        "current"
      );
      copiedCount += copyPagesFromDir(localeSource, localeOutput, locale);
    }
  }

  if (copiedCount > 0) {
    console.log(`  📄 Copied ${copiedCount} pattern page(s)`);
  }
}

/**
 * Recursively copy pattern pages from source to output.
 * Converts filename.mdx → filename/index.mdx
 * Adds badge emoji to titles for top picks and hidden gems.
 */
function copyPagesFromDir(sourceDir: string, outputBase: string, locale: string): number {
  let count = 0;

  function processDir(dir: string, relativePath: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        processDir(sourcePath, path.join(relativePath, entry.name));
      } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
        // Convert strategy.md → strategy/index.md (keep original extension)
        const baseName = entry.name.replace(/\.(mdx|md)$/, "");
        const ext = "md"; // Always output as .md for consistency
        const outputDir = path.join(outputBase, relativePath, baseName);
        const outputPath = path.join(outputDir, `index.${ext}`);

        // Ensure output directory exists
        fs.mkdirSync(outputDir, { recursive: true });

        // Read and transform content
        let content = fs.readFileSync(sourcePath, "utf-8");
        
        // Add frontmatter for badges (DocItem/Content will render them)
        content = addBadgeFrontmatter(content, baseName);
        
        // Add PatternNav component for navigation back to index
        const moduleName = relativePath.split(path.sep)[0] || "eidos";
        content = addPatternNav(content, moduleName);

        // Write transformed file
        fs.writeFileSync(outputPath, content);
        count++;
        console.log(`    [${locale}] ${relativePath}/${baseName} → index.${ext}`);
      }
    }
  }

  processDir(sourceDir, "");
  return count;
}
