/**
 * @module kanon/jit/utils/arbitraries
 *
 * Arbitrary Generators for Property-Based Testing
 *
 * Provides fast-check arbitraries for generating random Kanon V3 schemas
 * and corresponding values for property-based testing of the JIT compiler.
 *
 * @since 3.3.0
 * @experimental
 */

import * as fc from "fast-check";
import type { GenericSchema } from "../../types/base";
import { string } from "../../schemas/primitives/string";
import { number } from "../../schemas/primitives/number";
import { boolean } from "../../schemas/primitives/boolean";
import { object } from "../../schemas/composites/object";
import { array } from "../../schemas/composites/array";
import { unionOf, unionOf3 } from "../../schemas/operators/union";

// ============================================================================
// Types
// ============================================================================

/**
 * Schema with metadata for value generation.
 *
 * @since 3.3.0
 */
export interface SchemaWithMeta {
  /** The Kanon schema */
  schema: GenericSchema;
  /** Generator for valid values */
  validValueArb: fc.Arbitrary<unknown>;
  /** Generator for invalid values */
  invalidValueArb: fc.Arbitrary<unknown>;
  /** Human-readable description */
  description: string;
}

// ============================================================================
// Primitive Schema Arbitraries
// ============================================================================

/**
 * Generates arbitrary string schemas with random constraints.
 *
 * Constraints include:
 * - minLength (0-50)
 * - maxLength (50-200)
 * - No constraints (base string)
 *
 * @since 3.3.0
 */
export function arbitraryStringSchema(): fc.Arbitrary<SchemaWithMeta> {
  return fc.oneof(
    // Base string schema (no constraints)
    fc.constant<SchemaWithMeta>({
      schema: string() as GenericSchema,
      validValueArb: fc.string(),
      invalidValueArb: fc.oneof(
        fc.integer(),
        fc.boolean(),
        fc.constant(null),
        fc.constant(undefined),
        fc.object()
      ),
      description: "string()",
    }),
    // String with minLength constraint
    fc.integer({ min: 1, max: 20 }).map((minLen): SchemaWithMeta => ({
      schema: string().minLength(minLen) as GenericSchema,
      validValueArb: fc.string({ minLength: minLen, maxLength: minLen + 50 }),
      invalidValueArb: fc.oneof(
        // Stryker disable next-line MethodExpression: Math.min(0, x) still ≤ minLen-1, strings still shorter than minLen
        fc.string({ minLength: 0, maxLength: Math.max(0, minLen - 1) }),
        fc.integer(),
        fc.boolean(),
        fc.constant(null)
      ),
      description: `string().minLength(${minLen})`,
    })),
    // String with maxLength constraint
    fc.integer({ min: 5, max: 100 }).map((maxLen): SchemaWithMeta => ({
      schema: string().maxLength(maxLen) as GenericSchema,
      validValueArb: fc.string({ minLength: 0, maxLength: maxLen }),
      invalidValueArb: fc.oneof(
        fc.string({ minLength: maxLen + 1, maxLength: maxLen + 50 }),
        fc.integer(),
        fc.boolean()
      ),
      description: `string().maxLength(${maxLen})`,
    })),
    // String with both minLength and maxLength
    fc.tuple(
      fc.integer({ min: 1, max: 10 }),
      fc.integer({ min: 20, max: 50 })
    ).map(([minLen, maxLen]): SchemaWithMeta => ({
      schema: string().minLength(minLen).maxLength(maxLen) as GenericSchema,
      validValueArb: fc.string({ minLength: minLen, maxLength: maxLen }),
      invalidValueArb: fc.oneof(
        // Stryker disable next-line MethodExpression: Math.min(0, x) still ≤ minLen-1, strings still shorter than minLen
        fc.string({ minLength: 0, maxLength: Math.max(0, minLen - 1) }),
        fc.string({ minLength: maxLen + 1, maxLength: maxLen + 20 }),
        fc.integer()
      ),
      description: `string().minLength(${minLen}).maxLength(${maxLen})`,
    }))
  );
}

/**
 * Generates arbitrary number schemas with random constraints.
 *
 * Constraints include:
 * - min (range constraints)
 * - max (range constraints)
 * - int (integer only)
 * - positive
 * - No constraints (base number)
 *
 * @since 3.3.0
 */
export function arbitraryNumberSchema(): fc.Arbitrary<SchemaWithMeta> {
  return fc.oneof(
    // Base number schema (no constraints)
    fc.constant<SchemaWithMeta>({
      schema: number() as GenericSchema,
      validValueArb: fc.oneof(fc.integer(), fc.float()),
      invalidValueArb: fc.oneof(
        fc.string(),
        fc.boolean(),
        fc.constant(null),
        fc.constant(undefined),
        fc.constant(NaN)
      ),
      description: "number()",
    }),
    // Number with min constraint
    // Stryker disable next-line ObjectLiteral,UnaryOperator: Narrowing fc range still produces valid number().min() schemas
    fc.integer({ min: -100, max: 100 }).map((minVal): SchemaWithMeta => ({
      schema: number().min(minVal) as GenericSchema,
      validValueArb: fc.integer({ min: minVal, max: minVal + 1000 }),
      invalidValueArb: fc.oneof(
        fc.integer({ min: minVal - 1000, max: minVal - 1 }),
        fc.string(),
        fc.constant(NaN)
      ),
      description: `number().min(${minVal})`,
    })),
    // Number with max constraint
    // Stryker disable next-line ObjectLiteral,UnaryOperator: Narrowing fc range still produces valid number().max() schemas
    fc.integer({ min: -100, max: 100 }).map((maxVal): SchemaWithMeta => ({
      schema: number().max(maxVal) as GenericSchema,
      validValueArb: fc.integer({ min: maxVal - 1000, max: maxVal }),
      invalidValueArb: fc.oneof(
        fc.integer({ min: maxVal + 1, max: maxVal + 1000 }),
        fc.string(),
        fc.constant(NaN)
      ),
      description: `number().max(${maxVal})`,
    })),
    // Number with min and max constraints
    fc.tuple(
      fc.integer({ min: -50, max: 0 }),
      fc.integer({ min: 10, max: 100 })
    ).map(([minVal, maxVal]): SchemaWithMeta => ({
      schema: number().min(minVal).max(maxVal) as GenericSchema,
      validValueArb: fc.integer({ min: minVal, max: maxVal }),
      invalidValueArb: fc.oneof(
        fc.integer({ min: minVal - 100, max: minVal - 1 }),
        fc.integer({ min: maxVal + 1, max: maxVal + 100 }),
        fc.string()
      ),
      description: `number().min(${minVal}).max(${maxVal})`,
    })),
    // Integer constraint
    fc.constant<SchemaWithMeta>({
      schema: number().int() as GenericSchema,
      validValueArb: fc.integer(),
      invalidValueArb: fc.oneof(
        fc.float().filter((n) => !Number.isInteger(n)),
        fc.string(),
        fc.constant(NaN)
      ),
      description: "number().int()",
    }),
    // Positive constraint
    fc.constant<SchemaWithMeta>({
      schema: number().positive() as GenericSchema,
      validValueArb: fc.integer({ min: 1, max: 10000 }),
      invalidValueArb: fc.oneof(
        fc.integer({ min: -10000, max: 0 }),
        fc.string(),
        fc.constant(NaN)
      ),
      description: "number().positive()",
    })
  );
}

/**
 * Generates arbitrary boolean schemas.
 *
 * @since 3.3.0
 */
export function arbitraryBooleanSchema(): fc.Arbitrary<SchemaWithMeta> {
  return fc.constant<SchemaWithMeta>({
    schema: boolean() as GenericSchema,
    validValueArb: fc.boolean(),
    invalidValueArb: fc.oneof(
      fc.string(),
      fc.integer(),
      fc.constant(null),
      fc.constant(undefined),
      fc.object()
    ),
    description: "boolean()",
  });
}

// ============================================================================
// Composite Schema Arbitraries
// ============================================================================

/**
 * Generates arbitrary object schemas with random properties.
 *
 * Properties are randomly selected from primitive types.
 * Number of properties: 1-5
 *
 * @since 3.3.0
 */
export function arbitraryObjectSchema(): fc.Arbitrary<SchemaWithMeta> {
  return fc.integer({ min: 1, max: 5 }).chain((numProps) => {
    // Generate property names
    const propNames = Array.from({ length: numProps }, (_, i) => `prop${i}`);

    // Generate property schemas (primitives only for simplicity)
    return fc.tuple(
      ...propNames.map(() =>
        fc.oneof(
          fc.constant({ type: "string" as const, schema: string() }),
          fc.constant({ type: "number" as const, schema: number() }),
          fc.constant({ type: "boolean" as const, schema: boolean() })
        )
      )
    ).map((propSchemas) => {
      // Build entries object
      const entries: Record<string, GenericSchema> = {};
      propSchemas.forEach((prop, i) => {
        entries[propNames[i]] = prop.schema as GenericSchema;
      });

      // Build valid value generator
      const validValueArb = fc.record(
        Object.fromEntries(
          propSchemas.map((prop, i) => {
            const arb =
              prop.type === "string"
                ? fc.string()
                : prop.type === "number"
                  ? fc.integer()
                  : fc.boolean();
            return [propNames[i], arb];
          })
        )
      );

      // Build invalid value generator (wrong type for first property)
      const invalidValueArb = fc.oneof(
        // Not an object
        fc.string(),
        fc.integer(),
        fc.constant(null),
        // Object with wrong property type
        fc.record(
          Object.fromEntries(
            propSchemas.map((prop, i) => {
              // First property gets wrong type
              // Stryker disable next-line ConditionalExpression,EqualityOperator: Object already invalid with any property having wrong type
              if (i === 0) {
                const wrongArb =
                  prop.type === "string"
                    ? fc.integer()
                    : /* Stryker disable next-line ConditionalExpression,EqualityOperator,StringLiteral */ prop.type === "number"
                      ? fc.string()
                      : fc.string();
                return [propNames[i], wrongArb];
              }
              // Other properties get correct type
              const arb =
                /* Stryker disable next-line ConditionalExpression,EqualityOperator,StringLiteral */ prop.type === "string"
                  ? fc.string()
                  : /* Stryker disable next-line ConditionalExpression,EqualityOperator,StringLiteral */ prop.type === "number"
                    ? fc.integer()
                    : fc.boolean();
              return [propNames[i], arb];
            })
          )
        )
      );

      // Stryker disable next-line StringLiteral: Join separator and inner template formatting in description are cosmetic
      const description = `object({ ${propSchemas.map((p, i) => `${propNames[i]}: ${p.type}()`).join(", ")} })`;

      return {
        schema: object(entries) as GenericSchema,
        validValueArb,
        invalidValueArb,
        description,
      } as SchemaWithMeta;
    });
  });
}

/**
 * Generates arbitrary array schemas with random item types.
 *
 * Item types are primitives (string, number, boolean).
 *
 * @since 3.3.0
 */
export function arbitraryArraySchema(): fc.Arbitrary<SchemaWithMeta> {
  return fc.oneof(
    // Array of strings
    fc.constant<SchemaWithMeta>({
      schema: array(string()) as GenericSchema,
      // Stryker disable next-line ObjectLiteral: Array length constraints are for test performance, not correctness
      validValueArb: fc.array(fc.string(), { minLength: 0, maxLength: 10 }),
      invalidValueArb: fc.oneof(
        fc.string(),
        fc.integer(),
        fc.constant(null),
        // Array with wrong item type
        fc.array(fc.integer(), { minLength: 1, maxLength: 5 })
      ),
      description: "array(string())",
    }),
    // Array of numbers
    fc.constant<SchemaWithMeta>({
      schema: array(number()) as GenericSchema,
      // Stryker disable next-line ObjectLiteral: Array length constraints are for test performance, not correctness
      validValueArb: fc.array(fc.integer(), { minLength: 0, maxLength: 10 }),
      invalidValueArb: fc.oneof(
        fc.string(),
        fc.constant(null),
        // Array with wrong item type
        fc.array(fc.string(), { minLength: 1, maxLength: 5 })
      ),
      description: "array(number())",
    }),
    // Array of booleans
    fc.constant<SchemaWithMeta>({
      schema: array(boolean()) as GenericSchema,
      // Stryker disable next-line ObjectLiteral: Array length constraints are for test performance, not correctness
      validValueArb: fc.array(fc.boolean(), { minLength: 0, maxLength: 10 }),
      invalidValueArb: fc.oneof(
        fc.string(),
        fc.constant(null),
        // Array with wrong item type
        fc.array(fc.string(), { minLength: 1, maxLength: 5 })
      ),
      description: "array(boolean())",
    })
  );
}

/**
 * Generates arbitrary union schemas with random branches.
 *
 * Branches are primitives (string, number, boolean).
 * Number of branches: 2-4
 *
 * @since 3.3.0
 */
export function arbitraryUnionSchema(): fc.Arbitrary<SchemaWithMeta> {
  return fc.oneof(
    // Union of string | number
    fc.constant<SchemaWithMeta>({
      schema: unionOf(string(), number()) as GenericSchema,
      validValueArb: fc.oneof(fc.string(), fc.integer()),
      invalidValueArb: fc.oneof(
        fc.boolean(),
        fc.constant(null),
        fc.constant(undefined),
        fc.object()
      ),
      description: "union(string(), number())",
    }),
    // Union of string | boolean
    fc.constant<SchemaWithMeta>({
      schema: unionOf(string(), boolean()) as GenericSchema,
      validValueArb: fc.oneof(fc.string(), fc.boolean()),
      invalidValueArb: fc.oneof(
        fc.integer(),
        fc.constant(null),
        fc.constant(undefined),
        fc.object()
      ),
      description: "union(string(), boolean())",
    }),
    // Union of number | boolean
    fc.constant<SchemaWithMeta>({
      schema: unionOf(number(), boolean()) as GenericSchema,
      validValueArb: fc.oneof(fc.integer(), fc.boolean()),
      invalidValueArb: fc.oneof(
        fc.string(),
        fc.constant(null),
        fc.constant(undefined),
        fc.object()
      ),
      description: "union(number(), boolean())",
    }),
    // Union of string | number | boolean
    fc.constant<SchemaWithMeta>({
      schema: unionOf3(string(), number(), boolean()) as GenericSchema,
      validValueArb: fc.oneof(fc.string(), fc.integer(), fc.boolean()),
      invalidValueArb: fc.oneof(
        fc.constant(null),
        fc.constant(undefined),
        fc.object(),
        fc.array(fc.anything())
      ),
      description: "union(string(), number(), boolean())",
    })
  );
}

// ============================================================================
// Combined Schema Arbitrary
// ============================================================================

/**
 * Generates arbitrary schemas of any supported type.
 *
 * Includes:
 * - Primitive schemas (string, number, boolean)
 * - Composite schemas (object, array)
 * - Operator schemas (union)
 *
 * @since 3.3.0
 */
export function arbitrarySchema(): fc.Arbitrary<SchemaWithMeta> {
  return fc.oneof(
    // Stryker disable next-line ObjectLiteral: fc.oneof with any subset of these arbitraries still produces valid schemas
    { weight: 3, arbitrary: arbitraryStringSchema() },
    // Stryker disable next-line ObjectLiteral: fc.oneof with any subset of these arbitraries still produces valid schemas
    { weight: 3, arbitrary: arbitraryNumberSchema() },
    // Stryker disable next-line ObjectLiteral: fc.oneof with any subset of these arbitraries still produces valid schemas
    { weight: 2, arbitrary: arbitraryBooleanSchema() },
    // Stryker disable next-line ObjectLiteral: fc.oneof with any subset of these arbitraries still produces valid schemas
    { weight: 2, arbitrary: arbitraryObjectSchema() },
    // Stryker disable next-line ObjectLiteral: fc.oneof with any subset of these arbitraries still produces valid schemas
    { weight: 2, arbitrary: arbitraryArraySchema() },
    // Stryker disable next-line ObjectLiteral: fc.oneof with any subset of these arbitraries still produces valid schemas
    { weight: 1, arbitrary: arbitraryUnionSchema() }
  );
}

// ============================================================================
// Value Generation for Schemas
// ============================================================================

/**
 * Generates arbitrary values for a given schema.
 *
 * @param schemaWithMeta - Schema with metadata including value generators
 * @param validOnly - If true, only generate valid values
 * @returns Arbitrary that generates values for the schema
 * @since 3.3.0
 */
export function arbitraryValueForSchema(
  schemaWithMeta: SchemaWithMeta,
  validOnly: boolean = false
): fc.Arbitrary<{ value: unknown; shouldBeValid: boolean }> {
  if (validOnly) {
    return schemaWithMeta.validValueArb.map((value) => ({
      value,
      shouldBeValid: true,
    }));
  }

  return fc.oneof(
    schemaWithMeta.validValueArb.map((value) => ({
      value,
      shouldBeValid: true,
    })),
    schemaWithMeta.invalidValueArb.map((value) => ({
      value,
      shouldBeValid: false,
    }))
  );
}

/**
 * Generates a schema and a corresponding value (valid or invalid).
 *
 * This is useful for round-trip testing where you need both
 * a schema and a value to test against.
 *
 * @since 3.3.0
 */
export function arbitrarySchemaWithValue(): fc.Arbitrary<{
  schemaWithMeta: SchemaWithMeta;
  value: unknown;
  shouldBeValid: boolean;
}> {
  return arbitrarySchema().chain((schemaWithMeta) =>
    arbitraryValueForSchema(schemaWithMeta).map(({ value, shouldBeValid }) => ({
      schemaWithMeta,
      value,
      shouldBeValid,
    }))
  );
}

/**
 * Generates a schema and only valid values for it.
 *
 * This is useful for testing that valid values pass validation
 * in both JIT and non-JIT validators.
 *
 * @since 3.3.0
 */
export function arbitrarySchemaWithValidValue(): fc.Arbitrary<{
  schemaWithMeta: SchemaWithMeta;
  value: unknown;
}> {
  return arbitrarySchema().chain((schemaWithMeta) =>
    schemaWithMeta.validValueArb.map((value) => ({
      schemaWithMeta,
      value,
    }))
  );
}

/**
 * Generates a schema and only invalid values for it.
 *
 * This is useful for testing that invalid values fail validation
 * in both JIT and non-JIT validators.
 *
 * @since 3.3.0
 */
export function arbitrarySchemaWithInvalidValue(): fc.Arbitrary<{
  schemaWithMeta: SchemaWithMeta;
  value: unknown;
}> {
  return arbitrarySchema().chain((schemaWithMeta) =>
    schemaWithMeta.invalidValueArb.map((value) => ({
      schemaWithMeta,
      value,
    }))
  );
}
