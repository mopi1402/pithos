import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { unknown } from "@kanon/v3/schemas/primitives/unknown";
import { parse } from "@kanon/v3/core/parser";

describe("unknown schema", () => {
  describe("Basic validation", () => {
    it("should accept any value", () => {
      const schema = unknown();

      expect(parse(schema, "string").success).toBe(true);
      expect(parse(schema, 123).success).toBe(true);
      expect(parse(schema, true).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, {}).success).toBe(true);
      expect(parse(schema, []).success).toBe(true);
      expect(parse(schema, Symbol()).success).toBe(true);
      expect(parse(schema, () => {}).success).toBe(true);
    });

    it("should return the value as-is", () => {
      const schema = unknown();
      const obj = { foo: "bar" };
      const arr = [1, 2, 3];

      const result1 = parse(schema, obj);
      const result2 = parse(schema, arr);

      expect(result1.success && result1.data).toBe(obj);
      expect(result2.success && result2.data).toBe(arr);
    });
  });

  describe("Singleton behavior", () => {
    it("should return the same schema instance when no message", () => {
      const schema1 = unknown();
      const schema2 = unknown();

      expect(schema1).toBe(schema2);
    });

    it("should create a new schema instance when message is provided", () => {
      const schema1 = unknown("custom message");
      const schema2 = unknown("custom message");
      const schemaDefault = unknown();

      // Each call with a message creates a new instance
      expect(schema1).not.toBe(schema2);
      expect(schema1).not.toBe(schemaDefault);

      // But all still work correctly
      expect(schema1.type).toBe("unknown");
      expect(schema1.message).toBe("custom message");
      expect(schema1.validator("anything")).toBe(true);
    });
  });

  describe("Schema structure", () => {
    it("should have correct schema type", () => {
      const schema = unknown();

      expect(schema.type).toBe("unknown");
      expect(schema.message).toBeUndefined();
      expect(schema.refinements).toBeUndefined();
    });

    it("should have a validator that always returns true", () => {
      const schema = unknown();

      expect(schema.validator("anything")).toBe(true);
      expect(schema.validator(null)).toBe(true);
      expect(schema.validator(undefined)).toBe(true);
    });
  });

  describe("Edge cases", () => {
    it("should accept NaN", () => {
      const schema = unknown();
      const result = parse(schema, Number.NaN);

      expect(result.success).toBe(true);
      expect(result.success && Number.isNaN(result.data)).toBe(true);
    });

    it("should accept Infinity", () => {
      const schema = unknown();

      expect(parse(schema, Infinity).success).toBe(true);
      expect(parse(schema, -Infinity).success).toBe(true);
    });

    it("should accept complex nested objects", () => {
      const schema = unknown();
      const complex = {
        a: [1, 2, { b: { c: [null, undefined, true] } }],
        d: () => {},
        e: Symbol("test"),
      };

      const result = parse(schema, complex);
      expect(result.success).toBe(true);
      expect(result.success && result.data).toBe(complex);
    });

    it("should have correct schema type and properties", () => {
      const schema = unknown();

      expect(schema.type).toBe("unknown");
      expect(schema.message).toBeUndefined();
      expect(schema.refinements).toBeUndefined();
      expect(typeof schema.validator).toBe("function");
    });

    it("should have validator that always returns true", () => {
      const schema = unknown();

      expect(schema.validator("anything")).toBe(true);
      expect(schema.validator(null)).toBe(true);
      expect(schema.validator(undefined)).toBe(true);
      expect(schema.validator(123)).toBe(true);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("always accept behavior", () => {
      it("[🎯] should always accept any value (edge case: always true) - Requirement 13.11", () => {
        const schema = unknown();

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
        const schema = unknown();

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
  itProp.prop([fc.anything()])("[🎲] should accept any value", (value) => {
    const schema = unknown();
    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(value);
    }
  });

  itProp.prop([fc.string()])("[🎲] should accept any string", (value) => {
    const schema = unknown();
    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  itProp.prop([fc.integer()])("[🎲] should accept any integer", (value) => {
    const schema = unknown();
    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  itProp.prop([fc.boolean()])("[🎲] should accept any boolean", (value) => {
    const schema = unknown();
    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });
});
