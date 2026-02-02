// scripts/common/project-paths.ts
// Project path utilities and constants

import * as fs from "node:fs";
import { join } from "node:path";
import { getDirname } from "./esm-utils.js";

/**
 * Gets the project root directory (parent of scripts/).
 * @param importMetaUrl - The import.meta.url value from the calling script
 */
export function getProjectRoot(importMetaUrl: string): string {
    return join(getDirname(importMetaUrl), "..");
}

/**
 * Gets the pithos source directory.
 * @param importMetaUrl - The import.meta.url value from the calling script
 */
export function getSrcDir(importMetaUrl: string): string {
    return join(getProjectRoot(importMetaUrl), "packages/pithos/src");
}

/**
 * Gets the pithos dist directory.
 * @param importMetaUrl - The import.meta.url value from the calling script
 */
export function getDistDir(importMetaUrl: string): string {
    return join(getProjectRoot(importMetaUrl), "packages/pithos/dist");
}

/**
 * Reads the package name from package.json.
 * @param packageJsonPath - Path to package.json (optional, defaults to cwd)
 * @returns The package name
 */
export function getPackageName(packageJsonPath?: string): string {
    try {
        const path = packageJsonPath || join(process.cwd(), "package.json");
        const packageJson = JSON.parse(fs.readFileSync(path, "utf-8"));
        return packageJson.name || "your-package";
    } catch {
        return "your-package";
    }
}
