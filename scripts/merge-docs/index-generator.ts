// scripts/merge-docs/index-generator.ts
// Index file generation

import * as fs from "node:fs";
import * as path from "node:path";
import { OUTPUT, DOC_EXTENSION } from "../common/constants.js";

/** Short descriptions for API categories (used in module index accordions). */
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    array: "Manipulate, filter, sort, and transform arrays",
    async: "Concurrency, retries, queues, and async control flow",
    function: "Composition, memoization, debounce, throttle, and more",
    is: "Type guards and runtime type checks",
    number: "Clamp, parse, and convert numeric values",
    object: "Deep clone, merge, pick, omit, and path access",
    string: "Case conversion, escaping, templating, and text utilities",
    test: "Test helpers, mocks, and assertion utilities",
    types: "TypeScript type aliases and utility types",
    util: "General-purpose helpers (range, sleep, uniqueId…)",
    schemas: "Schema definitions for validation",
    result: "Result and Ok/Err types for error handling",
    either: "Either type for dual-path computation",
    option: "Option type for nullable value handling",
    task: "Lazy async computation with error handling",
    errors: "Typed error factories and error codes",
    collection: "Legacy collection utilities (Lodash compat)",
    lang: "Legacy language utilities (Lodash compat)",
};

/** Default badge label format. */
function getBadgeLabel(moduleName: string, categoryName: string, count: number): string {
    // Just show the count, no label
    return `${count}`;
}

/**
 * Generate the root API index file.
 */
export function generateRootIndex() {
    const modules = [
        { name: "Arkhe", logo: "/img/emoji/letter-a.png", desc: "Core utilities (arrays, objects, strings, functions)", link: "/api/arkhe/" },
        { name: "Kanon", logo: "/img/emoji/letter-k.png", desc: "Schema validation with JIT compilation", link: "/api/kanon/" },
        { name: "Zygos", logo: "/img/emoji/letter-z.png", desc: "Result/Either types for error handling", link: "/api/zygos/" },
        { name: "Sphalma", logo: "/img/emoji/letter-s.png", desc: "Typed error factories with error codes", link: "/api/sphalma/" },
        { name: "Taphos", logo: "/img/emoji/letter-t.png", desc: "Legacy utilities (Lodash/Ramda compatibility)", link: "/api/taphos/" },
    ];

    const cards = modules.map(m => `  <div className="col col--6" style={{marginBottom: '1rem'}}>
    <a className="card padding--md basics-card" href="${m.link}">
      <img src="${m.logo}" alt="${m.name}" width="64" height="64" style={{flexShrink: 0}} />
      <div className="basics-card__text">
        <strong>${m.name}</strong>
        <span>${m.desc}</span>
      </div>
    </a>
  </div>`).join("\n");

    const rootIndex = `---
title: API Reference
sidebar_label: Overview
sidebar_position: 0
slug: /
---

# 📔 API Reference

Explore the API documentation for each Pithos module.

<div className="row" style={{marginTop: '1.5rem'}}>
${cards}
</div>
`;

    fs.writeFileSync(path.join(OUTPUT, `index.${DOC_EXTENSION}`), rootIndex);
}

/**
 * Recursively generate _category_.json files with unique translation keys
 * for all subdirectories under a given directory.
 * The key is built from the relative path segments joined by dashes
 * (e.g. "kanon-jit-builders-composites") to guarantee uniqueness.
 */
function generateCategoryFiles(dirPath: string, keyPrefix: string) {
    const subDirs = fs
        .readdirSync(dirPath, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

    for (const subDir of subDirs) {
        const subDirPath = path.join(dirPath, subDir);
        const key = `${keyPrefix}-${subDir}`;

        const categoryMeta = {
            label: subDir,
            key,
        };
        fs.writeFileSync(
            path.join(subDirPath, "_category_.json"),
            JSON.stringify(categoryMeta, null, 2) + "\n"
        );

        // Recurse into deeper directories
        generateCategoryFiles(subDirPath, key);
    }
}

/**
 * Generate index files for each module.
 * Also generates _category_.json files with unique translation keys
 * to avoid Docusaurus i18n sidebar key collisions when multiple modules
 * share the same category names (e.g. arkhe/array and taphos/array).
 */
export function generateIndexFiles() {
    // Generate root index first
    generateRootIndex();

    const moduleLogos: Record<string, string> = {
        arkhe: "/img/emoji/letter-a.png",
        kanon: "/img/emoji/letter-k.png",
        zygos: "/img/emoji/letter-z.png",
        sphalma: "/img/emoji/letter-s.png",
        taphos: "/img/emoji/letter-t.png",
    };

    const modules = fs
        .readdirSync(OUTPUT, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

    for (const moduleName of modules) {
        const modulePath = path.join(OUTPUT, moduleName);
        const logo = moduleLogos[moduleName] ?? moduleLogos.arkhe;
        const displayName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

        // Recursively generate _category_.json for all subdirectories
        generateCategoryFiles(modulePath, moduleName);

        const subModules = fs
            .readdirSync(modulePath, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => d.name);

        // Count md files recursively
        function countMdFiles(dir: string): number {
            let count = 0;
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                if (entry.isDirectory()) {
                    count += countMdFiles(path.join(dir, entry.name));
                } else if (entry.name.endsWith(`.${DOC_EXTENSION}`)) {
                    count++;
                }
            }
            return count;
        }

        // Collect md file links recursively
        function collectMdLinks(dir: string): string[] {
            const results: string[] = [];
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
                if (entry.isDirectory()) {
                    results.push(...collectMdLinks(path.join(dir, entry.name)));
                } else if (entry.name.endsWith(`.${DOC_EXTENSION}`)) {
                    const name = path.basename(entry.name, `.${DOC_EXTENSION}`);
                    const relDir = path.relative(modulePath, dir);
                    const link = name.toLowerCase() === path.basename(dir).toLowerCase()
                        ? `/api/${moduleName}/${relDir}`
                        : `/api/${moduleName}/${relDir}/${name}`;
                    results.push(`- [${name}](${link})`);
                }
            }
            return results;
        }

        // Build accordion sections
        const accordions = subModules
            .map((subModule) => {
                const subModulePath = path.join(modulePath, subModule);
                const fileCount = countMdFiles(subModulePath);
                if (fileCount === 0) return "";

                const links = collectMdLinks(subModulePath);
                const desc = CATEGORY_DESCRIPTIONS[subModule] ?? "";
                const descProp = desc ? ` description="${desc}"` : "";
                const badgeLabel = getBadgeLabel(moduleName, subModule, fileCount);

                return `<Accordion title="${subModule}" icon="${logo}" badge="${badgeLabel}"${descProp} variant="card">

${links.join("\n")}

</Accordion>`;
            })
            .filter(Boolean)
            .join("\n\n");

        const moduleIndex = `---
title: ${displayName}
---

import { Accordion } from "@site/src/components/shared/Accordion";

# ${displayName}

${accordions}
`;

        // Remove old index.md if it exists (replaced by index.mdx)
        const oldIndexPath = path.join(modulePath, `index.${DOC_EXTENSION}`);
        if (fs.existsSync(oldIndexPath)) {
            fs.unlinkSync(oldIndexPath);
        }

        // Module index uses .mdx extension for JSX import support
        fs.writeFileSync(
            path.join(modulePath, `index.mdx`),
            moduleIndex
        );
    }
}
