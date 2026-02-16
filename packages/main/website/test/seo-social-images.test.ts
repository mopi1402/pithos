/**
 * SEO Test: Social Images Configuration
 * Feature: pithos-seo-improvement
 *
 * **Validates: Requirements 11.11, 11.12**
 *
 * - Requirement 11.11: Open Graph images for each module
 * - Requirement 11.12: Twitter Cards with summary_large_image
 */

import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DOCS_DIR = path.join(__dirname, "../docs");
const STATIC_IMG_DIR = path.join(__dirname, "../static/img/social");

describe("Social Images Configuration", () => {
  const modulePages = [
    { file: "modules/arkhe.md", expectedImage: "/img/social/arkhe-card.jpg" },
    { file: "modules/kanon.md", expectedImage: "/img/social/kanon-card.jpg" },
    { file: "modules/zygos.md", expectedImage: "/img/social/zygos-card.jpg" },
    {
      file: "modules/sphalma.md",
      expectedImage: "/img/social/sphalma-card.jpg",
    },
    {
      file: "modules/taphos.md",
      expectedImage: "/img/social/taphos-card.jpg",
    },
  ];

  describe("Frontmatter Image Configuration", () => {
    modulePages.forEach(({ file, expectedImage }) => {
      it(`should have image field in ${file} frontmatter`, () => {
        const filePath = path.join(DOCS_DIR, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const { data: frontmatter } = matter(content);

        expect(frontmatter.image).toBeDefined();
        expect(frontmatter.image).toBe(expectedImage);
      });
    });
  });

  describe("Image Files Existence", () => {
    const imageFiles = [
      "arkhe-card.jpg",
      "kanon-card.jpg",
      "zygos-card.jpg",
      "sphalma-card.jpg",
      "taphos-card.jpg",
    ];

    imageFiles.forEach((imageFile) => {
      it(`should have ${imageFile} in static/img/social/`, () => {
        const imagePath = path.join(STATIC_IMG_DIR, imageFile);
        expect(fs.existsSync(imagePath)).toBe(true);
      });
    });
  });

  describe("Twitter Card Global Configuration", () => {
    it("should have twitter:card set to summary_large_image in docusaurus.config.ts", () => {
      const configPath = path.join(__dirname, "../docusaurus.config.ts");
      const configContent = fs.readFileSync(configPath, "utf-8");

      expect(configContent).toContain('name: "twitter:card"');
      expect(configContent).toContain('content: "summary_large_image"');
    });

    it("should have og:type set to website in docusaurus.config.ts", () => {
      const configPath = path.join(__dirname, "../docusaurus.config.ts");
      const configContent = fs.readFileSync(configPath, "utf-8");

      expect(configContent).toContain('property: "og:type"');
      expect(configContent).toContain('content: "website"');
    });
  });

  describe("Image Format Validation", () => {
    const imageFiles = [
      "arkhe-card.jpg",
      "kanon-card.jpg",
      "zygos-card.jpg",
      "sphalma-card.jpg",
      "taphos-card.jpg",
    ];

    imageFiles.forEach((imageFile) => {
      it(`${imageFile} should be a valid image file`, () => {
        const imagePath = path.join(STATIC_IMG_DIR, imageFile);
        const stats = fs.statSync(imagePath);

        // Check file exists and has content
        expect(stats.isFile()).toBe(true);
        expect(stats.size).toBeGreaterThan(0);

        // Check file extension is jpg or png
        const ext = path.extname(imageFile).toLowerCase();
        expect([".jpg", ".jpeg", ".png"]).toContain(ext);
      });
    });
  });

  describe("Frontmatter Completeness", () => {
    modulePages.forEach(({ file }) => {
      it(`${file} should have complete SEO metadata including image`, () => {
        const filePath = path.join(DOCS_DIR, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const { data: frontmatter } = matter(content);

        // Check all required SEO fields
        expect(frontmatter.title).toBeDefined();
        expect(frontmatter.description).toBeDefined();
        expect(frontmatter.keywords).toBeDefined();
        expect(frontmatter.image).toBeDefined();

        // Verify image path format
        expect(frontmatter.image).toMatch(/^\/img\/social\/.+\.(jpg|jpeg|png)$/);
      });
    });
  });
});
