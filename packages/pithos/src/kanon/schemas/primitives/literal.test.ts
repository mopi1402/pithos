import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { literal } from "./literal";
import { parse } from "../../core/parser";

describe("literal", () => {
  describe("string literal", () => {
    it("should accept exact string value", () => {
      const schema = literal("hello");

      expect(parse(schema, "hello").success).toBe(true);
    });

    it("should reject different string values", () => {
      const schema = literal("hello");

      expect(parse(schema, "world").success).toBe(false);
      expect(parse(schema, "Hello").success).toBe(false);
      expect(parse(schema, "HELLO").success).toBe(false);
      expect(parse(schema, "hello ").success).toBe(false);
      expect(parse(schema, " hello").success).toBe(false);
    });

    it("should reject non-string types", () => {
      const schema = literal("hello");

      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });

    it("should handle empty string", () => {
      const schema = literal("");

      expect(parse(schema, "").success).toBe(true);
      expect(parse(schema, " ").success).toBe(false);
    });

    it("should handle special characters in strings", () => {
      const schema = literal("hello world");

      expect(parse(schema, "hello world").success).toBe(true);
      expect(parse(schema, "helloworld").success).toBe(false);
    });
  });

  describe("number literal", () => {
    it("should accept exact number value", () => {
      const schema = literal(42);

      expect(parse(schema, 42).success).toBe(true);
    });

    it("should reject different number values", () => {
      const schema = literal(42);

      expect(parse(schema, 43).success).toBe(false);
      expect(parse(schema, 41).success).toBe(false);
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, -42).success).toBe(false);
    });

    it("should reject non-number types", () => {
      const schema = literal(42);

      expect(parse(schema, "42").success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });

    it("should handle zero", () => {
      const schema = literal(0);

      expect(parse(schema, 0).success).toBe(true);
      expect(parse(schema, -0).success).toBe(true);
      expect(parse(schema, 1).success).toBe(false);
    });

    it("should handle negative numbers", () => {
      const schema = literal(-42);

      expect(parse(schema, -42).success).toBe(true);
      expect(parse(schema, 42).success).toBe(false);
    });

    it("should handle floating point numbers", () => {
      const schema = literal(3.14);

      expect(parse(schema, 3.14).success).toBe(true);
      expect(parse(schema, 3.141).success).toBe(false);
    });
  });

  describe("boolean literal", () => {
    it("should accept exact boolean value", () => {
      const schemaTrue = literal(true);
      const schemaFalse = literal(false);

      expect(parse(schemaTrue, true).success).toBe(true);
      expect(parse(schemaFalse, false).success).toBe(true);
    });

    it("should reject opposite boolean value", () => {
      const schemaTrue = literal(true);
      const schemaFalse = literal(false);

      expect(parse(schemaTrue, false).success).toBe(false);
      expect(parse(schemaFalse, true).success).toBe(false);
    });

    it("should reject non-boolean types", () => {
      const schema = literal(true);

      expect(parse(schema, "true").success).toBe(false);
      expect(parse(schema, 1).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });
  });


  describe("error messages", () => {
    it("should return correct error message for invalid values", () => {
      const schema = literal("hello");

      const result = parse(schema, "world");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("hello");
        expect(result.error).toContain("string");
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Must be 'hello'";
      const schema = literal("hello", customMessage);

      const result = parse(schema, "world");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });
  });

  describe("edge cases", () => {
    it("should handle unicode strings", () => {
      const schema = literal("🚀");
      expect(parse(schema, "🚀").success).toBe(true);
      expect(parse(schema, "🎉").success).toBe(false);
    });

    it("should handle very long strings", () => {
      const longString = "a".repeat(1000);
      const schema = literal(longString);
      expect(parse(schema, longString).success).toBe(true);
      expect(parse(schema, longString + "a").success).toBe(false);
    });

    it("should handle Infinity and -Infinity", () => {
      const schema = literal(Infinity);
      expect(parse(schema, Infinity).success).toBe(true);
      expect(parse(schema, -Infinity).success).toBe(false);
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.string().filter((s) => s !== "hello")])(
    "[🎲] should reject any string not matching literal",
    (value) => {
      const schema = literal("hello");
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.integer().filter((n) => n !== 42)])(
    "[🎲] should reject any number not matching literal",
    (value) => {
      const schema = literal(42);
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] should reject any integer for string literal",
    (value) => {
      const schema = literal("test");
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] should reject any string for number literal",
    (value) => {
      const schema = literal(123);
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );
});
