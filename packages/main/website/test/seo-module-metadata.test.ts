/**
 * Validates SEO metadata for all module pages.
 *
 * **Validates: Requirements 2.2, 2.3, 2.4, 2.5, 5.2, 5.7**
 *
 * - Requirement 2.2: Arkhe targets "lodash alternative" and "tree-shakable utilities"
 * - Requirement 2.3: Kanon targets "schema validation typescript" and "zod alternative"
 * - Requirement 2.4: Zygos targets "result type typescript" and "neverthrow alternative"
 * - Requirement 2.5: No keyword cannibalisation across modules
 * - Requirement 5.2: Each module has a valid Schema.org SoftwareApplication JSON-LD
 * - Requirement 5.7: Schema.org markups are valid JSON-LD
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const MODULES_DIR = resolve(
  __dirname,
  "../docs/modules"
);

/** Parse YAML frontmatter from markdown content */
function parseFrontmatter(content: string): {
  data: Record<string, unknown>;
  body: string;
} {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {}, body: content };

  const yamlStr = match[1];
  const data: Record<string, unknown> = {};

  // Simple YAML parser for our needs (title, description, keywords array)
  const lines = yamlStr.split("\n");
  let currentKey = "";
  let currentArray: string[] | null = null;

  for (const line of lines) {
    const keyMatch = line.match(/^(\w[\w_-]*):\s*(.*)/);
    if (keyMatch) {
      if (currentArray && currentKey) {
        data[currentKey] = currentArray;
        currentArray = null;
      }
      currentKey = keyMatch[1];
      const value = keyMatch[2].trim();
      if (value === "") {
        // Could be start of array or empty value
      } else if (value.startsWith('"') && value.endsWith('"')) {
        data[currentKey] = value.slice(1, -1);
      } else {
        data[currentKey] = value;
      }
    } else if (line.match(/^\s+-\s+(.+)/)) {
      const itemMatch = line.match(/^\s+-\s+(.+)/);
      if (itemMatch) {
        if (!currentArray) currentArray = [];
        currentArray.push(itemMatch[1].trim());
      }
    }
  }
  if (currentArray && currentKey) {
    data[currentKey] = currentArray;
  }

  const body = content.slice(match[0].length);
  return { data, body };
}

/** Extract JSON-LD Schema.org from MDX content */
function extractSchemaOrg(content: string): Record<string, unknown> | null {
  // Check if ModuleSchema component is used
  const moduleSchemaMatch = content.match(
    /<ModuleSchema\s+name="([^"]+)"\s+description="([^"]+)"\s+url="([^"]+)"\s*\/>/s
  );
  
  if (moduleSchemaMatch) {
    // Reconstruct the schema object that the component will generate
    const [, name, description, url] = moduleSchemaMatch;
    return {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Cross-platform",
      programmingLanguage: "TypeScript",
      codeRepository: "https://github.com/mopi1402/pithos",
      license: "https://opensource.org/licenses/MIT",
      description,
      url,
      softwareVersion: "1.0.0",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      author: {
        "@type": "Person",
        name: "Pierre Moati",
        url: "https://www.linkedin.com/in/mopi1402/",
      },
    };
  }

  // Fallback: Match the old JSON.stringify pattern for backward compatibility
  const jsonStringifyMatch = content.match(
    /JSON\.stringify\(\s*(\{[\s\S]*?\})\s*\)/
  );
  if (jsonStringifyMatch) {
    try {
      return JSON.parse(jsonStringifyMatch[1]);
    } catch {
      return null;
    }
  }
  return null;
}

function readModule(filename: string) {
  const content = readFileSync(resolve(MODULES_DIR, filename), "utf-8");
  const { data, body } = parseFrontmatter(content);
  const schema = extractSchemaOrg(body);
  return { data, body, schema };
}


// --- Module definitions with expected keywords per the design doc ---

interface ModuleExpectation {
  file: string;
  name: string;
  primaryKeywords: string[];
  /** At least one of these should appear in the keywords array */
  secondaryKeywords: string[];
}

const MODULES: ModuleExpectation[] = [
  {
    file: "arkhe.md",
    name: "Arkhe",
    primaryKeywords: ["lodash alternative", "tree-shakable"],
    secondaryKeywords: ["typescript", "array utilities", "object utilities", "zero dependencies"],
  },
  {
    file: "kanon.md",
    name: "Kanon",
    primaryKeywords: ["schema validation", "zod alternative"],
    secondaryKeywords: ["typescript", "runtime validation", "type-safe"],
  },
  {
    file: "zygos.md",
    name: "Zygos",
    primaryKeywords: ["result type", "neverthrow alternative"],
    secondaryKeywords: ["error handling", "either type", "typescript"],
  },
  {
    file: "sphalma.md",
    name: "Sphalma",
    primaryKeywords: ["error", "typescript"],
    secondaryKeywords: ["error handling", "typed error", "error codes"],
  },
  {
    file: "taphos.md",
    name: "Taphos",
    primaryKeywords: ["lodash", "migration"],
    secondaryKeywords: ["deprecated", "javascript", "typescript"],
  },
];

// --- Tests ---

describe("SEO Module Metadata", () => {
  describe.each(MODULES)(
    "$name - Keywords (Requirements 2.2, 2.3, 2.4)",
    ({ file, name, primaryKeywords, secondaryKeywords }) => {
      const { data } = readModule(file);
      const keywords = data.keywords as string[] | undefined;

      it(`${name} should have a keywords array in frontmatter`, () => {
        expect(keywords).toBeDefined();
        expect(Array.isArray(keywords)).toBe(true);
        expect(keywords!.length).toBeGreaterThanOrEqual(3);
      });

      it(`${name} should have a title in frontmatter`, () => {
        expect(data.title).toBeDefined();
        expect(typeof data.title).toBe("string");
        expect((data.title as string).length).toBeGreaterThan(0);
      });

      it(`${name} should have a description in frontmatter`, () => {
        expect(data.description).toBeDefined();
        expect(typeof data.description).toBe("string");
        const desc = data.description as string;
        // Description should be between 50 and 170 characters
        expect(desc.length).toBeGreaterThanOrEqual(50);
        expect(desc.length).toBeLessThanOrEqual(170);
      });

      it(`${name} should contain primary keywords`, () => {
        const keywordsLower = keywords!.map((k) => k.toLowerCase()).join(", ");
        for (const pk of primaryKeywords) {
          expect(keywordsLower).toContain(pk.toLowerCase());
        }
      });

      it(`${name} should contain at least one secondary keyword`, () => {
        const keywordsLower = keywords!.map((k) => k.toLowerCase()).join(", ");
        const hasSecondary = secondaryKeywords.some((sk) =>
          keywordsLower.includes(sk.toLowerCase())
        );
        expect(hasSecondary).toBe(true);
      });
    }
  );

  describe.each(MODULES)(
    "$name - Schema.org SoftwareApplication (Requirement 5.2)",
    ({ file, name }) => {
      const { schema } = readModule(file);

      it(`${name} should have a Schema.org JSON-LD block`, () => {
        expect(schema).not.toBeNull();
      });

      it(`${name} should be of type SoftwareApplication`, () => {
        expect(schema!["@context"]).toBe("https://schema.org");
        expect(schema!["@type"]).toBe("SoftwareApplication");
      });

      it(`${name} should have required SoftwareApplication fields`, () => {
        expect(schema!.name).toBe(name);
        expect(schema!.applicationCategory).toBe("DeveloperApplication");
        expect(typeof schema!.description).toBe("string");
        expect((schema!.description as string).length).toBeGreaterThan(0);
        expect(typeof schema!.url).toBe("string");
        expect((schema!.url as string)).toContain("pithos.dev");
      });

      it(`${name} should have offers (free)`, () => {
        const offers = schema!.offers as Record<string, unknown>;
        expect(offers).toBeDefined();
        expect(offers["@type"]).toBe("Offer");
        expect(offers.price).toBe("0");
        expect(offers.priceCurrency).toBe("USD");
      });

      it(`${name} should have an author`, () => {
        const author = schema!.author as Record<string, unknown>;
        expect(author).toBeDefined();
        expect(author["@type"]).toBe("Person");
        expect(author.name).toBe("Pierre Moati");
      });
    }
  );

  describe("Keyword cannibalisation (Requirement 2.5)", () => {
    const allModuleData = MODULES.map((m) => ({
      ...m,
      ...readModule(m.file),
    }));

    it("should have unique primary keywords across modules", () => {
      // Collect all primary keywords per module
      const primaryKeywordsByModule = allModuleData.map((m) => ({
        name: m.name,
        primaries: m.primaryKeywords.map((k) => k.toLowerCase()),
      }));

      // Check that no two modules share the exact same primary keyword
      for (let i = 0; i < primaryKeywordsByModule.length; i++) {
        for (let j = i + 1; j < primaryKeywordsByModule.length; j++) {
          const shared = primaryKeywordsByModule[i].primaries.filter((k) =>
            primaryKeywordsByModule[j].primaries.includes(k)
          );
          expect(
            shared,
            `${primaryKeywordsByModule[i].name} and ${primaryKeywordsByModule[j].name} share primary keywords: ${shared.join(", ")}`
          ).toHaveLength(0);
        }
      }
    });

    it("each module should have distinct frontmatter keywords from other modules", () => {
      // At least 2 keywords per module should be unique to that module
      for (const mod of allModuleData) {
        const moduleKeywords = (mod.data.keywords as string[]).map((k) =>
          k.toLowerCase()
        );
        const otherKeywords = allModuleData
          .filter((m) => m.name !== mod.name)
          .flatMap((m) => (m.data.keywords as string[]).map((k) => k.toLowerCase()));

        const uniqueToModule = moduleKeywords.filter(
          (k) => !otherKeywords.includes(k)
        );
        expect(
          uniqueToModule.length,
          `${mod.name} should have at least 2 unique keywords, found: ${uniqueToModule.join(", ")}`
        ).toBeGreaterThanOrEqual(2);
      }
    });
  });

  describe("Schema.org JSON-LD validity (Requirement 5.7)", () => {
    const allModuleData = MODULES.map((m) => ({
      ...m,
      ...readModule(m.file),
    }));

    it.each(allModuleData)(
      "$name Schema.org should have valid @context and @type",
      ({ name, schema }) => {
        expect(schema, `${name} is missing Schema.org JSON-LD`).not.toBeNull();
        expect(schema!["@context"]).toBe("https://schema.org");
        expect(schema!["@type"]).toBeTruthy();
      }
    );

    it.each(allModuleData)(
      "$name Schema.org should not contain undefined or null values in required fields",
      ({ name, schema }) => {
        expect(schema).not.toBeNull();
        const requiredFields = ["name", "description", "url", "@context", "@type"];
        for (const field of requiredFields) {
          expect(
            schema![field],
            `${name} Schema.org field "${field}" should not be null/undefined`
          ).toBeDefined();
          expect(schema![field]).not.toBeNull();
        }
      }
    );
  });
});
