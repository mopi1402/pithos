import * as v from "valibot";
import * as s from "superstruct";
import { parseBulk as parseBulkV3 } from "@kanon/core/parser.js";
import * as poolHelpers from "../helpers/pool_helpers";
import { LibName } from "../dataset/config";
import { schemas } from "../dataset/schemas";
import { Value } from "@sinclair/typebox/value";

export const bulkValidationObjects: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () =>
        parseBulkV3(schemas.kanonV3.bulkObject, poolHelpers.getBulkObjects()),
    },
    {
      name: "@kanon/JIT",
      fn: () => {
        const data = poolHelpers.getBulkObjects();
        return data.map((item) => schemas.kanonJIT.bulkObject(item));
      },
    },
    {
      name: "Zod",
      fn: () => {
        const data = poolHelpers.getBulkObjects();
        return data.map((item) => schemas.zod.bulkObject.safeParse(item));
      },
    },
    {
      name: "Valibot",
      fn: () => {
        const data = poolHelpers.getBulkObjects();
        return data.map((item) =>
          v.safeParse(schemas.valibot.bulkObject, item)
        );
      },
    },
    {
      name: "Superstruct",
      fn: () => {
        const data = poolHelpers.getBulkObjects();
        return data.map((item) => s.is(item, schemas.superstruct.bulkObject));
      },
    },
    {
      name: "Fast-Validator",
      fn: () => {
        const data = poolHelpers.getBulkObjects();
        return data.map((item) => schemas.fastestValidator.bulkObject(item));
      },
    },
    {
      name: "TypeBox",
      fn: () => {
        const data = poolHelpers.getBulkObjects();
        return data.map((item) =>
          Value.Check(schemas.typebox.bulkObject, item)
        );
      },
    },
    {
      name: "AJV",
      fn: () => {
        const data = poolHelpers.getBulkObjects();
        return data.map((item) => schemas.ajv.bulkObject(item));
      },
    },
  ];
};
