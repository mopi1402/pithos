// scripts/merge-docs/section-generators.ts
// Markdown section generation functions

import type { FunctionUseCases } from "./types.js";

/**
 * Generate "Also known as" section.
 */
export function generateAlsoKnownAsSection(aliasData: any): string {
    if (!aliasData) return "";

    // Convert alias data to JSON string for the React component
    // The React component will handle displaying ❌ if all are null
    const jsonData = JSON.stringify(aliasData);

    return `\n## Also known as\n\n<AlsoKnownAs data={${jsonData}} />\n\n`;
}

/**
 * Enrich throws section with error types.
 */
export function enrichThrowsSectionWithTypes(
    throwsSection: string,
    errorTypes: string[]
): string {
    // Parse the throws section to extract the description
    // Format: \n## Throws\n\ndescription\n (description can be multi-line)
    const match = throwsSection.match(/##+\s+Throws\n\n([\s\S]*?)(?=\n##+\s|\n###+\s|$)/);
    if (!match) return throwsSection;

    const description = match[1].trim();

    // Format error types with backticks
    const formattedTypes = errorTypes.map((type) => `\`${type}\``).join(", ");

    // Reconstruct with types: ## Throws\n\n{ErrorType} description
    return `\n## Throws\n\n${formattedTypes} ${description}\n`;
}

/**
 * Generate hidden gem description section.
 */
export function generateHiddenGemSection(useCases: FunctionUseCases): string {
    if (!useCases.hiddenGemDescription) return "";

    return `\n<details>\n<summary>💎 Why is this a Hidden Gem?</summary>\n\n${useCases.hiddenGemDescription}\n\n</details>\n\n`;
}

/**
 * Transform mermaid flowchart LR blocks into ResponsiveMermaid components.
 * Desktop shows LR (horizontal), mobile shows TB (vertical).
 * If a comment `<!-- keep-horizontal -->` appears before the diagram, it will remain LR on mobile too.
 */
export function transformMermaidToResponsive(content: string): string {
    // Match mermaid blocks, optionally preceded by a keep-horizontal comment
    // The comment can be on the same line or on a separate line before the mermaid block
    // Pattern: (optional newline)(optional comment with optional newline after)(optional whitespace)```mermaid
    const mermaidBlockRegex = /(\n?)(<!--\s*keep-horizontal\s*-->\s*\n?)?\s*```mermaid\n((?:flowchart|graph)\s+LR[\s\S]*?)```(\n?)/g;

    return content.replace(mermaidBlockRegex, (match, beforeNewline, keepHorizontalCommentWithNewline, diagram, afterNewline) => {
        const keepHorizontal = !!keepHorizontalCommentWithNewline;
        const desktopDiagram = diagram.trim();
        const mobileDiagram = keepHorizontal
            ? desktopDiagram
            : desktopDiagram.replace(/((?:flowchart|graph)\s+)LR/gi, "$1TB");

        // Escape backticks and dollar signs in the diagram content for JSX template strings
        const escapedDesktop = desktopDiagram.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
        const escapedMobile = mobileDiagram.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");

        const keepHorizontalProp = keepHorizontal ? "\n  keepHorizontal={true}" : "";

        // Always add a newline before the component to avoid it being glued to previous text
        const newlineBefore = beforeNewline || "\n";
        // Preserve newline after if present
        const newlineAfter = afterNewline || "";

        return `${newlineBefore}<ResponsiveMermaid
  desktop={\`${escapedDesktop}\`}
  mobile={\`${escapedMobile}\`}${keepHorizontalProp}
/>${newlineAfter}`;
    });
}

/**
 * Generate use cases section.
 */
export function generateUseCasesSection(useCases: FunctionUseCases): string {
    if (!useCases.useCases.length) return "";

    const isNewFormat = useCases.format === "new";

    let md = "\n## Use Cases\n\n";

    for (const uc of useCases.useCases) {
        const marker = uc.isPrimary ? " 📌" : "";
        md += `### ${uc.title}${marker}\n\n`;

        // Description
        if (uc.description) {
            md += `${uc.description}\n\n`;
        }

         // Keywords
        if (uc.keywords && uc.keywords.length > 0) {
            md += `<div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px', marginBottom: '16px'}}>\n`;
            for (const kw of uc.keywords) {
                // Encode URI component for the keyword
                const encodedKw = encodeURIComponent(kw);
                md += `  <a href="/use-cases?q=${encodedKw}" style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--ifm-color-emphasis-100)',
                    color: 'var(--ifm-color-content)',
                    textDecoration: 'none',
                    fontSize: '0.85em',
                    border: '1px solid var(--ifm-color-emphasis-200)'
                }}>#${kw}</a>\n`;
            }
             md += `</div>\n\n`;
        }

        // Code example (new format only)
        if (isNewFormat && uc.codeExample) {
            md += "```typescript\n";
            md += uc.codeExample;
            md += "\n```\n\n";
        }
    }

    return md;
}
