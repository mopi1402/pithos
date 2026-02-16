/**
 * @fileoverview Tests for homepage SEO metadata.
 * Validates: Requirements 2.1
 *
 * Verifies that the homepage contains the target keywords
 * "TypeScript utilities library" and "zero dependencies",
 * and that meta tags are correctly configured.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const websiteRoot = resolve(__dirname, "../..");

function readSource(relativePath: string): string {
  return readFileSync(resolve(websiteRoot, relativePath), "utf-8");
}

describe("Homepage SEO metadata", () => {
  const indexSource = readSource("src/pages/index.tsx");
  const configSource = readSource("docusaurus.config.ts");

  it('should contain "TypeScript utilities library" in Layout title or description', () => {
    const hasInTitle = /title.*TypeScript\s+Utilities\s+Library/i.test(indexSource);
    const hasInDescription = /TypeScript\s+utilities\s+library/i.test(indexSource);
    expect(hasInTitle || hasInDescription).toBe(true);
  });

  it('should contain "zero dependencies" in the homepage', () => {
    expect(/zero\s+dependenc/i.test(indexSource)).toBe(true);
  });

  it("should use Layout with title and description props", () => {
    expect(indexSource).toMatch(/<Layout[\s\S]*?title=/);
    expect(indexSource).toMatch(/<Layout[\s\S]*?description=/);
  });

  it("should include Open Graph meta tags via <Head>", () => {
    expect(indexSource).toMatch(/og:type/);
    expect(indexSource).toMatch(/og:url/);
  });

  it("should have global keywords metadata in docusaurus config", () => {
    expect(configSource).toMatch(/typescript/i);
    expect(configSource).toMatch(/zero dependencies/i);
    expect(configSource).toMatch(/lodash alternative/i);
  });

  it("should have twitter:card configured globally", () => {
    expect(configSource).toMatch(/twitter:card/);
    expect(configSource).toMatch(/summary_large_image/);
  });

  it("should have a social card image configured", () => {
    expect(configSource).toMatch(/image.*pithos-social-card/);
  });
});
