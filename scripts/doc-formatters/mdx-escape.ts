/**
 * Escapes generic types in markdown content that could be interpreted as JSX tags.
 *
 * MDX interprets `<string>`, `<number>`, etc. as JSX tags. This function finds
 * type patterns like `Type<T>` that are NOT already wrapped in backticks and wraps them.
 *
 * @param content - The markdown content to process.
 * @returns The content with generic types escaped.
 */
export function escapeGenericTypesForMDX(content: string): string {
    return content.split('\n').map(line => {
        // Skip code blocks
        if (line.trim().startsWith('```')) {
            return line;
        }

        // Escape enum examples in list items that could be interpreted as JSX
        // Pattern: - enum EnumName { A = "a", B = "b" }
        // MDX interprets single letters like A, B as JSX components
        if (/^-\s+enum\s+\w+\s*\{/.test(line)) {
            // Wrap the enum example in backticks to prevent JSX interpretation
            return line.replace(
                /^(-\s+enum\s+\w+\s*\{[^}]+\})/,
                '`$1`'
            );
        }

        // Split into backtick-wrapped and non-backtick segments
        const segments: Array<{ type: 'text' | 'code', content: string }> = [];
        let lastIndex = 0;
        const backtickRegex = /`[^`]+`/g;
        let backtickMatch;

        while ((backtickMatch = backtickRegex.exec(line)) !== null) {
            if (backtickMatch.index > lastIndex) {
                segments.push({ type: 'text', content: line.slice(lastIndex, backtickMatch.index) });
            }
            // Code segments are already protected by backticks in MDX, no need to escape
            segments.push({ type: 'code', content: backtickMatch[0] });
            lastIndex = backtickMatch.index + backtickMatch[0].length;
        }
        if (lastIndex < line.length) {
            segments.push({ type: 'text', content: line.slice(lastIndex) });
        }

        // Process only text segments
        return segments.map(seg => {
            if (seg.type === 'code') {
                return seg.content;
            }

            // In text segments, find and wrap generic types
            // First, handle standalone generic types like <T>, <A>, <K> etc. that appear in function signatures
            // Pattern: <T> followed by ( or , or : or space or > or ]
            let processed = seg.content.replace(
                /<([A-Z][A-Za-z0-9_]*)>(?=\s*[\(,:\s>\]|&])/g,
                (match: string, typeParam: string) => {
                    return `\`<${typeParam}>\``;
                }
            );

            // Then handle Type<T> patterns (but skip if already in backticks)
            processed = processed.replace(
                /\b([A-Z][A-Za-z0-9_]*)<([A-Za-z0-9_,\s<>|&()\[\]]+)>/g,
                (match: string, typeName: string, typeParams: string) => {
                    // Skip if already wrapped in backticks
                    if (match.includes('`')) return match;
                    return `\`${typeName}<${typeParams}>\``;
                }
            );

            return processed;
        }).join('');
    }).join('\n');
}
