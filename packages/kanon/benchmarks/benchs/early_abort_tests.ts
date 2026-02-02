import * as v from "valibot";
import { safeParseBulk } from "@kanon/v2/core/parser.js";
import { parseBulk as parseBulkV3 } from "@kanon/v3/core/parser.js";
import * as poolHelpers from "../helpers/pool_helpers";
import { LibName } from "../dataset/config";
import { schemas } from "../dataset/schemas";

export const earlyAbortTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V1",
      fn: () => {
        // V1 n'a pas de parseBulk avec early abort, simulation manuelle
        const data = poolHelpers.getBulkStrings();
        return data.map((item) => schemas.kanonV1.string.safeParse(item));
      },
    },
    {
      name: "@kanon/V2",
      fn: () =>
        safeParseBulk(schemas.kanonV2.string, poolHelpers.getBulkStrings(), {
          abortEarly: true,
        }),
    },
    {
      name: "@kanon/V3.0",
      fn: () =>
        parseBulkV3(schemas.kanonV3.string, poolHelpers.getBulkStrings(), {
          earlyAbort: true,
        }),
    },
    {
      name: "Zod",
      fn: () => {
        const data = poolHelpers.getBulkStrings();
        return data.map((item) => schemas.zod.string.safeParse(item));
      },
    },
    {
      name: "Valibot",
      fn: () => {
        const data = poolHelpers.getBulkStrings();
        return data.map((item) => v.safeParse(schemas.valibot.string, item));
      },
    },
    {
      name: "AJV",
      fn: () => {
        const data = poolHelpers.getBulkStrings();
        return data.map((item) => schemas.ajv.string(item));
      },
    },
  ];
};

export const earlyAbortWithErrorsTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V2",
      fn: () => {
        // Même données avec abortEarly
        const mixedData = [
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
          ...poolHelpers
            .getBulkStrings()
            .map((s) => (typeof s === "string" ? 123 : s)), // 10 invalides (numbers)
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
          ...poolHelpers
            .getBulkStrings()
            .map((s) => (typeof s === "string" ? true : s)), // 10 invalides (booleans)
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
        ];
        return safeParseBulk(schemas.kanonV2.string, mixedData, {
          abortEarly: true,
        });
      },
    },
    {
      name: "@kanon/V3.0",
      fn: () => {
        // Même données avec earlyAbort
        const mixedData = [
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
          ...poolHelpers
            .getBulkStrings()
            .map((s) => (typeof s === "string" ? 123 : s)), // 10 invalides (numbers)
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
          ...poolHelpers
            .getBulkStrings()
            .map((s) => (typeof s === "string" ? true : s)), // 10 invalides (booleans)
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
        ];
        return parseBulkV3(schemas.kanonV3.string, mixedData, {
          earlyAbort: true,
        });
      },
    },

    // Zod et Valibot n'ont pas d'early abort, mais on les compare quand même avec erreurs
    {
      name: "Zod",
      fn: () => {
        const mixedData = [
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
          ...poolHelpers
            .getBulkStrings()
            .map((s) => (typeof s === "string" ? 123 : s)), // 10 invalides (numbers)
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
          ...poolHelpers
            .getBulkStrings()
            .map((s) => (typeof s === "string" ? true : s)), // 10 invalides (booleans)
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
        ];
        return mixedData.map((item) => schemas.zod.string.safeParse(item));
      },
    },
    {
      name: "Valibot",
      fn: () => {
        const mixedData = [
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
          ...poolHelpers
            .getBulkStrings()
            .map((s) => (typeof s === "string" ? 123 : s)), // 10 invalides (numbers)
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
          ...poolHelpers
            .getBulkStrings()
            .map((s) => (typeof s === "string" ? true : s)), // 10 invalides (booleans)
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
        ];
        return mixedData.map((item) =>
          v.safeParse(schemas.valibot.string, item)
        );
      },
    },
    {
      name: "AJV",
      fn: () => {
        const mixedData = [
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
          ...poolHelpers
            .getBulkStrings()
            .map((s) => (typeof s === "string" ? 123 : s)), // 10 invalides (numbers)
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
          ...poolHelpers
            .getBulkStrings()
            .map((s) => (typeof s === "string" ? true : s)), // 10 invalides (booleans)
          ...poolHelpers.getBulkStrings().slice(0, 10), // 10 valides
        ];
        return mixedData.map((item) => schemas.ajv.string(item));
      },
    },
  ];
};
