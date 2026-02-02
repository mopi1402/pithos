/**
 * Kanon V3 - Point d'entrée principal
 *
 * @since 3.0.0
 */

// Core parser
export { parse, parseBulk, type ParseBulkOptions } from "./core/parser";

// Primitives
export { any } from "./schemas/primitives/any";
export { bigint } from "./schemas/primitives/bigint";
export { boolean } from "./schemas/primitives/boolean";
export { date } from "./schemas/primitives/date";
export { int } from "./schemas/primitives/int";
export { never } from "./schemas/primitives/never";
export { null_ } from "./schemas/primitives/null";
export { number } from "./schemas/primitives/number";
export { string } from "./schemas/primitives/string";
export { symbol } from "./schemas/primitives/symbol";
export { undefined_ } from "./schemas/primitives/undefined";
export { unknown } from "./schemas/primitives/unknown";
export { void_ } from "./schemas/primitives/void";

export { literal } from "./schemas/primitives/literal";

// Enums
export {
  enum_,
  numberEnum,
  booleanEnum,
  mixedEnum,
} from "./schemas/primitives/enum";
export { nativeEnum } from "./schemas/primitives/nativeEnum";

// Composites
export { object, strictObject, looseObject } from "./schemas/composites/object";
export { array } from "./schemas/composites/array";
export { record } from "./schemas/composites/record";
export {
  tuple,
  tupleOf,
  tupleOf3,
  tupleOf4,
  tupleWithRest,
} from "./schemas/composites/tuple";
export { map } from "./schemas/composites/map";
export { set } from "./schemas/composites/set";

// Operators
export {
  unionOf,
  unionOf3,
  unionOf4,
  discriminatedUnion,
} from "./schemas/operators/union";
export { intersection, intersection3 } from "./schemas/operators/intersection";

// Wrappers
export { optional } from "./schemas/wrappers/optional";
export { nullable } from "./schemas/wrappers/nullable";
export { nullish } from "./schemas/wrappers/nullish";
export { default_, DefaultValues } from "./schemas/wrappers/default";
export { readonly } from "./schemas/wrappers/readonly";
export { lazy } from "./schemas/wrappers/lazy";

// Transforms
export { partial } from "./schemas/transforms/partial";
export { required } from "./schemas/transforms/required";
export { pick } from "./schemas/transforms/pick";
export { omit } from "./schemas/transforms/omit";
export { keyof } from "./schemas/transforms/keyof";

// Coercion
export { coerceString } from "./schemas/coerce/string";
export { coerceNumber } from "./schemas/coerce/number";
export { coerceBoolean } from "./schemas/coerce/boolean";
export { coerceBigInt } from "./schemas/coerce/bigint";
export { coerceDate } from "./schemas/coerce/date";

// Types
export type { Schema, GenericSchema, Infer, ValidatorResult, CoercedResult } from "./types/base";
export type {
  StringConstraint,
  NumberConstraint,
  ArrayConstraint,
  ObjectConstraint,
  DateConstraint,
  BigIntConstraint,
} from "./types/constraints";
export type {
  StringSchema,
  NumberSchema,
  IntSchema,
  BooleanSchema,
  DateSchema,
  BigIntSchema,
  EnumSchema,
  NativeEnumSchema,
  LiteralSchema,
  AnySchema,
  UnknownSchema,
  NeverSchema,
  NullSchema,
  UndefinedSchema,
  SymbolSchema,
  VoidSchema,
} from "./types/primitives";
export type {
  IntersectionSchema,
  UnionSchema,
  DiscriminatedUnionSchema,
  DiscriminableSchema,
  DiscriminableObjectBase,
} from "./types/operators";
export type {
  ObjectSchema,
  ArraySchema,
  RecordSchema,
  MapSchema,
  SetSchema,
  TupleSchema,
  TupleWithRestSchema,
} from "./types/composites";
export { hasTupleRest } from "./types/composites";
export type {
  SetConstraint,
  MapConstraint,
} from "./types/constraints";
export type {
  DefaultSchema,
  NullishSchema,
  ReadonlySchema,
  LazySchema,
  UnwrapSchema,
  IsWrapper,
} from "./types/wrappers";
export type {
  KeyofSchema,
  PartialSchema,
  RequiredSchema,
  PickSchema,
  OmitSchema,
} from "./types/transforms";
export { isSchemaType, schemaGuards, isStringConstraint, isNumberConstraint, isArrayConstraint, isObjectConstraint, isDateConstraint, isBigIntConstraint, isSetConstraint, isMapConstraint } from "./types/guards";
export type { SchemaOfType } from "./types/guards";

// Helpers
export { k } from "./helpers/k";
export { validation } from "./validation";

// JIT Compiler
export { compile, isJITAvailable, clearCache } from "./jit/compiler";
export type { CompileOptions, CompiledValidator } from "./jit/compiler";