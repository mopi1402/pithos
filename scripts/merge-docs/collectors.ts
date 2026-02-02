// scripts/merge-docs/collectors.ts
// File collection logic for deduplication

import * as fs from "node:fs";
import * as path from "node:path";
import { OUTPUT } from "../common/constants.js";
import type { CollectedDocItem } from "./types.js";
import { extractName } from "./extractors.js";

/**
 * Collect all doc items from a module (first pass).
 */
export function collectModule(
    modulePath: string,
    moduleName: string,
    collectedItems: Map<string, CollectedDocItem>
) {
    const subModules = fs
        .readdirSync(modulePath, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

    for (const subModule of subModules) {
        const subModulePath = path.join(modulePath, subModule);
        const outputDir = path.join(OUTPUT, moduleName, subModule);

        collectSubModule(
            subModulePath,
            outputDir,
            `${moduleName}/${subModule}`,
            collectedItems,
            0 // Initial depth
        );
    }
}

/**
 * Collect doc items from a submodule (first pass).
 */
export function collectSubModule(
    srcDir: string,
    outputDir: string,
    moduleKey: string,
    collectedItems: Map<string, CollectedDocItem>,
    depth: number
) {
    if (!fs.existsSync(srcDir)) return;

    const entries = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);

        if (entry.isDirectory()) {
            if (
                entry.name === "functions" ||
                entry.name === "classes" ||
                entry.name === "interfaces" ||
                entry.name === "type-aliases" ||
                entry.name === "variables"
            ) {
                // Collect files in these directories
                collectFlattenedDir(
                    srcPath,
                    outputDir,
                    moduleKey,
                    collectedItems,
                    entry.name,
                    depth
                );
            } else {
                // It's a directory that is not a reserved name (functions, classes, etc.)
                // Determine if it's a "Leaf Module" (contains docs to be flattened) or a "Category" (folder structure to keep)

                // Check for presence of TypeDoc standard folders
                const docTypes = ["functions", "classes", "interfaces", "type-aliases", "variables", "enums"];
                const hasDocContent = docTypes.some(type => fs.existsSync(path.join(srcPath, type)));

                if (hasDocContent) {
                    // LEAF MODULE - process all doc types in this leaf
                    for (const type of docTypes) {
                        const typePath = path.join(srcPath, type);
                        if (fs.existsSync(typePath)) {
                            collectFlattenedDir(
                                typePath,
                                outputDir, // Flatten into CURRENT output dir (parent)
                                moduleKey,
                                collectedItems,
                                type,
                                depth + 1 // Increase depth for items in leaf modules
                            );
                        }
                    }

                    // Also collect any direct .md files in this leaf folder
                    const mdFiles = fs
                        .readdirSync(srcPath)
                        .filter((f) => f.endsWith(".md") && f !== "README.md");

                    for (const mdFile of mdFiles) {
                        collectFile(
                            path.join(srcPath, mdFile),
                            outputDir,
                            moduleKey,
                            collectedItems,
                            undefined,
                            depth + 1
                        );
                    }
                } else {
                    // CATEGORY - recurse into it creating a new subdirectory in output
                    const nextOutputDir = path.join(outputDir, entry.name);
                    collectSubModule(
                        srcPath,
                        nextOutputDir,
                        moduleKey,
                        collectedItems,
                        depth + 1
                    );
                }
            }
        }
    }
}

/**
 * Collect files from a flattened directory (first pass).
 */
export function collectFlattenedDir(
    srcDir: string,
    outputDir: string,
    moduleKey: string,
    collectedItems: Map<string, CollectedDocItem>,
    type: string,
    depth: number
) {
    const files = fs.readdirSync(srcDir).filter((f) => f.endsWith(".md"));

    // Normalize directory name to type
    const typeMap: Record<string, string> = {
        functions: "function",
        classes: "class",
        interfaces: "interface",
        "type-aliases": "type",
        variables: "variable",
        enums: "enum",
    };
    const normalizedType = typeMap[type] || type;

    for (const file of files) {
        collectFile(
            path.join(srcDir, file),
            outputDir,
            moduleKey,
            collectedItems,
            normalizedType,
            depth
        );
    }
}

/**
 * Collect a single file (first pass) - adds to map, keeping deeper paths.
 */
export function collectFile(
    filePath: string,
    outputDir: string,
    moduleKey: string,
    collectedItems: Map<string, CollectedDocItem>,
    providedType?: string,
    depth: number = 0
) {
    // Read the file to extract the function name
    const content = fs.readFileSync(filePath, "utf-8");
    const fnName = extractName(content) || path.basename(filePath, ".md");

    // Create a unique key based on moduleKey and function name
    // This ensures we deduplicate re-exports within the same submodule (e.g., kanon/v3)
    // regardless of where they appear in the output structure
    const key = `${moduleKey}/${fnName}`;

    const existingItem = collectedItems.get(key);

    // Keep the item with the deeper path (where it's truly declared)
    if (!existingItem || depth > existingItem.depth) {
        if (existingItem) {
            console.log(`  Dedup: ${fnName} - keeping deeper path (depth ${depth} > ${existingItem.depth})`);
        }
        collectedItems.set(key, {
            filePath,
            outputDir,
            moduleKey,
            providedType,
            depth,
        });
    }
}
