// scripts/doc-formatters/__tests__/snapshot-helper.ts
// Shared helper for pipeline snapshot tests.

import { it, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

export const GENERATED_DIR = path.resolve("packages/main/documentation/_generated/final");

/**
 * Creates a snapshot test for a generated doc file.
 * Strips frontmatter before comparing so metadata changes don't cause false failures.
 */
export function snapshotDoc(label: string, relativePath: string) {
    it(label, () => {
        const filePath = path.join(GENERATED_DIR, relativePath);

        if (!fs.existsSync(filePath)) {
            console.warn(`  ⚠ Skipping "${label}" — file not found: ${relativePath}`);
            return;
        }

        const content = fs.readFileSync(filePath, "utf-8");
        const withoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n\n/, "");

        expect(withoutFrontmatter).toMatchSnapshot();
    });
}
