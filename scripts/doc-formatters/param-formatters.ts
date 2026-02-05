import {
    PARAM_SIMPLE_TYPE_REGEX,
    PARAM_WITH_DESCRIPTION_REGEX,
    PARAM_BACKTICK_TYPE_REGEX,
    INTERFACE_PROPERTY_REGEX,
    READONLY_PROPERTY_REGEX,
    RETURNS_TYPE_FIRST_REGEX,
    RETURNS_DESCRIPTION_FIRST_REGEX,
    RETURNS_NESTED_SUBSECTIONS_REGEX,
    RETURNS_SIMPLE_TYPE_REGEX,
} from "./regex-patterns.js";
import { wrapFullType, looksLikeType, isSectionHeader } from "./type-utils.js";

/**
 * Removes TypeDoc blockquote signature lines from class methods and constructors.
 *
 * TypeDoc generates a blockquote signature line for each class method/constructor:
 *   ### methodName()
 *   > **methodName**<T>(param): ReturnType
 *
 * This line is redundant (the info is in the heading + Parameters/Returns subsections)
 * and causes `reformatParameters` to misinterpret it as a type annotation, producing
 * broken headings like `### isOk(): > *isOk*(): this is Ok<T, E>`.
 *
 * Does NOT touch property blockquotes (`> \`readonly\` **prop**: type`) since those
 * carry the type information that INTERFACE_PROPERTY_REGEX / READONLY_PROPERTY_REGEX need.
 *
 * Must be called BEFORE `reformatParameters`.
 */
function removeClassMethodSignatureBlockquotes(content: string): string {
    // Match method/constructor signatures: the blockquote contains **name**(...) with parentheses
    // immediately after the bold name (no colon between name and parens).
    // This distinguishes methods from properties:
    //   Method:   > **methodName**<T>(param): ReturnType   — parens right after name/generics
    //   Property: > **propName**: (param) => ReturnType     — colon after name, then function type
    //
    // Pattern: ### heading\n\n> [modifiers] **name**[<...>](...): ReturnType\n\n
    // The key distinction: after **name** we expect \< or ( but NOT :
    content = content.replace(
        /(###+\s+(?:\w+(?:\(\))?|Constructor))\n\n>\s*(?:`\w+`\s*)*\*\*(?:new\s+)?\w+\*\*(?:\\<[^>]*\\>)*\s*\([^\n]*\)[^\n]*\n\n/g,
        "$1\n\n"
    );

    // Same pattern but for #### Call Signature within class methods
    content = content.replace(
        /(####+\s+Call Signature)\n\n>\s*(?:`\w+`\s*)*\*\*(?:new\s+)?\w+\*\*(?:\\<[^>]*\\>)*\s*\([^\n]*\)[^\n]*\n\n/g,
        "$1\n\n"
    );
    
    return content;
}

/**
 * Reformats nested Parameters and Returns sections within method properties.
 * Must be called BEFORE other parameter reformatting.
 * Converts:
 *   ### method(): type
 *   #### Parameters
 *   ##### param
 *   `type`
 *   description (optional)
 *   #### Returns
 *   `type`
 *   description (optional)
 * To:
 *   ### method(): type
 *   > **param**: `type` - description<br />
 *   > **Returns**: `type`
 *   description
 */
function reformatNestedMethodSections(content: string): string {
    // Match: ####+ Parameters section, capture everything until ####+ Returns
    // Use [\s\S]*? to capture multi-line content including descriptions
    // The heading depth varies: #### for top-level methods, ##### for Call Signatures in classes
    const regex = /(#{4,}\s+Parameters\n\n)([\s\S]*?)(#{4,}\s+Returns\n\n)([^\n]+)(?:\n\n([^\n#][^\n]*))?/g;

    content = content.replace(regex, (match, paramsHeader, paramsContent, _returnsHeader, returnType, returnDesc) => {
        // Detect the heading depth from the Parameters header to find param sub-headings
        const paramsDepth = paramsHeader.match(/^(#+)/)?.[1].length ?? 4;
        const paramHeadingPrefix = "#".repeat(paramsDepth + 1);
        const paramRegex = new RegExp(`^${paramHeadingPrefix} (\\\\?\\w+\\??)\\n\\n([^\\n]+)(?:\\n\\n([\\s\\S]*))?$`);

        // Split by param sub-headings
        const splitRegex = new RegExp(`(?=${paramHeadingPrefix} )`);
        const paramBlocks = paramsContent.split(splitRegex);
        let formattedLines: string[] = [];

        for (const block of paramBlocks) {
            if (!block.trim()) continue;

            const paramMatch = block.match(paramRegex);
            if (paramMatch) {
                const [, paramName, rawType, description] = paramMatch;
                // Use wrapFullType to handle links properly
                const wrappedType = wrapFullType(rawType.trim());

                if (description && description.trim()) {
                    formattedLines.push(`> **${paramName}**: ${wrappedType} — ${description.trim()}<br />`);
                } else {
                    formattedLines.push(`> **${paramName}**: ${wrappedType}<br />`);
                }
            }
        }

        // Add return type using wrapFullType to preserve links
        // Include return description on the same line if present
        const wrappedReturnType = wrapFullType(returnType.trim());
        if (returnDesc && returnDesc.trim()) {
            formattedLines.push(`> **Returns**: ${wrappedReturnType} — ${returnDesc.trim()}`);
        } else {
            formattedLines.push(`> **Returns**: ${wrappedReturnType}`);
        }

        // Join with single newline to keep them in the same blockquote
        return formattedLines.join('\n') + '\n\n';
    });

    return content;
}

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
    // IMPORTANT: Remove class method blockquote signatures FIRST to prevent
    // them from being misinterpreted as type annotations by later regexes
    content = removeClassMethodSignatureBlockquotes(content);

    // Reformat nested method sections BEFORE other transformations
    content = reformatNestedMethodSections(content);
    // Handle interface property with blockquote type (TypeDoc format) - MUST BE FIRST
    // Format: ### propName?\n\n> `optional` **propName**: `type`\n\n
    // Transform to: ### propName?: <code>type</code>\n\n
    content = content.replace(
        INTERFACE_PROPERTY_REGEX,
        (match, heading, paramName, typePart) => {
            if (heading.includes(":")) return match;
            // Note: no isSectionHeader check — the regex pattern is specific enough
            // (requires `> [optional] **name**: type`) to never match a section header.

            // Extract optional marker (?) from heading
            const isOptional = heading.includes("?");
            const cleanHeading = heading.replace(/\?/, "");
            
            // Clean the type and wrap in <code> for consistent formatting with function parameters
            let cleanType = typePart.trim().replace(/`/g, "").trim();
            
            // Unescape TypeDoc's markdown escapes before converting to HTML entities
            cleanType = cleanType
                .replace(/\\</g, "<")
                .replace(/\\>/g, ">")
                .replace(/\\{/g, "{")
                .replace(/\\}/g, "}");
            
            // Escape special characters for MDX
            cleanType = cleanType
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/{/g, "&#123;")
                .replace(/}/g, "&#125;");
            
            const optionalMarker = isOptional ? "?" : "";
            
            return `<a id="${paramName}"></a>\n\n${cleanHeading}${optionalMarker}: <code>${cleanType}</code>\n\n`;
        }
    );

    // Handle readonly property with default value (const object properties)
    // Format: ### propName\n\n> `readonly` **propName**: `type` = `defaultValue`\n\n
    // Transform to: ### propName: <code>type</code>\n\n
    content = content.replace(
        READONLY_PROPERTY_REGEX,
        (match, heading, _paramName, typePart) => {
            if (heading.includes(":")) return match;
            // Note: no isSectionHeader check — the regex pattern is specific enough
            // (requires `> \`readonly\` **name**: type`) to never match a section header.

            // Clean the type and wrap in <code>
            let cleanType = typePart.trim().replace(/`/g, "").trim();

            // Unescape TypeDoc's markdown escapes before converting to HTML entities
            cleanType = cleanType
                .replace(/\\</g, "<")
                .replace(/\\>/g, ">")
                .replace(/\\{/g, "{")
                .replace(/\\}/g, "}");

            // Escape special characters for MDX
            cleanType = cleanType
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/{/g, "&#123;")
                .replace(/}/g, "&#125;");

            return `${heading}: <code>${cleanType}</code>\n\n`;
        }
    );

    // Handle simple case: ### paramName\n\ntype\n\n
    content = content.replace(
        PARAM_SIMPLE_TYPE_REGEX,
        (match, heading, paramName, typeLine) => {
            if (heading.includes(":")) return match;
            if (isSectionHeader(paramName)) return match;
            // Don't match if typeLine is actually another heading
            if (typeLine.trim().startsWith("#")) return match;
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
