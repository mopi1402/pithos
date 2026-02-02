import * as fs from "node:fs";
import * as path from "node:path";
import {
    USE_CASES_DOCS,
    HOW_IT_WORKS,
    ALIASES
} from "./common/constants.js";
import { scanDirectory } from "./common/index.js";
import { loadAliases } from "./merge-docs/loaders.js";

const TARGET_MODULES = ["arkhe", "taphos"];
const SRC_ROOT = path.join(process.cwd(), "packages/pithos/src");

// Folders to exclude from documentation coverage check
const EXCLUDED_FOLDERS = [
    "types",  // TypeScript type definitions, no runtime logic to document
    "test",   // Test utilities, internal use only
];

interface FunctionStatus {
    name: string;
    submodule: string;
    hasUseCases: boolean;
    hasHowItWorks: boolean;
    hasAlias: boolean;
}

interface ModuleStats {
    total: number;
    useCasesCount: number;
    howItWorksCount: number;
    aliasCount: number;
    missingUseCases: string[];
    missingHowItWorks: string[];
    missingAlias: string[];
}

function toKebabCase(str: string): string {
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

function toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function checkFileExists(basePath: string, modulePath: string, fnName: string): boolean {
    const kebabName = toKebabCase(fnName);

    // Check kebab-case (preferred)
    if (fs.existsSync(path.join(basePath, modulePath, `${kebabName}.md`))) {
        return true;
    }

    // Check camelCase (fallback)
    if (fs.existsSync(path.join(basePath, modulePath, `${fnName}.md`))) {
        return true;
    }

    return false;
}

function main() {
    console.log("🔍 Checking documentation coverage...");
    console.log(`Target modules: ${TARGET_MODULES.join(", ")}\n`);

    const aliasesMap = loadAliases();
    const stats: Record<string, ModuleStats> = {};

    for (const moduleName of TARGET_MODULES) {
        const modulePath = path.join(SRC_ROOT, moduleName);
        if (!fs.existsSync(modulePath)) {
            console.warn(`⚠️ Module not found: ${modulePath}`);
            continue;
        }

        stats[moduleName] = {
            total: 0,
            useCasesCount: 0,
            howItWorksCount: 0,
            aliasCount: 0,
            missingUseCases: [],
            missingHowItWorks: [],
            missingAlias: [],
        };

        // Scan for TS files
        const entries = scanDirectory(modulePath, {
            extensions: [".ts"],
            exclude: [
                ".test.",
                ".spec.",
                ".d.ts",
                "index.ts",
                "types.ts",
                "bench.ts",
                "_internal"
            ],
            recursive: true,
        });

        for (const entry of entries) {
            const relPathStr = entry.path.replace(modulePath + "/", "");
            const dirName = path.dirname(relPathStr);
            const fileName = path.basename(relPathStr, ".ts");

            // Skip excluded folders
            const topFolder = dirName.split("/")[0];
            if (EXCLUDED_FOLDERS.includes(topFolder)) {
                continue;
            }

            // "modulePath" for documentation looks like "arkhe/array"
            // If dirName is ".", it is directly in "arkhe" (rare but possible)
            const docModulePath = dirName === "." ? moduleName : `${moduleName}/${dirName}`;

            // Check Use Cases
            const hasUseCases = checkFileExists(USE_CASES_DOCS, docModulePath, fileName);

            // Check How It Works
            const hasHowItWorks = checkFileExists(HOW_IT_WORKS, docModulePath, fileName);

            // Check Alias
            const submoduleLeaf = docModulePath.split("/").pop() || "";

            // Try explicit filename (could be count-by or countBy)
            const key1 = `${submoduleLeaf}/${fileName}`;
            // Try toCamelCase (count-by -> countBy)
            const key2 = `${submoduleLeaf}/${toCamelCase(fileName)}`;
            // Try toLowerCase (CountBy -> countby - unlikely but possible for some lookups)
            const key3 = `${submoduleLeaf}/${fileName.toLowerCase()}`;

            const hasAlias = aliasesMap.has(key1) || aliasesMap.has(key2) || aliasesMap.has(key3);

            // Update Stats
            stats[moduleName].total++;

            if (hasUseCases) stats[moduleName].useCasesCount++;
            else stats[moduleName].missingUseCases.push(`${docModulePath}/${fileName}`);

            if (hasHowItWorks) stats[moduleName].howItWorksCount++;
            else stats[moduleName].missingHowItWorks.push(`${docModulePath}/${fileName}`);

            if (hasAlias) stats[moduleName].aliasCount++;
            else stats[moduleName].missingAlias.push(`${docModulePath}/${fileName}`);
        }
    }

    // Report
    let totalFunctions = 0;
    let totalUseCases = 0;
    let totalHowItWorks = 0;
    let totalAlias = 0;

    for (const [moduleName, modStats] of Object.entries(stats)) {
        console.log(`\n📦 Module: ${moduleName.toUpperCase()}`);
        console.log(`   Functions: ${modStats.total}`);

        const ucPct = Math.round((modStats.useCasesCount / modStats.total) * 100);
        console.log(`   📝 Use Cases:    ${modStats.useCasesCount}/${modStats.total} (${ucPct}%)`);

        const hiwPct = Math.round((modStats.howItWorksCount / modStats.total) * 100);
        console.log(`   ⚙️  How It Works: ${modStats.howItWorksCount}/${modStats.total} (${hiwPct}%)`);

        const aliasPct = Math.round((modStats.aliasCount / modStats.total) * 100);
        console.log(`   🏷️  Aliases:      ${modStats.aliasCount}/${modStats.total} (${aliasPct}%)`);

        if (modStats.missingUseCases.length > 0) {
            console.log("\n   ⚠️  Missing Use Cases:");
            modStats.missingUseCases.forEach(m => console.log(`      - ${m}`));
        }

        if (modStats.missingHowItWorks.length > 0) {
            console.log("\n   ⚠️  Missing How It Works:");
            modStats.missingHowItWorks.forEach(m => console.log(`      - ${m}`));
        }

        if (modStats.missingAlias.length > 0) {
            console.log("\n   ⚠️  Missing Aliases:");
            modStats.missingAlias.forEach(m => console.log(`      - ${m}`));
        }

        totalFunctions += modStats.total;
        totalUseCases += modStats.useCasesCount;
        totalHowItWorks += modStats.howItWorksCount;
        totalAlias += modStats.aliasCount;
    }

    console.log("\n========================================");
    console.log("🌍 GLOBAL STATS");
    console.log("========================================");
    console.log(`Total Functions: ${totalFunctions}`);
    console.log(`Use Cases Coverage:    ${Math.round((totalUseCases / totalFunctions) * 100)}% (${totalUseCases}/${totalFunctions})`);
    console.log(`How It Works Coverage: ${Math.round((totalHowItWorks / totalFunctions) * 100)}% (${totalHowItWorks}/${totalFunctions})`);
    console.log(`Aliases Coverage:      ${Math.round((totalAlias / totalFunctions) * 100)}% (${totalAlias}/${totalFunctions})`);
}

main();
