import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { set } from "./set";
import { parse } from "../../core/parser";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { coerceBoolean } from "../coerce/boolean";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("set", () => {
  it("should validate Set with valid items", () => {
    const itemSchema = string();
    const schema = set(itemSchema);
    const value = new Set(["a", "b", "c"]);

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(value);
    }
  });

  it("should validate empty Set", () => {
    const itemSchema = string();
    const schema = set(itemSchema);
    const value = new Set();

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(value);
    }
  });

  it("should reject non-Set values", () => {
    const itemSchema = string();
    const schema = set(itemSchema);

    const invalidCases = [[], {}, "string", 42, null, undefined, new Map()];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.set);
      }
    });
  });

  it("should reject Set with invalid items", () => {
    const itemSchema = number();
    const schema = set(itemSchema);
    const value = new Set(["invalid", "also invalid"]);

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Item:");
    }
  });

  it("should validate Set with mixed valid items", () => {
    const itemSchema = number();
    const schema = set(itemSchema);
    const value = new Set([1, 2, 3, 4, 5]);

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom set error";
    const itemSchema = string();
    const schema = set(itemSchema, customMessage);
    const result = parse(schema, []);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should use custom message for invalid items when provided", () => {
    const customMessage = "Custom item error";
    const itemSchema = number();
    const schema = set(itemSchema, customMessage);
    const value = new Set(["invalid"]);

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should validate Set with complex item schema", () => {
    const mockValidator = vi.fn().mockReturnValue(true);
    const itemSchema = {
      type: "object" as const,
      validator: mockValidator,
    };
    const schema = set(itemSchema);
    const value = new Set([{ id: 1 }, { id: 2 }]);

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    expect(mockValidator).toHaveBeenCalledTimes(2);
  });

  it("should return schema with correct type", () => {
    const itemSchema = string();
    const schema = set(itemSchema);

    expect(schema.type).toBe("set");
    expect(schema.itemSchema).toBe(itemSchema);
  });

  describe("constraints", () => {
    it("should expose minSize and maxSize methods", () => {
      const itemSchema = string();
      const schema = set(itemSchema);

      expect(typeof schema.minSize).toBe("function");
      expect(typeof schema.maxSize).toBe("function");
    });

    it("should validate Set with minSize constraint", () => {
      const schema = set(string()).minSize(2);
      const validValue = new Set(["a", "b", "c"]);
      const invalidValue = new Set(["a"]);

      expect(parse(schema, validValue).success).toBe(true);
      expect(parse(schema, invalidValue).success).toBe(false);
    });

    it("should validate Set with maxSize constraint", () => {
      const schema = set(string()).maxSize(2);
      const validValue = new Set(["a", "b"]);
      const invalidValue = new Set(["a", "b", "c"]);

      expect(parse(schema, validValue).success).toBe(true);
      expect(parse(schema, invalidValue).success).toBe(false);
    });

    it("should validate Set with both minSize and maxSize constraints", () => {
      const schema = set(string()).minSize(2).maxSize(4);
      const validValue = new Set(["a", "b", "c"]);
      const tooSmall = new Set(["a"]);
      const tooLarge = new Set(["a", "b", "c", "d", "e"]);

      expect(parse(schema, validValue).success).toBe(true);
      expect(parse(schema, tooSmall).success).toBe(false);
      expect(parse(schema, tooLarge).success).toBe(false);
    });

    it("should use custom error message for minSize", () => {
      const customMessage = "Set too small";
      const schema = set(string()).minSize(2, customMessage);
      const result = parse(schema, new Set(["a"]));

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should use custom error message for maxSize", () => {
      const customMessage = "Set too large";
      const schema = set(string()).maxSize(2, customMessage);
      const result = parse(schema, new Set(["a", "b", "c"]));

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });
  });

  describe("coercion", () => {
    it("should coerce set items", () => {
      const schema = set(coerceBoolean());
      const value = new Set([1, 0, true, false]);

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        // 1 -> true, 0 -> false, true -> true, false -> false
        expect(result.data.has(true)).toBe(true);
        expect(result.data.has(false)).toBe(true);
        expect(result.data.size).toBe(2); // Set deduplicates
      }
    });

    it("should coerce first item and add subsequent valid items to coercedSet", () => {
      // This tests the branch where coercedSet exists and a valid item is added
      const schema = set(coerceBoolean());
      const value = new Set([1, true]); // 1 coerced to true, true is valid (added to coercedSet)

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.has(true)).toBe(true);
      }
    });

    it("should copy already validated items when coercion starts mid-iteration", () => {
      // This tests the branch where we copy previous items to coercedSet
      const schema = set(coerceBoolean());
      const value = new Set([true, false, 1]); // true and false are valid, 1 is coerced

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.has(true)).toBe(true);
        expect(result.data.has(false)).toBe(true);
      }
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.array(fc.string())])(
      "[🎲] accepts any Set<string> with string schema",
      (arr) => {
        const schema = set(string());
        const value = new Set(arr);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.size).toBe(value.size);
        }
      }
    );

    itProp.prop([fc.array(fc.integer())])(
      "[🎲] accepts any Set<number> with number schema",
      (arr) => {
        const schema = set(number());
        const value = new Set(arr);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.size).toBe(value.size);
        }
      }
    );

    itProp.prop([fc.array(fc.string())])(
      "[🎲] does not mutate original Set",
      (arr) => {
        const value = new Set(arr);
        const originalSize = value.size;
        const originalItems = [...value];
        const schema = set(string());
        parse(schema, value);
        expect(value.size).toBe(originalSize);
        expect([...value]).toEqual(originalItems);
      }
    );

    itProp.prop([fc.array(fc.anything())])(
      "[🎲] coercion may reduce size due to deduplication",
      (arr) => {
        const schema = set(coerceBoolean());
        const value = new Set(arr);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          // Coerced set may have fewer items due to boolean deduplication
          expect(result.data.size).toBeLessThanOrEqual(2);
        }
      }
    );
  });
});
