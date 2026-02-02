import * as z from "zod";
import * as v from "valibot";
import { parse as parseV3 } from "@kanon/core/parser.js";
import { string as stringV3 } from "@kanon/schemas/primitives/string";
import { number as numberV3 } from "@kanon/schemas/primitives/number";
import { boolean as booleanV3 } from "@kanon/schemas/primitives/boolean";
import { object as objectV3 } from "@kanon/schemas/composites/object";
import * as poolHelpers from "../helpers/pool_helpers";
import { LibName } from "../dataset/config";
import { schemas } from "../dataset/schemas";

export const transformApproachesTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const zodSchema = z
    .object({
      name: z.string(),
      age: z.number(),
      active: z.boolean(),
    })
    .transform((user) => ({ ...user, processed: true as const }))
    .transform((user) => ({ ...user, timestamp: Date.now() }))
    .transform((user) => JSON.stringify(user));

  const valibotSchema = v.pipe(
    v.object({
      name: v.string(),
      age: v.number(),
      active: v.boolean(),
    }),
    v.transform((user) => ({ ...user, processed: true as const })),
    v.transform((user) => ({ ...user, timestamp: Date.now() })),
    v.transform((user) => JSON.stringify(user))
  );

  return [
    {
      name: "@kanon/V3.0",
      fn: () => {
        const data = poolHelpers.getSimpleObject();
        const result = parseV3(schemas.kanonV3.simpleObject, data);
        if (!result.success) return JSON.stringify({ error: result.error });
        const user = result.data;
        const processed = { ...user, processed: true };
        const timestamped = { ...processed, timestamp: Date.now() };
        return JSON.stringify(timestamped);
      },
    },
    {
      name: "Zod",
      fn: () => {
        return zodSchema.safeParse(poolHelpers.getSimpleObject());
      },
    },
    {
      name: "Valibot",
      fn: () => {
        return v.safeParse(valibotSchema, poolHelpers.getSimpleObject());
      },
    },
  ];
};

export const transformWithConstraintsTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3StrictSchema = objectV3({
    name: stringV3().minLength(2).maxLength(50),
    age: numberV3().min(18).max(120),
    active: booleanV3(),
  });

  const zodStrictSchema = z
    .object({
      name: z.string().min(2).max(50),
      age: z.number().min(18).max(120),
      active: z.boolean(),
    })
    .transform((user) => ({ ...user, validated: true as const }))
    .transform((user) => ({ ...user, score: user.age * 2 }))
    .transform((user) => JSON.stringify(user));

  const valibotStrictSchema = v.pipe(
    v.object({
      name: v.pipe(v.string(), v.minLength(2), v.maxLength(50)),
      age: v.pipe(v.number(), v.minValue(18), v.maxValue(120)),
      active: v.boolean(),
    }),
    v.transform((user) => ({ ...user, validated: true as const })),
    v.transform((user) => ({ ...user, score: user.age * 2 })),
    v.transform((user) => JSON.stringify(user))
  );

  return [
    {
      name: "@kanon/V3.0",
      fn: () => {
        const data = poolHelpers.getSimpleObject();
        const result = parseV3(kanonV3StrictSchema, data);
        if (!result.success) return JSON.stringify({ error: result.error });
        const user = result.data;
        const validated = { ...user, validated: true };
        const scored = { ...validated, score: user.age * 2 };
        return JSON.stringify(scored);
      },
    },
    {
      name: "Zod",
      fn: () => {
        return zodStrictSchema.safeParse(poolHelpers.getSimpleObject());
      },
    },
    {
      name: "Valibot",
      fn: () => {
        return v.safeParse(valibotStrictSchema, poolHelpers.getSimpleObject());
      },
    },
    {
      name: "AJV",
      fn: () => {
        const data = poolHelpers.getSimpleObject();
        const isValid = schemas.ajv.simpleObject(data);
        if (!isValid) return JSON.stringify({ error: "Invalid user" });
        const transformed = { ...data, validated: true, score: data.age * 2 };
        return JSON.stringify(transformed);
      },
    },
  ];
};
