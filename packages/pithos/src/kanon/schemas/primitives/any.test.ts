import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { any } from "./any";
import { parse } from "../../core/parser";

describe("any", () => {
  describe("validation", () => {
    it("should accept all primitive types", () => {
      const schema = any();

      expect(parse(schema, "string").success).toBe(true);
      expect(parse(schema, 123).success).toBe(true);
      expect(parse(schema, true).success).toBe(true);
      expect(parse(schema, false).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, Symbol("test")).success).toBe(true);
      expect(parse(schema, BigInt(123)).success).toBe(true);
    });

    it("should accept all complex types", () => {
      const schema = any();

      expect(parse(schema, {}).success).toBe(true);
      expect(parse(schema, []).success).toBe(true);
      expect(parse(schema, [1, 2, 3]).success).toBe(true);
      expect(parse(schema, () => {}).success).toBe(true);
      expect(parse(schema, new Date()).success).toBe(true);
      expect(parse(schema, new Map()).success).toBe(true);
      expect(parse(schema, new Set()).success).toBe(true);
      expect(parse(schema, /regex/).success).toBe(true);
    });

    it("should accept edge case values", () => {
      const schema = any();

      expect(parse(schema, Number.NaN).success).toBe(true);
      expect(parse(schema, Infinity).success).toBe(true);
      expect(parse(schema, -Infinity).success).toBe(true);
      expect(parse(schema, 0).success).toBe(true);
      expect(parse(schema, -0).success).toBe(true);
      expect(parse(schema, "").success).toBe(true);
    });

    it("should always return success", () => {
      const schema = any();

      const result1 = parse(schema, "anything");
      expect(result1.success).toBe(true);

      const result2 = parse(schema, 42);
      expect(result2.success).toBe(true);

      const result3 = parse(schema, null);
      expect(result3.success).toBe(true);

      const result4 = parse(schema, undefined);
      expect(result4.success).toBe(true);
    });

    it("should return correct data when validation succeeds", () => {
      const schema = any();

      const result1 = parse(schema, "hello");
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(result1.data).toBe("hello");
      }

      const result2 = parse(schema, 42);
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(result2.data).toBe(42);
      }

      const result3 = parse(schema, { key: "value" });
      expect(result3.success).toBe(true);
      if (result3.success) {
        expect(result3.data).toEqual({ key: "value" });
      }
    });
  });

  describe("singleton behavior", () => {
    it("should return same instance on every call", () => {
      const schema1 = any();
      const schema2 = any();

      expect(schema1).toBe(schema2);
    });
  });

  describe("edge cases", () => {
    it("should accept any value type", () => {
      const schema = any();

      expect(parse(schema, "string").success).toBe(true);
      expect(parse(schema, 123).success).toBe(true);
      expect(parse(schema, true).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, {}).success).toBe(true);
      expect(parse(schema, []).success).toBe(true);
      expect(parse(schema, () => {}).success).toBe(true);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("singleton pattern", () => {
      it("[🎯] should return same instance when called without message (optimization: singleton)", () => {
        // Requirements: 20.4
        const schema1 = any();
        const schema2 = any();
        const schema3 = any();

        expect(schema1).toBe(schema2);
        expect(schema2).toBe(schema3);
        expect(schema1).toBe(schema3);
      });

      it("[🎯] should return different instances when called with different messages", () => {
        // Requirements: 20.4 - any() with message creates new instance
        const schema1 = any("Message 1");
        const schema2 = any("Message 2");

        expect(schema1).not.toBe(schema2);
      });

      it("[🎯] should return different instance when one has message and other doesn't", () => {
        // Requirements: 20.4
        const schemaWithoutMessage = any();
        const schemaWithMessage = any("Custom message");

        expect(schemaWithoutMessage).not.toBe(schemaWithMessage);
      });

      it("[👾] schema with message should have correct structure", () => {
        // Test createAnySchema directly via any(message) path
        const schema = any("Custom message");

        expect(schema.type).toBe("any");
        expect(schema.message).toBe("Custom message");
        expect(schema.validator("anything")).toBe(true);
      });
    });

    describe("always accept behavior", () => {
      it("[🎯] should always accept any value (edge case: always true) - Requirement 13.10", () => {
        const schema = any();

        // Primitives
        expect(parse(schema, "string").success).toBe(true);
        expect(parse(schema, 123).success).toBe(true);
        expect(parse(schema, true).success).toBe(true);
        expect(parse(schema, false).success).toBe(true);
        expect(parse(schema, null).success).toBe(true);
        expect(parse(schema, undefined).success).toBe(true);
        expect(parse(schema, Symbol("test")).success).toBe(true);
        expect(parse(schema, BigInt(123)).success).toBe(true);

        // Edge case values
        expect(parse(schema, Number.NaN).success).toBe(true);
        expect(parse(schema, Infinity).success).toBe(true);
        expect(parse(schema, -Infinity).success).toBe(true);
        expect(parse(schema, 0).success).toBe(true);
        expect(parse(schema, -0).success).toBe(true);
        expect(parse(schema, "").success).toBe(true);

        // Complex types
        expect(parse(schema, {}).success).toBe(true);
        expect(parse(schema, []).success).toBe(true);
        expect(parse(schema, () => {}).success).toBe(true);
        expect(parse(schema, new Date()).success).toBe(true);
        expect(parse(schema, new Map()).success).toBe(true);
        expect(parse(schema, new Set()).success).toBe(true);
        expect(parse(schema, /regex/).success).toBe(true);
      });

      it("[🎯] should never return failure for any input", () => {
        const schema = any();

        // Verify that validator always returns true
        expect(schema.validator("anything")).toBe(true);
        expect(schema.validator(null)).toBe(true);
        expect(schema.validator(undefined)).toBe(true);
        expect(schema.validator(Number.NaN)).toBe(true);
        expect(schema.validator({})).toBe(true);
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.anything()])(
    "[🎲] should accept any value",
    (value) => {
      const schema = any();
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(value);
      }
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] should accept any string",
    (value) => {
      const schema = any();
      const result = parse(schema, value);

      expect(result.success).toBe(true);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] should accept any integer",
    (value) => {
      const schema = any();
      const result = parse(schema, value);

      expect(result.success).toBe(true);
    }
  );

  itProp.prop([fc.boolean()])(
    "[🎲] should accept any boolean",
    (value) => {
      const schema = any();
      const result = parse(schema, value);

      expect(result.success).toBe(true);
    }
  );
});
