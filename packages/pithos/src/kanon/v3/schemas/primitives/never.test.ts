import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { never } from "./never";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("never", () => {
  describe("validation", () => {
    it("should reject all primitive types", () => {
      const schema = never();

      expect(parse(schema, "string").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, false).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, Symbol("test")).success).toBe(false);
      expect(parse(schema, BigInt(123)).success).toBe(false);
    });

    it("should reject all complex types", () => {
      const schema = never();

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
      const schema = never();

      expect(parse(schema, Number.NaN).success).toBe(false);
      expect(parse(schema, Infinity).success).toBe(false);
      expect(parse(schema, -Infinity).success).toBe(false);
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, "").success).toBe(false);
    });

    it("should return correct error message for all values", () => {
      const schema = never();

      const result1 = parse(schema, "string");
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.never);
      }

      const result2 = parse(schema, 123);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(ERROR_MESSAGES_COMPOSITION.never);
      }

      const result3 = parse(schema, null);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(ERROR_MESSAGES_COMPOSITION.never);
      }

      const result4 = parse(schema, undefined);
      expect(result4.success).toBe(false);
      if (!result4.success) {
        expect(result4.error).toBe(ERROR_MESSAGES_COMPOSITION.never);
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "This value should never exist";
      const schema = never(customMessage);

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

    it("should never return success", () => {
      const schema = never();

      expect(parse(schema, "anything").success).toBe(false);
      expect(parse(schema, 42).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });
  });

  describe("singleton behavior", () => {
    it("should return same instance when called without message", () => {
      const schema1 = never();
      const schema2 = never();

      expect(schema1).toBe(schema2);
    });

    it("should return different instances when called with message", () => {
      const schema1 = never("Error 1");
      const schema2 = never("Error 2");

      expect(schema1).not.toBe(schema2);
    });

    it("should return different instance when one has message and other doesn't", () => {
      const schema1 = never();
      const schema2 = never("Custom error");

      expect(schema1).not.toBe(schema2);
    });
  });

  describe("edge cases", () => {
    it("should reject every possible value", () => {
      const schema = never();

      expect(parse(schema, "string").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
      expect(parse(schema, () => {}).success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("singleton pattern", () => {
      it("[🎯] should return same instance when called without message (optimization: singleton)", () => {
        // Requirements: 20.5
        const schema1 = never();
        const schema2 = never();
        const schema3 = never();

        expect(schema1).toBe(schema2);
        expect(schema2).toBe(schema3);
        expect(schema1).toBe(schema3);
      });

      it("[🎯] should return different instances when called with different messages (boundary: no singleton with message)", () => {
        // Requirements: 20.5
        const schema1 = never("Error 1");
        const schema2 = never("Error 2");
        const schema3 = never("Error 3");

        expect(schema1).not.toBe(schema2);
        expect(schema2).not.toBe(schema3);
        expect(schema1).not.toBe(schema3);
      });

      it("[🎯] should return different instance when one has message and other doesn't", () => {
        // Requirements: 20.5
        const schemaWithoutMessage = never();
        const schemaWithMessage = never("Custom error");

        expect(schemaWithoutMessage).not.toBe(schemaWithMessage);
      });

      it("[🎯] should return same instance even with same message (no deduplication)", () => {
        // Requirements: 20.5 - each call with message creates new instance
        const schema1 = never("Same message");
        const schema2 = never("Same message");

        // Even with same message, different instances are created
        expect(schema1).not.toBe(schema2);
      });
    });

    describe("always reject behavior", () => {
      it("[🎯] should always reject any value (edge case: always false) - Requirement 13.12", () => {
        const schema = never();

        // Primitives
        expect(parse(schema, "string").success).toBe(false);
        expect(parse(schema, 123).success).toBe(false);
        expect(parse(schema, true).success).toBe(false);
        expect(parse(schema, false).success).toBe(false);
        expect(parse(schema, null).success).toBe(false);
        expect(parse(schema, undefined).success).toBe(false);
        expect(parse(schema, Symbol("test")).success).toBe(false);
        expect(parse(schema, BigInt(123)).success).toBe(false);

        // Edge case values
        expect(parse(schema, Number.NaN).success).toBe(false);
        expect(parse(schema, Infinity).success).toBe(false);
        expect(parse(schema, -Infinity).success).toBe(false);
        expect(parse(schema, 0).success).toBe(false);
        expect(parse(schema, -0).success).toBe(false);
        expect(parse(schema, "").success).toBe(false);

        // Complex types
        expect(parse(schema, {}).success).toBe(false);
        expect(parse(schema, []).success).toBe(false);
        expect(parse(schema, () => {}).success).toBe(false);
        expect(parse(schema, new Date()).success).toBe(false);
        expect(parse(schema, new Map()).success).toBe(false);
        expect(parse(schema, new Set()).success).toBe(false);
        expect(parse(schema, /regex/).success).toBe(false);
      });

      it("[🎯] should never return success for any input", () => {
        const schema = never();

        // Verify that validator always returns error message (not true)
        expect(schema.validator("anything")).toBe(ERROR_MESSAGES_COMPOSITION.never);
        expect(schema.validator(null)).toBe(ERROR_MESSAGES_COMPOSITION.never);
        expect(schema.validator(undefined)).toBe(ERROR_MESSAGES_COMPOSITION.never);
        expect(schema.validator(Number.NaN)).toBe(ERROR_MESSAGES_COMPOSITION.never);
        expect(schema.validator({})).toBe(ERROR_MESSAGES_COMPOSITION.never);
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.anything()])(
    "[🎲] should reject any value",
    (value) => {
      const schema = never();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] should reject any string",
    (value) => {
      const schema = never();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] should reject any integer",
    (value) => {
      const schema = never();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.boolean()])(
    "[🎲] should reject any boolean",
    (value) => {
      const schema = never();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );
});
