import * as z from "zod";
import * as v from "valibot";
import { parse as parseV3 } from "@kanon/core/parser.js";
import { coerceNumber as coerceNumberV3 } from "@kanon/schemas/coerce/number";
import { coerceBoolean as coerceBooleanV3 } from "@kanon/schemas/coerce/boolean";
import { coerceDate as coerceDateV3 } from "@kanon/schemas/coerce/date";
import { coerceBigInt as coerceBigIntV3 } from "@kanon/schemas/coerce/bigint";
import { object as objectV3 } from "@kanon/schemas/composites/object";
import { LibName, POOL_SIZE } from "../dataset/config";

const stringNumberPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => `${i * 1.5 + 0.123}`
);

const stringBooleanPool = Array.from({ length: POOL_SIZE }, (_, i) =>
  i % 2 === 0 ? "true" : "false"
);

const stringDatePool = Array.from(
  { length: POOL_SIZE },
  (_, i) => `2023-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`
);

const stringBigIntPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => `${BigInt(i) * BigInt(1000000)}`
);

const formDataPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
  age: `${18 + (i % 80)}`,
  price: `${(i * 9.99).toFixed(2)}`,
  quantity: `${1 + (i % 100)}`,
  isActive: i % 2 === 0 ? "true" : "false",
  createdAt: `2023-${String((i % 12) + 1).padStart(2, "0")}-15`,
}));

const queryParamsPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
  page: `${1 + (i % 100)}`,
  limit: `${10 + (i % 90)}`,
  offset: `${i * 10}`,
  includeDeleted: i % 3 === 0 ? "true" : "false",
}));

let stringNumberIndex = 0;
let stringBooleanIndex = 0;
let stringDateIndex = 0;
let stringBigIntIndex = 0;
let formDataIndex = 0;
let queryParamsIndex = 0;

const getStringNumber = () =>
  stringNumberPool[stringNumberIndex++ % stringNumberPool.length];
const getStringBoolean = () =>
  stringBooleanPool[stringBooleanIndex++ % stringBooleanPool.length];
const getStringDate = () =>
  stringDatePool[stringDateIndex++ % stringDatePool.length];
const getStringBigInt = () =>
  stringBigIntPool[stringBigIntIndex++ % stringBigIntPool.length];
const getFormData = () =>
  formDataPool[formDataIndex++ % formDataPool.length];
const getQueryParams = () =>
  queryParamsPool[queryParamsIndex++ % queryParamsPool.length];

export const coerceNumberTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = coerceNumberV3();
  const zodSchema = z.coerce.number();
  const valibotSchema = v.pipe(v.unknown(), v.transform(Number), v.number());

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getStringNumber()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getStringNumber()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getStringNumber()),
    },
  ];
};

export const coerceBooleanTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = coerceBooleanV3();
  const zodSchema = z.coerce.boolean();
  const valibotSchema = v.pipe(
    v.unknown(),
    v.transform((val) => val === "true" || val === true),
    v.boolean()
  );

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getStringBoolean()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getStringBoolean()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getStringBoolean()),
    },
  ];
};

export const coerceDateTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = coerceDateV3();
  const zodSchema = z.coerce.date();
  const valibotSchema = v.pipe(
    v.unknown(),
    v.transform((val) => new Date(val as string)),
    v.date()
  );

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getStringDate()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getStringDate()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getStringDate()),
    },
  ];
};

export const coerceBigIntTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = coerceBigIntV3();
  const zodSchema = z.coerce.bigint();
  const valibotSchema = v.pipe(
    v.unknown(),
    v.transform((val) => BigInt(val as string)),
    v.bigint()
  );

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getStringBigInt()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getStringBigInt()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getStringBigInt()),
    },
  ];
};

export const coerceFormDataTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = objectV3({
    age: coerceNumberV3(),
    price: coerceNumberV3(),
    quantity: coerceNumberV3(),
    isActive: coerceBooleanV3(),
    createdAt: coerceDateV3(),
  });

  const zodSchema = z.object({
    age: z.coerce.number().min(0).max(150),
    price: z.coerce.number().min(0),
    quantity: z.coerce.number().int().min(1),
    isActive: z.coerce.boolean(),
    createdAt: z.coerce.date(),
  });

  const valibotSchema = v.object({
    age: v.pipe(
      v.unknown(),
      v.transform(Number),
      v.number(),
      v.minValue(0),
      v.maxValue(150)
    ),
    price: v.pipe(v.unknown(), v.transform(Number), v.number(), v.minValue(0)),
    quantity: v.pipe(
      v.unknown(),
      v.transform(Number),
      v.number(),
      v.integer(),
      v.minValue(1)
    ),
    isActive: v.pipe(
      v.unknown(),
      v.transform((val) => val === "true" || val === true),
      v.boolean()
    ),
    createdAt: v.pipe(
      v.unknown(),
      v.transform((val) => new Date(val as string)),
      v.date()
    ),
  });

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getFormData()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getFormData()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getFormData()),
    },
  ];
};

export const coerceQueryParamsTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = objectV3({
    page: coerceNumberV3(),
    limit: coerceNumberV3(),
    offset: coerceNumberV3(),
    includeDeleted: coerceBooleanV3(),
  });

  const zodSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    offset: z.coerce.number().int().min(0).default(0),
    includeDeleted: z.coerce.boolean().default(false),
  });

  const valibotSchema = v.object({
    page: v.pipe(
      v.unknown(),
      v.transform(Number),
      v.number(),
      v.integer(),
      v.minValue(1)
    ),
    limit: v.pipe(
      v.unknown(),
      v.transform(Number),
      v.number(),
      v.integer(),
      v.minValue(1),
      v.maxValue(100)
    ),
    offset: v.pipe(
      v.unknown(),
      v.transform(Number),
      v.number(),
      v.integer(),
      v.minValue(0)
    ),
    includeDeleted: v.pipe(
      v.unknown(),
      v.transform((val) => val === "true" || val === true),
      v.boolean()
    ),
  });

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getQueryParams()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getQueryParams()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getQueryParams()),
    },
  ];
};

