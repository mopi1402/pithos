import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { optional } from "./optional";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { boolean } from "../primitives/boolean";
import { array } from "../composites/array";
import { object } from "../composites/object";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";
import { refineString } from "../constraints/refine/string";
import { coerceNumber } from "../coerce/number";

describe("optional", () => {
  describe("validation", () => {
    it("should accept valid value", () => {
      const schema = optional(string());

      expect(parse(schema, "test").success).toBe(true);
      expect(parse(schema, "another").success).toBe(true);
    });

    it("should accept undefined", () => {
      const schema = optional(string());

      expect(parse(schema, undefined).success).toBe(true);
    });

    it("should reject invalid value", () => {
      const schema = optional(string());

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
      }
    });

    it("should reject null", () => {
      const schema = optional(string());

      const result = parse(schema, null);
      expect(result.success).toBe(false);
    });

    it("should work with number schema", () => {
      const schema = optional(number());

      expect(parse(schema, 42).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, "42").success).toBe(false);
    });

    it("should work with boolean schema", () => {
      const schema = optional(boolean());

      expect(parse(schema, true).success).toBe(true);
      expect(parse(schema, false).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, "true").success).toBe(false);
    });

    it("should work with array schema", () => {
      const schema = optional(array(string()));

      expect(parse(schema, ["a", "b"]).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, "not array").success).toBe(false);
    });

    it("should work with object schema", () => {
      const schema = optional(object({ name: string() }));

      expect(parse(schema, { name: "John" }).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, "not object").success).toBe(false);
    });

    it("should preserve schema message", () => {
      const customMessage = "Custom error";
      const baseSchema = string(customMessage);
      const schema = optional(baseSchema);

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should have optional type and preserve inner schema", () => {
      const schema = optional(string());

      expect(schema.type).toBe("optional");
      expect(schema.innerSchema.type).toBe("string");
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = optional(string());

      const result1 = parse(schema, "test");
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(typeof result1.data).toBe("string");
        expect(result1.data).toBe("test");
      }

      const result2 = parse(schema, undefined);
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(result2.data).toBe(undefined);
      }
    });
  });

  describe("refinements", () => {
    it("should preserve refinements and handle undefined", () => {
      const baseSchema = refineString(string(), (value: string) => {
        if (value.length > 5) return true;
        return "Too short";
      });

      const schema = optional(baseSchema);

      expect(parse(schema, "long string").success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, "short").success).toBe(false);
    });

    it("should apply refinements only when value is not undefined", () => {
      let refinementCalled = false;
      const baseSchema = refineString(string(), () => {
        refinementCalled = true;
        return true;
      });

      const schema = optional(baseSchema);

      parse(schema, undefined);
      expect(refinementCalled).toBe(false);

      parse(schema, "test");
      expect(refinementCalled).toBe(true);
    });

    it("should return true in refinement when value is undefined", () => {
      const baseSchema = refineString(string(), (value: string) => {
        if (value.length > 5) return true;
        return "Too short";
      });

      const schema = optional(baseSchema);

      // Directly test the refinement mapping for undefined
      if (schema.refinements && schema.refinements.length > 0) {
        const refinement = schema.refinements[0];
        const result = refinement(undefined);
        expect(result).toBe(true);
      }
    });

    it("should call original refinement when value is not undefined", () => {
      let originalRefinementCalled = false;
      const baseSchema = refineString(string(), (value: string) => {
        originalRefinementCalled = true;
        if (value.length > 5) return true;
        return "Too short";
      });

      const schema = optional(baseSchema);

      // Directly test the refinement mapping for a valid value
      if (schema.refinements && schema.refinements.length > 0) {
        const refinement = schema.refinements[0];
        const result = refinement("long string");
        expect(result).toBe(true);
        expect(originalRefinementCalled).toBe(true);
      }
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      const schema = optional(string());

      expect(parse(schema, "").success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
    });

    it("should handle zero", () => {
      const schema = optional(number());

      expect(parse(schema, 0).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
    });

    it("should handle false", () => {
      const schema = optional(boolean());

      expect(parse(schema, false).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
    });

    it("should handle empty array", () => {
      const schema = optional(array(string()));

      expect(parse(schema, []).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
    });

    it("should handle empty object", () => {
      const schema = optional(object({}));

      expect(parse(schema, {}).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
    });

    it("should distinguish undefined from null", () => {
      const schema = optional(string());

      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, null).success).toBe(false);
    });

    it("should work with schema without refinements", () => {
      const schema = optional(string());

      expect(parse(schema, "test").success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("undefined vs null handling", () => {
      it("[🎯] should accept undefined but reject null (Requirement 9.1)", () => {
        const schema = optional(string());

        // undefined should be accepted
        const undefinedResult = parse(schema, undefined);
        expect(undefinedResult.success).toBe(true);
        if (undefinedResult.success) {
          expect(undefinedResult.data).toBe(undefined);
        }

        // null should be rejected
        const nullResult = parse(schema, null);
        expect(nullResult.success).toBe(false);
      });

      it("[🎯] should accept undefined with number schema", () => {
        const schema = optional(number());

        expect(parse(schema, undefined).success).toBe(true);
        expect(parse(schema, null).success).toBe(false);
      });

      it("[🎯] should accept undefined with boolean schema", () => {
        const schema = optional(boolean());

        expect(parse(schema, undefined).success).toBe(true);
        expect(parse(schema, null).success).toBe(false);
      });

      it("[🎯] should accept undefined with array schema", () => {
        const schema = optional(array(string()));

        expect(parse(schema, undefined).success).toBe(true);
        expect(parse(schema, null).success).toBe(false);
      });

      it("[🎯] should accept undefined with object schema", () => {
        const schema = optional(object({ name: string() }));

        expect(parse(schema, undefined).success).toBe(true);
        expect(parse(schema, null).success).toBe(false);
      });
    });

    describe("coercion propagation", () => {
      it("[🎯] should propagate coerced values from inner schema", () => {
        const schema = optional(coerceNumber());

        // Valid number - no coercion needed
        const numResult = parse(schema, 42);
        expect(numResult.success).toBe(true);
        if (numResult.success) {
          expect(numResult.data).toBe(42);
        }

        // String to number coercion
        const strResult = parse(schema, "123");
        expect(strResult.success).toBe(true);
        if (strResult.success) {
          expect(strResult.data).toBe(123);
        }

        // undefined should still be accepted
        const undefinedResult = parse(schema, undefined);
        expect(undefinedResult.success).toBe(true);
        if (undefinedResult.success) {
          expect(undefinedResult.data).toBe(undefined);
        }
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    describe("string schema", () => {
      itProp.prop([fc.string()])("[🎲] should accept any string", (value) => {
        const schema = optional(string());
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      });

      itProp.prop([fc.constant(undefined)])("[🎲] should accept undefined", (value) => {
        const schema = optional(string());
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(undefined);
        }
      });

      itProp.prop([fc.oneof(fc.integer(), fc.boolean(), fc.constant(null))])(
        "[🎲] should reject non-string, non-undefined values",
        (value) => {
          const schema = optional(string());
          expect(parse(schema, value).success).toBe(false);
        }
      );
    });

    describe("number schema", () => {
      itProp.prop([fc.double({ noNaN: true })])("[🎲] should accept any number", (value) => {
        const schema = optional(number());
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      });

      itProp.prop([fc.oneof(fc.constant(undefined), fc.double({ noNaN: true }))])(
        "[🎲] should accept undefined or valid number",
        (value) => {
          const schema = optional(number());
          expect(parse(schema, value).success).toBe(true);
        }
      );
    });

    describe("array schema", () => {
      itProp.prop([fc.array(fc.string())])("[🎲] should accept any string array", (value) => {
        const schema = optional(array(string()));
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(value);
        }
      });

      itProp.prop([fc.constant(undefined)])("[🎲] should accept undefined for array schema", (value) => {
        const schema = optional(array(string()));
        const result = parse(schema, value);
        expect(result.success).toBe(true);
      });
    });

    describe("object schema", () => {
      itProp.prop([fc.record({ name: fc.string(), age: fc.integer() })])(
        "[🎲] should accept valid objects",
        (value) => {
          const schema = optional(object({ name: string(), age: number() }));
          const result = parse(schema, value);
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data).toEqual(value);
          }
        }
      );
    });
  });
});
