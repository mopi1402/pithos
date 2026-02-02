// scripts/common/dir-scanner.ts
// Directory scanning utilities

import * as fs from "node:fs";
import { join } from "node:path";

export interface ScanEntry {
    name: string;
    path: string;
    isDirectory: boolean;
}

export interface ScanOptions {
    /** Filter by file extensions (e.g., [".ts"]) */
    extensions?: string[];
    /** Exclude patterns (e.g., ["node_modules", ".test."]) */
    exclude?: string[];
    /** Include directories in results */
    includeDirs?: boolean;
    /** Recurse into subdirectories */
    recursive?: boolean;
}

/**
 * Scans a directory and returns entries matching the options.
 *
 * @param dir - Directory to scan
 * @param options - Scan options
 * @returns Array of matching entries
 */
export function scanDirectory(dir: string, options: ScanOptions = {}): ScanEntry[] {
    const {
        extensions = [],
        exclude = [],
        includeDirs = false,
        recursive = false,
    } = options;

    const results: ScanEntry[] = [];

    if (!fs.existsSync(dir)) {
        return results;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        // Check exclusions
        if (exclude.some(pattern => fullPath.includes(pattern) || entry.name.includes(pattern))) {
            continue;
        }

        if (entry.isDirectory()) {
            if (includeDirs) {
                results.push({
                    name: entry.name,
                    path: fullPath,
                    isDirectory: true,
                });
            }

            if (recursive) {
                results.push(...scanDirectory(fullPath, options));
            }
        } else {
            // Check extension filter
            if (extensions.length > 0) {
                const hasExtension = extensions.some(ext => entry.name.endsWith(ext));
                if (!hasExtension) continue;
            }

            results.push({
                name: entry.name,
                path: fullPath,
                isDirectory: false,
            });
        }
    }

    return results;
}

/**
 * Gets all TypeScript files in a directory (excluding .d.ts and test files).
 *
 * @param dir - Directory to scan
 * @param recursive - Whether to recurse into subdirectories
 * @returns Array of file paths
 */
export function getSourceFiles(dir: string, recursive = true): string[] {
    const entries = scanDirectory(dir, {
        extensions: [".ts"],
        exclude: [".d.ts", ".test.", ".spec.", "node_modules"],
        recursive,
    });

    return entries.filter(e => !e.isDirectory).map(e => e.path);
}

/**
 * Gets all subdirectories of a directory.
 *
 * @param dir - Directory to scan
 * @returns Array of directory names
 */
export function getSubdirectories(dir: string): string[] {
    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name);
}
