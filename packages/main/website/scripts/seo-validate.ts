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
// Extract config from docusaurus.config.ts
// ---------------------------------------------------------------------------

async function loadDocusaurusOptions(): Promise<Partial<SeoValidatorOptions>> {
  try {
    const configModule = await import("../docusaurus.config");
    const config = configModule.default;
    const plugins: unknown[] = config?.plugins ?? [];

    for (const plugin of plugins) {
      if (Array.isArray(plugin) && plugin.length >= 2) {
        const [pluginFn, pluginOpts] = plugin;
        // Match by function name or by checking if it has seo-validator options shape
        const fnName = typeof pluginFn === "function" ? pluginFn.name : "";
        if (
          fnName === "seoValidatorPlugin" ||
          (pluginOpts && typeof pluginOpts === "object" && "keywordStuffingThreshold" in pluginOpts)
        ) {
          return pluginOpts as Partial<SeoValidatorOptions>;
        }
      }
    }
  } catch {
    // Config not found or not parseable, use defaults
  }
  return {};
}

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
  const docusaurusOpts = await loadDocusaurusOptions();
  const { overrides: cliOverrides, filter, fresh } = parseCLIArgs();

  if (fresh) {
    const monorepoRoot = resolve(websiteRoot, "../../..");
    console.log("🔄 Regenerating docs (doc:merge)…");
    execSync("pnpm doc:merge", { cwd: monorepoRoot, stdio: "inherit" });
    console.log("");
  }

  const opts: SeoValidatorOptions = {
    ...DEFAULT_OPTIONS,
    ...docusaurusOpts,
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
