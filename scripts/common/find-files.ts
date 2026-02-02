// scripts/common/find-files.ts
// Recursive file search utilities

import { readdir, stat } from "node:fs/promises";
import * as fs from "node:fs";
import { join } from "node:path";

/**
 * Recursively finds all TypeScript files in a directory.
 * @param dir - The directory to search
 * @param fileList - Accumulator for found files (used internally)
 * @returns Array of absolute file paths
 */
export async function findTypeScriptFiles(
    dir: string,
    fileList: string[] = []
): Promise<string[]> {
    const files = await readdir(dir);

    for (const file of files) {
        const filePath = join(dir, file);
        const fileStat = await stat(filePath);

        if (fileStat.isDirectory()) {
            await findTypeScriptFiles(filePath, fileList);
        } else if (file.endsWith(".ts") && !file.endsWith(".d.ts")) {
            fileList.push(filePath);
        }
    }

    return fileList;
}

/**
 * Synchronous version of findTypeScriptFiles.
 * @param dir - The directory to search
 * @param fileList - Accumulator for found files (used internally)
 * @returns Array of absolute file paths
 */
export function findTypeScriptFilesSync(
    dir: string,
    fileList: string[] = []
): string[] {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = join(dir, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            findTypeScriptFilesSync(filePath, fileList);
        } else if (file.endsWith(".ts") && !file.endsWith(".d.ts")) {
            fileList.push(filePath);
        }
    }

    return fileList;
}

/**
 * Recursively finds all files matching a pattern in a directory.
 * @param dir - The directory to search
 * @param pattern - File extension pattern (e.g., ".md", ".json")
 * @param fileList - Accumulator for found files (used internally)
 * @returns Array of absolute file paths
 */
export function findFilesSync(
    dir: string,
    pattern: string,
    fileList: string[] = []
): string[] {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = join(dir, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            findFilesSync(filePath, pattern, fileList);
        } else if (file.endsWith(pattern)) {
            fileList.push(filePath);
        }
    }

    return fileList;
}

/**
 * Recursively finds all files with an exact filename match.
 * @param dir - The directory to search
 * @param fileName - Exact filename to match (e.g., "USE_CASES.md")
 * @param fileList - Accumulator for found files (used internally)
 * @returns Array of absolute file paths
 */
export function findFilesByName(
    dir: string,
    fileName: string,
    fileList: string[] = []
): string[] {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = join(dir, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
            findFilesByName(filePath, fileName, fileList);
        } else if (file === fileName) {
            fileList.push(filePath);
        }
    }

    return fileList;
}
