import * as v from "valibot";
import * as s from "superstruct";
import { parse as parseV3 } from "@kanon/core/parser.js";
import * as poolHelpers from "../helpers/pool_helpers";
import { schemas } from "../dataset/schemas";
import { LibName } from "../dataset/config";
import { Value } from "@sinclair/typebox/value";

export const simpleObjectValidation: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () =>
        parseV3(schemas.kanonV3.simpleObject, poolHelpers.getSimpleObject()),
    },
    {
      name: "@kanon/JIT",
      fn: () => schemas.kanonJIT.simpleObject(poolHelpers.getSimpleObject()),
    },
    {
      name: "Zod",
      fn: () =>
        schemas.zod.simpleObject.safeParse(poolHelpers.getSimpleObject()),
    },
    {
      name: "Valibot",
      fn: () =>
        v.safeParse(
          schemas.valibot.simpleObject,
          poolHelpers.getSimpleObject()
        ),
    },
    {
      name: "Superstruct",
      fn: () =>
        s.is(poolHelpers.getSimpleObject(), schemas.superstruct.simpleObject),
    },
    {
      name: "Fast-Validator",
      fn: () =>
        schemas.fastestValidator.simpleObject(poolHelpers.getSimpleObject()),
    },
    {
      name: "TypeBox",
      fn: () =>
        Value.Check(
          schemas.typebox.simpleObject,
          poolHelpers.getSimpleObject()
        ),
    },
    {
      name: "AJV",
      fn: () => schemas.ajv.simpleObject(poolHelpers.getSimpleObject()),
    },
  ];
};
