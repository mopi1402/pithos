// scripts/common/esm-utils.ts
// ESM compatibility utilities

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Gets the directory name equivalent to __dirname in CommonJS.
 * Use with import.meta.url: getDirname(import.meta.url)
 *
 * @param importMetaUrl - The import.meta.url value
 * @returns The directory path
 */
export function getDirname(importMetaUrl: string): string {
    return dirname(fileURLToPath(importMetaUrl));
}

/**
 * Gets the filename equivalent to __filename in CommonJS.
 * Use with import.meta.url: getFilename(import.meta.url)
 *
 * @param importMetaUrl - The import.meta.url value
 * @returns The file path
 */
export function getFilename(importMetaUrl: string): string {
    return fileURLToPath(importMetaUrl);
}
