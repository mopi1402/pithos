// scripts/merge-docs/loaders.ts
// Data loading functions for merge-docs

import * as fs from "node:fs";
import * as path from "node:path";
import { USE_CASES, OVERRIDES, ALIASES, HOW_IT_WORKS, USE_CASES_DOCS } from "../common/constants.js";
import type { FunctionUseCases, UseCase } from "./types.js";

/**
 * Load all use cases into a map.
 */
export function loadUseCases(): Map<string, FunctionUseCases> {
    const map = new Map<string, FunctionUseCases>();

    if (!fs.existsSync(USE_CASES)) return map;

    // Try to load from JSON files first (more reliable)
    const jsonFiles = fs
        .readdirSync(USE_CASES)
        .filter((f) => f.endsWith(".json"));

    for (const file of jsonFiles) {
        const filePath = path.join(USE_CASES, file);
        try {
            const content = fs.readFileSync(filePath, "utf-8");
            const data: FunctionUseCases[] = JSON.parse(content);
            for (const fn of data) {
                map.set(`${fn.module}/${fn.function}`, fn);
            }
        } catch (e) {
            console.warn(`Failed to parse JSON ${file}:`, (e as Error).message);
        }
    }

    // Fallback to TypeScript files if JSON doesn't exist
    const tsFiles = fs
        .readdirSync(USE_CASES)
        .filter((f) => f.endsWith(".ts") && f !== "types.ts" && f !== "index.ts" && !jsonFiles.includes(f.replace(/\.ts$/, ".json")));

    for (const file of tsFiles) {
        const filePath = path.join(USE_CASES, file);
        try {
            const content = fs.readFileSync(filePath, "utf-8");
            const match = content.match(
                /export\s+const\s+\w+UseCases:\s*FunctionUseCases\[\]\s*=\s*(\[[\s\S]*?\]);/
            );
            if (match) {
                // Convert TypeScript format back to JSON for parsing
                // Replace single quotes with double quotes and restore quoted keys
                let jsonStr = match[1]
                    .replace(/^(\s+)(\w+):/gm, '$1"$2":') // Re-quote keys
                    .replace(/'/g, '"'); // Replace single quotes with double quotes

                // Parse as JSON
                const data: FunctionUseCases[] = JSON.parse(jsonStr);
                for (const fn of data) {
                    map.set(`${fn.module}/${fn.function}`, fn);
                }
            }
        } catch (e) {
            console.warn(`Failed to parse TS ${file}:`, (e as Error).message);
        }
    }

    return map;
}

/**
 * Convert camelCase to kebab-case.
 * @example toKebabCase("countBy") → "count-by"
 */
function toKebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/**
 * Load override for a specific function.
 * Tries kebab-case first, then camelCase as fallback.
 */
export function loadOverride(module: string, fnName: string): string | null {
    const kebabName = toKebabCase(fnName);
    const kebabPath = path.join(OVERRIDES, module, `${kebabName}.md`);
    if (fs.existsSync(kebabPath)) {
        return fs.readFileSync(kebabPath, "utf-8");
    }

    const camelPath = path.join(OVERRIDES, module, `${fnName}.md`);
    if (fs.existsSync(camelPath)) {
        return fs.readFileSync(camelPath, "utf-8");
    }

    return null;
}

/**
 * Load all alias data into a map.
 */
export function loadAliases(): Map<string, any> {
    const map = new Map<string, any>();

    if (!fs.existsSync(ALIASES)) return map;

    const files = fs
        .readdirSync(ALIASES)
        .filter((f) => f.endsWith(".json"));

    for (const file of files) {
        const filePath = path.join(ALIASES, file);
        try {
            const content = fs.readFileSync(filePath, "utf-8");
            const data = JSON.parse(content);
            // Extract module name from filename (e.g., "array.json" -> "array")
            const moduleName = path.basename(file, ".json");

            // Store each function's alias data with key: "module/function"
            for (const [functionName, aliasData] of Object.entries(data)) {
                map.set(`${moduleName}/${functionName}`, aliasData);
            }
        } catch (e) {
            console.warn(`Failed to parse alias file ${file}:`, (e as Error).message);
        }
    }

    return map;
}

/**
 * Load "How it works?" content for a specific function.
 * Looks for a markdown file at: how-it-works/{module}/{fnName}.md
 * Tries kebab-case first (count-by.md), then camelCase (countBy.md) as fallback.
 * @example loadHowItWorks("arkhe/function", "debounce") → content of how-it-works/arkhe/function/debounce.md
 */
export function loadHowItWorks(module: string, fnName: string): string | null {
    const kebabName = toKebabCase(fnName);
    const kebabPath = path.join(HOW_IT_WORKS, module, `${kebabName}.md`);
    if (fs.existsSync(kebabPath)) {
        return fs.readFileSync(kebabPath, "utf-8");
    }

    const camelPath = path.join(HOW_IT_WORKS, module, `${fnName}.md`);
    if (fs.existsSync(camelPath)) {
        return fs.readFileSync(camelPath, "utf-8");
    }

    return null;
}

/**
 * Load use cases content for a specific function from the new documentation structure.
 * Looks for a markdown file at: use_cases/{module}/{fnName}.md
 * Tries kebab-case first (count-by.md), then camelCase (countBy.md) as fallback.
 * @example loadUseCasesContent("arkhe/array", "partition") → content of use_cases/arkhe/array/partition.md
 */
export function loadUseCasesContent(module: string, fnName: string): string | null {
    const kebabName = toKebabCase(fnName);
    const kebabPath = path.join(USE_CASES_DOCS, module, `${kebabName}.md`);
    if (fs.existsSync(kebabPath)) {
        return fs.readFileSync(kebabPath, "utf-8");
    }

    const camelPath = path.join(USE_CASES_DOCS, module, `${fnName}.md`);
    if (fs.existsSync(camelPath)) {
        return fs.readFileSync(camelPath, "utf-8");
    }

    return null;
}

/**
 * Parse use cases markdown content into FunctionUseCases structure.
 * The markdown format is:
 * ## `functionName` ⭐ (or 💎)
 * > Hidden gem description (for 💎 only)
 * ### **Use case title** 📍
 * Description
 * ```typescript
 * code example
 * ```
 */
export function parseUseCasesFromMarkdown(content: string, module: string, fnName: string): FunctionUseCases | null {
    const lines = content.split("\n");

    // Extract metadata from header: ## `functionName` ⭐ or 💎
    const headerMatch = content.match(/^## `([^`]+)`(\s*(⭐|💎))?/m);
    if (!headerMatch) return null;

    const isImportant = headerMatch[3] === "⭐";
    const isHiddenGem = headerMatch[3] === "💎";

    // Extract hidden gem description (blockquote after header)
    let hiddenGemDescription: string | undefined;
    if (isHiddenGem) {
        const blockquoteMatch = content.match(/^## `[^`]+`[^\n]*\n\n?((?:>\s*[^\n]*\n?)+)/m);
        if (blockquoteMatch) {
            hiddenGemDescription = blockquoteMatch[1]
                .split("\n")
                .map(line => line.replace(/^>\s*/, "").trim())
                .filter(line => line.length > 0)
                .join(" ");
        }
    }

    // Parse use cases
    const useCases: UseCase[] = [];
    let currentUseCase: Partial<UseCase> | null = null;
    let descriptionLines: string[] = [];
    let isInCodeBlock = false;
    let codeBlockLines: string[] = [];
    let isAfterHeader = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Skip until we're past the main header
        if (line.match(/^## `[^`]+`/)) {
            isAfterHeader = true;
            continue;
        }

        if (!isAfterHeader) continue;

        // Skip blockquote (hidden gem description)
        if (line.trim().startsWith(">")) continue;

        // Match use case subsection: ### **Title** optionally followed by 📍 or 📌
        const useCaseMatch = line.match(/^### \*\*([^*]+)\*\*(.*)$/);
        if (useCaseMatch) {
            // Save previous use case
            if (currentUseCase && currentUseCase.title) {
                currentUseCase.description = descriptionLines.join("\n").trim();
                if (codeBlockLines.length > 0) {
                    currentUseCase.codeExample = codeBlockLines.join("\n");
                }
                useCases.push(currentUseCase as UseCase);
            }

            const titlePart = useCaseMatch[1].trim();
            const restOfLine = useCaseMatch[2].trim();
            const isPrimary = restOfLine.includes("📌") || restOfLine.includes("📍") || useCases.length === 0;

            const titleSuffix = restOfLine
                .replace(/📌/g, "")
                .replace(/📍/g, "")
                .trim();

            currentUseCase = {
                title: titleSuffix ? `${titlePart} ${titleSuffix}` : titlePart,
                isPrimary,
            };
            descriptionLines = [];
            codeBlockLines = [];
            isInCodeBlock = false;
            continue;
        }

        // Detect code block start
        if (line.trim().startsWith("```") && !isInCodeBlock) {
            isInCodeBlock = true;
            codeBlockLines = [];
            continue;
        }

        // Detect code block end
        if (isInCodeBlock && line.trim() === "```") {
            isInCodeBlock = false;
            continue;
        }

        // Collect code block content
        if (isInCodeBlock && currentUseCase) {
            codeBlockLines.push(line);
            continue;
        }

        // Collect description lines
        if (currentUseCase && line.trim() && !line.startsWith("#") && !isInCodeBlock) {
            const trimmedLine = line.trim();
            if (trimmedLine.toLowerCase().startsWith("@keywords:")) {
                // Extract keywords
                const kws = trimmedLine
                    .substring(trimmedLine.indexOf(":") + 1)
                    .split(",")
                    .map(k => k.trim())
                    .filter(Boolean);
                
                if (!currentUseCase.keywords) currentUseCase.keywords = [];
                currentUseCase.keywords.push(...kws);
            } else {
                descriptionLines.push(line);
            }
        }
    }

    // Don't forget the last use case
    if (currentUseCase && currentUseCase.title) {
        currentUseCase.description = descriptionLines.join("\n").trim();
        if (codeBlockLines.length > 0) {
            currentUseCase.codeExample = codeBlockLines.join("\n");
        }
        useCases.push(currentUseCase as UseCase);
    }

    return {
        module,
        function: fnName,
        isImportant,
        isHiddenGem,
        hiddenGemDescription,
        useCases,
        format: "new",
    };
}
