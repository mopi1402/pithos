import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { intersection, intersection3 } from "./intersection";
import { parse } from "../../core/parser";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { object } from "../composites/object";

describe("intersection", () => {
  it("should validate value matching both schemas", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema = intersection(schema1, schema2);

    const result = parse(schema, { name: "John", age: 30 });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: "John", age: 30 });
    }
  });

  it("should reject value not matching first schema", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema = intersection(schema1, schema2);

    const result = parse(schema, { age: 30 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'name'");
    }
  });

  it("should reject value not matching second schema", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema = intersection(schema1, schema2);

    const result = parse(schema, { name: "John" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'age'");
    }
  });

  it("should reject value matching neither schema", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema = intersection(schema1, schema2);

    const result = parse(schema, {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property");
    }
  });

  it("should use custom error message when provided", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema = intersection(schema1, schema2, "Invalid object");

    const result = parse(schema, {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Invalid object");
    }
  });

  it("should merge properties from both schemas", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema = intersection(schema1, schema2);

    const result = parse(schema, { name: "John", age: 30, extra: "ignored" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: "John", age: 30, extra: "ignored" });
    }
  });

  it("should validate with overlapping properties", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ name: string(), age: number() });
    const schema = intersection(schema1, schema2);

    const result = parse(schema, { name: "John", age: 30 });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: "John", age: 30 });
    }
  });

  it("should return first error message when both fail", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema = intersection(schema1, schema2);

    const result = parse(schema, {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'name'");
    }
  });
});

describe("intersection3", () => {
  it("should validate value matching all three schemas", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema3 = object({ active: string() });
    const schema = intersection3(schema1, schema2, schema3);

    const result = parse(schema, {
      name: "John",
      age: 30,
      active: "yes",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "John",
        age: 30,
        active: "yes",
      });
    }
  });

  it("should reject value not matching first schema", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema3 = object({ active: string() });
    const schema = intersection3(schema1, schema2, schema3);

    const result = parse(schema, { age: 30, active: "yes" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'name'");
    }
  });

  it("should reject value not matching second schema", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema3 = object({ active: string() });
    const schema = intersection3(schema1, schema2, schema3);

    const result = parse(schema, { name: "John", active: "yes" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'age'");
    }
  });

  it("should reject value not matching third schema", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema3 = object({ active: string() });
    const schema = intersection3(schema1, schema2, schema3);

    const result = parse(schema, { name: "John", age: 30 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'active'");
    }
  });

  it("should use custom error message when provided", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema3 = object({ active: string() });
    const schema = intersection3(schema1, schema2, schema3, "Invalid object");

    const result = parse(schema, {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Invalid object");
    }
  });

  it("should merge properties from all three schemas", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema3 = object({ active: string() });
    const schema = intersection3(schema1, schema2, schema3);

    const result = parse(schema, {
      name: "John",
      age: 30,
      active: "yes",
      extra: "ignored",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        name: "John",
        age: 30,
        active: "yes",
        extra: "ignored",
      });
    }
  });

  it("should return first error message when multiple fail", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema3 = object({ active: string() });
    const schema = intersection3(schema1, schema2, schema3);

    const result = parse(schema, {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'name'");
    }
  });
});

describe("[🎯] Specification Tests", () => {
  describe("intersection boundary conditions", () => {
    it("[🎯] should return first schema's error when value fails first schema (Req 16.1)", () => {
      const schema1 = object({ name: string() });
      const schema2 = object({ age: number() });
      const schema = intersection(schema1, schema2);

      // Value fails first schema (missing 'name')
      const result = parse(schema, { age: 30 });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Property 'name'");
      }
    });

    it("[🎯] should return second schema's error when value passes first but fails second schema (Req 16.2)", () => {
      const schema1 = object({ name: string() });
      const schema2 = object({ age: number() });
      const schema = intersection(schema1, schema2);

      // Value passes first schema but fails second (missing 'age')
      const result = parse(schema, { name: "John" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Property 'age'");
      }
    });

    it("[🎯] should return third schema's error when value passes first two but fails third schema (Req 16.3)", () => {
      const schema1 = object({ name: string() });
      const schema2 = object({ age: number() });
      const schema3 = object({ active: string() });
      const schema = intersection3(schema1, schema2, schema3);

      // Value passes first two schemas but fails third (missing 'active')
      const result = parse(schema, { name: "John", age: 30 });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Property 'active'");
      }
    });

    it("[🎯] should accept empty objects when intersection of empty object schemas (Req 16.4)", () => {
      const schema1 = object({});
      const schema2 = object({});
      const schema = intersection(schema1, schema2);

      const result = parse(schema, {});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({});
      }
    });
  });

  describe("intersection variants", () => {
    it("[🎯] should validate both schemas when intersection is called with 2 schemas (Req 34.1)", () => {
      const schema1 = object({ name: string() });
      const schema2 = object({ age: number() });
      const schema = intersection(schema1, schema2);

      // Valid: passes both schemas
      const validResult = parse(schema, { name: "John", age: 30 });
      expect(validResult.success).toBe(true);

      // Invalid: fails first schema
      const invalidResult1 = parse(schema, { age: 30 });
      expect(invalidResult1.success).toBe(false);

      // Invalid: fails second schema
      const invalidResult2 = parse(schema, { name: "John" });
      expect(invalidResult2.success).toBe(false);
    });

    it("[🎯] should validate all three schemas when intersection3 is called with 3 schemas (Req 34.2)", () => {
      const schema1 = object({ name: string() });
      const schema2 = object({ age: number() });
      const schema3 = object({ active: string() });
      const schema = intersection3(schema1, schema2, schema3);

      // Valid: passes all three schemas
      const validResult = parse(schema, { name: "John", age: 30, active: "yes" });
      expect(validResult.success).toBe(true);

      // Invalid: fails first schema
      const invalidResult1 = parse(schema, { age: 30, active: "yes" });
      expect(invalidResult1.success).toBe(false);

      // Invalid: fails second schema
      const invalidResult2 = parse(schema, { name: "John", active: "yes" });
      expect(invalidResult2.success).toBe(false);

      // Invalid: fails third schema
      const invalidResult3 = parse(schema, { name: "John", age: 30 });
      expect(invalidResult3.success).toBe(false);
    });

    it("[🎯] should fail on first conflict when intersection receives conflicting schemas (Req 34.3)", () => {
      // Create schemas where a value can't satisfy both
      const schema1 = object({ value: string() });
      const schema2 = object({ value: number() });
      const schema = intersection(schema1, schema2);

      // Value with string 'value' - passes first, fails second
      const result1 = parse(schema, { value: "test" });
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toContain("value");
      }

      // Value with number 'value' - fails first
      const result2 = parse(schema, { value: 42 });
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toContain("value");
      }
    });

    it("[🎯] should merge properties when intersection receives compatible object schemas (Req 34.4)", () => {
      const schema1 = object({ name: string() });
      const schema2 = object({ age: number() });
      const schema = intersection(schema1, schema2);

      const result = parse(schema, { name: "John", age: 30 });

      expect(result.success).toBe(true);
      if (result.success) {
        // Both properties from both schemas are present
        expect(result.data).toHaveProperty("name", "John");
        expect(result.data).toHaveProperty("age", 30);
      }
    });
  });
});

describe("intersection edge cases", () => {
  it("should handle empty object", () => {
    const schema1 = object({});
    const schema2 = object({});
    const schema = intersection(schema1, schema2);

    const result = parse(schema, {});

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({});
    }
  });

  it("should handle non-object values", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema = intersection(schema1, schema2);

    const result1 = parse(schema, "string");
    expect(result1.success).toBe(false);

    const result2 = parse(schema, 42);
    expect(result2.success).toBe(false);

    const result3 = parse(schema, null);
    expect(result3.success).toBe(false);

    const result4 = parse(schema, undefined);
    expect(result4.success).toBe(false);

    const result5 = parse(schema, []);
    expect(result5.success).toBe(false);
  });

  it("should handle invalid property types", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema = intersection(schema1, schema2);

    const result = parse(schema, { name: 123, age: "invalid" });

    expect(result.success).toBe(false);
  });

  it("should handle missing required properties", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema = intersection(schema1, schema2);

    const result = parse(schema, { name: "John" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("Property 'age'");
    }
  });

  it("should preserve extra properties", () => {
    const schema1 = object({ name: string() });
    const schema2 = object({ age: number() });
    const schema = intersection(schema1, schema2);

    const result = parse(schema, {
      name: "John",
      age: 30,
      extra1: "value1",
      extra2: "value2",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toHaveProperty("extra1");
      expect(result.data).toHaveProperty("extra2");
    }
  });
});


describe("[🎲] Property-Based Tests", () => {
  describe("intersection", () => {
    itProp.prop([fc.string(), fc.integer()])(
      "[🎲] should accept any object matching both schemas",
      (name, age) => {
        const schema1 = object({ name: string() });
        const schema2 = object({ age: number() });
        const schema = intersection(schema1, schema2);

        const result = parse(schema, { name, age });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({ name, age });
        }
      }
    );

    itProp.prop([fc.integer()])(
      "[🎲] should reject objects missing first schema property",
      (age) => {
        const schema1 = object({ name: string() });
        const schema2 = object({ age: number() });
        const schema = intersection(schema1, schema2);

        const result = parse(schema, { age });

        expect(result.success).toBe(false);
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] should reject objects missing second schema property",
      (name) => {
        const schema1 = object({ name: string() });
        const schema2 = object({ age: number() });
        const schema = intersection(schema1, schema2);

        const result = parse(schema, { name });

        expect(result.success).toBe(false);
      }
    );

    itProp.prop([fc.string(), fc.integer(), fc.string()])(
      "[🎲] should preserve extra properties",
      (name, age, extra) => {
        const schema1 = object({ name: string() });
        const schema2 = object({ age: number() });
        const schema = intersection(schema1, schema2);

        const result = parse(schema, { name, age, extra });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toHaveProperty("extra", extra);
        }
      }
    );
  });

  describe("intersection3", () => {
    itProp.prop([fc.string(), fc.integer(), fc.boolean()])(
      "[🎲] should accept any object matching all three schemas",
      (name, age, active) => {
        const schema1 = object({ name: string() });
        const schema2 = object({ age: number() });
        const schema3 = object({ active: string() });
        const schema = intersection3(schema1, schema2, schema3);

        // Convert boolean to string for the 'active' field which expects string
        const result = parse(schema, { name, age, active: String(active) });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({ name, age, active: String(active) });
        }
      }
    );

    itProp.prop([fc.integer(), fc.string()])(
      "[🎲] should reject objects missing first schema property",
      (age, active) => {
        const schema1 = object({ name: string() });
        const schema2 = object({ age: number() });
        const schema3 = object({ active: string() });
        const schema = intersection3(schema1, schema2, schema3);

        const result = parse(schema, { age, active });

        expect(result.success).toBe(false);
      }
    );

    itProp.prop([fc.string(), fc.string()])(
      "[🎲] should reject objects missing second schema property",
      (name, active) => {
        const schema1 = object({ name: string() });
        const schema2 = object({ age: number() });
        const schema3 = object({ active: string() });
        const schema = intersection3(schema1, schema2, schema3);

        const result = parse(schema, { name, active });

        expect(result.success).toBe(false);
      }
    );

    itProp.prop([fc.string(), fc.integer()])(
      "[🎲] should reject objects missing third schema property",
      (name, age) => {
        const schema1 = object({ name: string() });
        const schema2 = object({ age: number() });
        const schema3 = object({ active: string() });
        const schema = intersection3(schema1, schema2, schema3);

        const result = parse(schema, { name, age });

        expect(result.success).toBe(false);
      }
    );
  });
});
