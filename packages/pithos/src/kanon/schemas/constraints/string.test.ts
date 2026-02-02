import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { addStringConstraints } from "./string";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";
import { EMAIL_REGEX, URL_REGEX, UUID_REGEX } from "../../core/consts/patterns";

describe("addStringConstraints", () => {
  const createBaseSchema = () => ({
    type: "string" as const,
    message: undefined,
    refinements: undefined,
    validator: (value: unknown) =>
      typeof value === "string" ? true : ERROR_MESSAGES_COMPOSITION.string,
  });

  it("should add all constraint methods to base schema", () => {
    const baseSchema = createBaseSchema();
    const schema = addStringConstraints(baseSchema);

    expect(schema.minLength).toBeDefined();
    expect(schema.maxLength).toBeDefined();
    expect(schema.length).toBeDefined();
    expect(schema.email).toBeDefined();
    expect(schema.url).toBeDefined();
    expect(schema.uuid).toBeDefined();
    expect(schema.pattern).toBeDefined();
    expect(schema.includes).toBeDefined();
    expect(schema.startsWith).toBeDefined();
    expect(schema.endsWith).toBeDefined();
  });

  describe("minLength", () => {
    it("should validate string with length >= min", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).minLength(5);

      expect(parse(schema, "hello")).toEqual({ success: true, data: "hello" });
      expect(parse(schema, "hello world")).toEqual({
        success: true,
        data: "hello world",
      });
    });

    it("should reject string with length < min", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).minLength(5);

      const result = parse(schema, "hi");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.minLength(5));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).minLength(5, "Too short");

      const result = parse(schema, "hi");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too short");
      }
    });

    it("should work with boundary values", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).minLength(3);

      expect(parse(schema, "abc")).toEqual({ success: true, data: "abc" });
      const result = parse(schema, "ab");
      expect(result.success).toBe(false);
    });
  });

  describe("maxLength", () => {
    it("should validate string with length <= max", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).maxLength(5);

      expect(parse(schema, "hello")).toEqual({ success: true, data: "hello" });
      expect(parse(schema, "hi")).toEqual({ success: true, data: "hi" });
    });

    it("should reject string with length > max", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).maxLength(5);

      const result = parse(schema, "hello world");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.maxLength(5));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).maxLength(5, "Too long");

      const result = parse(schema, "hello world");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too long");
      }
    });

    it("should work with boundary values", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).maxLength(3);

      expect(parse(schema, "abc")).toEqual({ success: true, data: "abc" });
      const result = parse(schema, "abcd");
      expect(result.success).toBe(false);
    });
  });

  describe("length", () => {
    it("should validate string with exact length", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).length(5);

      expect(parse(schema, "hello")).toEqual({ success: true, data: "hello" });
    });

    it("should reject string with different length", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).length(5);

      const result1 = parse(schema, "hi");
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.length(5));
      }

      const result2 = parse(schema, "hello world");
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(ERROR_MESSAGES_COMPOSITION.length(5));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).length(5, "Wrong length");

      const result = parse(schema, "hi");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Wrong length");
      }
    });

    it("should work with zero length", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).length(0);

      expect(parse(schema, "")).toEqual({ success: true, data: "" });
      const result = parse(schema, "a");
      expect(result.success).toBe(false);
    });
  });

  describe("email", () => {
    it("should validate valid email addresses", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).email();

      const validEmails = [
        "user@example.com",
        "test.email@domain.co.uk",
        "user+tag@example.com",
      ];

      validEmails.forEach((email) => {
        expect(EMAIL_REGEX.test(email)).toBe(true);
        expect(parse(schema, email)).toEqual({
          success: true,
          data: email,
        });
      });
    });

    it("should reject invalid email addresses", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).email();

      const invalidEmails = [
        "invalid",
        "@example.com",
        "user@",
        "user@example",
      ];

      invalidEmails.forEach((email) => {
        expect(EMAIL_REGEX.test(email)).toBe(false);
        const result = parse(schema, email);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.email);
        }
      });
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).email("Invalid email");

      const result = parse(schema, "invalid");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Invalid email");
      }
    });
  });

  describe("url", () => {
    it("should validate valid URLs", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).url();

      const validUrls = [
        "http://example.com",
        "https://example.com",
        "https://www.example.com/path?query=value",
      ];

      validUrls.forEach((url) => {
        expect(URL_REGEX.test(url)).toBe(true);
        expect(parse(schema, url)).toEqual({ success: true, data: url });
      });
    });

    it("should reject invalid URLs", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).url();

      const invalidUrls = ["not-a-url", "example.com", "ftp://example.com"];

      invalidUrls.forEach((url) => {
        expect(URL_REGEX.test(url)).toBe(false);
        const result = parse(schema, url);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.url);
        }
      });
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).url("Invalid URL");

      const result = parse(schema, "invalid");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Invalid URL");
      }
    });
  });

  describe("uuid", () => {
    it("should validate valid UUIDs", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).uuid();

      const validUuids = [
        "550e8400-e29b-41d4-a716-446655440000",
        "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
      ];

      validUuids.forEach((uuid) => {
        expect(UUID_REGEX.test(uuid)).toBe(true);
        expect(parse(schema, uuid)).toEqual({ success: true, data: uuid });
      });
    });

    it("should reject invalid UUIDs", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).uuid();

      const invalidUuids = [
        "not-a-uuid",
        "550e8400-e29b-41d4-a716",
        "550e8400e29b41d4a716446655440000",
      ];

      invalidUuids.forEach((uuid) => {
        expect(UUID_REGEX.test(uuid)).toBe(false);
        const result = parse(schema, uuid);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.uuid);
        }
      });
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).uuid("Invalid UUID");

      const result = parse(schema, "invalid");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Invalid UUID");
      }
    });
  });

  describe("pattern", () => {
    it("should validate string matching pattern", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).pattern(/^[A-Z]+$/);

      expect(parse(schema, "HELLO")).toEqual({ success: true, data: "HELLO" });
      expect(parse(schema, "ABC")).toEqual({ success: true, data: "ABC" });
    });

    it("should reject string not matching pattern", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).pattern(/^[A-Z]+$/);

      const result1 = parse(schema, "hello");
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(
          ERROR_MESSAGES_COMPOSITION.pattern(/^[A-Z]+$/)
        );
      }

      const result2 = parse(schema, "HELLO123");
      expect(result2.success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).pattern(
        /^[A-Z]+$/,
        "Must be uppercase"
      );

      const result = parse(schema, "hello");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Must be uppercase");
      }
    });

    it("should work with complex patterns", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).pattern(/^\d{3}-\d{2}$/);

      expect(parse(schema, "123-45")).toEqual({
        success: true,
        data: "123-45",
      });
      const result = parse(schema, "12345");
      expect(result.success).toBe(false);
    });
  });

  describe("includes", () => {
    it("should validate string containing substring", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).includes("world");

      expect(parse(schema, "hello world")).toEqual({
        success: true,
        data: "hello world",
      });
      expect(parse(schema, "world")).toEqual({ success: true, data: "world" });
    });

    it("should reject string not containing substring", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).includes("world");

      const result = parse(schema, "hello");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.includes("world"));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).includes(
        "world",
        "Missing"
      );

      const result = parse(schema, "hello");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Missing");
      }
    });

    it("should work with empty substring", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).includes("");

      expect(parse(schema, "any")).toEqual({ success: true, data: "any" });
    });
  });

  describe("startsWith", () => {
    it("should validate string starting with prefix", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).startsWith("hello");

      expect(parse(schema, "hello world")).toEqual({
        success: true,
        data: "hello world",
      });
      expect(parse(schema, "hello")).toEqual({ success: true, data: "hello" });
    });

    it("should reject string not starting with prefix", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).startsWith("hello");

      const result = parse(schema, "world");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          ERROR_MESSAGES_COMPOSITION.startsWith("hello")
        );
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).startsWith(
        "hello",
        "Wrong start"
      );

      const result = parse(schema, "world");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Wrong start");
      }
    });

    it("should work with empty prefix", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).startsWith("");

      expect(parse(schema, "any")).toEqual({ success: true, data: "any" });
    });
  });

  describe("endsWith", () => {
    it("should validate string ending with suffix", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).endsWith("world");

      expect(parse(schema, "hello world")).toEqual({
        success: true,
        data: "hello world",
      });
      expect(parse(schema, "world")).toEqual({ success: true, data: "world" });
    });

    it("should reject string not ending with suffix", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).endsWith("world");

      const result = parse(schema, "hello");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.endsWith("world"));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).endsWith(
        "world",
        "Wrong end"
      );

      const result = parse(schema, "hello");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Wrong end");
      }
    });

    it("should work with empty suffix", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema).endsWith("");

      expect(parse(schema, "any")).toEqual({ success: true, data: "any" });
    });
  });

  describe("chaining", () => {
    it("should allow chaining multiple constraints", () => {
      const baseSchema = createBaseSchema();
      const schema = addStringConstraints(baseSchema)
        .minLength(5)
        .maxLength(10)
        .includes("hello");

      expect(parse(schema, "hello")).toEqual({ success: true, data: "hello" });
      expect(parse(schema, "hello wor")).toEqual({
        success: true,
        data: "hello wor",
      });

      const result1 = parse(schema, "hi");
      expect(result1.success).toBe(false);

      const result2 = parse(schema, "hello world extra");
      expect(result2.success).toBe(false);

      const result3 = parse(schema, "world");
      expect(result3.success).toBe(false);
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.integer({ min: 0, max: 20 }), fc.string({ minLength: 0, maxLength: 50 })])(
      "[🎲] minLength - accepts strings with length >= min",
      (minLen, str) => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).minLength(minLen);
        const result = parse(schema, str);
        expect(result.success).toBe(str.length >= minLen);
      }
    );

    itProp.prop([fc.integer({ min: 0, max: 50 }), fc.string({ minLength: 0, maxLength: 50 })])(
      "[🎲] maxLength - accepts strings with length <= max",
      (maxLen, str) => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).maxLength(maxLen);
        const result = parse(schema, str);
        expect(result.success).toBe(str.length <= maxLen);
      }
    );

    itProp.prop([fc.integer({ min: 0, max: 20 }), fc.string({ minLength: 0, maxLength: 30 })])(
      "[🎲] length - accepts only strings with exact length",
      (len, str) => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).length(len);
        const result = parse(schema, str);
        expect(result.success).toBe(str.length === len);
      }
    );

    itProp.prop([fc.string({ minLength: 1, maxLength: 5 }), fc.string(), fc.string()])(
      "[🎲] includes - accepts strings containing substring",
      (needle, prefix, suffix) => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).includes(needle);
        const haystack = prefix + needle + suffix;
        const result = parse(schema, haystack);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.string({ minLength: 1, maxLength: 10 }), fc.string()])(
      "[🎲] startsWith - accepts strings starting with prefix",
      (prefix, suffix) => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).startsWith(prefix);
        const str = prefix + suffix;
        const result = parse(schema, str);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.string(), fc.string({ minLength: 1, maxLength: 10 })])(
      "[🎲] endsWith - accepts strings ending with suffix",
      (prefix, suffix) => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).endsWith(suffix);
        const str = prefix + suffix;
        const result = parse(schema, str);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] should be idempotent - parsing twice yields same result",
      (str) => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).minLength(0);
        const result1 = parse(schema, str);
        if (result1.success) {
          const result2 = parse(schema, result1.data);
          expect(result2.success).toBe(true);
          if (result2.success) {
            expect(result2.data).toBe(result1.data);
          }
        }
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] should not mutate input string",
      (str) => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).minLength(0);
        const original = str;
        parse(schema, str);
        expect(str).toBe(original);
      }
    );
  });

  describe("[🎯] Specification Tests", () => {
    describe("minLength/maxLength/length boundary conditions", () => {
      it("[🎯] should accept empty string when minLength(0) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).minLength(0);

        expect(parse(schema, "")).toEqual({ success: true, data: "" });
      });

      it("[🎯] should only accept empty string when maxLength(0) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).maxLength(0);

        expect(parse(schema, "")).toEqual({ success: true, data: "" });
        const result = parse(schema, "a");
        expect(result.success).toBe(false);
      });

      it("[🎯] should only accept empty string when length(0) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).length(0);

        expect(parse(schema, "")).toEqual({ success: true, data: "" });
        const result = parse(schema, "a");
        expect(result.success).toBe(false);
      });

      it("[🎯] should accept string with length exactly n when minLength(n) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const n = 5;
        const schema = addStringConstraints(baseSchema).minLength(n);

        expect(parse(schema, "abcde")).toEqual({ success: true, data: "abcde" });
      });

      it("[🎯] should reject string with length n-1 when minLength(n) - boundary: just below", () => {
        const baseSchema = createBaseSchema();
        const n = 5;
        const schema = addStringConstraints(baseSchema).minLength(n);

        const result = parse(schema, "abcd");
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.minLength(n));
        }
      });

      it("[🎯] should accept string with length exactly n when maxLength(n) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const n = 5;
        const schema = addStringConstraints(baseSchema).maxLength(n);

        expect(parse(schema, "abcde")).toEqual({ success: true, data: "abcde" });
      });

      it("[🎯] should reject string with length n+1 when maxLength(n) - boundary: just above", () => {
        const baseSchema = createBaseSchema();
        const n = 5;
        const schema = addStringConstraints(baseSchema).maxLength(n);

        const result = parse(schema, "abcdef");
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.maxLength(n));
        }
      });
    });

    describe("empty string edge cases", () => {
      it("[🎯] should accept any string when includes('') - edge case: empty search", () => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).includes("");

        expect(parse(schema, "")).toEqual({ success: true, data: "" });
        expect(parse(schema, "hello")).toEqual({ success: true, data: "hello" });
        expect(parse(schema, "any string")).toEqual({ success: true, data: "any string" });
      });

      it("[🎯] should accept any string when startsWith('') - edge case: empty prefix", () => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).startsWith("");

        expect(parse(schema, "")).toEqual({ success: true, data: "" });
        expect(parse(schema, "hello")).toEqual({ success: true, data: "hello" });
        expect(parse(schema, "any string")).toEqual({ success: true, data: "any string" });
      });

      it("[🎯] should accept any string when endsWith('') - edge case: empty suffix", () => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).endsWith("");

        expect(parse(schema, "")).toEqual({ success: true, data: "" });
        expect(parse(schema, "hello")).toEqual({ success: true, data: "hello" });
        expect(parse(schema, "any string")).toEqual({ success: true, data: "any string" });
      });

      it("[🎯] should accept any string when pattern(/(?:)/) - edge case: empty pattern", () => {
        const baseSchema = createBaseSchema();
        const schema = addStringConstraints(baseSchema).pattern(/(?:)/);

        expect(parse(schema, "")).toEqual({ success: true, data: "" });
        expect(parse(schema, "hello")).toEqual({ success: true, data: "hello" });
        expect(parse(schema, "any string")).toEqual({ success: true, data: "any string" });
      });
    });
  });
});
