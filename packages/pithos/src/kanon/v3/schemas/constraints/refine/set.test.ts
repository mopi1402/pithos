import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { refineSet } from "./set";
import { set } from "../../composites/set";
import { string } from "../../primitives/string";
import { number } from "../../primitives/number";
import { coerceBoolean } from "../../coerce/boolean";
import { parse } from "../../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../../core/consts/messages";
import type { SetSchema } from "@kanon/v3/types/composites";
import type { SetConstraint, StringConstraint } from "@kanon/v3/types/constraints";

describe("refineSet", () => {
  describe("[🎯] Specification Tests", () => {
    describe("first refinement creation (Requirement 21.10)", () => {
      it("[🎯] should create a new refinements array when schema has no refinements", () => {
        const baseSchema = set(string());
        expect(baseSchema.refinements).toBeUndefined();

        const refinedSchema = refineSet(baseSchema, () => true);
        expect(refinedSchema.refinements).toBeDefined();
        expect(refinedSchema.refinements).toHaveLength(1);
      });
    });
  });

  describe("validation", () => {
    it("should accept valid set that passes refinement", () => {
      const schema = refineSet(set(string()), (value) => {
        if (value.size > 0) return true;
        return "Set must not be empty";
      });

      expect(parse(schema, new Set(["a", "b"])).success).toBe(true);
    });

    it("should reject valid set that fails refinement", () => {
      const schema = refineSet(set(string()), (value) => {
        if (value.size > 2) return true;
        return "Set must have more than 2 items";
      });

      const result = parse(schema, new Set(["a", "b"]));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Set must have more than 2 items");
      }
    });

    it("should reject non-set values", () => {
      const schema = refineSet(set(string()), () => true);

      expect(parse(schema, []).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, "test").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
    });

    it("should return correct error message for non-set values", () => {
      const schema = refineSet(set(string()), () => true);

      const result = parse(schema, []);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.set);
      }
    });

    it("should validate items before refinement", () => {
      const schema = refineSet(set(number()), () => true);

      const result = parse(schema, new Set(["not a number"]));
      expect(result.success).toBe(false);
    });
  });

  describe("chaining", () => {
    it("should chain multiple refinements", () => {
      const schema1 = refineSet(set(string()), (value) => {
        if (value.size >= 1) return true;
        return "Error 1";
      });

      const schema2 = refineSet(schema1, (value) => {
        if (value.size <= 5) return true;
        return "Error 2";
      });

      expect(parse(schema2, new Set(["a", "b"])).success).toBe(true);
      expect(parse(schema2, new Set()).success).toBe(false);
      expect(
        parse(schema2, new Set(["a", "b", "c", "d", "e", "f"])).success
      ).toBe(false);
    });

    it("should return first failing refinement error", () => {
      const schema1 = refineSet(set(string()), (value) => {
        if (value.size >= 2) return true;
        return "First error";
      });

      const schema2 = refineSet(schema1, () => "Second error");

      const result = parse(schema2, new Set(["a"]));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("First error");
      }
    });
  });

  describe("edge cases", () => {
    it("should handle empty set", () => {
      const schema = refineSet(set(string()), (value) => {
        if (value.size === 0) return "Empty set not allowed";
        return true;
      });

      const result = parse(schema, new Set());
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Empty set not allowed");
      }
    });

    it("should handle multiple chained refinements", () => {
      let schema: SetSchema<StringConstraint> | SetConstraint<StringConstraint> = set(string());
      schema = refineSet(schema, (v) => (v.size > 0 ? true : "Error 1"));
      schema = refineSet(schema, (v) => (v.size < 10 ? true : "Error 2"));
      schema = refineSet(schema, (v) => (v.has("test") ? true : "Error 3"));

      expect(parse(schema, new Set(["test"])).success).toBe(true);
      expect(parse(schema, new Set()).success).toBe(false);
      expect(parse(schema, new Set(["other"])).success).toBe(false);
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = refineSet(set(string()), () => true);
      const testSet = new Set(["a", "b", "c"]);

      const result = parse(schema, testSet);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data instanceof Set).toBe(true);
        expect(result.data).toEqual(testSet);
      }
    });
  });

  describe("coercion", () => {
    it("should coerce set items and apply refinement", () => {
      const schema = refineSet(set(coerceBoolean()), (value) => {
        if (value.size > 0) return true;
        return "Set must not be empty";
      });

      const result = parse(schema, new Set([1, 0]));
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.has(true)).toBe(true);
        expect(result.data.has(false)).toBe(true);
      }
    });

    it("should coerce first item and add subsequent valid items to coercedSet", () => {
      // Tests the branch where coercedSet exists and a valid item is added
      const schema = refineSet(set(coerceBoolean()), () => true);
      const value = new Set([1, true, false]); // 1 coerced, true and false are valid (added)

      const result = parse(schema, value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.has(true)).toBe(true);
        expect(result.data.has(false)).toBe(true);
      }
    });

    it("should copy already validated items when coercion starts mid-iteration", () => {
      // Tests the branch where we copy previous items to coercedSet
      const schema = refineSet(set(coerceBoolean()), () => true);
      const value = new Set([true, false, 1]); // true and false are valid, 1 is coerced

      const result = parse(schema, value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.has(true)).toBe(true);
        expect(result.data.has(false)).toBe(true);
      }
    });

    it("should apply refinement to coerced set", () => {
      const schema = refineSet(set(coerceBoolean()), (value) => {
        if (value.has(true)) return true;
        return "Set must contain true";
      });

      expect(parse(schema, new Set([1])).success).toBe(true);
      expect(parse(schema, new Set([0])).success).toBe(false);
    });

    it("should return coerced set when refinement passes", () => {
      const schema = refineSet(set(coerceBoolean()), () => true);
      const result = parse(schema, new Set([1, 0]));

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.has(true)).toBe(true);
        expect(result.data.has(false)).toBe(true);
      }
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.uniqueArray(fc.string())])(
      "[🎲] should be idempotent - parsing twice yields same result",
      (arr) => {
        const schema = refineSet(set(string()), () => true);
        const input = new Set(arr);
        const result1 = parse(schema, input);
        if (result1.success) {
          const result2 = parse(schema, result1.data);
          expect(result2.success).toBe(true);
          if (result2.success) {
            expect(result2.data).toEqual(result1.data);
          }
        }
      }
    );

    itProp.prop([fc.uniqueArray(fc.string())])(
      "[🎲] should not mutate input set",
      (arr) => {
        const schema = refineSet(set(string()), () => true);
        const input = new Set(arr);
        const originalSize = input.size;
        const originalValues = [...input];
        parse(schema, input);
        expect(input.size).toBe(originalSize);
        expect([...input]).toEqual(originalValues);
      }
    );

    itProp.prop([fc.uniqueArray(fc.string()), fc.integer({ min: 0, max: 10 })])(
      "[🎲] refinement with size constraint - consistent behavior",
      (arr, minSize) => {
        const schema = refineSet(set(string()), (v) =>
          v.size >= minSize ? true : "Too small"
        );
        const input = new Set(arr);
        const result = parse(schema, input);
        expect(result.success).toBe(input.size >= minSize);
      }
    );

    itProp.prop([fc.uniqueArray(fc.string(), { minLength: 1 })])(
      "[🎲] refinement with has constraint - consistent behavior",
      (arr) => {
        const targetValue = arr[0];
        const schema = refineSet(set(string()), (v) =>
          v.has(targetValue) ? true : "Missing value"
        );
        const input = new Set(arr);
        const result = parse(schema, input);
        expect(result.success).toBe(true);
      }
    );
  });
});
