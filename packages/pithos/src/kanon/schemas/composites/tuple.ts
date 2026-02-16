import { GenericSchema, isCoerced } from "@kanon/types/base";
import { TupleSchema, TupleWithRestSchema } from "@kanon/types/composites";
import { ERROR_MESSAGES_COMPOSITION } from "@kanon/core/consts/messages";

/**
 * Tuple schema - validates an array with specific types at each position.
 *
 * @param schemas - Array of schemas for each tuple position.
 * @param message - Custom error message.
 * @returns Schema that validates a tuple with the specified types.
 * @since 2.0.0
 */
export function tuple<T extends readonly GenericSchema[]>(
  schemas: T,
  message?: string
): TupleSchema<T> {
  return {
    type: "tuple" as const,
    message,
    refinements: undefined,
    items: schemas,
    validator: ((value: unknown) => {
      if (!Array.isArray(value)) {
        return message || ERROR_MESSAGES_COMPOSITION.tuple;
      }

      if (value.length !== schemas.length) {
        return (
          message ||
          ERROR_MESSAGES_COMPOSITION.tupleLength(schemas.length, value.length)
        );
      }

      let coercedArray: unknown[] | null = null;

      for (let i = 0; i < schemas.length; i++) {
        const result = schemas[i].validator(value[i]);
        if (result === true) {
          if (coercedArray) {
            coercedArray[i] = value[i];
          }
        } else if (isCoerced(result)) {
          if (!coercedArray) {
            coercedArray = value.slice(0, i);
          }
          coercedArray[i] = result.coerced;
        } else {
          return `Index ${i}: ${result}`;
        }
      }

      if (coercedArray) {
        return { coerced: coercedArray };
      }

      return true;
    }) as TupleSchema<T>["validator"],
  };
}

/**
 * Tuple schema with specific types for better ergonomics.
 *
 * @param schema1 - First schema.
 * @param schema2 - Second schema.
 * @param message - Custom error message (optional).
 * @returns TupleSchema with two elements.
 * @since 2.0.0
 */
export function tupleOf<S1 extends GenericSchema, S2 extends GenericSchema>(
  schema1: S1,
  schema2: S2,
  message?: string
): TupleSchema<readonly [S1, S2]> {
  const schemas = [schema1, schema2] as const;
  return tuple(schemas, message);
}

/**
 * Tuple schema with three specific types.
 *
 * @param schema1 - First schema.
 * @param schema2 - Second schema.
 * @param schema3 - Third schema.
 * @param message - Custom error message (optional).
 * @returns TupleSchema with three elements.
 * @since 2.0.0
 */
export function tupleOf3<
  S1 extends GenericSchema,
  S2 extends GenericSchema,
  S3 extends GenericSchema
>(
  schema1: S1,
  schema2: S2,
  schema3: S3,
  message?: string
): TupleSchema<readonly [S1, S2, S3]> {
  const schemas = [schema1, schema2, schema3] as const;
  return tuple(schemas, message);
}

/**
 * Tuple schema with four specific types.
 *
 * @param schema1 - First schema.
 * @param schema2 - Second schema.
 * @param schema3 - Third schema.
 * @param schema4 - Fourth schema.
 * @param message - Custom error message (optional).
 * @returns TupleSchema with four elements.
 * @since 2.0.0
 */
export function tupleOf4<
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
): TupleSchema<readonly [S1, S2, S3, S4]> {
  const schemas = [schema1, schema2, schema3, schema4] as const;
  return tuple(schemas, message);
}

/**
 * Tuple schema with variable length (rest).
 *
 * @param schemas - Array of schemas for fixed tuple positions.
 * @param restSchema - Schema for rest elements.
 * @param message - Custom error message (optional).
 * @returns TupleWithRestSchema with variable length.
 * @since 2.0.0
 */
export function tupleWithRest<
  T extends readonly GenericSchema[],
  R extends GenericSchema
>(
  schemas: T,
  restSchema: R,
  message?: string
): TupleWithRestSchema<T, R> {
  return {
    type: "tuple" as const,
    message,
    refinements: undefined,
    items: schemas,
    restSchema,
    validator: ((value: unknown) => {
      if (!Array.isArray(value)) {
        return message || ERROR_MESSAGES_COMPOSITION.tuple;
      }

      if (value.length < schemas.length) {
        return (
          message ||
          ERROR_MESSAGES_COMPOSITION.tupleMinLength(
            schemas.length,
            value.length
          )
        );
      }

      let coercedArray: unknown[] | null = null;

      for (let i = 0; i < schemas.length; i++) {
        const result = schemas[i].validator(value[i]);
        if (result === true) {
          if (coercedArray) {
            coercedArray[i] = value[i];
          }
        } else if (isCoerced(result)) {
          if (!coercedArray) {
            coercedArray = value.slice(0, i);
          }
          coercedArray[i] = result.coerced;
        } else {
          return `Index ${i}: ${result}`;
        }
      }

      for (let i = schemas.length; i < value.length; i++) {
        const result = restSchema.validator(value[i]);
        if (result === true) {
          if (coercedArray) {
            coercedArray[i] = value[i];
          }
        } else if (isCoerced(result)) {
          if (!coercedArray) {
            coercedArray = value.slice(0, i);
          }
          coercedArray[i] = result.coerced;
        } else {
          return `Index ${i}: ${result}`;
        }
      }

      if (coercedArray) {
        return { coerced: coercedArray };
      }

      return true;
    }) as TupleWithRestSchema<T, R>["validator"],
  };
}
