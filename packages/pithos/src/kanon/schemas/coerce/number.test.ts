import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { coerceNumber } from "./number";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("coerceNumber", () => {
  it("should convert valid numbers successfully", () => {
    const schema = coerceNumber();

    const validCases = [
      42,
      0,
      -42,
      3.14,
      -3.14,
      Infinity,
      -Infinity,
      Number.MAX_VALUE,
      Number.MIN_VALUE,
    ];

    validCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should convert strings to numbers successfully", () => {
    const schema = coerceNumber();

    const validCases = [
      "42",
      "0",
      "-42",
      "3.14",
      "-3.14",
      "123.456",
      "0.5",
      "-0.5",
    ];

    validCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should convert boolean to numbers", () => {
    const schema = coerceNumber();

    const trueResult = parse(schema, true);
    expect(trueResult.success).toBe(true);

    const falseResult = parse(schema, false);
    expect(falseResult.success).toBe(true);
  });

  it("should convert empty string to 0", () => {
    const schema = coerceNumber();
    const result = parse(schema, "");

    expect(result.success).toBe(true);
  });

  it("should reject invalid number conversions", () => {
    const schema = coerceNumber();

    const invalidCases = [
      "not a number",
      "abc",
      "12abc",
      "abc12",
      undefined,
      {},
    ];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceNumber);
      }
    });
  });

  it("should return validation error for Symbol (cannot be converted)", () => {
    const schema = coerceNumber();
    const result = parse(schema, Symbol("test"));

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceNumber);
    }
  });

  it("should return validation error for objects with broken toString", () => {
    const schema = coerceNumber();
    const brokenObject = { toString: false };
    const result = parse(schema, brokenObject);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceNumber);
    }
  });

  it("should use custom error message for objects with broken toString", () => {
    const customMessage = "Custom coerce error";
    const schema = coerceNumber(customMessage);
    const brokenObject = { toString: false };
    const result = parse(schema, brokenObject);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should accept null and empty array (convert to 0)", () => {
    const schema = coerceNumber();

    const validCases = [null, []];

    validCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom number error";
    const schema = coerceNumber(customMessage);
    const result = parse(schema, "invalid");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should handle edge cases", () => {
    const schema = coerceNumber();

    const edgeCases = [
      "0",
      "-0",
      "0.0",
      "1e10",
      "1e-10",
      "-1e10",
      "0x10",
      "0o10",
      "0b10",
    ];

    edgeCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should return schema with correct type", () => {
    const schema = coerceNumber();

    expect(schema.type).toBe("number");
  });

  describe("[🎯] Specification Tests", () => {
    describe("numeric string conversion (Req 15.3)", () => {
      it("[🎯] should convert numeric string to number", () => {
        const schema = coerceNumber();
        const result = parse(schema, "42");

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(42);
          expect(typeof result.data).toBe("number");
        }
      });

      it("[🎯] should convert negative numeric string to number", () => {
        const schema = coerceNumber();
        const result = parse(schema, "-123.45");

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(-123.45);
        }
      });
    });

    describe("non-numeric string rejection (Req 15.4)", () => {
      it("[🎯] should reject non-numeric string with NaN failure", () => {
        const schema = coerceNumber();
        const result = parse(schema, "not a number");

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceNumber);
        }
      });

      it("[🎯] should reject mixed alphanumeric string", () => {
        const schema = coerceNumber();
        const result = parse(schema, "12abc");

        expect(result.success).toBe(false);
      });
    });

    describe("empty string conversion (Req 35.4)", () => {
      it("[🎯] should convert empty string to 0", () => {
        const schema = coerceNumber();
        const result = parse(schema, "");

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(0);
        }
      });
    });

    describe("whitespace string conversion (Req 35.5)", () => {
      it("[🎯] should convert whitespace-only string to 0", () => {
        const schema = coerceNumber();
        const result = parse(schema, "  ");

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(0);
        }
      });

      it("[🎯] should convert tab and newline whitespace to 0", () => {
        const schema = coerceNumber();
        const result = parse(schema, "\t\n");

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(0);
        }
      });
    });

    describe("boolean to number conversion (Req 35.6, 35.7)", () => {
      it("[🎯] should convert true to 1", () => {
        const schema = coerceNumber();
        const result = parse(schema, true);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(1);
        }
      });

      it("[🎯] should convert false to 0", () => {
        const schema = coerceNumber();
        const result = parse(schema, false);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(0);
        }
      });
    });
  });

  it("should return coerced number values via parse", () => {
    const schema = coerceNumber();

    // String to number
    const strResult = parse(schema, "42");
    expect(strResult.success).toBe(true);
    if (strResult.success) {
      expect(strResult.data).toBe(42);
      expect(typeof strResult.data).toBe("number");
    }

    // Boolean to number
    const boolResult = parse(schema, true);
    expect(boolResult.success).toBe(true);
    if (boolResult.success) {
      expect(boolResult.data).toBe(1);
      expect(typeof boolResult.data).toBe("number");
    }

    // Empty string to 0
    const emptyResult = parse(schema, "");
    expect(emptyResult.success).toBe(true);
    if (emptyResult.success) {
      expect(emptyResult.data).toBe(0);
      expect(typeof emptyResult.data).toBe("number");
    }

    // Already number - no coercion
    const numResult = parse(schema, 99);
    expect(numResult.success).toBe(true);
    if (numResult.success) {
      expect(numResult.data).toBe(99);
      expect(typeof numResult.data).toBe("number");
    }
  });

  describe("[👾] Mutation Tests", () => {
    it("[👾] should return true (not coerced) for valid number input (kills: typeof value === 'number' → false)", () => {
      // If the number check is removed, numbers would be coerced unnecessarily
      // The validator should return `true` for valid numbers, not `{ coerced: value }`
      const schema = coerceNumber();
      const result = schema.validator(42);
      
      // Must return exactly `true`, not a CoercedResult
      expect(result).toBe(true);
    });

    it("[👾] should reject NaN input (kills: !Number.isNaN(value) → Number.isNaN(value))", () => {
      // If the NaN check is inverted, NaN would be accepted as valid
      // The validator should reject NaN, not return true
      const schema = coerceNumber();
      const result = schema.validator(Number.NaN);
      
      // Must return error string, not `true`
      expect(result).toBe(ERROR_MESSAGES_COMPOSITION.coerceNumber);
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.double({ noNaN: true })])("[🎲] idempotent: coercing a number returns the same number", (num) => {
      const schema = coerceNumber();
      const result = parse(schema, num);
      expect(result).toEqual({ success: true, data: num });
    });

    itProp.prop([fc.double({ noNaN: true })])("[🎲] result is always a number when input is number", (num) => {
      const schema = coerceNumber();
      const result = parse(schema, num);
      if (result.success) {
        expect(typeof result.data).toBe("number");
      }
    });

    itProp.prop([fc.boolean()])("[🎲] boolean coercion: true -> 1, false -> 0", (bool) => {
      const schema = coerceNumber();
      const result = parse(schema, bool);
      expect(result).toEqual({ success: true, data: bool ? 1 : 0 });
    });

    itProp.prop([fc.integer()])("[🎲] numeric string round-trip: String(n) coerces back to n", (num) => {
      const schema = coerceNumber();
      const result = parse(schema, String(num));
      expect(result).toEqual({ success: true, data: num });
    });

    itProp.prop([fc.stringMatching(/^[a-zA-Z]+$/)])("[🎲] alphabetic strings fail coercion", (str) => {
      const schema = coerceNumber();
      const result = parse(schema, str);
      expect(result.success).toBe(false);
    });
  });
});
