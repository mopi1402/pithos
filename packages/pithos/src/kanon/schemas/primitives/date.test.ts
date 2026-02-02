import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { date } from "./date";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("date", () => {
  describe("validation", () => {
    it("should accept valid Date instances", () => {
      const schema = date();

      expect(parse(schema, new Date()).success).toBe(true);
      expect(parse(schema, new Date(0)).success).toBe(true);
      expect(parse(schema, new Date("2023-01-01")).success).toBe(true);
      expect(parse(schema, new Date(2023, 0, 1)).success).toBe(true);
      expect(parse(schema, new Date(Date.now())).success).toBe(true);
    });

    it("should reject invalid Date instances (NaN)", () => {
      const schema = date();

      const invalidDate = new Date("invalid");
      expect(parse(schema, invalidDate).success).toBe(false);
    });

    it("should reject non-Date primitive types", () => {
      const schema = date();

      expect(parse(schema, "2023-01-01").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, false).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, Symbol("test")).success).toBe(false);
      expect(parse(schema, BigInt(123)).success).toBe(false);
    });

    it("should reject complex types", () => {
      const schema = date();

      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
      expect(parse(schema, [1, 2, 3]).success).toBe(false);
      expect(parse(schema, () => {}).success).toBe(false);
      expect(parse(schema, new Map()).success).toBe(false);
      expect(parse(schema, new Set()).success).toBe(false);
      expect(parse(schema, /regex/).success).toBe(false);
    });

    it("should reject edge case values", () => {
      const schema = date();

      expect(parse(schema, Number.NaN).success).toBe(false);
      expect(parse(schema, Infinity).success).toBe(false);
      expect(parse(schema, -Infinity).success).toBe(false);
      expect(parse(schema, 0).success).toBe(false);
      expect(parse(schema, "").success).toBe(false);
    });

    it("should return correct error message for invalid values", () => {
      const schema = date();

      const result1 = parse(schema, "2023-01-01");
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.date);
      }

      const result2 = parse(schema, 123);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(ERROR_MESSAGES_COMPOSITION.date);
      }

      const result3 = parse(schema, null);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(ERROR_MESSAGES_COMPOSITION.date);
      }

      const invalidDate = new Date("invalid");
      const result4 = parse(schema, invalidDate);
      expect(result4.success).toBe(false);
      if (!result4.success) {
        expect(result4.error).toBe(ERROR_MESSAGES_COMPOSITION.date);
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Must be a date";
      const schema = date(customMessage);

      const result1 = parse(schema, "2023-01-01");
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(customMessage);
      }

      const result2 = parse(schema, 123);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(customMessage);
      }

      const result3 = parse(schema, null);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(customMessage);
      }
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = date();
      const testDate = new Date("2023-01-01");

      const result = parse(schema, testDate);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data instanceof Date).toBe(true);
        expect(result.data.getTime()).toBe(testDate.getTime());
      }
    });
  });

  describe("singleton behavior", () => {
    it("should return same instance when called without message", () => {
      const schema1 = date();
      const schema2 = date();

      expect(schema1).toBe(schema2);
    });

    it("should return different instances when called with message", () => {
      const schema1 = date("Error 1");
      const schema2 = date("Error 2");

      expect(schema1).not.toBe(schema2);
    });

    it("should return different instance when one has message and other doesn't", () => {
      const schema1 = date();
      const schema2 = date("Custom error");

      expect(schema1).not.toBe(schema2);
    });
  });

  describe("edge cases", () => {
    it("should handle epoch date", () => {
      const schema = date();
      expect(parse(schema, new Date(0)).success).toBe(true);
    });

    it("should handle future dates", () => {
      const schema = date();
      const futureDate = new Date("2100-01-01");
      expect(parse(schema, futureDate).success).toBe(true);
    });

    it("should handle past dates", () => {
      const schema = date();
      const pastDate = new Date("1900-01-01");
      expect(parse(schema, pastDate).success).toBe(true);
    });

    it("should handle current date", () => {
      const schema = date();
      expect(parse(schema, new Date()).success).toBe(true);
    });

    it("should reject invalid date strings converted to Date", () => {
      const schema = date();
      const invalidDate = new Date("not a date");
      expect(parse(schema, invalidDate).success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("invalid Date edge cases", () => {
      it("[🎯] should reject invalid Date with NaN time (edge case: invalid date)", () => {
        // Requirements: 13.7
        const schema = date();
        const invalidDate = new Date("invalid");
        expect(parse(schema, invalidDate).success).toBe(false);
        expect(Number.isNaN(invalidDate.getTime())).toBe(true);
      });

      it("[🎯] should reject Date created with NaN", () => {
        // Requirements: 13.7
        const schema = date();
        const invalidDate = new Date(Number.NaN);
        expect(parse(schema, invalidDate).success).toBe(false);
      });

      it("[🎯] should reject Date created with invalid string", () => {
        // Requirements: 13.7
        const schema = date();
        const invalidDate = new Date("not-a-valid-date-string");
        expect(parse(schema, invalidDate).success).toBe(false);
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.date({ noInvalidDate: true })])(
    "[🎲] should accept any valid date",
    (value) => {
      const schema = date();
      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.getTime()).toBe(value.getTime());
      }
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] should reject any string",
    (value) => {
      const schema = date();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] should reject any integer",
    (value) => {
      const schema = date();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.boolean()])(
    "[🎲] should reject any boolean",
    (value) => {
      const schema = date();
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );
});
