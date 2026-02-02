/**
 * Specialized types for V3 primitives.
 *
 * @since 3.0.0
 */

import { Schema } from "./base";

/**
 * Valid values for enum schemas.
 *
 * @since 3.0.0
 */
export type EnumValue = string | number | boolean;

/**
 * Schema for any type (bypasses validation).
 *
 * @since 3.0.0
 */
// INTENTIONAL: needs 'any' because we accept any type in this schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnySchema = Schema<any> & { type: "any" };

/**
 * Schema for string values.
 *
 * @since 3.0.0
 */
export type StringSchema = Schema<string> & { type: "string" };

/**
 * Schema for number values.
 *
 * @since 3.0.0
 */
export type NumberSchema = Schema<number> & { type: "number" };

/**
 * Schema for boolean values.
 *
 * @since 3.0.0
 */
export type BooleanSchema = Schema<boolean> & { type: "boolean" };

/**
 * Schema for Date values.
 *
 * @since 3.0.0
 */
export type DateSchema = Schema<Date> & { type: "date" };

/**
 * Schema for bigint values.
 *
 * @since 3.0.0
 */
export type BigIntSchema = Schema<bigint> & { type: "bigint" };

/**
 * Schema for unknown values.
 *
 * @since 3.0.0
 */
export type UnknownSchema = Schema<unknown> & { type: "unknown" };

/**
 * Schema for null values.
 *
 * @since 3.0.0
 */
export type NullSchema = Schema<null> & { type: "null" };

/**
 * Schema for undefined values.
 *
 * @since 3.0.0
 */
export type UndefinedSchema = Schema<undefined> & { type: "undefined" };

/**
 * Schema for void values.
 *
 * @since 3.0.0
 */
export type VoidSchema = Schema<void> & { type: "void" };

/**
 * Schema for never type (always fails validation).
 *
 * @since 3.0.0
 */
export type NeverSchema = Schema<never> & { type: "never" };

/**
 * Schema for symbol values.
 *
 * @since 3.0.0
 */
export type SymbolSchema = Schema<symbol> & { type: "symbol" };

/**
 * Schema for integer values.
 *
 * @since 3.0.0
 */
export type IntSchema = Schema<number> & { type: "int" };

/**
 * Schema for enum values.
 *
 * @template T - The enum value type
 * @since 3.0.0
 */
export type EnumSchema<T extends EnumValue> = Schema<T> & {
  type: "enum";
  enumValues: readonly T[];
};

/**
 * Schema for literal values.
 *
 * @template T - The literal value type
 * @since 3.0.0
 */
export type LiteralSchema<T extends EnumValue> = Schema<T> & {
  type: "literal";
  literalValue: T;
};

/**
 * Schema for native TypeScript enums.
 *
 * @template T - The enum member type
 * @template E - The enum object type
 * @since 3.0.0
 */
export type NativeEnumSchema<
  T extends string | number,
  E extends Record<string, string | number> = Record<string, string | number>
> = Schema<T> & {
  type: "nativeEnum";
  enumValues: readonly T[];
  enumObj: E;
};