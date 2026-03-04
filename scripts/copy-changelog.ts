import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

interface LocaleConfig {
  sidebar_label: string;
  title: string;
  description: string;
  heading: string;
  intro: string;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "../");
const websiteDir = resolve(rootDir, "packages/main/website");

const source = resolve(rootDir, "CHANGELOG.md");

if (!existsSync(source)) {
  console.log("⚠️  CHANGELOG.md not found at root, skipping copy");
  process.exit(0);
}

const raw = readFileSync(source, "utf-8");

// Extract version entries: everything starting from the first ## heading
const firstVersionIndex = raw.indexOf("\n## ");
const versionEntries =
  firstVersionIndex !== -1 ? raw.slice(firstVersionIndex) : "";

// Load i18n config
const i18nConfig: Record<string, LocaleConfig> = JSON.parse(
  readFileSync(resolve(__dirname, "changelog-i18n.json"), "utf-8")
);

// Destination map: locale → target path
const destinations: Record<string, string> = {
  en: resolve(websiteDir, "docs/basics/changelog.md"),
};

for (const locale of Object.keys(i18nConfig)) {
  if (locale === "en") continue;
  destinations[locale] = resolve(
    websiteDir,
    `i18n/${locale}/docusaurus-plugin-content-docs/current/basics/changelog.md`
  );
}

for (const [locale, dest] of Object.entries(destinations)) {
  const meta = i18nConfig[locale];
  if (!meta) {
    console.log(`⚠️  No i18n config for locale "${locale}", skipping`);
    continue;
  }

  const output = `---
sidebar_label: ${meta.sidebar_label}
title: ${meta.title}
description: ${meta.description}
---

${meta.heading}

${meta.intro}
${versionEntries}`;

  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, output);
  console.log(
    `✅ [${locale}] → ${dest.replace(rootDir + "/", "")}`
  );
}
