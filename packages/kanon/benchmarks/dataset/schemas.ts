import * as z from "zod";
import * as v from "valibot";
import * as s from "superstruct";
import Validator from "fastest-validator";
import { Type } from "@sinclair/typebox";
import Ajv from "ajv";
import { string as stringV3 } from "@kanon/v3/schemas/primitives/string";
import { number as numberV3 } from "@kanon/v3/schemas/primitives/number";
import { boolean as booleanV3 } from "@kanon/v3/schemas/primitives/boolean";
import { object as objectV3 } from "@kanon/v3/schemas/composites/object";
import { array as arrayV3 } from "@kanon/v3/schemas/composites/array";
import { null_ as nullV3 } from "@kanon/v3/schemas/primitives/null";
import { undefined_ as undefinedV3 } from "@kanon/v3/schemas/primitives/undefined";
import { any as anyV3 } from "@kanon/v3/schemas/primitives/any";
import { unknown as unknownV3 } from "@kanon/v3/schemas/primitives/unknown";
import { date as dateV3 } from "@kanon/v3/schemas/primitives/date";
import { bigint as bigintV3 } from "@kanon/v3/schemas/primitives/bigint";
import { compile as compileJIT } from "@kanon/v3/jit/compiler";
import { string } from "@kanon/v2/schemas/primitives/string";
import { number } from "@kanon/v2/schemas/primitives/number";
import { boolean } from "@kanon/v2/schemas/primitives/boolean";
import { object } from "@kanon/v2/schemas/composites/object";
import { array } from "@kanon/v2/schemas/composites/array";
import { PithosString } from "@kanon/v1/schemas/primitives/string";
import { PithosNumber } from "@kanon/v1/schemas/primitives/number";
import { PithosBoolean } from "@kanon/v1/schemas/primitives/boolean";
import { PithosObject } from "@kanon/v1/schemas/composites/object";
import { PithosArray } from "@kanon/v1/schemas/composites/array";
import { PithosNull } from "@kanon/v1/schemas/primitives/null";
import { PithosUndefined } from "@kanon/v1/schemas/primitives/undefined";
import { PithosAny } from "@kanon/v1/schemas/primitives/any";
import { PithosUnknown } from "@kanon/v1/schemas/primitives/unknown";
import { PithosDate } from "@kanon/v1/schemas/primitives/date";
import { PithosBigInt } from "@kanon/v1/schemas/primitives/bigint";

// ===== SCHEMAS SETUP =====
/**
 * Schémas de validation pour les benchmarks
 *
 * IMPORTANT: Ces schémas doivent correspondre exactement aux types définis dans ./types.ts
 * - simpleObject correspond à l'interface SimpleObject
 * - complexObject correspond à l'interface ComplexObject
 *
 * Toute modification de structure doit être synchronisée entre les types et les pools de données.
 */

// Instance du validator fastest-validator
const fastestValidator = new Validator();

// Instance du validator Ajv pour TypeBox
const ajv = new Ajv();

// Instance du validator Ajv pour AJV pur
const ajvPure = new Ajv();

// ===== JIT COMPILED SCHEMAS =====
// IMPORTANT: Ces schémas sont des NOUVELLES INSTANCES (pas partagées avec kanonV3)
// pour éviter tout biais dans les benchmarks.
// Le JIT compile les schémas V3 en validateurs optimisés.

// Primitive schemas for JIT
const jitStringSchema = stringV3();
const jitNumberSchema = numberV3();
const jitBooleanSchema = booleanV3();
const jitNullSchema = nullV3();
const jitUndefinedSchema = undefinedV3();
const jitAnySchema = anyV3();
const jitUnknownSchema = unknownV3();
const jitDateSchema = dateV3();
const jitBigintSchema = bigintV3();

// Object schemas for JIT
const jitSimpleObjectSchema = objectV3({
  name: stringV3(),
  age: numberV3(),
  active: booleanV3(),
});

const jitBulkObjectSchema = objectV3({
  id: numberV3(),
  name: stringV3(),
  active: booleanV3(),
});

const jitComplexObjectSchema = objectV3({
  id: numberV3(),
  name: stringV3(),
  tags: arrayV3(stringV3()),
  config: objectV3({
    enabled: booleanV3(),
    timeout: numberV3(),
    retries: numberV3(),
  }),
  users: arrayV3(
    objectV3({
      id: numberV3(),
      name: stringV3(),
      active: booleanV3(),
    })
  ),
});

// Array schemas for JIT
const jitStringArraySchema = arrayV3(stringV3());
const jitNumberArraySchema = arrayV3(numberV3());

// INTENTIONAL: Cast nécessaire car le compiler attend GenericSchema
// qui est compatible avec les schémas V3
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitString = compileJIT(jitStringSchema as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitNumber = compileJIT(jitNumberSchema as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitBoolean = compileJIT(jitBooleanSchema as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitNull = compileJIT(jitNullSchema as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitUndefined = compileJIT(jitUndefinedSchema as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitAny = compileJIT(jitAnySchema as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitUnknown = compileJIT(jitUnknownSchema as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitDate = compileJIT(jitDateSchema as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitBigint = compileJIT(jitBigintSchema as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitSimpleObject = compileJIT(jitSimpleObjectSchema as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitBulkObject = compileJIT(jitBulkObjectSchema as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitComplexObject = compileJIT(jitComplexObjectSchema as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitStringArray = compileJIT(jitStringArraySchema as any);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const jitNumberArray = compileJIT(jitNumberArraySchema as any);

export const schemas = {
  kanonV1: {
    string: new PithosString(),
    number: new PithosNumber(),
    boolean: new PithosBoolean(),
    simpleObject: new PithosObject({
      name: new PithosString(),
      age: new PithosNumber(),
      active: new PithosBoolean(),
    }),
    bulkObject: new PithosObject({
      id: new PithosNumber(),
      name: new PithosString(),
      active: new PithosBoolean(),
    }),
    complexObject: new PithosObject({
      id: new PithosNumber(),
      name: new PithosString(),
      tags: new PithosArray(new PithosString()),
      config: new PithosObject({
        enabled: new PithosBoolean(),
        timeout: new PithosNumber(),
        retries: new PithosNumber(),
      }),
      users: new PithosArray(
        new PithosObject({
          id: new PithosNumber(),
          name: new PithosString(),
          active: new PithosBoolean(),
        })
      ),
    }),
    stringArray: new PithosArray(new PithosString()),
    numberArray: new PithosArray(new PithosNumber()),
    null: new PithosNull(),
    undefined: new PithosUndefined(),
    any: new PithosAny(),
    unknown: new PithosUnknown(),
    date: new PithosDate(),
    bigint: new PithosBigInt(),
  },
  kanonV2: {
    string: string(),
    number: number(),
    boolean: boolean(),
    null: object({}),
    undefined: object({}),
    any: object({}),
    unknown: object({}),
    date: string(),
    bigint: number(),
    simpleObject: object({
      name: string(),
      age: number(),
      active: boolean(),
    }),
    bulkObject: object({
      id: number(),
      name: string(),
      active: boolean(),
    }),
    complexObject: object({
      id: number(),
      name: string(),
      tags: array(string()),
      config: object({
        enabled: boolean(),
        timeout: number(),
        retries: number(),
      }),
      users: array(
        object({
          id: number(),
          name: string(),
          active: boolean(),
        })
      ),
    }),
    stringArray: array(string()),
    numberArray: array(number()),
  },
  kanonV3: {
    string: stringV3(),
    number: numberV3(),
    boolean: booleanV3(),
    null: nullV3(),
    undefined: undefinedV3(),
    any: anyV3(),
    unknown: unknownV3(),
    date: dateV3(),
    bigint: bigintV3(),
    simpleObject: objectV3({
      name: stringV3(),
      age: numberV3(),
      active: booleanV3(),
    }),
    bulkObject: objectV3({
      id: numberV3(),
      name: stringV3(),
      active: booleanV3(),
    }),
    complexObject: objectV3({
      id: numberV3(),
      name: stringV3(),
      tags: arrayV3(stringV3()),
      config: objectV3({
        enabled: booleanV3(),
        timeout: numberV3(),
        retries: numberV3(),
      }),
      users: arrayV3(
        objectV3({
          id: numberV3(),
          name: stringV3(),
          active: booleanV3(),
        })
      ),
    }),
    stringArray: arrayV3(stringV3()),
    numberArray: arrayV3(numberV3()),
  },
  // JIT compiled validators (pre-compiled from V3 schemas)
  // JIT supports all schema types: primitives, objects, arrays, unions
  kanonJIT: {
    string: jitString,
    number: jitNumber,
    boolean: jitBoolean,
    null: jitNull,
    undefined: jitUndefined,
    any: jitAny,
    unknown: jitUnknown,
    date: jitDate,
    bigint: jitBigint,
    simpleObject: jitSimpleObject,
    bulkObject: jitBulkObject,
    complexObject: jitComplexObject,
    stringArray: jitStringArray,
    numberArray: jitNumberArray,
  },
  zod: {
    string: z.string(),
    number: z.number(),
    boolean: z.boolean(),
    null: z.null(),
    undefined: z.undefined(),
    any: z.any(),
    unknown: z.unknown(),
    date: z.date(),
    bigint: z.bigint(),
    simpleObject: z.object({
      name: z.string(),
      age: z.number(),
      active: z.boolean(),
    }),
    bulkObject: z.object({
      id: z.number(),
      name: z.string(),
      active: z.boolean(),
    }),
    complexObject: z.object({
      id: z.number(),
      name: z.string(),
      tags: z.array(z.string()),
      config: z.object({
        enabled: z.boolean(),
        timeout: z.number(),
        retries: z.number(),
      }),
      users: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
          active: z.boolean(),
        })
      ),
    }),
    stringArray: z.array(z.string()),
    numberArray: z.array(z.number()),
  },
  valibot: {
    string: v.string(),
    number: v.number(),
    boolean: v.boolean(),
    null: v.null(),
    undefined: v.undefined(),
    any: v.any(),
    unknown: v.unknown(),
    date: v.date(),
    bigint: v.bigint(),
    simpleObject: v.object({
      name: v.string(),
      age: v.number(),
      active: v.boolean(),
    }),
    bulkObject: v.object({
      id: v.number(),
      name: v.string(),
      active: v.boolean(),
    }),
    complexObject: v.object({
      id: v.number(),
      name: v.string(),
      tags: v.array(v.string()),
      config: v.object({
        enabled: v.boolean(),
        timeout: v.number(),
        retries: v.number(),
      }),
      users: v.array(
        v.object({
          id: v.number(),
          name: v.string(),
          active: v.boolean(),
        })
      ),
    }),
    stringArray: v.array(v.string()),
    numberArray: v.array(v.number()),
  },
  superstruct: {
    string: s.string(),
    number: s.number(),
    boolean: s.boolean(),
    null: s.literal(null),
    undefined: s.literal(undefined),
    any: s.any(),
    unknown: s.unknown(),
    date: s.date(),
    bigint: s.bigint(),
    simpleObject: s.object({
      name: s.string(),
      age: s.number(),
      active: s.boolean(),
    }),
    bulkObject: s.object({
      id: s.number(),
      name: s.string(),
      active: s.boolean(),
    }),
    complexObject: s.object({
      id: s.number(),
      name: s.string(),
      tags: s.array(s.string()),
      config: s.object({
        enabled: s.boolean(),
        timeout: s.number(),
        retries: s.number(),
      }),
      users: s.array(
        s.object({
          id: s.number(),
          name: s.string(),
          active: s.boolean(),
        })
      ),
    }),
    stringArray: s.array(s.string()),
    numberArray: s.array(s.number()),
  },
  fastestValidator: {
    string: fastestValidator.compile({ $$root: true, type: "string" }),
    number: fastestValidator.compile({ $$root: true, type: "number" }),
    boolean: fastestValidator.compile({ $$root: true, type: "boolean" }),
    simpleObject: fastestValidator.compile({
      name: { type: "string" },
      age: { type: "number" },
      active: { type: "boolean" },
    }),
    bulkObject: fastestValidator.compile({
      id: { type: "number" },
      name: { type: "string" },
      active: { type: "boolean" },
    }),
    complexObject: fastestValidator.compile({
      id: { type: "number" },
      name: { type: "string" },
      tags: {
        type: "array",
        items: { type: "string" },
      },
      config: {
        type: "object",
        props: {
          enabled: { type: "boolean" },
          timeout: { type: "number" },
          retries: { type: "number" },
        },
      },
      users: {
        type: "array",
        items: {
          type: "object",
          props: {
            id: { type: "number" },
            name: { type: "string" },
            active: { type: "boolean" },
          },
        },
      },
    }),
    stringArray: fastestValidator.compile({
      $$root: true,
      type: "array",
      items: { type: "string" },
    }),
    numberArray: fastestValidator.compile({
      $$root: true,
      type: "array",
      items: { type: "number" },
    }),
    null: fastestValidator.compile({
      $$root: true,
      type: "any",
      nullable: true,
    }),
    undefined: fastestValidator.compile({
      $$root: true,
      type: "any",
      optional: true,
    }),
    any: fastestValidator.compile({ $$root: true, type: "any" }),
    unknown: fastestValidator.compile({ $$root: true, type: "any" }),
    date: fastestValidator.compile({ $$root: true, type: "date" }),
    bigint: fastestValidator.compile({ $$root: true, type: "any" }),
  },
  typebox: {
    string: Type.String(),
    number: Type.Number(),
    boolean: Type.Boolean(),
    null: Type.Null(),
    undefined: Type.Undefined(),
    any: Type.Any(),
    unknown: Type.Unknown(),
    date: Type.Date(),
    bigint: Type.BigInt(),
    simpleObject: Type.Object({
      name: Type.String(),
      age: Type.Number(),
      active: Type.Boolean(),
    }),
    bulkObject: Type.Object({
      id: Type.Number(),
      name: Type.String(),
      active: Type.Boolean(),
    }),
    complexObject: Type.Object({
      id: Type.Number(),
      name: Type.String(),
      tags: Type.Array(Type.String()),
      config: Type.Object({
        enabled: Type.Boolean(),
        timeout: Type.Number(),
        retries: Type.Number(),
      }),
      users: Type.Array(
        Type.Object({
          id: Type.Number(),
          name: Type.String(),
          active: Type.Boolean(),
        })
      ),
    }),
    stringArray: Type.Array(Type.String()),
    numberArray: Type.Array(Type.Number()),
  },
  ajv: {
    string: ajvPure.compile({ type: "string" }),
    number: ajvPure.compile({ type: "number" }),
    boolean: ajvPure.compile({ type: "boolean" }),
    null: ajvPure.compile({ type: "null" }),
    undefined: ajvPure.compile({ type: "string" }),
    any: ajvPure.compile({}),
    unknown: ajvPure.compile({}),
    date: ajvPure.compile({ type: "string" }),
    bigint: ajvPure.compile({ type: "string" }),
    simpleObject: ajvPure.compile({
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number" },
        active: { type: "boolean" },
      },
      required: ["name", "age", "active"],
      additionalProperties: false,
    }),
    bulkObject: ajvPure.compile({
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        active: { type: "boolean" },
      },
      required: ["id", "name", "active"],
      additionalProperties: false,
    }),
    complexObject: ajvPure.compile({
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        tags: {
          type: "array",
          items: { type: "string" },
        },
        config: {
          type: "object",
          properties: {
            enabled: { type: "boolean" },
            timeout: { type: "number" },
            retries: { type: "number" },
          },
          required: ["enabled", "timeout", "retries"],
          additionalProperties: false,
        },
        users: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              active: { type: "boolean" },
            },
            required: ["id", "name", "active"],
            additionalProperties: false,
          },
        },
      },
      required: ["id", "name", "tags", "config", "users"],
      additionalProperties: false,
    }),
    stringArray: ajvPure.compile({
      type: "array",
      items: { type: "string" },
    }),
    numberArray: ajvPure.compile({
      type: "array",
      items: { type: "number" },
    }),
  },
};
