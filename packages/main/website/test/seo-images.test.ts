/**
 * Property-based tests for image SEO optimization.
 *
 * **Property 7: Image alt text presence**
 * **Property 20: Image optimization**
 * **Validates: Requirements 3.4, 7.5**
 *
 * For any image in the website, verifies:
 * - Alt text is present and non-empty
 * - Modern image formats (WebP, AVIF) are available for raster images
 */
import { test, fc } from "@fast-check/vitest";
import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, join, extname } from "node:path";

const WEBSITE_ROOT = resolve(__dirname, "..");
const DOCS_DIR = resolve(WEBSITE_ROOT, "docs");
const COMPARISONS_DIR = resolve(WEBSITE_ROOT, "comparisons");
const SRC_DIR = resolve(WEBSITE_ROOT, "src");

// --- Helpers ---

/** Recursively collect files matching extensions */
function collectFiles(dir: string, extensions: string[]): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== ".docusaurus") {
      results.push(...collectFiles(fullPath, extensions));
    } else if (entry.isFile() && extensions.includes(extname(entry.name).toLowerCase())) {
      results.push(fullPath);
    }
  }
  return results;
}

// --- Collect all image data ---
function extractMarkdownImages(content: string): Array<{ src: string; alt: string }> {
  const images: Array<{ src: string; alt: string }> = [];

  // Markdown syntax: ![alt](src)
  const mdRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let match;
  while ((match = mdRegex.exec(content)) !== null) {
    images.push({ alt: match[1], src: match[2] });
  }

  // MDX <Picture> component: <Picture src="..." alt="..." />
  const pictureRegex = /<Picture\s+[^>]*?src=["']([^"']+)["'][^>]*?alt=["']([^"']+)["'][^>]*/g;
  while ((match = pictureRegex.exec(content)) !== null) {
    images.push({ src: match[1], alt: match[2] });
  }
  // Also match alt before src
  const pictureRegex2 = /<Picture\s+[^>]*?alt=["']([^"']+)["'][^>]*?src=["']([^"']+)["'][^>]*/g;
  while ((match = pictureRegex2.exec(content)) !== null) {
    images.push({ src: match[2], alt: match[1] });
  }

  return images;
}

/** Extract image references from TSX files */
function extractTsxImages(content: string): Array<{ src: string; alt: string }> {
  const images: Array<{ src: string; alt: string }> = [];

  // <img ... alt="..." src="..." /> or <img ... src="..." alt="..." />
  const imgRegex = /<img\s[^>]*?(?:alt=["'{]([^"'}]*)["'}])[^>]*?(?:src=["'{]([^"'}]*)["'}])[^>]*/g;
  let match;
  while ((match = imgRegex.exec(content)) !== null) {
    images.push({ alt: match[1], src: match[2] });
  }
  // Also match src before alt
  const imgRegex2 = /<img\s[^>]*?(?:src=["'{]([^"'}]*)["'}])[^>]*?(?:alt=["'{]([^"'}]*)["'}])[^>]*/g;
  while ((match = imgRegex2.exec(content)) !== null) {
    images.push({ src: match[1], alt: match[2] });
  }

  // <Picture src="..." alt="..." />
  const pictureRegex = /<Picture\s[^>]*?src=["']([^"']+)["'][^>]*?alt=["']([^"']+)["'][^>]*/g;
  while ((match = pictureRegex.exec(content)) !== null) {
    images.push({ src: match[1], alt: match[2] });
  }
  const pictureRegex2 = /<Picture\s[^>]*?alt=["']([^"']+)["'][^>]*?src=["']([^"']+)["'][^>]*/g;
  while ((match = pictureRegex2.exec(content)) !== null) {
    images.push({ src: match[2], alt: match[1] });
  }

  return images;
}

// --- Collect all image data ---

const markdownFiles = [
  ...collectFiles(DOCS_DIR, [".md", ".mdx"]),
  ...collectFiles(COMPARISONS_DIR, [".md", ".mdx"]),
];

const tsxFiles = collectFiles(SRC_DIR, [".tsx"]);

/** All content images referenced in markdown and TSX (deduplicated) */
const allContentImages: Array<{ src: string; alt: string; file: string }> = [];
const seen = new Set<string>();

for (const file of markdownFiles) {
  const content = readFileSync(file, "utf-8");
  for (const img of extractMarkdownImages(content)) {
    const key = `${img.src}::${file}`;
    if (!seen.has(key)) {
      seen.add(key);
      allContentImages.push({ ...img, file: file.replace(WEBSITE_ROOT + "/", "") });
    }
  }
}

for (const file of tsxFiles) {
  const content = readFileSync(file, "utf-8");
  // Skip the Picture component definition itself
  if (file.includes("Picture/index.tsx")) continue;
  for (const img of extractTsxImages(content)) {
    const key = `${img.src}::${file}`;
    if (!seen.has(key)) {
      seen.add(key);
      allContentImages.push({ ...img, file: file.replace(WEBSITE_ROOT + "/", "") });
    }
  }
}

// --- Tests ---

describe("SEO Image Properties", () => {
  /**
   * Property 7: Image alt text presence
   * **Validates: Requirements 3.4**
   *
   * For any image referenced in content, the alt text must be present and non-empty.
   * Decorative images (alt="") in UI components are excluded — only content images
   * in docs, comparisons, and page-level components are checked.
   */
  describe("Property 7: Image alt text presence", () => {
    it("should have found content images to test", () => {
      expect(allContentImages.length).toBeGreaterThan(0);
    });

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, allContentImages.length - 1) })],
      { numRuns: Math.min(100, allContentImages.length) },
    )(
      "every content image should have a non-empty alt text",
      (index) => {
        const img = allContentImages[index];
        expect(
          img.alt.trim().length,
          `Image "${img.src}" in ${img.file} has empty alt text`,
        ).toBeGreaterThan(0);
      },
    );
  });

  /**
   * Property 20: Image optimization
   * **Validates: Requirements 7.5**
   *
   * For any content image rendered via the <Picture> component (which serves
   * modern formats), the generated directory must contain WebP and AVIF variants.
   * Decorative emoji icons, SVGs, and favicons are excluded since they don't
   * go through the Picture optimization pipeline.
   */
  describe("Property 20: Image optimization", () => {
    // Collect images referenced via <Picture> in docs and TSX — these are the
    // content images that the generate-images script processes into modern formats.
    const pictureRefs = allContentImages
      .filter((img) => img.src.startsWith("/img/generated/"))
      .map((img) => {
        // <Picture> src is like "/img/generated/evolve-tests-output" (no extension)
        // Generated files are at static/img/generated/evolve-tests-output-{width}.{format}
        const basePath = resolve(WEBSITE_ROOT, "static", img.src.slice(1));
        return { src: img.src, basePath, file: img.file };
      })
      // Deduplicate by src
      .filter((img, i, arr) => arr.findIndex((x) => x.src === img.src) === i);

    it("should have found Picture-referenced images to test", () => {
      expect(pictureRefs.length).toBeGreaterThan(0);
    });

    test.prop(
      [fc.integer({ min: 0, max: Math.max(0, pictureRefs.length - 1) })],
      { numRuns: Math.min(100, pictureRefs.length) },
    )(
      "every Picture-referenced image should have WebP and AVIF variants",
      (index) => {
        const img = pictureRefs[index];
        // Check for any generated width variant (widths vary per component usage)
        const dir = resolve(img.basePath, "..");
        const baseName = img.basePath.split("/").pop()!;
        const dirEntries = existsSync(dir) ? readdirSync(dir) : [];
        const variants = dirEntries.filter((f) => f.startsWith(baseName + "-"));

        const webpExists = variants.some((f) => f.endsWith(".webp"));
        const avifExists = variants.some((f) => f.endsWith(".avif"));

        expect(
          webpExists,
          `Image "${img.src}" (from ${img.file}) is missing WebP variants`,
        ).toBe(true);
        expect(
          avifExists,
          `Image "${img.src}" (from ${img.file}) is missing AVIF variants`,
        ).toBe(true);
      },
    );
  });
});
