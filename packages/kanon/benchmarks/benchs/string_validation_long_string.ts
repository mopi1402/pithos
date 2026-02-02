import * as v from "valibot";
import * as s from "superstruct";
import { parse as parseV3 } from "@kanon/core/parser.js";

import { Value } from "@sinclair/typebox/value";
import { schemas } from "../dataset/schemas";
import { LibName } from "../dataset/config";
import * as poolHelpers from "../helpers/pool_helpers";

export const stringValidationLongString: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(schemas.kanonV3.string, poolHelpers.getLongString()),
    },
    {
      name: "@kanon/JIT",
      fn: () => schemas.kanonJIT.string(poolHelpers.getLongString()),
    },
    {
      name: "Zod",
      fn: () => schemas.zod.string.safeParse(poolHelpers.getLongString()),
    },
    {
      name: "Valibot",
      fn: () =>
        v.safeParse(schemas.valibot.string, poolHelpers.getLongString()),
    },
    {
      name: "Superstruct",
      fn: () => s.is(poolHelpers.getLongString(), schemas.superstruct.string),
    },
    {
      name: "Fast-Validator",
      fn: () => schemas.fastestValidator.string(poolHelpers.getLongString()),
    },
    {
      name: "TypeBox",
      fn: () =>
        Value.Check(schemas.typebox.string, poolHelpers.getLongString()),
    },
    {
      name: "AJV",
      fn: () => schemas.ajv.string(poolHelpers.getLongString()),
    },
  ];
};
