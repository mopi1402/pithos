import * as v from "valibot";
import { parse as parseV3 } from "@kanon/v3/core/parser.js";
import * as poolHelpers from "../helpers/pool_helpers";
import { LibName } from "../dataset/config";
import { schemas } from "../dataset/schemas";

export const v3NewTypesSimpleTests: () => {
  name: LibName;
  fn: () => void | boolean;
}[] = () => {
  return [
    {
      name: "@kanon/V1",
      fn: () => {
        schemas.kanonV1.null.safeParse(poolHelpers.getNull());
        schemas.kanonV1.undefined.safeParse(poolHelpers.getUndefined());
        schemas.kanonV1.any.safeParse(poolHelpers.getAny());
        schemas.kanonV1.unknown.safeParse(poolHelpers.getUnknown());
        return true;
      },
    },
    {
      name: "@kanon/V3.0",
      fn: () => {
        parseV3(schemas.kanonV3.null, poolHelpers.getNull());
        parseV3(schemas.kanonV3.undefined, poolHelpers.getUndefined());
        parseV3(schemas.kanonV3.any, poolHelpers.getAny());
        parseV3(schemas.kanonV3.unknown, poolHelpers.getUnknown());
        return true;
      },
    },

    {
      name: "Zod",
      fn: () => {
        schemas.zod.null.safeParse(poolHelpers.getNull());
        schemas.zod.undefined.safeParse(poolHelpers.getUndefined());
        schemas.zod.any.safeParse(poolHelpers.getAny());
        schemas.zod.unknown.safeParse(poolHelpers.getUnknown());
        return true;
      },
    },

    {
      name: "Valibot",
      fn: () => {
        v.safeParse(schemas.valibot.null, poolHelpers.getNull());
        v.safeParse(schemas.valibot.undefined, poolHelpers.getUndefined());
        v.safeParse(schemas.valibot.any, poolHelpers.getAny());
        v.safeParse(schemas.valibot.unknown, poolHelpers.getUnknown());
        return true;
      },
    },

    {
      name: "Fast-Validator",
      fn: () => {
        schemas.fastestValidator.null(poolHelpers.getNull());
        schemas.fastestValidator.undefined(poolHelpers.getUndefined());
        schemas.fastestValidator.any(poolHelpers.getAny());
        schemas.fastestValidator.unknown(poolHelpers.getUnknown());
        return true;
      },
    },
  ];
};

export const v3NewTypesConstrainedTests: () => {
  name: LibName;
  fn: () => void | boolean;
}[] = () => {
  return [
    {
      name: "@kanon/V1",
      fn: () => {
        schemas.kanonV1.date.safeParse(poolHelpers.getDate());
        schemas.kanonV1.bigint.safeParse(poolHelpers.getBigInt());
        return true;
      },
    },

    {
      name: "@kanon/V3.0",
      fn: () => {
        parseV3(schemas.kanonV3.date, poolHelpers.getDate());
        parseV3(schemas.kanonV3.bigint, poolHelpers.getBigInt());
        return true;
      },
    },

    {
      name: "Zod",
      fn: () => {
        schemas.zod.date.safeParse(poolHelpers.getDate());
        schemas.zod.bigint.safeParse(poolHelpers.getBigInt());
        return true;
      },
    },

    {
      name: "Valibot",
      fn: () => {
        v.safeParse(schemas.valibot.date, poolHelpers.getDate());
        v.safeParse(schemas.valibot.bigint, poolHelpers.getBigInt());
        return true;
      },
    },

    {
      name: "Fast-Validator",
      fn: () => {
        schemas.fastestValidator.date(poolHelpers.getDate());
        schemas.fastestValidator.bigint(poolHelpers.getBigInt());
        return true;
      },
    },
  ];
};

export const v3NewTypesAppliedTests: () => {
  name: LibName;
  fn: () => void | boolean;
}[] = () => {
  return [
    {
      name: "@kanon/V1",
      fn: () => {
        // V1 utilise le même pattern que V3 : chaînage de refine() pour min/max
        const dateSchema = schemas.kanonV1.date
          .refine((date) => date >= new Date("2023-01-01"))
          .refine((date) => date <= new Date("2023-12-31"));
        const bigintSchema = schemas.kanonV1.bigint
          .refine((bigint) => bigint >= 0n)
          .refine((bigint) => bigint <= 1000000n);
        dateSchema.safeParse(poolHelpers.getDate());
        bigintSchema.safeParse(poolHelpers.getBigInt());
        return true;
      },
    },

    {
      name: "@kanon/V3.0",
      fn: () => {
        const dateSchema = schemas.kanonV3.date
          .min(new Date("2023-01-01"))
          .max(new Date("2023-12-31"));
        const bigintSchema = schemas.kanonV3.bigint.min(0n).max(1000000n);
        parseV3(dateSchema, poolHelpers.getDate());
        parseV3(bigintSchema, poolHelpers.getBigInt());
        return true;
      },
    },

    {
      name: "Zod",
      fn: () => {
        const dateSchema = schemas.zod.date
          .min(new Date("2023-01-01"))
          .max(new Date("2023-12-31"));
        const bigintSchema = schemas.zod.bigint.min(0n).max(1000000n);
        dateSchema.safeParse(poolHelpers.getDate());
        bigintSchema.safeParse(poolHelpers.getBigInt());
        return true;
      },
    },

    {
      name: "Valibot",
      fn: () => {
        const dateSchema = v.pipe(
          schemas.valibot.date,
          v.minValue(new Date("2023-01-01")),
          v.maxValue(new Date("2023-12-31"))
        );
        const bigintSchema = v.pipe(
          schemas.valibot.bigint,
          v.minValue(0n),
          v.maxValue(1000000n)
        );
        v.safeParse(dateSchema, poolHelpers.getDate());
        v.safeParse(bigintSchema, poolHelpers.getBigInt());
        return true;
      },
    },
    {
      name: "AJV",
      fn: () => {
        // AJV n'a pas de support natif pour date et bigint, utilisation des schémas de base
        schemas.ajv.date(poolHelpers.getDate());
        schemas.ajv.bigint(poolHelpers.getBigInt());
        return true;
      },
    },
  ];
};
