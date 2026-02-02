import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { map } from "./map";
import { parse } from "../../core/parser";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { coerceBoolean } from "../coerce/boolean";
import { coerceString } from "../coerce/string";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";
import { castMap } from "@arkhe/test/private-access";

describe("map", () => {
  it("should validate Map with valid keys and values", () => {
    const keySchema = string();
    const valueSchema = number();
    const schema = map(keySchema, valueSchema);
    const value = new Map([
      ["a", 1],
      ["b", 2],
      ["c", 3],
    ]);

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(value);
    }
  });

  it("should validate empty Map", () => {
    const keySchema = string();
    const valueSchema = number();
    const schema = map(keySchema, valueSchema);
    const value = new Map();

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(value);
    }
  });

  it("should reject non-Map values", () => {
    const keySchema = string();
    const valueSchema = number();
    const schema = map(keySchema, valueSchema);

    const invalidCases = [[], {}, "string", 42, null, undefined, new Set()];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.map);
      }
    });
  });

  it("should reject Map with invalid keys", () => {
    const keySchema = number();
    const valueSchema = string();
    const schema = map(keySchema, valueSchema);
    const value = new Map([
      ["invalid", "value"],
      ["also invalid", "value"],
    ]);

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Key:");
    }
  });

  it("should reject Map with invalid values", () => {
    const keySchema = string();
    const valueSchema = number();
    const schema = map(keySchema, valueSchema);
    const value = new Map([
      ["key1", "invalid"],
      ["key2", "also invalid"],
    ]);

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Value:");
    }
  });

  it("should reject Map with invalid keys and values", () => {
    const keySchema = number();
    const valueSchema = number();
    const schema = map(keySchema, valueSchema);
    const value = new Map([["invalid key", "invalid value"]]);

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Key:");
    }
  });

  it("should validate Map with complex key and value schemas", () => {
    const mockKeyValidator = vi.fn().mockReturnValue(true);
    const mockValueValidator = vi.fn().mockReturnValue(true);
    const keySchema = {
      type: "string" as const,
      validator: mockKeyValidator,
    };
    const valueSchema = {
      type: "object" as const,
      validator: mockValueValidator,
    };
    const schema = map(keySchema, valueSchema);
    const value = new Map([
      ["key1", { id: 1 }],
      ["key2", { id: 2 }],
    ]);

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    expect(mockKeyValidator).toHaveBeenCalledTimes(2);
    expect(mockValueValidator).toHaveBeenCalledTimes(2);
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom map error";
    const keySchema = string();
    const valueSchema = number();
    const schema = map(keySchema, valueSchema, customMessage);
    const result = parse(schema, []);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should use custom message for invalid keys when provided", () => {
    const customMessage = "Custom key error";
    const keySchema = number();
    const valueSchema = string();
    const schema = map(keySchema, valueSchema, customMessage);
    const value = new Map([["invalid", "value"]]);

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should use custom message for invalid values when provided", () => {
    const customMessage = "Custom value error";
    const keySchema = string();
    const valueSchema = number();
    const schema = map(keySchema, valueSchema, customMessage);
    const value = new Map([["key", "invalid"]]);

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should return schema with correct type", () => {
    const keySchema = string();
    const valueSchema = number();
    const schema = map(keySchema, valueSchema);

    expect(schema.type).toBe("map");
    expect(schema.keySchema).toBe(keySchema);
    expect(schema.valueSchema).toBe(valueSchema);
  });

  describe("constraints", () => {
    it("should expose minSize and maxSize methods", () => {
      const keySchema = string();
      const valueSchema = number();
      const schema = map(keySchema, valueSchema);

      expect(typeof schema.minSize).toBe("function");
      expect(typeof schema.maxSize).toBe("function");
    });

    it("should validate Map with minSize constraint", () => {
      const schema = map(string(), number()).minSize(2);
      const validValue = new Map([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);
      const invalidValue = new Map([["a", 1]]);

      expect(parse(schema, validValue).success).toBe(true);
      expect(parse(schema, invalidValue).success).toBe(false);
    });

    it("should validate Map with maxSize constraint", () => {
      const schema = map(string(), number()).maxSize(2);
      const validValue = new Map([
        ["a", 1],
        ["b", 2],
      ]);
      const invalidValue = new Map([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);

      expect(parse(schema, validValue).success).toBe(true);
      expect(parse(schema, invalidValue).success).toBe(false);
    });

    it("should validate Map with both minSize and maxSize constraints", () => {
      const schema = map(string(), number()).minSize(2).maxSize(4);
      const validValue = new Map([
        ["a", 1],
        ["b", 2],
        ["c", 3],
      ]);
      const tooSmall = new Map([["a", 1]]);
      const tooLarge = new Map([
        ["a", 1],
        ["b", 2],
        ["c", 3],
        ["d", 4],
        ["e", 5],
      ]);

      expect(parse(schema, validValue).success).toBe(true);
      expect(parse(schema, tooSmall).success).toBe(false);
      expect(parse(schema, tooLarge).success).toBe(false);
    });

    it("should use custom error message for minSize", () => {
      const customMessage = "Map too small";
      const schema = map(string(), number()).minSize(2, customMessage);
      const result = parse(schema, new Map([["a", 1]]));

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should use custom error message for maxSize", () => {
      const customMessage = "Map too large";
      const schema = map(string(), number()).maxSize(2, customMessage);
      const result = parse(
        schema,
        new Map([
          ["a", 1],
          ["b", 2],
          ["c", 3],
        ])
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });
  });

  describe("coercion", () => {
    it("should coerce map values", () => {
      // coerceBoolean coerces non-booleans to boolean
      const schema = map(string(), coerceBoolean());
      const value = new Map<string, unknown>([
        ["a", 1],      // coerced to true
        ["b", true],   // already boolean
        ["c", 0],      // coerced to false
      ]);

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.get("a")).toBe(true);
        expect(result.data.get("b")).toBe(true);
        expect(result.data.get("c")).toBe(false);
      }
    });

    it("should coerce map keys", () => {
      // coerceString coerces non-strings to string
      const schema = map(coerceString(), number());
      const value = new Map<unknown, number>([
        [42, 1],       // key coerced to "42"
        ["hello", 2],  // key already string
      ]);

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.get("42")).toBe(1);
        expect(result.data.get("hello")).toBe(2);
      }
    });

    it("should coerce both keys and values", () => {
      const schema = map(coerceString(), coerceBoolean());
      const value = new Map<unknown, unknown>([
        [1, "yes"],    // key coerced to "1", value coerced to true
        ["key", 0],    // key already string, value coerced to false
      ]);

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.get("1")).toBe(true);
        expect(result.data.get("key")).toBe(false);
      }
    });

    it("should coerce key without coercing value", () => {
      // This tests the branch where key is coerced but value is valid (line 43)
      const schema = map(coerceString(), number());
      const value = new Map<unknown, number>([
        [42, 1],       // key coerced to "42", value already valid
      ]);

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.get("42")).toBe(1);
        expect(castMap<number, number>(result.data).has(42)).toBe(false); // original key removed
      }
    });

    it("should handle coercion when coercedMap already exists from value coercion", () => {
      // This tests the branch where coercedMap already exists when we coerce a key
      // First entry: valid key, coerced value -> creates coercedMap
      // Second entry: coerced key -> enters isCoerced(keyResult) with coercedMap already existing
      const schema = map(coerceString(), coerceBoolean());
      const value = new Map<unknown, unknown>([
        ["first", 1],  // key valid, value coerced to true -> creates coercedMap
        [42, true],    // key coerced to "42", value valid -> coercedMap already exists
      ]);

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.get("first")).toBe(true);
        expect(result.data.get("42")).toBe(true);
        expect(castMap<number, boolean>(result.data).has(42)).toBe(false);
      }
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.array(fc.tuple(fc.string(), fc.integer()))])(
      "[🎲] accepts any Map<string, number> with correct schemas",
      (entries) => {
        const schema = map(string(), number());
        const value = new Map(entries);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.size).toBe(value.size);
        }
      }
    );

    itProp.prop([fc.array(fc.tuple(fc.string(), fc.integer()))])(
      "[🎲] does not mutate original Map",
      (entries) => {
        const value = new Map(entries);
        const originalSize = value.size;
        const originalEntries = [...value.entries()];
        const schema = map(string(), number());
        parse(schema, value);
        expect(value.size).toBe(originalSize);
        expect([...value.entries()]).toEqual(originalEntries);
      }
    );

    itProp.prop([fc.array(fc.tuple(fc.string(), fc.anything()))])(
      "[🎲] coercion preserves Map size",
      (entries) => {
        const schema = map(string(), coerceBoolean());
        const value = new Map(entries);
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.size).toBe(value.size);
        }
      }
    );
  });
});
