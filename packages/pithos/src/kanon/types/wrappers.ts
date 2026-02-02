/**
 * Specialized types for V3 schema wrappers (nullable, optional, default, readonly, lazy).
 *
 * @since 3.0.0
 */

import { Schema, GenericSchema, Infer, SchemaWrapperType } from "./base";

/**
 * Schema for nullable values.
 *
 * @template Inner - The inner schema type
 * @since 3.0.0
 */
export type NullableSchema<Inner extends GenericSchema> = Schema<
  Infer<Inner> | null
> & {
  type: "nullable";
  innerSchema: Inner;
};

/**
 * Schema for optional values.
 *
 * @template Inner - The inner schema type
 * @since 3.0.0
 */
export type OptionalSchema<Inner extends GenericSchema> = Schema<
  Infer<Inner> | undefined
> & {
  type: "optional";
  innerSchema: Inner;
};

/**
 * Schema for nullish values (null or undefined).
 *
 * @template Inner - The inner schema type
 * @since 3.0.0
 */
export type NullishSchema<Inner extends GenericSchema> = Schema<
  Infer<Inner> | null | undefined
> & {
  type: "nullish";
  innerSchema: Inner;
};

/**
 * Schema with default value.
 *
 * @template Inner - The inner schema type
 * @since 3.0.0
 */
export type DefaultSchema<Inner extends GenericSchema> = Schema<
  Infer<Inner>
> & {
  type: "default";
  innerSchema: Inner;
  defaultValue: Infer<Inner> | (() => Infer<Inner>);
};

/**
 * Schema for readonly values.
 *
 * @template Inner - The inner schema type
 * @since 3.0.0
 */
export type ReadonlySchema<Inner extends GenericSchema> = Schema<
  Readonly<Infer<Inner>>
> & {
  type: "readonly";
  innerSchema: Inner;
};

/**
 * Schema for lazy evaluation.
 *
 * @template Value - The value type
 * @since 3.0.0
 */
export type LazySchema<Value> = Schema<Value> & {
  type: "lazy";
  getter: () => Schema<Value>;
};

/**
 * Extracts the inner schema type from a wrapper schema.
 *
 * @template S - The wrapper schema type
 * @returns The inner schema type, or never if not a wrapper
 * @since 3.0.0
 * @example
 * ```typescript
 * type Inner = UnwrapSchema<NullableSchema<StringSchema>>; // StringSchema
 * type Inner2 = UnwrapSchema<DefaultSchema<NumberSchema>>; // NumberSchema
 * ```
 */
export type UnwrapSchema<S> = S extends { innerSchema: infer I }
  ? I extends GenericSchema
    ? I
    : never
  : S extends { getter: () => infer G }
    ? G extends Schema<infer V>
      ? Schema<V>
      : never
    : never;

/**
 * Checks if a schema is a wrapper schema.
 *
 * @template S - The schema type to check
 * @returns true if the schema is a wrapper, false otherwise
 * @since 3.0.0
 */
export type IsWrapper<S> = S extends { type: SchemaWrapperType } ? true : false;