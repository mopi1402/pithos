/**
 * Tests unitaires pour l'API Zod
 *
 * Ce fichier teste l'objet `z` avec la signature Zod
 * pour s'assurer qu'il fonctionne correctement.
 */

import { describe, it, expect } from "vitest";
import { z } from "./zod-adapter";

describe("API Zod", () => {
  describe("z.string()", () => {
    it("should create a string schema", () => {
      const schema = z.string();

      expect(schema.kind).toBe("schema");
      expect(schema.type).toBe("string");
      expect(schema.expects).toBe("string");
      expect(schema.async).toBe(false);
    });

    it("should validate string successfully", () => {
      const schema = z.string();
      const result = schema.safeParse("hello");

      expect(result.success).toBe(true);
      expect(result.data).toBe("hello");
      expect(result.error).toBeUndefined();
    });

    it("should reject non-string values", () => {
      const schema = z.string();
      const result = schema.safeParse(123);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error!.issues).toBeDefined();
      expect(result.error!.issues.length).toBe(1);
    });

    it("should use custom message", () => {
      const schema = z.string("Custom error message");
      const result = schema.safeParse(123);

      expect(result.success).toBe(false);
      expect(result.error!.issues[0].message).toBe("Custom error message");
    });

    it("should use custom message function", () => {
      const schema = z.string(
        (issue) => `Custom: ${issue.input} is not a ${issue.expected}`
      );
      const result = schema.safeParse(123);

      expect(result.success).toBe(false);
      expect(result.error!.issues[0].message).toBe(
        "Custom: 123 is not a string"
      );
    });

    it("should throw error on parse() with invalid input", () => {
      const schema = z.string();

      expect(() => {
        schema.parse(123);
      }).toThrow();
    });

    it("should return data on parse() with valid input", () => {
      const schema = z.string();
      const result = schema.parse("hello");

      expect(result).toBe("hello");
    });
  });

  describe("z.number()", () => {
    it("should create a number schema", () => {
      const schema = z.number();

      expect(schema.kind).toBe("schema");
      expect(schema.type).toBe("number");
      expect(schema.expects).toBe("number");
      expect(schema.async).toBe(false);
    });

    it("should validate number successfully", () => {
      const schema = z.number();
      const result = schema.safeParse(42);

      expect(result.success).toBe(true);
      expect(result.data).toBe(42);
      expect(result.error).toBeUndefined();
    });

    it("should reject non-number values", () => {
      const schema = z.number();
      const result = schema.safeParse("hello");

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error!.issues).toBeDefined();
      expect(result.error!.issues.length).toBe(1);
    });

    it("should reject NaN", () => {
      const schema = z.number();
      const result = schema.safeParse(NaN);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should reject Infinity", () => {
      const schema = z.number();
      const result = schema.safeParse(Infinity);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("z.boolean()", () => {
    it("should create a boolean schema", () => {
      const schema = z.boolean();

      expect(schema.kind).toBe("schema");
      expect(schema.type).toBe("boolean");
      expect(schema.expects).toBe("boolean");
      expect(schema.async).toBe(false);
    });

    it("should validate boolean successfully", () => {
      const schema = z.boolean();
      const result = schema.safeParse(true);

      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should validate boolean false successfully", () => {
      const schema = z.boolean();
      const result = schema.safeParse(false);

      expect(result.success).toBe(true);
      expect(result.data).toBe(false);
      expect(result.error).toBeUndefined();
    });

    it("should reject non-boolean values", () => {
      const schema = z.boolean();
      const result = schema.safeParse("hello");

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
    });
  });

  describe("z.object()", () => {
    it("should create an object schema", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });

      expect(schema.kind).toBe("schema");
      expect(schema.type).toBe("object");
      expect(schema.expects).toBe("Object");
      expect(schema.async).toBe(false);
    });

    it("should validate object with valid properties", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });
      const result = schema.safeParse({ name: "John", age: 30 });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ name: "John", age: 30 });
      expect(result.error).toBeUndefined();
    });

    it("should reject non-object values", () => {
      const schema = z.object({
        name: z.string(),
      });
      const result = schema.safeParse("not an object");

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
    });

    it("should reject object with invalid properties", () => {
      const schema = z.object({
        name: z.string(),
        age: z.number(),
      });
      const result = schema.safeParse({ name: "John", age: "30" });

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error!.issues).toBeDefined();
      expect(result.error!.issues.length).toBe(1);
    });

    it("should handle nested objects", () => {
      const schema = z.object({
        user: z.object({
          name: z.string(),
          email: z.string(),
        }),
      });
      const result = schema.safeParse({
        user: { name: "Jane", email: "jane@example.com" },
      });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        user: { name: "Jane", email: "jane@example.com" },
      });
    });
  });

  describe("z.array()", () => {
    it("should create an array schema", () => {
      const schema = z.array(z.string());

      expect(schema.kind).toBe("schema");
      expect(schema.type).toBe("array");
      expect(schema.expects).toBe("Array");
      expect(schema.async).toBe(false);
    });

    it("should validate array with valid items", () => {
      const schema = z.array(z.string());
      const result = schema.safeParse(["hello", "world"]);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(["hello", "world"]);
      expect(result.error).toBeUndefined();
    });

    it("should reject non-array values", () => {
      const schema = z.array(z.string());
      const result = schema.safeParse("not an array");

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
    });

    it("should reject array with invalid items", () => {
      const schema = z.array(z.string());
      const result = schema.safeParse(["hello", 123, "world"]);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error!.issues).toBeDefined();
      expect(result.error!.issues.length).toBe(1);
    });

    it("should handle nested arrays", () => {
      const schema = z.array(z.array(z.number()));
      const result = schema.safeParse([
        [1, 2],
        [3, 4],
      ]);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });
  });

  describe("z.partial()", () => {
    it("should create a partial object schema", () => {
      const schema = z.partial({
        name: z.string(),
        age: z.number(),
      });

      expect(schema.kind).toBe("schema");
      expect(schema.type).toBe("object");
      expect(schema.expects).toBe("Object");
    });

    it("should validate partial object", () => {
      const schema = z.partial({
        name: z.string(),
        age: z.number(),
      });
      const result = schema.safeParse({ name: "John" });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ name: "John" });
    });
  });

  describe("z.required()", () => {
    it("should create a required object schema", () => {
      const schema = z.required({
        name: z.string(),
        age: z.number(),
      });

      expect(schema.kind).toBe("schema");
      expect(schema.type).toBe("object");
      expect(schema.expects).toBe("Object");
    });

    it("should validate required object", () => {
      const schema = z.required({
        name: z.string(),
        age: z.number(),
      });
      const result = schema.safeParse({ name: "John", age: 30 });

      expect(result.success).toBe(true);
      expect(result.data).toEqual({ name: "John", age: 30 });
    });
  });

  describe("z.minLength()", () => {
    it("should create a minLength array schema", () => {
      const schema = z.minLength(z.string(), 2);

      expect(schema.kind).toBe("schema");
      expect(schema.type).toBe("array");
      expect(schema.expects).toBe("Array");
    });

    it("should validate array with minimum length", () => {
      const schema = z.minLength(z.string(), 2);
      const result = schema.safeParse(["a", "b"]);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(["a", "b"]);
    });
  });

  describe("z.maxLength()", () => {
    it("should create a maxLength array schema", () => {
      const schema = z.maxLength(z.string(), 3);

      expect(schema.kind).toBe("schema");
      expect(schema.type).toBe("array");
      expect(schema.expects).toBe("Array");
    });

    it("should validate array with maximum length", () => {
      const schema = z.maxLength(z.string(), 3);
      const result = schema.safeParse(["a", "b", "c"]);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(["a", "b", "c"]);
    });
  });

  describe("Async methods", () => {
    it("should have parseAsync method", () => {
      const schema = z.string();

      expect(typeof schema.parseAsync).toBe("function");
    });

    it("should have safeParseAsync method", () => {
      const schema = z.string();

      expect(typeof schema.safeParseAsync).toBe("function");
    });

    it("should work with parseAsync", async () => {
      const schema = z.string();
      const result = await schema.parseAsync("hello");

      expect(result).toBe("hello");
    });

    it("should work with safeParseAsync", async () => {
      const schema = z.string();
      const result = await schema.safeParseAsync("hello");

      expect(result.success).toBe(true);
      expect(result.data).toBe("hello");
    });
  });

  describe("Complex schemas", () => {
    it("should handle complex nested schemas", () => {
      const schema = z.object({
        user: z.object({
          name: z.string(),
          age: z.number(),
          active: z.boolean(),
        }),
        items: z.array(z.string()),
        metadata: z.object({
          created: z.string(),
          updated: z.string(),
        }),
      });

      const data = {
        user: { name: "John", age: 30, active: true },
        items: ["item1", "item2"],
        metadata: { created: "2023-01-01", updated: "2023-01-02" },
      };

      const result = schema.safeParse(data);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
    });
  });
});
