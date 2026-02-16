/**
 * Tests for Coerce Code Builder
 *
 * @since 2.0.0
 */

import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { createGeneratorContext } from "../context";
import { coerceString } from "../../schemas/coerce/string";
import { coerceNumber } from "../../schemas/coerce/number";
import { coerceBoolean } from "../../schemas/coerce/boolean";
import { coerceDate } from "../../schemas/coerce/date";
import {
  generateCoerceStringCheck,
  generateCoerceNumberCheck,
  generateCoerceBooleanCheck,
  generateCoerceDateCheck,
  generateCoerceStringValidation,
  generateCoerceNumberValidation,
  generateCoerceBooleanValidation,
  generateCoerceDateValidation,
  isCoerceType,
} from "./coerce";

describe("Coerce Code Builder", () => {
  describe("generateCoerceStringCheck", () => {
    it("should generate code that returns true for strings", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceStringCheck("value", ctx);

      expect(result.code).toContain('typeof value === "string"');
      expect(result.code).toContain("return true");
    });

    it("should generate code that coerces non-strings", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceStringCheck("value", ctx);

      expect(result.code).toContain("String(value)");
      expect(result.code).toContain("coerced:");
    });

    it("should include error handling for broken toString", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceStringCheck("value", ctx);

      expect(result.code).toContain("try");
      expect(result.code).toContain("catch");
      expect(result.code).toContain("Cannot coerce to string");
    });

    it("should use custom error message when provided", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceStringCheck("value", ctx, "Custom error");

      expect(result.code).toContain("Custom error");
    });

    it("should include path in error message", () => {
      let ctx = createGeneratorContext();
      ctx = { ...ctx, path: ["user", "name"] };
      const result = generateCoerceStringCheck("value", ctx);

      expect(result.code).toContain("Property 'user.name'");
    });
  });

  describe("generateCoerceNumberCheck", () => {
    it("should generate code that returns true for valid numbers", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceNumberCheck("value", ctx);

      expect(result.code).toContain('typeof value === "number"');
      expect(result.code).toContain("Number.isNaN(value)");
      expect(result.code).toContain("return true");
    });

    it("should generate code that handles boolean coercion", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceNumberCheck("value", ctx);

      expect(result.code).toContain('typeof value === "boolean"');
      expect(result.code).toContain("value ? 1 : 0");
    });

    it("should generate code that handles empty string coercion", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceNumberCheck("value", ctx);

      expect(result.code).toContain('value === ""');
      expect(result.code).toContain("coerced_num = 0");
    });

    it("should generate code that checks for NaN after coercion", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceNumberCheck("value", ctx);

      expect(result.code).toContain("Number.isNaN(coerced_num)");
      expect(result.code).toContain("Cannot coerce to number");
    });

    it("should use custom error message when provided", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceNumberCheck("value", ctx, "Custom number error");

      expect(result.code).toContain("Custom number error");
    });
  });

  describe("generateCoerceBooleanCheck", () => {
    it("should generate code that returns true for booleans", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceBooleanCheck("value", ctx);

      expect(result.code).toContain('typeof value === "boolean"');
      expect(result.code).toContain("return true");
    });

    it("should generate code that coerces non-booleans", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceBooleanCheck("value", ctx);

      expect(result.code).toContain("Boolean(value)");
      expect(result.code).toContain("coerced:");
    });

    it("should not include error handling (boolean coercion never fails)", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceBooleanCheck("value", ctx);

      // Boolean coercion never fails, so no try/catch or error messages
      expect(result.code).not.toContain("try");
      expect(result.code).not.toContain("catch");
    });
  });

  describe("generateCoerceDateCheck", () => {
    it("should generate code that returns true for valid Dates", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceDateCheck("value", ctx);

      expect(result.code).toContain("value instanceof Date");
      expect(result.code).toContain("value.getTime()");
      expect(result.code).toContain("return true");
    });

    it("should generate code that handles null specially", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceDateCheck("value", ctx);

      expect(result.code).toContain("value === null");
      expect(result.code).toContain("Cannot convert null to Date");
    });

    it("should generate code that handles undefined specially", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceDateCheck("value", ctx);

      expect(result.code).toContain("value === undefined");
      expect(result.code).toContain("Cannot convert undefined to Date");
    });

    it("should generate code that handles number coercion", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceDateCheck("value", ctx);

      expect(result.code).toContain('typeof value === "number"');
      expect(result.code).toContain("new Date(value)");
    });

    it("should generate code that handles string coercion", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceDateCheck("value", ctx);

      expect(result.code).toContain('typeof value === "string"');
    });

    it("should generate code that handles boolean coercion", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceDateCheck("value", ctx);

      expect(result.code).toContain('typeof value === "boolean"');
      expect(result.code).toContain("value ? 1 : 0");
    });

    it("should generate code that validates the resulting Date", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceDateCheck("value", ctx);

      expect(result.code).toContain("coerced_date.getTime()");
      expect(result.code).toContain("Invalid date");
    });

    it("should use custom error message when provided", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceDateCheck("value", ctx, "Custom date error");

      expect(result.code).toContain("Custom date error");
    });
  });

  describe("validation generators", () => {
    it("generateCoerceStringValidation should return code array", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceStringValidation("value", ctx);

      expect(Array.isArray(result.code)).toBe(true);
      expect(result.code.length).toBeGreaterThan(0);
    });

    it("generateCoerceNumberValidation should return code array", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceNumberValidation("value", ctx);

      expect(Array.isArray(result.code)).toBe(true);
      expect(result.code.length).toBeGreaterThan(0);
    });

    it("generateCoerceBooleanValidation should return code array", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceBooleanValidation("value", ctx);

      expect(Array.isArray(result.code)).toBe(true);
      expect(result.code.length).toBeGreaterThan(0);
    });

    it("generateCoerceDateValidation should return code array", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceDateValidation("value", ctx);

      expect(Array.isArray(result.code)).toBe(true);
      expect(result.code.length).toBeGreaterThan(0);
    });
  });

  describe("isCoerceType", () => {
    it("should return true for coerce types", () => {
      expect(isCoerceType("coerce_string")).toBe(true);
      expect(isCoerceType("coerce_number")).toBe(true);
      expect(isCoerceType("coerce_boolean")).toBe(true);
      expect(isCoerceType("coerce_date")).toBe(true);
    });

    it("should return false for non-coerce types", () => {
      expect(isCoerceType("string")).toBe(false);
      expect(isCoerceType("number")).toBe(false);
      expect(isCoerceType("boolean")).toBe(false);
      expect(isCoerceType("date")).toBe(false);
      expect(isCoerceType("object")).toBe(false);
    });
  });

  describe("debug mode", () => {
    it("should include indentation in debug mode", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = { ...ctx, indent: 2 };
      const result = generateCoerceStringCheck("value", ctx);

      expect(result.code).toMatch(/^\s{4}/); // 2 levels * 2 spaces
    });

    it("should not include indentation in non-debug mode", () => {
      const ctx = createGeneratorContext({ debug: false });
      const result = generateCoerceStringCheck("value", ctx);

      expect(result.code).not.toMatch(/^\s+if/);
    });

    it("[🎯] generateCoerceNumberCheck includes path and indentation in debug mode", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = { ...ctx, path: ["user", "age"], indent: 1 };
      const result = generateCoerceNumberCheck("value", ctx);
      expect(result.code).toContain("Property 'user.age'");
      expect(result.code).toMatch(/^\s{2}if/);
    });

    it("[🎯] generateCoerceBooleanCheck includes indentation in debug mode", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = { ...ctx, indent: 1 };
      const result = generateCoerceBooleanCheck("value", ctx);
      expect(result.code).toMatch(/^\s{2}if/);
    });

    it("[🎯] generateCoerceDateCheck includes path and indentation in debug mode", () => {
      let ctx = createGeneratorContext({ debug: true });
      ctx = { ...ctx, path: ["event", "date"], indent: 1 };
      const result = generateCoerceDateCheck("value", ctx);
      expect(result.code).toContain("Property 'event.date'");
      expect(result.code).toMatch(/^\s{2}if/);
    });
  });

  describe("generated code execution", () => {
    describe("coerce.string", () => {
      it("should return true for string input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceStringCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn("hello")).toBe(true);
      });

      it("should return coerced result for number input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceStringCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn(123)).toEqual({ coerced: "123" });
      });

      it("should return coerced result for boolean input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceStringCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn(true)).toEqual({ coerced: "true" });
        expect(fn(false)).toEqual({ coerced: "false" });
      });

      it("should return coerced result for null input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceStringCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn(null)).toEqual({ coerced: "null" });
      });
    });

    describe("coerce.number", () => {
      it("should return true for valid number input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceNumberCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn(42)).toBe(true);
        expect(fn(3.14)).toBe(true);
        expect(fn(-10)).toBe(true);
      });

      it("should return coerced result for numeric string input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceNumberCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn("42")).toEqual({ coerced: 42 });
        expect(fn("3.14")).toEqual({ coerced: 3.14 });
      });

      it("should return coerced result for boolean input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceNumberCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn(true)).toEqual({ coerced: 1 });
        expect(fn(false)).toEqual({ coerced: 0 });
      });

      it("should return coerced result for empty string input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceNumberCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn("")).toEqual({ coerced: 0 });
      });

      it("should return error for non-numeric string input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceNumberCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn("hello")).toBe("Cannot coerce to number");
      });
    });

    describe("coerce.boolean", () => {
      it("should return true for boolean input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceBooleanCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn(true)).toBe(true);
        expect(fn(false)).toBe(true);
      });

      it("should return coerced result for truthy values", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceBooleanCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn(1)).toEqual({ coerced: true });
        expect(fn("hello")).toEqual({ coerced: true });
        expect(fn([])).toEqual({ coerced: true });
        expect(fn({})).toEqual({ coerced: true });
      });

      it("should return coerced result for falsy values", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceBooleanCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn(0)).toEqual({ coerced: false });
        expect(fn("")).toEqual({ coerced: false });
        expect(fn(null)).toEqual({ coerced: false });
        expect(fn(undefined)).toEqual({ coerced: false });
      });
    });

    describe("coerce.date", () => {
      it("should return true for valid Date input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceDateCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn(new Date())).toBe(true);
        expect(fn(new Date("2024-01-01"))).toBe(true);
      });

      it("should return coerced result for timestamp input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceDateCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        const timestamp = Date.now();
        const coerced = fn(timestamp);
        expect(coerced).toHaveProperty("coerced");
        expect(coerced.coerced instanceof Date).toBe(true);
        expect(coerced.coerced.getTime()).toBe(timestamp);
      });

      it("should return coerced result for date string input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceDateCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        const coerced = fn("2024-01-01");
        expect(coerced).toHaveProperty("coerced");
        expect(coerced.coerced instanceof Date).toBe(true);
      });

      it("should return error for null input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceDateCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn(null)).toBe("Cannot convert null to Date");
      });

      it("should return error for undefined input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceDateCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn(undefined)).toBe("Cannot convert undefined to Date");
      });

      it("should return error for invalid date string", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceDateCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        expect(fn("not-a-date")).toBe("Invalid date");
      });

      it("should return coerced result for boolean input", () => {
        const ctx = createGeneratorContext();
        const result = generateCoerceDateCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const fn = new Function("value", result.code);

        const coercedTrue = fn(true);
        expect(coercedTrue).toHaveProperty("coerced");
        expect(coercedTrue.coerced.getTime()).toBe(1);

        const coercedFalse = fn(false);
        expect(coercedFalse).toHaveProperty("coerced");
        expect(coercedFalse.coerced.getTime()).toBe(0);
      });
    });
  });
});


// ============================================================================
// Property-Based Tests
// Feature: kanon-jit-optimization
// Property 6: Coercion Round-trip
// Validates: Requirements 5.4, 5.5
// ============================================================================

describe("[🎲] Property 6: Coercion Round-trip", () => {
  // ============================================================================
  // Property 6.1: coerce.string round-trip equivalence
  // Validates: Requirement 5.4
  // ============================================================================
  describe("Requirement 5.4: Successful coercion returns { coerced: transformedValue }", () => {
    itProp.prop([fc.string()])(
      "[🎲] coerce.string: JIT returns same result as non-compiled for string input",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceStringCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const schema = coerceString();
        const nonCompiledResult = schema.validator(value);
        const jitResult = jitFn(value);

        // Both should return true for string input (already a string)
        expect(jitResult).toEqual(nonCompiledResult);
      }
    );

    itProp.prop([fc.integer()])(
      "[🎲] coerce.string: JIT returns same coerced value as non-compiled for number input",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceStringCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const schema = coerceString();
        const nonCompiledResult = schema.validator(value);
        const jitResult = jitFn(value);

        // Both should return { coerced: "number" }
        expect(jitResult).toEqual(nonCompiledResult);
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] coerce.string: JIT returns same coerced value as non-compiled for boolean input",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceStringCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const schema = coerceString();
        const nonCompiledResult = schema.validator(value);
        const jitResult = jitFn(value);

        expect(jitResult).toEqual(nonCompiledResult);
      }
    );

    itProp.prop([fc.integer({ min: -1000000, max: 1000000 })])(
      "[🎲] coerce.number: JIT returns same result as non-compiled for valid number input",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceNumberCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const schema = coerceNumber();
        const nonCompiledResult = schema.validator(value);
        const jitResult = jitFn(value);

        // Both should return true for valid number input
        expect(jitResult).toEqual(nonCompiledResult);
      }
    );

    itProp.prop([fc.stringMatching(/^-?\d+(\.\d+)?$/)])(
      "[🎲] coerce.number: JIT returns same coerced value as non-compiled for numeric string input",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceNumberCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const schema = coerceNumber();
        const nonCompiledResult = schema.validator(value);
        const jitResult = jitFn(value);

        // Both should return { coerced: number }
        expect(jitResult).toEqual(nonCompiledResult);
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] coerce.number: JIT returns same coerced value as non-compiled for boolean input",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceNumberCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const schema = coerceNumber();
        const nonCompiledResult = schema.validator(value);
        const jitResult = jitFn(value);

        // Both should return { coerced: 0 or 1 }
        expect(jitResult).toEqual(nonCompiledResult);
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] coerce.boolean: JIT returns same result as non-compiled for boolean input",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceBooleanCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const schema = coerceBoolean();
        const nonCompiledResult = schema.validator(value);
        const jitResult = jitFn(value);

        // Both should return true for boolean input
        expect(jitResult).toEqual(nonCompiledResult);
      }
    );

    itProp.prop([fc.oneof(fc.integer(), fc.string(), fc.constant(null), fc.constant(undefined))])(
      "[🎲] coerce.boolean: JIT returns same coerced value as non-compiled for any input",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceBooleanCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const schema = coerceBoolean();
        const nonCompiledResult = schema.validator(value);
        const jitResult = jitFn(value);

        // Boolean coercion never fails
        expect(jitResult).toEqual(nonCompiledResult);
      }
    );

    itProp.prop([fc.integer({ min: 0, max: 2000000000000 })])(
      "[🎲] coerce.date: JIT returns same coerced value as non-compiled for timestamp input",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceDateCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const schema = coerceDate();
        const nonCompiledResult = schema.validator(value);
        const jitResult = jitFn(value);

        // Both should return { coerced: Date }
        if (typeof nonCompiledResult === "object" && "coerced" in nonCompiledResult) {
          expect(jitResult).toHaveProperty("coerced");
          expect((jitResult as { coerced: Date }).coerced.getTime()).toBe(
            nonCompiledResult.coerced.getTime()
          );
        } else {
          expect(jitResult).toEqual(nonCompiledResult);
        }
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] coerce.date: JIT returns same coerced value as non-compiled for boolean input",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceDateCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const schema = coerceDate();
        const nonCompiledResult = schema.validator(value);
        const jitResult = jitFn(value);

        // Both should return { coerced: Date(0) or Date(1) }
        if (typeof nonCompiledResult === "object" && "coerced" in nonCompiledResult) {
          expect(jitResult).toHaveProperty("coerced");
          expect((jitResult as { coerced: Date }).coerced.getTime()).toBe(
            nonCompiledResult.coerced.getTime()
          );
        } else {
          expect(jitResult).toEqual(nonCompiledResult);
        }
      }
    );
  });

  // ============================================================================
  // Property 6.2: Failed coercion returns error message
  // Validates: Requirement 5.5
  // ============================================================================
  describe("Requirement 5.5: Failed coercion returns error message", () => {
    itProp.prop([fc.string().filter((s) => Number.isNaN(Number(s)) && s !== "")])(
      "[🎲] coerce.number: JIT returns error string for non-numeric string input",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceNumberCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const schema = coerceNumber();
        const nonCompiledResult = schema.validator(value);
        const jitResult = jitFn(value);

        // Both should return error string
        expect(typeof jitResult).toBe("string");
        expect(typeof nonCompiledResult).toBe("string");
      }
    );

    it("[🎲] coerce.date: JIT returns error string for null input", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceDateCheck("value", ctx);
      // eslint-disable-next-line no-new-func
      const jitFn = new Function("value", result.code);

      const schema = coerceDate();
      const nonCompiledResult = schema.validator(null);
      const jitResult = jitFn(null);

      // Both should return error string
      expect(typeof jitResult).toBe("string");
      expect(typeof nonCompiledResult).toBe("string");
    });

    it("[🎲] coerce.date: JIT returns error string for undefined input", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceDateCheck("value", ctx);
      // eslint-disable-next-line no-new-func
      const jitFn = new Function("value", result.code);

      const schema = coerceDate();
      const nonCompiledResult = schema.validator(undefined);
      const jitResult = jitFn(undefined);

      // Both should return error string
      expect(typeof jitResult).toBe("string");
      expect(typeof nonCompiledResult).toBe("string");
    });

    itProp.prop([fc.string().filter((s) => Number.isNaN(new Date(s).getTime()))])(
      "[🎲] coerce.date: JIT returns error string for invalid date string input",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceDateCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const schema = coerceDate();
        const nonCompiledResult = schema.validator(value);
        const jitResult = jitFn(value);

        // Both should return error string
        expect(typeof jitResult).toBe("string");
        expect(typeof nonCompiledResult).toBe("string");
      }
    );
  });

  // ============================================================================
  // Property 6.3: Coercion preserves value semantics
  // Validates: Requirements 5.4, 5.5
  // ============================================================================
  describe("Coercion preserves value semantics", () => {
    itProp.prop([fc.oneof(fc.integer(), fc.double({ noNaN: true }), fc.boolean(), fc.constant(null), fc.constant(undefined))])(
      "[🎲] coerce.string: coerced value equals String(input)",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceStringCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const jitResult = jitFn(value);

        if (typeof value === "string") {
          expect(jitResult).toBe(true);
        } else {
          expect(jitResult).toEqual({ coerced: String(value) });
        }
      }
    );

    itProp.prop([fc.boolean()])(
      "[🎲] coerce.number: boolean coerces to 0 or 1",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceNumberCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const jitResult = jitFn(value);

        expect(jitResult).toEqual({ coerced: value ? 1 : 0 });
      }
    );

    it("[🎲] coerce.number: empty string coerces to 0", () => {
      const ctx = createGeneratorContext();
      const result = generateCoerceNumberCheck("value", ctx);
      // eslint-disable-next-line no-new-func
      const jitFn = new Function("value", result.code);

      const jitResult = jitFn("");

      expect(jitResult).toEqual({ coerced: 0 });
    });

    itProp.prop([fc.oneof(fc.integer(), fc.string(), fc.constant(null), fc.constant(undefined), fc.array(fc.integer()))])(
      "[🎲] coerce.boolean: coerced value equals Boolean(input)",
      (value) => {
        const ctx = createGeneratorContext();
        const result = generateCoerceBooleanCheck("value", ctx);
        // eslint-disable-next-line no-new-func
        const jitFn = new Function("value", result.code);

        const jitResult = jitFn(value);

        if (typeof value === "boolean") {
          expect(jitResult).toBe(true);
        } else {
          expect(jitResult).toEqual({ coerced: Boolean(value) });
        }
      }
    );
  });
});


describe("[👾] Mutation: coerce code generation", () => {
  it("[👾] coerce.string errorPrefix is empty when no path", () => {
    const ctx = createGeneratorContext();
    const result = generateCoerceStringCheck("value", ctx);
    // If errorPrefix is "Stryker was here!" instead of "", the error message would be wrong
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", result.code);
    const errorResult = fn({ toString() { throw new Error("broken"); } });
    expect(typeof errorResult).toBe("string");
    expect(errorResult).not.toContain("Stryker");
    expect(errorResult).toBe("Cannot coerce to string");
  });

  it("[👾] coerce.string code lines are joined with newline", () => {
    const ctx = createGeneratorContext();
    const result = generateCoerceStringCheck("value", ctx);
    expect(result.code).toContain("\n");
  });

  it("[👾] coerce.number declares coerced_num variable", () => {
    const ctx = createGeneratorContext();
    const result = generateCoerceNumberCheck("value", ctx);
    expect(result.code).toContain("var coerced_num");
  });

  it("[👾] coerce.number code lines are joined with newline", () => {
    const ctx = createGeneratorContext();
    const result = generateCoerceNumberCheck("value", ctx);
    expect(result.code).toContain("\n");
  });

  it("[👾] coerce.boolean code lines are joined with newline", () => {
    const ctx = createGeneratorContext();
    const result = generateCoerceBooleanCheck("value", ctx);
    expect(result.code).toContain("\n");
  });

  it("[👾] coerce.date declares coerced_date variable", () => {
    const ctx = createGeneratorContext();
    const result = generateCoerceDateCheck("value", ctx);
    expect(result.code).toContain("var coerced_date");
  });

  it("[👾] coerce.date handles object input via String fallback", () => {
    const ctx = createGeneratorContext();
    const result = generateCoerceDateCheck("value", ctx);
    // eslint-disable-next-line no-new-func
    const fn = new Function("value", result.code);
    // Without the else branch, passing an object would throw because coerced_date is undefined
    const errorResult = fn({});
    expect(typeof errorResult).toBe("string");
  });

  it("[👾] coerce.date code lines are joined with newline", () => {
    const ctx = createGeneratorContext();
    const result = generateCoerceDateCheck("value", ctx);
    expect(result.code).toContain("\n");
  });
});
