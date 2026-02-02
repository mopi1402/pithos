import { describe, it, expect } from "vitest";
import { cleanMarkdown, removeThrowsAndSeeSections } from "./markdown-cleaners.js";

describe("cleanMarkdown", () => {
    it("should remove navigation links", () => {
        const input = `[**pithos v1.1.0**](../README.md)

***

# Function: test`;
        const result = cleanMarkdown(input);
        expect(result).not.toContain("[**pithos");
        expect(result).not.toContain("***");
    });

    it("should remove 'Defined in:' lines", () => {
        const input = `# Function: test

Defined in: src/test.ts

## Description`;
        const result = cleanMarkdown(input);
        expect(result).not.toContain("Defined in:");
    });

    it("should clean up multiple blank lines", () => {
        const input = `# Title



## Section`;
        const result = cleanMarkdown(input);
        expect(result).not.toMatch(/\n{3,}/);
    });
});

describe("removeThrowsAndSeeSections", () => {
    it("should remove all special sections", () => {
        const input = `## Parameters

### param

Description

## Throws

Error message

### See

- [link](./link.md)

### Deprecated

Use new function

### Internal

Internal note

### Default

Default value

## Returns

Description`;
        const result = removeThrowsAndSeeSections(input);
        expect(result).not.toContain("## Throws");
        expect(result).not.toContain("### See");
        expect(result).not.toContain("### Deprecated");
        expect(result).not.toContain("### Internal");
        expect(result).not.toContain("### Default");
        expect(result).toContain("## Parameters");
        expect(result).toContain("## Returns");
    });

    it("should clean up multiple blank lines", () => {
        const input = `## Section 1



## Section 2`;
        const result = removeThrowsAndSeeSections(input);
        expect(result).not.toMatch(/\n{3,}/);
    });
});
