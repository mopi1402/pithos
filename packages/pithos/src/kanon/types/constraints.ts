/**
 * Constraint extensions for V3 schemas.
 *
 * @since 3.0.0
 */

import { Schema, GenericSchema, Infer } from "./base";

/**
 * Extension methods for string constraints.
 *
 * @since 3.0.0
 */
export type StringExtension = {
  minLength: (min: number, errorMessage?: string) => StringConstraint;
  maxLength: (max: number, errorMessage?: string) => StringConstraint;
  email: (errorMessage?: string) => StringConstraint;
  url: (errorMessage?: string) => StringConstraint;
  uuid: (errorMessage?: string) => StringConstraint;
  pattern: (regex: RegExp, errorMessage?: string) => StringConstraint;
  length: (length: number, errorMessage?: string) => StringConstraint;
  includes: (substring: string, errorMessage?: string) => StringConstraint;
  startsWith: (prefix: string, errorMessage?: string) => StringConstraint;
  endsWith: (suffix: string, errorMessage?: string) => StringConstraint;
};

/**
 * Extension methods for number constraints.
 *
 * @since 3.0.0
 */
export type NumberExtension = {
  min: (min: number, errorMessage?: string) => NumberConstraint;
  max: (max: number, errorMessage?: string) => NumberConstraint;
  int: (errorMessage?: string) => NumberConstraint;
  positive: (errorMessage?: string) => NumberConstraint;
  negative: (errorMessage?: string) => NumberConstraint;
  lt: (lessThan: number, errorMessage?: string) => NumberConstraint;
  lte: (lessThanOrEqual: number, errorMessage?: string) => NumberConstraint;
  gt: (greaterThan: number, errorMessage?: string) => NumberConstraint;
  gte: (greaterThanOrEqual: number, errorMessage?: string) => NumberConstraint;
  multipleOf: (multiple: number, errorMessage?: string) => NumberConstraint;
};

/**
 * Extension methods for array constraints.
 *
 * @template ItemSchema - The item schema type
 * @since 3.0.0
 */
export type ArrayExtension<ItemSchema extends GenericSchema> = {
  minLength: (min: number, errorMessage?: string) => ArrayConstraint<ItemSchema>;
  maxLength: (max: number, errorMessage?: string) => ArrayConstraint<ItemSchema>;
  length: (length: number, errorMessage?: string) => ArrayConstraint<ItemSchema>;
  unique: (errorMessage?: string) => ArrayConstraint<ItemSchema>;
};

/**
 * Extension methods for date constraints.
 *
 * @since 3.0.0
 */
export type DateExtension = {
  min: (min: Date, errorMessage?: string) => DateConstraint;
  max: (max: Date, errorMessage?: string) => DateConstraint;
  before: (before: Date, errorMessage?: string) => DateConstraint;
  after: (after: Date, errorMessage?: string) => DateConstraint;
};

/**
 * Extension methods for bigint constraints.
 *
 * @since 3.0.0
 */
export type BigIntExtension = {
  min: (min: bigint, errorMessage?: string) => BigIntConstraint;
  max: (max: bigint, errorMessage?: string) => BigIntConstraint;
  positive: (errorMessage?: string) => BigIntConstraint;
  negative: (errorMessage?: string) => BigIntConstraint;
};

/**
 * Extension methods for object constraints.
 *
 * @template T - The object entries type
 * @since 3.0.0
 */
export type ObjectExtension<T extends Record<string, GenericSchema> = Record<string, GenericSchema>> = {
  minKeys: (min: number, errorMessage?: string) => ObjectConstraint<T>;
  maxKeys: (max: number, errorMessage?: string) => ObjectConstraint<T>;
  strict: (errorMessage?: string) => ObjectConstraint<T>;
};

/**
 * Extension methods for set constraints.
 *
 * @template ItemSchema - The item schema type
 * @since 3.0.0
 */
export type SetExtension<ItemSchema extends GenericSchema> = {
  minSize: (min: number, errorMessage?: string) => SetConstraint<ItemSchema>;
  maxSize: (max: number, errorMessage?: string) => SetConstraint<ItemSchema>;
};

/**
 * Extension methods for map constraints.
 *
 * @template KeySchema - The key schema type
 * @template ValueSchema - The value schema type
 * @since 3.0.0
 */
export type MapExtension<KeySchema extends GenericSchema, ValueSchema extends GenericSchema> = {
  minSize: (min: number, errorMessage?: string) => MapConstraint<KeySchema, ValueSchema>;
  maxSize: (max: number, errorMessage?: string) => MapConstraint<KeySchema, ValueSchema>;
};

/**
 * String schema with constraint methods.
 *
 * @since 3.0.0
 */
export type StringConstraint = Schema<string> & StringExtension;

/**
 * Number schema with constraint methods.
 *
 * @since 3.0.0
 */
export type NumberConstraint = Schema<number> & NumberExtension;

/**
 * Array schema with constraint methods.
 *
 * @template ItemSchema - The item schema type
 * @since 3.0.0
 */
export type ArrayConstraint<ItemSchema extends GenericSchema = GenericSchema> =
  Schema<Infer<ItemSchema>[]> &
    ArrayExtension<ItemSchema> & {
      itemSchema: ItemSchema;
    };

/**
 * Date schema with constraint methods.
 *
 * @since 3.0.0
 */
export type DateConstraint = Schema<Date> & DateExtension;

/**
 * BigInt schema with constraint methods.
 *
 * @since 3.0.0
 */
export type BigIntConstraint = Schema<bigint> & BigIntExtension;

/**
 * Object schema with constraint methods.
 *
 * @template T - The object entries type
 * @since 3.0.0
 */
export type ObjectConstraint<
  T extends Record<string, GenericSchema> = Record<string, GenericSchema>
> = Schema<{ [K in keyof T]: Infer<T[K]> }> &
  ObjectExtension<T> & {
    entries: T;
  };

/**
 * Set schema with constraint methods.
 *
 * @template ItemSchema - The item schema type
 * @since 3.0.0
 */
export type SetConstraint<ItemSchema extends GenericSchema = GenericSchema> =
  Schema<Set<Infer<ItemSchema>>> &
    SetExtension<ItemSchema> & {
      itemSchema: ItemSchema;
    };

/**
 * Map schema with constraint methods.
 *
 * @template KeySchema - The key schema type
 * @template ValueSchema - The value schema type
 * @since 3.0.0
 */
export type MapConstraint<
  KeySchema extends GenericSchema = GenericSchema,
  ValueSchema extends GenericSchema = GenericSchema
> = Schema<Map<Infer<KeySchema>, Infer<ValueSchema>>> &
  MapExtension<KeySchema, ValueSchema> & {
    keySchema: KeySchema;
    valueSchema: ValueSchema;
  };
