import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { refineBigInt } from "./bigint";
import { bigint } from "../../primitives/bigint";
import { parse } from "../../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../../core/consts/messages";
import type { BigIntSchema } from "@kanon/types/primitives";
import type { BigIntConstraint } from "@kanon/types/constraints";

// AI_OK : Code Review by Claude Opus 4.5, 2025-12-06
describe("refineBigInt", () => {
  describe("[🎯] Specification Tests", () => {
    describe("first refinement creation (Requirement 21.7)", () => {
      it("[🎯] should create a new refinements array when schema has no refinements", () => {
        const baseSchema = bigint();
        expect(baseSchema.refinements).toBeUndefined();

        const refinedSchema = refineBigInt(baseSchema, () => true);
        expect(refinedSchema.refinements).toBeDefined();
        expect(refinedSchema.refinements).toHaveLength(1);
      });
    });
  });
  describe("validation", () => {
    it("should accept valid bigint that passes refinement", () => {
      const schema = refineBigInt(bigint(), (value) => {
        if (value > 10n) return true;
        return "BigInt must be greater than 10";
      });

      expect(parse(schema, 15n).success).toBe(true);
      expect(parse(schema, 100n).success).toBe(true);
    });

    it("should reject valid bigint that fails refinement", () => {
      const schema = refineBigInt(bigint(), (value) => {
        if (value > 10n) return true;
        return "BigInt must be greater than 10";
      });

      const result = parse(schema, 5n);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("BigInt must be greater than 10");
      }
    });

    it("should reject non-bigint values", () => {
      const schema = refineBigInt(bigint(), () => true);

      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, "123").success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });

    it("should return correct error message for non-bigint values", () => {
      const schema = refineBigInt(bigint(), () => true);

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.bigint);
      }
    });

    it("should use custom error message from base schema for non-bigint values", () => {
      const customMessage = "Must be a bigint";
      const schema = refineBigInt(bigint(customMessage), () => true);

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should chain multiple refinements", () => {
      const schema1 = refineBigInt(bigint(), (value) => {
        if (value > 0n) return true;
        return "Must be positive";
      });

      const schema2 = refineBigInt(schema1, (value) => {
        if (value < 100n) return true;
        return "Must be less than 100";
      });

      expect(parse(schema2, 50n).success).toBe(true);
      expect(parse(schema2, -5n).success).toBe(false);
      expect(parse(schema2, 150n).success).toBe(false);
    });

    it("should return first failing refinement error", () => {
      const schema1 = refineBigInt(bigint(), (value) => {
        if (value > 0n) return true;
        return "First error";
      });

      const schema2 = refineBigInt(schema1, (value) => {
        if (value < 100n) return true;
        return "Second error";
      });

      const result = parse(schema2, -5n);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("First error");
      }
    });

    it("should return second refinement error if first passes", () => {
      const schema1 = refineBigInt(bigint(), (value) => {
        if (value > 0n) return true;
        return "First error";
      });

      const schema2 = refineBigInt(schema1, (value) => {
        if (value < 100n) return true;
        return "Second error";
      });

      const result = parse(schema2, 150n);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Second error");
      }
    });

    it("should handle zero", () => {
      const schema = refineBigInt(bigint(), (value) => {
        if (value === 0n) return "Zero not allowed";
        return true;
      });

      const result = parse(schema, 0n);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Zero not allowed");
      }
    });

    it("should handle negative bigint", () => {
      const schema = refineBigInt(bigint(), (value) => {
        if (value < 0n) return "Negative not allowed";
        return true;
      });

      expect(parse(schema, -5n).success).toBe(false);
      expect(parse(schema, 5n).success).toBe(true);
    });

    it("should handle very large bigint", () => {
      const largeBigInt = BigInt(Number.MAX_SAFE_INTEGER) * 2n;
      const schema = refineBigInt(bigint(), (value) => {
        if (value > 1000000n) return "Too large";
        return true;
      });

      const result = parse(schema, largeBigInt);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too large");
      }
    });

    it("should handle very small bigint", () => {
      const smallBigInt = BigInt(Number.MIN_SAFE_INTEGER) * 2n;
      const schema = refineBigInt(bigint(), (value) => {
        if (value < -1000000n) return "Too small";
        return true;
      });

      const result = parse(schema, smallBigInt);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too small");
      }
    });

    it("should handle refinement that always returns true", () => {
      const schema = refineBigInt(bigint(), () => true);

      expect(parse(schema, 0n).success).toBe(true);
      expect(parse(schema, -100n).success).toBe(true);
      expect(parse(schema, 100n).success).toBe(true);
    });

    it("should handle refinement that always returns error", () => {
      const schema = refineBigInt(bigint(), () => "Always fails");

      const result = parse(schema, 42n);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Always fails");
      }
    });

    it("should handle multiple chained refinements", () => {
      let schema: BigIntSchema | BigIntConstraint = bigint();
      schema = refineBigInt(schema, (v) => (v > 0n ? true : "Error 1"));
      schema = refineBigInt(schema, (v) => (v < 100n ? true : "Error 2"));
      schema = refineBigInt(schema, (v) => (v % 2n === 0n ? true : "Error 3"));

      expect(parse(schema, 50n).success).toBe(true);
      expect(parse(schema, -5n).success).toBe(false);
      expect(parse(schema, 150n).success).toBe(false);
      expect(parse(schema, 51n).success).toBe(false);
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = refineBigInt(bigint(), () => true);

      const result = parse(schema, 42n);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data).toBe("bigint");
        expect(result.data).toBe(42n);
      }
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.bigInt()])(
      "[🎲] should be idempotent - parsing twice yields same result",
      (num) => {
        const schema = refineBigInt(bigint(), () => true);
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

    itProp.prop([fc.bigInt()])(
      "[🎲] should not mutate input bigint",
      (num) => {
        const schema = refineBigInt(bigint(), () => true);
        const original = num;
        parse(schema, num);
        expect(num).toBe(original);
      }
    );

    itProp.prop([fc.bigInt(), fc.bigInt()])(
      "[🎲] refinement with min constraint - consistent behavior",
      (num, minOffset) => {
        const absOffset = minOffset < 0n ? -minOffset : minOffset;
        const min = num - absOffset;
        const schema = refineBigInt(bigint(), (v) =>
          v >= min ? true : "Too small"
        );
        const result = parse(schema, num);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.bigInt()])(
      "[🎲] refinement with even constraint - consistent behavior",
      (num) => {
        const schema = refineBigInt(bigint(), (v) =>
          v % 2n === 0n ? true : "Must be even"
        );
        const result = parse(schema, num);
        expect(result.success).toBe(num % 2n === 0n);
      }
    );
  });
});
