import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { coerceBigInt } from "./bigint";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("coerceBigInt", () => {
  describe("[🎯] Specification Tests", () => {
    it("[🎯] should convert numeric string to bigint (Req 15.8)", () => {
      const schema = coerceBigInt();

      // Positive numeric string
      const positiveResult = parse(schema, "42");
      expect(positiveResult.success).toBe(true);
      if (positiveResult.success) {
        expect(positiveResult.data).toBe(42n);
        expect(typeof positiveResult.data).toBe("bigint");
      }

      // Negative numeric string
      const negativeResult = parse(schema, "-123");
      expect(negativeResult.success).toBe(true);
      if (negativeResult.success) {
        expect(negativeResult.data).toBe(-123n);
        expect(typeof negativeResult.data).toBe("bigint");
      }

      // Zero string
      const zeroResult = parse(schema, "0");
      expect(zeroResult.success).toBe(true);
      if (zeroResult.success) {
        expect(zeroResult.data).toBe(0n);
      }

      // Large numeric string (beyond safe integer)
      const largeResult = parse(schema, "9007199254740992");
      expect(largeResult.success).toBe(true);
      if (largeResult.success) {
        expect(largeResult.data).toBe(9007199254740992n);
      }
    });

    it("[🎯] should fail when converting float string to bigint (Req 35.10)", () => {
      const schema = coerceBigInt();

      // Float string with decimal point
      const floatResult = parse(schema, "12.34");
      expect(floatResult.success).toBe(false);
      if (!floatResult.success) {
        expect(floatResult.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceBigInt);
      }

      // Negative float string
      const negativeFloatResult = parse(schema, "-3.14");
      expect(negativeFloatResult.success).toBe(false);
      if (!negativeFloatResult.success) {
        expect(negativeFloatResult.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceBigInt);
      }

      // Float string with trailing zeros
      const trailingZeroResult = parse(schema, "1.00");
      expect(trailingZeroResult.success).toBe(false);
      if (!trailingZeroResult.success) {
        expect(trailingZeroResult.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceBigInt);
      }

      // Scientific notation (also a float representation)
      const scientificResult = parse(schema, "1e10");
      expect(scientificResult.success).toBe(false);
      if (!scientificResult.success) {
        expect(scientificResult.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceBigInt);
      }
    });
  });

  it("should convert numbers to bigint successfully", () => {
    const schema = coerceBigInt();

    const validCases = [
      0,
      1,
      -1,
      42,
      -42,
      1000,
      -1000,
      Number.MAX_SAFE_INTEGER,
    ];

    validCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should convert strings to bigint successfully", () => {
    const schema = coerceBigInt();

    const validCases = [
      "0",
      "1",
      "-1",
      "42",
      "-42",
      "12345678901234567890",
      "-12345678901234567890",
    ];

    validCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should convert boolean to bigint", () => {
    const schema = coerceBigInt();

    const trueResult = parse(schema, true);
    expect(trueResult.success).toBe(true);

    const falseResult = parse(schema, false);
    expect(falseResult.success).toBe(true);
  });

  it("should accept bigint values as-is", () => {
    const schema = coerceBigInt();

    const validCases = [0n, 1n, -1n, 42n, -42n, 12345678901234567890n];

    validCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should reject null", () => {
    const schema = coerceBigInt();
    const result = parse(schema, null);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceNullToBigInt);
    }
  });

  it("should reject undefined", () => {
    const schema = coerceBigInt();
    const result = parse(schema, undefined);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceUndefinedToBigInt);
    }
  });

  it("should reject invalid string conversions", () => {
    const schema = coerceBigInt();

    const invalidCases = [
      "not a number",
      "abc",
      "12.34",
      "12abc",
      "abc12",
      "NaN",
      "Infinity",
    ];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceBigInt);
      }
    });
  });

  it("should reject invalid number conversions", () => {
    const schema = coerceBigInt();

    const invalidCases = [Number.NaN, Infinity, -Infinity, 3.14, -3.14];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceBigInt);
      }
    });
  });

  it("should reject objects", () => {
    const schema = coerceBigInt();

    const invalidCases = [{}, { value: 42 }];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceBigInt);
      }
    });
  });

  it("should accept empty arrays (convert to 0n)", () => {
    const schema = coerceBigInt();

    const result = parse(schema, []);
    expect(result.success).toBe(true);
  });

  it("should accept arrays with single number element", () => {
    const schema = coerceBigInt();

    const validCases = [[1], [42], [0]];

    validCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should reject arrays with multiple elements (invalid BigInt string)", () => {
    const schema = coerceBigInt();

    const invalidCases = [
      [1, 2, 3],
      ["1", "2"],
    ];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceBigInt);
      }
    });
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom bigint error";
    const schema = coerceBigInt(customMessage);
    const result = parse(schema, "invalid");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should handle very large numbers", () => {
    const schema = coerceBigInt();

    const largeNumbers = [
      "9007199254740991",
      "-9007199254740991",
      "999999999999999999999999999999",
    ];

    largeNumbers.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should return schema with correct type", () => {
    const schema = coerceBigInt();

    expect(schema.type).toBe("bigint");
  });

  it("should return coerced bigint values via parse", () => {
    const schema = coerceBigInt();

    // Number to bigint
    const numResult = parse(schema, 42);
    expect(numResult.success).toBe(true);
    if (numResult.success) {
      expect(numResult.data).toBe(42n);
      expect(typeof numResult.data).toBe("bigint");
    }

    // String to bigint
    const strResult = parse(schema, "123");
    expect(strResult.success).toBe(true);
    if (strResult.success) {
      expect(strResult.data).toBe(123n);
      expect(typeof strResult.data).toBe("bigint");
    }

    // Boolean to bigint
    const boolResult = parse(schema, true);
    expect(boolResult.success).toBe(true);
    if (boolResult.success) {
      expect(boolResult.data).toBe(1n);
      expect(typeof boolResult.data).toBe("bigint");
    }

    // Already bigint - no coercion
    const bigintResult = parse(schema, 99n);
    expect(bigintResult.success).toBe(true);
    if (bigintResult.success) {
      expect(bigintResult.data).toBe(99n);
      expect(typeof bigintResult.data).toBe("bigint");
    }
  });

  describe("[👾] Mutation Tests", () => {
    it("[👾] should return true (not coerced) for bigint input (kills: typeof value === 'bigint' → false)", () => {
      // If the bigint check is removed, bigints would be coerced unnecessarily
      // The validator should return `true` for bigints, not `{ coerced: value }`
      const schema = coerceBigInt();
      const result = schema.validator(42n);
      
      // Must return exactly `true`, not a CoercedResult
      expect(result).toBe(true);
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.bigInt()])("[🎲] idempotent: coercing a bigint returns the same bigint", (big) => {
      const schema = coerceBigInt();
      const result = parse(schema, big);
      expect(result).toEqual({ success: true, data: big });
    });

    itProp.prop([fc.bigInt()])("[🎲] result is always a bigint when input is bigint", (big) => {
      const schema = coerceBigInt();
      const result = parse(schema, big);
      if (result.success) {
        expect(typeof result.data).toBe("bigint");
      }
    });

    itProp.prop([fc.boolean()])("[🎲] boolean coercion: true -> 1n, false -> 0n", (bool) => {
      const schema = coerceBigInt();
      const result = parse(schema, bool);
      expect(result).toEqual({ success: true, data: bool ? 1n : 0n });
    });

    itProp.prop([fc.integer({ min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER })])(
      "[🎲] safe integer round-trip: BigInt(n) coerces correctly",
      (num) => {
        const schema = coerceBigInt();
        const result = parse(schema, num);
        expect(result).toEqual({ success: true, data: BigInt(num) });
      }
    );

    itProp.prop([fc.bigInt()])("[🎲] bigint string round-trip: String(n) coerces back to n", (big) => {
      const schema = coerceBigInt();
      const result = parse(schema, String(big));
      expect(result).toEqual({ success: true, data: big });
    });

    itProp.prop([fc.stringMatching(/^[a-zA-Z]+$/)])("[🎲] alphabetic strings fail coercion", (str) => {
      const schema = coerceBigInt();
      const result = parse(schema, str);
      expect(result.success).toBe(false);
    });

    itProp.prop([fc.double({ noNaN: true, noDefaultInfinity: true }).filter((n) => !Number.isInteger(n))])(
      "[🎲] non-integer numbers fail coercion",
      (num) => {
        const schema = coerceBigInt();
        const result = parse(schema, num);
        expect(result.success).toBe(false);
      }
    );
  });
});
