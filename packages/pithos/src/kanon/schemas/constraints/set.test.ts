import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { set } from "../composites/set";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";
import { unknown } from "../primitives/unknown";

describe("addSetConstraints", () => {
  describe("minSize", () => {
    it("should accept set with size >= min", () => {
      const schema = set(string()).minSize(2);

      expect(parse(schema, new Set(["a", "b"])).success).toBe(true);
      expect(parse(schema, new Set(["a", "b", "c"])).success).toBe(true);
    });

    it("should reject set with size < min", () => {
      const schema = set(string()).minSize(2);

      const result = parse(schema, new Set(["a"]));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.setMinSize(2));
      }
    });

    it("should use custom error message", () => {
      const customMessage = "Need at least 2 items";
      const schema = set(string()).minSize(2, customMessage);

      const result = parse(schema, new Set(["a"]));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should handle empty set", () => {
      const schema = set(string()).minSize(1);

      const result = parse(schema, new Set());
      expect(result.success).toBe(false);
    });
  });

  describe("maxSize", () => {
    it("should accept set with size <= max", () => {
      const schema = set(string()).maxSize(3);

      expect(parse(schema, new Set(["a"])).success).toBe(true);
      expect(parse(schema, new Set(["a", "b", "c"])).success).toBe(true);
    });

    it("should reject set with size > max", () => {
      const schema = set(string()).maxSize(2);

      const result = parse(schema, new Set(["a", "b", "c"]));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.setMaxSize(2));
      }
    });

    it("should use custom error message", () => {
      const customMessage = "Too many items";
      const schema = set(string()).maxSize(2, customMessage);

      const result = parse(schema, new Set(["a", "b", "c"]));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });
  });

  describe("chaining", () => {
    it("should chain minSize and maxSize", () => {
      const schema = set(number()).minSize(2).maxSize(4);

      expect(parse(schema, new Set([1])).success).toBe(false);
      expect(parse(schema, new Set([1, 2])).success).toBe(true);
      expect(parse(schema, new Set([1, 2, 3, 4])).success).toBe(true);
      expect(parse(schema, new Set([1, 2, 3, 4, 5])).success).toBe(false);
    });

    it("should validate item types with constraints", () => {
      const schema = set(string()).minSize(1);

      expect(parse(schema, new Set(["valid"])).success).toBe(true);
      expect(parse(schema, new Set([123])).success).toBe(false);
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.uniqueArray(fc.string(), { minLength: 0, maxLength: 10 })])(
      "[🎲] should be idempotent - parsing twice yields same result",
      (arr) => {
        const schema = set(string());
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

    itProp.prop([fc.uniqueArray(fc.string(), { minLength: 0, maxLength: 10 })])(
      "[🎲] should preserve set size when valid",
      (arr) => {
        const schema = set(string());
        const input = new Set(arr);
        const result = parse(schema, input);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.size).toBe(input.size);
        }
      }
    );

    itProp.prop([fc.integer({ min: 0, max: 5 }), fc.integer({ min: 0, max: 10 })])(
      "[🎲] minSize constraint - accepts sets with size >= min",
      (minSize, extraSize) => {
        const schema = set(number()).minSize(minSize);
        const arr = Array.from({ length: minSize + extraSize }, (_, i) => i);
        const input = new Set(arr);
        const result = parse(schema, input);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.integer({ min: 1, max: 5 }), fc.integer({ min: 1, max: 5 })])(
      "[🎲] maxSize constraint - rejects sets with size > max",
      (maxSize, extraSize) => {
        const schema = set(number()).maxSize(maxSize);
        const arr = Array.from({ length: maxSize + extraSize }, (_, i) => i);
        const input = new Set(arr);
        const result = parse(schema, input);
        expect(result.success).toBe(false);
      }
    );

    itProp.prop([fc.uniqueArray(fc.string(), { minLength: 1, maxLength: 10 })])(
      "[🎲] should not mutate input set",
      (arr) => {
        const schema = set(string());
        const input = new Set(arr);
        const originalSize = input.size;
        const originalValues = [...input];
        parse(schema, input);
        expect(input.size).toBe(originalSize);
        expect([...input]).toEqual(originalValues);
      }
    );
  });

  describe("[🎯] Specification Tests", () => {
    describe("minSize/maxSize boundary conditions", () => {
      it("[🎯] should accept empty set when minSize(0) - boundary: exact limit", () => {
        const schema = set(unknown()).minSize(0);

        const result = parse(schema, new Set());
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.size).toBe(0);
        }
      });

      it("[🎯] should only accept empty set when maxSize(0) - boundary: exact limit", () => {
        const schema = set(unknown()).maxSize(0);

        // Empty set should be accepted
        const emptyResult = parse(schema, new Set());
        expect(emptyResult.success).toBe(true);
        if (emptyResult.success) {
          expect(emptyResult.data.size).toBe(0);
        }

        // Non-empty set should be rejected
        const nonEmptyResult = parse(schema, new Set(["a"]));
        expect(nonEmptyResult.success).toBe(false);
        if (!nonEmptyResult.success) {
          expect(nonEmptyResult.error).toBe(
            ERROR_MESSAGES_COMPOSITION.setMaxSize(0)
          );
        }
      });

      it("[🎯] should accept set with exactly n elements when minSize(n) - boundary: exact limit", () => {
        const n = 3;
        const schema = set(unknown()).minSize(n);

        const result = parse(schema, new Set(["a", "b", "c"]));
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.size).toBe(n);
        }
      });

      it("[🎯] should reject set with n-1 elements when minSize(n) - boundary: just below", () => {
        const n = 3;
        const schema = set(unknown()).minSize(n);

        const result = parse(schema, new Set(["a", "b"])); // n-1 = 2 elements
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.setMinSize(n));
        }
      });

      it("[🎯] should accept set with exactly n elements when maxSize(n) - boundary: exact limit", () => {
        const n = 3;
        const schema = set(unknown()).maxSize(n);

        const result = parse(schema, new Set(["a", "b", "c"]));
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.size).toBe(n);
        }
      });

      it("[🎯] should reject set with n+1 elements when maxSize(n) - boundary: just above", () => {
        const n = 3;
        const schema = set(unknown()).maxSize(n);

        const result = parse(schema, new Set(["a", "b", "c", "d"])); // n+1 = 4 elements
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.setMaxSize(n));
        }
      });
    });
  });
});
