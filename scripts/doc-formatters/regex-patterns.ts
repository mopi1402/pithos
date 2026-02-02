/**
 * Regex pattern for matching parameter headings with type on the same line.
 * Matches: `### paramName\n\ntype\n\n` (type on single line, no description).
 * Uses negative lookahead to not match if "type" is actually another heading.
 */
export const PARAM_SIMPLE_TYPE_REGEX = /(###+\s+([^\n]+?))\n\n((?!##)[^\n]+)\n\n/g;

/**
 * Regex pattern for matching parameter sections with description.
 * Matches: `### paramName?\n\n(description)\n\n(type)\n\n`.
 * Uses negative lookahead to not match if first block is another heading.
 */
export const PARAM_WITH_DESCRIPTION_REGEX =
    /(###+\s+([^\n]+?))\n\n((?!##)[^\n]*(?:\n[^\n]+)*?)\n\n([^\n]+)\n\n/g;

/**
 * Regex pattern for matching simple parameter with backticked type.
 * Matches: `### paramName\n\n\`type\`\n\n`.
 */
export const PARAM_BACKTICK_TYPE_REGEX =
    /(###+\s+(\w+))\n\n(`[^`\n]+`[^\n]*)\n\n/g;

/**
 * Regex pattern for matching interface property with blockquote type.
 * Matches TypeDoc format for interface properties:
 * - `### propName?\n\n> \`optional\` **propName**: \`type\`\n\n` (optional)
 * - `### propName\n\n> **propName**: \`type\`\n\n` (required)
 * - `### propName()?\n\n> \`optional\` **propName**: (params) => type\n\n` (method)
 * Captures: (1) heading, (2) propName (without ? or ()), (3) type after colon
 */
export const INTERFACE_PROPERTY_REGEX =
    /(###+\s+(\w+)(?:\(\))?\??)\n\n>\s*(?:`optional`\s*)?\*\*\w+\*\*:\s*([^\n]+)\n\n/g;

/**
 * Regex pattern for matching readonly property with default value.
 * Matches TypeDoc format for const object properties:
 * - `### propName\n\n> \`readonly\` **propName**: \`type\` = \`defaultValue\`\n\n`
 * - `### propName()\n\n> \`readonly\` **propName**: (params) => type\n\n`
 * Captures: (1) heading, (2) propName, (3) type after colon (everything before optional = defaultValue)
 * Note: Uses negative lookahead to avoid matching => as assignment
 */
export const READONLY_PROPERTY_REGEX =
    /(###+\s+(\w+)(?:\(\))?)\n\n>\s*`readonly`\s*\*\*\w+\*\*:\s*((?:[^=\n]|=>)+?)(?:\s*=\s+`[^`]+`)?\n\n/g;

/**
 * Regex pattern for matching Returns section with type before description.
 * Matches: `## Returns\n\ntype (single line)\n\ndescription\n\n`.
 */
export const RETURNS_TYPE_FIRST_REGEX =
    /(##+\s+Returns)\n\n([^\n]+)\n\n([^\n]+)\n\n(?!###)/g;

/**
 * Regex pattern for matching Returns section with description before type (blockquote).
 * Matches: `## Returns\n\ndescription (possibly multi-line)\n\n> type\n\n`.
 */
export const RETURNS_DESCRIPTION_FIRST_REGEX =
    /(##+\s+Returns)\n\n([^\n]+(?:\n[^\n]+)*?)\n\n(>\s*)([^\n]+)\n\n(?!###)/g;

/**
 * Regex pattern for matching nested Parameters and Returns subsections after Returns.
 */
export const RETURNS_NESTED_SUBSECTIONS_REGEX =
    /(##+\s+Returns:?[^\n]*\n\n[\s\S]*?\n\n)(###+\s+Parameters[\s\S]*?)(###+\s+Returns[\s\S]*?)(?=\n##|\n##\s+Since|\n##\s+Example|$)/g;

/**
 * Regex pattern for matching simple Returns section with type only.
 * Matches: `## Returns\n\ntype\n\n` or `## Returns\n\n> type\n\n`.
 */
export const RETURNS_SIMPLE_TYPE_REGEX =
    /(##+\s+Returns)\n\n(>?\s*)([^\n]+)\n\n(?!###)/g;

/**
 * Regex pattern for matching Throws section.
 */
export const THROWS_SECTION_REGEX =
    /(?:^|\n)(##+\s+Throws)\n\n([\s\S]*?)(?=\n##+\s|\n###+\s|$)/m;

/**
 * Regex pattern for matching See section (## or ###).
 * Note: Using (?=\n##+\s|\n*$) to match next header OR end of string (not end of line).
 */
export const SEE_SECTION_REGEX =
    /(?:^|\n)(##+\s+See)\n\n([\s\S]*?)(?=\n##+\s|\n*$)/;

/**
 * Regex pattern for matching Deprecated section (## or ###).
 * Note: Using (?=\n##+\s|\n*$) to match next header OR end of string (not end of line).
 */
export const DEPRECATED_SECTION_REGEX =
    /(?:^|\n)(##+\s+Deprecated)\n\n([\s\S]*?)(?=\n##+\s|\n*$)/;

/**
 * Regex pattern for matching Internal section (## or ###).
 * Note: Using (?=\n##+\s|\n*$) to match next header OR end of string (not end of line).
 */
export const INTERNAL_SECTION_REGEX =
    /(?:^|\n)(##+\s+Internal)\n\n([\s\S]*?)(?=\n##+\s|\n*$)/;

/**
 * Regex pattern for matching Default section (## or ###).
 * Note: Using (?=\n##+\s|\n*$) to match next header OR end of string (not end of line).
 */
export const DEFAULT_SECTION_REGEX =
    /(?:^|\n)(##+\s+Default)\n\n([\s\S]*?)(?=\n##+\s|\n*$)/;

/**
 * Regex pattern for matching Info section (## or ###).
 * Note: Using (?=\n##+\s|\n*$) to match next header OR end of string (not end of line).
 */
export const INFO_SECTION_REGEX =
    /(?:^|\n)(##+\s+Info)\n\n([\s\S]*?)(?=\n##+\s|\n*$)/;

/**
 * Regex pattern for matching Note section (## or ###).
 * Note: Using (?=\n##+\s|\n*$) to match next header OR end of string (not end of line).
 */
export const NOTE_SECTION_REGEX =
    /(?:^|\n)(##+\s+Note)\n\n([\s\S]*?)(?=\n##+\s|\n*$)/;

/**
 * Regex pattern for matching Alert section (## or ###).
 * Note: Using (?=\n##+\s|\n*$) to match next header OR end of string (not end of line).
 */
export const ALERT_SECTION_REGEX =
    /(?:^|\n)(##+\s+Alert)\n\n([\s\S]*?)(?=\n##+\s|\n*$)/;

/**
 * Regex pattern for matching Tip section (## or ###).
 * Note: Using (?=\n##+\s|\n*$) to match next header OR end of string (not end of line).
 */
export const TIP_SECTION_REGEX =
    /(?:^|\n)(##+\s+Tip)\n\n([\s\S]*?)(?=\n##+\s|\n*$)/;

/**
 * Regex pattern for removing navigation links at the top of markdown files.
 */
export const NAVIGATION_LINKS_REGEX = /^\[.*?\]\(.*?README\.md\).*$/gm;

/**
 * Regex pattern for removing separator lines (***).
 */
export const SEPARATOR_LINES_REGEX = /^\*\*\*$/gm;

/**
 * Regex pattern for removing pithos links.
 */
export const PITHOS_LINKS_REGEX = /^\[pithos\].*$/gm;

/**
 * Regex pattern for removing "Defined in:" lines.
 */
export const DEFINED_IN_REGEX = /^Defined in:.*$/gm;

/**
 * Regex pattern for cleaning up multiple blank lines.
 * Replaces 3+ consecutive newlines with 2 newlines.
 */
export const MULTIPLE_BLANK_LINES_REGEX = /\n{3,}/g;
