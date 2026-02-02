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
 * import { k } from '@kanon/v3/helpers/k';
 * k.string();
 *
 * // ✅ Tree-shakeable (imports only what you use)
 * import { string } from '@kanon/v3/schemas/primitives/string';
 * string();
 * ```
 *
 * @example
 * ```typescript
 * import { k } from '@kanon/v3/helpers/k';
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
import { string } from "@kanon/v3/schemas/primitives/string";
import { number } from "@kanon/v3/schemas/primitives/number";
import { boolean } from "@kanon/v3/schemas/primitives/boolean";
import { date } from "@kanon/v3/schemas/primitives/date";
import { bigint } from "@kanon/v3/schemas/primitives/bigint";
import { symbol } from "@kanon/v3/schemas/primitives/symbol";
import { int } from "@kanon/v3/schemas/primitives/int";
import { null_ } from "@kanon/v3/schemas/primitives/null";
import { undefined_ } from "@kanon/v3/schemas/primitives/undefined";
import { void_ } from "@kanon/v3/schemas/primitives/void";
import { never } from "@kanon/v3/schemas/primitives/never";
import { any } from "@kanon/v3/schemas/primitives/any";
import { unknown } from "@kanon/v3/schemas/primitives/unknown";
import { literal } from "@kanon/v3/schemas/primitives/literal";
import { enum_, numberEnum, booleanEnum, mixedEnum } from "@kanon/v3/schemas/primitives/enum";
import { nativeEnum } from "@kanon/v3/schemas/primitives/nativeEnum";

// Composites
import { object, strictObject, looseObject } from "@kanon/v3/schemas/composites/object";
import { array } from "@kanon/v3/schemas/composites/array";
import { tuple, tupleOf, tupleOf3, tupleOf4, tupleWithRest } from "@kanon/v3/schemas/composites/tuple";
import { record } from "@kanon/v3/schemas/composites/record";
import { map } from "@kanon/v3/schemas/composites/map";
import { set } from "@kanon/v3/schemas/composites/set";

// Operators
import { unionOf, unionOf3, unionOf4 } from "@kanon/v3/schemas/operators/union";
import { intersection, intersection3 } from "@kanon/v3/schemas/operators/intersection";

// Transforms
import { partial } from "@kanon/v3/schemas/transforms/partial";
import { required } from "@kanon/v3/schemas/transforms/required";
import { pick } from "@kanon/v3/schemas/transforms/pick";
import { omit } from "@kanon/v3/schemas/transforms/omit";
import { keyof } from "@kanon/v3/schemas/transforms/keyof";

// Wrappers
import { optional } from "@kanon/v3/schemas/wrappers/optional";
import { nullable } from "@kanon/v3/schemas/wrappers/nullable";
import { default_ } from "@kanon/v3/schemas/wrappers/default";
import { readonly } from "@kanon/v3/schemas/wrappers/readonly";
import { lazy } from "@kanon/v3/schemas/wrappers/lazy";

// Coerce
import { coerceString } from "@kanon/v3/schemas/coerce/string";
import { coerceNumber } from "@kanon/v3/schemas/coerce/number";
import { coerceBoolean } from "@kanon/v3/schemas/coerce/boolean";
import { coerceDate } from "@kanon/v3/schemas/coerce/date";
import { coerceBigInt } from "@kanon/v3/schemas/coerce/bigint";

// Core
import { parse, parseBulk } from "@kanon/v3/core/parser";


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
export type { Infer, Schema, GenericSchema } from "@kanon/v3/types/base";
