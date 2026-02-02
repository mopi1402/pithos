import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { coerceDate } from "./date";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("coerceDate", () => {
  it("should convert numbers to dates successfully", () => {
    const schema = coerceDate();

    const validCases = [
      0,
      1640995200000,
      Date.now(),
      new Date().getTime(),
      -62167219200000,
    ];

    validCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should convert valid date strings to dates successfully", () => {
    const schema = coerceDate();

    const validCases = [
      "2024-01-01",
      "2024-01-01T00:00:00Z",
      "2024-01-01T00:00:00.000Z",
      "Mon, 01 Jan 2024 00:00:00 GMT",
      "January 1, 2024",
      "01/01/2024",
    ];

    validCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should convert boolean to dates", () => {
    const schema = coerceDate();

    const trueResult = parse(schema, true);
    expect(trueResult.success).toBe(true);

    const falseResult = parse(schema, false);
    expect(falseResult.success).toBe(true);
  });

  it("should reject null", () => {
    const schema = coerceDate();
    const result = parse(schema, null);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceNullToDate);
    }
  });

  it("should reject undefined", () => {
    const schema = coerceDate();
    const result = parse(schema, undefined);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceUndefinedToDate);
    }
  });

  it("should reject invalid date strings", () => {
    const schema = coerceDate();

    const invalidCases = [
      "not a date",
      "invalid-date",
      "2024-13-45",
      "abc123",
      "",
      "[object Object]",
    ];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceInvalidDate);
      }
    });
  });

  it("should reject invalid numbers that create invalid dates", () => {
    const schema = coerceDate();

    const invalidCases = [Number.NaN, Infinity, -Infinity];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceInvalidDate);
      }
    });
  });

  it("should convert objects to dates via String conversion when valid", () => {
    const schema = coerceDate();

    const validCases = [
      { toString: () => "2024-01-01" },
      { toString: () => new Date().toISOString() },
    ];

    validCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should reject objects that convert to invalid date strings", () => {
    const schema = coerceDate();

    const invalidCases: unknown[] = [
      {},
      { value: 42 },
      { toString: () => "invalid date" },
      { toString: () => "[object Object]" },
    ];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceInvalidDate);
      }
    });
  });

  it("should return validation error for objects with broken toString", () => {
    const schema = coerceDate();
    const brokenObject = { toString: false };
    const result = parse(schema, brokenObject);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceInvalidDate);
    }
  });

  it("should use custom error message for objects with broken toString", () => {
    const customMessage = "Custom coerce error";
    const schema = coerceDate(customMessage);
    const brokenObject = { toString: false };
    const result = parse(schema, brokenObject);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should handle arrays (may convert to valid dates)", () => {
    const schema = coerceDate();

    const result = parse(schema, [1, 2, 3]);
    expect(result.success).toBe(true);
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom date error";
    const schema = coerceDate(customMessage);
    const result = parse(schema, "invalid date");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should handle edge cases with valid dates", () => {
    const schema = coerceDate();

    const edgeCases = [
      new Date().toISOString(),
      new Date().toString(),
      new Date().toUTCString(),
    ];

    edgeCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should reject timestamp as string", () => {
    const schema = coerceDate();
    const result = parse(schema, Date.now().toString());

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceInvalidDate);
    }
  });

  it("should return schema with correct type", () => {
    const schema = coerceDate();

    expect(schema.type).toBe("date");
  });

  it("should return coerced Date values via parse", () => {
    const schema = coerceDate();

    // Number to Date
    const numResult = parse(schema, 0);
    expect(numResult.success).toBe(true);
    if (numResult.success) {
      expect(numResult.data).toBeInstanceOf(Date);
      expect(numResult.data.getTime()).toBe(0);
    }

    // String to Date
    const strResult = parse(schema, "2024-01-01T00:00:00Z");
    expect(strResult.success).toBe(true);
    if (strResult.success) {
      expect(strResult.data).toBeInstanceOf(Date);
      expect(strResult.data.toISOString()).toBe("2024-01-01T00:00:00.000Z");
    }

    // Boolean to Date
    const boolResult = parse(schema, true);
    expect(boolResult.success).toBe(true);
    if (boolResult.success) {
      expect(boolResult.data).toBeInstanceOf(Date);
      expect(boolResult.data.getTime()).toBe(1);
    }

    // Already Date - no coercion
    const existingDate = new Date("2024-06-15");
    const dateResult = parse(schema, existingDate);
    expect(dateResult.success).toBe(true);
    if (dateResult.success) {
      expect(dateResult.data).toBeInstanceOf(Date);
      expect(dateResult.data).toBe(existingDate);
    }
  });

  describe("[🎯] Specification Tests", () => {
    describe("timestamp conversion", () => {
      it("[🎯] should convert timestamp number to Date (Req 15.9)", () => {
        const schema = coerceDate();
        const timestamp = 1640995200000; // 2022-01-01T00:00:00.000Z

        const result = parse(schema, timestamp);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBeInstanceOf(Date);
          expect(result.data.getTime()).toBe(timestamp);
        }
      });

      it("[🎯] should convert zero timestamp to epoch date (Req 35.11)", () => {
        const schema = coerceDate();

        const result = parse(schema, 0);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBeInstanceOf(Date);
          expect(result.data.getTime()).toBe(0);
          expect(result.data.toISOString()).toBe("1970-01-01T00:00:00.000Z");
        }
      });

      it("[🎯] should convert negative timestamp to pre-epoch date (Req 35.12)", () => {
        const schema = coerceDate();
        const negativeTimestamp = -86400000; // 1969-12-31T00:00:00.000Z (one day before epoch)

        const result = parse(schema, negativeTimestamp);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBeInstanceOf(Date);
          expect(result.data.getTime()).toBe(negativeTimestamp);
          expect(result.data.toISOString()).toBe("1969-12-31T00:00:00.000Z");
        }
      });
    });

    describe("ISO string conversion", () => {
      it("[🎯] should convert ISO string to Date (Req 15.10)", () => {
        const schema = coerceDate();
        const isoString = "2024-01-01T00:00:00.000Z";

        const result = parse(schema, isoString);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBeInstanceOf(Date);
          expect(result.data.toISOString()).toBe(isoString);
        }
      });
    });

    describe("invalid string handling", () => {
      it("[🎯] should fail for invalid date string (Req 35.13)", () => {
        const schema = coerceDate();

        const result = parse(schema, "not-a-valid-date");

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceInvalidDate);
        }
      });

      it("[🎯] should fail for random text string (Req 35.13)", () => {
        const schema = coerceDate();

        const result = parse(schema, "abc123xyz");

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceInvalidDate);
        }
      });

      it("[🎯] should fail for empty string (Req 35.13)", () => {
        const schema = coerceDate();

        const result = parse(schema, "");

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceInvalidDate);
        }
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    // Note: fc.date() can generate invalid dates (NaN), so we filter them out
    const validDate = fc.date().filter((d) => !Number.isNaN(d.getTime()));

    itProp.prop([validDate])("[🎲] idempotent: coercing a valid Date returns the same Date", (date) => {
      const schema = coerceDate();
      const result = parse(schema, date);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(date);
      }
    });

    itProp.prop([validDate])("[🎲] result is always a Date instance when input is Date", (date) => {
      const schema = coerceDate();
      const result = parse(schema, date);
      if (result.success) {
        expect(result.data).toBeInstanceOf(Date);
      }
    });

    itProp.prop([fc.integer({ min: -8640000000000000, max: 8640000000000000 })])(
      "[🎲] timestamp round-trip: new Date(n).getTime() === n",
      (timestamp) => {
        const schema = coerceDate();
        const result = parse(schema, timestamp);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.getTime()).toBe(timestamp);
        }
      }
    );

    itProp.prop([fc.boolean()])("[🎲] boolean coercion: true -> Date(1), false -> Date(0)", (bool) => {
      const schema = coerceDate();
      const result = parse(schema, bool);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.getTime()).toBe(bool ? 1 : 0);
      }
    });

    itProp.prop([validDate])("[🎲] ISO string round-trip: Date from ISO string has same time", (date) => {
      const schema = coerceDate();
      const isoString = date.toISOString();
      const result = parse(schema, isoString);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.getTime()).toBe(date.getTime());
      }
    });

    itProp.prop([fc.stringMatching(/^[a-zA-Z]+$/)])("[🎲] alphabetic strings fail coercion", (str) => {
      const schema = coerceDate();
      const result = parse(schema, str);
      expect(result.success).toBe(false);
    });
  });
});
