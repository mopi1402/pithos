/**
 * Validates the global SEO configuration in docusaurus.config.ts.
 *
 * **Validates: Requirements 1.8, 5.1**
 *
 * - Requirement 1.8: themeConfig.metadata contains global keywords, twitter:card, google-site-verification, max-snippet/max-image-preview
 * - Requirement 5.1: Schema.org Organization in headTags for the homepage
 */
import { describe, it, expect } from "vitest";
import config from "../docusaurus.config";

describe("SEO Global Configuration", () => {
  describe("themeConfig.metadata (Requirement 1.8)", () => {
    const themeConfig = config.themeConfig as Record<string, unknown>;
    const metadata = themeConfig.metadata as Array<{
      name: string;
      content: string;
    }>;

    it("should have a metadata array", () => {
      expect(Array.isArray(metadata)).toBe(true);
      expect(metadata.length).toBeGreaterThan(0);
    });

    it("should contain global keywords", () => {
      const keywordsMeta = metadata.find((m) => m.name === "keywords");
      expect(keywordsMeta).toBeDefined();
      expect(keywordsMeta!.content).toContain("typescript");
      expect(keywordsMeta!.content).toContain("utilities");
    });

    it("should contain twitter:card", () => {
      const twitterCard = metadata.find((m) => m.name === "twitter:card");
      expect(twitterCard).toBeDefined();
      expect(twitterCard!.content).toBe("summary_large_image");
    });

    it("should contain robots with max-snippet and max-image-preview", () => {
      const robots = metadata.find((m) => m.name === "robots");
      expect(robots).toBeDefined();
      expect(robots!.content).toContain("max-snippet:-1");
      expect(robots!.content).toContain("max-image-preview:large");
    });
  });

  describe("themeConfig.image", () => {
    it("should have a default social image configured", () => {
      const themeConfig = config.themeConfig as Record<string, unknown>;
      expect(themeConfig.image).toBeDefined();
      expect(typeof themeConfig.image).toBe("string");
      expect((themeConfig.image as string).length).toBeGreaterThan(0);
    });
  });

  describe("Schema.org Organization in headTags (Requirement 5.1)", () => {
    const headTags = config.headTags as Array<{
      tagName: string;
      attributes: Record<string, string>;
      innerHTML: string;
    }>;

    it("should have headTags defined", () => {
      expect(Array.isArray(headTags)).toBe(true);
      expect(headTags.length).toBeGreaterThan(0);
    });

    it("should contain a JSON-LD script tag", () => {
      const jsonLdTag = headTags.find(
        (tag) =>
          tag.tagName === "script" &&
          tag.attributes.type === "application/ld+json"
      );
      expect(jsonLdTag).toBeDefined();
    });

    it("should have a valid Schema.org Organization", () => {
      const jsonLdTag = headTags.find(
        (tag) =>
          tag.tagName === "script" &&
          tag.attributes.type === "application/ld+json"
      );
      const schema = JSON.parse(jsonLdTag!.innerHTML);

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("Organization");
      expect(schema.name).toBe("Pithos");
      expect(schema.url).toBe("https://pithos.dev");
      expect(schema.logo).toBeDefined();
      expect(typeof schema.logo).toBe("string");
      expect(schema.logo.length).toBeGreaterThan(0);
      expect(schema.description).toBeDefined();
      expect(typeof schema.description).toBe("string");
      expect(schema.description.length).toBeGreaterThan(0);
    });

    it("should have sameAs with at least GitHub and npm links", () => {
      const jsonLdTag = headTags.find(
        (tag) =>
          tag.tagName === "script" &&
          tag.attributes.type === "application/ld+json"
      );
      const schema = JSON.parse(jsonLdTag!.innerHTML);

      expect(Array.isArray(schema.sameAs)).toBe(true);
      expect(schema.sameAs.length).toBeGreaterThanOrEqual(2);
      expect(schema.sameAs.some((url: string) => url.includes("github.com"))).toBe(true);
      expect(schema.sameAs.some((url: string) => url.includes("npmjs.com"))).toBe(true);
    });
  });
});
