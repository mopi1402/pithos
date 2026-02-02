import { describe, it, expect, vi } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { object, strictObject, looseObject } from "./object";
import { parse } from "../../core/parser";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { coerceBoolean } from "../coerce/boolean";
import { coerceNumber } from "../coerce/number";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";
import { cast } from "@arkhe/test/private-access";
import { safeDictionary } from "_internal/test/arbitraries";

describe("object", () => {
  it("should validate object with valid properties", () => {
    const schema = object({
      name: string(),
      age: number(),
    });
    const value = { name: "John", age: 30 };

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(value);
    }
  });

  it("should validate object with extra properties (loose mode by default)", () => {
    const schema = object({
      name: string(),
      age: number(),
    });
    const value = { name: "John", age: 30, extra: "property" };

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should validate empty object when no properties defined", () => {
    const schema = object({});
    const value = {};

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should reject null and undefined", () => {
    const schema = object({
      name: string(),
    });

    const invalidCases = [null, undefined];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.object);
      }
    });
  });

  it("should reject primitives (they are not objects)", () => {
    const schema = object({
      name: string(),
    });

    const invalidCases = ["string", 42];

    invalidCases.forEach((value) => {
      const result = parse(schema, value);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.object);
      }
    });
  });

  it("should reject arrays without required properties", () => {
    const schema = object({
      name: string(),
    });
    const value: string[] = [];

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'name':");
    }
  });

  it("should validate arrays with required properties (arrays are objects)", () => {
    const schema = object({
      name: string(),
    });
    // INTENTIONAL: cast required to test array with properties (arrays are objects in JS)
    const value = cast<string[] & { name: string }>([]);
    value.name = "test";

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should reject object with invalid property values", () => {
    const schema = object({
      name: string(),
      age: number(),
    });
    const value = { name: "John", age: "invalid" };

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'age':");
    }
  });

  it("should report correct property name for invalid values", () => {
    const schema = object({
      name: string(),
      age: number(),
      active: string(),
    });
    const value = { name: "John", age: "invalid", active: "yes" };

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'age':");
    }
  });

  it("should reject object with missing required properties", () => {
    const schema = object({
      name: string(),
    });
    const value = {};

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'name':");
    }
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom object error";
    const schema = object({ name: string() }, customMessage);
    const result = parse(schema, null);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should validate object with complex property schemas", () => {
    const mockValidator = vi.fn().mockReturnValue(true);
    const propertySchema = {
      type: "object" as const,
      validator: mockValidator,
    };
    const schema = object({
      nested: propertySchema,
    });
    const value = { nested: { id: 1 } };

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    expect(mockValidator).toHaveBeenCalledWith({ id: 1 });
  });

  it("should return schema with correct type and constraints", () => {
    const schema = object({ name: string() });

    expect(schema.type).toBe("object");
    expect(typeof schema.minKeys).toBe("function");
    expect(typeof schema.maxKeys).toBe("function");
  });
});

describe("strictObject", () => {
  it("should validate object with exact properties", () => {
    const schema = strictObject({
      name: string(),
      age: number(),
    });
    const value = { name: "John", age: 30 };

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should reject object with extra properties", () => {
    const schema = strictObject({
      name: string(),
      age: number(),
    });
    const value = { name: "John", age: 30, extra: "property" };

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("unexpected property");
      expect(result.error).toContain("extra");
    }
  });

  it("should reject object with multiple extra properties", () => {
    const schema = strictObject({
      name: string(),
    });
    const value = { name: "John", extra1: "value1", extra2: "value2" };

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("unexpected property");
    }
  });

  it("should validate empty object when no properties defined", () => {
    const schema = strictObject({});
    const value = {};

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should reject empty object when properties are defined", () => {
    const schema = strictObject({
      name: string(),
    });
    const value = {};

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'name':");
    }
  });

  it("should use custom error message for extra properties when provided", () => {
    const customMessage = "Custom strict error";
    const schema = strictObject({ name: string() }, customMessage);
    const value = { name: "John", extra: "property" };

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });

  it("should validate all defined properties even in strict mode", () => {
    const schema = strictObject({
      name: string(),
      age: number(),
    });
    const value = { name: "John", age: "invalid" };

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'age':");
    }
  });
});

describe("looseObject", () => {
  it("should validate object with valid properties", () => {
    const schema = looseObject({
      name: string(),
      age: number(),
    });
    const value = { name: "John", age: 30 };

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should accept object with extra properties", () => {
    const schema = looseObject({
      name: string(),
      age: number(),
    });
    const value = { name: "John", age: 30, extra: "property", more: 123 };

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should validate empty object when no properties defined", () => {
    const schema = looseObject({});
    const value = {};

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should reject object with invalid defined properties", () => {
    const schema = looseObject({
      name: string(),
      age: number(),
    });
    const value = { name: "John", age: "invalid", extra: "ignored" };

    const result = parse(schema, value);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'age':");
    }
  });

  it("should ignore extra properties even if invalid", () => {
    const schema = looseObject({
      name: string(),
    });
    const value = { name: "John", invalidExtra: 123 };

    const result = parse(schema, value);

    expect(result.success).toBe(true);
  });

  it("should use custom error message when provided", () => {
    const customMessage = "Custom loose error";
    const schema = looseObject({ name: string() }, customMessage);
    const result = parse(schema, null);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(customMessage);
    }
  });
});

describe("[🎯] Specification Tests", () => {
  describe("strictObject boundary conditions", () => {
    it("[🎯] should reject object with extra properties (boundary: strict mode) - Req 28.1", () => {
      const schema = strictObject({
        name: string(),
      });
      const value = { name: "John", extra: "property" };

      const result = parse(schema, value);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("unexpected property");
        expect(result.error).toContain("extra");
      }
    });

    it("[🎯] should accept object with exact properties (boundary: exact match) - Req 28.2", () => {
      const schema = strictObject({
        name: string(),
        age: number(),
      });
      const value = { name: "John", age: 30 };

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name: "John", age: 30 });
      }
    });
  });

  describe("looseObject boundary conditions", () => {
    it("[🎯] should accept object with extra properties (boundary: loose mode) - Req 28.3", () => {
      const schema = looseObject({
        name: string(),
      });
      const value = { name: "John", extra: "property", another: 123 };

      const result = parse(schema, value);

      expect(result.success).toBe(true);
    });

    it("[🎯] should reject object with missing required properties (boundary: required check) - Req 28.4", () => {
      const schema = looseObject({
        name: string(),
        age: number(),
      });
      const value = { name: "John" }; // missing 'age'

      const result = parse(schema, value);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Property 'age':");
      }
    });
  });

  describe("object (default) boundary conditions", () => {
    it("[🎯] should accept object with extra properties (boundary: default is loose) - Req 28.5", () => {
      const schema = object({
        name: string(),
      });
      const value = { name: "John", extra: "property", more: 42 };

      const result = parse(schema, value);

      expect(result.success).toBe(true);
    });
  });

  describe("Symbol keys edge cases", () => {
    it("[🎯] should ignore Symbol keys (edge case: symbol keys) - Req 29.9", () => {
      const schema = object({
        name: string(),
      });
      const sym = Symbol("test");
      const value = { name: "John", [sym]: "symbol value" };

      const result = parse(schema, value);

      // Object validation should succeed, ignoring Symbol keys
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("John");
        // Symbol key should still be present on the original object
        expect(value[sym]).toBe("symbol value");
      }
    });

    it("[🎯] should ignore multiple Symbol keys", () => {
      const schema = object({
        name: string(),
      });
      const sym1 = Symbol("test1");
      const sym2 = Symbol("test2");
      const value = { name: "John", [sym1]: "value1", [sym2]: "value2" };

      const result = parse(schema, value);

      expect(result.success).toBe(true);
    });

    it("[🎯] should ignore well-known Symbol keys", () => {
      const schema = object({
        name: string(),
      });
      const value = { name: "John", [Symbol.iterator]: function* () { yield 1; } };

      const result = parse(schema, value);

      expect(result.success).toBe(true);
    });
  });

  describe("inherited properties edge cases", () => {
    it("[🎯] should ignore inherited properties when validating extra keys (edge case: prototype chain) - Req 29.10", () => {
      const schema = object({
        name: string(),
      });
      
      // Create an object with inherited properties
      const proto = { inherited: "value" };
      const value = Object.create(proto);
      value.name = "John";

      const result = parse(schema, value);

      // Should succeed - inherited properties are ignored for extra key validation
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("John");
        // Inherited property should still be accessible on the original object
        expect(value.inherited).toBe("value");
      }
    });

    it("[🎯] should accept inherited properties for required fields (like Zod) - Req 29.10", () => {
      // Note: Like Zod, we accept inherited properties via obj[key] access
      // This is intentional for performance reasons (no hasOwnProperty check)
      // See OBJECT-TO-DEFINE.md for future optimization plans
      const schema = object({
        name: string(),
      });
      
      // Create an object where 'name' is inherited (not an own property)
      const proto = { name: "Inherited" };
      const value = Object.create(proto);
      // Don't set 'name' as own property

      const result = parse(schema, value);

      // Should PASS because we access via obj[key] (like Zod)
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Inherited");
      }
    });

    it("[🎯] should prefer own property over inherited property", () => {
      const schema = object({
        name: string(),
      });
      
      // Create an object with both inherited and own 'name' property
      const proto = { name: "Inherited" };
      const value = Object.create(proto);
      value.name = "Own";

      const result = parse(schema, value);

      expect(result.success).toBe(true);
      if (result.success) {
        // Own property should be used
        expect(result.data.name).toBe("Own");
      }
    });
  });
});

describe("object coercion", () => {
  it("should coerce property values", () => {
    const schema = object({
      active: coerceBoolean(),
    });
    const value = { active: 1 }; // 1 coerced to true

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.active).toBe(true);
    }
  });

  it("should coerce first property and copy subsequent valid properties", () => {
    // This tests the case where coercedObj exists and a valid property is copied
    const schema = object({
      active: coerceBoolean(), // coerced first
      name: string(),          // valid, copied to coercedObj
    });
    const value = { active: 1, name: "test" };

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.active).toBe(true);
      expect(result.data.name).toBe("test");
    }
  });

  it("should coerce multiple properties", () => {
    const schema = object({
      active: coerceBoolean(),
      count: coerceNumber(),
    });
    const value = { active: "yes", count: "42" };

    const result = parse(schema, value);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.active).toBe(true);
      expect(result.data.count).toBe(42);
    }
  });
});

describe("[🎲] Property-Based Tests", () => {
  itProp.prop([safeDictionary(fc.string())])(
    "[🎲] accepts any object with string values when using string schema",
    (obj) => {
      const schemaProps: Record<string, ReturnType<typeof string>> = {};
      for (const key of Object.keys(obj)) {
        schemaProps[key] = string();
      }
      const schema = object(schemaProps);
      const result = parse(schema, obj);
      expect(result.success).toBe(true);
    }
  );

  itProp.prop([safeDictionary(fc.integer())])(
    "[🎲] accepts any object with number values when using number schema",
    (obj) => {
      const schemaProps: Record<string, ReturnType<typeof number>> = {};
      for (const key of Object.keys(obj)) {
        schemaProps[key] = number();
      }
      const schema = object(schemaProps);
      const result = parse(schema, obj);
      expect(result.success).toBe(true);
    }
  );

  itProp.prop([safeDictionary(fc.anything())])(
    "[🎲] does not mutate original object",
    (obj) => {
      const original = { ...obj };
      const schemaProps: Record<string, ReturnType<typeof coerceBoolean>> = {};
      for (const key of Object.keys(obj)) {
        schemaProps[key] = coerceBoolean();
      }
      const schema = object(schemaProps);
      parse(schema, obj);
      expect(Object.keys(obj)).toEqual(Object.keys(original));
    }
  );

  itProp.prop([safeDictionary(fc.string()), safeDictionary(fc.string())])(
    "[🎲] looseObject accepts extra properties",
    (obj, extra) => {
      const schemaProps: Record<string, ReturnType<typeof string>> = {};
      for (const key of Object.keys(obj)) {
        schemaProps[key] = string();
      }
      const schema = looseObject(schemaProps);
      const valueWithExtra = { ...obj, ...extra };
      const result = parse(schema, valueWithExtra);
      expect(result.success).toBe(true);
    }
  );
});
