import * as v from "valibot";
import * as s from "superstruct";
import { safeParse } from "@kanon/v2/core/parser.js";
import { parse as parseV3 } from "@kanon/v3/core/parser.js";
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
      name: "@kanon/V1",
      fn: () =>
        schemas.kanonV1.stringArray.safeParse(
          poolHelpers.getPooledLargeArray()
        ),
    },
    {
      name: "@kanon/V2",
      fn: () =>
        safeParse(
          schemas.kanonV2.stringArray,
          poolHelpers.getPooledLargeArray()
        ),
    },
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
