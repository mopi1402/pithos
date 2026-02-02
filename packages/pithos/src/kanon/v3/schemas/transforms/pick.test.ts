import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { pick } from "./pick";
import { object } from "../composites/object";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { boolean } from "../primitives/boolean";
import { coerceBoolean } from "../coerce/boolean";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";
import { cast } from "@arkhe/test/private-access";

describe("pick", () => {
  describe("validation", () => {
    it("should accept object with picked properties", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = pick(baseSchema, ["name", "age"]);

      expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
    });

    it("should reject object with missing picked properties", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = pick(baseSchema, ["name", "age"]);

      expect(parse(schema, { name: "John" }).success).toBe(false);
      expect(parse(schema, { age: 30 }).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
    });

    it("should accept object with extra properties", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = pick(baseSchema, ["name"]);

      expect(parse(schema, { name: "John", extra: "value" }).success).toBe(
        true
      );
    });

    it("should reject invalid property values", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = pick(baseSchema, ["name", "age"]);

      expect(parse(schema, { name: 123, age: 30 }).success).toBe(false);
      expect(parse(schema, { name: "John", age: "30" }).success).toBe(false);
    });

    it("should reject non-object values", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = pick(baseSchema, ["name"]);

      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, "string").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });

    it("should handle single property", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = pick(baseSchema, ["name"]);

      expect(parse(schema, { name: "John" }).success).toBe(true);
      expect(parse(schema, {}).success).toBe(false);
    });

    it("should handle multiple properties", () => {
      const baseSchema = object({
        a: string(),
        b: number(),
        c: boolean(),
        d: string(),
      });
      const schema = pick(baseSchema, ["a", "b", "c"]);

      expect(parse(schema, { a: "1", b: 2, c: true }).success).toBe(true);
      expect(parse(schema, { a: "1", b: 2 }).success).toBe(false);
    });

    it("should return correct error message for missing fields", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = pick(baseSchema, ["name", "age"]);

      const result = parse(schema, { name: "John" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("age");
        expect(result.error).toContain("Missing required field");
      }
    });

    it("should return correct error message for non-object values", () => {
      const baseSchema = object({
        name: string(),
      });
      const schema = pick(baseSchema, ["name"]);

      const result = parse(schema, "string");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.object);
      }
    });

    it("should return correct error message for invalid property values", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = pick(baseSchema, ["name", "age"]);

      const result = parse(schema, { name: 123, age: 30 });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("name");
        expect(result.error).toContain(ERROR_MESSAGES_COMPOSITION.string);
      }
    });

    it("should use custom error message when provided", () => {
      const baseSchema = object({
        name: string(),
      });
      const customMessage = "Must be an object";
      const schema = pick(baseSchema, ["name"], customMessage);

      const result = parse(schema, "string");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should return correct data type when validation succeeds", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = pick(baseSchema, ["name", "age"]);

      const result = parse(schema, { name: "John", age: 30 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name: "John", age: 30 });
      }
    });
  });

  describe("edge cases", () => {
    it("should handle empty keys array", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = pick(baseSchema, []);

      expect(parse(schema, {}).success).toBe(true);
      expect(parse(schema, { name: "John" }).success).toBe(true);
    });

    it("should handle all properties", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = pick(baseSchema, ["name", "age"]);

      expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
    });

    it("should handle nested validation errors", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = pick(baseSchema, ["name", "age"]);

      const result = parse(schema, { name: "John", age: "invalid" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("age");
      }
    });

    it("should handle arrays (reject them)", () => {
      const baseSchema = object({
        name: string(),
      });
      const schema = pick(baseSchema, ["name"]);

      expect(parse(schema, []).success).toBe(false);
      expect(parse(schema, [1, 2, 3]).success).toBe(false);
    });

    it("should handle null", () => {
      const baseSchema = object({
        name: string(),
      });
      const schema = pick(baseSchema, ["name"]);

      expect(parse(schema, null).success).toBe(false);
    });

    it("should handle object with entries property directly", () => {
      const entries = {
        name: string(),
        age: number(),
        active: boolean(),
      };
      const schema = pick(cast({ entries }), ["name", "age"]);

      expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
      expect(parse(schema, { name: "John" }).success).toBe(false);
    });

    it("should handle ObjectSchema with entries property", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = pick(baseSchema, ["name", "age"]);

      expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
      expect(parse(schema, { name: "John" }).success).toBe(false);
    });

    it("should handle coerced property values", () => {
      // Tests the branch where isCoerced(result) is true
      const baseSchema = object({
        name: string(),
        active: coerceBoolean(),
      });
      const schema = pick(baseSchema, ["name", "active"]);

      const result = parse(schema, { name: "John", active: 1 });
      expect(result.success).toBe(true);
    });

    it("should handle key not in entries (defensive branch)", () => {
      // Tests the branch where propertySchema is undefined
      // This can happen if entries doesn't have the key (defensive code)
      const entries = {
        name: string(),
      };
      // Force a key that doesn't exist in entries
      const schema = pick(cast({ entries }), cast(["name", "nonexistent"]));

      // The key "nonexistent" is in keys but not in entries
      // The validator should still pass if the value exists
      const result = parse(schema, { name: "John", nonexistent: "value" });
      expect(result.success).toBe(true);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("empty keys edge case", () => {
      it("[🎯] should accept any object when pick is called with empty keys array (Req 11.1)", () => {
        const baseSchema = object({
          name: string(),
          age: number(),
          active: boolean(),
        });
        const schema = pick(baseSchema, []);

        // Empty pick should accept any object (no required properties)
        expect(parse(schema, {}).success).toBe(true);
        expect(parse(schema, { name: "John" }).success).toBe(true);
        expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
        expect(parse(schema, { extra: "value" }).success).toBe(true);
      });
    });

    describe("extra properties boundary", () => {
      it("[🎯] should accept object with extra properties when pick is used (Req 11.6)", () => {
        const baseSchema = object({
          name: string(),
          age: number(),
          active: boolean(),
        });
        const schema = pick(baseSchema, ["name"]);

        // Pick should accept extra properties that are not in the picked keys
        expect(parse(schema, { name: "John", extra: "value" }).success).toBe(
          true
        );
        expect(
          parse(schema, { name: "John", age: 30, active: true, extra: 123 })
            .success
        ).toBe(true);
        expect(
          parse(schema, { name: "John", unknownProp: { nested: true } }).success
        ).toBe(true);
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.string(), fc.integer()])(
    "[🎲] should accept any object with picked properties",
    (name, age) => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = pick(baseSchema, ["name", "age"]);
      const result = parse(schema, { name, age });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name, age });
      }
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] should reject object missing picked property",
    (name) => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = pick(baseSchema, ["name", "age"]);
      const result = parse(schema, { name });

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] should reject invalid property type",
    (invalidName) => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = pick(baseSchema, ["name", "age"]);
      const result = parse(schema, { name: invalidName, age: 30 });

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] should reject non-object values",
    (value) => {
      const baseSchema = object({
        name: string(),
      });
      const schema = pick(baseSchema, ["name"]);
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.string(), fc.integer(), fc.string()])(
    "[🎲] should accept object with extra properties",
    (name, age, extra) => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = pick(baseSchema, ["name", "age"]);
      const result = parse(schema, { name, age, extra });

      expect(result.success).toBe(true);
    }
  );
});
