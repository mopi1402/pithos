import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { coerceBoolean } from "./boolean";
import { parse } from "../../core/parser";

describe("coerceBoolean", () => {
  describe("[🎯] Specification Tests", () => {
    describe("falsy value coercion", () => {
      it("[🎯] should convert 0 to false (Req 15.5: falsy to boolean)", () => {
        const schema = coerceBoolean();
        const result = parse(schema, 0);
        expect(result).toEqual({ success: true, data: false });
      });

      it("[🎯] should convert 1 to true (Req 15.6: truthy to boolean)", () => {
        const schema = coerceBoolean();
        const result = parse(schema, 1);
        expect(result).toEqual({ success: true, data: true });
      });

      it("[🎯] should convert empty string to false (Req 15.7: empty string is falsy)", () => {
        const schema = coerceBoolean();
        const result = parse(schema, "");
        expect(result).toEqual({ success: true, data: false });
      });
    });

    describe("truthy value coercion edge cases", () => {
      it('[🎯] should convert "false" string to true (Req 35.8: non-empty string is truthy)', () => {
        const schema = coerceBoolean();
        const result = parse(schema, "false");
        expect(result).toEqual({ success: true, data: true });
      });

      it("[🎯] should convert empty array [] to true (Req 35.9: empty array is truthy)", () => {
        const schema = coerceBoolean();
        const result = parse(schema, []);
        expect(result).toEqual({ success: true, data: true });
      });
    });
  });

  it("should always return success for any input", () => {
    const schema = coerceBoolean();

    const testCases = [
      true,
      false,
      0,
      1,
      -1,
      "",
      "string",
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
    const schema = coerceBoolean();

    expect(schema.type).toBe("boolean");
    expect(schema.message).toBeUndefined();
  });

  it("should have a validator function that returns coerced values", () => {
    const schema = coerceBoolean();

    expect(typeof schema.validator).toBe("function");
    // Already boolean - returns true
    expect(schema.validator(true)).toBe(true);
    expect(schema.validator(false)).toBe(true);
    // Non-boolean - returns { coerced }
    expect(schema.validator(42)).toEqual({ coerced: true });
    expect(schema.validator("test")).toEqual({ coerced: true });
    expect(schema.validator(null)).toEqual({ coerced: false });
    expect(schema.validator(0)).toEqual({ coerced: false });
    expect(schema.validator("")).toEqual({ coerced: false });
  });

  it("should return coerced boolean values via parse", () => {
    const schema = coerceBoolean();

    // Truthy values
    expect(parse(schema, 1)).toEqual({ success: true, data: true });
    expect(parse(schema, "hello")).toEqual({ success: true, data: true });
    expect(parse(schema, {})).toEqual({ success: true, data: true });

    // Falsy values
    expect(parse(schema, 0)).toEqual({ success: true, data: false });
    expect(parse(schema, "")).toEqual({ success: true, data: false });
    expect(parse(schema, null)).toEqual({ success: true, data: false });
    expect(parse(schema, undefined)).toEqual({ success: true, data: false });

    // Already boolean - no coercion
    expect(parse(schema, true)).toEqual({ success: true, data: true });
    expect(parse(schema, false)).toEqual({ success: true, data: false });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.anything()])("[🎲] always succeeds for any input", (value) => {
      const schema = coerceBoolean();
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });

    itProp.prop([fc.anything()])("[🎲] result is always a boolean", (value) => {
      const schema = coerceBoolean();
      const result = parse(schema, value);
      if (result.success) {
        expect(typeof result.data).toBe("boolean");
      }
    });

    itProp.prop([fc.boolean()])("[🎲] idempotent: coercing a boolean returns the same boolean", (bool) => {
      const schema = coerceBoolean();
      const result = parse(schema, bool);
      expect(result).toEqual({ success: true, data: bool });
    });

    itProp.prop([fc.anything()])("[🎲] coercion matches Boolean()", (value) => {
      const schema = coerceBoolean();
      const result = parse(schema, value);
      expect(result).toEqual({ success: true, data: Boolean(value) });
    });

    itProp.prop([fc.oneof(fc.constant(0), fc.constant(""), fc.constant(null), fc.constant(undefined))])(
      "[🎲] falsy values coerce to false",
      (value) => {
        const schema = coerceBoolean();
        const result = parse(schema, value);
        expect(result).toEqual({ success: true, data: false });
      }
    );

    itProp.prop([fc.oneof(fc.integer({ min: 1 }), fc.string({ minLength: 1 }), fc.object())])(
      "[🎲] truthy values coerce to true",
      (value) => {
        const schema = coerceBoolean();
        const result = parse(schema, value);
        expect(result).toEqual({ success: true, data: true });
      }
    );
  });
});
