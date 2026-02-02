import { describe, it, expect } from "vitest";
import {
    extractThrowsSection,
    extractSeeSection,
    extractDeprecatedSection,
    extractInternalSection,
    extractDefaultSection,
    extractInfoSection,
    extractNoteSection,
    extractAlertSection,
    extractTipSection
} from "./section-extractors.js";

describe("extractThrowsSection", () => {
    it("should extract Throws section", () => {
        const input = `## Parameters

### param

Description

## Throws

Rejects if any of the input promises reject.

## Since`;
        const result = extractThrowsSection(input);
        expect(result).toBe(
            "\n## Throws\n\nRejects if any of the input promises reject.\n"
        );
    });

    it("should return null if Throws section not found", () => {
        const input = `## Parameters

### param

Description`;
        const result = extractThrowsSection(input);
        expect(result).toBeNull();
    });
});

describe("extractSeeSection", () => {
    it("should extract See section", () => {
        const input = `## Returns

Description

### See

- [relatedFunction](./related.md)
- [anotherFunction](./another.md)

## Since`;
        const result = extractSeeSection(input);
        expect(result).toContain("See Also");
        expect(result).toContain("relatedFunction");
    });

    it("should return null if See section not found", () => {
        const input = `## Returns

Description`;
        const result = extractSeeSection(input);
        expect(result).toBeNull();
    });
});

describe("extractDeprecatedSection", () => {
    it("should extract Deprecated section", () => {
        const input = `## Returns

Description

### Deprecated

Use \`newFunction()\` instead.

## Since`;
        const result = extractDeprecatedSection(input);
        expect(result).toBe("\n:::warning DEPRECATED\n\nUse `newFunction()` instead.\n\n:::\n");
    });

    it("should extract multi-line Deprecated section with formatted Reason", () => {
        const input = `## Returns

Description

## Deprecated

Use \`array.at(index)\` directly instead.
Reason: Native function is more efficient

## See`;
        const result = extractDeprecatedSection(input);
        expect(result).toBe("\n:::warning DEPRECATED\n\nUse `array.at(index)` directly instead.\n\n> **Reason**:<br/>\n> Native function is more efficient\n\n:::\n");
    });

    it("should return null if Deprecated section not found", () => {
        const input = `## Returns

Description`;
        const result = extractDeprecatedSection(input);
        expect(result).toBeNull();
    });
});

describe("extractInternalSection", () => {
    it("should extract Internal section", () => {
        const input = `## Returns

Description

### Internal

This is an internal API.

## Since`;
        const result = extractInternalSection(input);
        expect(result).toBe("\n## Internal\n\nThis is an internal API.\n");
    });

    it("should return null if Internal section not found", () => {
        const input = `## Returns

Description`;
        const result = extractInternalSection(input);
        expect(result).toBeNull();
    });
});

describe("extractDefaultSection", () => {
    it("should extract Default section", () => {
        const input = `## Parameters

### param

Description

### Default

\`value\`

## Returns`;
        const result = extractDefaultSection(input);
        expect(result).toContain("Default Value");
        expect(result).toContain("value");
    });

    it("should return null if Default section not found", () => {
        const input = `## Parameters

### param

Description`;
        const result = extractDefaultSection(input);
        expect(result).toBeNull();
    });
});

describe("extractInfoSection", () => {
    it("should extract Info section as admonition", () => {
        const input = `## Returns

Description

## Info

This is an informational note about the function.

## Since`;
        const result = extractInfoSection(input);
        expect(result).toBe("\n:::info\n\nThis is an informational note about the function.\n\n:::\n");
    });

    it("should extract multi-line Info section", () => {
        const input = `## Returns

Description

## Info

First line of info.
Second line of info.

## Since`;
        const result = extractInfoSection(input);
        expect(result).toBe("\n:::info\n\nFirst line of info.\nSecond line of info.\n\n:::\n");
    });

    it("should extract custom title from first 1-5 words before colon", () => {
        const input = `## Returns

Description

## Info

Why wrapping native: We prefer to wrap this method to ensure Immutability.

## Since`;
        const result = extractInfoSection(input);
        expect(result).toBe("\n:::info[WHY WRAPPING NATIVE]\n\nWe prefer to wrap this method to ensure Immutability.\n\n:::\n");
    });

    it("should extract custom title with single word", () => {
        const input = `## Returns

Description

## Info

Note: This function is experimental.

## Since`;
        const result = extractInfoSection(input);
        expect(result).toBe("\n:::info[NOTE]\n\nThis function is experimental.\n\n:::\n");
    });

    it("should not treat colon after more than 5 words as title", () => {
        const input = `## Returns

Description

## Info

This is a very long sentence that has: a colon in it.

## Since`;
        const result = extractInfoSection(input);
        expect(result).toBe("\n:::info\n\nThis is a very long sentence that has: a colon in it.\n\n:::\n");
    });

    it("should return null if Info section not found", () => {
        const input = `## Returns

Description`;
        const result = extractInfoSection(input);
        expect(result).toBeNull();
    });
});

describe("extractNoteSection", () => {
    it("should extract Note section as admonition", () => {
        const input = `## Returns

Description

## Note

This is a note about the function.

## Since`;
        const result = extractNoteSection(input);
        expect(result).toBe("\n:::note\n\nThis is a note about the function.\n\n:::\n");
    });

    it("should extract custom title from first 1-5 words before colon", () => {
        const input = `## Returns

Description

## Note

Performance tip: Use memoization for expensive computations.

## Since`;
        const result = extractNoteSection(input);
        expect(result).toBe("\n:::note[PERFORMANCE TIP]\n\nUse memoization for expensive computations.\n\n:::\n");
    });

    it("should extract custom title with single word", () => {
        const input = `## Returns

Description

## Note

Warning: This may throw an error.

## Since`;
        const result = extractNoteSection(input);
        expect(result).toBe("\n:::note[WARNING]\n\nThis may throw an error.\n\n:::\n");
    });

    it("should not treat colon after more than 5 words as title", () => {
        const input = `## Returns

Description

## Note

This is a very long sentence that has: a colon in it.

## Since`;
        const result = extractNoteSection(input);
        expect(result).toBe("\n:::note\n\nThis is a very long sentence that has: a colon in it.\n\n:::\n");
    });

    it("should return null if Note section not found", () => {
        const input = `## Returns

Description`;
        const result = extractNoteSection(input);
        expect(result).toBeNull();
    });
});

describe("extractAlertSection", () => {
    it("should extract Alert section as danger admonition", () => {
        const input = `## Returns

Description

## Alert

This function has breaking changes!

## Since`;
        const result = extractAlertSection(input);
        expect(result).toBe("\n:::danger\n\nThis function has breaking changes!\n\n:::\n");
    });

    it("should extract custom title from first 1-5 words before colon", () => {
        const input = `## Returns

Description

## Alert

Breaking change: The API signature has changed.

## Since`;
        const result = extractAlertSection(input);
        expect(result).toBe("\n:::danger[BREAKING CHANGE]\n\nThe API signature has changed.\n\n:::\n");
    });

    it("should return null if Alert section not found", () => {
        const input = `## Returns

Description`;
        const result = extractAlertSection(input);
        expect(result).toBeNull();
    });
});

describe("extractTipSection", () => {
    it("should extract Tip section as tip admonition", () => {
        const input = `## Returns

Description

## Tip

Use this function for better performance.

## Since`;
        const result = extractTipSection(input);
        expect(result).toBe("\n:::tip\n\nUse this function for better performance.\n\n:::\n");
    });

    it("should extract custom title from first 1-5 words before colon", () => {
        const input = `## Returns

Description

## Tip

Pro tip: Combine with memoization for best results.

## Since`;
        const result = extractTipSection(input);
        expect(result).toBe("\n:::tip[PRO TIP]\n\nCombine with memoization for best results.\n\n:::\n");
    });

    it("should return null if Tip section not found", () => {
        const input = `## Returns

Description`;
        const result = extractTipSection(input);
        expect(result).toBeNull();
    });
});
