import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { addNumberConstraints } from "./number";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("addNumberConstraints", () => {
  const createBaseSchema = () => ({
    type: "number" as const,
    message: undefined,
    refinements: undefined,
    validator: (value: unknown) =>
      typeof value === "number" && !Number.isNaN(value)
        ? true
        : ERROR_MESSAGES_COMPOSITION.number,
  });

  it("should add all constraint methods to base schema", () => {
    const baseSchema = createBaseSchema();
    const schema = addNumberConstraints(baseSchema);

    expect(schema.min).toBeDefined();
    expect(schema.max).toBeDefined();
    expect(schema.int).toBeDefined();
    expect(schema.positive).toBeDefined();
    expect(schema.negative).toBeDefined();
    expect(schema.lt).toBeDefined();
    expect(schema.lte).toBeDefined();
    expect(schema.gt).toBeDefined();
    expect(schema.gte).toBeDefined();
    expect(schema.multipleOf).toBeDefined();
  });

  describe("min", () => {
    it("should validate number >= min", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).min(5);

      expect(parse(schema, 5)).toEqual({ success: true, data: 5 });
      expect(parse(schema, 10)).toEqual({ success: true, data: 10 });
    });

    it("should reject number < min", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).min(5);

      const result = parse(schema, 3);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.min(5));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).min(5, "Too small");

      const result = parse(schema, 3);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too small");
      }
    });
  });

  describe("max", () => {
    it("should validate number <= max", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).max(10);

      expect(parse(schema, 10)).toEqual({ success: true, data: 10 });
      expect(parse(schema, 5)).toEqual({ success: true, data: 5 });
    });

    it("should reject number > max", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).max(10);

      const result = parse(schema, 15);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.max(10));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).max(10, "Too large");

      const result = parse(schema, 15);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too large");
      }
    });
  });

  describe("int", () => {
    it("should validate integer numbers", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).int();

      expect(parse(schema, 5)).toEqual({ success: true, data: 5 });
      expect(parse(schema, 0)).toEqual({ success: true, data: 0 });
      expect(parse(schema, -10)).toEqual({ success: true, data: -10 });
    });

    it("should reject non-integer numbers", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).int();

      const result1 = parse(schema, 5.5);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.int);
      }

      const result2 = parse(schema, 3.14);
      expect(result2.success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).int("Must be integer");

      const result = parse(schema, 5.5);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Must be integer");
      }
    });
  });

  describe("positive", () => {
    it("should validate positive numbers", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).positive();

      expect(parse(schema, 1)).toEqual({ success: true, data: 1 });
      expect(parse(schema, 100)).toEqual({ success: true, data: 100 });
    });

    it("should reject zero and negative numbers", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).positive();

      const result1 = parse(schema, 0);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.positive);
      }

      const result2 = parse(schema, -5);
      expect(result2.success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema =
        addNumberConstraints(baseSchema).positive("Must be positive");

      const result = parse(schema, 0);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Must be positive");
      }
    });
  });

  describe("negative", () => {
    it("should validate negative numbers", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).negative();

      expect(parse(schema, -1)).toEqual({ success: true, data: -1 });
      expect(parse(schema, -100)).toEqual({ success: true, data: -100 });
    });

    it("should reject zero and positive numbers", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).negative();

      const result1 = parse(schema, 0);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.negative);
      }

      const result2 = parse(schema, 5);
      expect(result2.success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema =
        addNumberConstraints(baseSchema).negative("Must be negative");

      const result = parse(schema, 0);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Must be negative");
      }
    });
  });

  describe("lt", () => {
    it("should validate number < lessThan", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).lt(10);

      expect(parse(schema, 9)).toEqual({ success: true, data: 9 });
      expect(parse(schema, 5)).toEqual({ success: true, data: 5 });
    });

    it("should reject number >= lessThan", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).lt(10);

      const result1 = parse(schema, 10);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.lt(10));
      }

      const result2 = parse(schema, 15);
      expect(result2.success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).lt(10, "Too large");

      const result = parse(schema, 10);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too large");
      }
    });
  });

  describe("lte", () => {
    it("should validate number <= lessThanOrEqual", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).lte(10);

      expect(parse(schema, 10)).toEqual({ success: true, data: 10 });
      expect(parse(schema, 5)).toEqual({ success: true, data: 5 });
    });

    it("should reject number > lessThanOrEqual", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).lte(10);

      const result = parse(schema, 15);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.lte(10));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).lte(10, "Too large");

      const result = parse(schema, 15);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too large");
      }
    });
  });

  describe("gt", () => {
    it("should validate number > greaterThan", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).gt(5);

      expect(parse(schema, 6)).toEqual({ success: true, data: 6 });
      expect(parse(schema, 10)).toEqual({ success: true, data: 10 });
    });

    it("should reject number <= greaterThan", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).gt(5);

      const result1 = parse(schema, 5);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.gt(5));
      }

      const result2 = parse(schema, 3);
      expect(result2.success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).gt(5, "Too small");

      const result = parse(schema, 5);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too small");
      }
    });
  });

  describe("gte", () => {
    it("should validate number >= greaterThanOrEqual", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).gte(5);

      expect(parse(schema, 5)).toEqual({ success: true, data: 5 });
      expect(parse(schema, 10)).toEqual({ success: true, data: 10 });
    });

    it("should reject number < greaterThanOrEqual", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).gte(5);

      const result = parse(schema, 3);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.gte(5));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).gte(5, "Too small");

      const result = parse(schema, 3);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too small");
      }
    });
  });

  describe("multipleOf", () => {
    it("should validate number that is multiple of given value", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).multipleOf(5);

      expect(parse(schema, 5)).toEqual({ success: true, data: 5 });
      expect(parse(schema, 10)).toEqual({ success: true, data: 10 });
      expect(parse(schema, 0)).toEqual({ success: true, data: 0 });
      expect(parse(schema, -15)).toEqual({ success: true, data: -15 });
    });

    it("should reject number that is not multiple of given value", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).multipleOf(5);

      const result1 = parse(schema, 7);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.multipleOf(5));
      }

      const result2 = parse(schema, 13);
      expect(result2.success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).multipleOf(
        5,
        "Not multiple"
      );

      const result = parse(schema, 7);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Not multiple");
      }
    });

    it("should work with decimal multiples", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).multipleOf(0.5);

      expect(parse(schema, 1.5)).toEqual({ success: true, data: 1.5 });
      expect(parse(schema, 2)).toEqual({ success: true, data: 2 });
      const result = parse(schema, 1.3);
      expect(result.success).toBe(false);
    });
  });

  describe("chaining", () => {
    it("should allow chaining multiple constraints", () => {
      const baseSchema = createBaseSchema();
      const schema = addNumberConstraints(baseSchema).min(5).max(10).int();

      expect(parse(schema, 5)).toEqual({ success: true, data: 5 });
      expect(parse(schema, 10)).toEqual({ success: true, data: 10 });
      expect(parse(schema, 7)).toEqual({ success: true, data: 7 });

      const result1 = parse(schema, 3);
      expect(result1.success).toBe(false);

      const result2 = parse(schema, 15);
      expect(result2.success).toBe(false);

      const result3 = parse(schema, 7.5);
      expect(result3.success).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should reject non-number values", () => {
      const schema = addNumberConstraints(createBaseSchema()).min(0);

      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, "5").success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
    });

    it("should reject NaN", () => {
      const schema = addNumberConstraints(createBaseSchema()).min(0);
      expect(parse(schema, Number.NaN).success).toBe(false);
    });

    it("should handle Infinity", () => {
      const schema = addNumberConstraints(createBaseSchema()).max(1000);

      expect(parse(schema, Infinity).success).toBe(false);
      expect(parse(schema, -Infinity).success).toBe(true);
    });

    it("should handle floating point precision with multipleOf", () => {
      const schema = addNumberConstraints(createBaseSchema()).multipleOf(0.1);

      // 0.3 est en fait 0.30000000000000004 en JS, donc 0.3 % 0.1 !== 0
      expect(parse(schema, 0.3).success).toBe(false);
      // 0.2 fonctionne car 0.2 % 0.1 === 0
      expect(parse(schema, 0.2).success).toBe(true);
      expect(parse(schema, 0.4).success).toBe(true);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("min/max/positive/negative boundary conditions", () => {
      it("[🎯] should accept zero when min(0) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const schema = addNumberConstraints(baseSchema).min(0);

        expect(parse(schema, 0)).toEqual({ success: true, data: 0 });
      });

      it("[🎯] should accept zero when max(0) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const schema = addNumberConstraints(baseSchema).max(0);

        expect(parse(schema, 0)).toEqual({ success: true, data: 0 });
      });

      it("[🎯] should reject zero when positive() - boundary: zero is not positive", () => {
        const baseSchema = createBaseSchema();
        const schema = addNumberConstraints(baseSchema).positive();

        const result = parse(schema, 0);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.positive);
        }
      });

      it("[🎯] should reject zero when negative() - boundary: zero is not negative", () => {
        const baseSchema = createBaseSchema();
        const schema = addNumberConstraints(baseSchema).negative();

        const result = parse(schema, 0);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.negative);
        }
      });
    });

    describe("lt/gt/lte/gte boundary conditions", () => {
      it("[🎯] should reject zero when lt(0) - boundary: strict less than", () => {
        const baseSchema = createBaseSchema();
        const schema = addNumberConstraints(baseSchema).lt(0);

        const result = parse(schema, 0);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.lt(0));
        }
      });

      it("[🎯] should reject zero when gt(0) - boundary: strict greater than", () => {
        const baseSchema = createBaseSchema();
        const schema = addNumberConstraints(baseSchema).gt(0);

        const result = parse(schema, 0);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.gt(0));
        }
      });

      it("[🎯] should accept zero when lte(0) - boundary: less than or equal", () => {
        const baseSchema = createBaseSchema();
        const schema = addNumberConstraints(baseSchema).lte(0);

        expect(parse(schema, 0)).toEqual({ success: true, data: 0 });
      });

      it("[🎯] should accept zero when gte(0) - boundary: greater than or equal", () => {
        const baseSchema = createBaseSchema();
        const schema = addNumberConstraints(baseSchema).gte(0);

        expect(parse(schema, 0)).toEqual({ success: true, data: 0 });
      });
    });

    describe("multipleOf and int edge cases", () => {
      it("[🎯] should handle multipleOf(0) - edge case: division by zero returns NaN", () => {
        const baseSchema = createBaseSchema();
        const schema = addNumberConstraints(baseSchema).multipleOf(0);

        // Any number % 0 === NaN, and NaN === 0 is false
        const result = parse(schema, 5);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.multipleOf(0));
        }
      });

      it("[🎯] should reject Infinity when int() - boundary: Infinity is not an integer", () => {
        const baseSchema = createBaseSchema();
        const schema = addNumberConstraints(baseSchema).int();

        const result = parse(schema, Infinity);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.int);
        }
      });

      it("[🎯] should reject -Infinity when int() - boundary: -Infinity is not an integer", () => {
        const baseSchema = createBaseSchema();
        const schema = addNumberConstraints(baseSchema).int();

        const result = parse(schema, -Infinity);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.int);
        }
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true }), fc.double({ noNaN: true, noDefaultInfinity: true })])(
      "[🎲] min accepts numbers >= min value",
      (value, minOffset) => {
        const min = value - Math.abs(minOffset);
        const schema = addNumberConstraints(createBaseSchema()).min(min);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true }), fc.double({ noNaN: true, noDefaultInfinity: true })])(
      "[🎲] max accepts numbers <= max value",
      (value, maxOffset) => {
        const max = value + Math.abs(maxOffset);
        const schema = addNumberConstraints(createBaseSchema()).max(max);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.integer()])(
      "[🎲] int accepts all integers",
      (value) => {
        const schema = addNumberConstraints(createBaseSchema()).int();
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.double({ min: 0.0001, noNaN: true, noDefaultInfinity: true })])(
      "[🎲] positive accepts all positive numbers",
      (value) => {
        const schema = addNumberConstraints(createBaseSchema()).positive();
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.double({ max: -0.0001, noNaN: true, noDefaultInfinity: true })])(
      "[🎲] negative accepts all negative numbers",
      (value) => {
        const schema = addNumberConstraints(createBaseSchema()).negative();
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([fc.integer(), fc.integer({ min: 1, max: 100 })])(
      "[🎲] multipleOf accepts multiples",
      (multiplier, base) => {
        const value = multiplier * base;
        const schema = addNumberConstraints(createBaseSchema()).multipleOf(base);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );
  });
});
