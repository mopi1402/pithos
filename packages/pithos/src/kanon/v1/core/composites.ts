/**
 * Pithos composite validation functions
 *
 * @since 1.1.0
 */

import type { PithosType } from "@kanon/v1/types/base";
import { addCheckMethod } from "@kanon/v1/utils/add-check-method";
import { PithosArray } from "@kanon/v1/schemas/composites/array";
import { PithosObject } from "@kanon/v1/schemas/composites/object";
import { PithosUnion } from "@kanon/v1/schemas/composites/union";
import { PithosTuple } from "@kanon/v1/schemas/composites/tuple";
import { PithosRecord } from "@kanon/v1/schemas/composites/record";
import { PithosMap } from "@kanon/v1/schemas/composites/map";
import { PithosSet } from "@kanon/v1/schemas/composites/set";
import { PithosIntersection } from "@kanon/v1/schemas/composites/intersection";
import { PithosLiteral } from "@kanon/v1/schemas/concepts/literal";
import { PithosEnum } from "@kanon/v1/schemas/concepts/enum/string-enum";
import { PithosNativeEnum } from "@kanon/v1/schemas/concepts/enum/native-enum";
import { PithosKeyof } from "@kanon/v1/schemas/concepts/keyof";
import { PithosPartial } from "@kanon/v1/schemas/concepts/wrappers/partial";
import { PithosRequired } from "@kanon/v1/schemas/concepts/wrappers/required";
import { PithosPick } from "@kanon/v1/schemas/concepts/wrappers/pick";
import { PithosOmit } from "@kanon/v1/schemas/concepts/wrappers/omit";

// Composite functions

/**
 * Creates an array schema.
 *
 * @since 1.1.0
 */
export const array = <T extends PithosType>(itemSchema: T) =>
  addCheckMethod(new PithosArray(itemSchema));

/**
 * Creates an object schema.
 *
 * @since 1.1.0
 */
export const object = <T extends Record<string, PithosType>>(shape: T) =>
  addCheckMethod(new PithosObject(shape));

/**
 * Creates a union schema.
 *
 * @since 1.1.0
 */
export const union = <T extends PithosType[]>(schemas: T) =>
  addCheckMethod(new PithosUnion(schemas));

/**
 * Creates a literal schema.
 *
 * @since 1.1.0
 */
export const literal = <T extends string | number | boolean | null>(value: T) =>
  addCheckMethod(new PithosLiteral(value));

/**
 * Creates a tuple schema.
 *
 * @since 1.1.0
 */
export const tuple = <T extends readonly PithosType[]>(
  schemas: T,
  restSchema?: PithosType
) => addCheckMethod(new PithosTuple(schemas, restSchema));

/**
 * Creates a record schema.
 *
 * @since 1.1.0
 */
export const record = <TKey extends PithosType, TValue extends PithosType>(
  keySchema: TKey,
  valueSchema: TValue
) => addCheckMethod(new PithosRecord(keySchema, valueSchema));

/**
 * Creates a map schema.
 *
 * @since 1.1.0
 */
export const map = <TKey extends PithosType, TValue extends PithosType>(
  keySchema: TKey,
  valueSchema: TValue
) => addCheckMethod(new PithosMap(keySchema, valueSchema));

/**
 * Creates a set schema.
 *
 * @since 1.1.0
 */
export const set = <T extends PithosType>(itemSchema: T) =>
  addCheckMethod(new PithosSet(itemSchema));

/**
 * Creates an enum schema.
 *
 * @since 1.1.0
 */
export const enum_ = <T extends readonly string[]>(values: T) =>
  addCheckMethod(new PithosEnum(values));

/**
 * Creates a native enum schema.
 *
 * @since 1.1.0
 */
export const nativeEnum = <T>(enumObj: T) =>
  addCheckMethod(new PithosNativeEnum(enumObj));

/**
 * Creates an intersection schema.
 *
 * @since 1.1.0
 */
export const intersection = <T1 extends PithosType, T2 extends PithosType>(
  schema1: T1,
  schema2: T2
) => addCheckMethod(new PithosIntersection(schema1, schema2));

// Specialized functions

/**
 * Creates a strict object schema.
 *
 * @since 1.1.0
 */
export const strictObject = <T extends Record<string, PithosType>>(shape: T) =>
  addCheckMethod(new PithosObject(shape, true));

/**
 * Creates a loose object schema.
 *
 * @since 1.1.0
 */
export const looseObject = <T extends Record<string, PithosType>>(shape: T) =>
  addCheckMethod(new PithosObject(shape, false));

/**
 * Creates a keyof schema.
 *
 * @since 1.1.0
 */
export const keyof = <T extends PithosType>(schema: T) =>
  addCheckMethod(new PithosKeyof(schema));

// Object manipulation functions

/**
 * Creates a partial schema.
 *
 * @since 1.1.0
 */
export const partial = <T extends Record<string, PithosType>>(shape: T) =>
  addCheckMethod(new PithosPartial(shape));

/**
 * Creates a required schema.
 *
 * @since 1.1.0
 */
export const required = <T extends Record<string, PithosType>>(shape: T) =>
  addCheckMethod(new PithosRequired(shape));

/**
 * Creates a pick schema.
 *
 * @since 1.1.0
 */
export const pick = <T extends Record<string, PithosType>, K extends keyof T>(
  shape: T,
  keys: K[]
) => addCheckMethod(new PithosPick(shape, keys));

/**
 * Creates an omit schema.
 *
 * @since 1.1.0
 */
export const omit = <T extends Record<string, PithosType>, K extends keyof T>(
  shape: T,
  keys: K[]
) => addCheckMethod(new PithosOmit(shape, keys));
