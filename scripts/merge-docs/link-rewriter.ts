// scripts/merge-docs/link-rewriter.ts
// Link rewriting utilities for fixing broken documentation links

import * as path from "node:path";

/**
 * Extracts the target file name from a link path.
 * 
 * @param linkPath - The path from a markdown link (e.g., "../../base/interfaces/Schema.md")
 * @returns The file name without extension (e.g., "Schema")
 * 
 * @example
 * extractTargetFileName("../../base/interfaces/Schema.md") // "Schema"
 * extractTargetFileName("./Schema.md") // "Schema"
 * extractTargetFileName("Schema.md") // "Schema"
 */
export function extractTargetFileName(linkPath: string): string {
    // Get the basename (last part of the path)
    const basename = path.basename(linkPath);
    // Remove the .md extension
    return basename.replace(/\.md$/, "");
}

/**
 * Computes the relative path from a source directory to a target file.
 * 
 * @param fromDir - The source directory (where the link is located)
 * @param toFile - The full path to the target file
 * @returns The relative path from fromDir to toFile
 * 
 * @example
 * computeRelativePath("/docs/api/array", "/docs/api/array/Schema.md") // "./Schema.md"
 * computeRelativePath("/docs/api/array", "/docs/api/object/pick.md") // "../object/pick.md"
 * computeRelativePath("/docs/api/array", "/docs/api/array/first.md") // "./first.md"
 */
export function computeRelativePath(fromDir: string, toFile: string): string {
    // Normalize paths to handle different separators
    const normalizedFromDir = path.normalize(fromDir);
    const normalizedToFile = path.normalize(toFile);
    
    // Get the directory of the target file
    const toDir = path.dirname(normalizedToFile);
    const toFileName = path.basename(normalizedToFile);
    
    // If source and target are in the same directory, use ./
    if (normalizedFromDir === toDir) {
        return `./${toFileName}`;
    }
    
    // Compute relative path between directories
    const relativePath = path.relative(normalizedFromDir, toDir);
    
    // Join with the filename
    return path.join(relativePath, toFileName);
}

import type { CollectedDocItem } from "./types.js";

/**
 * Finds the output path for a target file in the collected items.
 * Searches by file name (case-insensitive) within the same module first,
 * then in related modules (same parent module), then across all modules.
 * 
 * @param targetName - The name of the target file (without extension)
 * @param moduleKey - The current module key (e.g., "kanon/v2")
 * @param collectedItems - Map of collected documentation items
 * @returns The full output path (outputDir + filename.md) or null if not found
 * 
 * @example
 * findTargetOutputPath("Schema", "kanon/v3", collectedItems) // "/docs/api/kanon/Schema.md"
 */
export function findTargetOutputPath(
    targetName: string,
    moduleKey: string,
    collectedItems: Map<string, CollectedDocItem>
): string | null {
    const targetNameLower = targetName.toLowerCase();
    
    // Extract the parent module (e.g., "kanon" from "kanon/v2")
    const parentModule = moduleKey.split("/")[0];
    
    // First, try to find within the same module
    for (const [_key, item] of collectedItems) {
        // Check if this item is in the same module
        if (item.moduleKey === moduleKey) {
            const itemFileName = path.basename(item.filePath, ".md").toLowerCase();
            if (itemFileName === targetNameLower) {
                // Return the full output path
                return path.join(item.outputDir, `${path.basename(item.filePath, ".md")}.md`);
            }
        }
    }
    
    // Second, try to find in related modules (same parent module, e.g., kanon/v1, kanon/v2, kanon/v3)
    for (const [_key, item] of collectedItems) {
        if (item.moduleKey.startsWith(parentModule + "/") && item.moduleKey !== moduleKey) {
            const itemFileName = path.basename(item.filePath, ".md").toLowerCase();
            if (itemFileName === targetNameLower) {
                // Return the full output path
                return path.join(item.outputDir, `${path.basename(item.filePath, ".md")}.md`);
            }
        }
    }
    
    // Third, search across all modules
    for (const [_key, item] of collectedItems) {
        const itemFileName = path.basename(item.filePath, ".md").toLowerCase();
        if (itemFileName === targetNameLower) {
            // Return the full output path
            return path.join(item.outputDir, `${path.basename(item.filePath, ".md")}.md`);
        }
    }
    
    // Not found
    return null;
}


/**
 * Regex pattern to match markdown links: [text](path)
 * Captures: [1] = link text, [2] = link path
 */
const MARKDOWN_LINK_REGEX = /\[([^\]]*)\]\(([^)]+)\)/g;

/**
 * Checks if a link is external (http/https) or special (anchor-only, non-md).
 * 
 * @param linkPath - The path from a markdown link
 * @returns true if the link should be left unchanged
 */
function isExternalOrSpecialLink(linkPath: string): boolean {
    // External links (http:// or https://)
    if (linkPath.startsWith("http://") || linkPath.startsWith("https://")) {
        return true;
    }
    
    // Anchor-only links (start with #)
    if (linkPath.startsWith("#")) {
        return true;
    }
    
    // Non-markdown files (don't end with .md and don't contain .md#)
    // This allows links like "file.md#anchor" to be processed
    if (!linkPath.endsWith(".md") && !linkPath.includes(".md#")) {
        return true;
    }
    
    return false;
}

/**
 * Extracts the anchor part from a link path.
 * 
 * @param linkPath - The path from a markdown link (e.g., "../../base/interfaces/Schema.md#type")
 * @returns The anchor part including # (e.g., "#type") or empty string if no anchor
 */
function extractAnchor(linkPath: string): string {
    const hashIndex = linkPath.indexOf("#");
    if (hashIndex === -1) {
        return "";
    }
    return linkPath.slice(hashIndex);
}

/**
 * Removes the anchor part from a link path.
 * 
 * @param linkPath - The path from a markdown link (e.g., "../../base/interfaces/Schema.md#type")
 * @returns The path without anchor (e.g., "../../base/interfaces/Schema.md")
 */
function removeAnchor(linkPath: string): string {
    const hashIndex = linkPath.indexOf("#");
    if (hashIndex === -1) {
        return linkPath;
    }
    return linkPath.slice(0, hashIndex);
}

/**
 * Tracks unresolved links during processing.
 * Key: linkPath, Value: { targetName, resolved }
 */
export type UnresolvedLinks = Map<string, { targetName: string; resolved: boolean }>;

/**
 * Creates a new unresolved links tracker.
 */
export function createUnresolvedLinksTracker(): UnresolvedLinks {
    return new Map();
}

/**
 * Marks a link as resolved in the tracker.
 */
export function markLinkResolved(tracker: UnresolvedLinks, targetName: string): void {
    for (const [_key, value] of tracker) {
        if (value.targetName.toLowerCase() === targetName.toLowerCase()) {
            value.resolved = true;
        }
    }
}

/**
 * Logs any unresolved links that weren't fixed later.
 */
export function logUnresolvedLinks(tracker: UnresolvedLinks): void {
    for (const [linkPath, { targetName, resolved }] of tracker) {
        if (!resolved) {
            console.warn(`  ⚠️  Link target not found: ${linkPath} (looking for "${targetName}")`);
        }
    }
}

/**
 * Rewrites internal markdown links to match the flattened output structure.
 * 
 * @param content - The markdown content to process
 * @param currentOutputDir - The output directory of the current file
 * @param moduleKey - The module key of the current file (e.g., "kanon/v3")
 * @param collectedItems - Map of collected documentation items
 * @param unresolvedTracker - Optional tracker for unresolved links (deferred warning)
 * @returns The content with rewritten links
 * 
 * @example
 * // Given a link [Schema](../../base/interfaces/Schema.md) in a file at /docs/api/array/
 * // If Schema.md is flattened to /docs/api/kanon/Schema.md
 * // The link will be rewritten to [Schema](../kanon/Schema.md)
 */
export function rewriteInternalLinks(
    content: string,
    currentOutputDir: string,
    moduleKey: string,
    collectedItems: Map<string, CollectedDocItem>,
    unresolvedTracker?: UnresolvedLinks
): string {
    return content.replace(MARKDOWN_LINK_REGEX, (fullMatch, linkText, linkPath) => {
        // Skip external and special links
        if (isExternalOrSpecialLink(linkPath)) {
            return fullMatch;
        }
        
        // Extract anchor if present (e.g., "#type" from "file.md#type")
        const anchor = extractAnchor(linkPath);
        const pathWithoutAnchor = removeAnchor(linkPath);
        
        // Extract the target file name from the link path
        const targetName = extractTargetFileName(pathWithoutAnchor);
        
        // Find the target's output path in collected items
        const targetOutputPath = findTargetOutputPath(targetName, moduleKey, collectedItems);
        
        if (targetOutputPath === null) {
            // Track unresolved link (will be logged later if not resolved)
            if (unresolvedTracker) {
                unresolvedTracker.set(linkPath, { targetName, resolved: false });
            } else {
                // No tracker = immediate warning (for backwards compat in tests)
                console.warn(`  ⚠️  Link target not found: ${linkPath} (looking for "${targetName}")`);
            }
            return fullMatch;
        }
        
        // Compute the relative path from current output dir to target
        const newPath = computeRelativePath(currentOutputDir, targetOutputPath);
        
        // Return the rewritten link, preserving the link text and anchor
        return `[${linkText}](${newPath}${anchor})`;
    });
}
