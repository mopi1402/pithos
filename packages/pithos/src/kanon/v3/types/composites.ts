/**
 * Specialized types for V3 composite schemas.
 *
 * @since 3.0.0
 */

import { GenericSchema, Schema, Infer } from "./base";

/**
 * Schema for object values with typed entries.
 *
 * @template T - The object entries type
 * @since 3.0.0
 */
export type ObjectSchema<
  T extends Record<string, GenericSchema> = Record<string, GenericSchema>
> = Schema<{ [K in keyof T]: Infer<T[K]> }> & {
  type: "object";
  entries: T;
};

/**
 * Schema for array values with typed items.
 *
 * @template T - The item schema type
 * @since 3.0.0
 */
export type ArraySchema<T extends GenericSchema = GenericSchema> =
  Schema<Infer<T>[]> & {
    type: "array";
    itemSchema: T;
  };

/**
 * Schema for tuple values with typed items.
 *
 * @template T - The tuple items type
 * @since 3.0.0
 */
export type TupleSchema<
  T extends readonly GenericSchema[] = readonly GenericSchema[]
> = Schema<{ [K in keyof T]: Infer<T[K]> }> & {
  type: "tuple";
  items: T;
};

/**
 * Tuple schema with rest elements.
 *
 * @template T - The tuple items type
 * @template Rest - The rest element schema type
 * @since 3.0.0
 * @note To distinguish from `TupleSchema` at runtime, use the `hasTupleRest` type guard:
 * ```typescript
 * if (hasTupleRest(schema)) {
 *   // This is a TupleWithRestSchema
 * }
 * ```
 */
export type TupleWithRestSchema<
  T extends readonly GenericSchema[],
  Rest extends GenericSchema
> = Schema<[...{ [K in keyof T]: Infer<T[K]> }, ...Infer<Rest>[]]> & {
  type: "tuple";
  items: T;
  restSchema: Rest;
};

/**
 * Type guard to distinguish TupleWithRestSchema from TupleSchema at runtime.
 *
 * @param schema - Schema to check
 * @returns True if the schema is a TupleWithRestSchema
 * @since 3.0.0
 */
export function hasTupleRest<
  T extends readonly GenericSchema[],
  R extends GenericSchema
>(
  schema: TupleSchema<T> | TupleWithRestSchema<T, R>
): schema is TupleWithRestSchema<T, R> {
  return "restSchema" in schema;
}

/**
 * Schema for record values with typed keys and values.
 *
 * @template KeySchema - The key schema type
 * @template ValueSchema - The value schema type
 * @since 3.0.0
 */
export type RecordSchema<
  KeySchema extends GenericSchema,
  ValueSchema extends GenericSchema
> = Schema<Record<Infer<KeySchema> & string, Infer<ValueSchema>>> & {
  type: "record";
  keySchema: KeySchema;
  valueSchema: ValueSchema;
};

/**
 * Schema for Map values with typed keys and values.
 *
 * @template KeySchema - The key schema type
 * @template ValueSchema - The value schema type
 * @since 3.0.0
 */
export type MapSchema<
  KeySchema extends GenericSchema = GenericSchema,
  ValueSchema extends GenericSchema = GenericSchema
> = Schema<Map<Infer<KeySchema>, Infer<ValueSchema>>> & {
  type: "map";
  keySchema: KeySchema;
  valueSchema: ValueSchema;
};

/**
 * Schema for Set values with typed items.
 *
 * @template ItemSchema - The item schema type
 * @since 3.0.0
 */
export type SetSchema<ItemSchema extends GenericSchema = GenericSchema> = Schema<
  Set<Infer<ItemSchema>>
> & {
  type: "set";
  itemSchema: ItemSchema;
};
