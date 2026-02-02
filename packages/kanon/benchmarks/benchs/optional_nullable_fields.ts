import * as z from "zod";
import * as v from "valibot";
import * as s from "superstruct";
import { parse as parseV3 } from "@kanon/core/parser.js";
import { string as stringV3 } from "@kanon/schemas/primitives/string";
import { number as numberV3 } from "@kanon/schemas/primitives/number";
import { boolean as booleanV3 } from "@kanon/schemas/primitives/boolean";
import { object as objectV3 } from "@kanon/schemas/composites/object";
import { optional as optionalV3 } from "@kanon/schemas/wrappers/optional";
import { nullable as nullableV3 } from "@kanon/schemas/wrappers/nullable";
import { nullish as nullishV3 } from "@kanon/schemas/wrappers/nullish";
import { compile as compileJIT } from "@kanon/jit/compiler";
import { LibName, POOL_SIZE } from "../dataset/config";

const optionalObjectPool = Array.from({ length: POOL_SIZE }, (_, i) => {
  const hasMiddleName = i % 3 === 0;
  const hasNickname = i % 2 === 0;
  const hasBio = i % 4 === 0;
  return {
    firstName: `John-${i}`,
    lastName: `Doe-${i}`,
    ...(hasMiddleName && { middleName: `Middle-${i}` }),
    ...(hasNickname && { nickname: `Johnny-${i}` }),
    age: 20 + (i % 60),
    ...(hasBio && { bio: `Bio text for user ${i}` }),
  };
});

const nullableObjectPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
  id: i,
  name: `User-${i}`,
  deletedAt: i % 3 === 0 ? null : new Date(2023, 0, 1 + i),
  parentId: i % 2 === 0 ? null : i - 1,
  metadata: i % 4 === 0 ? null : { key: `value-${i}` },
}));

let optionalIndex = 0;
let nullableIndex = 0;

const getOptionalObject = () =>
  optionalObjectPool[optionalIndex++ % optionalObjectPool.length];
const getNullableObject = () =>
  nullableObjectPool[nullableIndex++ % nullableObjectPool.length];

export const optionalFieldsTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = objectV3({
    firstName: stringV3(),
    lastName: stringV3(),
    middleName: optionalV3(stringV3()),
    nickname: optionalV3(stringV3()),
    age: numberV3(),
    bio: optionalV3(stringV3()),
  });

  // JIT compiled version
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kanonJITValidator = compileJIT(kanonV3Schema as any);

  const zodSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().optional(),
    nickname: z.string().optional(),
    age: z.number(),
    bio: z.string().optional(),
  });

  const valibotSchema = v.object({
    firstName: v.string(),
    lastName: v.string(),
    middleName: v.optional(v.string()),
    nickname: v.optional(v.string()),
    age: v.number(),
    bio: v.optional(v.string()),
  });

  const superstructSchema = s.object({
    firstName: s.string(),
    lastName: s.string(),
    middleName: s.optional(s.string()),
    nickname: s.optional(s.string()),
    age: s.number(),
    bio: s.optional(s.string()),
  });

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getOptionalObject()),
    },
    {
      name: "@kanon/JIT",
      fn: () => kanonJITValidator(getOptionalObject()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getOptionalObject()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getOptionalObject()),
    },
    {
      name: "Superstruct",
      fn: () => s.is(getOptionalObject(), superstructSchema),
    },
  ];
};

export const nullableFieldsTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {

  const kanonV3Schema = objectV3({
    id: numberV3(),
    name: stringV3(),
    deletedAt: nullableV3(stringV3()), // Using string for simplicity in this benchmark
    parentId: nullableV3(numberV3()),
    metadata: nullableV3(
      objectV3({
        key: stringV3(),
      })
    ),
  });

  // JIT compiled version
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kanonJITValidator = compileJIT(kanonV3Schema as any);

  const zodSchema = z.object({
    id: z.number(),
    name: z.string(),
    deletedAt: z.date().nullable(),
    parentId: z.number().nullable(),
    metadata: z
      .object({
        key: z.string(),
      })
      .nullable(),
  });

  const valibotSchema = v.object({
    id: v.number(),
    name: v.string(),
    deletedAt: v.nullable(v.date()),
    parentId: v.nullable(v.number()),
    metadata: v.nullable(
      v.object({
        key: v.string(),
      })
    ),
  });

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getNullableObject()),
    },
    {
      name: "@kanon/JIT",
      fn: () => kanonJITValidator(getNullableObject()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getNullableObject()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getNullableObject()),
    },
  ];
};

export const optionalAndNullableCombinedTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const mixedPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
    id: i,
    email: `user${i}@example.com`,
    phone: i % 2 === 0 ? undefined : i % 3 === 0 ? null : `+1-555-${i}`,
    avatar: i % 3 === 0 ? undefined : i % 4 === 0 ? null : `https://avatar.com/${i}`,
  }));

  let mixedIndex = 0;
  const getMixedObject = () => mixedPool[mixedIndex++ % mixedPool.length];

  const kanonV3Schema = objectV3({
    id: numberV3(),
    email: stringV3(),
    phone: nullishV3(stringV3()),
    avatar: nullishV3(stringV3()),
  });

  // JIT compiled version
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kanonJITValidator = compileJIT(kanonV3Schema as any);

  const zodSchema = z.object({
    id: z.number(),
    email: z.string(),
    phone: z.string().nullish(),
    avatar: z.string().nullish(),
  });

  const valibotSchema = v.object({
    id: v.number(),
    email: v.string(),
    phone: v.nullish(v.string()),
    avatar: v.nullish(v.string()),
  });

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getMixedObject()),
    },
    {
      name: "@kanon/JIT",
      fn: () => kanonJITValidator(getMixedObject()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getMixedObject()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getMixedObject()),
    },
  ];
};

