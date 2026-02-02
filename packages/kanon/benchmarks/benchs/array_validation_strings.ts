import * as v from "valibot";
import * as s from "superstruct";
import { safeParse } from "@kanon/v2/core/parser.js";
import { parse as parseV3 } from "@kanon/v3/core/parser.js";
import * as poolHelpers from "../helpers/pool_helpers";
import { LibName } from "../dataset/config";
import { schemas } from "../dataset/schemas";
import { Value } from "@sinclair/typebox/value";

export const arrayValidationStrings: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V1",
      fn: () =>
        schemas.kanonV1.stringArray.safeParse(poolHelpers.getStringArray()),
    },
    {
      name: "@kanon/V2",
      fn: () =>
        safeParse(schemas.kanonV2.stringArray, poolHelpers.getStringArray()),
    },
    {
      name: "@kanon/V3.0",
      fn: () =>
        parseV3(schemas.kanonV3.stringArray, poolHelpers.getStringArray()),
    },
    {
      name: "@kanon/JIT",
      fn: () =>
        schemas.kanonJIT.stringArray(poolHelpers.getStringArray()),
    },
    {
      name: "Zod",
      fn: () => schemas.zod.stringArray.safeParse(poolHelpers.getStringArray()),
    },
    {
      name: "Valibot",
      fn: () =>
        v.safeParse(schemas.valibot.stringArray, poolHelpers.getStringArray()),
    },
    {
      name: "Superstruct",
      fn: () =>
        s.is(poolHelpers.getStringArray(), schemas.superstruct.stringArray),
    },
    {
      name: "Fast-Validator",
      fn: () =>
        schemas.fastestValidator.stringArray(poolHelpers.getStringArray()),
    },
    {
      name: "TypeBox",
      fn: () =>
        Value.Check(schemas.typebox.stringArray, poolHelpers.getStringArray()),
    },
    {
      name: "AJV",
      fn: () => schemas.ajv.stringArray(poolHelpers.getStringArray()),
    },
  ];
};
