import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { omit } from "./omit";
import { object } from "../composites/object";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { boolean } from "../primitives/boolean";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";

describe("omit", () => {
  describe("validation", () => {
    it("should accept object with non-omitted properties", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = omit(baseSchema, ["active"]);

      expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
    });

    it("should reject object with missing non-omitted properties", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = omit(baseSchema, ["active"]);

      expect(parse(schema, { name: "John" }).success).toBe(false);
      expect(parse(schema, { age: 30 }).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
    });

    it("should accept object with omitted properties present", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = omit(baseSchema, ["active"]);

      expect(
        parse(schema, { name: "John", age: 30, active: true }).success
      ).toBe(true);
    });

    it("should reject invalid property values", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = omit(baseSchema, ["active"]);

      expect(parse(schema, { name: 123, age: 30 }).success).toBe(false);
      expect(parse(schema, { name: "John", age: "30" }).success).toBe(false);
    });

    it("should reject non-object values", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = omit(baseSchema, ["age"]);

      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, "string").success).toBe(false);
      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });

    it("should handle single omitted property", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = omit(baseSchema, ["age"]);

      expect(parse(schema, { name: "John" }).success).toBe(true);
      expect(parse(schema, {}).success).toBe(false);
    });

    it("should handle multiple omitted properties", () => {
      const baseSchema = object({
        a: string(),
        b: number(),
        c: boolean(),
        d: string(),
      });
      const schema = omit(baseSchema, ["c", "d"]);

      expect(parse(schema, { a: "1", b: 2 }).success).toBe(true);
      expect(parse(schema, { a: "1" }).success).toBe(false);
    });

    it("should handle omitting all properties", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = omit(baseSchema, ["name", "age"]);

      expect(parse(schema, {}).success).toBe(true);
      expect(parse(schema, { name: "John" }).success).toBe(true);
    });

    it("should return correct error message for missing fields", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = omit(baseSchema, ["active"]);

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
      const schema = omit(baseSchema, []);

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
      const schema = omit(baseSchema, []);

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
      const schema = omit(baseSchema, [], customMessage);

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
        active: boolean(),
      });
      const schema = omit(baseSchema, ["active"]);

      const result = parse(schema, { name: "John", age: 30 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name: "John", age: 30 });
      }
    });
  });

  describe("edge cases", () => {
    it("should handle empty omit array", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = omit(baseSchema, []);

      expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
      expect(parse(schema, { name: "John" }).success).toBe(false);
    });

    it("should handle nested validation errors", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = omit(baseSchema, ["active"]);

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
      const schema = omit(baseSchema, []);

      expect(parse(schema, []).success).toBe(false);
      expect(parse(schema, [1, 2, 3]).success).toBe(false);
    });

    it("should handle null", () => {
      const baseSchema = object({
        name: string(),
      });
      const schema = omit(baseSchema, []);

      expect(parse(schema, null).success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("omit all keys edge case", () => {
      it("[🎯] should accept any object when omit is called with all keys (Req 11.2)", () => {
        const baseSchema = object({
          name: string(),
          age: number(),
          active: boolean(),
        });
        const schema = omit(baseSchema, ["name", "age", "active"]);

        // Omitting all keys should accept any object (no required properties)
        expect(parse(schema, {}).success).toBe(true);
        expect(parse(schema, { name: "John" }).success).toBe(true);
        expect(parse(schema, { name: "John", age: 30 }).success).toBe(true);
        expect(parse(schema, { extra: "value" }).success).toBe(true);
      });
    });

    describe("omitted properties present boundary", () => {
      it("[🎯] should accept object with omitted properties present (Req 11.7)", () => {
        const baseSchema = object({
          name: string(),
          age: number(),
          active: boolean(),
        });
        const schema = omit(baseSchema, ["active"]);

        // Omit should accept objects that still have the omitted properties
        expect(
          parse(schema, { name: "John", age: 30, active: true }).success
        ).toBe(true);
        expect(
          parse(schema, { name: "John", age: 30, active: false }).success
        ).toBe(true);
        // Even with invalid type for omitted property, it should be ignored
        expect(
          parse(schema, { name: "John", age: 30, active: "invalid" }).success
        ).toBe(true);
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.string(), fc.integer()])(
    "[🎲] should accept any object with non-omitted properties",
    (name, age) => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = omit(baseSchema, ["active"]);
      const result = parse(schema, { name, age });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ name, age });
      }
    }
  );

  itProp.prop([fc.string()])(
    "[🎲] should reject object missing non-omitted property",
    (name) => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = omit(baseSchema, ["active"]);
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
      const schema = omit(baseSchema, []);
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
      const schema = omit(baseSchema, []);
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.string(), fc.integer(), fc.boolean()])(
    "[🎲] should accept object with omitted property present",
    (name, age, active) => {
      const baseSchema = object({
        name: string(),
        age: number(),
        active: boolean(),
      });
      const schema = omit(baseSchema, ["active"]);
      const result = parse(schema, { name, age, active });

      expect(result.success).toBe(true);
    }
  );
});
