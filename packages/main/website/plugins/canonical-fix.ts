/**
 * Docusaurus plugin – postBuild canonical fix.
 *
 * After the static build, rewrites HTML files under UNTRANSLATED sections
 * (e.g. /fr/api/…) so that their canonical and og:url point to the
 * default-locale version (without the /fr/ prefix).
 *
 * Translated sections (guide, comparisons, etc.) are left untouched —
 * their canonical correctly points to themselves.
 *
 * NOTE: Docusaurus builds each locale separately. When building "fr",
 * outDir is already "build/fr/" (not "build/").
 */
import type { Plugin, LoadContext } from "@docusaurus/types";
import fs from "fs/promises";
import path from "path";

/**
 * Route prefixes that are NOT translated and should have their canonical
 * point to the default locale. Add more entries here if needed.
 */
const UNTRANSLATED_ROUTES = ["api"];

async function walkHtml(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkHtml(full)));
    } else if (entry.name.endsWith(".html")) {
      files.push(full);
    }
  }
  return files;
}

export default function pluginCanonicalFix(
  context: LoadContext,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _options: unknown,
): Plugin {
  return {
    name: "plugin-canonical-fix",

    async postBuild({ outDir }) {
      const { currentLocale, defaultLocale } = context.i18n;
      const siteUrl = context.siteConfig.url;

      // Only patch non-default locales
      if (currentLocale === defaultLocale) {
        return;
      }

      // Escape special regex chars in siteUrl (dots, etc.)
      const escaped = siteUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      const canonicalRe = new RegExp(
        `(<link[^>]*rel="canonical"[^>]*href=")${escaped}/${currentLocale}/`,
        "g",
      );
      const ogUrlRe = new RegExp(
        `(<meta[^>]*property="og:url"[^>]*content=")${escaped}/${currentLocale}/`,
        "g",
      );

      let totalPatched = 0;

      for (const route of UNTRANSLATED_ROUTES) {
        const routeDir = path.join(outDir, route);

        let htmlFiles: string[];
        try {
          htmlFiles = await walkHtml(routeDir);
        } catch {
          // Route dir doesn't exist in this build
          continue;
        }

        let patched = 0;
        for (const file of htmlFiles) {
          const original = await fs.readFile(file, "utf-8");
          let html = original;

          html = html.replace(canonicalRe, `$1${siteUrl}/`);
          html = html.replace(ogUrlRe, `$1${siteUrl}/`);

          if (html !== original) {
            await fs.writeFile(file, html, "utf-8");
            patched++;
          }
        }

        totalPatched += patched;
        console.log(
          `[canonical-fix] Patched ${patched} files in /${currentLocale}/${route}/`,
        );
      }

      console.log(
        `[canonical-fix] Total: ${totalPatched} files patched for "${currentLocale}"`,
      );
    },
  };
}
