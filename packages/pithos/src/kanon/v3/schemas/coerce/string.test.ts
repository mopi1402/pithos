import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { coerceString } from "./string";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("coerceString", () => {
  it("should always return success for any input", () => {
    const schema = coerceString();

    const testCases = [
      "string",
      "",
      42,
      0,
      true,
      false,
      null,
      undefined,
      [],
      {},
      Symbol("test"),
    ];

    testCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should return a schema with correct type", () => {
    const schema = coerceString();

    expect(schema.type).toBe("string");
    expect(schema.message).toBeUndefined();
  });

  it("should accept custom error message", () => {
    const customMessage = "Custom error message";
    const schema = coerceString(customMessage);

    expect(schema.message).toBe(customMessage);
  });

  it("should have a validator function that returns coerced values", () => {
    const schema = coerceString();

    expect(typeof schema.validator).toBe("function");
    // Already string - returns true
    expect(schema.validator("test")).toBe(true);
    expect(schema.validator("")).toBe(true);
    // Non-string - returns { coerced }
    expect(schema.validator(42)).toEqual({ coerced: "42" });
    expect(schema.validator(null)).toEqual({ coerced: "null" });
    expect(schema.validator(undefined)).toEqual({ coerced: "undefined" });
    expect(schema.validator(true)).toEqual({ coerced: "true" });
  });

  it("should return coerced string values via parse", () => {
    const schema = coerceString();

    expect(parse(schema, 42)).toEqual({ success: true, data: "42" });
    expect(parse(schema, true)).toEqual({ success: true, data: "true" });
    expect(parse(schema, null)).toEqual({ success: true, data: "null" });
    expect(parse(schema, undefined)).toEqual({ success: true, data: "undefined" });

    // Already string - no coercion
    expect(parse(schema, "hello")).toEqual({ success: true, data: "hello" });
  });

  it("should return validation error for objects with broken toString", () => {
    const schema = coerceString();
    const brokenObject = { toString: false };
    const result = parse(schema, brokenObject);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.coerceString);
    }
  });

  it("should use custom error message for objects with broken toString", () => {
    const customMessage = "Custom coerce error";
    const schema = coerceString(customMessage);
    const brokenObject = { toString: false };
    const result = parse(schema, brokenObject);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  describe("[🎯] Specification Tests", () => {
    describe("number to string coercion", () => {
      it("[🎯] should convert number to string (Req 15.1)", () => {
        const schema = coerceString();
        const result = parse(schema, 42);
        expect(result).toEqual({ success: true, data: "42" });
      });

      it("[🎯] should convert zero to '0'", () => {
        const schema = coerceString();
        const result = parse(schema, 0);
        expect(result).toEqual({ success: true, data: "0" });
      });

      it("[🎯] should convert negative number to string", () => {
        const schema = coerceString();
        const result = parse(schema, -123);
        expect(result).toEqual({ success: true, data: "-123" });
      });

      it("[🎯] should convert float to string", () => {
        const schema = coerceString();
        const result = parse(schema, 3.14);
        expect(result).toEqual({ success: true, data: "3.14" });
      });
    });

    describe("null/undefined to string coercion", () => {
      it("[🎯] should convert null to 'null' (Req 15.2)", () => {
        const schema = coerceString();
        const result = parse(schema, null);
        expect(result).toEqual({ success: true, data: "null" });
      });

      it("[🎯] should convert undefined to 'undefined' (Req 35.1)", () => {
        const schema = coerceString();
        const result = parse(schema, undefined);
        expect(result).toEqual({ success: true, data: "undefined" });
      });
    });

    describe("object to string coercion", () => {
      it("[🎯] should convert plain object to '[object Object]' (Req 35.2)", () => {
        const schema = coerceString();
        const result = parse(schema, {});
        expect(result).toEqual({ success: true, data: "[object Object]" });
      });

      it("[🎯] should convert object with properties to '[object Object]'", () => {
        const schema = coerceString();
        const result = parse(schema, { a: 1, b: 2 });
        expect(result).toEqual({ success: true, data: "[object Object]" });
      });
    });

    describe("array to string coercion", () => {
      it("[🎯] should convert empty array to empty string (Req 35.3)", () => {
        const schema = coerceString();
        const result = parse(schema, []);
        expect(result).toEqual({ success: true, data: "" });
      });

      it("[🎯] should convert array to comma-separated string (Req 35.3)", () => {
        const schema = coerceString();
        const result = parse(schema, [1, 2, 3]);
        expect(result).toEqual({ success: true, data: "1,2,3" });
      });

      it("[🎯] should convert array with strings to comma-separated string", () => {
        const schema = coerceString();
        const result = parse(schema, ["a", "b", "c"]);
        expect(result).toEqual({ success: true, data: "a,b,c" });
      });

      it("[🎯] should convert nested array to comma-separated string", () => {
        const schema = coerceString();
        const result = parse(schema, [[1, 2], [3, 4]]);
        expect(result).toEqual({ success: true, data: "1,2,3,4" });
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    // Note: fc.anything() can generate objects that throw on String() conversion
    // (e.g., objects with Symbol.toPrimitive that throws), so we filter them out
    const stringifiable = fc.anything().filter((v) => {
      try {
        String(v);
        return true;
      } catch {
        return false;
      }
    });

    itProp.prop([stringifiable])("[🎲] always succeeds for any stringifiable input", (value) => {
      const schema = coerceString();
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });

    itProp.prop([stringifiable])("[🎲] result is always a string", (value) => {
      const schema = coerceString();
      const result = parse(schema, value);
      if (result.success) {
        expect(typeof result.data).toBe("string");
      }
    });

    itProp.prop([fc.string()])("[🎲] idempotent: coercing a string returns the same string", (str) => {
      const schema = coerceString();
      const result = parse(schema, str);
      expect(result).toEqual({ success: true, data: str });
    });

    itProp.prop([fc.integer()])("[🎲] number coercion matches String()", (num) => {
      const schema = coerceString();
      const result = parse(schema, num);
      expect(result).toEqual({ success: true, data: String(num) });
    });

    itProp.prop([fc.boolean()])("[🎲] boolean coercion matches String()", (bool) => {
      const schema = coerceString();
      const result = parse(schema, bool);
      expect(result).toEqual({ success: true, data: String(bool) });
    });
  });
});
