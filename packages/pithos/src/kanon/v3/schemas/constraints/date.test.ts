import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { addDateConstraints } from "./date";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

// AI_OK : Code Review by Claude Opus 4.5, 2025-12-06
describe("addDateConstraints", () => {
  const createBaseSchema = () => ({
    type: "date" as const,
    message: undefined,
    refinements: undefined,
    validator: (value: unknown) =>
      value instanceof Date && !Number.isNaN(value.getTime())
        ? true
        : ERROR_MESSAGES_COMPOSITION.date,
  });

  it("should add all constraint methods to base schema", () => {
    const baseSchema = createBaseSchema();
    const schema = addDateConstraints(baseSchema);

    expect(schema.min).toBeDefined();
    expect(schema.max).toBeDefined();
    expect(schema.before).toBeDefined();
    expect(schema.after).toBeDefined();
  });

  describe("min", () => {
    it("should validate date >= min", () => {
      const baseSchema = createBaseSchema();
      const minDate = new Date("2023-01-01");
      const schema = addDateConstraints(baseSchema).min(minDate);

      expect(parse(schema, minDate)).toEqual({
        success: true,
        data: minDate,
      });
      expect(parse(schema, new Date("2023-06-01"))).toEqual({
        success: true,
        data: new Date("2023-06-01"),
      });
    });

    it("should reject date < min", () => {
      const baseSchema = createBaseSchema();
      const minDate = new Date("2023-01-01");
      const schema = addDateConstraints(baseSchema).min(minDate);

      const result = parse(schema, new Date("2022-12-31"));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.dateMin(minDate));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const minDate = new Date("2023-01-01");
      const schema = addDateConstraints(baseSchema).min(minDate, "Too early");

      const result = parse(schema, new Date("2022-12-31"));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too early");
      }
    });
  });

  describe("max", () => {
    it("should validate date <= max", () => {
      const baseSchema = createBaseSchema();
      const maxDate = new Date("2023-12-31");
      const schema = addDateConstraints(baseSchema).max(maxDate);

      expect(parse(schema, maxDate)).toEqual({
        success: true,
        data: maxDate,
      });
      expect(parse(schema, new Date("2023-06-01"))).toEqual({
        success: true,
        data: new Date("2023-06-01"),
      });
    });

    it("should reject date > max", () => {
      const baseSchema = createBaseSchema();
      const maxDate = new Date("2023-12-31");
      const schema = addDateConstraints(baseSchema).max(maxDate);

      const result = parse(schema, new Date("2024-01-01"));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.dateMax(maxDate));
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const maxDate = new Date("2023-12-31");
      const schema = addDateConstraints(baseSchema).max(maxDate, "Too late");

      const result = parse(schema, new Date("2024-01-01"));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too late");
      }
    });
  });

  describe("before", () => {
    it("should validate date < before", () => {
      const baseSchema = createBaseSchema();
      const beforeDate = new Date("2023-12-31");
      const schema = addDateConstraints(baseSchema).before(beforeDate);

      expect(parse(schema, new Date("2023-12-30"))).toEqual({
        success: true,
        data: new Date("2023-12-30"),
      });
      expect(parse(schema, new Date("2023-06-01"))).toEqual({
        success: true,
        data: new Date("2023-06-01"),
      });
    });

    it("should reject date >= before", () => {
      const baseSchema = createBaseSchema();
      const beforeDate = new Date("2023-12-31");
      const schema = addDateConstraints(baseSchema).before(beforeDate);

      const result1 = parse(schema, beforeDate);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(
          ERROR_MESSAGES_COMPOSITION.dateBefore(beforeDate)
        );
      }

      const result2 = parse(schema, new Date("2024-01-01"));
      expect(result2.success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const beforeDate = new Date("2023-12-31");
      const schema = addDateConstraints(baseSchema).before(
        beforeDate,
        "Too late"
      );

      const result = parse(schema, beforeDate);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too late");
      }
    });
  });

  describe("after", () => {
    it("should validate date > after", () => {
      const baseSchema = createBaseSchema();
      const afterDate = new Date("2023-01-01");
      const schema = addDateConstraints(baseSchema).after(afterDate);

      expect(parse(schema, new Date("2023-01-02"))).toEqual({
        success: true,
        data: new Date("2023-01-02"),
      });
      expect(parse(schema, new Date("2023-06-01"))).toEqual({
        success: true,
        data: new Date("2023-06-01"),
      });
    });

    it("should reject date <= after", () => {
      const baseSchema = createBaseSchema();
      const afterDate = new Date("2023-01-01");
      const schema = addDateConstraints(baseSchema).after(afterDate);

      const result1 = parse(schema, afterDate);
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(
          ERROR_MESSAGES_COMPOSITION.dateAfter(afterDate)
        );
      }

      const result2 = parse(schema, new Date("2022-12-31"));
      expect(result2.success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const baseSchema = createBaseSchema();
      const afterDate = new Date("2023-01-01");
      const schema = addDateConstraints(baseSchema).after(
        afterDate,
        "Too early"
      );

      const result = parse(schema, afterDate);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Too early");
      }
    });
  });

  describe("chaining", () => {
    it("should allow chaining multiple constraints", () => {
      const baseSchema = createBaseSchema();
      const minDate = new Date("2023-01-01");
      const maxDate = new Date("2023-12-31");
      const schema = addDateConstraints(baseSchema)
        .min(minDate)
        .max(maxDate)
        .after(new Date("2023-01-01"))
        .before(new Date("2023-12-31"));

      expect(parse(schema, new Date("2023-06-15"))).toEqual({
        success: true,
        data: new Date("2023-06-15"),
      });

      const result1 = parse(schema, new Date("2022-12-31"));
      expect(result1.success).toBe(false);

      const result2 = parse(schema, new Date("2024-01-01"));
      expect(result2.success).toBe(false);

      const result3 = parse(schema, new Date("2023-01-01"));
      expect(result3.success).toBe(false);

      const result4 = parse(schema, new Date("2023-12-31"));
      expect(result4.success).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should reject non-date values", () => {
      const schema = addDateConstraints(createBaseSchema()).min(
        new Date("2023-01-01")
      );

      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, "2023-01-01").success).toBe(false);
      expect(parse(schema, 1672531200000).success).toBe(false);
    });

    it("should reject invalid dates", () => {
      const schema = addDateConstraints(createBaseSchema()).min(
        new Date("2023-01-01")
      );

      expect(parse(schema, new Date("invalid")).success).toBe(false);
      expect(parse(schema, new Date(Number.NaN)).success).toBe(false);
    });

    it("should handle epoch dates", () => {
      const schema = addDateConstraints(createBaseSchema()).min(new Date(0));

      expect(parse(schema, new Date(0)).success).toBe(true);
      expect(parse(schema, new Date(-1)).success).toBe(false);
    });

    it("should handle millisecond precision", () => {
      const baseDate = new Date("2023-06-15T12:00:00.000Z");
      const schema = addDateConstraints(createBaseSchema()).after(baseDate);

      expect(parse(schema, new Date("2023-06-15T12:00:00.001Z")).success).toBe(
        true
      );
      expect(parse(schema, new Date("2023-06-15T12:00:00.000Z")).success).toBe(
        false
      );
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("min/max/before/after boundary conditions", () => {
      it("[🎯] should accept date equal to minimum when min(date) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const minDate = new Date("2023-06-15T12:00:00.000Z");
        const schema = addDateConstraints(baseSchema).min(minDate);

        expect(parse(schema, minDate)).toEqual({
          success: true,
          data: minDate,
        });
      });

      it("[🎯] should accept date equal to maximum when max(date) - boundary: exact limit", () => {
        const baseSchema = createBaseSchema();
        const maxDate = new Date("2023-06-15T12:00:00.000Z");
        const schema = addDateConstraints(baseSchema).max(maxDate);

        expect(parse(schema, maxDate)).toEqual({
          success: true,
          data: maxDate,
        });
      });

      it("[🎯] should reject date equal to boundary when before(date) - boundary: strict before", () => {
        const baseSchema = createBaseSchema();
        const beforeDate = new Date("2023-06-15T12:00:00.000Z");
        const schema = addDateConstraints(baseSchema).before(beforeDate);

        const result = parse(schema, beforeDate);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(
            ERROR_MESSAGES_COMPOSITION.dateBefore(beforeDate)
          );
        }
      });

      it("[🎯] should reject date equal to boundary when after(date) - boundary: strict after", () => {
        const baseSchema = createBaseSchema();
        const afterDate = new Date("2023-06-15T12:00:00.000Z");
        const schema = addDateConstraints(baseSchema).after(afterDate);

        const result = parse(schema, afterDate);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(
            ERROR_MESSAGES_COMPOSITION.dateAfter(afterDate)
          );
        }
      });
    });

    describe("1ms boundary conditions", () => {
      it("[🎯] should reject date 1ms before minimum when min(date) - boundary: just below", () => {
        const baseSchema = createBaseSchema();
        const minDate = new Date("2023-06-15T12:00:00.000Z");
        const schema = addDateConstraints(baseSchema).min(minDate);

        const dateJustBelow = new Date(minDate.getTime() - 1);
        const result = parse(schema, dateJustBelow);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(
            ERROR_MESSAGES_COMPOSITION.dateMin(minDate)
          );
        }
      });

      it("[🎯] should reject date 1ms after maximum when max(date) - boundary: just above", () => {
        const baseSchema = createBaseSchema();
        const maxDate = new Date("2023-06-15T12:00:00.000Z");
        const schema = addDateConstraints(baseSchema).max(maxDate);

        const dateJustAbove = new Date(maxDate.getTime() + 1);
        const result = parse(schema, dateJustAbove);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(
            ERROR_MESSAGES_COMPOSITION.dateMax(maxDate)
          );
        }
      });

      it("[🎯] should accept date 1ms before boundary when before(date) - boundary: just before", () => {
        const baseSchema = createBaseSchema();
        const beforeDate = new Date("2023-06-15T12:00:00.000Z");
        const schema = addDateConstraints(baseSchema).before(beforeDate);

        const dateJustBefore = new Date(beforeDate.getTime() - 1);
        expect(parse(schema, dateJustBefore)).toEqual({
          success: true,
          data: dateJustBefore,
        });
      });

      it("[🎯] should accept date 1ms after boundary when after(date) - boundary: just after", () => {
        const baseSchema = createBaseSchema();
        const afterDate = new Date("2023-06-15T12:00:00.000Z");
        const schema = addDateConstraints(baseSchema).after(afterDate);

        const dateJustAfter = new Date(afterDate.getTime() + 1);
        expect(parse(schema, dateJustAfter)).toEqual({
          success: true,
          data: dateJustAfter,
        });
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    // Use bounded dates to avoid RangeError on toISOString() with extreme dates
    const minBoundDate = new Date(-8640000000000000 + 1); // Just after min safe date
    const maxBoundDate = new Date(8640000000000000 - 1); // Just before max safe date
    const dateArb = fc.date({
      noInvalidDate: true,
      min: minBoundDate,
      max: maxBoundDate,
    });

    itProp.prop([dateArb, dateArb])(
      "[🎲] min accepts dates >= min date",
      (value, minDate) => {
        const actualMin = value < minDate ? value : minDate;
        const schema = addDateConstraints(createBaseSchema()).min(actualMin);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([dateArb, dateArb])(
      "[🎲] max accepts dates <= max date",
      (value, maxDate) => {
        const actualMax = value > maxDate ? value : maxDate;
        const schema = addDateConstraints(createBaseSchema()).max(actualMax);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      }
    );

    itProp.prop([dateArb])("[🎲] before accepts dates < boundary", (value) => {
      const boundary = new Date(value.getTime() + 1);
      const schema = addDateConstraints(createBaseSchema()).before(boundary);
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });

    itProp.prop([dateArb])("[🎲] after accepts dates > boundary", (value) => {
      const boundary = new Date(value.getTime() - 1);
      const schema = addDateConstraints(createBaseSchema()).after(boundary);
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });
});
