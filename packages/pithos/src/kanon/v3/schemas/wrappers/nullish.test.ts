import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { nullish } from "./nullish";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { boolean } from "../primitives/boolean";
import { array } from "../composites/array";
import { object } from "../composites/object";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";
import { coerceNumber } from "../coerce/number";

describe("nullish", () => {
  describe("validation", () => {
    it("should accept valid value", () => {
      const schema = nullish(string());

      expect(parse(schema, "test").success).toBe(true);
      expect(parse(schema, "another").success).toBe(true);
    });

    it("should accept undefined", () => {
      const schema = nullish(string());

      expect(parse(schema, undefined).success).toBe(true);
    });

    it("should accept null", () => {
      const schema = nullish(string());

      expect(parse(schema, null).success).toBe(true);
    });

    it("should reject invalid value", () => {
      const schema = nullish(string());

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
      }
    });

    it("should work with number schema", () => {
      const schema = nullish(number());

      expect(parse(schema, 42).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
      expect(parse(schema, "42").success).toBe(false);
    });

    it("should work with boolean schema", () => {
      const schema = nullish(boolean());

      expect(parse(schema, true).success).toBe(true);
      expect(parse(schema, false).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
      expect(parse(schema, "true").success).toBe(false);
    });

    it("should work with array schema", () => {
      const schema = nullish(array(string()));

      expect(parse(schema, ["a", "b"]).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
      expect(parse(schema, "not array").success).toBe(false);
    });

    it("should work with object schema", () => {
      const schema = nullish(object({ name: string() }));

      expect(parse(schema, { name: "John" }).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
      expect(parse(schema, "not object").success).toBe(false);
    });

    it("should use custom message when provided", () => {
      const customMessage = "Custom nullish error";
      const schema = nullish(string(), customMessage);

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should have nullish type and preserve inner schema", () => {
      const schema = nullish(string());

      expect(schema.type).toBe("nullish");
      expect(schema.innerSchema.type).toBe("string");
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = nullish(string());

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

      const result3 = parse(schema, null);
      expect(result3.success).toBe(true);
      if (result3.success) {
        expect(result3.data).toBe(null);
      }
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      const schema = nullish(string());

      expect(parse(schema, "").success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
    });

    it("should handle zero", () => {
      const schema = nullish(number());

      expect(parse(schema, 0).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
    });

    it("should handle false", () => {
      const schema = nullish(boolean());

      expect(parse(schema, false).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
    });

    it("should handle empty array", () => {
      const schema = nullish(array(string()));

      expect(parse(schema, []).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
    });

    it("should handle empty object", () => {
      const schema = nullish(object({}));

      expect(parse(schema, {}).success).toBe(true);
      expect(parse(schema, undefined).success).toBe(true);
      expect(parse(schema, null).success).toBe(true);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("null and undefined handling", () => {
      it("[🎯] should accept null (Requirement 22.1)", () => {
        const schema = nullish(string());

        const nullResult = parse(schema, null);
        expect(nullResult.success).toBe(true);
        if (nullResult.success) {
          expect(nullResult.data).toBe(null);
        }
      });

      it("[🎯] should accept undefined (Requirement 22.2)", () => {
        const schema = nullish(string());

        const undefinedResult = parse(schema, undefined);
        expect(undefinedResult.success).toBe(true);
        if (undefinedResult.success) {
          expect(undefinedResult.data).toBe(undefined);
        }
      });

      it("[🎯] should accept both null and undefined (Requirement 9.3)", () => {
        const schema = nullish(string());

        // Both nullish values should be accepted
        expect(parse(schema, null).success).toBe(true);
        expect(parse(schema, undefined).success).toBe(true);

        // Valid value should also be accepted
        expect(parse(schema, "test").success).toBe(true);

        // Invalid value should be rejected
        expect(parse(schema, 123).success).toBe(false);
      });
    });

    describe("coercion propagation", () => {
      it("[🎯] should propagate coerced values from inner schema (Requirement 22.3)", () => {
        const schema = nullish(coerceNumber());

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

        // undefined should still be accepted
        const undefinedResult = parse(schema, undefined);
        expect(undefinedResult.success).toBe(true);
        if (undefinedResult.success) {
          expect(undefinedResult.data).toBe(undefined);
        }
      });
    });

    describe("delegation to inner schema", () => {
      it("[🎯] should delegate valid values to inner schema (Requirement 22.4)", () => {
        const schema = nullish(string());

        // Valid string should be delegated to inner schema
        const result = parse(schema, "test");
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe("test");
        }
      });

      it("[🎯] should return inner schema error or custom message for invalid values (Requirement 22.5)", () => {
        // Without custom message - should return inner schema error
        const schema1 = nullish(string());
        const result1 = parse(schema1, 123);
        expect(result1.success).toBe(false);
        if (!result1.success) {
          expect(result1.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
        }

        // With custom message - should return custom message
        const customMessage = "Custom nullish error";
        const schema2 = nullish(string(), customMessage);
        const result2 = parse(schema2, 123);
        expect(result2.success).toBe(false);
        if (!result2.success) {
          expect(result2.error).toBe(customMessage);
        }
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    describe("string schema", () => {
      itProp.prop([fc.string()])("[🎲] should accept any string", (value) => {
        const schema = nullish(string());
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      });

      itProp.prop([fc.oneof(fc.constant(null), fc.constant(undefined))])(
        "[🎲] should accept null or undefined",
        (value) => {
          const schema = nullish(string());
          const result = parse(schema, value);
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data).toBe(value);
          }
        }
      );

      itProp.prop([fc.oneof(fc.integer(), fc.boolean())])(
        "[🎲] should reject non-string, non-nullish values",
        (value) => {
          const schema = nullish(string());
          expect(parse(schema, value).success).toBe(false);
        }
      );
    });

    describe("number schema", () => {
      itProp.prop([fc.double({ noNaN: true })])("[🎲] should accept any number", (value) => {
        const schema = nullish(number());
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      });

      itProp.prop([fc.oneof(fc.constant(null), fc.constant(undefined), fc.double({ noNaN: true }))])(
        "[🎲] should accept nullish or valid number",
        (value) => {
          const schema = nullish(number());
          expect(parse(schema, value).success).toBe(true);
        }
      );
    });

    describe("array schema", () => {
      itProp.prop([fc.array(fc.string())])("[🎲] should accept any string array", (value) => {
        const schema = nullish(array(string()));
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(value);
        }
      });

      itProp.prop([fc.oneof(fc.constant(null), fc.constant(undefined))])(
        "[🎲] should accept nullish for array schema",
        (value) => {
          const schema = nullish(array(string()));
          const result = parse(schema, value);
          expect(result.success).toBe(true);
        }
      );
    });

    describe("object schema", () => {
      itProp.prop([fc.record({ name: fc.string(), age: fc.integer() })])(
        "[🎲] should accept valid objects",
        (value) => {
          const schema = nullish(object({ name: string(), age: number() }));
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
