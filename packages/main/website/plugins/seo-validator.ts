/**
 * Docusaurus plugin that validates SEO best practices at build time.
 * Delegates all logic to seo-validator-core.ts.
 */
import type { LoadContext, Plugin } from "@docusaurus/types";
import {
  type SeoValidatorOptions,
  DEFAULT_OPTIONS,
  runValidation,
  reportIssues,
} from "./seo-validator-core";

export type { SeoValidatorOptions };

export default function seoValidatorPlugin(
  _context: LoadContext,
  options?: unknown,
): Plugin {
  const opts: SeoValidatorOptions = { ...DEFAULT_OPTIONS, ...(options as Partial<SeoValidatorOptions>) };

  return {
    name: "seo-validator",

    async postBuild({ siteDir }) {
      const issues = runValidation(siteDir, opts);
      const { errors } = reportIssues(issues);

      if (opts.failOnError && errors > 0) {
        throw new Error(
          `SEO Validator: ${errors} critical error(s) found. Fix them or set failOnError: false.`,
        );
      }
    },
  };
}
