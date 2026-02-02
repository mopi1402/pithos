// scripts/merge-docs/link-rewriter.test.ts
// Unit tests for link rewriting utilities

import { describe, it, expect } from "vitest";
import { extractTargetFileName, computeRelativePath } from "./link-rewriter.js";

describe("extractTargetFileName", () => {
    it("should extract filename from nested relative path", () => {
        expect(extractTargetFileName("../../base/interfaces/Schema.md")).toBe("Schema");
    });

    it("should extract filename from type-aliases path", () => {
        expect(extractTargetFileName("../../base/type-aliases/GenericSchema.md")).toBe("GenericSchema");
    });

    it("should extract filename from functions path", () => {
        expect(extractTargetFileName("../../first/functions/first.md")).toBe("first");
    });

    it("should extract filename from simple relative path", () => {
        expect(extractTargetFileName("./Schema.md")).toBe("Schema");
    });

    it("should extract filename from bare filename", () => {
        expect(extractTargetFileName("Schema.md")).toBe("Schema");
    });

    it("should handle deeply nested paths", () => {
        expect(extractTargetFileName("../../../modules/array/base/interfaces/ArraySchema.md")).toBe("ArraySchema");
    });

    it("should handle paths with parent directory references", () => {
        expect(extractTargetFileName("../sibling/file.md")).toBe("file");
    });
});

describe("computeRelativePath", () => {
    it("should return ./ prefix for files in the same directory", () => {
        const result = computeRelativePath("/docs/api/array", "/docs/api/array/Schema.md");
        expect(result).toBe("./Schema.md");
    });

    it("should compute relative path to sibling directory", () => {
        const result = computeRelativePath("/docs/api/array", "/docs/api/object/pick.md");
        expect(result).toBe("../object/pick.md");
    });

    it("should compute relative path to parent directory", () => {
        const result = computeRelativePath("/docs/api/array/base", "/docs/api/array/Schema.md");
        expect(result).toBe("../Schema.md");
    });

    it("should compute relative path to nested child directory", () => {
        const result = computeRelativePath("/docs/api", "/docs/api/array/base/Schema.md");
        expect(result).toBe("array/base/Schema.md");
    });

    it("should handle paths with multiple levels of difference", () => {
        const result = computeRelativePath("/docs/api/array/base/interfaces", "/docs/api/object/types/ObjectType.md");
        expect(result).toBe("../../../object/types/ObjectType.md");
    });

    it("should handle same file in same directory", () => {
        const result = computeRelativePath("/docs/api/array", "/docs/api/array/first.md");
        expect(result).toBe("./first.md");
    });
});


import { test, fc } from "@fast-check/vitest";
import { findTargetOutputPath, rewriteInternalLinks } from "./link-rewriter.js";
import type { CollectedDocItem } from "./types.js";

describe("findTargetOutputPath", () => {
    it("should find target in the same module", () => {
        const collectedItems = new Map<string, CollectedDocItem>([
            ["kanon/Schema", {
                filePath: "/src/kanon/base/interfaces/Schema.md",
                outputDir: "/docs/api/kanon",
                moduleKey: "kanon/v3",
                depth: 2
            }]
        ]);
        
        const result = findTargetOutputPath("Schema", "kanon/v3", collectedItems);
        expect(result).toBe("/docs/api/kanon/Schema.md");
    });

    it("should find target case-insensitively", () => {
        const collectedItems = new Map<string, CollectedDocItem>([
            ["kanon/schema", {
                filePath: "/src/kanon/base/interfaces/schema.md",
                outputDir: "/docs/api/kanon",
                moduleKey: "kanon/v3",
                depth: 2
            }]
        ]);
        
        const result = findTargetOutputPath("Schema", "kanon/v3", collectedItems);
        expect(result).toBe("/docs/api/kanon/schema.md");
    });

    it("should return null when target not found", () => {
        const collectedItems = new Map<string, CollectedDocItem>();
        
        const result = findTargetOutputPath("NonExistent", "kanon/v3", collectedItems);
        expect(result).toBeNull();
    });

    it("should search across modules if not found in current module", () => {
        const collectedItems = new Map<string, CollectedDocItem>([
            ["arkhe/Result", {
                filePath: "/src/arkhe/Result.md",
                outputDir: "/docs/api/arkhe",
                moduleKey: "arkhe",
                depth: 1
            }]
        ]);
        
        const result = findTargetOutputPath("Result", "kanon/v3", collectedItems);
        expect(result).toBe("/docs/api/arkhe/Result.md");
    });
});

describe("rewriteInternalLinks", () => {
    it("should rewrite a simple internal link", () => {
        const collectedItems = new Map<string, CollectedDocItem>([
            ["kanon/Schema", {
                filePath: "/src/kanon/base/interfaces/Schema.md",
                outputDir: "/docs/api/kanon",
                moduleKey: "kanon/v3",
                depth: 2
            }]
        ]);
        
        const content = "See [Schema](../../base/interfaces/Schema.md) for details.";
        const result = rewriteInternalLinks(content, "/docs/api/kanon", "kanon/v3", collectedItems);
        
        expect(result).toBe("See [Schema](./Schema.md) for details.");
    });

    it("should preserve external links", () => {
        const collectedItems = new Map<string, CollectedDocItem>();
        
        const content = "See [Google](https://google.com) for more.";
        const result = rewriteInternalLinks(content, "/docs/api/kanon", "kanon/v3", collectedItems);
        
        expect(result).toBe("See [Google](https://google.com) for more.");
    });

    it("should preserve anchor links", () => {
        const collectedItems = new Map<string, CollectedDocItem>();
        
        const content = "See [Parameters](#parameters) below.";
        const result = rewriteInternalLinks(content, "/docs/api/kanon", "kanon/v3", collectedItems);
        
        expect(result).toBe("See [Parameters](#parameters) below.");
    });

    it("should preserve non-md links", () => {
        const collectedItems = new Map<string, CollectedDocItem>();
        
        const content = "See [image](./image.png) here.";
        const result = rewriteInternalLinks(content, "/docs/api/kanon", "kanon/v3", collectedItems);
        
        expect(result).toBe("See [image](./image.png) here.");
    });

    it("should handle multiple links on the same line", () => {
        const collectedItems = new Map<string, CollectedDocItem>([
            ["kanon/Schema", {
                filePath: "/src/kanon/Schema.md",
                outputDir: "/docs/api/kanon",
                moduleKey: "kanon/v3",
                depth: 1
            }],
            ["kanon/Validator", {
                filePath: "/src/kanon/Validator.md",
                outputDir: "/docs/api/kanon",
                moduleKey: "kanon/v3",
                depth: 1
            }]
        ]);
        
        const content = "See [Schema](../Schema.md) and [Validator](../Validator.md).";
        const result = rewriteInternalLinks(content, "/docs/api/kanon", "kanon/v3", collectedItems);
        
        expect(result).toBe("See [Schema](./Schema.md) and [Validator](./Validator.md).");
    });
});

/**
 * Property-Based Tests for Link Rewriter
 * 
 * Feature: fix-broken-doc-links
 */

// Arbitrary for generating valid file names (alphanumeric, no special chars)
const fileNameArb = fc.stringMatching(/^[A-Za-z][A-Za-z0-9]{0,19}$/);

// Arbitrary for generating markdown link text (non-empty, no brackets)
const linkTextArb = fc.stringMatching(/^[A-Za-z0-9 _-]{1,30}$/);

// Arbitrary for generating relative paths with .md extension
const relativePathArb = fc.tuple(
    fc.integer({ min: 0, max: 3 }),
    fc.array(fileNameArb, { minLength: 0, maxLength: 3 }),
    fileNameArb
).map(([parentLevels, dirs, fileName]) => {
    const parentPart = "../".repeat(parentLevels);
    const dirPart = dirs.length > 0 ? dirs.join("/") + "/" : "";
    return `${parentPart}${dirPart}${fileName}.md`;
});

/**
 * Property 1: Link Detection Completeness
 * 
 * For any markdown content containing relative links to .md files,
 * the Link_Rewriter SHALL detect all such links matching the pattern [text](path.md).
 * 
 * **Validates: Requirements 1.1**
 */
test.prop(
    [linkTextArb, relativePathArb],
    { numRuns: 100 }
)("Property 1: Link Detection Completeness - all markdown links to .md files are detected", (linkText, linkPath) => {
    // Create a collected item that matches the target
    const targetName = linkPath.split("/").pop()!.replace(".md", "");
    const collectedItems = new Map<string, CollectedDocItem>([
        [`test/${targetName}`, {
            filePath: `/src/test/${targetName}.md`,
            outputDir: "/docs/api/test",
            moduleKey: "test",
            depth: 1
        }]
    ]);
    
    // Create content with the link
    const content = `Some text [${linkText}](${linkPath}) more text.`;
    
    // Rewrite the links
    const result = rewriteInternalLinks(content, "/docs/api/test", "test", collectedItems);
    
    // The link should have been detected and rewritten (path changed to ./TargetName.md)
    // The link text should be preserved
    expect(result).toContain(`[${linkText}]`);
    
    // The original path should NOT be in the result (it was rewritten)
    // Unless the path was already ./TargetName.md
    if (linkPath !== `./${targetName}.md`) {
        expect(result).not.toContain(`(${linkPath})`);
    }
});


// Arbitrary for generating output directories
const outputDirArb = fc.tuple(
    fc.constant("/docs/api"),
    fc.array(fileNameArb, { minLength: 1, maxLength: 3 })
).map(([base, dirs]) => `${base}/${dirs.join("/")}`);

/**
 * Property 2: Link Rewriting Correctness
 * 
 * For any relative link pointing to a file that exists in the collected items,
 * the rewritten link SHALL resolve to the correct file in the flattened output structure.
 * - If source and target are in the same output directory, the link SHALL be ./FileName.md
 * - If source and target are in different directories, the link SHALL be the correct relative path
 * 
 * **Validates: Requirements 1.2, 1.3, 1.4**
 */
test.prop(
    [fileNameArb, outputDirArb, outputDirArb, linkTextArb],
    { numRuns: 100 }
)("Property 2: Link Rewriting Correctness - links resolve to correct flattened paths", (targetName, sourceDir, targetDir, linkText) => {
    // Create a collected item for the target
    const collectedItems = new Map<string, CollectedDocItem>([
        [`test/${targetName}`, {
            filePath: `/src/test/${targetName}.md`,
            outputDir: targetDir,
            moduleKey: "test",
            depth: 1
        }]
    ]);
    
    // Create content with a link to the target (using an arbitrary old path)
    const content = `[${linkText}](../../old/path/${targetName}.md)`;
    
    // Rewrite the links
    const result = rewriteInternalLinks(content, sourceDir, "test", collectedItems);
    
    // Extract the new path from the result
    const pathMatch = result.match(/\]\(([^)]+)\)/);
    expect(pathMatch).not.toBeNull();
    const newPath = pathMatch![1];
    
    // Verify the path is correct based on directory relationship
    if (sourceDir === targetDir) {
        // Same directory: should be ./FileName.md
        expect(newPath).toBe(`./${targetName}.md`);
    } else {
        // Different directories: should end with the target filename
        expect(newPath).toMatch(new RegExp(`${targetName}\\.md$`));
        // Should not contain the old path
        expect(newPath).not.toContain("old/path");
    }
});


/**
 * Property 3: Link Text Preservation
 * 
 * For any link that is rewritten, the link text (the part between [ and ]) SHALL remain unchanged.
 * 
 * **Validates: Requirements 2.4**
 */
test.prop(
    [linkTextArb, fileNameArb],
    { numRuns: 100 }
)("Property 3: Link Text Preservation - link text is never modified during rewriting", (linkText, targetName) => {
    // Create a collected item for the target
    const collectedItems = new Map<string, CollectedDocItem>([
        [`test/${targetName}`, {
            filePath: `/src/test/${targetName}.md`,
            outputDir: "/docs/api/test",
            moduleKey: "test",
            depth: 1
        }]
    ]);
    
    // Create content with a link using the specific link text
    const content = `Before [${linkText}](../../some/path/${targetName}.md) after`;
    
    // Rewrite the links
    const result = rewriteInternalLinks(content, "/docs/api/test", "test", collectedItems);
    
    // The link text should be preserved exactly
    expect(result).toContain(`[${linkText}]`);
    
    // Extract the link text from the result to verify it's unchanged
    const linkMatch = result.match(/\[([^\]]*)\]/);
    expect(linkMatch).not.toBeNull();
    expect(linkMatch![1]).toBe(linkText);
});


/**
 * Property 4: Multiple Links Handling
 * 
 * For any line containing multiple markdown links, all links SHALL be processed independently and correctly.
 * 
 * **Validates: Requirements 2.5**
 */
test.prop(
    [
        fc.array(fc.tuple(linkTextArb, fileNameArb), { minLength: 2, maxLength: 5 })
    ],
    { numRuns: 100 }
)("Property 4: Multiple Links Handling - all links on a line are processed independently", (linkPairs) => {
    // Create collected items for all targets
    const collectedItems = new Map<string, CollectedDocItem>();
    linkPairs.forEach(([_linkText, targetName], index) => {
        collectedItems.set(`test/${targetName}_${index}`, {
            filePath: `/src/test/${targetName}.md`,
            outputDir: "/docs/api/test",
            moduleKey: "test",
            depth: 1
        });
    });
    
    // Create content with multiple links on the same line
    const links = linkPairs.map(([linkText, targetName]) => 
        `[${linkText}](../../old/path/${targetName}.md)`
    );
    const content = `Text ${links.join(" and ")} end.`;
    
    // Rewrite the links
    const result = rewriteInternalLinks(content, "/docs/api/test", "test", collectedItems);
    
    // Each link text should be preserved
    linkPairs.forEach(([linkText, _targetName]) => {
        expect(result).toContain(`[${linkText}]`);
    });
    
    // Each link should have been rewritten (old path should not appear)
    linkPairs.forEach(([_linkText, targetName]) => {
        expect(result).not.toContain(`../../old/path/${targetName}.md`);
    });
    
    // Count the number of links in the result - should match input
    const linkMatches = result.match(/\[[^\]]*\]\([^)]+\)/g);
    expect(linkMatches).not.toBeNull();
    expect(linkMatches!.length).toBe(linkPairs.length);
});


/**
 * Property 5: Unknown Target Preservation
 * 
 * For any relative link whose target cannot be found in the collected items, the link SHALL remain unchanged.
 * 
 * **Validates: Requirements 1.5**
 */
test.prop(
    [linkTextArb, fileNameArb],
    { numRuns: 100 }
)("Property 5: Unknown Target Preservation - links to unknown targets are preserved unchanged", (linkText, targetName) => {
    // Create an EMPTY collected items map - no targets will be found
    const collectedItems = new Map<string, CollectedDocItem>();
    
    // Create content with a link to a non-existent target
    const originalPath = `../../unknown/path/${targetName}.md`;
    const content = `See [${linkText}](${originalPath}) for details.`;
    
    // Rewrite the links (should preserve since target not found)
    const result = rewriteInternalLinks(content, "/docs/api/test", "test", collectedItems);
    
    // The link should be completely unchanged
    expect(result).toBe(content);
    expect(result).toContain(`[${linkText}](${originalPath})`);
});


// Arbitrary for generating external URLs
const externalUrlArb = fc.oneof(
    fc.webUrl({ validSchemes: ["https"] }),
    fc.webUrl({ validSchemes: ["http"] })
);

// Arbitrary for generating anchor links
const anchorLinkArb = fc.stringMatching(/^#[a-z][a-z0-9-]{0,20}$/);

// Arbitrary for generating non-md file extensions
const nonMdExtensionArb = fc.constantFrom(".png", ".jpg", ".svg", ".json", ".ts", ".js", ".html", ".css");

/**
 * Property 6: External and Special Links Preservation
 * 
 * For any link that is external (starts with http:// or https://), an anchor link (starts with #),
 * or not a markdown file (doesn't end with .md), the link SHALL remain unchanged.
 * 
 * **Validates: Requirements 4.1, 4.2, 4.3**
 */
test.prop(
    [linkTextArb, fc.oneof(
        externalUrlArb,
        anchorLinkArb,
        fc.tuple(fileNameArb, nonMdExtensionArb).map(([name, ext]) => `./${name}${ext}`)
    )],
    { numRuns: 100 }
)("Property 6: External and Special Links Preservation - external, anchor, and non-md links are never modified", (linkText, specialPath) => {
    // Create some collected items (shouldn't matter for special links)
    const collectedItems = new Map<string, CollectedDocItem>([
        ["test/SomeFile", {
            filePath: "/src/test/SomeFile.md",
            outputDir: "/docs/api/test",
            moduleKey: "test",
            depth: 1
        }]
    ]);
    
    // Create content with a special link
    const content = `Check [${linkText}](${specialPath}) here.`;
    
    // Rewrite the links (should preserve special links)
    const result = rewriteInternalLinks(content, "/docs/api/test", "test", collectedItems);
    
    // The link should be completely unchanged
    expect(result).toBe(content);
    expect(result).toContain(`[${linkText}](${specialPath})`);
});
