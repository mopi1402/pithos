import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";
import { GenericSchema } from "@kanon/types/base";
import {
  UnionSchema,
  DiscriminatedUnionSchema,
} from "@kanon/types/operators";
import { EnumValue, LiteralSchema } from "@kanon/types/primitives";

/**
 * Union schema - accepts one of the specified types.
 *
 * @param schemas - Array of schemas to validate against.
 * @param message - Custom error message.
 * @returns Schema that validates if at least one schema is valid.
 */
function createUnionValidator<Schemas extends readonly GenericSchema[]>(
  schemas: Schemas,
  message?: string
): (value: unknown) => true | string {
  return (value: unknown) => {
    for (let i = 0; i < schemas.length; i++) {
      if (schemas[i].validator(value) === true) {
        return true;
      }
    }
    return message || ERROR_MESSAGES_COMPOSITION.union;
  };
}

/**
 * Union schema with specific types for better ergonomics.
 *
 * @param schema1 - First schema.
 * @param schema2 - Second schema.
 * @param message - Custom error message (optional).
 * @returns UnionSchema with two schemas.
 * @since 2.0.0
 */
export function unionOf<S1 extends GenericSchema, S2 extends GenericSchema>(
  schema1: S1,
  schema2: S2,
  message?: string
): UnionSchema<readonly [S1, S2]> {
  const schemas = [schema1, schema2] as const;
  return {
    type: "union" as const,
    message,
    refinements: undefined,
    schemas,
    validator: createUnionValidator(schemas, message),
  };
}

/**
 * Union schema with three specific types.
 *
 * @param schema1 - First schema.
 * @param schema2 - Second schema.
 * @param schema3 - Third schema.
 * @param message - Custom error message (optional).
 * @returns UnionSchema with three schemas.
 * @since 2.0.0
 */
export function unionOf3<
  S1 extends GenericSchema,
  S2 extends GenericSchema,
  S3 extends GenericSchema
>(
  schema1: S1,
  schema2: S2,
  schema3: S3,
  message?: string
): UnionSchema<readonly [S1, S2, S3]> {
  const schemas = [schema1, schema2, schema3] as const;
  return {
    type: "union" as const,
    message,
    refinements: undefined,
    schemas,
    validator: createUnionValidator(schemas, message),
  };
}

/**
 * Union schema with four specific types.
 *
 * @param schema1 - First schema.
 * @param schema2 - Second schema.
 * @param schema3 - Third schema.
 * @param schema4 - Fourth schema.
 * @param message - Custom error message (optional).
 * @returns UnionSchema with four schemas.
 * @since 2.0.0
 */
export function unionOf4<
  S1 extends GenericSchema,
  S2 extends GenericSchema,
  S3 extends GenericSchema,
  S4 extends GenericSchema
>(
  schema1: S1,
  schema2: S2,
  schema3: S3,
  schema4: S4,
  message?: string
): UnionSchema<readonly [S1, S2, S3, S4]> {
  const schemas = [schema1, schema2, schema3, schema4] as const;
  return {
    type: "union" as const,
    message,
    refinements: undefined,
    schemas,
    validator: createUnionValidator(schemas, message),
  };
}

/**
 * Discriminated union schema with O(1) lookup.
 *
 * Unlike regular unions that try each schema sequentially (O(n)),
 * discriminated unions use a discriminator field to directly lookup
 * the correct schema (O(1)).
 *
 * @param discriminator - The key used to discriminate between variants.
 * @param schemas - Array of object schemas with a literal discriminator field.
 * @param message - Custom error message (optional).
 * @returns DiscriminatedUnionSchema with O(1) lookup.
 * @throws {Error} If a schema doesn't have a literal discriminator field.
 * @throws {Error} If duplicate discriminator values are found.
 * @since 2.0.0
 *
 * @example
 * ```typescript
 * const schema = discriminatedUnion('type', [
 *   object({ type: literal('success'), data: string() }),
 *   object({ type: literal('error'), error: string() }),
 * ]);
 *
 * schema.validator({ type: 'success', data: 'hello' }); // true
 * schema.validator({ type: 'error', error: 'oops' }); // true
 * ```
 */
export function discriminatedUnion<
  Discriminator extends string,
  Schemas extends readonly GenericSchema[]
>(
  discriminator: Discriminator,
  schemas: [...Schemas],
  message?: string
): DiscriminatedUnionSchema<Discriminator, Schemas> {
  const schemaMap = new Map<EnumValue, GenericSchema>();

  for (let i = 0; i < schemas.length; i++) {
    const schema = schemas[i] as GenericSchema & {
      entries?: Record<string, GenericSchema>;
    };

    // Stryker disable next-line ConditionalExpression,LogicalOperator: Both conditions guard against invalid schema - all object() schemas have entries
    if (schema.type !== "object" || !schema.entries) {
      throw new Error(
        `Discriminated union option at index ${i} must be an object schema`
      );
    }

    const discriminatorSchema = schema.entries[discriminator];

    if (!discriminatorSchema || discriminatorSchema.type !== "literal") {
      throw new Error(
        `Discriminated union option at index ${i} must have a literal "${discriminator}" field`
      );
    }

    const literalValue = (discriminatorSchema as LiteralSchema<EnumValue>)
      .literalValue;

    if (schemaMap.has(literalValue)) {
      throw new Error(
        `Duplicate discriminator value "${String(
          literalValue
        )}" in discriminated union`
      );
    }

    schemaMap.set(literalValue, schema);
  }

  const validator = (value: unknown) => {
    if (typeof value !== "object" || value === null) {
      return message || ERROR_MESSAGES_COMPOSITION.object;
    }

    const obj = value as Record<string, unknown>;
    const discriminatorValue = obj[discriminator] as EnumValue | undefined;

    if (discriminatorValue === undefined) {
      return (
        message ||
        `Missing discriminator field "${discriminator}" in discriminated union`
      );
    }

    const matchedSchema = schemaMap.get(discriminatorValue);

    if (!matchedSchema) {
      return (
        message ||
        `Invalid discriminator value "${String(
          discriminatorValue
        )}" for field "${discriminator}"`
      );
    }

    return matchedSchema.validator(value);
  };

  return {
    type: "union" as const,
    message,
    refinements: undefined,
    discriminator,
    schemas: schemas as unknown as Schemas,
    schemaMap,
    validator,
  };
}
