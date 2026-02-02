import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { int } from "./int";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("int", () => {
  describe("validation", () => {
    it("should accept valid integer values", () => {
      const schema = int();

      expect(parse(schema, 0).success).toBe(true);
      expect(parse(schema, 1).success).toBe(true);
      expect(parse(schema, -1).success).toBe(true);
      expect(parse(schema, 100).success).toBe(true);
      expect(parse(schema, -100).success).toBe(true);
      expect(parse(schema, Number.MAX_SAFE_INTEGER).success).toBe(true);
      expect(parse(schema, Number.MIN_SAFE_INTEGER).success).toBe(true);
    });

    it("should reject non-integer numbers", () => {
      const schema = int();

      expect(parse(schema, 3.14).success).toBe(false);
      expect(parse(schema, -3.14).success).toBe(false);
      expect(parse(schema, 0.1).success).toBe(false);
      expect(parse(schema, 0.0001).success).toBe(false);
      expect(parse(schema, 1.5).success).toBe(false);
      expect(parse(schema, -1.5).success).toBe(false);
    });

    it("should reject NaN", () => {
      const schema = int();

      expect(parse(schema, Number.NaN).success).toBe(false);
    });

    it("should reject Infinity and -Infinity", () => {
      const schema = int();

      expect(parse(schema, Infinity).success).toBe(false);
      expect(parse(schema, -Infinity).success).toBe(false);
    });

    it("should reject non-number primitive types", () => {
      const schema = int();

      expect(parse(schema, "123").success).toBe(false);
      expect(parse(schema, "0").success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, false).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, Symbol("test")).success).toBe(false);
      expect(parse(schema, BigInt(123)).success).toBe(false);
    });

    it("should reject complex types", () => {
      const schema = int();

      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
      expect(parse(schema, [1, 2, 3]).success).toBe(false);
      expect(parse(schema, () => {}).success).toBe(false);
      expect(parse(schema, new Date()).success).toBe(false);
      expect(parse(schema, new Map()).success).toBe(false);
      expect(parse(schema, new Set()).success).toBe(false);
      expect(parse(schema, /regex/).success).toBe(false);
    });

    it("should return correct error message for invalid values", () => {
      const schema = int();

      const result1 = parse(schema, 3.14);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.int);
      }

      const result2 = parse(schema, "123");
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(ERROR_MESSAGES_COMPOSITION.int);
      }

      const result3 = parse(schema, Number.NaN);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(ERROR_MESSAGES_COMPOSITION.int);
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Must be an integer";
      const schema = int(customMessage);

      const result1 = parse(schema, 3.14);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(customMessage);
      }

      const result2 = parse(schema, "123");
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(customMessage);
      }

      const result3 = parse(schema, Number.NaN);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(customMessage);
      }
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = int();

      const result1 = parse(schema, 42);
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(typeof result1.data).toBe("number");
        expect(Number.isInteger(result1.data)).toBe(true);
        expect(result1.data).toBe(42);
      }

      const result2 = parse(schema, -100);
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(typeof result2.data).toBe("number");
        expect(Number.isInteger(result2.data)).toBe(true);
        expect(result2.data).toBe(-100);
      }
    });
  });

  describe("singleton behavior", () => {
    it("should return same instance when called without message", () => {
      const schema1 = int();
      const schema2 = int();

      expect(schema1).toBe(schema2);
    });

    it("should return different instances when called with message", () => {
      const schema1 = int("Error 1");
      const schema2 = int("Error 2");

      expect(schema1).not.toBe(schema2);
    });

    it("should return different instance when one has message and other doesn't", () => {
      const schema1 = int();
      const schema2 = int("Custom error");

      expect(schema1).not.toBe(schema2);
    });
  });

  describe("edge cases", () => {
    it("should handle zero", () => {
      const schema = int();
      expect(parse(schema, 0).success).toBe(true);
    });

    it("should handle negative zero", () => {
      const schema = int();
      expect(parse(schema, -0).success).toBe(true);
    });

    it("should handle very large integers", () => {
      const schema = int();
      expect(parse(schema, Number.MAX_SAFE_INTEGER).success).toBe(true);
      expect(parse(schema, Number.MIN_SAFE_INTEGER).success).toBe(true);
    });

    it("should reject floating point numbers", () => {
      const schema = int();
      expect(parse(schema, 1).success).toBe(true);
      expect(parse(schema, 1.1).success).toBe(false);
      expect(parse(schema, 0.5).success).toBe(false);
      expect(parse(schema, -0.5).success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("Infinity edge cases", () => {
      it("[🎯] should reject Infinity (edge case: Infinity is not an integer)", () => {
        // Requirements: 13.4
        const schema = int();
        expect(parse(schema, Infinity).success).toBe(false);
      });

      it("[🎯] should reject -Infinity (edge case: -Infinity is not an integer)", () => {
        // Requirements: 13.4
        const schema = int();
        expect(parse(schema, -Infinity).success).toBe(false);
      });
    });

    describe("negative zero edge case", () => {
      it("[🎯] should accept -0 (edge case: negative zero is an integer)", () => {
        // Requirements: 13.5
        const schema = int();
        expect(parse(schema, -0).success).toBe(true);
      });

      it("[🎯] should return -0 as data when validating -0", () => {
        // Requirements: 13.5
        const schema = int();
        const result = parse(schema, -0);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(Object.is(result.data, -0)).toBe(true);
        }
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.integer()])(
    "[🎲] should accept any integer",
    (value) => {
      const schema = int();
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
        expect(Number.isInteger(result.data)).toBe(true);
      }
    }
  );

  itProp.prop([fc.double().filter((n) => !Number.isInteger(n) && !Number.isNaN(n))])(
    "[🎲] should reject any non-integer number",
    (value) => {
      const schema = int();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] should reject any string",
    (value) => {
      const schema = int();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.boolean()])(
    "[🎲] should reject any boolean",
    (value) => {
      const schema = int();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );
});
