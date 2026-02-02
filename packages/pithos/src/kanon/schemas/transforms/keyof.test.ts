import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { keyof } from "./keyof";
import { object } from "../composites/object";
import { string } from "../primitives/string";
import { number } from "../primitives/number";
import { boolean } from "../primitives/boolean";
import { parse } from "../../core/parser";
import { ERROR_MESSAGES_COMPOSITION } from "../../core/consts/messages";
import { cast } from "@arkhe/test/private-access";

describe("keyof", () => {
  describe("validation", () => {
    it("should accept valid keys from object schema", () => {
      const schema = keyof(
        object({
          name: string(),
          age: number(),
          active: boolean(),
        })
      );

      expect(parse(schema, "name").success).toBe(true);
      expect(parse(schema, "age").success).toBe(true);
      expect(parse(schema, "active").success).toBe(true);
    });

    it("should reject invalid keys", () => {
      const schema = keyof(
        object({
          name: string(),
          age: number(),
        })
      );

      expect(parse(schema, "invalid").success).toBe(false);
      expect(parse(schema, "Name").success).toBe(false);
      expect(parse(schema, "name ").success).toBe(false);
      expect(parse(schema, " name").success).toBe(false);
    });

    it("should reject non-string values", () => {
      const schema = keyof(
        object({
          name: string(),
          age: number(),
        })
      );

      expect(parse(schema, 123).success).toBe(false);
      expect(parse(schema, true).success).toBe(false);
      expect(parse(schema, null).success).toBe(false);
      expect(parse(schema, undefined).success).toBe(false);
      expect(parse(schema, {}).success).toBe(false);
      expect(parse(schema, []).success).toBe(false);
    });

    it("should handle single property object", () => {
      const schema = keyof(
        object({
          name: string(),
        })
      );

      expect(parse(schema, "name").success).toBe(true);
      expect(parse(schema, "age").success).toBe(false);
    });

    it("should handle multiple properties object", () => {
      const schema = keyof(
        object({
          a: string(),
          b: number(),
          c: boolean(),
          d: string(),
          e: number(),
        })
      );

      expect(parse(schema, "a").success).toBe(true);
      expect(parse(schema, "b").success).toBe(true);
      expect(parse(schema, "c").success).toBe(true);
      expect(parse(schema, "d").success).toBe(true);
      expect(parse(schema, "e").success).toBe(true);
      expect(parse(schema, "f").success).toBe(false);
    });

    it("should return correct error message for invalid keys", () => {
      const schema = keyof(
        object({
          name: string(),
          age: number(),
        })
      );

      const result = parse(schema, "invalid");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("name");
        expect(result.error).toContain("age");
        expect(result.error).toContain("Expected one of");
      }
    });

    it("[👾] should format keys with comma separator in error message", () => {
      const schema = keyof(
        object({
          name: string(),
          age: number(),
        })
      );

      const result = parse(schema, "invalid");
      expect(result.success).toBe(false);
      if (!result.success) {
        // Verify keys are separated by ", " not concatenated
        expect(result.error).toContain("name, age");
      }
    });

    it("should return correct error message for non-string values", () => {
      const schema = keyof(
        object({
          name: string(),
        })
      );

      const result = parse(schema, 123);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(ERROR_MESSAGES_COMPOSITION.string);
      }
    });

    it("should use custom error message when provided", () => {
      const customMessage = "Must be a valid key";
      const schema = keyof(
        object({
          name: string(),
        }),
        customMessage
      );

      const result = parse(schema, "invalid");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(customMessage);
      }
    });

    it("should return correct data type when validation succeeds", () => {
      const schema = keyof(
        object({
          name: string(),
          age: number(),
        })
      );

      const result = parse(schema, "name");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(typeof result.data).toBe("string");
        expect(result.data).toBe("name");
      }
    });
  });

  describe("edge cases", () => {
    it("should throw error for empty object schema", () => {
      expect(() => keyof(object({}))).toThrow(
        "keyof() requires an object schema with at least one property"
      );
    });

    it("should handle case-sensitive keys", () => {
      const schema = keyof(
        object({
          Name: string(),
          name: string(),
        })
      );

      expect(parse(schema, "Name").success).toBe(true);
      expect(parse(schema, "name").success).toBe(true);
      expect(parse(schema, "NAME").success).toBe(false);
    });

    it("should handle keys with special characters", () => {
      const schema = keyof(
        object({
          "key-with-dash": string(),
          key_with_underscore: number(),
        })
      );

      expect(parse(schema, "key-with-dash").success).toBe(true);
      expect(parse(schema, "key_with_underscore").success).toBe(true);
      expect(parse(schema, "keyWithCamelCase").success).toBe(false);
    });

    it("should handle numeric string keys", () => {
      const schema = keyof(
        object({
          "0": string(),
          "1": number(),
        })
      );

      expect(parse(schema, "0").success).toBe(true);
      expect(parse(schema, "1").success).toBe(true);
      expect(parse(schema, "2").success).toBe(false);
    });

    it("should handle empty string key", () => {
      const schema = keyof(
        object({
          "": string(),
          name: string(),
        })
      );

      expect(parse(schema, "").success).toBe(true);
      expect(parse(schema, "name").success).toBe(true);
    });

    it("should handle unicode keys", () => {
      const schema = keyof(
        object({
          émoji: string(),
          中文: number(),
        })
      );

      expect(parse(schema, "émoji").success).toBe(true);
      expect(parse(schema, "中文").success).toBe(true);
      expect(parse(schema, "emoji").success).toBe(false);
    });

    it("should handle object with entries property directly", () => {
      const entries = {
        name: string(),
        age: number(),
      };

      const schema = keyof(cast({ entries }));

      expect(parse(schema, "name").success).toBe(true);
      expect(parse(schema, "age").success).toBe(true);
      expect(parse(schema, "invalid").success).toBe(false);
    });

    it("should handle ObjectSchema with entries property", () => {
      const baseSchema = object({
        name: string(),
        age: number(),
      });
      const schema = keyof(baseSchema);

      expect(parse(schema, "name").success).toBe(true);
      expect(parse(schema, "age").success).toBe(true);
      expect(parse(schema, "invalid").success).toBe(false);
    });
  });

  describe("[🎯] Specification Tests", () => {
    describe("empty object schema edge case", () => {
      it("[🎯] should throw error when keyof is called with empty object schema (Req 11.5)", () => {
        const emptySchema = object({});

        // keyof of empty schema should throw an error (no keys to validate against)
        expect(() => keyof(emptySchema)).toThrow(
          "keyof() requires an object schema with at least one property"
        );
      });
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  itProp.prop([fc.constantFrom("name", "age", "active")])(
    "[🎲] should accept any valid key from object schema",
    (key) => {
      const schema = keyof(
        object({
          name: string(),
          age: number(),
          active: boolean(),
        })
      );
      const result = parse(schema, key);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(key);
      }
    }
  );

  itProp.prop([fc.string().filter((s) => !["name", "age", "active"].includes(s))])(
    "[🎲] should reject any string not in object keys",
    (key) => {
      const schema = keyof(
        object({
          name: string(),
          age: number(),
          active: boolean(),
        })
      );
      const result = parse(schema, key);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.integer()])(
    "[🎲] should reject any integer",
    (value) => {
      const schema = keyof(
        object({
          name: string(),
          age: number(),
        })
      );
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );

  itProp.prop([fc.boolean()])(
    "[🎲] should reject any boolean",
    (value) => {
      const schema = keyof(
        object({
          name: string(),
          age: number(),
        })
      );
      const result = parse(schema, value);

      expect(result.success).toBe(false);
    }
  );
});
