import {
    NAVIGATION_LINKS_REGEX,
    SEPARATOR_LINES_REGEX,
    PITHOS_LINKS_REGEX,
    DEFINED_IN_REGEX,
    MULTIPLE_BLANK_LINES_REGEX,
} from "./regex-patterns.js";

/**
 * Cleans markdown content by removing navigation links, separators, and "Defined in:" lines.
 *
 * @param content - The markdown content to clean.
 * @returns The cleaned markdown content.
 */
export function cleanMarkdown(content: string): string {
    content = content.replace(NAVIGATION_LINKS_REGEX, "");
    content = content.replace(SEPARATOR_LINES_REGEX, "");
    content = content.replace(PITHOS_LINKS_REGEX, "");
    content = content.replace(DEFINED_IN_REGEX, "");
    content = content.replace(MULTIPLE_BLANK_LINES_REGEX, "\n\n");

    // Remove duplicate ## Since sections (TypeDoc duplicates @since for aliases like `const chain = flatMap`)
    content = content.replace(/(## Since\n\n[^\n]+)\n\n## Since\n\n[^\n]+/g, "$1");

    return content.trim();
}

/**
 * Removes Throws, See, Deprecated, Internal, and Default sections from content.
 * These sections will be reinserted in the correct place later.
 *
 * @param content - The markdown content.
 * @returns The content with the sections removed.
 */
export function removeThrowsAndSeeSections(content: string): string {
    // Remove Throws section
    content = content.replace(
        /(?:^|\n)(##+\s+Throws)\n\n[\s\S]*?(?=\n##+\s|\n###+\s|$)/m,
        ""
    );

    // Remove See section (## or ###)
    content = content.replace(
        /(?:^|\n)(##+\s+See)\n\n[\s\S]*?(?=\n##+\s|\n*$)/,
        ""
    );

    // Remove Deprecated section (## or ###)
    content = content.replace(
        /(?:^|\n)(##+\s+Deprecated)\n\n[\s\S]*?(?=\n##+\s|\n*$)/,
        ""
    );

    // Remove Internal section (## or ###)
    content = content.replace(
        /(?:^|\n)(##+\s+Internal)\n\n[\s\S]*?(?=\n##+\s|\n*$)/,
        ""
    );

    // Remove Default section (## or ###)
    content = content.replace(
        /(?:^|\n)(##+\s+Default)\n\n[\s\S]*?(?=\n##+\s|\n*$)/,
        ""
    );

    // Remove Info section (## or ###) — global to handle multiple @info tags
    content = content.replace(
        /(?:^|\n)(##+\s+Info)\n\n[\s\S]*?(?=\n##+\s|\n*$)/g,
        ""
    );

    // Remove Note section (## or ###)
    content = content.replace(
        /(?:^|\n)(##+\s+Note)\n\n[\s\S]*?(?=\n##+\s|\n*$)/,
        ""
    );

    // Remove Alert section (## or ###)
    content = content.replace(
        /(?:^|\n)(##+\s+Alert)\n\n[\s\S]*?(?=\n##+\s|\n*$)/,
        ""
    );

    // Remove Tip section (## or ###)
    content = content.replace(
        /(?:^|\n)(##+\s+Tip)\n\n[\s\S]*?(?=\n##+\s|\n*$)/,
        ""
    );

    // Clean up multiple blank lines
    content = content.replace(MULTIPLE_BLANK_LINES_REGEX, "\n\n");

    return content;
}


/**
 * Inserts horizontal rules (`---`) between `## ` sections for visual separation.
 * Skips the first `## ` heading (directly after the title/description area).
 * Also skips if a merged-type-separator div or another --- precedes the heading.
 */
export function insertSectionSeparators(content: string): string {
    let count = 0;
    // Match 1-2 newlines before ## to normalize spacing and avoid Setext heading
    // interpretation (text\n--- becomes an h2 in markdown).
    return content.replace(/\n{1,2}(## )/g, (match, heading, offset) => {
        count++;
        // Skip the first ## heading — it follows the title naturally
        if (count === 1) return match;
        
        // Skip if preceded by merged-type-separator (check last 200 chars before match)
        const precedingContent = content.slice(Math.max(0, offset - 200), offset);
        if (precedingContent.includes('merged-type-separator')) {
            return match;
        }
        
        // Skip if there's already a --- separator right before (within last 20 chars)
        const recentContent = content.slice(Math.max(0, offset - 20), offset);
        if (recentContent.trim().endsWith('---')) {
            return match;
        }
        
        return `\n\n---\n\n${heading}`;
    });
}

/**
 * Inserts a horizontal rule after the main description (including admonitions)
 * and before the first technical section (Type Parameters, Parameters, Returns).
 * 
 * This creates visual separation between the introductory content and the API reference.
 * Skips insertion if a separator already exists right before the technical section.
 */
export function insertDescriptionSeparator(content: string): string {
    // Match the first occurrence of Type Parameters, Parameters, or Returns heading
    // These mark the start of the technical API reference section
    const technicalSectionRegex = /\n(##+\s+(?:Type Parameters|Parameters|Returns):?[^\n]*\n)/;
    const match = content.match(technicalSectionRegex);
    
    if (!match || match.index === undefined) {
        // No technical sections found, don't insert separator
        return content;
    }
    
    const insertPosition = match.index;
    
    // Check if there's already a separator (---) right before the technical section
    // Look back up to 50 chars to see if there's already a --- separator
    const precedingContent = content.slice(Math.max(0, insertPosition - 50), insertPosition);
    if (precedingContent.includes('---')) {
        // Already has a separator, skip insertion
        return content;
    }
    
    // Insert the separator before the technical section
    return (
        content.slice(0, insertPosition) +
        "\n\n---\n" +
        content.slice(insertPosition)
    );
}

/**
 * Normalizes heading levels so that no heading skips a level (e.g. H2 → H4).
 *
 * TypeDoc sometimes generates `#### T` directly under `## Type Parameters`,
 * skipping H3. This function walks through all headings and ensures the
 * hierarchy is always contiguous.
 *
 * Uses a cumulative offset: when a heading is shifted (e.g. H4→H3, offset=-1),
 * all subsequent headings at the same or deeper original level inherit that
 * offset. This ensures sibling headings (e.g. multiple H4 type params) all
 * get the same correction.
 */
export function normalizeHeadingLevels(content: string): string {
    const lines = content.split("\n");
    let lastLevel = 1;
    // Cumulative offset per original level: how much to shift headings at that depth
    // e.g. offsetByLevel[4] = -1 means all original H4s become H3
    const offsetByLevel: number[] = [0, 0, 0, 0, 0, 0, 0]; // indices 0-6

    for (let i = 0; i < lines.length; i++) {
        const match = lines[i]!.match(/^(#{1,6})\s/);
        if (!match) continue;

        const hashes = match[1]!;
        const originalLevel = hashes.length;

        // Apply any inherited offset from a parent correction
        const adjustedLevel = originalLevel + (offsetByLevel[originalLevel] ?? 0);
        const maxAllowed = lastLevel + 1;

        if (adjustedLevel > maxAllowed) {
            // Needs fixing: compute additional offset needed
            const additionalShift = maxAllowed - adjustedLevel;
            // Apply this shift to this level and all deeper levels
            for (let lvl = originalLevel; lvl <= 6; lvl++) {
                offsetByLevel[lvl] = (offsetByLevel[lvl] ?? 0) + additionalShift;
            }
            lines[i] = "#".repeat(maxAllowed) + lines[i]!.slice(hashes.length);
            lastLevel = maxAllowed;
        } else if (adjustedLevel < originalLevel) {
            // Already has an offset from a previous correction, apply it
            const fixedLevel = Math.max(1, adjustedLevel);
            lines[i] = "#".repeat(fixedLevel) + lines[i]!.slice(hashes.length);
            lastLevel = fixedLevel;
        } else {
            lastLevel = adjustedLevel;
        }

        // When we go back up to a shallower level, reset offsets for deeper levels
        if (originalLevel <= 2) {
            for (let lvl = originalLevel + 1; lvl <= 6; lvl++) {
                offsetByLevel[lvl] = 0;
            }
        }
    }

    return lines.join("\n");
}

