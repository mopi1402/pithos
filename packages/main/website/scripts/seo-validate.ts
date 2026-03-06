#!/usr/bin/env npx tsx
/**
 * Standalone SEO validation script.
 *
 * Usage:
 *   npx tsx scripts/seo-validate.ts                    # validate from cache (existing generated files)
 *   npx tsx scripts/seo-validate.ts --fresh             # regenerate docs (doc:merge) then validate
 *   npx tsx scripts/seo-validate.ts --errors           # show errors only
 *   npx tsx scripts/seo-validate.ts --warnings         # show warnings only
 *   npx tsx scripts/seo-validate.ts --fail-on-error    # override: fail on errors
 *   npx tsx scripts/seo-validate.ts --max-keywords 8   # override: max keywords
 *
 * By default, reads the seo-validator plugin config from docusaurus.config.ts.
 */
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import {
  type SeoValidatorOptions,
  DEFAULT_OPTIONS,
  runValidation,
  reportIssues,
} from "../plugins/seo-validator-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const websiteRoot = resolve(__dirname, "..");

// ---------------------------------------------------------------------------
// Project-specific SEO options (single source of truth)
// ---------------------------------------------------------------------------

const PROJECT_OPTIONS: Partial<SeoValidatorOptions> = {
  contentDirs: ["docs", "comparisons", "../documentation/_generated/final"],
  minDescriptionLength: 50,
  maxDescriptionLength: 160,
  minInternalLinks: 2,
  maxInternalLinks: 30,
  keywordStuffingThreshold: 0.03,
  failOnError: false,
  excludePatterns: ["_category_.json", "index.md", "changelog.md"],
  keywordStuffingIgnore: ["pithos", "arkhe", "kanon", "zygos", "sphalma", "taphos"],
};

// ---------------------------------------------------------------------------
// CLI args parsing
// ---------------------------------------------------------------------------

function parseCLIArgs(): { overrides: Partial<SeoValidatorOptions>; filter: "all" | "errors" | "warnings"; fresh: boolean } {
  const args = process.argv.slice(2);
  const overrides: Partial<SeoValidatorOptions> = {};
  let filter: "all" | "errors" | "warnings" = "all";
  let fresh = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--errors":
        filter = "errors";
        break;
      case "--warnings":
        filter = "warnings";
        break;
      case "--fresh":
        fresh = true;
        break;
      case "--fail-on-error":
        overrides.failOnError = true;
        break;
      case "--no-fail-on-error":
        overrides.failOnError = false;
        break;
      case "--max-keywords":
        overrides.maxKeywords = Number(args[++i]);
        break;
      case "--threshold":
        overrides.keywordStuffingThreshold = Number(args[++i]);
        break;
    }
  }

  return { overrides, filter, fresh };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const { overrides: cliOverrides, filter, fresh } = parseCLIArgs();

  if (fresh) {
    const monorepoRoot = resolve(websiteRoot, "../../..");
    console.log("🔄 Regenerating docs (doc:merge)…");
    execSync("pnpm doc:merge", { cwd: monorepoRoot, stdio: "inherit" });
    console.log("");
  }

  const opts: SeoValidatorOptions = {
    ...DEFAULT_OPTIONS,
    ...PROJECT_OPTIONS,
    ...cliOverrides,
  };

  console.log(`📂 Scanning: ${opts.contentDirs.join(", ")} (from ${websiteRoot})`);

  const issues = runValidation(websiteRoot, opts);
  const { errors } = reportIssues(issues, filter);

  if (opts.failOnError && errors > 0) {
    process.exit(1);
  }
}

main();
