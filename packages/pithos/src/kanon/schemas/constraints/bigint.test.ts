import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { addBigIntConstraints } from "./bigint";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("addBigIntConstraints", () => {
  const createBaseSchema = () => ({
    type: "bigint" as const,
    message: undefined,
    refinements: undefined,
    validator: (value: unknown) =>
      typeof value === "bigint" ? true : ERROR_MESSAGES_COMPOSITION.bigint,
  });

  it("should add all constraint methods to base schema", () => {
    const baseSchema = createBaseSchema();
    const schema = addBigIntConstraints(baseSchema);

    expect(schema.min).toBeDefined();
    expect(schema.max).toBeDefined();
    expect(schema.positive).toBeDefined();
    expect(schema.negative).toBeDefined();
  });

  describe("min", () => {
    it("should validate bigint >= min", () => {
      const baseSchema = createBaseSchema();
      const schema = addBigIntConstraints(baseSchema).min(5n);

      expect(parse(schema, 5n)).toEqual({ success: true, data: 5n });
      expect(parse(schema, 10n)).toEqual({ success: true, data: 10n });
    });

    it("should reject bigint < min", () => {
      const baseSchema = createBaseSchema();
      const schema = addBigIntConstraints(baseSchema).min(5n);

      const result = parse(schema, 3n);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.bigintMin(5n));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addBigIntConstraints(baseSchema).min(5n, "Too small");

      const result = parse(schema, 3n);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too small");
      }
    });

    it("should work with large bigint values", () => {
      const baseSchema = createBaseSchema();
      const schema = addBigIntConstraints(baseSchema).min(9007199254740992n);

      expect(parse(schema, 9007199254740992n)).toEqual({
        success: true,
        data: 9007199254740992n,
      });
      const result = parse(schema, 9007199254740991n);
      expect(result.success).toBe(false);
    });
  });

  describe("max", () => {
    it("should validate bigint <= max", () => {
      const baseSchema = createBaseSchema();
      const schema = addBigIntConstraints(baseSchema).max(10n);

      expect(parse(schema, 10n)).toEqual({ success: true, data: 10n });
      expect(parse(schema, 5n)).toEqual({ success: true, data: 5n });
    });

    it("should reject bigint > max", () => {
      const baseSchema = createBaseSchema();
      const schema = addBigIntConstraints(baseSchema).max(10n);

      const result = parse(schema, 15n);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.bigintMax(10n));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addBigIntConstraints(baseSchema).max(10n, "Too large");

      const result = parse(schema, 15n);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too large");
      }
    });

    it("should work with large bigint values", () => {
      const baseSchema = createBaseSchema();
      const schema = addBigIntConstraints(baseSchema).max(9007199254740992n);

      expect(parse(schema, 9007199254740992n)).toEqual({
        success: true,
        data: 9007199254740992n,
      });
      const result = parse(schema, 9007199254740993n);
      expect(result.success).toBe(false);
    });
  });

  describe("positive", () => {
    it("should validate positive bigint", () => {
      const baseSchema = createBaseSchema();
      const schema = addBigIntConstraints(baseSchema).positive();

      expect(parse(schema, 1n)).toEqual({ success: true, data: 1n });
      expect(parse(schema, 100n)).toEqual({ success: true, data: 100n });
    });

    it("should reject zero and negative bigint", () => {
      const baseSchema = createBaseSchema();
      const schema = addBigIntConstraints(baseSchema).positive();

      const result1 = parse(schema, 0n);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.bigintPositive);
      }

      const result2 = parse(schema, -5n);
      expect(result2.success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema =
        addBigIntConstraints(baseSchema).positive("Must be positive");

      const result = parse(schema, 0n);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Must be positive");
      }
    });
  });

  describe("negative", () => {
    it("should validate negative bigint", () => {
      const baseSchema = createBaseSchema();
      const schema = addBigIntConstraints(baseSchema).negative();

      expect(parse(schema, -1n)).toEqual({ success: true, data: -1n });
      expect(parse(schema, -100n)).toEqual({ success: true, data: -100n });
    });

    it("should reject zero and positive bigint", () => {
      const baseSchema = createBaseSchema();
      const schema = addBigIntConstraints(baseSchema).negative();

      const result1 = parse(schema, 0n);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.bigintNegative);
      }

      const result2 = parse(schema, 5n);
      expect(result2.success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema =
        addBigIntConstraints(baseSchema).negative("Must be negative");

      const result = parse(schema, 0n);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Must be negative");
      }
    });
  });

  describe("chaining", () => {
    it("should allow chaining multiple constraints", () => {
      const baseSchema = createBaseSchema();
      const schema = addBigIntConstraints(baseSchema)
        .min(5n)
        .max(10n)
        .positive();

      expect(parse(schema, 5n)).toEqual({ success: true, data: 5n });
      expect(parse(schema, 10n)).toEqual({ success: true, data: 10n });
      expect(parse(schema, 7n)).toEqual({ success: true, data: 7n });

      const result1 = parse(schema, 3n);
      expect(result1.success).toBe(false);

      const result2 = parse(schema, 15n);
      expect(result2.success).toBe(false);

      const result3 = parse(schema, 0n);
      expect(result3.success).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle negative min values", () => {
      const schema = addBigIntConstraints(createBaseSchema()).min(-10n);
      expect(parse(schema, -10n)).toEqual({ success: true, data: -10n });
      expect(parse(schema, -5n)).toEqual({ success: true, data: -5n });

      const result = parse(schema, -15n);
      expect(result.success).toBe(false);
    });

    it("should handle negative max values", () => {
      const schema = addBigIntConstraints(createBaseSchema()).max(-5n);
      expect(parse(schema, -5n)).toEqual({ success: true, data: -5n });
      expect(parse(schema, -10n)).toEqual({ success: true, data: -10n });

      const result = parse(schema, -3n);
      expect(result.success).toBe(false);
    });

    it("should reject non-bigint values", () => {
      const schema = addBigIntConstraints(createBaseSchema()).min(5n);

      expect(parse(schema, 5).success).toBe(false);
      expect(parse(schema, "5").success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("min/max/positive/negative boundary conditions", () => {
      it("[🎯] should accept zero when min(0n) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const schema = addBigIntConstraints(baseSchema).min(0n);

        expect(parse(schema, 0n)).toEqual({ success: true, data: 0n });
      });

      it("[🎯] should accept zero when max(0n) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const schema = addBigIntConstraints(baseSchema).max(0n);

        expect(parse(schema, 0n)).toEqual({ success: true, data: 0n });
      });

      it("[🎯] should reject zero when positive() - boundary: zero is not positive", () => {
        const baseSchema = createBaseSchema();
        const schema = addBigIntConstraints(baseSchema).positive();

        const result = parse(schema, 0n);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.bigintPositive);
        }
      });

      it("[🎯] should reject zero when negative() - boundary: zero is not negative", () => {
        const baseSchema = createBaseSchema();
        const schema = addBigIntConstraints(baseSchema).negative();

        const result = parse(schema, 0n);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.bigintNegative);
        }
      });
    });

    describe("min/max exact/below/above boundary conditions", () => {
      it("[🎯] should accept exactly n when min(n) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const n = 100n;
        const schema = addBigIntConstraints(baseSchema).min(n);

        expect(parse(schema, n)).toEqual({ success: true, data: n });
      });

      it("[🎯] should reject n-1n when min(n) - boundary: just below", () => {
        const baseSchema = createBaseSchema();
        const n = 100n;
        const schema = addBigIntConstraints(baseSchema).min(n);

        const result = parse(schema, n - 1n);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.bigintMin(n));
        }
      });

      it("[🎯] should accept exactly n when max(n) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const n = 100n;
        const schema = addBigIntConstraints(baseSchema).max(n);

        expect(parse(schema, n)).toEqual({ success: true, data: n });
      });

      it("[🎯] should reject n+1n when max(n) - boundary: just above", () => {
        const baseSchema = createBaseSchema();
        const n = 100n;
        const schema = addBigIntConstraints(baseSchema).max(n);

        const result = parse(schema, n + 1n);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.bigintMax(n));
        }
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.bigInt(), fc.bigInt()])(
      "[🎲] min accepts bigint >= min value",
      (value, minOffset) => {
        const min = value - (minOffset < 0n ? -minOffset : minOffset);
        const schema = addBigIntConstraints(createBaseSchema()).min(min);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.bigInt(), fc.bigInt()])(
      "[🎲] max accepts bigint <= max value",
      (value, maxOffset) => {
        const max = value + (maxOffset < 0n ? -maxOffset : maxOffset);
        const schema = addBigIntConstraints(createBaseSchema()).max(max);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.bigInt({ min: 1n })])(
      "[🎲] positive accepts all positive bigints",
      (value) => {
        const schema = addBigIntConstraints(createBaseSchema()).positive();
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.bigInt({ max: -1n })])(
      "[🎲] negative accepts all negative bigints",
      (value) => {
        const schema = addBigIntConstraints(createBaseSchema()).negative();
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );
  });
});
