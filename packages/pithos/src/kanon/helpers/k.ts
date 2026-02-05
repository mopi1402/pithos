// Primitives
import { string } from "@kanon/schemas/primitives/string";
import { number } from "@kanon/schemas/primitives/number";
import { boolean } from "@kanon/schemas/primitives/boolean";
import { date } from "@kanon/schemas/primitives/date";
import { bigint } from "@kanon/schemas/primitives/bigint";
import { symbol } from "@kanon/schemas/primitives/symbol";
import { int } from "@kanon/schemas/primitives/int";
import { null_ } from "@kanon/schemas/primitives/null";
import { undefined_ } from "@kanon/schemas/primitives/undefined";
import { void_ } from "@kanon/schemas/primitives/void";
import { never } from "@kanon/schemas/primitives/never";
import { any } from "@kanon/schemas/primitives/any";
import { unknown } from "@kanon/schemas/primitives/unknown";
import { literal } from "@kanon/schemas/primitives/literal";
import { enum_, numberEnum, booleanEnum, mixedEnum } from "@kanon/schemas/primitives/enum";
import { nativeEnum } from "@kanon/schemas/primitives/nativeEnum";

// Composites
import { object, strictObject, looseObject } from "@kanon/schemas/composites/object";
import { array } from "@kanon/schemas/composites/array";
import { tuple, tupleOf, tupleOf3, tupleOf4, tupleWithRest } from "@kanon/schemas/composites/tuple";
import { record } from "@kanon/schemas/composites/record";
import { map } from "@kanon/schemas/composites/map";
import { set } from "@kanon/schemas/composites/set";

// Operators
import { unionOf, unionOf3, unionOf4 } from "@kanon/schemas/operators/union";
import { intersection, intersection3 } from "@kanon/schemas/operators/intersection";

// Transforms
import { partial } from "@kanon/schemas/transforms/partial";
import { required } from "@kanon/schemas/transforms/required";
import { pick } from "@kanon/schemas/transforms/pick";
import { omit } from "@kanon/schemas/transforms/omit";
import { keyof } from "@kanon/schemas/transforms/keyof";

// Wrappers
import { optional } from "@kanon/schemas/wrappers/optional";
import { nullable } from "@kanon/schemas/wrappers/nullable";
import { default_ } from "@kanon/schemas/wrappers/default";
import { readonly } from "@kanon/schemas/wrappers/readonly";
import { lazy } from "@kanon/schemas/wrappers/lazy";

// Coerce
import { coerceString } from "@kanon/schemas/coerce/string";
import { coerceNumber } from "@kanon/schemas/coerce/number";
import { coerceBoolean } from "@kanon/schemas/coerce/boolean";
import { coerceDate } from "@kanon/schemas/coerce/date";
import { coerceBigInt } from "@kanon/schemas/coerce/bigint";

// Core
import { parse, parseBulk } from "@kanon/core/parser";


/**
 * Kanon namespace object providing a single entry point for all schemas.
 *
 * Similar to Zod's `z` object.
 *
 * @since 3.0.0
 *
 * @note **Tree-shaking warning**: Importing `k` includes ALL Kanon schemas
 * in your bundle, even if you only use a subset. For optimal bundle size,
 * prefer direct imports.
 *
 * @example
 * ```typescript
 * import { k } from '@kanon/helpers/k';
 *
 * const userSchema = k.object({
 *   name: k.string().minLength(1),
 *   age: k.number().min(0),
 *   email: k.string().email(),
 * });
 *
 * const result = k.parse(userSchema, input);
 * ```
 */
export const k = {
  // Primitives
  /** Creates a string schema. */
  string,
  /** Creates a number schema. */
  number,
  /** Creates a boolean schema. */
  boolean,
  /** Creates a Date schema. */
  date,
  /** Creates a bigint schema. */
  bigint,
  /** Creates a symbol schema. */
  symbol,
  /** Creates an integer schema. */
  int,
  /** Creates a null schema. */
  null: null_,
  /** Creates an undefined schema. */
  undefined: undefined_,
  /** Creates a void schema. */
  void: void_,
  /** Creates a never schema. */
  never,
  /** Creates a schema accepting any value. */
  any,
  /** Creates a schema accepting unknown values. */
  unknown,
  /** Creates a literal schema for a specific value. */
  literal,
  /** Creates a string enum schema. */
  enum: enum_,
  /** Creates a number enum schema. */
  numberEnum,
  /** Creates a boolean enum schema. */
  booleanEnum,
  /** Creates a mixed enum schema. */
  mixedEnum,
  /** Creates a schema from a TypeScript native enum. */
  nativeEnum,

  // Composites
  /** Creates an object schema from a shape. */
  object,
  /** Creates a strict object schema that rejects unknown keys. */
  strictObject,
  /** Creates a loose object schema that allows unknown keys. */
  looseObject,
  /** Creates an array schema. */
  array,
  /** Creates a tuple schema from a list of schemas. */
  tuple,
  /** Creates a typed 2-element tuple. */
  tupleOf,
  /** Creates a typed 3-element tuple. */
  tupleOf3,
  /** Creates a typed 4-element tuple. */
  tupleOf4,
  /** Creates a tuple schema with a rest element. */
  tupleWithRest,
  /** Creates a record schema with key and value schemas. */
  record,
  /** Creates a `Map` schema. */
  map,
  /** Creates a `Set` schema. */
  set,

  // Operators
  /** Creates a union schema. Alias for `unionOf`. */
  union: unionOf,
  /** Creates a union of 2 schemas. */
  unionOf,
  /** Creates a union of 3 schemas. */
  unionOf3,
  /** Creates a union of 4 schemas. */
  unionOf4,
  /** Creates an intersection of 2 schemas. */
  intersection,
  /** Creates an intersection of 3 schemas. */
  intersection3,

  // Transforms
  /** Makes all properties of an object schema optional. */
  partial,
  /** Makes all properties of an object schema required. */
  required,
  /** Picks a subset of properties from an object schema. */
  pick,
  /** Omits a subset of properties from an object schema. */
  omit,
  /** Extracts the string keys of an object schema. */
  keyof,

  // Wrappers
  /** Wraps a schema to also accept `undefined`. */
  optional,
  /** Wraps a schema to also accept `null`. */
  nullable,
  /** Provides a default value when validation fails. */
  default: default_,
  /** Marks a schema output as readonly. */
  readonly,
  /** Creates a lazy schema for recursive types. */
  lazy,

  /** Namespace for coercion schemas. */
  coerce: {
    /** Coerces input to string before validating. */
    string: coerceString,
    /** Coerces input to number before validating. */
    number: coerceNumber,
    /** Coerces input to boolean before validating. */
    boolean: coerceBoolean,
    /** Coerces input to Date before validating. */
    date: coerceDate,
    /** Coerces input to bigint before validating. */
    bigint: coerceBigInt,
  },

  // Core
  /** Validates a value against a schema. */
  parse,
  /** Validates an array of values against a schema. */
  parseBulk,
} as const;

// Type exports
export type { Infer, Schema, GenericSchema } from "@kanon/types/base";
