// scripts/doc-formatters/overload-merger.ts
// Merges multiple TypeDoc "Call Signature" sections into a single clean page.

/** Number of signatures shown before collapsing the rest into <details>. */
const VISIBLE_SIGNATURES = 4;

interface ParsedSignature {
    blockquote: string;       // The `> **fn**<...>(...)` line
    description: string;      // First paragraph after blockquote
    typeParams: string;       // ### Type Parameters content
    parameters: string;       // ### Parameters content
    returns: string;          // ### Returns content
    sections: Map<string, string>; // Other sections: Since, Note, Example, Performance, etc.
}

/**
 * Detects if content has multiple Call Signatures and merges them.
 * Returns the original content unchanged if there are 0 or 1 signatures.
 */
export function mergeOverloadSignatures(content: string): string {
    const signatureBlocks = splitCallSignatures(content);
    if (signatureBlocks.length < 2) return content;

    // Keep everything before the first ## Call Signature as-is
    const firstSigIndex = content.indexOf("## Call Signature");
    const preamble = content.slice(0, firstSigIndex).trimEnd();

    const parsed = signatureBlocks.map(parseSignature);

    // Build merged content
    const parts: string[] = [];

    // Preamble (title, nav links — will be cleaned by cleanMarkdown later)
    parts.push(preamble);
    parts.push("");

    // All signature blockquotes grouped together
    if (parsed.length <= VISIBLE_SIGNATURES) {
        for (let i = 0; i < parsed.length; i++) {
            parts.push(parsed[i].blockquote);
            if (i < parsed.length - 1) parts.push("");
        }
    } else {
        // Show first N, collapse the rest
        for (let i = 0; i < VISIBLE_SIGNATURES; i++) {
            parts.push(parsed[i].blockquote);
            parts.push("");
        }
        const remaining = parsed.length - VISIBLE_SIGNATURES;
        parts.push(`<details>`);
        parts.push(`<summary>Show ${remaining} more signature${remaining > 1 ? "s" : ""}</summary>`);
        parts.push("");
        for (let i = VISIBLE_SIGNATURES; i < parsed.length; i++) {
            parts.push(parsed[i].blockquote);
            if (i < parsed.length - 1) parts.push("");
        }
        parts.push("");
        parts.push(`</details>`);
    }
    parts.push("");

    // Description (from first signature, they're usually identical)
    if (parsed[0].description) {
        parts.push(parsed[0].description + "\n");
    }

    // Merged Type Parameters
    const mergedTypeParams = mergeTypeParameters(parsed);
    if (mergedTypeParams) {
        parts.push("## Type Parameters\n");
        parts.push(mergedTypeParams + "\n");
    }

    // Merged Parameters
    const mergedParams = mergeParameters(parsed);
    if (mergedParams) {
        parts.push("## Parameters\n");
        parts.push(mergedParams + "\n");
    }

    // Returns (from first signature that has one)
    const returns = parsed.find(p => p.returns)?.returns;
    if (returns) {
        parts.push("## Returns\n");
        parts.push(returns + "\n");
    }

    // Deduplicated other sections (Since, Note, Example, Performance, etc.)
    const seenSections = new Set<string>();
    for (const sig of parsed) {
        for (const [heading, body] of sig.sections) {
            if (!seenSections.has(heading)) {
                seenSections.add(heading);
                parts.push(`## ${heading}\n`);
                parts.push(body + "\n");
            }
        }
    }

    return parts.join("\n");
}

/**
 * Splits content into individual Call Signature blocks.
 */
function splitCallSignatures(content: string): string[] {
    const parts = content.split(/\n## Call Signature\n/);
    // First part is the preamble (title etc.), rest are signatures
    if (parts.length < 2) return [];
    return parts.slice(1);
}

/**
 * Parses a single Call Signature block into structured data.
 */
function parseSignature(block: string): ParsedSignature {
    const lines = block.split("\n");

    // Extract blockquote (first line starting with >)
    let blockquote = "";
    let descStart = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("> ")) {
            blockquote = lines[i];
            descStart = i + 1;
            break;
        }
    }

    // Extract description (text between blockquote and first ### heading)
    const descLines: string[] = [];
    let cursor = descStart;
    for (; cursor < lines.length; cursor++) {
        if (lines[cursor].startsWith("### ")) break;
        if (lines[cursor].trim()) descLines.push(lines[cursor]);
    }
    const description = descLines.join("\n").trim();

    // Parse remaining ### sections
    let typeParams = "";
    let parameters = "";
    let returns = "";
    const sections = new Map<string, string>();

    const sectionRegex = /^### (.+)$/;
    let currentSection = "";
    let currentBody: string[] = [];

    const flushSection = () => {
        if (!currentSection) return;
        const body = currentBody.join("\n").trim();
        if (currentSection === "Type Parameters") {
            typeParams = body;
        } else if (currentSection === "Parameters") {
            parameters = body;
        } else if (currentSection.startsWith("Returns")) {
            returns = body;
        } else {
            sections.set(currentSection, body);
        }
        currentBody = [];
    };

    for (; cursor < lines.length; cursor++) {
        const match = lines[cursor].match(sectionRegex);
        if (match) {
            flushSection();
            currentSection = match[1];
        } else {
            currentBody.push(lines[cursor]);
        }
    }
    flushSection();

    return { blockquote, description, typeParams, parameters, returns, sections };
}

/**
 * Merges type parameters from all signatures, deduplicating by name.
 */
function mergeTypeParameters(parsed: ParsedSignature[]): string {
    const seen = new Map<string, string>();

    for (const sig of parsed) {
        if (!sig.typeParams) continue;
        // Split by #### headings
        const params = sig.typeParams.split(/(?=^#### )/m);
        for (const param of params) {
            const nameMatch = param.match(/^#### (\w+)/);
            if (nameMatch && !seen.has(nameMatch[1])) {
                seen.set(nameMatch[1], param.trim());
            }
        }
    }

    return Array.from(seen.values()).join("\n\n");
}

/**
 * Merges parameters from all signatures.
 * If parameters differ between overloads, shows each variant.
 */
function mergeParameters(parsed: ParsedSignature[]): string {
    // Collect unique parameter blocks
    const uniqueParams: string[] = [];
    const seen = new Set<string>();

    for (const sig of parsed) {
        if (!sig.parameters) continue;
        // Normalize whitespace for comparison
        const normalized = sig.parameters.replace(/\s+/g, " ").trim();
        if (!seen.has(normalized)) {
            seen.add(normalized);
            uniqueParams.push(sig.parameters);
        }
    }

    if (uniqueParams.length === 0) return "";
    if (uniqueParams.length === 1) return uniqueParams[0];

    // Multiple different parameter sets — show as overload variants
    if (uniqueParams.length <= VISIBLE_SIGNATURES) {
        const parts: string[] = [];
        for (let i = 0; i < uniqueParams.length; i++) {
            parts.push(`**Overload ${i + 1}:**\n\n${uniqueParams[i]}`);
        }
        return parts.join("\n\n");
    }

    // Many overloads — show first N, collapse the rest
    const parts: string[] = [];
    for (let i = 0; i < VISIBLE_SIGNATURES; i++) {
        parts.push(`**Overload ${i + 1}:**\n\n${uniqueParams[i]}`);
    }
    const remaining = uniqueParams.length - VISIBLE_SIGNATURES;
    parts.push(`<details>`);
    parts.push(`<summary>Show ${remaining} more overload${remaining > 1 ? "s" : ""}</summary>`);
    parts.push("");
    for (let i = VISIBLE_SIGNATURES; i < uniqueParams.length; i++) {
        parts.push(`**Overload ${i + 1}:**\n\n${uniqueParams[i]}`);
    }
    parts.push("");
    parts.push(`</details>`);
    return parts.join("\n\n");
}
