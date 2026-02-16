/**
 * Wraps a type string in backticks, cleaning escape characters and markdown formatting.
 * If the original type contains markdown links, wraps in `<TypeRef>` to preserve
 * clickable links while maintaining monospace styling.
 *
 * @param typeStr - The type string to wrap.
 * @returns The type string wrapped in backticks or `<TypeRef>`.
 */
export function wrapFullType(typeStr: string): string {
    const hasLinks = /\[([^\]]+)\]\([^)]*\.md[^)]*\)/.test(typeStr);

    if (hasLinks) {
        // Preserve links but clean escape characters and backticks
        const cleanType = typeStr
            .replace(/\\`/g, "")
            .replace(/`/g, "")
            // Escape \< and \> FIRST (before the general unescape)
            .replace(/\\</g, "&lt;")
            .replace(/\\>/g, "&gt;")
            // Then unescape remaining backslash sequences (but NOT < > which are already handled)
            .replace(/\\([\[\]|=])/g, "$1")
            .replace(/\\{/g, "&#123;")
            .replace(/\\}/g, "&#125;")
            .replace(/\*([^*]+)\*/g, "$1")
            .trim()
            // Escape any remaining bare < > and { } that are NOT inside markdown links [text](url)
            // First protect links, then escape, then restore
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "%%LINK[$1]($2)%%")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\{/g, "&#123;")
            .replace(/\}/g, "&#125;")
            .replace(/%%LINK\[([^\]]+)\]\(([^)]+)\)%%/g, "[$1]($2)");

        return `<TypeRef>${cleanType}</TypeRef>`;
    }

    // No links — strip everything and wrap in backticks
    let cleanType = typeStr
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/\\`/g, "")
        .replace(/`/g, "")
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
        // Lines ending with a period are almost certainly descriptions, not types
        if (trimmed.endsWith(".")) {
            return false;
        }
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
        /^\(|^`|\[.*\]\(.*\)|\[|\]|\||=>|keyof|\.\.\.|\<|\>|extends\b|unknown\b|never\b|any\b|void\b|boolean\b|string\b|number\b|object\b|readonly\b|Promise\b|Result\b|Either\b/.test(
            trimmed
        ) ||
        /^\(|\[.*\]\(.*\)|\[|\]|\||=>|keyof|\.\.\.|\<|\>|extends\b|unknown\b|never\b|any\b|void\b|boolean\b|string\b|number\b|object\b|readonly\b|Promise\b|Result\b|Either\b/.test(
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
