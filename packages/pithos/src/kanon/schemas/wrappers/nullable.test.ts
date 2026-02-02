import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { nullable } from "./nullable";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { boolean } from "../primitives/boolean";
import { array } from "../composites/array";
import { object } from "../composites/object";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";
import { coerceNumber } from "../coerce/number";

describe("nullable", () => {
  describe("validation", () => {
    it("should accept valid value", () => {
      const schema = nullable(string());

      expect(parse(schema, "test").success).toBe(true);
      expect(parse(schema, "another").success).toBe(true);
    });

    it("should return exactly true for valid values (not error message)", () => {
      const schema = nullable(string());

      // Must return exactly true, not a string error
      expect(schema.validator("valid")).toBe(true);
      expect(schema.validator(null)).toBe(true);
    });

    it("should accept null", () => {
      const schema = nullable(string());

      expect(parse(schema, null).success).toBe(true);
    });

    it("should reject invalid value", () => {
      const schema = nullable(string());

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
      }
    });

    it("should reject undefined", () => {
      const schema = nullable(string());

      const result = parse(schema, undefined);
      expect(result.success).toBe(false);
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Custom error";
      const schema = nullable(string(), customMessage);

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should work with number schema", () => {
      const schema = nullable(number());

      expect(parse(schema, 42).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
      expect(parse(schema, "42").success).toBe(false);
    });

    it("should work with boolean schema", () => {
      const schema = nullable(boolean());

      expect(parse(schema, true).success).toBe(true);
      expect(parse(schema, false).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
      expect(parse(schema, "true").success).toBe(false);
    });

    it("should work with array schema", () => {
      const schema = nullable(array(string()));

      expect(parse(schema, ["a", "b"]).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
      expect(parse(schema, "not array").success).toBe(false);
    });

    it("should work with object schema", () => {
      const schema = nullable(object({ name: string() }));

      expect(parse(schema, { name: "John" }).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
      expect(parse(schema, "not object").success).toBe(false);
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = nullable(string());

      const result1 = parse(schema, "test");
      expect(result1.success).toBe(true);
      if (result1.success) {
        expect(typeof result1.data).toBe("string");
        expect(result1.data).toBe("test");
      }

      const result2 = parse(schema, null);
      expect(result2.success).toBe(true);
      if (result2.success) {
        expect(result2.data).toBe(null);
      }
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      const schema = nullable(string());

      expect(parse(schema, "").success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
    });

    it("should handle zero", () => {
      const schema = nullable(number());

      expect(parse(schema, 0).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
    });

    it("should handle false", () => {
      const schema = nullable(boolean());

      expect(parse(schema, false).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
    });

    it("should handle empty array", () => {
      const schema = nullable(array(string()));

      expect(parse(schema, []).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
    });

    it("should handle empty object", () => {
      const schema = nullable(object({}));

      expect(parse(schema, {}).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
    });

    it("should distinguish null from undefined", () => {
      const schema = nullable(string());

      expect(parse(schema, null).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("null vs undefined handling", () => {
      it("[🎯] should accept null but reject undefined (Requirement 9.2)", () => {
        const schema = nullable(string());

        // null should be accepted
        const nullResult = parse(schema, null);
        expect(nullResult.success).toBe(true);
        if (nullResult.success) {
          expect(nullResult.data).toBe(null);
        }

        // undefined should be rejected
        const undefinedResult = parse(schema, undefined);
        expect(undefinedResult.success).toBe(false);
      });

      it("[🎯] should accept null with number schema", () => {
        const schema = nullable(number());

        expect(parse(schema, null).success).toBe(true);
        expect(parse(schema, undefined).success).toBe(false);
      });

      it("[🎯] should accept null with boolean schema", () => {
        const schema = nullable(boolean());

        expect(parse(schema, null).success).toBe(true);
        expect(parse(schema, undefined).success).toBe(false);
      });

      it("[🎯] should accept null with array schema", () => {
        const schema = nullable(array(string()));

        expect(parse(schema, null).success).toBe(true);
        expect(parse(schema, undefined).success).toBe(false);
      });

      it("[🎯] should accept null with object schema", () => {
        const schema = nullable(object({ name: string() }));

        expect(parse(schema, null).success).toBe(true);
        expect(parse(schema, undefined).success).toBe(false);
      });
    });

    describe("coercion propagation", () => {
      it("[🎯] should propagate coerced values from inner schema", () => {
        const schema = nullable(coerceNumber());

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

        // null should still be accepted
        const nullResult = parse(schema, null);
        expect(nullResult.success).toBe(true);
        if (nullResult.success) {
          expect(nullResult.data).toBe(null);
        }
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    describe("string schema", () => {
      itProp.prop([fc.string()])("[🎲] should accept any string", (value) => {
        const schema = nullable(string());
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      });

      itProp.prop([fc.constant(null)])("[🎲] should accept null", (value) => {
        const schema = nullable(string());
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(null);
        }
      });

      itProp.prop([
        fc.oneof(fc.integer(), fc.boolean(), fc.constant(undefined)),
      ])("[🎲] should reject non-string, non-null values", (value) => {
        const schema = nullable(string());
        expect(parse(schema, value).success).toBe(false);
      });
    });

    describe("number schema", () => {
      itProp.prop([fc.double({ noNaN: true })])(
        "[🎲] should accept any number",
        (value) => {
          const schema = nullable(number());
          const result = parse(schema, value);
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data).toBe(value);
          }
        }
      );

      itProp.prop([fc.oneof(fc.constant(null), fc.double({ noNaN: true }))])(
        "[🎲] should accept null or valid number",
        (value) => {
          const schema = nullable(number());
          expect(parse(schema, value).success).toBe(true);
        }
      );
    });

    describe("array schema", () => {
      itProp.prop([fc.array(fc.string())])(
        "[🎲] should accept any string array",
        (value) => {
          const schema = nullable(array(string()));
          const result = parse(schema, value);
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data).toEqual(value);
          }
        }
      );

      itProp.prop([fc.constant(null)])(
        "[🎲] should accept null for array schema",
        (value) => {
          const schema = nullable(array(string()));
          const result = parse(schema, value);
          expect(result.success).toBe(true);
        }
      );
    });

    describe("object schema", () => {
      itProp.prop([fc.record({ name: fc.string(), age: fc.integer() })])(
        "[🎲] should accept valid objects",
        (value) => {
          const schema = nullable(object({ name: string(), age: number() }));
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
