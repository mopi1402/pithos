import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { bigint } from "./bigint";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("bigint", () => {
  describe("validation", () => {
    it("should accept valid bigint values", () => {
      const schema = bigint();

      expect(parse(schema, BigInt(0)).success).toBe(true);
      expect(parse(schema, BigInt(1)).success).toBe(true);
      expect(parse(schema, BigInt(-1)).success).toBe(true);
      expect(parse(schema, BigInt(100)).success).toBe(true);
      expect(parse(schema, BigInt(-100)).success).toBe(true);
      expect(parse(schema, BigInt("12345678901234567890")).success).toBe(true);
      expect(parse(schema, 0n).success).toBe(true);
      expect(parse(schema, 1n).success).toBe(true);
      expect(parse(schema, -1n).success).toBe(true);
    });

    it("should reject non-bigint primitive types", () => {
      const schema = bigint();

      expect(parse(schema, "123").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, false).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, Symbol("test")).success).toBe(false);
    });

    it("should reject complex types", () => {
      const schema = bigint();

      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
      expect(parse(schema, [1, 2, 3]).success).toBe(false);
      expect(parse(schema, () => {}).success).toBe(false);
      expect(parse(schema, new Date()).success).toBe(false);
      expect(parse(schema, new Map()).success).toBe(false);
      expect(parse(schema, new Set()).success).toBe(false);
      expect(parse(schema, /regex/).success).toBe(false);
    });

    it("should reject edge case values", () => {
      const schema = bigint();

      expect(parse(schema, Number.NaN).success).toBe(false);
      expect(parse(schema, Infinity).success).toBe(false);
      expect(parse(schema, -Infinity).success).toBe(false);
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, "").success).toBe(false);
    });

    it("should return correct error message for invalid values", () => {
      const schema = bigint();

      const result1 = parse(schema, "123");
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.bigint);
      }

      const result2 = parse(schema, 123);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(ERROR_MESSAGES_COMPOSITION.bigint);
      }

      const result3 = parse(schema, null);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(ERROR_MESSAGES_COMPOSITION.bigint);
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Must be a bigint";
      const schema = bigint(customMessage);

      const result1 = parse(schema, "123");
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(customMessage);
      }

      const result2 = parse(schema, 123);
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
      const schema = bigint();

      const result1 = parse(schema, BigInt(42));
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(typeof result1.data).toBe("bigint");
        expect(result1.data).toBe(BigInt(42));
      }

      const result2 = parse(schema, 0n);
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(typeof result2.data).toBe("bigint");
        expect(result2.data).toBe(0n);
      }
    });
  });

  describe("singleton behavior", () => {
    it("should return same instance when called without message", () => {
      const schema1 = bigint();
      const schema2 = bigint();

      expect(schema1).toBe(schema2);
    });

    it("should return different instances when called with message", () => {
      const schema1 = bigint("Error 1");
      const schema2 = bigint("Error 2");

      expect(schema1).not.toBe(schema2);
    });

    it("should return different instance when one has message and other doesn't", () => {
      const schema1 = bigint();
      const schema2 = bigint("Custom error");

      expect(schema1).not.toBe(schema2);
    });
  });

  describe("edge cases", () => {
    it("should handle zero bigint", () => {
      const schema = bigint();
      expect(parse(schema, BigInt(0)).success).toBe(true);
      expect(parse(schema, 0n).success).toBe(true);
    });

    it("should handle very large bigint values", () => {
      const schema = bigint();
      const largeBigInt = BigInt("123456789012345678901234567890");
      expect(parse(schema, largeBigInt).success).toBe(true);
    });

    it("should handle negative bigint values", () => {
      const schema = bigint();
      expect(parse(schema, BigInt(-100)).success).toBe(true);
      expect(parse(schema, -100n).success).toBe(true);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("number vs bigint edge cases", () => {
      it("[🎯] should reject regular number (edge case: number vs bigint)", () => {
        // Requirements: 13.8
        const schema = bigint();
        expect(parse(schema, 123).success).toBe(false);
      });

      it("[🎯] should reject zero as number (edge case: number vs bigint)", () => {
        // Requirements: 13.8
        const schema = bigint();
        expect(parse(schema, 0).success).toBe(false);
      });

      it("[🎯] should accept zero as bigint", () => {
        // Requirements: 13.8
        const schema = bigint();
        expect(parse(schema, 0n).success).toBe(true);
      });

      it("[🎯] should reject floating point number", () => {
        // Requirements: 13.8
        const schema = bigint();
        expect(parse(schema, 3.14).success).toBe(false);
      });
    });

    describe("beyond safe integer", () => {
      it("[🎯] should accept BigInt(MAX_SAFE_INTEGER) + 1n (edge case: beyond safe integer)", () => {
        // Requirements: 29.6
        const schema = bigint();
        const beyondSafeInteger = BigInt(Number.MAX_SAFE_INTEGER) + 1n;
        const result = parse(schema, beyondSafeInteger);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(beyondSafeInteger);
        }
      });

      it("[🎯] should accept BigInt(MIN_SAFE_INTEGER) - 1n (edge case: beyond safe integer negative)", () => {
        // Requirements: 29.6
        const schema = bigint();
        const beyondSafeIntegerNegative = BigInt(Number.MIN_SAFE_INTEGER) - 1n;
        const result = parse(schema, beyondSafeIntegerNegative);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(beyondSafeIntegerNegative);
        }
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.bigInt()])(
    "[🎲] should accept any bigint",
    (value) => {
      const schema = bigint();
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(value);
      }
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] should reject any integer (number type)",
    (value) => {
      const schema = bigint();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] should reject any string",
    (value) => {
      const schema = bigint();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.boolean()])(
    "[🎲] should reject any boolean",
    (value) => {
      const schema = bigint();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );
});
