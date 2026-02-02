import { IntersectionSchema } from "@kanon/types/operators";
import { GenericSchema } from "@kanon/types/base";

/**
 * Creates a validator for intersection.
 */
function createIntersectionValidator<Schemas extends readonly GenericSchema[]>(
  schemas: Schemas,
  message?: string
): (value: unknown) => true | string {
  return (value: unknown) => {
    for (let i = 0; i < schemas.length; i++) {
      const result = schemas[i].validator(value);
      if (typeof result === "string") {
        return message || result;
      }
    }
    return true;
  };
}

/**
 * Intersection schema - validates that the value satisfies multiple schemas.
 *
 * @param schema1 - First schema.
 * @param schema2 - Second schema.
 * @param message - Custom error message.
 * @returns Schema that validates the intersection of both schemas.
 * @since 3.0.0
 */
export function intersection<
  S1 extends GenericSchema,
  S2 extends GenericSchema
>(
  schema1: S1,
  schema2: S2,
  message?: string
): IntersectionSchema<readonly [S1, S2]> {
  const schemas = [schema1, schema2] as const;

  return {
    type: "intersection" as const,
    message,
    refinements: undefined,
    schemas,
    validator: createIntersectionValidator(schemas, message),
  };
}

/**
 * Intersection schema with 3 schemas.
 *
 * @param schema1 - First schema.
 * @param schema2 - Second schema.
 * @param schema3 - Third schema.
 * @param message - Custom error message (optional).
 * @returns IntersectionSchema with three schemas.
 * @since 3.0.0
 */
export function intersection3<
  S1 extends GenericSchema,
  S2 extends GenericSchema,
  S3 extends GenericSchema
>(
  schema1: S1,
  schema2: S2,
  schema3: S3,
  message?: string
): IntersectionSchema<readonly [S1, S2, S3]> {
  const schemas = [schema1, schema2, schema3] as const;

  return {
    type: "intersection" as const,
    message,
    refinements: undefined,
    schemas,
    validator: createIntersectionValidator(schemas, message),
  };
}
