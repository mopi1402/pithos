import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { refineArray } from "./array";
import { array } from "../../composites/array";
import { string } from "../../primitives/string";
import { number } from "../../primitives/number";
import { coerceBoolean } from "../../coerce/boolean";
import { parse } from "../../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../../core/consts/messages";
import type { ArraySchema } from "@kanon/v3/types/composites";
import type { ArrayConstraint , StringConstraint } from "@kanon/v3/types/constraints";

// AI_OK : Code Review by Claude Opus 4.5, 2025-12-06
describe("refineArray", () => {
  describe("[🎯] Specification Tests", () => {
    describe("first refinement creation (Requirement 21.6)", () => {
      it("[🎯] should create a new refinements array when schema has no refinements", () => {
        const baseSchema = array(string());
        expect(baseSchema.refinements).toBeUndefined();

        const refinedSchema = refineArray(baseSchema, () => true);
        expect(refinedSchema.refinements).toBeDefined();
        expect(refinedSchema.refinements).toHaveLength(1);
      });
    });
  });
  describe("validation", () => {
    it("should accept valid array that passes refinement", () => {
      const schema = refineArray(array(string()), (value) => {
        if (value.length > 2) return true;
        return "Array must have more than 2 elements";
      });

      expect(parse(schema, ["a", "b", "c"]).success).toBe(true);
      expect(parse(schema, ["a", "b", "c", "d"]).success).toBe(true);
    });

    it("should reject valid array that fails refinement", () => {
      const schema = refineArray(array(string()), (value) => {
        if (value.length > 2) return true;
        return "Array must have more than 2 elements";
      });

      const result = parse(schema, ["a", "b"]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Array must have more than 2 elements");
      }
    });

    it("should reject non-array values", () => {
      const schema = refineArray(array(string()), () => true);

      expect(parse(schema, "not array").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
    });

    it("should return correct error message for non-array values", () => {
      const schema = refineArray(array(string()), () => true);

      const result = parse(schema, "not array");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.array);
      }
    });

    it("should use custom error message from base schema for non-array values", () => {
      const customMessage = "Must be an array";
      const schema = refineArray(array(string(), customMessage), () => true);

      const result = parse(schema, "not array");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should apply refinement after type validation", () => {
      const schema = refineArray(array(string()), (value) => {
        if (value.length > 0) return true;
        return "Array must not be empty";
      });

      expect(parse(schema, ["valid"]).success).toBe(true);
      expect(parse(schema, []).success).toBe(false);
    });

    it("should chain multiple refinements", () => {
      const schema1 = refineArray(array(string()), (value) => {
        if (value.length > 0) return true;
        return "Must not be empty";
      });

      const schema2 = refineArray(schema1, (value) => {
        if (value.length < 10) return true;
        return "Must have less than 10 elements";
      });

      expect(parse(schema2, ["a", "b", "c"]).success).toBe(true);
      expect(parse(schema2, []).success).toBe(false);
      expect(parse(schema2, new Array(10).fill("a")).success).toBe(false);
    });

    it("should return first failing refinement error", () => {
      const schema1 = refineArray(array(string()), (value) => {
        if (value.length > 0) return true;
        return "First error";
      });

      const schema2 = refineArray(schema1, (value) => {
        if (value.length < 10) return true;
        return "Second error";
      });

      const result = parse(schema2, []);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("First error");
      }
    });

    it("should return second refinement error if first passes", () => {
      const schema1 = refineArray(array(string()), (value) => {
        if (value.length > 0) return true;
        return "First error";
      });

      const schema2 = refineArray(schema1, (value) => {
        if (value.length < 10) return true;
        return "Second error";
      });

      const result = parse(schema2, new Array(10).fill("a"));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Second error");
      }
    });

    it("should handle empty array", () => {
      const schema = refineArray(array(string()), (value) => {
        if (value.length === 0) return "Empty array not allowed";
        return true;
      });

      const result = parse(schema, []);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Empty array not allowed");
      }
    });

    it("should handle array with specific content validation", () => {
      const schema = refineArray(array(string()), (value) => {
        if (value.includes("required")) return true;
        return "Array must contain 'required'";
      });

      expect(parse(schema, ["required", "other"]).success).toBe(true);
      expect(parse(schema, ["other", "items"]).success).toBe(false);
    });

    it("should handle array with number items", () => {
      const schema = refineArray(array(number()), (value) => {
        const sum = value.reduce((acc, n) => acc + n, 0);
        if (sum > 10) return true;
        return "Sum must be greater than 10";
      });

      expect(parse(schema, [5, 6]).success).toBe(true);
      expect(parse(schema, [1, 2]).success).toBe(false);
    });

    it("should handle very large arrays", () => {
      const largeArray = new Array(1000).fill("a");
      const schema = refineArray(array(string()), (value) => {
        if (value.length > 100) return true;
        return "Too small";
      });

      expect(parse(schema, largeArray).success).toBe(true);
    });

    it("should handle refinement that always returns true", () => {
      const schema = refineArray(array(string()), () => true);

      expect(parse(schema, []).success).toBe(true);
      expect(parse(schema, ["a"]).success).toBe(true);
      expect(parse(schema, ["a", "b", "c"]).success).toBe(true);
    });

    it("should handle refinement that always returns error", () => {
      const schema = refineArray(array(string()), () => "Always fails");

      const result = parse(schema, ["a", "b"]);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Always fails");
      }
    });

    it("should handle multiple chained refinements", () => {
      let schema: ArraySchema<StringConstraint> | ArrayConstraint<StringConstraint> = array(string());
      schema = refineArray(schema, (v) => (v.length > 0 ? true : "Error 1"));
      schema = refineArray(schema, (v) => (v.length < 10 ? true : "Error 2"));
      schema = refineArray(schema, (v) =>
        v.includes("test") ? true : "Error 3"
      );

      expect(parse(schema, ["test"]).success).toBe(true);
      expect(parse(schema, []).success).toBe(false);
      expect(parse(schema, new Array(10).fill("a")).success).toBe(false);
      expect(parse(schema, ["other"]).success).toBe(false);
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = refineArray(array(string()), () => true);
      const testArray = ["a", "b", "c"];

      const result = parse(schema, testArray);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data).toEqual(testArray);
      }
    });

    it("should reject array with invalid items", () => {
      const schema = refineArray(array(string()), () => true);

      expect(parse(schema, [1, 2, 3]).success).toBe(false);
      expect(parse(schema, ["valid", 123]).success).toBe(false);
    });
  });

  describe("coercion", () => {
    it("should coerce array items and apply refinement", () => {
      const schema = refineArray(array(coerceBoolean()), (value) => {
        if (value.every((v) => v === true || v === false)) return true;
        return "All items must be booleans";
      });

      const result = parse(schema, [1, 0, "yes"]);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([true, false, true]);
      }
    });

    it("should coerce first item and copy subsequent valid items", () => {
      // Tests the branch where coercedArray exists and a valid item is copied
      const schema = refineArray(array(coerceBoolean()), () => true);
      const value = [1, true, false]; // 1 coerced, true and false are valid (copied)

      const result = parse(schema, value);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([true, true, false]);
      }
    });

    it("should apply refinement to coerced array", () => {
      const schema = refineArray(array(coerceBoolean()), (value) => {
        if (value.filter((v) => v === true).length >= 2) return true;
        return "Must have at least 2 true values";
      });

      expect(parse(schema, [1, 1, 0]).success).toBe(true);
      expect(parse(schema, [1, 0, 0]).success).toBe(false);
    });

    it("should return coerced array when refinement passes", () => {
      const schema = refineArray(array(coerceBoolean()), () => true);
      const result = parse(schema, [1, 0]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual([true, false]);
      }
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.array(fc.string())])(
      "[🎲] should be idempotent - parsing twice yields same result",
      (arr) => {
        const schema = refineArray(array(string()), () => true);
        const result1 = parse(schema, arr);
        if (result1.success) {
          const result2 = parse(schema, result1.data);
          expect(result2.success).toBe(true);
          if (result2.success) {
            expect(result2.data).toEqual(result1.data);
          }
        }
      }
    );

    itProp.prop([fc.array(fc.string())])(
      "[🎲] should not mutate input array",
      (arr) => {
        const schema = refineArray(array(string()), () => true);
        const originalLength = arr.length;
        const originalCopy = [...arr];
        parse(schema, arr);
        expect(arr.length).toBe(originalLength);
        expect(arr).toEqual(originalCopy);
      }
    );

    itProp.prop([fc.array(fc.string()), fc.integer({ min: 0, max: 20 })])(
      "[🎲] refinement with length constraint - consistent behavior",
      (arr, minLen) => {
        const schema = refineArray(array(string()), (v) =>
          v.length >= minLen ? true : "Too short"
        );
        const result = parse(schema, arr);
        expect(result.success).toBe(arr.length >= minLen);
      }
    );

    itProp.prop([fc.array(fc.integer())])(
      "[🎲] refinement with sum constraint - consistent behavior",
      (arr) => {
        const targetSum = 10;
        const schema = refineArray(array(number()), (v) => {
          const sum = v.reduce((acc, n) => acc + n, 0);
          return sum >= targetSum ? true : "Sum too small";
        });
        const result = parse(schema, arr);
        const actualSum = arr.reduce((acc, n) => acc + n, 0);
        expect(result.success).toBe(actualSum >= targetSum);
      }
    );
  });
});
