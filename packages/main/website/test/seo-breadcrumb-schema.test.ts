import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

/**
 * Test suite for Schema.org BreadcrumbList validation
 *
 * Validates that:
 * - BreadcrumbList schema is present on all non-homepage pages
 * - BreadcrumbList schema is NOT present on the homepage
 * - BreadcrumbList schema is valid JSON-LD
 * - BreadcrumbList contains at least 2 items (home + current page)
 * - Each breadcrumb item has required fields (@type, position, name, item)
 */
describe("Schema.org BreadcrumbList", () => {
  const buildDir = path.join(__dirname, "../build");

  // Helper function to recursively get all HTML files
  function getHtmlFiles(dir: string, baseDir: string = dir): string[] {
    const files: string[] = [];
    
    if (!fs.existsSync(dir)) {
      return files;
    }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);

      if (entry.isDirectory()) {
        files.push(...getHtmlFiles(fullPath, baseDir));
      } else if (entry.isFile() && entry.name.endsWith(".html")) {
        files.push(relativePath);
      }
    }

    return files;
  }

  // Helper function to extract breadcrumb schemas from HTML
  function extractBreadcrumbSchemas(content: string) {
    const schemaMatches = content.match(
      /<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs
    );

    if (!schemaMatches) return [];

    return schemaMatches
      .map((match) => {
        const jsonMatch = match.match(/>(.*?)</s);
        if (!jsonMatch) return null;
        try {
          return JSON.parse(jsonMatch[1]);
        } catch {
          return null;
        }
      })
      .filter((schema) => schema && schema["@type"] === "BreadcrumbList");
  }

  const htmlFiles = getHtmlFiles(buildDir).filter(
    (file) => file !== "404.html"
  );

  it("should have BreadcrumbList schema on documentation pages", () => {
    const docPages = htmlFiles.filter(
      (file) =>
        (file.startsWith("guide/") ||
          file.startsWith("api/") ||
          file.startsWith("comparisons/")) &&
        file !== "index.html"
    );

    expect(docPages.length).toBeGreaterThan(0);

    docPages.forEach((file) => {
      const filePath = path.join(buildDir, file);
      const content = fs.readFileSync(filePath, "utf-8");

      // Check if BreadcrumbList schema is present
      expect(content, `File ${file} should contain BreadcrumbList`).toContain(
        '"@type":"BreadcrumbList"'
      );

      // Extract and validate the schema
      const breadcrumbSchemas = extractBreadcrumbSchemas(content);

      expect(
        breadcrumbSchemas.length,
        `File ${file} should have at least one BreadcrumbList schema`
      ).toBeGreaterThan(0);

      // Validate at least one breadcrumb schema
      const schema = breadcrumbSchemas[0];
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("BreadcrumbList");
      expect(schema.itemListElement).toBeDefined();
      expect(Array.isArray(schema.itemListElement)).toBe(true);
      expect(schema.itemListElement.length).toBeGreaterThanOrEqual(2);

      // Validate each breadcrumb item
      schema.itemListElement.forEach(
        (
          item: {
            "@type": string;
            position: number;
            name: string;
            item: string;
          },
          index: number
        ) => {
          expect(item["@type"], `Item ${index} in ${file}`).toBe("ListItem");
          expect(item.position, `Item ${index} in ${file}`).toBe(index + 1);
          expect(
            item.name,
            `Item ${index} in ${file} should have a name. Item: ${JSON.stringify(item)}`
          ).toBeTruthy();
          expect(typeof item.name).toBe("string");
          expect(item.name.length).toBeGreaterThan(0);
          expect(item.item).toBeTruthy();
          expect(typeof item.item).toBe("string");
          expect(item.item).toMatch(/^https:\/\/(early-access\.)?pithos\.dev/);
        }
      );
    });
  });

  it("should NOT have BreadcrumbList schema on homepage", () => {
    const homepagePath = path.join(buildDir, "index.html");

    if (fs.existsSync(homepagePath)) {
      const content = fs.readFileSync(homepagePath, "utf-8");

      // Homepage should not have BreadcrumbList
      expect(content).not.toContain('"@type":"BreadcrumbList"');
    }
  });

  it("should have valid breadcrumb hierarchy on nested pages", () => {
    // Test a deeply nested page
    const nestedPage = htmlFiles.find((file) =>
      file.includes("guide/modules/arkhe")
    );

    if (nestedPage) {
      const filePath = path.join(buildDir, nestedPage);
      const content = fs.readFileSync(filePath, "utf-8");

      const breadcrumbSchemas = extractBreadcrumbSchemas(content);

      // Find the most complete breadcrumb (the one with the most items)
      const completeBreadcrumb = breadcrumbSchemas.reduce((prev, current) =>
        current.itemListElement.length > prev.itemListElement.length
          ? current
          : prev
      );

      // Should start with Home
      expect(completeBreadcrumb.itemListElement[0].name).toBe("Home");
      expect(completeBreadcrumb.itemListElement[0].item).toMatch(
        /^https:\/\/(early-access\.)?pithos\.dev$/
      );

      // Should have proper hierarchy
      const items = completeBreadcrumb.itemListElement;
      expect(items.length).toBeGreaterThanOrEqual(3); // Home + at least 2 levels

      // Positions should be sequential
      items.forEach((item: { position: number }, index: number) => {
        expect(item.position).toBe(index + 1);
      });
    }
  });

  it("should have properly formatted breadcrumb names", () => {
    const modulePage = htmlFiles.find((file) =>
      file.includes("guide/modules/arkhe")
    );

    if (modulePage) {
      const filePath = path.join(buildDir, modulePage);
      const content = fs.readFileSync(filePath, "utf-8");

      const breadcrumbSchemas = extractBreadcrumbSchemas(content);

      const completeBreadcrumb = breadcrumbSchemas.reduce((prev, current) =>
        current.itemListElement.length > prev.itemListElement.length
          ? current
          : prev
      );

      // Check that names are properly formatted (not URL slugs)
      completeBreadcrumb.itemListElement.forEach((item: { name: string }) => {
        // Names should not contain hyphens (should be "Get Started" not "get-started")
        // Names should be capitalized
        expect(item.name).not.toMatch(/^[a-z]/); // Should not start with lowercase
        expect(item.name.length).toBeGreaterThan(0);
      });
    }
  });
});
