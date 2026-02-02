// scripts/merge-docs/index-generator.ts
// Index file generation

import * as fs from "node:fs";
import * as path from "node:path";
import { OUTPUT, DOC_EXTENSION } from "../common/constants.js";

/**
 * Generate index files for each module.
 */
export function generateIndexFiles() {
    const modules = fs
        .readdirSync(OUTPUT, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

    for (const moduleName of modules) {
        const modulePath = path.join(OUTPUT, moduleName);
        const subModules = fs
            .readdirSync(modulePath, { withFileTypes: true })
            .filter((d) => d.isDirectory())
            .map((d) => d.name);

        // Create module index
        let moduleIndex = `---
title: ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}
---

# ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}

`;

        for (const subModule of subModules) {
            const subModulePath = path.join(modulePath, subModule);
            const files = fs
                .readdirSync(subModulePath)
                .filter((f) => f.endsWith(`.${DOC_EXTENSION}`));

            moduleIndex += `## ${subModule}\n\n`;
            for (const file of files) {
                const name = path.basename(file, `.${DOC_EXTENSION}`);
                moduleIndex += `- [${name}](/api/${moduleName}/${subModule}/${name})\n`;
            }
            moduleIndex += "\n";
        }

        fs.writeFileSync(
            path.join(modulePath, `index.${DOC_EXTENSION}`),
            moduleIndex
        );
    }
}
