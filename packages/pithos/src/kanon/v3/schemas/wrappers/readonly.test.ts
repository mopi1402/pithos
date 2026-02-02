import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { readonly } from "./readonly";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { boolean } from "../primitives/boolean";
import { array } from "../composites/array";
import { object } from "../composites/object";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";
import { coerceNumber } from "../coerce/number";
import { coerceString } from "../coerce/string";

describe("readonly", () => {
  describe("validation", () => {
    it("should accept valid value", () => {
      const schema = readonly(string());

      expect(parse(schema, "test").success).toBe(true);
      expect(parse(schema, "another").success).toBe(true);
    });

    it("should reject invalid value", () => {
      const schema = readonly(string());

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Custom error";
      const schema = readonly(string(), customMessage);

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should use base schema error message when custom message not provided", () => {
      const baseMessage = "Base error";
      const baseSchema = string(baseMessage);
      const schema = readonly(baseSchema);

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(baseMessage);
      }
    });

    it("should work with number schema", () => {
      const schema = readonly(number());

      expect(parse(schema, 42).success).toBe(true);
      expect(parse(schema, "42").success).toBe(false);
    });

    it("should work with boolean schema", () => {
      const schema = readonly(boolean());

      expect(parse(schema, true).success).toBe(true);
      expect(parse(schema, false).success).toBe(true);
      expect(parse(schema, "true").success).toBe(false);
    });

    it("should work with array schema", () => {
      const schema = readonly(array(string()));

      expect(parse(schema, ["a", "b"]).success).toBe(true);
      expect(parse(schema, "not array").success).toBe(false);
    });

    it("should work with object schema", () => {
      const schema = readonly(object({ name: string() }));

      expect(parse(schema, { name: "John" }).success).toBe(true);
      expect(parse(schema, "not object").success).toBe(false);
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = readonly(string());

      const result = parse(schema, "test");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data).toBe("string");
        expect(result.data).toBe("test");
      }
    });

    it("should have readonly type", () => {
      const schema = readonly(string());

      expect(schema.type).toBe("readonly");
    });
  });

  describe("edge cases", () => {
    it("should handle empty string", () => {
      const schema = readonly(string());

      expect(parse(schema, "").success).toBe(true);
    });

    it("should handle zero", () => {
      const schema = readonly(number());

      expect(parse(schema, 0).success).toBe(true);
    });

    it("should handle false", () => {
      const schema = readonly(boolean());

      expect(parse(schema, false).success).toBe(true);
    });

    it("should handle empty array", () => {
      const schema = readonly(array(string()));

      expect(parse(schema, []).success).toBe(true);
    });

    it("should handle empty object", () => {
      const schema = readonly(object({}));

      expect(parse(schema, {}).success).toBe(true);
    });

    it("should handle null", () => {
      const schema = readonly(string());

      expect(parse(schema, null).success).toBe(false);
    });

    it("should handle undefined", () => {
      const schema = readonly(string());

      expect(parse(schema, undefined).success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("identical validation", () => {
      it("[🎯] should validate identically to inner schema (Requirement 23.1)", () => {
        const innerSchema = string();
        const readonlySchema = readonly(innerSchema);

        // Valid string - both should accept
        expect(parse(innerSchema, "test").success).toBe(true);
        expect(parse(readonlySchema, "test").success).toBe(true);

        // Invalid value - both should reject
        expect(parse(innerSchema, 123).success).toBe(false);
        expect(parse(readonlySchema, 123).success).toBe(false);

        // Empty string - both should accept
        expect(parse(innerSchema, "").success).toBe(true);
        expect(parse(readonlySchema, "").success).toBe(true);
      });

      it("[🎯] should validate identically with number schema", () => {
        const innerSchema = number();
        const readonlySchema = readonly(innerSchema);

        // Valid number
        expect(parse(innerSchema, 42).success).toBe(true);
        expect(parse(readonlySchema, 42).success).toBe(true);

        // Zero
        expect(parse(innerSchema, 0).success).toBe(true);
        expect(parse(readonlySchema, 0).success).toBe(true);

        // Invalid value
        expect(parse(innerSchema, "42").success).toBe(false);
        expect(parse(readonlySchema, "42").success).toBe(false);
      });

      it("[🎯] should validate identically with array schema", () => {
        const innerSchema = array(string());
        const readonlySchema = readonly(innerSchema);

        // Valid array
        expect(parse(innerSchema, ["a", "b"]).success).toBe(true);
        expect(parse(readonlySchema, ["a", "b"]).success).toBe(true);

        // Empty array
        expect(parse(innerSchema, []).success).toBe(true);
        expect(parse(readonlySchema, []).success).toBe(true);

        // Invalid value
        expect(parse(innerSchema, "not array").success).toBe(false);
        expect(parse(readonlySchema, "not array").success).toBe(false);
      });

      it("[🎯] should validate identically with object schema", () => {
        const innerSchema = object({ name: string() });
        const readonlySchema = readonly(innerSchema);

        // Valid object
        expect(parse(innerSchema, { name: "John" }).success).toBe(true);
        expect(parse(readonlySchema, { name: "John" }).success).toBe(true);

        // Invalid value
        expect(parse(innerSchema, "not object").success).toBe(false);
        expect(parse(readonlySchema, "not object").success).toBe(false);
      });
    });

    describe("coercion propagation", () => {
      it("[🎯] should propagate coerced values from inner schema (Requirement 23.2)", () => {
        const schema = readonly(coerceNumber());

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
      });

      it("[🎯] should propagate coerced string values", () => {
        const schema = readonly(coerceString());

        // Number to string coercion
        const numResult = parse(schema, 42);
        expect(numResult.success).toBe(true);
        if (numResult.success) {
          expect(numResult.data).toBe("42");
        }

        // Boolean to string coercion
        const boolResult = parse(schema, true);
        expect(boolResult.success).toBe(true);
        if (boolResult.success) {
          expect(boolResult.data).toBe("true");
        }
      });
    });

    describe("error propagation", () => {
      it("[🎯] should return inner schema error when no custom message (Requirement 23.3)", () => {
        const schema = readonly(string());

        const result = parse(schema, 123);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
        }
      });

      it("[🎯] should return custom message when provided (Requirement 23.3)", () => {
        const customMessage = "Custom readonly error";
        const schema = readonly(string(), customMessage);

        const result = parse(schema, 123);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(customMessage);
        }
      });

      it("[🎯] should return inner schema custom message when no wrapper message", () => {
        const innerMessage = "Inner schema error";
        const innerSchema = string(innerMessage);
        const schema = readonly(innerSchema);

        const result = parse(schema, 123);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(innerMessage);
        }
      });

      it("[🎯] should prefer wrapper message over inner schema message", () => {
        const innerMessage = "Inner schema error";
        const wrapperMessage = "Wrapper error";
        const innerSchema = string(innerMessage);
        const schema = readonly(innerSchema, wrapperMessage);

        const result = parse(schema, 123);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBe(wrapperMessage);
        }
      });
    });
  });

  describe("[🎲] Property-Based Tests", () => {
    describe("string schema", () => {
      itProp.prop([fc.string()])("[🎲] should accept any string", (value) => {
        const schema = readonly(string());
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      });

      itProp.prop([fc.oneof(fc.integer(), fc.boolean(), fc.constant(null), fc.constant(undefined))])(
        "[🎲] should reject non-string values",
        (value) => {
          const schema = readonly(string());
          expect(parse(schema, value).success).toBe(false);
        }
      );
    });

    describe("number schema", () => {
      itProp.prop([fc.double({ noNaN: true })])("[🎲] should accept any number", (value) => {
        const schema = readonly(number());
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(value);
        }
      });

      itProp.prop([fc.oneof(fc.string(), fc.boolean())])(
        "[🎲] should reject non-number values",
        (value) => {
          const schema = readonly(number());
          expect(parse(schema, value).success).toBe(false);
        }
      );
    });

    describe("array schema", () => {
      itProp.prop([fc.array(fc.string())])("[🎲] should accept any string array", (value) => {
        const schema = readonly(array(string()));
        const result = parse(schema, value);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toEqual(value);
        }
      });
    });

    describe("object schema", () => {
      itProp.prop([fc.record({ name: fc.string(), age: fc.integer() })])(
        "[🎲] should accept valid objects",
        (value) => {
          const schema = readonly(object({ name: string(), age: number() }));
          const result = parse(schema, value);
          expect(result.success).toBe(true);
          if (result.success) {
            expect(result.data).toEqual(value);
          }
        }
      );
    });

    describe("identical validation to inner schema", () => {
      itProp.prop([fc.anything()])("[🎲] should validate identically to inner schema", (value) => {
        const innerSchema = string();
        const readonlySchema = readonly(innerSchema);
        
        const innerResult = parse(innerSchema, value);
        const readonlyResult = parse(readonlySchema, value);
        
        expect(readonlyResult.success).toBe(innerResult.success);
      });
    });
  });
});
