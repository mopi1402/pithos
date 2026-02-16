/**
 * Property-based tests for asset minification in the production build.
 *
 * **Property 21: Asset minification**
 * **Validates: Requirements 7.6**
 *
 * For any CSS or JS asset in the production build, verifies that the file
 * is minified (no excessive whitespace, no multi-line formatting).
 */
import { test, fc } from "@fast-check/vitest";
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const BUILD_ASSETS = resolve(__dirname, "..", "build", "assets");
const JS_DIR = resolve(BUILD_ASSETS, "js");
const CSS_DIR = resolve(BUILD_ASSETS, "css");

/** Collect all files in a directory (non-recursive) matching an extension */
function collectAssets(dir: string, ext: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(ext) && !f.endsWith(".LICENSE.txt"))
    .map((f) => join(dir, f));
}

const jsFiles = collectAssets(JS_DIR, ".js");
const cssFiles = collectAssets(CSS_DIR, ".css");

/**
 * Heuristic: a minified file has a very high ratio of content per line.
 * Minified JS/CSS typically has very few newlines relative to file size.
 * We check that the average line length is above a threshold, which
 * indicates the file has been minified (not pretty-printed).
 */
function isMinified(content: string): boolean {
  if (content.length === 0) return true;
  const lines = content.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length === 0) return true;
  // Small files (< 500 chars) are considered minified if they have few lines
  if (content.length < 500) return lines.length <= 5;
  // For larger files, the average non-empty line should be long for minified code
  const avgLineLength = content.length / lines.length;
  return avgLineLength > 200;
}

describe("SEO Asset Minification Properties", () => {
  /**
   * Property 21: Asset minification
   * **Validates: Requirements 7.6**
   *
   * For any JS asset in the production build, the file content should be minified.
   */
  describe("Property 21: JS asset minification", () => {
    it("should have JS assets in the build directory", () => {
      expect(jsFiles.length).toBeGreaterThan(0);
    });

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, jsFiles.length - 1) })],
      { numRuns: Math.min(50, jsFiles.length) },
    )(
      "every JS asset should be minified",
      (index) => {
        const file = jsFiles[index];
        const content = readFileSync(file, "utf-8");
        expect(
          isMinified(content),
          `JS file "${file.split("/").pop()}" does not appear to be minified`,
        ).toBe(true);
      },
    );
  });

  /**
   * Property 21: CSS asset minification
   * **Validates: Requirements 7.6**
   *
   * For any CSS asset in the production build, the file content should be minified.
   */
  describe("Property 21: CSS asset minification", () => {
    it("should have CSS assets in the build directory", () => {
      expect(cssFiles.length).toBeGreaterThan(0);
    });

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, cssFiles.length - 1) })],
      { numRuns: Math.min(50, cssFiles.length) },
    )(
      "every CSS asset should be minified",
      (index) => {
        const file = cssFiles[index];
        const content = readFileSync(file, "utf-8");
        expect(
          isMinified(content),
          `CSS file "${file.split("/").pop()}" does not appear to be minified`,
        ).toBe(true);
      },
    );
  });

  /**
   * Additional check: JS assets should use content hashing in filenames
   * for effective cache busting (supports Requirement 7.7 cache strategy).
   */
  describe("JS assets use content hashing for cache busting", () => {
    it("JS filenames should contain a hash segment", () => {
      const hashPattern = /\.[a-f0-9]{8}\./;
      for (const file of jsFiles.slice(0, 20)) {
        const filename = file.split("/").pop()!;
        expect(
          hashPattern.test(filename),
          `JS file "${filename}" does not contain a content hash`,
        ).toBe(true);
      }
    });
  });
});
