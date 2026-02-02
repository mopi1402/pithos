import * as z from "zod";
import * as v from "valibot";
import { safeParse } from "@kanon/v2/core/parser.js";
import { parse as parseV3 } from "@kanon/v3/core/parser.js";
import { string as stringV3 } from "@kanon/v3/schemas/primitives/string";
import { number as numberV3 } from "@kanon/v3/schemas/primitives/number";
import { boolean as booleanV3 } from "@kanon/v3/schemas/primitives/boolean";
import { object as objectV3 } from "@kanon/v3/schemas/composites/object";
import { v as validatorsV1 } from "@kanon/v1/validation";
import { Value } from "@sinclair/typebox/value";
import { LibName } from "../dataset/config";
import { schemas } from "../dataset/schemas";
import * as poolHelpers from "../helpers/pool_helpers";
import { pipe } from "@arkhe/function/pipe";

export const pipeCompositionTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V1",
      fn: () => {
        const data = poolHelpers.getSimpleObject();
        const result = schemas.kanonV1.simpleObject.safeParse(data);
        if (!result.success) return JSON.stringify({ error: result.error });
        const user = result.data as { name: string; age: number; active: boolean };
        const processed = { ...user, processed: true };
        const timestamped = { ...processed, timestamp: Date.now() };
        return JSON.stringify(timestamped);
      },
    },
    {
      name: "@kanon/V2",
      fn: () => {
        const data = poolHelpers.getSimpleObject();
        const result = safeParse(schemas.kanonV2.simpleObject, data);
        if (!result.success) return JSON.stringify({ error: result.error });
        const user = result.data as { name: string; age: number; active: boolean };
        const processed = { ...user, processed: true };
        const timestamped = { ...processed, timestamp: Date.now() };
        return JSON.stringify(timestamped);
      },
    },
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
        const userSchema = z
          .object({
            name: z.string(),
            age: z.number(),
            active: z.boolean(),
          })
          .transform((user) => ({ ...user, processed: true as const }))
          .transform((user) => ({ ...user, timestamp: Date.now() }))
          .transform((user) => JSON.stringify(user));

        return userSchema.safeParse(poolHelpers.getSimpleObject());
      },
    },
    {
      name: "Valibot",
      fn: () => {
        const processUser = v.pipe(
          v.object({
            name: v.string(),
            age: v.number(),
            active: v.boolean(),
          }),
          v.transform((user) => ({ ...user, processed: true as const })),
          v.transform((user) => ({ ...user, timestamp: Date.now() })),
          v.transform((user) => JSON.stringify(user))
        );

        return v.safeParse(processUser, poolHelpers.getSimpleObject());
      },
    },
    {
      name: "TypeBox",
      fn: () => {
        const data = poolHelpers.getSimpleObject();
        const result = Value.Check(schemas.typebox.simpleObject, data);
        if (!result) return JSON.stringify({ error: "validation failed" });
        const processed = { ...data, processed: true, timestamp: Date.now() };
        return JSON.stringify(processed);
      },
    },
  ];
};

export const pipeWithConstraintsTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV1StrictSchema = validatorsV1.object({
    name: validatorsV1.string().min(2).max(50),
    age: validatorsV1.number().min(18).max(120),
    active: validatorsV1.boolean(),
  });

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
      name: "@kanon/V1",
      fn: () => {
        const data = poolHelpers.getSimpleObject();
        const result = kanonV1StrictSchema.safeParse(data);
        if (!result.success) return JSON.stringify({ error: result.error });
        const user = result.data as { name: string; age: number; active: boolean };
        const validated = { ...user, validated: true };
        const scored = { ...validated, score: user.age * 2 };
        return JSON.stringify(scored);
      },
    },
    {
      name: "@kanon/V2",
      fn: () => {
        const data = poolHelpers.getSimpleObject();
        const result = safeParse(schemas.kanonV2.simpleObject, data);
        if (!result.success) return JSON.stringify({ error: result.error });
        const user = result.data as { name: string; age: number; active: boolean };
        const validated = { ...user, validated: true };
        const scored = { ...validated, score: user.age * 2 };
        return JSON.stringify(scored);
      },
    },
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
      name: "TypeBox",
      fn: () => {
        const data = poolHelpers.getSimpleObject();
        const result = Value.Check(schemas.typebox.simpleObject, data);
        if (!result) return JSON.stringify({ error: "validation failed" });
        const processed = { ...data, validated: true, score: data.age * 2 };
        return JSON.stringify(processed);
      },
    },
  ];
};

export const pipeWithErrorHandlingTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const defaultUser = { name: "default", age: 0, active: false };

  return [
    {
      name: "@kanon/V1",
      fn: () => {
        const data = poolHelpers.getInvalidObject();
        const result = schemas.kanonV1.simpleObject.safeParse(data);
        const user = result.success
          ? (result.data as { name: string; age: number; active: boolean })
          : defaultUser;
        const processed = { ...user, processed: true, timestamp: Date.now() };
        return JSON.stringify(processed);
      },
    },
    {
      name: "@kanon/V2",
      fn: () => {
        const data = poolHelpers.getInvalidObject();
        const result = safeParse(schemas.kanonV2.simpleObject, data);
        const user = result.success
          ? (result.data as { name: string; age: number; active: boolean })
          : defaultUser;
        const processed = { ...user, processed: true, timestamp: Date.now() };
        return JSON.stringify(processed);
      },
    },
    {
      name: "@kanon/V3.0",
      fn: () => {
        const data = poolHelpers.getInvalidObject();
        const result = parseV3(schemas.kanonV3.simpleObject, data);
        const user = result.success ? result.data : defaultUser;
        const processed = { ...user, processed: true, timestamp: Date.now() };
        return JSON.stringify(processed);
      },
    },
    {
      name: "Zod",
      fn: () => {
        const robustSchema = z
          .object({
            name: z.string(),
            age: z.number(),
            active: z.boolean(),
          })
          .catch(defaultUser)
          .transform((user) => ({ ...user, processed: true as const }))
          .transform((user) => ({ ...user, timestamp: Date.now() }))
          .transform((user) => JSON.stringify(user));

        return robustSchema.safeParse(poolHelpers.getInvalidObject());
      },
    },
    {
      name: "Valibot",
      fn: () => {
        const data = poolHelpers.getInvalidObject();
        const result = v.safeParse(schemas.valibot.simpleObject, data);
        const user = result.success ? result.output : defaultUser;
        const processed = { ...user, processed: true, timestamp: Date.now() };
        return JSON.stringify(processed);
      },
    },
    {
      name: "TypeBox",
      fn: () => {
        const data = poolHelpers.getInvalidObject();
        const result = Value.Check(schemas.typebox.simpleObject, data);
        const user = result ? (data as typeof defaultUser) : defaultUser;
        const processed = { ...user, processed: true, timestamp: Date.now() };
        return JSON.stringify(processed);
      },
    },
    {
      name: "AJV",
      fn: () => {
        const data = poolHelpers.getSimpleObject();
        const isValid = schemas.ajv.simpleObject(data);
        const user = isValid ? data : defaultUser;
        const processed = { ...user, processed: true, timestamp: Date.now() };
        return JSON.stringify(processed);
      },
    },
  ];
};
