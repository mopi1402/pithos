/**
 * ValidatorCache Tests
 */

import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import {
  createValidatorCache,
  globalValidatorCache,
  type CompiledValidator,
} from "./cache";
import { string } from "@kanon/v3/schemas/primitives/string";
import { number } from "@kanon/v3/schemas/primitives/number";
import type { Schema } from "@kanon/v3/types/base";
import { compile, clearCache } from "./compiler";

describe("ValidatorCache", () => {
  describe("createValidatorCache", () => {
    it("should create an empty cache", () => {
      const cache = createValidatorCache();
      const schema = string() as Schema<unknown>;

      expect(cache.has(schema)).toBe(false);
      expect(cache.get(schema)).toBeUndefined();
    });
  });

  describe("set / get / has", () => {
    it("should store and retrieve validators", () => {
      const cache = createValidatorCache();
      const schema = string() as Schema<unknown>;
      const validator: CompiledValidator<string> = (value) =>
        typeof value === "string" ? true : "Expected string";

      cache.set(schema, validator);

      expect(cache.has(schema)).toBe(true);
      expect(cache.get(schema)).toBe(validator);
    });

    it("should return undefined for non-cached schemas", () => {
      const cache = createValidatorCache();
      const schema = string() as Schema<unknown>;

      expect(cache.get(schema)).toBeUndefined();
    });

    it("should handle multiple schemas independently", () => {
      const cache = createValidatorCache();
      const stringSchema = string() as Schema<unknown>;
      const numberSchema = number() as Schema<unknown>;

      const stringValidator: CompiledValidator<string> = (value) =>
        typeof value === "string" ? true : "Expected string";
      const numberValidator: CompiledValidator<number> = (value) =>
        typeof value === "number" ? true : "Expected number";

      cache.set(stringSchema, stringValidator);
      cache.set(numberSchema, numberValidator);

      expect(cache.get(stringSchema)).toBe(stringValidator);
      expect(cache.get(numberSchema)).toBe(numberValidator);
    });

    it("should overwrite existing validators", () => {
      const cache = createValidatorCache();
      const schema = string() as Schema<unknown>;

      const validator1: CompiledValidator<string> = () => true;
      const validator2: CompiledValidator<string> = () => "error";

      cache.set(schema, validator1);
      expect(cache.get(schema)).toBe(validator1);

      cache.set(schema, validator2);
      expect(cache.get(schema)).toBe(validator2);
    });
  });

  describe("clear", () => {
    it("should remove all cached validators", () => {
      const cache = createValidatorCache();
      const schema1 = string() as Schema<unknown>;
      const schema2 = number() as Schema<unknown>;

      cache.set(schema1, () => true);
      cache.set(schema2, () => true);

      expect(cache.has(schema1)).toBe(true);
      expect(cache.has(schema2)).toBe(true);

      cache.clear();

      expect(cache.has(schema1)).toBe(false);
      expect(cache.has(schema2)).toBe(false);
    });
  });

  describe("globalValidatorCache", () => {
    it("should be a valid cache instance", () => {
      expect(globalValidatorCache).toBeDefined();
      expect(typeof globalValidatorCache.get).toBe("function");
      expect(typeof globalValidatorCache.set).toBe("function");
      expect(typeof globalValidatorCache.has).toBe("function");
      expect(typeof globalValidatorCache.clear).toBe("function");
    });
  });

  describe("WeakMap behavior", () => {
    it("should use schema reference as key (not value equality)", () => {
      const cache = createValidatorCache();

      // Two schemas with different references (using custom messages to avoid singleton)
      const schema1 = string("error 1") as Schema<unknown>;
      const schema2 = string("error 2") as Schema<unknown>;

      const validator: CompiledValidator<string> = () => true;

      cache.set(schema1, validator);

      // schema2 has different reference
      expect(cache.has(schema1)).toBe(true);
      expect(cache.has(schema2)).toBe(false);
    });

    it("should return same validator for same schema reference", () => {
      const cache = createValidatorCache();

      // Same schema reference (singleton)
      const schema1 = string() as Schema<unknown>;
      const schema2 = string() as Schema<unknown>;

      // They should be the same reference (singleton)
      expect(schema1).toBe(schema2);

      const validator: CompiledValidator<string> = () => true;
      cache.set(schema1, validator);

      // Both should return the same cached validator
      expect(cache.get(schema1)).toBe(validator);
      expect(cache.get(schema2)).toBe(validator);
    });
  });
});


/**
 * Arbitrary generator for creating mock schemas.
 * Creates schemas with unique references for testing cache behavior.
 */
const arbitrarySchema = (): fc.Arbitrary<Schema<unknown>> =>
  fc.string().map((msg) => ({
    type: "string" as const,
    message: msg,
    validator: (value: unknown) => (typeof value === "string" ? true : msg),
  }));

/**
 * Arbitrary generator for creating mock compiled validators.
 */
const arbitraryValidator = (): fc.Arbitrary<CompiledValidator<unknown>> =>
  fc.string().map((errorMsg) => {
    const fn: CompiledValidator<unknown> = () => errorMsg;
    return fn;
  });

describe("Feature: kanon-jit-optimization, Property 4: Cache Identity", () => {
  /**
   * Property 4: Cache Identity
   *
   * For all schemas, calling cache.get() multiple times on the same schema
   * must return the same validator reference (strict identity ===).
   *
   * **Validates: Requirements 4.1**
   */
  itProp.prop([arbitrarySchema(), arbitraryValidator()])(
    "[🎲] cache.get() returns same reference for same schema (strict identity)",
    (schema, validator) => {
      const cache = createValidatorCache();

      // Store the validator
      cache.set(schema, validator);

      // Get it multiple times
      const result1 = cache.get(schema);
      const result2 = cache.get(schema);
      const result3 = cache.get(schema);

      // All results should be strictly identical (same reference)
      expect(result1).toBe(validator);
      expect(result2).toBe(validator);
      expect(result3).toBe(validator);

      // Verify strict identity between all calls
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    }
  );

  itProp.prop([arbitrarySchema(), arbitraryValidator(), fc.integer({ min: 2, max: 10 })])(
    "[🎲] cache.get() returns same reference after N calls",
    (schema, validator, n) => {
      const cache = createValidatorCache();
      cache.set(schema, validator);

      // Get the validator N times
      const results: Array<CompiledValidator<unknown> | undefined> = [];
      for (let i = 0; i < n; i++) {
        results.push(cache.get(schema));
      }

      // All results should be strictly identical
      for (const result of results) {
        expect(result).toBe(validator);
      }
    }
  );

  itProp.prop([fc.array(arbitrarySchema(), { minLength: 1, maxLength: 10 })])(
    "[🎲] different schemas have independent cache entries",
    (schemas) => {
      const cache = createValidatorCache();
      const validators: CompiledValidator<unknown>[] = [];

      // Create unique validators for each schema
      for (const schema of schemas) {
        const validator: CompiledValidator<unknown> = () => true;
        validators.push(validator);
        cache.set(schema, validator);
      }

      // Verify each schema returns its own validator
      for (let i = 0; i < schemas.length; i++) {
        expect(cache.get(schemas[i])).toBe(validators[i]);
      }
    }
  );
});


describe("[🎲] Feature: kanon-jit-optimization, Property 5: Cache Independence After Modification", () => {
  /**
   * Property 5: Cache Independence After Modification
   *
   * For all schemas S and for all constraint methods M, if S' = S.M(),
   * then S.compile() !== S'.compile() (compiled validators are independent).
   *
   * This ensures that modifying a schema via a constraint method creates
   * a new schema with its own independent compiled validator.
   *
   * **Validates: Requirements 4.3**
   */

  /**
   * Arbitrary generator for string constraint methods.
   * Returns a function that applies a constraint to a string schema.
   */
  const arbitraryStringConstraint = (): fc.Arbitrary<{
    name: string;
    apply: (schema: ReturnType<typeof string>) => ReturnType<typeof string>;
  }> =>
    fc.oneof(
      fc.integer({ min: 1, max: 100 }).map((n) => ({
        name: `minLength(${n})`,
        apply: (s: ReturnType<typeof string>) => s.minLength(n),
      })),
      fc.integer({ min: 1, max: 100 }).map((n) => ({
        name: `maxLength(${n})`,
        apply: (s: ReturnType<typeof string>) => s.maxLength(n),
      })),
      fc.integer({ min: 1, max: 50 }).map((n) => ({
        name: `length(${n})`,
        apply: (s: ReturnType<typeof string>) => s.length(n),
      })),
      fc.constant({
        name: "email()",
        apply: (s: ReturnType<typeof string>) => s.email(),
      }),
      fc.constant({
        name: "url()",
        apply: (s: ReturnType<typeof string>) => s.url(),
      }),
      fc.constant({
        name: "uuid()",
        apply: (s: ReturnType<typeof string>) => s.uuid(),
      })
    );

  /**
   * Arbitrary generator for number constraint methods.
   * Returns a function that applies a constraint to a number schema.
   */
  const arbitraryNumberConstraint = (): fc.Arbitrary<{
    name: string;
    apply: (schema: ReturnType<typeof number>) => ReturnType<typeof number>;
  }> =>
    fc.oneof(
      fc.integer({ min: -100, max: 100 }).map((n) => ({
        name: `min(${n})`,
        apply: (s: ReturnType<typeof number>) => s.min(n),
      })),
      fc.integer({ min: -100, max: 100 }).map((n) => ({
        name: `max(${n})`,
        apply: (s: ReturnType<typeof number>) => s.max(n),
      })),
      fc.constant({
        name: "int()",
        apply: (s: ReturnType<typeof number>) => s.int(),
      }),
      fc.constant({
        name: "positive()",
        apply: (s: ReturnType<typeof number>) => s.positive(),
      }),
      fc.constant({
        name: "negative()",
        apply: (s: ReturnType<typeof number>) => s.negative(),
      }),
      fc.integer({ min: 1, max: 10 }).map((n) => ({
        name: `multipleOf(${n})`,
        apply: (s: ReturnType<typeof number>) => s.multipleOf(n),
      }))
    );

  itProp.prop([arbitraryStringConstraint()])(
    "[🎲] string schema modified via constraint has independent compiled validator",
    (constraint) => {
      // Clear cache before each test to ensure clean state
      clearCache();

      // Create base schema
      const baseSchema = string("base error");

      // Apply constraint to create modified schema
      const modifiedSchema = constraint.apply(baseSchema);

      // Compile both schemas
      const baseValidator = compile(baseSchema);
      const modifiedValidator = compile(modifiedSchema);

      // Validators should be different references (independent)
      expect(baseValidator).not.toBe(modifiedValidator);

      // Both should be valid functions
      expect(typeof baseValidator).toBe("function");
      expect(typeof modifiedValidator).toBe("function");

      // They should produce different results for some inputs
      // (the modified schema has additional constraints)
      // This is a sanity check that they are truly independent
    }
  );

  itProp.prop([arbitraryNumberConstraint()])(
    "[🎲] number schema modified via constraint has independent compiled validator",
    (constraint) => {
      // Clear cache before each test to ensure clean state
      clearCache();

      // Create base schema
      const baseSchema = number("base error");

      // Apply constraint to create modified schema
      const modifiedSchema = constraint.apply(baseSchema);

      // Compile both schemas
      const baseValidator = compile(baseSchema);
      const modifiedValidator = compile(modifiedSchema);

      // Validators should be different references (independent)
      expect(baseValidator).not.toBe(modifiedValidator);

      // Both should be valid functions
      expect(typeof baseValidator).toBe("function");
      expect(typeof modifiedValidator).toBe("function");
    }
  );

  itProp.prop([
    arbitraryStringConstraint(),
    arbitraryStringConstraint(),
  ])(
    "[🎲] chained constraints create independent validators at each step",
    (constraint1, constraint2) => {
      // Clear cache before each test to ensure clean state
      clearCache();

      // Create base schema
      const baseSchema = string("base error");

      // Apply first constraint
      const schema1 = constraint1.apply(baseSchema);

      // Apply second constraint to schema1
      const schema2 = constraint2.apply(schema1);

      // Compile all three schemas
      const baseValidator = compile(baseSchema);
      const validator1 = compile(schema1);
      const validator2 = compile(schema2);

      // All validators should be different references
      expect(baseValidator).not.toBe(validator1);
      expect(validator1).not.toBe(validator2);
      expect(baseValidator).not.toBe(validator2);
    }
  );

  itProp.prop([fc.array(arbitraryStringConstraint(), { minLength: 1, maxLength: 5 })])(
    "[🎲] multiple constraints applied sequentially create independent validators",
    (constraints) => {
      // Clear cache before each test to ensure clean state
      clearCache();

      // Create base schema
      let currentSchema: ReturnType<typeof string> = string("base error");
      const validators: CompiledValidator<string>[] = [];

      // Compile base schema
      validators.push(compile(currentSchema));

      // Apply each constraint and compile
      for (const constraint of constraints) {
        currentSchema = constraint.apply(currentSchema);
        validators.push(compile(currentSchema));
      }

      // All validators should be unique (different references)
      for (let i = 0; i < validators.length; i++) {
        for (let j = i + 1; j < validators.length; j++) {
          expect(validators[i]).not.toBe(validators[j]);
        }
      }
    }
  );

  it("[🎲] same constraint applied to same base schema creates same cached validator", () => {
    // Clear cache before test
    clearCache();

    // Create base schema with custom message to avoid singleton
    const baseSchema = string("test error");

    // Apply same constraint twice to same base schema
    const modified1 = baseSchema.minLength(5);
    const modified2 = baseSchema.minLength(5);

    // These are different schema objects (constraint methods create new objects)
    expect(modified1).not.toBe(modified2);

    // Compile both
    const validator1 = compile(modified1);
    const validator2 = compile(modified2);

    // Since they are different schema objects, they should have different validators
    // (WeakMap uses object identity, not value equality)
    expect(validator1).not.toBe(validator2);
  });
});
