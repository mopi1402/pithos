// scripts/common/fs-utils.ts
// Shared file system utilities

import * as fs from "node:fs";
import * as path from "node:path";
import { DOC_EXTENSION } from "./constants.js";

/**
 * Recursively counts files with the doc extension in a directory.
 */
export function countFiles(dir: string): number {
    let count = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            count += countFiles(path.join(dir, entry.name));
        } else if (entry.name.endsWith(`.${DOC_EXTENSION}`)) {
            count++;
        }
    }
    return count;
}

/**
 * Checks if a file is a test file based on its extension.
 * @param filePath - The file path to check.
 * @returns `true` if the file is a test file (.test.ts or .spec.ts).
 */
export function isTestFile(filePath: string): boolean {
    return filePath.endsWith(".test.ts") || filePath.endsWith(".spec.ts");
}

/**
 * Checks if a file should be skipped during source file analysis.
 * Skips node_modules, test files, dist, and scripts directories.
 * @param relativePath - The relative path from the project root.
 * @returns `true` if the file should be skipped.
 */
export function shouldSkipSourceFile(relativePath: string): boolean {
    return (
        relativePath.includes("node_modules") ||
        relativePath.includes("test/") ||
        relativePath.includes(".test.") ||
        relativePath.includes(".spec.") ||
        relativePath.includes("dist/") ||
        relativePath.includes("scripts/")
    );
}
