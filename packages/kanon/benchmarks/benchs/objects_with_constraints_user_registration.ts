import * as z from "zod";
import * as valibot from "valibot";
import { Type, TObject } from "@sinclair/typebox";
import { parse as parseV3 } from "@kanon/core/parser.js";
import { string as stringV3 } from "@kanon/schemas/primitives/string";
import { number as numberV3 } from "@kanon/schemas/primitives/number";
import { boolean as booleanV3 } from "@kanon/schemas/primitives/boolean";
import { object as objectV3 } from "@kanon/schemas/composites/object";
import { compile as compileJIT } from "@kanon/jit/compiler";
import { Value } from "@sinclair/typebox/value";
import { LibName } from "../dataset/config";
import * as poolHelpers from "../helpers/pool_helpers";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv();
addFormats(ajv);

const ajvUserSchema = ajv.compile({
  type: "object",
  properties: {
    name: { type: "string", minLength: 2, maxLength: 50 },
    email: { type: "string", format: "email" },
    age: { type: "number", minimum: 18, maximum: 120 },
    password: { type: "string", minLength: 8 },
    terms: { type: "boolean" },
  },
  required: ["name", "email", "age", "password", "terms"],
  additionalProperties: false,
});

const kanonV3UserSchema = objectV3({
  name: stringV3().minLength(2).maxLength(50),
  email: stringV3().email(),
  age: numberV3().min(18).max(120),
  password: stringV3().minLength(8),
  terms: booleanV3(),
});

// JIT compiled version - constraints are handled via refinements
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const kanonJITUserValidator = compileJIT(kanonV3UserSchema as any);

const zodUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(18).max(120),
  password: z.string().min(8),
  terms: z.boolean(),
});

const valibotUserSchema = valibot.object({
  name: valibot.pipe(
    valibot.string(),
    valibot.minLength(2),
    valibot.maxLength(50)
  ),
  email: valibot.pipe(valibot.string(), valibot.email()),
  age: valibot.pipe(
    valibot.number(),
    valibot.minValue(18),
    valibot.maxValue(120)
  ),
  password: valibot.pipe(valibot.string(), valibot.minLength(8)),
  terms: valibot.boolean(),
});

const typeboxUserSchema = Type.Object({
  name: Type.String({ minLength: 2, maxLength: 50 }),
  email: Type.String({ format: "email" }),
  age: Type.Number({ minimum: 18, maximum: 120 }),
  password: Type.String({ minLength: 8 }),
  terms: Type.Boolean(),
});

export const objectsWithConstraintsUserRegistration: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () => {
        return parseV3(kanonV3UserSchema, poolHelpers.getUserRegistration());
      },
    },
    {
      name: "@kanon/JIT",
      fn: () => {
        return kanonJITUserValidator(poolHelpers.getUserRegistration());
      },
    },
    {
      name: "Zod",
      fn: () => {
        return zodUserSchema.safeParse(poolHelpers.getUserRegistration());
      },
    },
    {
      name: "Valibot",
      fn: () => {
        return valibot.safeParse(
          valibotUserSchema,
          poolHelpers.getUserRegistration()
        );
      },
    },
    {
      name: "TypeBox",
      fn: () => {
        return Value.Check(
          typeboxUserSchema,
          poolHelpers.getUserRegistration()
        );
      },
    },
    {
      name: "AJV",
      fn: () => {
        return ajvUserSchema(poolHelpers.getUserRegistration());
      },
    },
  ];
};
