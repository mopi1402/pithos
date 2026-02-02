import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { partial } from "./partial";
import { object } from "../composites/object";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { boolean } from "../primitives/boolean";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";
import { cast } from "@arkhe/test/private-access";

describe("partial", () => {
  describe("validation", () => {
    it("should accept object with all properties", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = partial(baseSchema);

      expect(
        parse(schema, { name: "John", age: 30, active: true }).success
      ).toBe(true);
    });

    it("should accept object with some properties missing", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = partial(baseSchema);

      expect(parse(schema, { name: "John" }).success).toBe(true);
      expect(parse(schema, { age: 30 }).success).toBe(true);
      expect(parse(schema, { active: true }).success).toBe(true);
      expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
      expect(parse(schema, {}).success).toBe(true);
    });

    it("should reject invalid property values", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = partial(baseSchema);

      expect(parse(schema, { name: 123 }).success).toBe(false);
      expect(parse(schema, { age: "30" }).success).toBe(false);
      expect(parse(schema, { name: "John", age: "30" }).success).toBe(false);
    });

    it("should accept extra properties not in schema", () => {
      const baseSchema = object({
        name: string(),
      });
      const schema = partial(baseSchema);

      expect(parse(schema, { name: "John", extra: "value" }).success).toBe(
        true
      );
    });

    it("should reject non-object values", () => {
      const baseSchema = object({
        name: string(),
      });
      const schema = partial(baseSchema);

      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, "string").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
    });

    it("should return correct error message for non-object values", () => {
      const baseSchema = object({
        name: string(),
      });
      const schema = partial(baseSchema);

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
      const schema = partial(baseSchema);

      const result = parse(schema, { name: 123 });
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
      const schema = partial(baseSchema, customMessage);

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
      const schema = partial(baseSchema);

      const result = parse(schema, { name: "John", age: 30 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name: "John", age: 30 });
      }
    });
  });

  describe("edge cases", () => {
    it("should handle empty object", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = partial(baseSchema);

      expect(parse(schema, {}).success).toBe(true);
    });

    it("should handle object with single property", () => {
      const baseSchema = object({
        name: string(),
      });
      const schema = partial(baseSchema);

      expect(parse(schema, { name: "John" }).success).toBe(true);
      expect(parse(schema, {}).success).toBe(true);
    });

    it("should handle object with many properties", () => {
      const baseSchema = object({
        a: string(),
        b: number(),
        c: boolean(),
        d: string(),
        e: number(),
      });
      const schema = partial(baseSchema);

      expect(
        parse(schema, { a: "1", b: 2, c: true, d: "4", e: 5 }).success
      ).toBe(true);
      expect(parse(schema, { a: "1" }).success).toBe(true);
      expect(parse(schema, {}).success).toBe(true);
    });

    it("should handle nested validation errors", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = partial(baseSchema);

      const result = parse(schema, { name: "John", age: "invalid" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("age");
      }
    });

    it("should handle arrays (arrays are objects in JS)", () => {
      const baseSchema = object({
        name: string(),
      });
      const schema = partial(baseSchema);

      expect(parse(schema, []).success).toBe(true);
      expect(parse(schema, [1, 2, 3]).success).toBe(true);
    });

    it("should handle null", () => {
      const baseSchema = object({
        name: string(),
      });
      const schema = partial(baseSchema);

      expect(parse(schema, null).success).toBe(false);
    });

    it("should handle object with entries property directly", () => {
      const entries = {
        name: string(),
        age: number(),
      };
      const schema = partial(cast({ entries }));

      expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
      expect(parse(schema, { name: "John" }).success).toBe(true);
      expect(parse(schema, {}).success).toBe(true);
    });

    it("should handle ObjectSchema with entries property", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = partial(baseSchema);

      expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
      expect(parse(schema, { name: "John" }).success).toBe(true);
      expect(parse(schema, {}).success).toBe(true);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("empty object schema edge case", () => {
      it("[🎯] should accept empty objects when partial is applied to empty object schema (Req 11.3)", () => {
        const emptySchema = object({});
        const schema = partial(emptySchema);

        // Partial of empty schema should accept empty objects
        expect(parse(schema, {}).success).toBe(true);
      });

      it("[🎯] should accept objects with any properties when partial is applied to empty object schema (Req 11.3)", () => {
        const emptySchema = object({});
        const schema = partial(emptySchema);

        // Partial of empty schema should accept any object (no properties to validate)
        expect(parse(schema, { extra: "value" }).success).toBe(true);
        expect(parse(schema, { a: 1, b: "two", c: true }).success).toBe(true);
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.string(), fc.integer()])(
    "[🎲] should accept any object with valid property values",
    (name, age) => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = partial(baseSchema);
      const result = parse(schema, { name, age });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name, age });
      }
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] should accept object with only some properties",
    (name) => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = partial(baseSchema);
      const result = parse(schema, { name });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name });
      }
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] should reject invalid property type",
    (invalidName) => {
      const baseSchema = object({
        name: string(),
      });
      const schema = partial(baseSchema);
      const result = parse(schema, { name: invalidName });

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] should reject non-object values",
    (value) => {
      const baseSchema = object({
        name: string(),
      });
      const schema = partial(baseSchema);
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );
});
