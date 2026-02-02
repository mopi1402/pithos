/**
 * Kanon namespace object - Zod-like API
 *
 * Provides a single entry point for all Kanon schemas, similar to Zod's `z` object.
 *
 * @note **Tree-shaking warning**: Importing `k` includes ALL Kanon schemas in your bundle,
 * even if you only use a subset. This is the same trade-off as Zod's `z` object.
 * For optimal bundle size, prefer direct imports:
 *
 * ```typescript
 * // ❌ No tree-shaking (imports everything)
 * import { k } from '@kanon/helpers/k';
 * k.string();
 *
 * // ✅ Tree-shakeable (imports only what you use)
 * import { string } from '@kanon/schemas/primitives/string';
 * string();
 * ```
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
 *
 * @since 3.0.0
 */

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
 * @since 3.0.0
 */
export const k = {
  // Primitives
  string,
  number,
  boolean,
  date,
  bigint,
  symbol,
  int,
  null: null_,
  undefined: undefined_,
  void: void_,
  never,
  any,
  unknown,
  literal,
  enum: enum_,
  numberEnum,
  booleanEnum,
  mixedEnum,
  nativeEnum,

  // Composites
  object,
  strictObject,
  looseObject,
  array,
  tuple,
  tupleOf,
  tupleOf3,
  tupleOf4,
  tupleWithRest,
  record,
  map,
  set,

  // Operators
  union: unionOf,
  unionOf,
  unionOf3,
  unionOf4,
  intersection,
  intersection3,

  // Transforms
  partial,
  required,
  pick,
  omit,
  keyof,

  // Wrappers
  optional,
  nullable,
  default: default_,
  readonly,
  lazy,

  // Coerce namespace
  coerce: {
    string: coerceString,
    number: coerceNumber,
    boolean: coerceBoolean,
    date: coerceDate,
    bigint: coerceBigInt,
  },

  // Core
  parse,
  parseBulk,
} as const;

// Type exports
export type { Infer, Schema, GenericSchema } from "@kanon/types/base";
