import * as v from "valibot";
import * as s from "superstruct";
import { safeParse } from "@kanon/v2/core/parser.js";
import { parse as parseV3 } from "@kanon/v3/core/parser.js";
import * as poolHelpers from "../helpers/pool_helpers";
import { LibName } from "../dataset/config";
import { schemas } from "../dataset/schemas";
import { Value } from "@sinclair/typebox/value";

export const complexObjectValidation: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V1",
      fn: () =>
        schemas.kanonV1.complexObject.safeParse(poolHelpers.getComplexObject()),
    },
    {
      name: "@kanon/V2",
      fn: () =>
        safeParse(
          schemas.kanonV2.complexObject,
          poolHelpers.getComplexObject()
        ),
    },
    {
      name: "@kanon/V3.0",
      fn: () =>
        parseV3(schemas.kanonV3.complexObject, poolHelpers.getComplexObject()),
    },
    {
      name: "@kanon/JIT",
      fn: () =>
        schemas.kanonJIT.complexObject(poolHelpers.getComplexObject()),
    },
    {
      name: "Zod",
      fn: () =>
        schemas.zod.complexObject.safeParse(poolHelpers.getComplexObject()),
    },
    {
      name: "Valibot",
      fn: () =>
        v.safeParse(
          schemas.valibot.complexObject,
          poolHelpers.getComplexObject()
        ),
    },
    {
      name: "Superstruct",
      fn: () =>
        s.is(poolHelpers.getComplexObject(), schemas.superstruct.complexObject),
    },
    {
      name: "Fast-Validator",
      fn: () =>
        schemas.fastestValidator.complexObject(poolHelpers.getComplexObject()),
    },
    {
      name: "TypeBox",
      fn: () =>
        Value.Check(
          schemas.typebox.complexObject,
          poolHelpers.getComplexObject()
        ),
    },
    {
      name: "AJV",
      fn: () => schemas.ajv.complexObject(poolHelpers.getComplexObject()),
    },
  ];
};
