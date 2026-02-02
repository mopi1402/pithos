import * as v from "valibot";
import * as s from "superstruct";
import { Value } from "@sinclair/typebox/value";
import { parse as parseV3 } from "@kanon/core/parser.js";

import * as poolHelpers from "../helpers/pool_helpers";
import { schemas } from "../dataset/schemas";
import { LibName } from "../dataset/config";

export const primitiveTypesCombinedRealWorldUsage: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () => {
        parseV3(schemas.kanonV3.string, poolHelpers.getString());
        parseV3(schemas.kanonV3.number, poolHelpers.getNumber());
        parseV3(schemas.kanonV3.boolean, poolHelpers.getBoolean());
      },
    },
    {
      name: "@kanon/JIT",
      fn: () => {
        schemas.kanonJIT.string(poolHelpers.getString());
        schemas.kanonJIT.number(poolHelpers.getNumber());
        schemas.kanonJIT.boolean(poolHelpers.getBoolean());
      },
    },
    {
      name: "Zod",
      fn: () => {
        schemas.zod.string.safeParse(poolHelpers.getString());
        schemas.zod.number.safeParse(poolHelpers.getNumber());
        schemas.zod.boolean.safeParse(poolHelpers.getBoolean());
      },
    },
    {
      name: "Valibot",
      fn: () => {
        v.safeParse(schemas.valibot.string, poolHelpers.getString());
        v.safeParse(schemas.valibot.number, poolHelpers.getNumber());
        v.safeParse(schemas.valibot.boolean, poolHelpers.getBoolean());
      },
    },
    {
      name: "Fast-Validator",
      fn: () => {
        schemas.fastestValidator.string(poolHelpers.getString());
        schemas.fastestValidator.number(poolHelpers.getNumber());
        schemas.fastestValidator.boolean(poolHelpers.getBoolean());
      },
    },
    {
      name: "AJV",
      fn: () => {
        schemas.ajv.string(poolHelpers.getString());
        schemas.ajv.number(poolHelpers.getNumber());
        schemas.ajv.boolean(poolHelpers.getBoolean());
      },
    },
    {
      name: "Superstruct",
      fn: () => {
        s.is(poolHelpers.getString(), schemas.superstruct.string);
        s.is(poolHelpers.getNumber(), schemas.superstruct.number);
        s.is(poolHelpers.getBoolean(), schemas.superstruct.boolean);
      },
    },
    {
      name: "TypeBox",
      fn: () => {
        Value.Check(schemas.typebox.string, poolHelpers.getString());
        Value.Check(schemas.typebox.number, poolHelpers.getNumber());
        Value.Check(schemas.typebox.boolean, poolHelpers.getBoolean());
      },
    },
  ];
};
