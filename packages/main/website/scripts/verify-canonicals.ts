#!/usr/bin/env npx tsx
/**
 * Verify canonical URLs and hreflang tags in the build output.
 *
 * For each URL in the FR sitemap, checks that:
 *   - Untranslated routes (e.g. /api/) → canonical points to EN (no /fr/)
 *   - Translated routes (everything else) → canonical points to itself (/fr/…)
 *   - hreflang tags are present and correct (en, fr, x-default)
 *
 * The list of untranslated routes MUST match the UNTRANSLATED_ROUTES constant
 * in plugins/canonical-fix.ts. This script validates the plugin did its job.
 *
 * Usage:
 *   npx tsx scripts/verify-canonicals.ts            # summary only
 *   npx tsx scripts/verify-canonicals.ts --verbose   # show every URL
 */
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const buildDir = resolve(__dirname, "../build");
const siteUrl = "https://pithos.dev";
const verbose = process.argv.includes("--verbose");

/**
 * Routes that are NOT translated — must match plugins/canonical-fix.ts.
 * Their canonical should point to the EN version (without /fr/).
 */
const UNTRANSLATED_ROUTES = ["api"];

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractUrls(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function readHtml(urlPath: string): string | null {
  const filePath = resolve(buildDir, urlPath.replace(/^\//, ""), "index.html");
  if (!existsSync(filePath)) return null;
  return readFileSync(filePath, "utf-8");
}

function getCanonical(html: string): string | null {
  const m = html.match(/rel="canonical"\s+href="([^"]+)"/);
  return m?.[1] ?? null;
}

function getOgUrl(html: string): string | null {
  const m = html.match(/property="og:url"\s+content="([^"]+)"/);
  return m?.[1] ?? null;
}

/** Extract all hreflang entries from HTML. Returns a map of lang → href. */
function getHreflangs(html: string): Map<string, string> {
  const map = new Map<string, string>();
  const re = /rel="alternate"\s+href="([^"]+)"\s+hreflang="([^"]+)"/g;
  for (const m of html.matchAll(re)) {
    map.set(m[2], m[1]);
  }
  return map;
}

/**
 * Validate hreflang tags for a FR page.
 * Expected:
 *   hreflang="en"        → https://pithos.dev/<enPath>
 *   hreflang="fr"        → https://pithos.dev/fr/<enPath>
 *   hreflang="x-default" → https://pithos.dev/<enPath>
 */
function checkHreflangs(
  hreflangs: Map<string, string>,
  enUrl: string,
  frUrl: string,
): string[] {
  const issues: string[] = [];

  if (!hreflangs.has("en")) {
    issues.push('missing hreflang="en"');
  } else if (hreflangs.get("en") !== enUrl) {
    issues.push(`hreflang="en": ${hreflangs.get("en")} (expected ${enUrl})`);
  }

  if (!hreflangs.has("fr")) {
    issues.push('missing hreflang="fr"');
  } else if (hreflangs.get("fr") !== frUrl) {
    issues.push(`hreflang="fr": ${hreflangs.get("fr")} (expected ${frUrl})`);
  }

  if (!hreflangs.has("x-default")) {
    issues.push('missing hreflang="x-default"');
  } else if (hreflangs.get("x-default") !== enUrl) {
    issues.push(
      `hreflang="x-default": ${hreflangs.get("x-default")} (expected ${enUrl})`,
    );
  }

  return issues;
}

/** Check if a path (e.g. /fr/api/arkhe/) belongs to an untranslated route. */
function isUntranslated(frPath: string): boolean {
  // frPath = /fr/api/arkhe/ → strip /fr/ → /api/arkhe/
  const stripped = frPath.replace(/^\/fr\//, "/");
  return UNTRANSLATED_ROUTES.some(
    (route) => stripped === `/${route}/` || stripped.startsWith(`/${route}/`),
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main(): void {
  const frSitemapPath = resolve(buildDir, "fr/sitemap.xml");
  if (!existsSync(frSitemapPath)) {
    console.error("❌ FR sitemap not found. Run `pnpm build` first.");
    process.exit(1);
  }

  const frUrls = extractUrls(readFileSync(frSitemapPath, "utf-8"));
  console.log(`\n📋 ${frUrls.length} URLs in FR sitemap\n`);

  let ok = 0;
  let warnings = 0;
  let errors = 0;
  let skipped = 0;

  for (const frUrl of frUrls) {
    const frPath = frUrl.replace(siteUrl, "");
    const enPath = frPath.replace(/^\/fr\//, "/");
    const enUrl = `${siteUrl}${enPath}`;

    const frHtml = readHtml(frPath);
    if (!frHtml) {
      if (verbose) console.log(`⏭  ${frPath} — file not found`);
      skipped++;
      continue;
    }

    const untranslated = isUntranslated(frPath);
    const expectedCanonical = untranslated ? enUrl : frUrl;
    const tag = untranslated ? "untranslated" : "translated";

    const canonical = getCanonical(frHtml);
    const ogUrl = getOgUrl(frHtml);
    const hreflangs = getHreflangs(frHtml);
    const hreflangIssues = checkHreflangs(hreflangs, enUrl, frUrl);

    const canonicalOk = canonical === expectedCanonical;
    const ogUrlOk = !ogUrl || ogUrl === expectedCanonical;
    const hreflangOk = hreflangIssues.length === 0;

    if (canonicalOk && ogUrlOk && hreflangOk) {
      ok++;
      if (verbose) console.log(`✅ ${frPath} [${tag}] → ${canonical}`);
    } else if (canonicalOk && hreflangOk && !ogUrlOk) {
      // og:url mismatch alone is a warning (Docusaurus quirk on homepage)
      warnings++;
      if (verbose || true) {
        console.log(`⚠️  ${frPath} [${tag}] — og:url mismatch (canonical OK)`);
        console.log(`   og:url:    ${ogUrl}`);
        console.log(`   expected:  ${expectedCanonical}`);
      }
    } else {
      errors++;
      console.log(`❌ ${frPath} [${tag}]`);
      if (!canonicalOk) {
        console.log(`   canonical: ${canonical}`);
        console.log(`   expected:  ${expectedCanonical}`);
      }
      if (!ogUrlOk) {
        console.log(`   og:url:    ${ogUrl}`);
        console.log(`   expected:  ${expectedCanonical}`);
      }
      for (const issue of hreflangIssues) {
        console.log(`   ${issue}`);
      }
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(
    `✅ OK: ${ok}  ⚠️ Warnings: ${warnings}  ❌ Errors: ${errors}  ⏭ Skipped: ${skipped}`,
  );
  console.log(`Total: ${frUrls.length}\n`);

  if (errors > 0) process.exit(1);
}

main();
