import { copyFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "../");
const docsDir = resolve(__dirname, "../packages/main/website/docs/basics");

const source = resolve(rootDir, "CHANGELOG.md");
const dest = resolve(docsDir, "changelog.md");

if (!existsSync(source)) {
  console.log("⚠️  CHANGELOG.md not found at root, skipping copy");
  process.exit(0);
}

// Add frontmatter for Docusaurus
import { readFileSync, writeFileSync } from "fs";

const content = readFileSync(source, "utf-8");
const frontmatter = `---
sidebar_label: Changelog
title: Changelog
description: Release notes and version history for Pithos
---

`;

writeFileSync(dest, frontmatter + content);
console.log("✅ Copied CHANGELOG.md to docs/basics/changelog.md");
