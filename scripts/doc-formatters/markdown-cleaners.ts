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

    // Remove Info section (## or ###)
    content = content.replace(
        /(?:^|\n)(##+\s+Info)\n\n[\s\S]*?(?=\n##+\s|\n*$)/,
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
