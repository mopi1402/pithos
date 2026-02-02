import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { refineNumber } from "./number";
import { number } from "../../primitives/number";
import { parse } from "../../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../../core/consts/messages";
import type { NumberSchema } from "@kanon/types/primitives";
import type { NumberConstraint } from "@kanon/types/constraints";

// AI_OK : Code Review by Claude Opus 4.5, 2025-12-06
describe("refineNumber", () => {
  describe("[🎯] Specification Tests", () => {
    describe("first refinement creation (Requirement 21.5)", () => {
      it("[🎯] should create a new refinements array when schema has no refinements", () => {
        const baseSchema = number();
        expect(baseSchema.refinements).toBeUndefined();

        const refinedSchema = refineNumber(baseSchema, () => true);
        expect(refinedSchema.refinements).toBeDefined();
        expect(refinedSchema.refinements).toHaveLength(1);
      });
    });
  });
  describe("validation", () => {
    it("should accept valid number that passes refinement", () => {
      const schema = refineNumber(number(), (value) => {
        if (value > 10) return true;
        return "Number must be greater than 10";
      });

      expect(parse(schema, 15).success).toBe(true);
      expect(parse(schema, 100).success).toBe(true);
    });

    it("should reject valid number that fails refinement", () => {
      const schema = refineNumber(number(), (value) => {
        if (value > 10) return true;
        return "Number must be greater than 10";
      });

      const result = parse(schema, 5);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Number must be greater than 10");
      }
    });

    it("should reject non-number values", () => {
      const schema = refineNumber(number(), () => true);

      expect(parse(schema, "123").success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });

    it("should reject NaN", () => {
      const schema = refineNumber(number(), () => true);

      const result = parse(schema, Number.NaN);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.number);
      }
    });

    it("should return correct error message for non-number values", () => {
      const schema = refineNumber(number(), () => true);

      const result = parse(schema, "123");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.number);
      }
    });

    it("should use custom error message from base schema for non-number values", () => {
      const customMessage = "Must be a number";
      const schema = refineNumber(number(customMessage), () => true);

      const result = parse(schema, "123");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should chain multiple refinements", () => {
      const schema1 = refineNumber(number(), (value) => {
        if (value > 0) return true;
        return "Must be positive";
      });

      const schema2 = refineNumber(schema1, (value) => {
        if (value < 100) return true;
        return "Must be less than 100";
      });

      expect(parse(schema2, 50).success).toBe(true);
      expect(parse(schema2, -5).success).toBe(false);
      expect(parse(schema2, 150).success).toBe(false);
    });

    it("should return first failing refinement error", () => {
      const schema1 = refineNumber(number(), (value) => {
        if (value > 0) return true;
        return "First error";
      });

      const schema2 = refineNumber(schema1, (value) => {
        if (value < 100) return true;
        return "Second error";
      });

      const result = parse(schema2, -5);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("First error");
      }
    });

    it("should return second refinement error if first passes", () => {
      const schema1 = refineNumber(number(), (value) => {
        if (value > 0) return true;
        return "First error";
      });

      const schema2 = refineNumber(schema1, (value) => {
        if (value < 100) return true;
        return "Second error";
      });

      const result = parse(schema2, 150);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Second error");
      }
    });

    it("should handle zero", () => {
      const schema = refineNumber(number(), (value) => {
        if (value === 0) return "Zero not allowed";
        return true;
      });

      const result = parse(schema, 0);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Zero not allowed");
      }
    });

    it("should handle negative numbers", () => {
      const schema = refineNumber(number(), (value) => {
        if (value < 0) return "Negative not allowed";
        return true;
      });

      expect(parse(schema, -5).success).toBe(false);
      expect(parse(schema, 5).success).toBe(true);
    });

    it("should handle Infinity", () => {
      const schema = refineNumber(number(), (value) => {
        if (!Number.isFinite(value)) return "Infinity not allowed";
        return true;
      });

      const result = parse(schema, Infinity);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Infinity not allowed");
      }
    });

    it("should handle -Infinity", () => {
      const schema = refineNumber(number(), (value) => {
        if (!Number.isFinite(value)) return "Infinity not allowed";
        return true;
      });

      const result = parse(schema, -Infinity);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Infinity not allowed");
      }
    });

    it("should handle floating point numbers", () => {
      const schema = refineNumber(number(), (value) => {
        if (Number.isInteger(value)) return "Must be a float";
        return true;
      });

      expect(parse(schema, 1.5).success).toBe(true);
      expect(parse(schema, 1).success).toBe(false);
    });

    it("should handle very large numbers", () => {
      const schema = refineNumber(number(), (value) => {
        if (value > Number.MAX_SAFE_INTEGER) return "Too large";
        return true;
      });

      const result = parse(schema, Number.MAX_SAFE_INTEGER + 1);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too large");
      }
    });

    it("should handle very small numbers", () => {
      const schema = refineNumber(number(), (value) => {
        if (value < Number.MIN_SAFE_INTEGER) return "Too small";
        return true;
      });

      const result = parse(schema, Number.MIN_SAFE_INTEGER - 1);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too small");
      }
    });

    it("should handle refinement that always returns true", () => {
      const schema = refineNumber(number(), () => true);

      expect(parse(schema, 0).success).toBe(true);
      expect(parse(schema, -100).success).toBe(true);
      expect(parse(schema, 100).success).toBe(true);
    });

    it("should handle refinement that always returns error", () => {
      const schema = refineNumber(number(), () => "Always fails");

      const result = parse(schema, 42);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Always fails");
      }
    });

    it("should handle multiple chained refinements", () => {
      let schema: NumberSchema | NumberConstraint = number();
      schema = refineNumber(schema, (v) => (v > 0 ? true : "Error 1"));
      schema = refineNumber(schema, (v) => (v < 100 ? true : "Error 2"));
      schema = refineNumber(schema, (v) => (v % 2 === 0 ? true : "Error 3"));

      expect(parse(schema, 50).success).toBe(true);
      expect(parse(schema, -5).success).toBe(false);
      expect(parse(schema, 150).success).toBe(false);
      expect(parse(schema, 51).success).toBe(false);
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = refineNumber(number(), () => true);

      const result = parse(schema, 42);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data).toBe("number");
        expect(result.data).toBe(42);
      }
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.double({ noNaN: true })])(
      "[🎲] should be idempotent - parsing twice yields same result",
      (num) => {
        const schema = refineNumber(number(), () => true);
        const result1 = parse(schema, num);
        if (result1.success) {
          const result2 = parse(schema, result1.data);
          expect(result2.success).toBe(true);
          if (result2.success) {
            expect(result2.data).toBe(result1.data);
          }
        }
      }
    );

    itProp.prop([fc.double({ noNaN: true })])(
      "[🎲] should not mutate input number",
      (num) => {
        const schema = refineNumber(number(), () => true);
        const original = num;
        parse(schema, num);
        expect(num).toBe(original);
      }
    );

    itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true }), fc.double({ noNaN: true, noDefaultInfinity: true })])(
      "[🎲] refinement with min constraint - consistent behavior",
      (num, minOffset) => {
        const min = num - Math.abs(minOffset);
        const schema = refineNumber(number(), (v) =>
          v >= min ? true : "Too small"
        );
        const result = parse(schema, num);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.integer()])(
      "[🎲] refinement with even constraint - consistent behavior",
      (num) => {
        const schema = refineNumber(number(), (v) =>
          v % 2 === 0 ? true : "Must be even"
        );
        const result = parse(schema, num);
        expect(result.success).toBe(num % 2 === 0);
      }
    );
  });
});
