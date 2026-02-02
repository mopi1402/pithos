import {
    THROWS_SECTION_REGEX,
    SEE_SECTION_REGEX,
    DEPRECATED_SECTION_REGEX,
    INTERNAL_SECTION_REGEX,
    DEFAULT_SECTION_REGEX,
    INFO_SECTION_REGEX,
    NOTE_SECTION_REGEX,
    ALERT_SECTION_REGEX,
    TIP_SECTION_REGEX,
} from "./regex-patterns.js";

/**
 * Extracts the Throws section from TypeDoc markdown.
 *
 * @param content - The markdown content.
 * @returns The formatted Throws section, or `null` if not found.
 */
export function extractThrowsSection(content: string): string | null {
    const throwsMatch = content.match(THROWS_SECTION_REGEX);
    if (!throwsMatch) return null;

    const throwsContent = throwsMatch[2].trim();
    if (!throwsContent) return null;

    return `\n## Throws\n\n${throwsContent}\n`;
}

/**
 * Extracts the See section from TypeDoc markdown.
 *
 * @param content - The markdown content.
 * @returns The formatted See section, or `null` if not found.
 */
export function extractSeeSection(content: string): string | null {
    const seeMatch = content.match(SEE_SECTION_REGEX);
    if (!seeMatch) return null;

    const seeContent = seeMatch[2].trim();
    if (!seeContent) return null;

    return `\n## See Also\n\n${seeContent}\n`;
}

/**
 * Extracts the Deprecated section from TypeDoc markdown.
 * Returns a Docusaurus admonition format.
 * If a "Reason: xxx" is found, it's formatted as a blockquote.
 *
 * @param content - The markdown content.
 * @returns The formatted Deprecated admonition, or `null` if not found.
 */
export function extractDeprecatedSection(content: string): string | null {
    const deprecatedMatch = content.match(DEPRECATED_SECTION_REGEX);
    if (!deprecatedMatch) return null;

    let deprecatedContent = deprecatedMatch[2].trim();
    if (!deprecatedContent) return null;

    // Format "Reason: xxx" as a blockquote if present
    deprecatedContent = deprecatedContent.replace(
        /\n?Reason:\s*(.+)$/m,
        (_, reason) => `\n\n> **Reason**:<br/>\n> ${reason.trim()}`
    );

    return `\n:::warning DEPRECATED\n\n${deprecatedContent}\n\n:::\n`;
}

/**
 * Extracts the Internal section from TypeDoc markdown.
 *
 * @param content - The markdown content.
 * @returns The formatted Internal section, or `null` if not found.
 */
export function extractInternalSection(content: string): string | null {
    const internalMatch = content.match(INTERNAL_SECTION_REGEX);
    if (!internalMatch) return null;

    const internalContent = internalMatch[2].trim();
    if (!internalContent) return null;

    return `\n## Internal\n\n${internalContent}\n`;
}

/**
 * Extracts the Default section from TypeDoc markdown.
 *
 * @param content - The markdown content.
 * @returns The formatted Default section, or `null` if not found.
 */
export function extractDefaultSection(content: string): string | null {
    const defaultMatch = content.match(DEFAULT_SECTION_REGEX);
    if (!defaultMatch) return null;

    const defaultContent = defaultMatch[2].trim();
    if (!defaultContent) return null;

    return `\n## Default Value\n\n${defaultContent}\n`;
}

/**
 * Extracts the Info section from TypeDoc markdown.
 * Returns a Docusaurus admonition format.
 * If the content starts with up to 5 words followed by ":", treats it as a custom title.
 *
 * @param content - The markdown content.
 * @returns The formatted Info admonition, or `null` if not found.
 */
export function extractInfoSection(content: string): string | null {
    const infoMatch = content.match(INFO_SECTION_REGEX);
    if (!infoMatch) return null;

    let infoContent = infoMatch[2].trim();
    if (!infoContent) return null;

    // Check if first 1-5 words are followed by ":"
    // Pattern: 1 to 5 words (letters, numbers, spaces) followed by ":"
    const titleMatch = infoContent.match(/^((?:\S+\s+){0,4}\S+):\s*([\s\S]*)$/);
    
    if (titleMatch) {
        const title = titleMatch[1].toUpperCase();
        const body = titleMatch[2].trim();
        return `\n:::info[${title}]\n\n${body}\n\n:::\n`;
    }

    return `\n:::info\n\n${infoContent}\n\n:::\n`;
}

/**
 * Extracts the Note section from TypeDoc markdown.
 * Returns a Docusaurus admonition format.
 * If the content starts with up to 5 words followed by ":", treats it as a custom title.
 *
 * @param content - The markdown content.
 * @returns The formatted Note admonition, or `null` if not found.
 */
export function extractNoteSection(content: string): string | null {
    const noteMatch = content.match(NOTE_SECTION_REGEX);
    if (!noteMatch) return null;

    let noteContent = noteMatch[2].trim();
    if (!noteContent) return null;

    // Check if first 1-5 words are followed by ":"
    // Pattern: 1 to 5 words (letters, numbers, spaces) followed by ":"
    const titleMatch = noteContent.match(/^((?:\S+\s+){0,4}\S+):\s*([\s\S]*)$/);
    
    if (titleMatch) {
        const title = titleMatch[1].toUpperCase();
        const body = titleMatch[2].trim();
        return `\n:::note[${title}]\n\n${body}\n\n:::\n`;
    }

    return `\n:::note\n\n${noteContent}\n\n:::\n`;
}

/**
 * Extracts the Alert section from TypeDoc markdown.
 * Returns a Docusaurus danger admonition format.
 * If the content starts with up to 5 words followed by ":", treats it as a custom title.
 *
 * @param content - The markdown content.
 * @returns The formatted Alert (danger) admonition, or `null` if not found.
 */
export function extractAlertSection(content: string): string | null {
    const alertMatch = content.match(ALERT_SECTION_REGEX);
    if (!alertMatch) return null;

    let alertContent = alertMatch[2].trim();
    if (!alertContent) return null;

    // Check if first 1-5 words are followed by ":"
    // Pattern: 1 to 5 words (letters, numbers, spaces) followed by ":"
    const titleMatch = alertContent.match(/^((?:\S+\s+){0,4}\S+):\s*([\s\S]*)$/);
    
    if (titleMatch) {
        const title = titleMatch[1].toUpperCase();
        const body = titleMatch[2].trim();
        return `\n:::danger[${title}]\n\n${body}\n\n:::\n`;
    }

    return `\n:::danger\n\n${alertContent}\n\n:::\n`;
}

/**
 * Extracts the Tip section from TypeDoc markdown.
 * Returns a Docusaurus tip admonition format.
 * If the content starts with up to 5 words followed by ":", treats it as a custom title.
 *
 * @param content - The markdown content.
 * @returns The formatted Tip admonition, or `null` if not found.
 */
export function extractTipSection(content: string): string | null {
    const tipMatch = content.match(TIP_SECTION_REGEX);
    if (!tipMatch) return null;

    let tipContent = tipMatch[2].trim();
    if (!tipContent) return null;

    // Check if first 1-5 words are followed by ":"
    // Pattern: 1 to 5 words (letters, numbers, spaces) followed by ":"
    const titleMatch = tipContent.match(/^((?:\S+\s+){0,4}\S+):\s*([\s\S]*)$/);
    
    if (titleMatch) {
        const title = titleMatch[1].toUpperCase();
        const body = titleMatch[2].trim();
        return `\n:::tip[${title}]\n\n${body}\n\n:::\n`;
    }

    return `\n:::tip\n\n${tipContent}\n\n:::\n`;
}
