/**
 * Tests for as-zod.ts - the Zod-like adapter for Kanon schemas
 * Tests the asZod() function and all Adapter methods
 */

import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { asZod } from "./as-zod";
import { string, number, object, boolean } from "@kanon/v3";

describe("asZod adapter", () => {
  describe("parse / safeParse (sync)", () => {
    it("parse returns value on success", () => {
      const schema = asZod(string());
      expect(schema.parse("hello")).toBe("hello");
    });

    it("parse throws on failure", () => {
      const schema = asZod(string());
      expect(() => schema.parse(123)).toThrow();
    });

    it("safeParse returns success result", () => {
      const schema = asZod(string());
      const result = schema.safeParse("hello");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe("hello");
      }
    });

    it("safeParse returns error with issues", () => {
      const schema = asZod(string());
      const result = schema.safeParse(123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual([]);
        expect(result.error.issues[0].message).toBeDefined();
      }
    });
  });

  describe("parseAsync / safeParseAsync", () => {
    it("parseAsync resolves on success", async () => {
      const schema = asZod(string());
      const value = await schema.parseAsync("hello");
      expect(value).toBe("hello");
    });

    it("parseAsync rejects on failure", async () => {
      const schema = asZod(string());
      await expect(schema.parseAsync(123)).rejects.toBeDefined();
    });

    it("safeParseAsync returns success result", async () => {
      const schema = asZod(string());
      const result = await schema.safeParseAsync("hello");
      expect(result.success).toBe(true);
    });

    it("safeParseAsync returns error result", async () => {
      const schema = asZod(string());
      const result = await schema.safeParseAsync(123);
      expect(result.success).toBe(false);
    });
  });

  describe("optional", () => {
    it("accepts undefined", () => {
      const schema = asZod(string()).optional();
      expect(schema.parse(undefined)).toBeUndefined();
    });

    it("accepts valid value", () => {
      const schema = asZod(string()).optional();
      expect(schema.parse("hello")).toBe("hello");
    });
  });

  describe("nullable", () => {
    it("accepts null", () => {
      const schema = asZod(string()).nullable();
      expect(schema.parse(null)).toBeNull();
    });

    it("accepts valid value", () => {
      const schema = asZod(string()).nullable();
      expect(schema.parse("hello")).toBe("hello");
    });
  });

  describe("nullish", () => {
    it("accepts null", () => {
      const schema = asZod(string()).nullish();
      expect(schema.parse(null)).toBeNull();
    });

    it("accepts undefined", () => {
      const schema = asZod(string()).nullish();
      expect(schema.parse(undefined)).toBeUndefined();
    });

    it("accepts valid value", () => {
      const schema = asZod(string()).nullish();
      expect(schema.parse("hello")).toBe("hello");
    });
  });

  describe("default", () => {
    it("applies default value when undefined", () => {
      const schema = asZod(string()).default("fallback");
      expect(schema.parse(undefined)).toBe("fallback");
    });

    it("uses provided value when not undefined", () => {
      const schema = asZod(string()).default("fallback");
      expect(schema.parse("hello")).toBe("hello");
    });
  });

  describe("catch", () => {
    it("returns catch value on validation failure", () => {
      const schema = asZod(string()).catch("fallback");
      expect(schema.parse(123)).toBe("fallback");
    });

    it("returns catch value from function", () => {
      const schema = asZod(string()).catch(() => "generated");
      expect(schema.parse(123)).toBe("generated");
    });

    it("returns valid value when validation passes", () => {
      const schema = asZod(string()).catch("fallback");
      expect(schema.parse("hello")).toBe("hello");
    });

    it("returns catch value on refinement failure", () => {
      const schema = asZod(number())
        .refine((n) => n > 0, "must be positive")
        .catch(0);
      expect(schema.parse(-5)).toBe(0);
    });

    it("returns catch value on transform failure", () => {
      const schema = asZod(string())
        .transform((): string => {
          throw new Error("transform error");
        })
        .catch("fallback");
      expect(schema.parse("test")).toBe("fallback");
    });
  });

  describe("refine", () => {
    it("passes when refinement returns true", () => {
      const schema = asZod(number()).refine((n) => n > 0, "must be positive");
      expect(schema.parse(5)).toBe(5);
    });

    it("fails when refinement returns false", () => {
      const schema = asZod(number()).refine((n) => n > 0, "must be positive");
      const result = schema.safeParse(-1);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("must be positive");
      }
    });

    it("uses default message when none provided", () => {
      const schema = asZod(number()).refine((n) => n > 0);
      const result = schema.safeParse(-1);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Invalid value");
      }
    });

    it("chains multiple refines", () => {
      const schema = asZod(number())
        .refine((n) => n > 0, "must be positive")
        .refine((n) => n < 100, "must be less than 100");
      expect(schema.parse(50)).toBe(50);
      expect(schema.safeParse(-1).success).toBe(false);
      expect(schema.safeParse(150).success).toBe(false);
    });
  });

  describe("superRefine", () => {
    it("passes when no issues added", () => {
      const schema = asZod(number()).superRefine((val, ctx) => {
        if (val < 0) {
          ctx.addIssue({ code: "custom", message: "negative", path: [] });
        }
      });
      expect(schema.parse(5)).toBe(5);
    });

    it("fails when issue added", () => {
      const schema = asZod(number()).superRefine((val, ctx) => {
        if (val < 0) {
          ctx.addIssue({ code: "custom", message: "negative", path: ["value"] });
        }
      });
      const result = schema.safeParse(-1);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("negative");
        expect(result.error.issues[0].path).toEqual(["value"]);
      }
    });

    it("handles non-array path", () => {
      const schema = asZod(number()).superRefine((val, ctx) => {
        if (val < 0) {
          ctx.addIssue({ code: "custom", message: "negative", path: undefined as unknown as [] });
        }
      });
      const result = schema.safeParse(-1);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual([]);
      }
    });

    it("chains multiple superRefines", () => {
      const schema = asZod(number())
        .superRefine((val, ctx) => {
          if (val < 0) {
            ctx.addIssue({ code: "custom", message: "negative", path: [] });
          }
        })
        .superRefine((val, ctx) => {
          if (val > 100) {
            ctx.addIssue({ code: "custom", message: "too big", path: [] });
          }
        });
      expect(schema.parse(50)).toBe(50);
      expect(schema.safeParse(-1).success).toBe(false);
      expect(schema.safeParse(150).success).toBe(false);
    });
  });

  describe("transform", () => {
    it("applies transform after validation", () => {
      const schema = asZod(string()).transform((s) => s.length);
      expect(schema.parse("hello")).toBe(5);
    });

    it("chains multiple transforms", () => {
      const schema = asZod(string())
        .transform((s) => s.toUpperCase())
        .transform((s) => s + "!");
      expect(schema.parse("hello")).toBe("HELLO!");
    });

    it("returns error message on transform Error", () => {
      const schema = asZod(string()).transform(() => {
        throw new Error("custom error message");
      });
      const result = schema.safeParse("test");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("custom error message");
      }
    });

    it("returns generic message on non-Error throw", () => {
      const schema = asZod(string()).transform(() => {
        throw "not an error object";
      });
      const result = schema.safeParse("test");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Transform failed");
      }
    });
  });

  describe("array", () => {
    it("wraps schema in array", () => {
      const schema = asZod(string()).array();
      expect(schema.parse(["a", "b"])).toEqual(["a", "b"]);
    });
  });

  describe("or / and", () => {
    it("or accepts either type", () => {
      const schema = asZod(string()).or(asZod(number()));
      expect(schema.parse("hello")).toBe("hello");
      expect(schema.parse(42)).toBe(42);
    });

    it("and requires both types", () => {
      const schema = asZod(object({ a: string() })).and(
        asZod(object({ b: number() }))
      );
      expect(schema.parse({ a: "x", b: 1 })).toEqual({ a: "x", b: 1 });
    });

    it("and flattens nested intersections", () => {
      const schema = asZod(object({ a: string() }))
        .and(asZod(object({ b: number() })))
        .and(asZod(object({ c: boolean() })));
      expect(schema.parse({ a: "x", b: 1, c: true })).toEqual({ a: "x", b: 1, c: true });
    });

    it("and fails when one schema fails", () => {
      const schema = asZod(object({ a: string() }))
        .and(asZod(object({ b: number() })));
      const result = schema.safeParse({ a: "x", b: "not a number" });
      expect(result.success).toBe(false);
    });

    it("flattened and fails when third schema fails", () => {
      const schema = asZod(object({ a: string() }))
        .and(asZod(object({ b: number() })))
        .and(asZod(object({ c: boolean() })));
      const result = schema.safeParse({ a: "x", b: 1, c: "not a boolean" });
      expect(result.success).toBe(false);
    });
  });

  describe("readonly", () => {
    it("wraps schema as readonly", () => {
      const schema = asZod(string()).readonly();
      expect(schema.parse("hello")).toBe("hello");
    });
  });

  describe("_schema internal", () => {
    it("returns underlying Kanon schema", () => {
      const kanon = string();
      const adapter = asZod(kanon);
      expect(adapter._schema()).toBe(kanon);
    });
  });
});


describe("[👾] Mutation Tests", () => {
  describe("refine error path", () => {
    it("[👾] should return empty path array on refine failure", () => {
      const schema = asZod(number()).refine((n) => n > 0, "must be positive");
      const result = schema.safeParse(-1);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual([]);
        expect(result.error.issues[0].path).toHaveLength(0);
      }
    });
  });

  describe("transform error path", () => {
    it("[👾] should return empty path array on transform failure", () => {
      const schema = asZod(string()).transform(() => {
        throw new Error("transform error");
      });
      const result = schema.safeParse("test");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual([]);
        expect(result.error.issues[0].path).toHaveLength(0);
      }
    });
  });

  describe("superRefine code property", () => {
    it("[👾] should set code to 'custom' on superRefine issue", () => {
      const schema = asZod(number()).superRefine((val, ctx) => {
        if (val < 0) {
          ctx.addIssue({ code: "custom", message: "negative", path: [] });
        }
      });
      const result = schema.safeParse(-1);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe("custom");
      }
    });
  });

  describe("array does not inherit catch", () => {
    it("[👾] should not inherit catch when calling array()", () => {
      // If hasCatch was true after array(), this would return "fallback" instead of throwing
      const schema = asZod(string()).catch("fallback").array();
      const result = schema.safeParse([123]); // Invalid: array contains non-string
      expect(result.success).toBe(false);
    });
  });

  describe("or does not inherit catch", () => {
    it("[👾] should not inherit catch when calling or()", () => {
      // If hasCatch was true after or(), this would return "fallback" instead of failing
      const schema = asZod(string()).catch("fallback").or(asZod(number()));
      const result = schema.safeParse(true); // Invalid: neither string nor number
      expect(result.success).toBe(false);
    });
  });



  describe("flattened intersection error message", () => {
    it("[👾] should return error message from failing schema in flattened intersection", () => {
      const schema = asZod(object({ a: string() }))
        .and(asZod(object({ b: number() })))
        .and(asZod(object({ c: boolean() })));
      
      const result = schema.safeParse({ a: "x", b: 1, c: "not boolean" });
      expect(result.success).toBe(false);
      if (!result.success) {
        // Should have an error message
        expect(result.error.issues[0].message).toBeDefined();
        expect(typeof result.error.issues[0].message).toBe("string");
        expect(result.error.issues[0].message.length).toBeGreaterThan(0);
      }
    });
  });
});

describe("[🎲] Property-Based Tests", () => {
  describe("parse / safeParse", () => {
    itProp.prop([fc.string()])("[🎲] should parse any string successfully", (value) => {
      const schema = asZod(string());
      expect(schema.parse(value)).toBe(value);
    });

    itProp.prop([fc.double({ noNaN: true })])("[🎲] should parse any number successfully", (value) => {
      const schema = asZod(number());
      expect(schema.parse(value)).toBe(value);
    });

    itProp.prop([fc.boolean()])("[🎲] should parse any boolean successfully", (value) => {
      const schema = asZod(boolean());
      expect(schema.parse(value)).toBe(value);
    });

    itProp.prop([fc.oneof(fc.integer(), fc.boolean(), fc.constant(null))])(
      "[🎲] should fail for non-string values on string schema",
      (value) => {
        const schema = asZod(string());
        const result = schema.safeParse(value);
        expect(result.success).toBe(false);
      }
    );
  });

  describe("optional", () => {
    itProp.prop([fc.oneof(fc.string(), fc.constant(undefined))])(
      "[🎲] should accept string or undefined",
      (value) => {
        const schema = asZod(string()).optional();
        const result = schema.safeParse(value);
        expect(result.success).toBe(true);
      }
    );
  });

  describe("nullable", () => {
    itProp.prop([fc.oneof(fc.string(), fc.constant(null))])(
      "[🎲] should accept string or null",
      (value) => {
        const schema = asZod(string()).nullable();
        const result = schema.safeParse(value);
        expect(result.success).toBe(true);
      }
    );
  });

  describe("nullish", () => {
    itProp.prop([fc.oneof(fc.string(), fc.constant(null), fc.constant(undefined))])(
      "[🎲] should accept string, null, or undefined",
      (value) => {
        const schema = asZod(string()).nullish();
        const result = schema.safeParse(value);
        expect(result.success).toBe(true);
      }
    );
  });

  describe("default", () => {
    itProp.prop([fc.string()])(
      "[🎲] should use provided value when not undefined",
      (value) => {
        const schema = asZod(string()).default("fallback");
        expect(schema.parse(value)).toBe(value);
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] should use default value when undefined",
      (defaultValue) => {
        const schema = asZod(string()).default(defaultValue);
        expect(schema.parse(undefined)).toBe(defaultValue);
      }
    );
  });

  describe("transform", () => {
    itProp.prop([fc.string()])("[🎲] should transform string to length", (value) => {
      const schema = asZod(string()).transform((s) => s.length);
      expect(schema.parse(value)).toBe(value.length);
    });

    itProp.prop([fc.string()])("[🎲] should transform string to uppercase", (value) => {
      const schema = asZod(string()).transform((s) => s.toUpperCase());
      expect(schema.parse(value)).toBe(value.toUpperCase());
    });
  });

  describe("refine", () => {
    itProp.prop([fc.integer({ min: 1, max: 1000 })])(
      "[🎲] should pass positive numbers",
      (value) => {
        const schema = asZod(number()).refine((n) => n > 0, "must be positive");
        expect(schema.parse(value)).toBe(value);
      }
    );

    itProp.prop([fc.integer({ min: -1000, max: -1 })])(
      "[🎲] should fail negative numbers",
      (value) => {
        const schema = asZod(number()).refine((n) => n > 0, "must be positive");
        const result = schema.safeParse(value);
        expect(result.success).toBe(false);
      }
    );
  });

  describe("array", () => {
    itProp.prop([fc.array(fc.string())])("[🎲] should accept any string array", (value) => {
      const schema = asZod(string()).array();
      expect(schema.parse(value)).toEqual(value);
    });
  });

  describe("or", () => {
    itProp.prop([fc.oneof(fc.string(), fc.integer())])(
      "[🎲] should accept string or number",
      (value) => {
        const schema = asZod(string()).or(asZod(number()));
        const result = schema.safeParse(value);
        expect(result.success).toBe(true);
      }
    );
  });
});
