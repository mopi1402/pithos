import {
    PARAM_SIMPLE_TYPE_REGEX,
    PARAM_WITH_DESCRIPTION_REGEX,
    PARAM_BACKTICK_TYPE_REGEX,
    INTERFACE_PROPERTY_REGEX,
    RETURNS_TYPE_FIRST_REGEX,
    RETURNS_DESCRIPTION_FIRST_REGEX,
    RETURNS_NESTED_SUBSECTIONS_REGEX,
    RETURNS_SIMPLE_TYPE_REGEX,
} from "./regex-patterns.js";
import { wrapFullType, looksLikeType, isSectionHeader } from "./type-utils.js";

/**
 * Reformats parameters and return types to have types on the same line as names.
 *
 * This function processes TypeDoc-generated markdown to reformat:
 * - Parameter sections: `### paramName\n\ntype` → `### paramName: type`
 * - Returns sections: `## Returns\n\ntype` → `## Returns: type`
 *
 * @param content - The markdown content to reformat.
 * @returns The reformatted markdown content.
 */
export function reformatParameters(content: string): string {
    // Handle interface property with blockquote type (TypeDoc format) - MUST BE FIRST
    // Format: ### propName?\n\n> `optional` **propName**: `type`\n\n
    content = content.replace(
        INTERFACE_PROPERTY_REGEX,
        (match, heading, paramName, typePart) => {
            if (heading.includes(":")) return match;
            if (isSectionHeader(paramName)) return match;
            const typeWithoutBackticks = typePart.trim().replace(/`/g, "").trim();
            return `${heading}: ${wrapFullType(typeWithoutBackticks)}\n\n`;
        }
    );

    // Handle simple case: ### paramName\n\ntype\n\n
    content = content.replace(
        PARAM_SIMPLE_TYPE_REGEX,
        (match, heading, paramName, typeLine) => {
            if (heading.includes(":")) return match;
            if (isSectionHeader(paramName)) return match;
            if (looksLikeType(typeLine)) {
                const typeWithoutBackticks = typeLine.replace(/`/g, "").trim();
                return `${heading}: ${wrapFullType(typeWithoutBackticks)}\n\n`;
            }
            return match;
        }
    );

    // Process parameter section with description
    content = content.replace(
        PARAM_WITH_DESCRIPTION_REGEX,
        (match, heading, paramName, firstBlock, secondLine) => {
            if (heading.includes(":")) return match;
            if (isSectionHeader(paramName)) return match;

            const firstIsType = looksLikeType(firstBlock.split("\n")[0]);

            if (firstIsType) {
                const typeLine = firstBlock.split("\n")[0];
                const typeWithoutBackticks = typeLine.replace(/`/g, "").trim();
                const description =
                    firstBlock.split("\n").slice(1).join("\n").trim() ||
                    secondLine.trim();
                return `${heading}: ${wrapFullType(typeWithoutBackticks)}\n\n${description ? description + "\n\n" : ""
                    }`;
            } else {
                if (looksLikeType(secondLine)) {
                    const typeWithoutBackticks = secondLine.replace(/`/g, "").trim();
                    return `${heading}: ${wrapFullType(
                        typeWithoutBackticks
                    )}\n\n${firstBlock.trim()}\n\n`;
                }
            }

            return match;
        }
    );

    // Handle description first, type last before next section
    content = content.replace(
        /(###+\s+([^\n]+?))\n\n([^\n]+(?:\n[^\n]+)*?)\n\n([^\n]+)\n\n(##|###)/g,
        (match, heading, paramName, firstBlock, secondLine, nextSection) => {
            if (heading.includes(":")) return match;
            if (isSectionHeader(paramName)) return match;

            const firstIsDescription =
                firstBlock.trim().length > 10 &&
                /^[A-Z]/.test(firstBlock.trim()) &&
                !looksLikeType(firstBlock.split("\n")[0]);

            const secondIsType = looksLikeType(secondLine);

            if (firstIsDescription && secondIsType) {
                const typeWithoutBackticks = secondLine.replace(/`/g, "").trim();
                return `${heading}: ${wrapFullType(
                    typeWithoutBackticks
                )}\n\n${firstBlock.trim()}\n\n${nextSection}`;
            }

            return match;
        }
    );

    // Handle backticked type
    content = content.replace(
        PARAM_BACKTICK_TYPE_REGEX,
        (match, heading, paramName, typePart) => {
            if (heading.includes(":")) return match;
            if (isSectionHeader(paramName)) return match;
            const typeWithoutBackticks = typePart.trim().replace(/`/g, "").trim();
            return `${heading}: ${wrapFullType(typeWithoutBackticks)}\n\n`;
        }
    );

    // Handle type then description
    content = content.replace(
        /(###+\s+([^\n]+?))\n\n([^\n]+)\n\n([^\n]+)\n\n/g,
        (match, heading, paramName, firstLine, secondLine) => {
            if (heading.includes(":")) return match;
            if (isSectionHeader(paramName)) return match;

            const firstIsType = looksLikeType(firstLine);
            const secondIsDescription =
                secondLine.length > 5 &&
                /^[A-Z]/.test(secondLine.trim()) &&
                !looksLikeType(secondLine);

            if (firstIsType && secondIsDescription) {
                const typeWithoutBackticks = firstLine.replace(/`/g, "").trim();
                return `${heading}: ${wrapFullType(
                    typeWithoutBackticks
                )}\n\n${secondLine.trim()}\n\n`;
            }

            return match;
        }
    );

    // Handle Returns with type first
    content = content.replace(
        RETURNS_TYPE_FIRST_REGEX,
        (match, heading, firstLine, secondLine) => {
            if (heading.includes(":")) return match;

            const firstIsType = looksLikeType(firstLine);
            const secondIsDescription =
                secondLine.length > 10 &&
                /^[A-Z]/.test(secondLine.trim()) &&
                !looksLikeType(secondLine);

            if (firstIsType && secondIsDescription) {
                const typeWithoutBackticks = firstLine.replace(/`/g, "").trim();
                return `${heading}: ${wrapFullType(
                    typeWithoutBackticks
                )}\n\n${secondLine.trim()}\n\n`;
            }

            return match;
        }
    );

    // Handle Returns with description first (blockquote type)
    content = content.replace(
        RETURNS_DESCRIPTION_FIRST_REGEX,
        (match, heading, descriptionBlock, blockquotePrefix, typeLine) => {
            if (heading.includes(":")) return match;

            const cleanType = typeLine.trim();
            if (looksLikeType(cleanType)) {
                const typeWithoutBackticks = cleanType.replace(/`/g, "").trim();
                return `${heading}: ${wrapFullType(
                    typeWithoutBackticks
                )}\n\n${descriptionBlock.trim()}\n\n`;
            }
            return match;
        }
    );

    // Remove nested Parameters/Returns subsections
    content = content.replace(
        RETURNS_NESTED_SUBSECTIONS_REGEX,
        (match, returnsSection) => returnsSection
    );

    // Handle simple Returns type
    content = content.replace(
        RETURNS_SIMPLE_TYPE_REGEX,
        (match, heading, blockquotePrefix, typeLine) => {
            if (heading.includes(":")) return match;

            const cleanLine = typeLine.replace(/^>\s*/, "").trim();

            if (
                !cleanLine ||
                (cleanLine.length > 30 &&
                    /^(Returns|The|This)/.test(cleanLine) &&
                    !looksLikeType(cleanLine))
            ) {
                return match;
            }

            if (looksLikeType(cleanLine)) {
                const typeWithoutBackticks = cleanLine.replace(/`/g, "").trim();
                return `${heading}: ${wrapFullType(typeWithoutBackticks)}\n\n`;
            }

            return match;
        }
    );

    return content;
}
