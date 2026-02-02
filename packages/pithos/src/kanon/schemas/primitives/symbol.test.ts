import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { symbol } from "./symbol";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("symbol", () => {
  describe("validation", () => {
    it("should accept valid symbol values", () => {
      const schema = symbol();

      expect(parse(schema, Symbol()).success).toBe(true);
      expect(parse(schema, Symbol("test")).success).toBe(true);
      expect(parse(schema, Symbol("")).success).toBe(true);
      expect(parse(schema, Symbol.for("test")).success).toBe(true);
      expect(parse(schema, Symbol.iterator).success).toBe(true);
      expect(parse(schema, Symbol.toStringTag).success).toBe(true);
    });

    it("should reject non-symbol primitive types", () => {
      const schema = symbol();

      expect(parse(schema, "string").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, false).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, BigInt(123)).success).toBe(false);
    });

    it("should reject complex types", () => {
      const schema = symbol();

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
      const schema = symbol();

      expect(parse(schema, Number.NaN).success).toBe(false);
      expect(parse(schema, Infinity).success).toBe(false);
      expect(parse(schema, -Infinity).success).toBe(false);
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, "").success).toBe(false);
    });

    it("should return correct error message for invalid values", () => {
      const schema = symbol();

      const result1 = parse(schema, "string");
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.symbol);
      }

      const result2 = parse(schema, 123);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(ERROR_MESSAGES_COMPOSITION.symbol);
      }

      const result3 = parse(schema, null);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(ERROR_MESSAGES_COMPOSITION.symbol);
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Must be a symbol";
      const schema = symbol(customMessage);

      const result1 = parse(schema, "string");
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
      const schema = symbol();
      const testSymbol = Symbol("test");

      const result = parse(schema, testSymbol);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data).toBe("symbol");
        expect(result.data).toBe(testSymbol);
      }
    });
  });

  describe("singleton behavior", () => {
    it("should return same instance when called without message", () => {
      const schema1 = symbol();
      const schema2 = symbol();

      expect(schema1).toBe(schema2);
    });

    it("should return different instances when called with message", () => {
      const schema1 = symbol("Error 1");
      const schema2 = symbol("Error 2");

      expect(schema1).not.toBe(schema2);
    });

    it("should return different instance when one has message and other doesn't", () => {
      const schema1 = symbol();
      const schema2 = symbol("Custom error");

      expect(schema1).not.toBe(schema2);
    });
  });

  describe("edge cases", () => {
    it("should handle symbols without description", () => {
      const schema = symbol();
      expect(parse(schema, Symbol()).success).toBe(true);
    });

    it("should handle symbols with description", () => {
      const schema = symbol();
      expect(parse(schema, Symbol("test")).success).toBe(true);
      expect(parse(schema, Symbol("")).success).toBe(true);
    });

    it("should handle global symbols", () => {
      const schema = symbol();
      expect(parse(schema, Symbol.for("test")).success).toBe(true);
    });

    it("should handle well-known symbols", () => {
      const schema = symbol();
      expect(parse(schema, Symbol.iterator).success).toBe(true);
      expect(parse(schema, Symbol.toStringTag).success).toBe(true);
      expect(parse(schema, Symbol.toPrimitive).success).toBe(true);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("well-known symbols edge cases", () => {
      it("[🎯] should accept Symbol.iterator (edge case: well-known symbols)", () => {
        // Requirements: 13.9
        const schema = symbol();
        expect(parse(schema, Symbol.iterator).success).toBe(true);
      });

      it("[🎯] should accept Symbol.toStringTag (edge case: well-known symbols)", () => {
        // Requirements: 13.9
        const schema = symbol();
        expect(parse(schema, Symbol.toStringTag).success).toBe(true);
      });

      it("[🎯] should accept Symbol.toPrimitive (edge case: well-known symbols)", () => {
        // Requirements: 13.9
        const schema = symbol();
        expect(parse(schema, Symbol.toPrimitive).success).toBe(true);
      });

      it("[🎯] should accept Symbol.asyncIterator (edge case: well-known symbols)", () => {
        // Requirements: 13.9
        const schema = symbol();
        expect(parse(schema, Symbol.asyncIterator).success).toBe(true);
      });

      it("[🎯] should accept Symbol.hasInstance (edge case: well-known symbols)", () => {
        // Requirements: 13.9
        const schema = symbol();
        expect(parse(schema, Symbol.hasInstance).success).toBe(true);
      });

      it("[🎯] should accept Symbol.isConcatSpreadable (edge case: well-known symbols)", () => {
        // Requirements: 13.9
        const schema = symbol();
        expect(parse(schema, Symbol.isConcatSpreadable).success).toBe(true);
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.string()])(
    "[🎲] should reject any string",
    (value) => {
      const schema = symbol();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] should reject any integer",
    (value) => {
      const schema = symbol();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.boolean()])(
    "[🎲] should reject any boolean",
    (value) => {
      const schema = symbol();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.dictionary(fc.string(), fc.anything())])(
    "[🎲] should reject any object",
    (value) => {
      const schema = symbol();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );
});
