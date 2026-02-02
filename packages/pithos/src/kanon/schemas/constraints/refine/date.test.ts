import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { refineDate } from "./date";
import { date } from "../../primitives/date";
import { parse } from "../../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../../core/consts/messages";
import type { DateSchema } from "@kanon/types/primitives";
import type { DateConstraint } from "@kanon/types/constraints";

describe("refineDate", () => {
  describe("[🎯] Specification Tests", () => {
    describe("first refinement creation (Requirement 21.8)", () => {
      it("[🎯] should create a new refinements array when schema has no refinements", () => {
        const baseSchema = date();
        expect(baseSchema.refinements).toBeUndefined();

        const refinedSchema = refineDate(baseSchema, () => true);
        expect(refinedSchema.refinements).toBeDefined();
        expect(refinedSchema.refinements).toHaveLength(1);
      });
    });
  });
  describe("validation", () => {
    it("should accept valid date that passes refinement", () => {
      const schema = refineDate(date(), (value) => {
        if (value.getFullYear() > 2000) return true;
        return "Date must be after year 2000";
      });

      expect(parse(schema, new Date(2020, 0, 1)).success).toBe(true);
      expect(parse(schema, new Date(2024, 5, 15)).success).toBe(true);
    });

    it("should reject valid date that fails refinement", () => {
      const schema = refineDate(date(), (value) => {
        if (value.getFullYear() > 2000) return true;
        return "Date must be after year 2000";
      });

      const result = parse(schema, new Date(1999, 0, 1));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Date must be after year 2000");
      }
    });

    it("should reject non-date values", () => {
      const schema = refineDate(date(), () => true);

      expect(parse(schema, "2020-01-01").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });

    it("should reject invalid date (NaN)", () => {
      const schema = refineDate(date(), () => true);
      const invalidDate = new Date("invalid");

      const result = parse(schema, invalidDate);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.date);
      }
    });

    it("should return correct error message for non-date values", () => {
      const schema = refineDate(date(), () => true);

      const result = parse(schema, "2020-01-01");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.date);
      }
    });

    it("should use custom error message from base schema for non-date values", () => {
      const customMessage = "Must be a date";
      const schema = refineDate(date(customMessage), () => true);

      const result = parse(schema, "2020-01-01");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should chain multiple refinements", () => {
      const schema1 = refineDate(date(), (value) => {
        if (value.getFullYear() >= 2000) return true;
        return "Must be after 2000";
      });

      const schema2 = refineDate(schema1, (value) => {
        if (value.getFullYear() <= 2024) return true;
        return "Must be before 2025";
      });

      expect(parse(schema2, new Date(2020, 0, 1)).success).toBe(true);
      expect(parse(schema2, new Date(1999, 0, 1)).success).toBe(false);
      expect(parse(schema2, new Date(2025, 0, 1)).success).toBe(false);
    });

    it("should return first failing refinement error", () => {
      const schema1 = refineDate(date(), (value) => {
        if (value.getFullYear() >= 2000) return true;
        return "First error";
      });

      const schema2 = refineDate(schema1, (value) => {
        if (value.getFullYear() <= 2024) return true;
        return "Second error";
      });

      const result = parse(schema2, new Date(1999, 0, 1));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("First error");
      }
    });

    it("should return second refinement error if first passes", () => {
      const schema1 = refineDate(date(), (value) => {
        if (value.getFullYear() >= 2000) return true;
        return "First error";
      });

      const schema2 = refineDate(schema1, (value) => {
        if (value.getFullYear() <= 2024) return true;
        return "Second error";
      });

      const result = parse(schema2, new Date(2025, 0, 1));
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Second error");
      }
    });

    it("should handle date comparison", () => {
      const minDate = new Date(2020, 0, 1);
      const schema = refineDate(date(), (value) => {
        if (value >= minDate) return true;
        return "Date must be after 2020-01-01";
      });

      expect(parse(schema, new Date(2020, 0, 1)).success).toBe(true);
      expect(parse(schema, new Date(2021, 0, 1)).success).toBe(true);
      expect(parse(schema, new Date(2019, 11, 31)).success).toBe(false);
    });

    it("should handle time validation", () => {
      const schema = refineDate(date(), (value) => {
        const hours = value.getHours();
        if (hours >= 9 && hours < 17) return true;
        return "Date must be during business hours";
      });

      const businessDate = new Date(2024, 0, 1, 12, 0, 0);
      const nonBusinessDate = new Date(2024, 0, 1, 20, 0, 0);

      expect(parse(schema, businessDate).success).toBe(true);
      expect(parse(schema, nonBusinessDate).success).toBe(false);
    });

    it("should handle day of week validation", () => {
      const schema = refineDate(date(), (value) => {
        const day = value.getDay();
        if (day !== 0 && day !== 6) return true;
        return "Date must not be weekend";
      });

      const weekday = new Date(2024, 0, 3);
      const weekend = new Date(2024, 0, 6);

      expect(parse(schema, weekday).success).toBe(true);
      expect(parse(schema, weekend).success).toBe(false);
    });

    it("should handle refinement that always returns true", () => {
      const schema = refineDate(date(), () => true);

      expect(parse(schema, new Date()).success).toBe(true);
      expect(parse(schema, new Date(2000, 0, 1)).success).toBe(true);
      expect(parse(schema, new Date(1900, 0, 1)).success).toBe(true);
    });

    it("should handle refinement that always returns error", () => {
      const schema = refineDate(date(), () => "Always fails");

      const result = parse(schema, new Date());
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Always fails");
      }
    });

    it("should handle multiple chained refinements", () => {
      let schema: DateSchema | DateConstraint = date();
      schema = refineDate(schema, (v) =>
        v.getFullYear() >= 2000 ? true : "Error 1"
      );
      schema = refineDate(schema, (v) =>
        v.getFullYear() <= 2024 ? true : "Error 2"
      );
      schema = refineDate(schema, (v) =>
        v.getMonth() === 0 ? true : "Error 3"
      );

      expect(parse(schema, new Date(2020, 0, 1)).success).toBe(true);
      expect(parse(schema, new Date(1999, 0, 1)).success).toBe(false);
      expect(parse(schema, new Date(2025, 0, 1)).success).toBe(false);
      expect(parse(schema, new Date(2020, 1, 1)).success).toBe(false);
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = refineDate(date(), () => true);
      const testDate = new Date(2024, 0, 1);

      const result = parse(schema, testDate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data instanceof Date).toBe(true);
        expect(result.data.getTime()).toBe(testDate.getTime());
      }
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.date()])(
      "[🎲] should be idempotent - parsing twice yields same result",
      (d) => {
        const schema = refineDate(date(), () => true);
        const result1 = parse(schema, d);
        if (result1.success) {
          const result2 = parse(schema, result1.data);
          expect(result2.success).toBe(true);
          if (result2.success) {
            expect(result2.data.getTime()).toBe(result1.data.getTime());
          }
        }
      }
    );

    itProp.prop([fc.date()])(
      "[🎲] should not mutate input date",
      (d) => {
        const schema = refineDate(date(), () => true);
        const originalTime = d.getTime();
        parse(schema, d);
        expect(d.getTime()).toBe(originalTime);
      }
    );

    itProp.prop([fc.date(), fc.date()])(
      "[🎲] refinement with after constraint - consistent behavior",
      (d, minDate) => {
        const schema = refineDate(date(), (v) =>
          v >= minDate ? true : "Too early"
        );
        const result = parse(schema, d);
        expect(result.success).toBe(d >= minDate);
      }
    );

    itProp.prop([fc.date()])(
      "[🎲] refinement with year constraint - consistent behavior",
      (d) => {
        const targetYear = 2020;
        const schema = refineDate(date(), (v) =>
          v.getFullYear() >= targetYear ? true : "Year too early"
        );
        const result = parse(schema, d);
        expect(result.success).toBe(d.getFullYear() >= targetYear);
      }
    );
  });
});
