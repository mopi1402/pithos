import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { record } from "./record";
import { parse } from "../../core/parser";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { coerceBoolean } from "../coerce/boolean";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("record", () => {
  it("should validate object with valid keys and values", () => {
    const keySchema = string();
    const valueSchema = number();
    const schema = record(keySchema, valueSchema);
    const value = { a: 1, b: 2, c: 3 };

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(value);
    }
  });

  it("should validate empty object", () => {
    const keySchema = string();
    const valueSchema = number();
    const schema = record(keySchema, valueSchema);
    const value = {};

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(value);
    }
  });

  it("should reject non-object values", () => {
    const keySchema = string();
    const valueSchema = number();
    const schema = record(keySchema, valueSchema);

    const invalidCases = [[], "string", 42, null, undefined];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.object);
      }
    });
  });

  it("should accept empty Map and Set (no keys to validate)", () => {
    const keySchema = string();
    const valueSchema = number();
    const schema = record(keySchema, valueSchema);

    const emptyCases = [new Map(), new Set()];

    emptyCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(true);
    });
  });

  it("should reject arrays", () => {
    const keySchema = string();
    const valueSchema = number();
    const schema = record(keySchema, valueSchema);
    const result = parse(schema, [1, 2, 3]);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.object);
    }
  });

  it("should reject object with invalid keys", () => {
    const keySchema = number();
    const valueSchema = string();
    const schema = record(keySchema, valueSchema);
    const value = { invalid: "value", "also invalid": "value" };

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Key "');
    }
  });

  it("should reject object with invalid values", () => {
    const keySchema = string();
    const valueSchema = number();
    const schema = record(keySchema, valueSchema);
    const value = { key1: "invalid", key2: "also invalid" };

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Value for key "');
    }
  });

  it("should validate object with complex key and value schemas", () => {
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
    const schema = record(keySchema, valueSchema);
    const value = { key1: { id: 1 }, key2: { id: 2 } };

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    expect(mockKeyValidator).toHaveBeenCalledTimes(2);
    expect(mockValueValidator).toHaveBeenCalledTimes(2);
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom record error";
    const keySchema = string();
    const valueSchema = number();
    const schema = record(keySchema, valueSchema, customMessage);
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
    const schema = record(keySchema, valueSchema, customMessage);
    const value = { invalid: "value" };

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
    const schema = record(keySchema, valueSchema, customMessage);
    const value = { key: "invalid" };

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should return schema with correct type", () => {
    const keySchema = string();
    const valueSchema = number();
    const schema = record(keySchema, valueSchema);

    expect(schema.type).toBe("record");
    expect(schema.keySchema).toBe(keySchema);
    expect(schema.valueSchema).toBe(valueSchema);
  });

  describe("coercion", () => {
    it("should coerce record values", () => {
      const schema = record(string(), coerceBoolean());
      const value = { a: 1, b: 0, c: true };

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.a).toBe(true);
        expect(result.data.b).toBe(false);
        expect(result.data.c).toBe(true);
      }
    });

    it("should coerce first value and copy subsequent valid values", () => {
      // This tests the branch where coercedObj exists and a valid value is copied
      const schema = record(string(), coerceBoolean());
      const value = { a: 1, b: true }; // a coerced, b valid (copied to coercedObj)

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.a).toBe(true);
        expect(result.data.b).toBe(true);
      }
    });

    it("should handle coerced key validation (isCoerced branch)", () => {
      // Create a schema that returns coerced for keys
      const coercingKeySchema = {
        type: "string" as const,
        validator: (v: unknown) => {
          if (typeof v === "string") {
            return { coerced: v.toUpperCase() };
          }
          return "Expected string";
        },
      };
      const schema = record(coercingKeySchema, number());
      const value = { hello: 42 };

      const result = parse(schema, value);

      // Keys are strings, coercion result is ignored but validation passes
      expect(result.success).toBe(true);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("boundary conditions", () => {
      it("[🎯] should accept empty record (boundary: empty record)", () => {
        // Requirement 17.1: WHEN record receives an empty object, THE RecordSchema SHALL accept it
        const schema = record(string(), number());
        const result = parse(schema, {});

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({});
        }
      });

      it("[🎯] should reject object with invalid key type (boundary: key validation)", () => {
        // Requirement 17.2: WHEN record receives an object with invalid key type, THE RecordSchema SHALL reject it
        // Using a number schema for keys - all object keys are strings, so this should fail
        const schema = record(number(), string());
        const value = { notANumber: "value" };

        const result = parse(schema, value);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContain('Key "notANumber"');
        }
      });

      it("[🎯] should reject object with invalid value type (boundary: value validation)", () => {
        // Requirement 17.3: WHEN record receives an object with invalid value type, THE RecordSchema SHALL reject it
        const schema = record(string(), number());
        const value = { key: "not a number" };

        const result = parse(schema, value);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContain('Value for key "key"');
        }
      });
    });

    describe("edge cases", () => {
      it("[🎯] should accept empty Map as object with no enumerable properties", () => {
        // Requirement 17.4: WHEN record receives a Map or Set, THE RecordSchema SHALL accept them if they have no enumerable properties
        const schema = record(string(), number());
        const emptyMap = new Map();

        const result = parse(schema, emptyMap);

        expect(result.success).toBe(true);
      });

      it("[🎯] should accept empty Set as object with no enumerable properties", () => {
        // Requirement 17.4: WHEN record receives a Map or Set, THE RecordSchema SHALL accept them if they have no enumerable properties
        const schema = record(string(), number());
        const emptySet = new Set();

        const result = parse(schema, emptySet);

        expect(result.success).toBe(true);
      });

      it("[🎯] should accept Map with enumerable properties if they match schema", () => {
        // Requirement 17.4: Map/Set as objects - testing with added enumerable properties
        const schema = record(string(), number());
        const mapWithProps = new Map();
        // Add an enumerable property to the Map
        (mapWithProps as unknown as Record<string, number>).customKey = 42;

        const result = parse(schema, mapWithProps);

        expect(result.success).toBe(true);
      });

      it("[🎯] should reject Map with enumerable properties that don't match schema", () => {
        // Requirement 17.4: Map/Set as objects - testing with invalid enumerable properties
        const schema = record(string(), number());
        const mapWithInvalidProps = new Map();
        // Add an enumerable property with invalid value type
        (mapWithInvalidProps as unknown as Record<string, string>).customKey =
          "not a number";

        const result = parse(schema, mapWithInvalidProps);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContain('Value for key "customKey"');
        }
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
      "[🎲] accepts any Record<string, number> with correct schemas",
      (obj) => {
        const schema = record(string(), number());
        const result = parse(schema, obj);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(obj);
        }
      }
    );

    itProp.prop([fc.dictionary(fc.string(), fc.string())])(
      "[🎲] accepts any Record<string, string> with correct schemas",
      (obj) => {
        const schema = record(string(), string());
        const result = parse(schema, obj);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(obj);
        }
      }
    );

    itProp.prop([fc.dictionary(fc.string(), fc.integer())])(
      "[🎲] does not mutate original object",
      (obj) => {
        const original = { ...obj };
        const schema = record(string(), number());
        parse(schema, obj);
        expect(obj).toEqual(original);
      }
    );

    itProp.prop([fc.dictionary(fc.string(), fc.anything())])(
      "[🎲] coercion preserves key count",
      (obj) => {
        const schema = record(string(), coerceBoolean());
        const result = parse(schema, obj);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(Object.keys(result.data).length).toBe(Object.keys(obj).length);
        }
      }
    );
  });
});
