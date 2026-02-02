import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { array } from "./array";
import { parse } from "../../core/parser";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { coerceBoolean } from "../coerce/boolean";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("array", () => {
  it("should validate array with valid items", () => {
    const itemSchema = string();
    const schema = array(itemSchema);
    const value = ["a", "b", "c"];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(value);
    }
  });

  it("should validate empty array", () => {
    const itemSchema = string();
    const schema = array(itemSchema);
    const value: string[] = [];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(value);
    }
  });

  it("should reject non-array values", () => {
    const itemSchema = string();
    const schema = array(itemSchema);

    const invalidCases = [
      {},
      "string",
      42,
      null,
      undefined,
      new Map(),
      new Set(),
    ];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.array);
      }
    });
  });

  it("should reject array with invalid items", () => {
    const itemSchema = number();
    const schema = array(itemSchema);
    const value = ["invalid", "also invalid"];

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Index 0:");
    }
  });

  it("should validate array with mixed valid items", () => {
    const itemSchema = number();
    const schema = array(itemSchema);
    const value = [1, 2, 3, 4, 5];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should report correct index for invalid items", () => {
    const itemSchema = number();
    const schema = array(itemSchema);
    const value = [1, 2, "invalid", 4, 5];

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Index 2:");
    }
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom array error";
    const itemSchema = string();
    const schema = array(itemSchema, customMessage);
    const result = parse(schema, {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should validate array with complex item schema", () => {
    const mockValidator = vi.fn().mockReturnValue(true);
    const itemSchema = {
      type: "object" as const,
      validator: mockValidator,
    };
    const schema = array(itemSchema);
    const value = [{ id: 1 }, { id: 2 }];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    expect(mockValidator).toHaveBeenCalledTimes(2);
  });

  it("should return schema with correct type and constraints", () => {
    const itemSchema = string();
    const schema = array(itemSchema);

    expect(schema.type).toBe("array");
    expect(typeof schema.minLength).toBe("function");
    expect(typeof schema.maxLength).toBe("function");
    expect(typeof schema.length).toBe("function");
    expect(typeof schema.unique).toBe("function");
  });

  it("should handle coerced items followed by non-coerced items", () => {
    // Use coerce.boolean which coerces non-booleans
    const schema = array(coerceBoolean());
    // First item (1) will be coerced to true, second item (true) passes without coercion
    const value = [1, true, 0, false];

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      // 1 -> true (coerced), true -> true (not coerced), 0 -> false (coerced), false -> false (not coerced)
      expect(result.data).toEqual([true, true, false, false]);
    }
  });

  describe("[🎯] Specification Tests", () => {
    describe("sparse array edge cases", () => {
      it("[🎯] should validate existing elements in sparse array (edge case: sparse array)", () => {
        // Requirements: 29.8
        const itemSchema = number();
        const schema = array(itemSchema);
        // Create a sparse array with holes
        const sparseArray = [1, , 3]; // eslint-disable-line no-sparse-arrays
        
        const result = parse(schema, sparseArray);
        
        // Sparse arrays have undefined at the holes, which should fail number validation
        expect(result.success).toBe(false);
      });

      it("[🎯] should handle sparse array with string schema", () => {
        // Requirements: 29.8
        const itemSchema = string();
        const schema = array(itemSchema);
        // Create a sparse array with holes
        const sparseArray = ["a", , "c"]; // eslint-disable-line no-sparse-arrays
        
        const result = parse(schema, sparseArray);
        
        // Sparse arrays have undefined at the holes, which should fail string validation
        expect(result.success).toBe(false);
      });

      it("[🎯] should report correct index for sparse array holes", () => {
        // Requirements: 29.8
        const itemSchema = number();
        const schema = array(itemSchema);
        // Create a sparse array with a hole at index 1
        const sparseArray = [1, , 3]; // eslint-disable-line no-sparse-arrays
        
        const result = parse(schema, sparseArray);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          // The error should reference index 1 where the hole is
          expect(result.error).toContain("Index 1:");
        }
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.array(fc.string())])(
      "[🎲] accepts any array of strings with string schema",
      (arr) => {
        const schema = array(string());
        const result = parse(schema, arr);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(arr);
        }
      }
    );

    itProp.prop([fc.array(fc.integer())])(
      "[🎲] accepts any array of integers with number schema",
      (arr) => {
        const schema = array(number());
        const result = parse(schema, arr);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(arr);
        }
      }
    );

    itProp.prop([fc.array(fc.string())])(
      "[🎲] does not mutate original array",
      (arr) => {
        const original = [...arr];
        const schema = array(string());
        parse(schema, arr);
        expect(arr).toEqual(original);
      }
    );

    itProp.prop([fc.array(fc.anything())])(
      "[🎲] result length equals input length when all items valid",
      (arr) => {
        const schema = array(coerceBoolean());
        const result = parse(schema, arr);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.length).toBe(arr.length);
        }
      }
    );
  });
});
