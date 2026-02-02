import * as z from "zod";
import * as v from "valibot";
import { parse as parseV3 } from "@kanon/v3/core/parser.js";
import { string as stringV3 } from "@kanon/v3/schemas/primitives/string";
import { number as numberV3 } from "@kanon/v3/schemas/primitives/number";
import { object as objectV3 } from "@kanon/v3/schemas/composites/object";
import { nullable as nullableV3 } from "@kanon/v3/schemas/wrappers/nullable";
import { partial as partialV3 } from "@kanon/v3/schemas/transforms/partial";
import { pick as pickV3 } from "@kanon/v3/schemas/transforms/pick";
import { omit as omitV3 } from "@kanon/v3/schemas/transforms/omit";
import { LibName, POOL_SIZE } from "../dataset/config";

interface FullUser {
  id: number;
  email: string;
  password: string;
  name: string;
  age: number;
  role: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  metadata: { theme: string; language: string };
}

const fullUserPool: FullUser[] = Array.from({ length: POOL_SIZE }, (_, i) => ({
  id: i,
  email: `user${i}@example.com`,
  password: `hashed_password_${i}`,
  name: `User ${i}`,
  age: 18 + (i % 80),
  role: i % 3 === 0 ? "admin" : i % 2 === 0 ? "editor" : "user",
  createdAt: `2023-01-${String((i % 28) + 1).padStart(2, "0")}`,
  updatedAt: `2023-06-${String((i % 28) + 1).padStart(2, "0")}`,
  deletedAt: i % 10 === 0 ? `2023-12-${String((i % 28) + 1).padStart(2, "0")}` : null,
  metadata: { theme: i % 2 === 0 ? "dark" : "light", language: "en" },
}));

const partialUserPool = Array.from({ length: POOL_SIZE }, (_, i) => {
  const hasName = i % 2 === 0;
  const hasAge = i % 3 === 0;
  const hasRole = i % 4 === 0;
  return {
    ...(hasName && { name: `Updated Name ${i}` }),
    ...(hasAge && { age: 25 + (i % 50) }),
    ...(hasRole && { role: "editor" }),
  };
});

const pickedUserPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
  id: i,
  email: `user${i}@example.com`,
  name: `User ${i}`,
}));

const omittedUserPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
  id: i,
  email: `user${i}@example.com`,
  name: `User ${i}`,
  age: 18 + (i % 80),
  role: i % 3 === 0 ? "admin" : "user",
  createdAt: `2023-01-${String((i % 28) + 1).padStart(2, "0")}`,
  updatedAt: `2023-06-${String((i % 28) + 1).padStart(2, "0")}`,
  deletedAt: null,
  metadata: { theme: "dark", language: "en" },
}));

let fullUserIndex = 0;
let partialUserIndex = 0;
let pickedUserIndex = 0;
let omittedUserIndex = 0;

const getFullUser = () => fullUserPool[fullUserIndex++ % fullUserPool.length];
const getPartialUser = () =>
  partialUserPool[partialUserIndex++ % partialUserPool.length];
const getPickedUser = () =>
  pickedUserPool[pickedUserIndex++ % pickedUserPool.length];
const getOmittedUser = () =>
  omittedUserPool[omittedUserIndex++ % omittedUserPool.length];

const zodFullUserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  age: z.number(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullable(),
  metadata: z.object({ theme: z.string(), language: z.string() }),
});

const valibotFullUserSchema = v.object({
  id: v.number(),
  email: v.pipe(v.string(), v.email()),
  password: v.string(),
  name: v.string(),
  age: v.number(),
  role: v.string(),
  createdAt: v.string(),
  updatedAt: v.string(),
  deletedAt: v.nullable(v.string()),
  metadata: v.object({ theme: v.string(), language: v.string() }),
});

const kanonV3FullUserSchema = objectV3({
  id: numberV3(),
  email: stringV3().email(),
  password: stringV3(),
  name: stringV3(),
  age: numberV3(),
  role: stringV3(),
  createdAt: stringV3(),
  updatedAt: stringV3(),
  deletedAt: nullableV3(stringV3()),
  metadata: objectV3({ theme: stringV3(), language: stringV3() }),
});

export const partialSchemaTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3PartialSchema = partialV3(kanonV3FullUserSchema);
  const zodPartialSchema = zodFullUserSchema.partial();
  const valibotPartialSchema = v.partial(valibotFullUserSchema);

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3PartialSchema, getPartialUser()),
    },
    {
      name: "Zod",
      fn: () => zodPartialSchema.safeParse(getPartialUser()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotPartialSchema, getPartialUser()),
    },
  ];
};

export const pickSchemaTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3PickedSchema = pickV3(kanonV3FullUserSchema, ["id", "email", "name"]);
  const zodPickedSchema = zodFullUserSchema.pick({
    id: true,
    email: true,
    name: true,
  });

  const valibotPickedSchema = v.pick(valibotFullUserSchema, [
    "id",
    "email",
    "name",
  ]);

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3PickedSchema, getPickedUser()),
    },
    {
      name: "Zod",
      fn: () => zodPickedSchema.safeParse(getPickedUser()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotPickedSchema, getPickedUser()),
    },
  ];
};

export const omitSchemaTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3OmittedSchema = omitV3(kanonV3FullUserSchema, ["password"]);
  const zodOmittedSchema = zodFullUserSchema.omit({ password: true });
  const valibotOmittedSchema = v.omit(valibotFullUserSchema, ["password"]);

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3OmittedSchema, getOmittedUser()),
    },
    {
      name: "Zod",
      fn: () => zodOmittedSchema.safeParse(getOmittedUser()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotOmittedSchema, getOmittedUser()),
    },
  ];
};

export const extendSchemaTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const baseSchema = z.object({
    id: z.number(),
    name: z.string(),
  });

  const extendedPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
    id: i,
    name: `Entity ${i}`,
    email: `entity${i}@example.com`,
    createdAt: `2023-01-${String((i % 28) + 1).padStart(2, "0")}`,
  }));

  let extendedIndex = 0;
  const getExtended = () =>
    extendedPool[extendedIndex++ % extendedPool.length];

  const kanonV3BaseSchema = objectV3({
    id: numberV3(),
    name: stringV3(),
  });
  const kanonV3ExtendedSchema = objectV3({
    ...kanonV3BaseSchema.entries,
    email: stringV3().email(),
    createdAt: stringV3(),
  });

  const zodExtendedSchema = baseSchema.extend({
    email: z.string().email(),
    createdAt: z.string(),
  });

  const valibotBaseSchema = v.object({
    id: v.number(),
    name: v.string(),
  });

  const valibotExtendedSchema = v.object({
    ...valibotBaseSchema.entries,
    email: v.pipe(v.string(), v.email()),
    createdAt: v.string(),
  });

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3ExtendedSchema, getExtended()),
    },
    {
      name: "Zod",
      fn: () => zodExtendedSchema.safeParse(getExtended()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotExtendedSchema, getExtended()),
    },
  ];
};

export const mergeSchemaTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const schemaA = z.object({
    id: z.number(),
    name: z.string(),
  });

  const schemaB = z.object({
    email: z.string().email(),
    age: z.number(),
  });

  const mergedPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    age: 18 + (i % 80),
  }));

  let mergedIndex = 0;
  const getMerged = () => mergedPool[mergedIndex++ % mergedPool.length];

  const kanonV3SchemaA = objectV3({
    id: numberV3(),
    name: stringV3(),
  });
  const kanonV3SchemaB = objectV3({
    email: stringV3().email(),
    age: numberV3(),
  });
  const kanonV3MergedSchema = objectV3({
    ...kanonV3SchemaA.entries,
    ...kanonV3SchemaB.entries,
  });

  const zodMergedSchema = schemaA.merge(schemaB);

  const valibotSchemaA = v.object({
    id: v.number(),
    name: v.string(),
  });

  const valibotSchemaB = v.object({
    email: v.pipe(v.string(), v.email()),
    age: v.number(),
  });

  const valibotMergedSchema = v.object({
    ...valibotSchemaA.entries,
    ...valibotSchemaB.entries,
  });

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3MergedSchema, getMerged()),
    },
    {
      name: "Zod",
      fn: () => zodMergedSchema.safeParse(getMerged()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotMergedSchema, getMerged()),
    },
  ];
};

export const deepPartialTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  // Zod v4 removed deepPartial() - skipping this benchmark
  return [];
};

