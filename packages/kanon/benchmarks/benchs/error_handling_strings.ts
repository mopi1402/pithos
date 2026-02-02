import * as v from "valibot";
import * as s from "superstruct";
import { parse as parseV3 } from "@kanon/core/parser.js";
import { Value } from "@sinclair/typebox/value";
import { LibName } from "../dataset/config";
import { schemas } from "../dataset/schemas";
import * as poolHelpers from "../helpers/pool_helpers";

export const errorHandlingStrings: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(schemas.kanonV3.string, poolHelpers.getInvalidString()),
    },
    {
      name: "@kanon/JIT",
      fn: () => schemas.kanonJIT.string(poolHelpers.getInvalidString()),
    },
    {
      name: "Zod",
      fn: () => schemas.zod.string.safeParse(poolHelpers.getInvalidString()),
    },
    {
      name: "Valibot",
      fn: () =>
        v.safeParse(schemas.valibot.string, poolHelpers.getInvalidString()),
    },
    {
      name: "Superstruct",
      fn: () => {
        try {
          s.is(poolHelpers.getInvalidString(), schemas.superstruct.string);
          return false; // Pas d'erreur = validation réussie = false (invalide)
        } catch {
          return true; // Erreur = validation échouée = true (invalide)
        }
      },
    },
    {
      name: "Fast-Validator",
      fn: () => {
        const result = schemas.fastestValidator.string(
          poolHelpers.getInvalidString()
        );
        return result !== true; // true = valid, array = invalid
      },
    },
    {
      name: "TypeBox",
      fn: () => {
        const result = Value.Check(
          schemas.typebox.string,
          poolHelpers.getInvalidString()
        );
        return result === false; // true = valid, false = invalid
      },
    },
    {
      name: "AJV",
      fn: () => {
        const result = schemas.ajv.string(poolHelpers.getInvalidString());
        return result === false; // true = valid, false = invalid
      },
    },
  ];
};
