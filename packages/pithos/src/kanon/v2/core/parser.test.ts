/**
 * Tests exhaustifs pour parser.ts
 *
 * Ce fichier teste TOUS les cas d'usage du fichier parser.ts
 * de manière exhaustive sans superflu.
 */

import { describe, it, expect } from "vitest";
import {
  safeParse,
  parse,
  safeParseAsync,
  parseAsync,
  safeParseMany,
  safeParseBulk,
  parseMany,
  safeParseManyAsync,
  parseManyAsync,
  type SafeParseResult,
} from "./parser.js";
import { string as stringSchema } from "@kanon/v2/schemas/primitives/string.js";
import { number as numberSchema } from "@kanon/v2/schemas/primitives/number.js";
import { boolean as booleanSchema } from "@kanon/v2/schemas/primitives/boolean.js";
import { object as objectSchema } from "@kanon/v2/schemas/composites/object.js";
import { array as arraySchema } from "@kanon/v2/schemas/composites/array.js";
import type { PithosConfig, BaseSchema } from "@kanon/v2/types/base.js";

describe("Parser Core Functions", () => {
  describe("safeParse function", () => {
    it("should validate valid input successfully", () => {
      const schema = stringSchema() as BaseSchema;
      const result = safeParse(schema, "hello");

      expect(result.success).toBe(true);
      expect(result.data).toBe("hello");
      expect(result.error).toBeUndefined();
    });

    it("should handle invalid input with proper error structure", () => {
      const schema = stringSchema() as BaseSchema;
      const result = safeParse(schema, 123);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error!.issues).toBeDefined();
      expect(result.error!.issues.length).toBeGreaterThan(0);
      expect(result.error!.issues[0]).toHaveProperty("message");
      expect(result.error!.issues[0]).toHaveProperty("type");
    });

    it("should handle null and undefined inputs", () => {
      const schema = stringSchema() as BaseSchema;

      const nullResult = safeParse(schema, null);
      expect(nullResult.success).toBe(false);

      const undefinedResult = safeParse(schema, undefined);
      expect(undefinedResult.success).toBe(false);
    });

    it("should respect abortEarly configuration", () => {
      const schema = objectSchema({
        name: stringSchema() as BaseSchema,
        age: numberSchema() as BaseSchema,
      }) as BaseSchema;

      const resultWithAbortEarly = safeParse(
        schema,
        { name: 123, age: "invalid" },
        { abortEarly: true }
      );
      const resultWithoutAbortEarly = safeParse(
        schema,
        { name: 123, age: "invalid" },
        { abortEarly: false }
      );

      // Both should fail, but abortEarly might affect the number of issues
      expect(resultWithAbortEarly.success).toBe(false);
      expect(resultWithoutAbortEarly.success).toBe(false);
    });

    it("should handle custom language configuration", () => {
      const schema = stringSchema() as BaseSchema;
      const result = safeParse(schema, 123, { lang: "fr" });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle empty configuration object", () => {
      const schema = stringSchema() as BaseSchema;
      const result = safeParse(schema, "hello", {});

      expect(result.success).toBe(true);
      expect(result.data).toBe("hello");
    });

    it("should work with complex nested schemas", () => {
      const schema = objectSchema({
        user: objectSchema({
          name: stringSchema() as BaseSchema,
          age: numberSchema() as BaseSchema,
        }),
        active: booleanSchema() as BaseSchema,
      }) as BaseSchema;

      const validInput = {
        user: { name: "John", age: 30 },
        active: true,
      };

      const result = safeParse(schema, validInput);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validInput);
    });

    it("should handle array schemas", () => {
      const schema = arraySchema(stringSchema() as BaseSchema) as BaseSchema;
      const result = safeParse(schema, ["hello", "world"]);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(["hello", "world"]);
    });
  });

  describe("parse function", () => {
    it("should return data for valid input", () => {
      const schema = stringSchema() as BaseSchema;
      const result = parse(schema, "hello");

      expect(result).toBe("hello");
    });

    it("should throw error for invalid input", () => {
      const schema = stringSchema() as BaseSchema;

      expect(() => parse(schema, 123)).toThrow("Validation failed");
    });

    it("should include issues in thrown error", () => {
      const schema = stringSchema() as BaseSchema;

      try {
        parse(schema, 123);
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toBe("Validation failed");
        expect(error.issues).toBeDefined();
        expect(Array.isArray(error.issues)).toBe(true);
      }
    });

    it("should respect configuration options", () => {
      const schema = objectSchema({
        name: stringSchema() as BaseSchema,
        age: numberSchema() as BaseSchema,
      }) as BaseSchema;

      expect(() =>
        parse(schema, { name: 123 }, { abortEarly: true })
      ).toThrow();
    });
  });

  describe("safeParseAsync function", () => {
    it("should handle async validation successfully", async () => {
      const schema = stringSchema() as BaseSchema;
      const result = await safeParseAsync(schema, "hello");

      expect(result.success).toBe(true);
      expect(result.data).toBe("hello");
    });

    it("should handle async validation errors", async () => {
      const schema = stringSchema() as BaseSchema;
      const result = await safeParseAsync(schema, 123);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should respect configuration in async mode", async () => {
      const schema = stringSchema() as BaseSchema;
      const result = await safeParseAsync(schema, 123, { lang: "fr" });

      expect(result.success).toBe(false);
    });
  });

  describe("parseAsync function", () => {
    it("should return data for valid async input", async () => {
      const schema = stringSchema() as BaseSchema;
      const result = await parseAsync(schema, "hello");

      expect(result).toBe("hello");
    });

    it("should throw error for invalid async input", async () => {
      const schema = stringSchema() as BaseSchema;

      await expect(parseAsync(schema, 123)).rejects.toThrow(
        "Validation failed"
      );
    });
  });

  describe("safeParseMany function", () => {
    it("should validate multiple inputs successfully", () => {
      const schema = stringSchema() as BaseSchema;
      const inputs = ["hello", "world", "test"];
      const results = safeParseMany(schema, inputs);

      expect(results).toHaveLength(3);
      results.forEach((result, i) => {
        expect(result.success).toBe(true);
        expect(result.data).toBe(inputs[i]);
      });
    });

    it("should handle mixed valid and invalid inputs", () => {
      const schema = stringSchema() as BaseSchema;
      const inputs = ["hello", 123, "world"];
      const results = safeParseMany(schema, inputs);

      expect(results).toHaveLength(3);
      expect(results[0].success).toBe(true);
      expect(results[0].data).toBe("hello");
      expect(results[1].success).toBe(false);
      expect(results[2].success).toBe(true);
      expect(results[2].data).toBe("world");
    });

    it("should handle empty input array", () => {
      const schema = stringSchema() as BaseSchema;
      const results = safeParseMany(schema, []);

      expect(results).toHaveLength(0);
      expect(Array.isArray(results)).toBe(true);
    });

    it("should respect configuration for bulk validation", () => {
      const schema = objectSchema({
        name: stringSchema() as BaseSchema,
        age: numberSchema() as BaseSchema,
      }) as BaseSchema;
      const inputs = [
        { name: "John", age: 30 },
        { name: 123, age: "invalid" },
      ];

      const results = safeParseMany(schema, inputs, { abortEarly: false });

      expect(results).toHaveLength(2);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
    });

    it("should handle large arrays efficiently", () => {
      const schema = stringSchema() as BaseSchema;
      const inputs = Array.from({ length: 1000 }, (_, i) => `item-${i}`);

      const start = performance.now();
      const results = safeParseMany(schema, inputs);
      const end = performance.now();

      expect(results).toHaveLength(1000);
      expect(end - start).toBeLessThan(100); // Should be fast

      // Verify all results are successful
      results.forEach((result, i) => {
        expect(result.success).toBe(true);
        expect(result.data).toBe(`item-${i}`);
      });
    });
  });

  describe("safeParseBulk function", () => {
    it("should validate bulk inputs successfully", () => {
      const schema = stringSchema() as BaseSchema;
      const inputs = ["hello", "world", "test"];
      const result = safeParseBulk(schema, inputs);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(inputs);
      expect(result.error).toBeUndefined();
    });

    it("should handle bulk validation with errors", () => {
      const schema = stringSchema() as BaseSchema;
      const inputs = ["hello", 123, "world"];
      const result = safeParseBulk(schema, inputs);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error!.issues).toBeDefined();
      expect(result.error!.issues.length).toBeGreaterThan(0);
    });

    it("should handle empty input array in bulk", () => {
      const schema = stringSchema() as BaseSchema;
      const result = safeParseBulk(schema, []);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it("should respect abortEarly in bulk validation", () => {
      const schema = stringSchema() as BaseSchema;
      const inputs = ["hello", 123, "world"];

      const resultWithAbortEarly = safeParseBulk(schema, inputs, {
        abortEarly: true,
      });
      const resultWithoutAbortEarly = safeParseBulk(schema, inputs, {
        abortEarly: false,
      });

      expect(resultWithAbortEarly.success).toBe(false);
      expect(resultWithoutAbortEarly.success).toBe(false);

      // With abortEarly, we might get fewer issues
      expect(resultWithAbortEarly.error!.issues.length).toBeLessThanOrEqual(
        resultWithoutAbortEarly.error!.issues.length
      );
    });

    it("should handle complex nested schemas in bulk", () => {
      const schema = objectSchema({
        name: stringSchema() as BaseSchema,
        age: numberSchema() as BaseSchema,
      }) as BaseSchema;
      const inputs = [
        { name: "John", age: 30 },
        { name: "Jane", age: 25 },
        { name: "Bob", age: 35 },
      ];

      const result = safeParseBulk(schema, inputs);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(inputs);
    });

    it("should handle large bulk validation efficiently", () => {
      const schema = stringSchema() as BaseSchema;
      const inputs = Array.from({ length: 5000 }, (_, i) => `item-${i}`);

      const start = performance.now();
      const result = safeParseBulk(schema, inputs);
      const end = performance.now();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(5000);
      expect(end - start).toBeLessThan(200); // Should be fast for bulk
    });

    it("should preserve issue paths in bulk validation", () => {
      const schema = objectSchema({
        name: stringSchema() as BaseSchema,
        age: numberSchema() as BaseSchema,
      }) as BaseSchema;
      const inputs = [
        { name: "John", age: 30 },
        { name: 123, age: "invalid" },
      ];

      const result = safeParseBulk(schema, inputs);

      expect(result.success).toBe(false);
      expect(result.error!.issues.length).toBeGreaterThan(0);

      // Check that issues have proper paths with array index
      result.error!.issues.forEach((issue: any) => {
        expect(issue).toHaveProperty("message");
        expect(issue).toHaveProperty("type");
        if (issue.path) {
          expect(Array.isArray(issue.path)).toBe(true);
          // The path should start with the array index (1 for the second item)
          expect(issue.path[0]).toBe(1); // Second item (index 1) has errors
          expect(typeof issue.path[1]).toBe("string"); // Property name
        }
      });
    });
  });

  describe("parseMany function", () => {
    it("should return array of validated data", () => {
      const schema = stringSchema() as BaseSchema;
      const inputs = ["hello", "world"];
      const results = parseMany(schema, inputs);

      expect(results).toEqual(inputs);
    });

    it("should throw error on first invalid input", () => {
      const schema = stringSchema() as BaseSchema;
      const inputs = ["hello", 123, "world"];

      expect(() => parseMany(schema, inputs)).toThrow();
    });
  });

  describe("safeParseManyAsync function", () => {
    it("should handle async validation for multiple inputs", async () => {
      const schema = stringSchema() as BaseSchema;
      const inputs = ["hello", "world"];
      const results = await safeParseManyAsync(schema, inputs);

      expect(results).toHaveLength(2);
      results.forEach((result, i) => {
        expect(result.success).toBe(true);
        expect(result.data).toBe(inputs[i]);
      });
    });

    it("should handle mixed results in async mode", async () => {
      const schema = stringSchema() as BaseSchema;
      const inputs = ["hello", 123, "world"];
      const results = await safeParseManyAsync(schema, inputs);

      expect(results).toHaveLength(3);
      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      expect(results[2].success).toBe(true);
    });
  });

  describe("parseManyAsync function", () => {
    it("should return array of validated data in async mode", async () => {
      const schema = stringSchema() as BaseSchema;
      const inputs = ["hello", "world"];
      const results = await parseManyAsync(schema, inputs);

      expect(results).toEqual(inputs);
    });

    it("should throw error on invalid input in async mode", async () => {
      const schema = stringSchema() as BaseSchema;
      const inputs = ["hello", 123];

      await expect(parseManyAsync(schema, inputs)).rejects.toThrow();
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle circular references gracefully", () => {
      const schema = objectSchema({}) as BaseSchema;
      const circular: any = { name: "test" };
      circular.self = circular;

      const result = safeParse(schema, circular);
      expect(result.success).toBe(true);
    });

    it("should handle functions as input", () => {
      // Functions are not objects, so they should fail object validation
      const schema = objectSchema({}) as BaseSchema;
      const func = () => "test";

      const result = safeParse(schema, func);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle symbols as input", () => {
      // Symbols are not objects, so they should fail object validation
      const schema = objectSchema({}) as BaseSchema;
      const symbol = Symbol("test");

      const result = safeParse(schema, symbol);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle BigInt as input", () => {
      // BigInt is not an object, so it should fail object validation
      const schema = objectSchema({}) as BaseSchema;
      const bigInt = BigInt(123);

      const result = safeParse(schema, bigInt);
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle Date objects as input", () => {
      const schema = objectSchema({}) as BaseSchema;
      const date = new Date("2023-01-01");

      const result = safeParse(schema, date);
      expect(result.success).toBe(true);
    });

    it("should handle RegExp objects as input", () => {
      const schema = objectSchema({}) as BaseSchema;
      const regex = /test/gi;

      const result = safeParse(schema, regex);
      expect(result.success).toBe(true);
    });

    it("should handle NaN and Infinity", () => {
      const schema = numberSchema() as BaseSchema;

      const nanResult = safeParse(schema, NaN);
      const infResult = safeParse(schema, Infinity);

      expect(nanResult.success).toBe(false);
      expect(infResult.success).toBe(false);
    });

    it("should handle very large numbers", () => {
      const schema = numberSchema() as BaseSchema;
      const largeNumber = Number.MAX_SAFE_INTEGER;

      const result = safeParse(schema, largeNumber);
      expect(result.success).toBe(true);
      expect(result.data).toBe(largeNumber);
    });

    it("should handle very deep nested objects", () => {
      const schema = objectSchema({}) as BaseSchema;
      const deepObject: any = {};
      let current = deepObject;

      // Create 100 levels deep
      for (let i = 0; i < 100; i++) {
        current.nested = {};
        current = current.nested;
      }

      const result = safeParse(schema, deepObject);
      expect(result.success).toBe(true);
    });
  });

  describe("Performance and Memory", () => {
    it("should efficiently handle rapid successive validations", () => {
      const schema = stringSchema() as BaseSchema;
      const start = performance.now();

      for (let i = 0; i < 1000; i++) {
        const result = safeParse(schema, `test-${i}`);
        expect(result.success).toBe(true);
      }

      const end = performance.now();
      expect(end - start).toBeLessThan(100); // Should be fast
    });

    it("should not leak memory with repeated validations", () => {
      const schema = stringSchema() as BaseSchema;
      const initialMemory = process.memoryUsage().heapUsed;

      // Perform many validations
      for (let cycle = 0; cycle < 10; cycle++) {
        for (let i = 0; i < 100; i++) {
          safeParse(schema, `test-${cycle}-${i}`);
        }
      }

      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;

      // Memory increase should be reasonable
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
    });

    it("should handle concurrent validations", async () => {
      const schema = stringSchema() as BaseSchema;
      const promises = Array.from({ length: 100 }, (_, i) =>
        Promise.resolve().then(() => safeParse(schema, `concurrent-${i}`))
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(100);
      results.forEach((result, i) => {
        expect(result.success).toBe(true);
        expect(result.data).toBe(`concurrent-${i}`);
      });
    });
  });

  describe("Type Safety and Integration", () => {
    it("should maintain correct TypeScript types", () => {
      const schema = stringSchema() as BaseSchema;
      const result: SafeParseResult<string> = safeParse(
        schema,
        "hello"
      ) as SafeParseResult<string>;

      if (result.success) {
        expect(typeof result.data).toBe("string");
      } else {
        expect.fail("Expected success result");
      }
    });

    it("should work with generic schemas", () => {
      interface User {
        name: string;
        age: number;
      }

      const schema = objectSchema({
        name: stringSchema() as BaseSchema,
        age: numberSchema() as BaseSchema,
      }) as BaseSchema;

      const userData = { name: "John", age: 30 };
      const result = safeParse(schema, userData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(userData);
      }
    });

    it("should handle configuration type safety", () => {
      const schema = stringSchema() as BaseSchema;
      const config: PithosConfig = {
        lang: "en",
        abortEarly: false,
      };

      const result = safeParse(schema, "hello", config);
      expect(result.success).toBe(true);
    });
  });

  describe("Configuration Handling", () => {
    it("should handle partial configuration objects", () => {
      const schema = stringSchema() as BaseSchema;

      const result1 = safeParse(schema, "hello", { lang: "fr" });
      const result2 = safeParse(schema, "hello", { abortEarly: true });
      const result3 = safeParse(schema, "hello", {
        lang: "en",
        abortEarly: false,
      });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result3.success).toBe(true);
    });

    it("should handle undefined configuration", () => {
      const schema = stringSchema() as BaseSchema;
      const result = safeParse(schema, "hello", undefined as any);

      expect(result.success).toBe(true);
    });

    it("should handle null configuration", () => {
      const schema = stringSchema() as BaseSchema;
      const result = safeParse(schema, "hello", null as any);

      expect(result.success).toBe(true);
    });
  });
});
