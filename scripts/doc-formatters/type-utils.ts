/**
 * Wraps a type string in backticks, cleaning escape characters and markdown formatting.
 *
 * @param typeStr - The type string to wrap.
 * @returns The type string wrapped in backticks.
 */
export function wrapFullType(typeStr: string): string {
    // Check if the type contains markdown links - preserve them for link-rewriter
    const hasLinks = /\[([^\]]+)\]\([^)]+\)/.test(typeStr);

    if (hasLinks) {
        // For types with links, use <code> HTML tag to preserve both:
        // - Code styling (dashed border)
        // - Clickable links for navigation
        let cleanType = typeStr
            .replace(/\\`/g, "") // Remove escaped backticks
            .replace(/`/g, "") // Remove regular backticks
            .replace(/\*([^*]+)\*/g, "$1") // Remove markdown italics
            .trim();

        // Unescape special chars
        cleanType = cleanType
            .replace(/\\</g, "<")
            .replace(/\\>/g, ">")
            .replace(/\\{/g, "{")
            .replace(/\\}/g, "}");

        // Convert ALL < > { } to HTML entities to avoid MDX interpreting them as JSX
        // Markdown links use [text](url), not < >, so this is safe
        cleanType = cleanType
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/{/g, "&#123;")
            .replace(/}/g, "&#125;");

        return `<code>${cleanType}</code>`;
    }

    // For types without links, clean everything and wrap in backticks
    let cleanType = typeStr
        .replace(/\\`/g, "") // Remove escaped backticks first
        .replace(/`/g, "") // Then remove regular backticks
        .replace(/\\([\[\]|=>])/g, "$1")
        .replace(/\\</g, "<")
        .replace(/\\>/g, ">")
        .replace(/\\{/g, "{")
        .replace(/\\}/g, "}")
        .replace(/\*([^*]+)\*/g, "$1")
        .trim();

    // Fix TypeDoc bug: "readonly readonly T[][]" -> "readonly (readonly T[])[]"
    cleanType = cleanType.replace(
        /\breadonly\s+readonly\s+([A-Za-z_$][A-Za-z0-9_$<>[\],\s]*?)(\[\])(\[\])/g,
        (match, typePart, firstBrackets, secondBrackets) => {
            const trimmedType = typePart.trim();
            if (trimmedType) {
                return `readonly (readonly ${trimmedType}${firstBrackets})${secondBrackets}`;
            }
            return match;
        }
    );

    return `\`${cleanType}\``;
}

/**
 * Checks if a line looks like a TypeScript type definition.
 *
 * @param line - The line to check.
 * @returns `true` if the line looks like a type, `false` otherwise.
 */
export function looksLikeType(line: string): boolean {
    const trimmed = line.trim();

    // If it starts with a capital letter (not backtick), check if it's a description
    // Descriptions: start with capital, are longer, and look like sentences
    // Types: start with capital but are short or have obvious type syntax
    if (/^[A-Z]/.test(trimmed) && !trimmed.startsWith("`")) {
        // Short lines with type chars are likely types (e.g., "T | U", "Promise<T>")
        if (trimmed.length <= 30) {
            // Allow short type expressions
        } else {
            // Longer lines starting with capital are likely descriptions
            // unless they start with a type keyword
            const startsWithTypeKeyword = /^(Promise|Record|Array|Map|Set|Result|Either|Partial|Required|Readonly|Pick|Omit)\b/.test(trimmed);
            if (!startsWithTypeKeyword) {
                return false;
            }
        }
    }

    const withoutBackticks = trimmed.replace(/`/g, "").trim();
    return (
        /^\(|^`|\[.*\]\(.*\)|\[|\]|\||=>|keyof|\.\.\.|\<|\>|extends\b|unknown\b|never\b|any\b|void\b|boolean\b|string\b|number\b|object\b|Promise\b|Result\b|Either\b/.test(
            trimmed
        ) ||
        /^\(|\[.*\]\(.*\)|\[|\]|\||=>|keyof|\.\.\.|\<|\>|extends\b|unknown\b|never\b|any\b|void\b|boolean\b|string\b|number\b|object\b|Promise\b|Result\b|Either\b/.test(
            withoutBackticks
        )
    );
}

/**
 * Checks if a heading is a section header (Parameters, Returns, etc.) rather than a parameter name.
 *
 * @param headingText - The heading text to check.
 * @returns `true` if it's a section header, `false` otherwise.
 */
export function isSectionHeader(headingText: string): boolean {
    const normalized = headingText.trim().toLowerCase();
    const sectionHeaders = [
        "parameters",
        "returns",
        "throws",
        "see",
        "deprecated",
        "internal",
        "default",
        "since",
        "example",
        "type parameters",
    ];
    return sectionHeaders.includes(normalized);
}
