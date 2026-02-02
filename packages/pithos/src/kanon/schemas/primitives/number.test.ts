import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { number } from "./number";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("number", () => {
  describe("validation", () => {
    it("should accept valid number values", () => {
      const schema = number();

      expect(parse(schema, 0).success).toBe(true);
      expect(parse(schema, 1).success).toBe(true);
      expect(parse(schema, -1).success).toBe(true);
      expect(parse(schema, 3.14).success).toBe(true);
      expect(parse(schema, -3.14).success).toBe(true);
      expect(parse(schema, 100).success).toBe(true);
      expect(parse(schema, -100).success).toBe(true);
      expect(parse(schema, 0.1).success).toBe(true);
      expect(parse(schema, 0.0001).success).toBe(true);
      expect(parse(schema, 1e10).success).toBe(true);
      expect(parse(schema, -1e10).success).toBe(true);
    });

    it("should reject NaN", () => {
      const schema = number();

      expect(parse(schema, Number.NaN).success).toBe(false);
    });

    it("should accept Infinity and -Infinity", () => {
      const schema = number();

      expect(parse(schema, Infinity).success).toBe(true);
      expect(parse(schema, -Infinity).success).toBe(true);
    });

    it("should reject non-number primitive types", () => {
      const schema = number();

      expect(parse(schema, "123").success).toBe(false);
      expect(parse(schema, "0").success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, false).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
    });

    it("should reject complex types", () => {
      const schema = number();

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
      const schema = number();

      const result1 = parse(schema, "123");
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.number);
      }

      const result2 = parse(schema, Number.NaN);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(ERROR_MESSAGES_COMPOSITION.number);
      }

      const result3 = parse(schema, null);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(ERROR_MESSAGES_COMPOSITION.number);
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Must be a number";
      const schema = number(customMessage);

      const result1 = parse(schema, "123");
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(customMessage);
      }

      const result2 = parse(schema, Number.NaN);
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
      const schema = number();

      const result1 = parse(schema, 42);
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(typeof result1.data).toBe("number");
        expect(result1.data).toBe(42);
      }

      const result2 = parse(schema, 3.14);
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(typeof result2.data).toBe("number");
        expect(result2.data).toBe(3.14);
      }
    });
  });

  describe("singleton behavior", () => {
    it("should return same instance when called without message", () => {
      const schema1 = number();
      const schema2 = number();

      expect(schema1).toBe(schema2);
    });

    it("should return different instances when called with message", () => {
      const schema1 = number("Error 1");
      const schema2 = number("Error 2");

      expect(schema1).not.toBe(schema2);
    });

    it("should return different instance when one has message and other doesn't", () => {
      const schema1 = number();
      const schema2 = number("Custom error");

      expect(schema1).not.toBe(schema2);
    });
  });

  describe("edge cases", () => {
    it("should handle zero", () => {
      const schema = number();
      expect(parse(schema, 0).success).toBe(true);
    });

    it("should handle negative zero", () => {
      const schema = number();
      expect(parse(schema, -0).success).toBe(true);
    });

    it("should handle very large numbers", () => {
      const schema = number();
      expect(parse(schema, Number.MAX_VALUE).success).toBe(true);
      expect(parse(schema, Number.MIN_VALUE).success).toBe(true);
    });

    it("should handle very small numbers", () => {
      const schema = number();
      expect(parse(schema, 1e-10).success).toBe(true);
      expect(parse(schema, -1e-10).success).toBe(true);
    });

    it("should handle scientific notation", () => {
      const schema = number();
      expect(parse(schema, 1e10).success).toBe(true);
      expect(parse(schema, 1e-10).success).toBe(true);
      expect(parse(schema, -1e10).success).toBe(true);
    });

    it("should handle number objects (boxed numbers)", () => {
      const schema = number();
      const boxedNumber = new Number(42);
      expect(parse(schema, boxedNumber).success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("singleton pattern", () => {
      it("[🎯] should return same instance when called without message (optimization: singleton)", () => {
        // Requirements: 20.3
        const schema1 = number();
        const schema2 = number();
        const schema3 = number();

        expect(schema1).toBe(schema2);
        expect(schema2).toBe(schema3);
        expect(schema1).toBe(schema3);
      });

      it("[🎯] should return different instances when called with different messages (boundary: no singleton with message)", () => {
        // Requirements: 20.3
        const schema1 = number("Error 1");
        const schema2 = number("Error 2");
        const schema3 = number("Error 3");

        expect(schema1).not.toBe(schema2);
        expect(schema2).not.toBe(schema3);
        expect(schema1).not.toBe(schema3);
      });

      it("[🎯] should return different instance when one has message and other doesn't", () => {
        // Requirements: 20.3
        const schemaWithoutMessage = number();
        const schemaWithMessage = number("Custom error");

        expect(schemaWithoutMessage).not.toBe(schemaWithMessage);
      });

      it("[🎯] should return same instance even with same message (no deduplication)", () => {
        // Requirements: 20.3 - each call with message creates new instance
        const schema1 = number("Same message");
        const schema2 = number("Same message");

        // Even with same message, different instances are created
        expect(schema1).not.toBe(schema2);
      });
    });

    describe("boxed primitives", () => {
      it("[🎯] should reject boxed Number object (edge case: boxed primitives)", () => {
        // Requirements: 13.1 (applies to all primitives)
        const schema = number();
        const boxedNumber = new Number(42);
        expect(parse(schema, boxedNumber).success).toBe(false);
      });

      it("[🎯] should reject boxed Number with zero value", () => {
        // Requirements: 13.1
        const schema = number();
        const boxedNumber = new Number(0);
        expect(parse(schema, boxedNumber).success).toBe(false);
      });
    });

    describe("NaN and Infinity", () => {
      it("[🎯] should reject NaN (edge case: NaN is not a valid number)", () => {
        // Requirements: 13.2
        const schema = number();
        expect(parse(schema, Number.NaN).success).toBe(false);
      });

      it("[🎯] should accept Infinity (edge case: Infinity is a valid number)", () => {
        // Requirements: 13.3
        const schema = number();
        expect(parse(schema, Infinity).success).toBe(true);
      });

      it("[🎯] should accept -Infinity (edge case: -Infinity is a valid number)", () => {
        // Requirements: 13.3
        const schema = number();
        expect(parse(schema, -Infinity).success).toBe(true);
      });
    });

    describe("JavaScript special number values", () => {
      it("[🎯] should accept -0 (edge case: negative zero)", () => {
        // Requirements: 29.1
        const schema = number();
        const result = parse(schema, -0);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(Object.is(result.data, -0)).toBe(true);
        }
      });

      it("[🎯] should accept Number.MAX_VALUE (edge case: max value)", () => {
        // Requirements: 29.2
        const schema = number();
        const result = parse(schema, Number.MAX_VALUE);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(Number.MAX_VALUE);
        }
      });

      it("[🎯] should accept Number.MIN_VALUE (edge case: min positive value)", () => {
        // Requirements: 29.3
        const schema = number();
        const result = parse(schema, Number.MIN_VALUE);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(Number.MIN_VALUE);
        }
      });

      it("[🎯] should accept Number.MAX_SAFE_INTEGER (edge case: max safe integer)", () => {
        // Requirements: 29.4
        const schema = number();
        const result = parse(schema, Number.MAX_SAFE_INTEGER);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(Number.MAX_SAFE_INTEGER);
        }
      });

      it("[🎯] should accept Number.MIN_SAFE_INTEGER (edge case: min safe integer)", () => {
        // Requirements: 29.5
        const schema = number();
        const result = parse(schema, Number.MIN_SAFE_INTEGER);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(Number.MIN_SAFE_INTEGER);
        }
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.double({ noNaN: true })])(
    "[🎲] should accept any valid number (excluding NaN)",
    (value) => {
      const schema = number();
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] should accept any integer",
    (value) => {
      const schema = number();
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] should reject any string",
    (value) => {
      const schema = number();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.boolean()])(
    "[🎲] should reject any boolean",
    (value) => {
      const schema = number();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.bigInt()])(
    "[🎲] should reject any bigint",
    (value) => {
      const schema = number();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );
});
