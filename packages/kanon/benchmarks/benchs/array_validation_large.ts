import * as v from "valibot";
import * as s from "superstruct";
import { parse as parseV3 } from "@kanon/core/parser.js";
import * as poolHelpers from "../helpers/pool_helpers";
import { LibName } from "../dataset/config";
import { schemas } from "../dataset/schemas";
import { Value } from "@sinclair/typebox/value";

export const arrayValidationLarge: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () =>
        parseV3(schemas.kanonV3.stringArray, poolHelpers.getPooledLargeArray()),
    },
    {
      name: "@kanon/JIT",
      fn: () =>
        schemas.kanonJIT.stringArray(poolHelpers.getPooledLargeArray()),
    },
    {
      name: "Zod",
      fn: () =>
        schemas.zod.stringArray.safeParse(poolHelpers.getPooledLargeArray()),
    },
    {
      name: "Valibot",
      fn: () =>
        v.safeParse(
          schemas.valibot.stringArray,
          poolHelpers.getPooledLargeArray()
        ),
    },
    {
      name: "Superstruct",
      fn: () =>
        s.is(
          poolHelpers.getPooledLargeArray(),
          schemas.superstruct.stringArray
        ),
    },
    {
      name: "Fast-Validator",
      fn: () =>
        schemas.fastestValidator.stringArray(poolHelpers.getPooledLargeArray()),
    },
    {
      name: "TypeBox",
      fn: () =>
        Value.Check(
          schemas.typebox.stringArray,
          poolHelpers.getPooledLargeArray()
        ),
    },
    {
      name: "AJV",
      fn: () => schemas.ajv.stringArray(poolHelpers.getPooledLargeArray()),
    },
  ];
};
