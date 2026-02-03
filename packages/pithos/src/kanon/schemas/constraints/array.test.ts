import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { addArrayConstraints } from "./array";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";
import { unknown } from "../../schemas/primitives/unknown";

describe("addArrayConstraints", () => {
  const createBaseSchema = () => ({
    type: "array" as const,
    message: undefined,
    refinements: undefined,
    itemSchema: unknown(),
    validator: (value: unknown) =>
      Array.isArray(value) ? true : ERROR_MESSAGES_COMPOSITION.array,
  });

  it("should add all constraint methods to base schema", () => {
    const baseSchema = createBaseSchema();
    const schema = addArrayConstraints(baseSchema);

    expect(schema.minLength).toBeDefined();
    expect(schema.maxLength).toBeDefined();
    expect(schema.length).toBeDefined();
    expect(schema.unique).toBeDefined();
  });

  describe("minLength", () => {
    it("should validate array with length >= min", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).minLength(2);

      expect(parse(schema, ["a", "b"])).toEqual({
        success: true,
        data: ["a", "b"],
      });
      expect(parse(schema, ["a", "b", "c"])).toEqual({
        success: true,
        data: ["a", "b", "c"],
      });
    });

    it("should reject array with length < min", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).minLength(2);

      const result = parse(schema, ["a"]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.minLength(2));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).minLength(
        2,
        "Too few items"
      );

      const result = parse(schema, ["a"]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too few items");
      }
    });

    it("should work with boundary values", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).minLength(2);

      expect(parse(schema, ["a", "b"])).toEqual({
        success: true,
        data: ["a", "b"],
      });
      const result = parse(schema, ["a"]);
      expect(result.success).toBe(false);
    });
  });

  describe("maxLength", () => {
    it("should validate array with length <= max", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).maxLength(3);

      expect(parse(schema, ["a", "b", "c"])).toEqual({
        success: true,
        data: ["a", "b", "c"],
      });
      expect(parse(schema, ["a", "b"])).toEqual({
        success: true,
        data: ["a", "b"],
      });
    });

    it("should reject array with length > max", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).maxLength(3);

      const result = parse(schema, ["a", "b", "c", "d"]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.maxLength(3));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).maxLength(
        3,
        "Too many items"
      );

      const result = parse(schema, ["a", "b", "c", "d"]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too many items");
      }
    });

    it("should work with boundary values", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).maxLength(3);

      expect(parse(schema, ["a", "b", "c"])).toEqual({
        success: true,
        data: ["a", "b", "c"],
      });
      const result = parse(schema, ["a", "b", "c", "d"]);
      expect(result.success).toBe(false);
    });
  });

  describe("length", () => {
    it("should validate array with exact length", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).length(3);

      expect(parse(schema, ["a", "b", "c"])).toEqual({
        success: true,
        data: ["a", "b", "c"],
      });
    });

    it("should reject array with different length", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).length(3);

      const result1 = parse(schema, ["a", "b"]);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.length(3));
      }

      const result2 = parse(schema, ["a", "b", "c", "d"]);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(ERROR_MESSAGES_COMPOSITION.length(3));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).length(3, "Wrong length");

      const result = parse(schema, ["a", "b"]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Wrong length");
      }
    });

    it("should work with zero length", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).length(0);

      expect(parse(schema, [])).toEqual({ success: true, data: [] });
      const result = parse(schema, ["a"]);
      expect(result.success).toBe(false);
    });
  });

  describe("unique", () => {
    it("should validate array with unique values", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).unique();

      expect(parse(schema, ["a", "b", "c"])).toEqual({
        success: true,
        data: ["a", "b", "c"],
      });
      expect(parse(schema, [])).toEqual({ success: true, data: [] });
      expect(parse(schema, ["a"])).toEqual({ success: true, data: ["a"] });
    });

    it("should reject array with duplicate values", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).unique();

      const result1 = parse(schema, ["a", "b", "a"]);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.arrayUnique);
      }

      const result2 = parse(schema, ["a", "a", "a"]);
      expect(result2.success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).unique("Duplicates found");

      const result = parse(schema, ["a", "b", "a"]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Duplicates found");
      }
    });

    it("should work with numbers", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).unique();

      expect(parse(schema, [1, 2, 3])).toEqual({
        success: true,
        data: [1, 2, 3],
      });
      const result = parse(schema, [1, 2, 1]);
      expect(result.success).toBe(false);
    });

    it("should work with objects (reference equality)", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema).unique();

      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 1 };

      expect(parse(schema, [obj1, obj2])).toEqual({
        success: true,
        data: [obj1, obj2],
      });

      const result = parse(schema, [obj1, obj1]);
      expect(result.success).toBe(false);

      const result2 = parse(schema, [obj1, obj3]);
      expect(result2.success).toBe(true);
    });
  });

  describe("chaining", () => {
    it("should allow chaining multiple constraints", () => {
      const baseSchema = createBaseSchema();
      const schema = addArrayConstraints(baseSchema)
        .minLength(2)
        .maxLength(5)
        .unique();

      expect(parse(schema, ["a", "b"])).toEqual({
        success: true,
        data: ["a", "b"],
      });
      expect(parse(schema, ["a", "b", "c", "d"])).toEqual({
        success: true,
        data: ["a", "b", "c", "d"],
      });

      const result1 = parse(schema, ["a"]);
      expect(result1.success).toBe(false);

      const result2 = parse(schema, ["a", "b", "c", "d", "e", "f"]);
      expect(result2.success).toBe(false);

      const result3 = parse(schema, ["a", "b", "a"]);
      expect(result3.success).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should reject non-array values", () => {
      const schema = addArrayConstraints(createBaseSchema()).minLength(1);

      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, "string").success).toBe(false);
      expect(parse(schema, { length: 2 }).success).toBe(false);
    });

    it("should handle empty array", () => {
      const schema = addArrayConstraints(createBaseSchema()).minLength(0);
      expect(parse(schema, [])).toEqual({ success: true, data: [] });
    });

    it("should handle large arrays", () => {
      const schema = addArrayConstraints(createBaseSchema()).maxLength(1000);
      const largeArray = Array.from({ length: 1000 }, (_, i) => i);
      expect(parse(schema, largeArray).success).toBe(true);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("minLength/maxLength/length boundary conditions", () => {
      it("[🎯] should accept empty array when minLength(0) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const schema = addArrayConstraints(baseSchema).minLength(0);

        expect(parse(schema, [])).toEqual({ success: true, data: [] });
      });

      it("[🎯] should only accept empty array when maxLength(0) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const schema = addArrayConstraints(baseSchema).maxLength(0);

        expect(parse(schema, [])).toEqual({ success: true, data: [] });
        const result = parse(schema, ["a"]);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.maxLength(0));
        }
      });

      it("[🎯] should only accept empty array when length(0) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const schema = addArrayConstraints(baseSchema).length(0);

        expect(parse(schema, [])).toEqual({ success: true, data: [] });
        const result = parse(schema, ["a"]);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.length(0));
        }
      });

      it("[🎯] should accept array with length exactly n when minLength(n) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const n = 3;
        const schema = addArrayConstraints(baseSchema).minLength(n);

        expect(parse(schema, ["a", "b", "c"])).toEqual({
          success: true,
          data: ["a", "b", "c"],
        });
      });

      it("[🎯] should reject array with length n-1 when minLength(n) - boundary: just below", () => {
        const baseSchema = createBaseSchema();
        const n = 3;
        const schema = addArrayConstraints(baseSchema).minLength(n);

        const result = parse(schema, ["a", "b"]);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.minLength(n));
        }
      });

      it("[🎯] should accept array with length exactly n when maxLength(n) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const n = 3;
        const schema = addArrayConstraints(baseSchema).maxLength(n);

        expect(parse(schema, ["a", "b", "c"])).toEqual({
          success: true,
          data: ["a", "b", "c"],
        });
      });

      it("[🎯] should reject array with length n+1 when maxLength(n) - boundary: just above", () => {
        const baseSchema = createBaseSchema();
        const n = 3;
        const schema = addArrayConstraints(baseSchema).maxLength(n);

        const result = parse(schema, ["a", "b", "c", "d"]);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.maxLength(n));
        }
      });
    });

    describe("unique edge cases", () => {
      it("[🎯] should accept empty array when unique() - edge case: empty", () => {
        const baseSchema = createBaseSchema();
        const schema = addArrayConstraints(baseSchema).unique();

        expect(parse(schema, [])).toEqual({ success: true, data: [] });
      });

      it("[🎯] should accept single-element array when unique() - edge case: single element", () => {
        const baseSchema = createBaseSchema();
        const schema = addArrayConstraints(baseSchema).unique();

        expect(parse(schema, ["a"])).toEqual({ success: true, data: ["a"] });
        expect(parse(schema, [1])).toEqual({ success: true, data: [1] });
        expect(parse(schema, [null])).toEqual({ success: true, data: [null] });
      });

      it("[🎯] should treat NaN as unique (Set behavior: NaN === NaN) - edge case: NaN values", () => {
        const baseSchema = createBaseSchema();
        const schema = addArrayConstraints(baseSchema).unique();

        // In JavaScript, NaN !== NaN, but Set treats NaN as equal to itself
        // So [NaN, NaN] should be rejected because Set sees them as duplicates
        const result = parse(schema, [NaN, NaN]);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.arrayUnique);
        }

        // Single NaN should be accepted
        expect(parse(schema, [NaN])).toEqual({ success: true, data: [NaN] });

        // NaN with other values should be accepted
        expect(parse(schema, [NaN, 1, 2])).toEqual({
          success: true,
          data: [NaN, 1, 2],
        });
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.array(fc.anything()), fc.nat()])(
      "[🎲] minLength accepts arrays with length >= min",
      (arr, min) => {
        const adjustedMin = Math.min(min, arr.length);
        const schema = addArrayConstraints(createBaseSchema()).minLength(adjustedMin);
        const result = parse(schema, arr);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.array(fc.anything()), fc.nat()])(
      "[🎲] maxLength accepts arrays with length <= max",
      (arr, extra) => {
        const max = arr.length + extra;
        const schema = addArrayConstraints(createBaseSchema()).maxLength(max);
        const result = parse(schema, arr);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.array(fc.anything())])(
      "[🎲] length accepts arrays with exact length",
      (arr) => {
        const schema = addArrayConstraints(createBaseSchema()).length(arr.length);
        const result = parse(schema, arr);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.uniqueArray(fc.integer())])(
      "[🎲] unique accepts arrays with unique elements",
      (arr) => {
        const schema = addArrayConstraints(createBaseSchema()).unique();
        const result = parse(schema, arr);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.array(fc.anything())])(
      "[🎲] does not mutate original array",
      (arr) => {
        const original = [...arr];
        const schema = addArrayConstraints(createBaseSchema()).minLength(0);
        parse(schema, arr);
        expect(arr).toEqual(original);
      }
    );
  });
});
