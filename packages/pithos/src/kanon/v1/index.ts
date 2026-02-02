/**
 * Pithos Validation (Kanon) - Main validation module
 *
 * This module provides a comprehensive validation library similar to Zod but optimized for performance.
 * It includes primitive types, composite types, constraints, and utility functions for data validation.
 *
 * @since 1.1.0
 * @example
 * ```typescript
 * import { validation } from "@kanon/validation";
 *
 * const userSchema = validation.object({
 *   name: validation.string().minLength(1),
 *   age: validation.number().minimum(0),
 *   email: validation.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
 * });
 *
 * const result = userSchema.safeParse({ name: "John", age: 25, email: "john@example.com" });
 * if (result.success) {
 *   console.log("Valid user:", result.data);
 * }
 * ```
 */

import {
  string,
  number,
  int,
  boolean,
  null_,
  undefined_,
  bigint,
  date,
  any,
  symbol,
  unknown,
  never,
  void_,
} from "@kanon/v1/core/primitives";
import {
  array,
  object,
  union,
  literal,
  tuple,
  record,
  map,
  set,
  enum_,
  nativeEnum,
  intersection,
  strictObject,
  looseObject,
  keyof,
  partial,
  required,
  pick,
  omit,
} from "@kanon/v1/core/composites";
import {
  optional,
  nullable,
  default_,
  readonly,
  catch_,
} from "@kanon/v1/core/wrappers";
import {
  lt,
  lte,
  gt,
  gte,
  minimum,
  maximum,
  minLength,
  maxLength,
  length,
  regex,
  includes,
  startsWith,
  endsWith,
  lowercase,
  uppercase,
  overwrite,
  refine,
} from "@kanon/v1/core/constraints";
import {
  parse,
  safeParse,
  parseAsync,
  safeParseAsync,
} from "@kanon/v1/core/parsing";
import { addCheckMethod } from "@kanon/v1/utils/add-check-method";
import { lazy } from "@kanon/v1/schemas/concepts/lazy";
import type { PithosType } from "@kanon/v1/types/base";
import { PithosCoerceString } from "@kanon/v1/schemas/concepts/coerce/string";
import { PithosCoerceNumber } from "@kanon/v1/schemas/concepts/coerce/number";
import { PithosCoerceBoolean } from "@kanon/v1/schemas/concepts/coerce/boolean";
import { PithosCoerceBigInt } from "@kanon/v1/schemas/concepts/coerce/bigint";
import { PithosCoerceDate } from "@kanon/v1/schemas/concepts/coerce/date";

/**
 * Validation object containing all validation functions and utilities
 *
 * This object provides access to:
 * - Primitive types (string, number, boolean, etc.)
 * - Composite types (object, array, union, etc.)
 * - Wrapper functions (optional, nullable, default, etc.)
 * - Constraint functions (minLength, maxLength, regex, etc.)
 * - Parsing functions (parse, safeParse, parseAsync, etc.)
 * - Utility functions (transform, pipe, preprocess, etc.)
 *
 * @since 1.1.0
 */
const validationObj = {
  // Primitive types
  string,
  number,
  int,
  boolean,
  null: null_,
  undefined: undefined_,
  bigint,
  date,
  any,
  symbol,
  unknown,
  never,
  void: void_,

  // Composite types
  array,
  object,
  union,
  literal,
  tuple,
  record,
  map,
  set,
  enum: enum_,
  nativeEnum,
  intersection,
  strictObject,
  looseObject,
  keyof,
  partial,
  required,
  pick,
  omit,

  // Wrapper functions
  optional,
  nullable,
  default: default_,
  readonly,
  catch: catch_,

  // Constraint functions
  lt,
  lte,
  gt,
  gte,
  minimum,
  maximum,
  minLength,
  maxLength,
  length,
  regex,
  includes,
  startsWith,
  endsWith,
  lowercase,
  uppercase,
  overwrite,
  refine,

  // Parsing functions
  parse,
  safeParse,
  parseAsync,
  safeParseAsync,

  // ISO date/time utilities
  iso: {
    datetime: (options?: any) => {
      // TODO: Implémenter
      return string();
    },
    date: () => {
      // TODO: Implémenter
      return string();
    },
    time: (options?: any) => {
      // TODO: Implémenter
      return string();
    },
    duration: () => {
      // TODO: Implémenter
      return string();
    },
  },

  // Data transformation utilities
  transform: <TInput, TOutput>(transformFn: (data: TInput) => TOutput) => {
    // TODO: Implémenter
    return string() as any;
  },

  pipe: <T extends any[]>(...schemas: T) => {
    // TODO: Implémenter
    return schemas[0];
  },

  preprocess: <TInput, TOutput>(
    preprocessFn: (data: TInput) => TOutput,
    schema: any
  ) => {
    // TODO: Implémenter
    return schema;
  },

  // Type coercion utilities
  coerce: {
    string: () => addCheckMethod(new PithosCoerceString()),
    number: () => addCheckMethod(new PithosCoerceNumber()),
    boolean: () => addCheckMethod(new PithosCoerceBoolean()),
    bigint: () => addCheckMethod(new PithosCoerceBigInt()),
    date: () => addCheckMethod(new PithosCoerceDate()),
  },

  // Special type utilities
  file: () => {
    // TODO: Implémenter
    return string();
  },

  nan: () => {
    // TODO: Implémenter
    return number();
  },

  custom: <T>(validator: (data: unknown) => boolean) => {
    // TODO: Implémenter
    return string() as any;
  },

  check: <T>(validator: (ctx: any) => void) => {
    return validator;
  },

  instanceof: <T>(constructor: new (...args: any[]) => T) => {
    // TODO: Implémenter
    return string() as any;
  },

  lazy: <T extends PithosType>(factory: () => T) => {
    return lazy(factory);
  },

  json: () => {
    // TODO: Implémenter
    return string() as any;
  },

  stringbool: (options?: any) => {
    // TODO: Implémenter
    return string() as any;
  },

  promise: <T>(schema: any) => {
    // TODO: Implémenter
    return string() as any;
  },
};

/**
 * Main validation object containing all validation functions
 *
 * @since 1.1.0
 * @example
 * ```typescript
 * import { validation } from "pithos/kanon";
 *
 * const userSchema = validation.object({
 *   name: validation.string(),
 *   age: validation.number()
 * });
 *
 * const result = userSchema.safeParse({ name: "John", age: 25 });
 * if (result.success) {
 *   console.log("Valid user:", result.data);
 * }
 * ```
 */
export const validation = validationObj;

/**
 * Infers the output type from a validation schema
 *
 * @template T - The validation schema type
 * @returns The inferred output type
 * @since 1.1.0
 * @example
 * ```typescript
 * const userSchema = validation.object({
 *   name: validation.string(),
 *   age: validation.number()
 * });
 *
 * type User = infer<typeof userSchema>; // { name: string; age: number }
 * ```
 */
export type infer<T extends any> = T extends { _output: infer U } ? U : never;

/**
 * Short alias for the validation object
 *
 * @since 1.1.0
 * @example
 * ```typescript
 * import { v } from "@kanon/validation";
 *
 * const schema = v.string().minLength(5);
 * ```
 */
export const v = validationObj;

/**
 * Default export of the validation object
 *
 * @since 1.1.0
 */
export default validationObj;

/**
 * Extracts the output type from a validation schema
 *
 * @template T - The validation schema type
 * @returns The output type of the schema
 * @since 1.1.0
 * @example
 * ```typescript
 * const userSchema = validation.object({
 *   name: validation.string(),
 *   age: validation.number()
 * });
 *
 * type UserOutput = output<typeof userSchema>; // { name: string; age: number }
 * ```
 */
export type output<T> = T extends { _output: any } ? T["_output"] : unknown;

/**
 * Extracts the input type from a validation schema
 *
 * @template T - The validation schema type
 * @returns The input type of the schema
 * @since 1.1.0
 * @example
 * ```typescript
 * const userSchema = validation.object({
 *   name: validation.string(),
 *   age: validation.number()
 * });
 *
 * type UserInput = input<typeof userSchema>; // { name: string; age: number }
 * ```
 */
export type input<T> = T extends { _input: any } ? T["_input"] : unknown;
