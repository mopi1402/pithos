import * as v from "valibot";
import * as s from "superstruct";
import { parse as parseV3 } from "@kanon/core/parser.js";
import * as poolHelpers from "../helpers/pool_helpers";
import { LibName } from "../dataset/config";
import { schemas } from "../dataset/schemas";
import { Value } from "@sinclair/typebox/value";

export const errorHandlingObjects: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () =>
        parseV3(schemas.kanonV3.simpleObject, poolHelpers.getInvalidObject()),
    },
    {
      name: "@kanon/JIT",
      fn: () =>
        schemas.kanonJIT.simpleObject(poolHelpers.getInvalidObject()),
    },
    {
      name: "Zod",
      fn: () =>
        schemas.zod.simpleObject.safeParse(poolHelpers.getInvalidObject()),
    },
    {
      name: "Valibot",
      fn: () =>
        v.safeParse(
          schemas.valibot.simpleObject,
          poolHelpers.getInvalidObject()
        ),
    },
    {
      name: "Superstruct",
      fn: () => {
        try {
          s.is(
            poolHelpers.getInvalidObject(),
            schemas.superstruct.simpleObject
          );
          return false;
        } catch {
          return true;
        }
      },
    },
    {
      name: "Fast-Validator",
      fn: () => {
        const result = schemas.fastestValidator.simpleObject(
          poolHelpers.getInvalidObject()
        );
        return result !== true; // true = valid, array = invalid
      },
    },
    {
      name: "TypeBox",
      fn: () => {
        const result = Value.Check(
          schemas.typebox.simpleObject,
          poolHelpers.getInvalidObject()
        );
        return result === false; // true = valid, false = invalid
      },
    },
    {
      name: "AJV",
      fn: () => {
        const result = schemas.ajv.simpleObject(poolHelpers.getInvalidObject());
        return result === false; // true = valid, false = invalid
      },
    },
  ];
};
