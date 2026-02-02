import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { unionOf, unionOf3, unionOf4, discriminatedUnion } from "./union";
import { parse } from "../../core/parser";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { boolean } from "../primitives/boolean";
import { literal } from "../primitives/literal";
import { object } from "../composites/object";
import { coerceNumber } from "../coerce/number";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("unionOf", () => {
  it("should validate value matching first schema", () => {
    const schema = unionOf(string(), number());
    const result = parse(schema, "hello");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("hello");
    }
  });

  it("should validate value matching second schema", () => {
    const schema = unionOf(string(), number());
    const result = parse(schema, 42);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(42);
    }
  });

  it("should reject value matching neither schema", () => {
    const schema = unionOf(string(), number());
    const result = parse(schema, true);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.union);
    }
  });

  it("should use custom error message when provided", () => {
    const schema = unionOf(string(), number(), "Must be string or number");
    const result = parse(schema, true);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Must be string or number");
    }
  });

  it("should validate with different primitive types", () => {
    const schema = unionOf(string(), boolean());
    expect(parse(schema, "hello")).toEqual({ success: true, data: "hello" });
    expect(parse(schema, true)).toEqual({ success: true, data: true });
    expect(parse(schema, false)).toEqual({ success: true, data: false });

    const result = parse(schema, 42);
    expect(result.success).toBe(false);
  });

  it("should return first matching schema result", () => {
    const schema = unionOf(string(), number());
    const result = parse(schema, "test");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("test");
    }
  });
});

describe("unionOf3", () => {
  it("should validate value matching first schema", () => {
    const schema = unionOf3(string(), number(), boolean());
    const result = parse(schema, "hello");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("hello");
    }
  });

  it("should validate value matching second schema", () => {
    const schema = unionOf3(string(), number(), boolean());
    const result = parse(schema, 42);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(42);
    }
  });

  it("should validate value matching third schema", () => {
    const schema = unionOf3(string(), number(), boolean());
    const result = parse(schema, true);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(true);
    }
  });

  it("should reject value matching none of the schemas", () => {
    const schema = unionOf3(string(), number(), boolean());
    const result = parse(schema, null);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.union);
    }
  });

  it("should use custom error message when provided", () => {
    const schema = unionOf3(
      string(),
      number(),
      boolean(),
      "Must be string, number, or boolean"
    );
    const result = parse(schema, null);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Must be string, number, or boolean");
    }
  });

  it("should validate with all three types", () => {
    const schema = unionOf3(string(), number(), boolean());

    expect(parse(schema, "test")).toEqual({ success: true, data: "test" });
    expect(parse(schema, 42)).toEqual({ success: true, data: 42 });
    expect(parse(schema, true)).toEqual({ success: true, data: true });
    expect(parse(schema, false)).toEqual({ success: true, data: false });
  });
});

describe("unionOf4", () => {
  it("should validate value matching first schema", () => {
    const schema = unionOf4(string(), number(), boolean(), string());
    const result = parse(schema, "hello");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("hello");
    }
  });

  it("should validate value matching second schema", () => {
    const schema = unionOf4(string(), number(), boolean(), string());
    const result = parse(schema, 42);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(42);
    }
  });

  it("should validate value matching third schema", () => {
    const schema = unionOf4(string(), number(), boolean(), string());
    const result = parse(schema, true);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(true);
    }
  });

  it("should validate value matching fourth schema", () => {
    const schema = unionOf4(string(), number(), boolean(), number());
    const result = parse(schema, 100);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(100);
    }
  });

  it("should reject value matching none of the schemas", () => {
    const schema = unionOf4(string(), number(), boolean(), number());
    const result = parse(schema, null);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.union);
    }
  });

  it("should use custom error message when provided", () => {
    const schema = unionOf4(
      string(),
      number(),
      boolean(),
      number(),
      "Must be one of the allowed types"
    );
    const result = parse(schema, null);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Must be one of the allowed types");
    }
  });

  it("should validate with all four types", () => {
    const schema = unionOf4(string(), number(), boolean(), string());

    expect(parse(schema, "test")).toEqual({ success: true, data: "test" });
    expect(parse(schema, 42)).toEqual({ success: true, data: 42 });
    expect(parse(schema, true)).toEqual({ success: true, data: true });
    expect(parse(schema, false)).toEqual({ success: true, data: false });
  });
});

describe("union edge cases", () => {
  it("should handle empty string", () => {
    const schema = unionOf(string(), number());
    const result = parse(schema, "");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("");
    }
  });

  it("should handle zero", () => {
    const schema = unionOf(string(), number());
    const result = parse(schema, 0);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(0);
    }
  });

  it("should handle negative numbers", () => {
    const schema = unionOf(string(), number());
    const result = parse(schema, -42);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(-42);
    }
  });

  it("should handle NaN", () => {
    const schema = unionOf(string(), number());
    const result = parse(schema, Number.NaN);

    expect(result.success).toBe(false);
  });

  it("should handle undefined", () => {
    const schema = unionOf(string(), number());
    const result = parse(schema, undefined);

    expect(result.success).toBe(false);
  });

  it("should handle null", () => {
    const schema = unionOf(string(), number());
    const result = parse(schema, null);

    expect(result.success).toBe(false);
  });

  it("should handle objects", () => {
    const schema = unionOf(string(), number());
    const result = parse(schema, {});

    expect(result.success).toBe(false);
  });

  it("should handle arrays", () => {
    const schema = unionOf(string(), number());
    const result = parse(schema, []);

    expect(result.success).toBe(false);
  });
});

describe("discriminatedUnion", () => {
  it("should validate value matching first variant", () => {
    const schema = discriminatedUnion("type", [
      object({ type: literal("success"), data: string() }),
      object({ type: literal("error"), message: string() }),
    ]);
    const result = parse(schema, { type: "success", data: "hello" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ type: "success", data: "hello" });
    }
  });

  it("should validate value matching second variant", () => {
    const schema = discriminatedUnion("type", [
      object({ type: literal("success"), data: string() }),
      object({ type: literal("error"), message: string() }),
    ]);
    const result = parse(schema, { type: "error", message: "oops" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ type: "error", message: "oops" });
    }
  });

  it("should reject invalid discriminator value", () => {
    const schema = discriminatedUnion("type", [
      object({ type: literal("success"), data: string() }),
      object({ type: literal("error"), message: string() }),
    ]);
    const result = parse(schema, { type: "unknown", data: "test" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Invalid discriminator value "unknown"');
    }
  });

  it("should reject missing discriminator field", () => {
    const schema = discriminatedUnion("type", [
      object({ type: literal("success"), data: string() }),
      object({ type: literal("error"), message: string() }),
    ]);
    const result = parse(schema, { data: "test" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('Missing discriminator field "type"');
    }
  });

  it("should reject non-object values", () => {
    const schema = discriminatedUnion("type", [
      object({ type: literal("success"), data: string() }),
      object({ type: literal("error"), message: string() }),
    ]);
    const result = parse(schema, "not an object");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.object);
    }
  });

  it("should reject null values", () => {
    const schema = discriminatedUnion("type", [
      object({ type: literal("success"), data: string() }),
    ]);
    const result = parse(schema, null);

    expect(result.success).toBe(false);
  });

  it("should use custom error message when provided", () => {
    const schema = discriminatedUnion(
      "type",
      [
        object({ type: literal("success"), data: string() }),
        object({ type: literal("error"), message: string() }),
      ],
      "Invalid response type"
    );
    const result = parse(schema, { type: "unknown" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBe("Invalid response type");
    }
  });

  it("should validate object fields correctly", () => {
    const schema = discriminatedUnion("type", [
      object({ type: literal("success"), data: string() }),
      object({ type: literal("error"), message: string() }),
    ]);
    const result = parse(schema, { type: "success", data: 123 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("data");
    }
  });

  it("should work with number discriminators", () => {
    const schema = discriminatedUnion("code", [
      object({ code: literal(200), data: string() }),
      object({ code: literal(404), error: string() }),
    ]);

    expect(parse(schema, { code: 200, data: "ok" }).success).toBe(true);
    expect(parse(schema, { code: 404, error: "not found" }).success).toBe(true);
    expect(parse(schema, { code: 500, error: "server error" }).success).toBe(
      false
    );
  });

  it("should work with boolean discriminators", () => {
    const schema = discriminatedUnion("isValid", [
      object({ isValid: literal(true), data: string() }),
      object({ isValid: literal(false), error: string() }),
    ]);

    expect(parse(schema, { isValid: true, data: "ok" }).success).toBe(true);
    expect(parse(schema, { isValid: false, error: "fail" }).success).toBe(true);
  });

  it("should throw error for duplicate discriminator values", () => {
    expect(() => {
      discriminatedUnion("type", [
        object({ type: literal("success"), data: string() }),
        object({ type: literal("success"), other: string() }),
      ]);
    }).toThrow('Duplicate discriminator value "success"');
  });

  it("should throw error for missing literal discriminator", () => {
    expect(() => {
      discriminatedUnion("type", [
        object({ type: string(), data: string() }),
      ] as never);
    }).toThrow('must have a literal "type" field');
  });

  it("should throw error for non-object schema in discriminated union", () => {
    expect(() => {
      discriminatedUnion("type", [
        string(),
      ] as never);
    }).toThrow("must be an object schema");
  });

  it("should have O(1) lookup via schemaMap", () => {
    const schema = discriminatedUnion("type", [
      object({ type: literal("a"), data: string() }),
      object({ type: literal("b"), data: number() }),
      object({ type: literal("c"), data: boolean() }),
    ]);

    expect(schema.schemaMap.size).toBe(3);
    expect(schema.schemaMap.has("a")).toBe(true);
    expect(schema.schemaMap.has("b")).toBe(true);
    expect(schema.schemaMap.has("c")).toBe(true);
    expect(schema.schemaMap.has("d")).toBe(false);
  });

  it("should work with 4+ variants (API response pattern)", () => {
    const schema = discriminatedUnion("status", [
      object({ status: literal("pending"), progress: number() }),
      object({ status: literal("success"), data: string() }),
      object({ status: literal("error"), message: string() }),
      object({ status: literal("cancelled"), reason: string() }),
    ]);

    expect(parse(schema, { status: "pending", progress: 50 }).success).toBe(
      true
    );
    expect(parse(schema, { status: "success", data: "result" }).success).toBe(
      true
    );
    expect(parse(schema, { status: "error", message: "fail" }).success).toBe(
      true
    );
    expect(
      parse(schema, { status: "cancelled", reason: "user" }).success
    ).toBe(true);
  });

  it("[👾] should handle coerced results from variant schema", () => {
    // Test that discriminatedUnion correctly handles CoercedResult from variant schemas
    const schema = discriminatedUnion("type", [
      object({ type: literal("success"), count: coerceNumber() }),
      object({ type: literal("error"), message: string() }),
    ]);

    // "42" should be coerced to 42 by coerceNumber
    const result = parse(schema, { type: "success", count: "42" });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ type: "success", count: 42 });
    }
  });

  it("[👾] should propagate validation errors from variant schema", () => {
    // Test that discriminatedUnion propagates validation errors (not just success)
    const schema = discriminatedUnion("type", [
      object({ type: literal("success"), data: string() }),
      object({ type: literal("error"), message: string() }),
    ]);

    // Invalid: data should be string, not number
    const result = parse(schema, { type: "success", data: 123 });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain("data");
    }
  });
});


describe("[🎯] Specification Tests", () => {
  describe("unionOf edge cases", () => {
    it("[🎯] should return first matching result when schemas overlap (order matters)", () => {
      // Requirement 10.1: WHEN unionOf is called with overlapping schemas,
      // THE Union SHALL return the first matching result (edge case: order matters)
      
      // Both schemas accept strings, but with different constraints
      // The first schema (string with minLength 5) should be tried first
      const schema1 = unionOf(string().minLength(5), string());
      const schema2 = unionOf(string(), string().minLength(5));
      
      // "hi" matches string() but not minLength(5)
      // In schema1: first tries minLength(5) which fails, then tries string() which succeeds
      // In schema2: first tries string() which succeeds immediately
      const result1 = parse(schema1, "hi");
      const result2 = parse(schema2, "hi");
      
      // Both should succeed because string() accepts "hi"
      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      
      // "hello" matches both schemas
      // In both cases, the first matching schema wins
      const result3 = parse(schema1, "hello");
      const result4 = parse(schema2, "hello");
      
      expect(result3.success).toBe(true);
      expect(result4.success).toBe(true);
      
      // Test with literal overlapping - order determines which literal is matched
      const literalUnion1 = unionOf(literal("a"), literal("a"));
      const result5 = parse(literalUnion1, "a");
      expect(result5.success).toBe(true);
    });

    it("[🎯] should return union error message when no schema matches", () => {
      // Requirement 10.4: WHEN unionOf receives a value matching no schema,
      // THE Union SHALL return union error message (boundary: no match)
      const schema = unionOf(string(), number());
      const result = parse(schema, true);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.union);
      }
    });

    it("[🎯] should return union error message for object when expecting primitives", () => {
      // Requirement 10.4: Additional test for no match boundary
      const schema = unionOf(string(), number());
      const result = parse(schema, { key: "value" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.union);
      }
    });
  });

  describe("discriminatedUnion edge cases", () => {
    it("[🎯] should report missing field error when discriminator is undefined", () => {
      // Requirement 10.2: WHEN discriminatedUnion receives an object with undefined discriminator,
      // THE DiscriminatedUnion SHALL report missing field error (edge case: undefined discriminator)
      const schema = discriminatedUnion("type", [
        object({ type: literal("success"), data: string() }),
        object({ type: literal("error"), message: string() }),
      ]);
      
      // Object with undefined discriminator (field exists but value is undefined)
      const result = parse(schema, { type: undefined, data: "test" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Missing discriminator field "type"');
      }
    });

    it("[🎯] should report missing field error when discriminator field is absent", () => {
      // Requirement 10.2: Additional test - field completely missing
      const schema = discriminatedUnion("type", [
        object({ type: literal("success"), data: string() }),
        object({ type: literal("error"), message: string() }),
      ]);
      
      // Object without the discriminator field at all
      const result = parse(schema, { data: "test" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Missing discriminator field "type"');
      }
    });

    it("[🎯] should report invalid discriminator error when discriminator is null", () => {
      // Requirement 10.3: WHEN discriminatedUnion receives an object with null discriminator,
      // THE DiscriminatedUnion SHALL report invalid discriminator error (edge case: null discriminator)
      const schema = discriminatedUnion("type", [
        object({ type: literal("success"), data: string() }),
        object({ type: literal("error"), message: string() }),
      ]);
      
      // Object with null discriminator
      const result = parse(schema, { type: null, data: "test" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain('Invalid discriminator value "null"');
      }
    });

    it("[🎯] should return object error when receiving non-object value", () => {
      // Requirement 10.5: WHEN discriminatedUnion receives a non-object value,
      // THE DiscriminatedUnion SHALL return object error (boundary: type check)
      const schema = discriminatedUnion("type", [
        object({ type: literal("success"), data: string() }),
        object({ type: literal("error"), message: string() }),
      ]);

      // Test with string
      const result1 = parse(schema, "not an object");
      expect(result1.success).toBe(false);
      if (!result1.success) {
        expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.object);
      }

      // Test with number
      const result2 = parse(schema, 42);
      expect(result2.success).toBe(false);
      if (!result2.success) {
        expect(result2.error).toBe(ERROR_MESSAGES_COMPOSITION.object);
      }

      // Test with boolean
      const result3 = parse(schema, true);
      expect(result3.success).toBe(false);
      if (!result3.success) {
        expect(result3.error).toBe(ERROR_MESSAGES_COMPOSITION.object);
      }

      // Test with array (arrays are objects but not valid for discriminated union)
      const result4 = parse(schema, [1, 2, 3]);
      expect(result4.success).toBe(false);
      // Arrays pass the object check but fail on discriminator lookup
    });

    it("[🎯] should return object error when receiving null", () => {
      // Requirement 10.5: Additional test for null (boundary: type check)
      const schema = discriminatedUnion("type", [
        object({ type: literal("success"), data: string() }),
      ]);
      
      const result = parse(schema, null);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.object);
      }
    });

    it("[🎯] should return object error when receiving undefined", () => {
      // Requirement 10.5: Additional test for undefined (boundary: type check)
      const schema = discriminatedUnion("type", [
        object({ type: literal("success"), data: string() }),
      ]);
      
      const result = parse(schema, undefined);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.object);
      }
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  describe("unionOf", () => {
    itProp.prop([fc.string()])(
      "[🎲] should accept any string in string|number union",
      (value) => {
        const schema = unionOf(string(), number());
        const result = parse(schema, value);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      }
    );

    itProp.prop([fc.integer()])(
      "[🎲] should accept any integer in string|number union",
      (value) => {
        const schema = unionOf(string(), number());
        const result = parse(schema, value);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] should reject booleans in string|number union",
      (value) => {
        const schema = unionOf(string(), number());
        const result = parse(schema, value);

        expect(result.success).toBe(false);
      }
    );

    itProp.prop([fc.dictionary(fc.string(), fc.string())])(
      "[🎲] should reject objects in string|number union",
      (value) => {
        const schema = unionOf(string(), number());
        const result = parse(schema, value);

        expect(result.success).toBe(false);
      }
    );
  });

  describe("unionOf3", () => {
    itProp.prop([fc.string()])(
      "[🎲] should accept any string in string|number|boolean union",
      (value) => {
        const schema = unionOf3(string(), number(), boolean());
        const result = parse(schema, value);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      }
    );

    itProp.prop([fc.integer()])(
      "[🎲] should accept any integer in string|number|boolean union",
      (value) => {
        const schema = unionOf3(string(), number(), boolean());
        const result = parse(schema, value);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] should accept any boolean in string|number|boolean union",
      (value) => {
        const schema = unionOf3(string(), number(), boolean());
        const result = parse(schema, value);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      }
    );
  });

  describe("unionOf4", () => {
    itProp.prop([fc.oneof(fc.string(), fc.integer(), fc.boolean())])(
      "[🎲] should accept string, number, or boolean in 4-way union",
      (value) => {
        const schema = unionOf4(string(), number(), boolean(), string());
        const result = parse(schema, value);

        expect(result.success).toBe(true);
      }
    );
  });

  describe("discriminatedUnion", () => {
    itProp.prop([fc.string()])(
      "[🎲] should accept any valid success variant",
      (data) => {
        const schema = discriminatedUnion("type", [
          object({ type: literal("success"), data: string() }),
          object({ type: literal("error"), message: string() }),
        ]);
        const result = parse(schema, { type: "success", data });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({ type: "success", data });
        }
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] should accept any valid error variant",
      (message) => {
        const schema = discriminatedUnion("type", [
          object({ type: literal("success"), data: string() }),
          object({ type: literal("error"), message: string() }),
        ]);
        const result = parse(schema, { type: "error", message });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({ type: "error", message });
        }
      }
    );

    itProp.prop([fc.string().filter((s) => s !== "success" && s !== "error")])(
      "[🎲] should reject invalid discriminator values",
      (invalidType) => {
        const schema = discriminatedUnion("type", [
          object({ type: literal("success"), data: string() }),
          object({ type: literal("error"), message: string() }),
        ]);
        const result = parse(schema, { type: invalidType, data: "test" });

        expect(result.success).toBe(false);
      }
    );

    itProp.prop([fc.integer()])(
      "[🎲] should accept any valid numeric discriminator",
      (progress) => {
        const schema = discriminatedUnion("status", [
          object({ status: literal("pending"), progress: number() }),
          object({ status: literal("done"), result: string() }),
        ]);
        const result = parse(schema, { status: "pending", progress });

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual({ status: "pending", progress });
        }
      }
    );
  });
});
