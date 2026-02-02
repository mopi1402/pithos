import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { string } from "./string";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("string", () => {
  describe("validation", () => {
    it("should accept valid string values", () => {
      const schema = string();

      expect(parse(schema, "").success).toBe(true);
      expect(parse(schema, "hello").success).toBe(true);
      expect(parse(schema, "123").success).toBe(true);
      expect(parse(schema, "true").success).toBe(true);
      expect(parse(schema, "false").success).toBe(true);
      expect(parse(schema, "null").success).toBe(true);
      expect(parse(schema, "undefined").success).toBe(true);
      expect(parse(schema, " ").success).toBe(true);
      expect(parse(schema, "   ").success).toBe(true);
      expect(parse(schema, "\n").success).toBe(true);
      expect(parse(schema, "\t").success).toBe(true);
      expect(parse(schema, "🎉").success).toBe(true);
      expect(parse(schema, "émojis 🚀").success).toBe(true);
    });

    it("should reject non-string primitive types", () => {
      const schema = string();

      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, 1).success).toBe(false);
      expect(parse(schema, -1).success).toBe(false);
      expect(parse(schema, 3.14).success).toBe(false);
      expect(parse(schema, Infinity).success).toBe(false);
      expect(parse(schema, -Infinity).success).toBe(false);
      expect(parse(schema, Number.NaN).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, false).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
    });

    it("should reject complex types", () => {
      const schema = string();

      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
      expect(parse(schema, [1, 2, 3]).success).toBe(false);
      expect(parse(schema, () => {}).success).toBe(false);
      expect(parse(schema, Symbol("test")).success).toBe(false);
      expect(parse(schema, new Date()).success).toBe(false);
      expect(parse(schema, new Map()).success).toBe(false);
      expect(parse(schema, new Set()).success).toBe(false);
      expect(parse(schema, /regex/).success).toBe(false);
      expect(parse(schema, BigInt(123)).success).toBe(false);
    });

    it("should return correct error message for invalid values", () => {
      const schema = string();

      const result1 = parse(schema, 123);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
      }

      const result2 = parse(schema, true);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
      }

      const result3 = parse(schema, null);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Must be a string";
      const schema = string(customMessage);

      const result1 = parse(schema, 123);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(customMessage);
      }

      const result2 = parse(schema, true);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(customMessage);
      }

      const result3 = parse(schema, null);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(customMessage);
      }
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = string();

      const result1 = parse(schema, "hello");
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(typeof result1.data).toBe("string");
        expect(result1.data).toBe("hello");
      }

      const result2 = parse(schema, "");
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(typeof result2.data).toBe("string");
        expect(result2.data).toBe("");
      }
    });
  });

  describe("singleton behavior", () => {
    it("should return same instance when called without message", () => {
      const schema1 = string();
      const schema2 = string();

      expect(schema1).toBe(schema2);
    });

    it("should return different instances when called with message", () => {
      const schema1 = string("Error 1");
      const schema2 = string("Error 2");

      expect(schema1).not.toBe(schema2);
    });

    it("should return different instance when one has message and other doesn't", () => {
      const schema1 = string();
      const schema2 = string("Custom error");

      expect(schema1).not.toBe(schema2);
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      const schema = string();
      expect(parse(schema, "").success).toBe(true);
    });

    it("should handle very long strings", () => {
      const schema = string();
      const longString = "a".repeat(10000);
      expect(parse(schema, longString).success).toBe(true);
    });

    it("should handle strings with special characters", () => {
      const schema = string();
      const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
      expect(parse(schema, specialChars).success).toBe(true);
    });

    it("should handle unicode strings", () => {
      const schema = string();
      expect(parse(schema, "🚀🎉🌟").success).toBe(true);
      expect(parse(schema, "émojis 🚀").success).toBe(true);
      expect(parse(schema, "中文").success).toBe(true);
      expect(parse(schema, "日本語").success).toBe(true);
      expect(parse(schema, "العربية").success).toBe(true);
    });

    it("should handle string objects (boxed strings)", () => {
      const schema = string();
      const boxedString = new String("test");
      expect(parse(schema, boxedString).success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("singleton pattern", () => {
      it("[🎯] should return same instance when called without message (optimization: singleton)", () => {
        // Requirements: 20.1
        const schema1 = string();
        const schema2 = string();
        const schema3 = string();

        expect(schema1).toBe(schema2);
        expect(schema2).toBe(schema3);
        expect(schema1).toBe(schema3);
      });

      it("[🎯] should return different instances when called with different messages (boundary: no singleton with message)", () => {
        // Requirements: 20.2
        const schema1 = string("Error 1");
        const schema2 = string("Error 2");
        const schema3 = string("Error 3");

        expect(schema1).not.toBe(schema2);
        expect(schema2).not.toBe(schema3);
        expect(schema1).not.toBe(schema3);
      });

      it("[🎯] should return different instance when one has message and other doesn't", () => {
        // Requirements: 20.2
        const schemaWithoutMessage = string();
        const schemaWithMessage = string("Custom error");

        expect(schemaWithoutMessage).not.toBe(schemaWithMessage);
      });

      it("[🎯] should return same instance even with same message (no deduplication)", () => {
        // Requirements: 20.2 - each call with message creates new instance
        const schema1 = string("Same message");
        const schema2 = string("Same message");

        // Even with same message, different instances are created
        expect(schema1).not.toBe(schema2);
      });
    });

    describe("boxed primitives", () => {
      it("[🎯] should reject boxed String object (edge case: boxed primitives)", () => {
        // Requirements: 13.1
        const schema = string();
        const boxedString = new String("test");
        expect(parse(schema, boxedString).success).toBe(false);
      });

      it("[🎯] should reject boxed String with empty value", () => {
        // Requirements: 13.1
        const schema = string();
        const boxedString = new String("");
        expect(parse(schema, boxedString).success).toBe(false);
      });
    });

    describe("special string values", () => {
      it("[🎯] should accept string with null character (edge case: null character)", () => {
        // Requirements: 29.7
        const schema = string();
        const stringWithNull = "hello\0world";
        const result = parse(schema, stringWithNull);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(stringWithNull);
          expect(result.data.includes("\0")).toBe(true);
        }
      });

      it("[🎯] should accept string containing only null character", () => {
        // Requirements: 29.7
        const schema = string();
        const nullOnly = "\0";
        const result = parse(schema, nullOnly);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(nullOnly);
          expect(result.data.length).toBe(1);
        }
      });

      it("[🎯] should accept string with multiple null characters", () => {
        // Requirements: 29.7
        const schema = string();
        const multipleNulls = "\0\0\0";
        const result = parse(schema, multipleNulls);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(multipleNulls);
          expect(result.data.length).toBe(3);
        }
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.string()])(
    "[🎲] should accept any string",
    (value) => {
      const schema = string();
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    }
  );

  itProp.prop([fc.string({ unit: "grapheme" })])(
    "[🎲] should accept any unicode string",
    (value) => {
      const schema = string();
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] should reject any integer",
    (value) => {
      const schema = string();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.boolean()])(
    "[🎲] should reject any boolean",
    (value) => {
      const schema = string();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.dictionary(fc.string(), fc.anything())])(
    "[🎲] should reject any object",
    (value) => {
      const schema = string();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );
});
