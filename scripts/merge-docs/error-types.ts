// scripts/merge-docs/error-types.ts
// Error type extraction from source files

import * as fs from "node:fs";
import * as path from "node:path";
import { API_DOCS } from "../common/constants.js";

/**
 * Extract error types from source TypeScript file.
 */
export function extractErrorTypesFromSource(
    docFilePath: string,
    fnName: string
): string[] {
    // Map documentation path to source path
    // e.g., packages/main/documentation/api-docs/arkhe/array/chunk/functions/chunk.md
    // -> packages/pithos/src/arkhe/array/chunk.ts
    const relativePath = path.relative(API_DOCS, docFilePath);
    const pathParts = relativePath.split(path.sep);

    // Remove last parts (function name, functions folder, etc.)
    // Keep module path (arkhe/array/chunk)
    let modulePath = pathParts.slice(0, -2).join(path.sep);

    // If the last part is the function name, we need to find the source file
    // Try to find the source file in packages/pithos/src
    const sourceBase = "packages/pithos/src";
    const sourcePath = path.join(sourceBase, modulePath + ".ts");

    if (!fs.existsSync(sourcePath)) {
        // Try alternative: if modulePath ends with function name, remove it
        const altPath = path.join(
            sourceBase,
            pathParts.slice(0, -3).join(path.sep) + ".ts"
        );
        if (fs.existsSync(altPath)) {
            return extractErrorTypesFromFile(altPath, fnName);
        }
        return [];
    }

    return extractErrorTypesFromFile(sourcePath, fnName);
}

/**
 * Extract error types from a TypeScript source file.
 */
export function extractErrorTypesFromFile(
    sourcePath: string,
    fnName: string
): string[] {
    try {
        const content = fs.readFileSync(sourcePath, "utf-8");
        const errorTypes: string[] = [];

        // Find the function declaration
        const functionRegex = new RegExp(
            `(?:export\\s+)?(?:async\\s+)?function\\s+${fnName}\\s*[<(]`,
            "i"
        );
        const functionMatch = content.match(functionRegex);

        if (!functionMatch) return [];

        // Find the JSDoc comment before the function
        const functionIndex = functionMatch.index!;
        const beforeFunction = content.substring(0, functionIndex);

        // Find the last JSDoc comment before the function
        const jsDocRegex = /\/\*\*[\s\S]*?\*\//g;
        const jsDocMatches = Array.from(beforeFunction.matchAll(jsDocRegex));

        if (jsDocMatches.length === 0) return [];

        // Get the last JSDoc (closest to the function)
        const lastJsDoc = jsDocMatches[jsDocMatches.length - 1][0];

        // Extract @throws tags with error types
        const throwsRegex = /@throws\s+\{([^}]+)\}/g;
        const throwsMatches = Array.from(lastJsDoc.matchAll(throwsRegex));

        for (const match of throwsMatches) {
            const errorType = match[1].trim();
            if (errorType && !errorTypes.includes(errorType)) {
                errorTypes.push(errorType);
            }
        }

        return errorTypes;
    } catch (e) {
        return [];
    }
}
