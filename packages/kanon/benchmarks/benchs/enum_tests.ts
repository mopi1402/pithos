import { parse as parseV3 } from "@kanon/core/parser.js";
import {
  numberEnum,
  booleanEnum,
  mixedEnum,
} from "@kanon/schemas/primitives/enum.js";
import * as z from "zod";
import { POOL_SIZE } from "../dataset/config";
import { LibName } from "../dataset/config";

// Number enum values
const NUMBER_ENUM_VALUES = [100, 200, 300, 400, 500] as const;
const NUMBER_ENUM_POOL = Array.from(
  { length: POOL_SIZE },
  (_, i) => NUMBER_ENUM_VALUES[i % NUMBER_ENUM_VALUES.length]
);

// Boolean enum values
const BOOLEAN_ENUM_VALUES = [true, false] as const;
const BOOLEAN_ENUM_POOL = Array.from(
  { length: POOL_SIZE },
  (_, i) => BOOLEAN_ENUM_VALUES[i % BOOLEAN_ENUM_VALUES.length]
);

// Mixed enum values
const MIXED_ENUM_VALUES = ["red", 42, true, "blue", 100, false] as const;
const MIXED_ENUM_POOL = Array.from(
  { length: POOL_SIZE },
  (_, i) => MIXED_ENUM_VALUES[i % MIXED_ENUM_VALUES.length]
);

let numberEnumIndex = 0;
let booleanEnumIndex = 0;
let mixedEnumIndex = 0;

const getNumberEnumValue = () =>
  NUMBER_ENUM_POOL[numberEnumIndex++ % NUMBER_ENUM_POOL.length];
const getBooleanEnumValue = () =>
  BOOLEAN_ENUM_POOL[booleanEnumIndex++ % BOOLEAN_ENUM_POOL.length];
const getMixedEnumValue = () =>
  MIXED_ENUM_POOL[mixedEnumIndex++ % MIXED_ENUM_POOL.length];

export const enumTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  // Kanon V3 schemas
  const kanonV3NumberEnum = numberEnum(NUMBER_ENUM_VALUES);
  const kanonV3BooleanEnum = booleanEnum(BOOLEAN_ENUM_VALUES);
  const kanonV3MixedEnum = mixedEnum(MIXED_ENUM_VALUES);

  // Zod schemas (using union of literals - this is how you do it in Zod for numbers/booleans/mixed)
  // Note: For strings, Zod has z.enum(), but for numbers/booleans/mixed, you must use z.union([z.literal(...)])
  const zodNumberEnum = z.union([
    z.literal(100),
    z.literal(200),
    z.literal(300),
    z.literal(400),
    z.literal(500),
  ]);
  const zodBooleanEnum = z.union([z.literal(true), z.literal(false)]);
  const zodMixedEnum = z.union([
    z.literal("red"),
    z.literal(42),
    z.literal(true),
    z.literal("blue"),
    z.literal(100),
    z.literal(false),
  ]);

  return [
    {
      name: "@kanon/V3.0",
      fn: () => {
        // Kanon parse() returns { success, data/error } - we don't check result for fair comparison
        parseV3(kanonV3NumberEnum, getNumberEnumValue());
        parseV3(kanonV3BooleanEnum, getBooleanEnumValue());
        parseV3(kanonV3MixedEnum, getMixedEnumValue());
      },
    },
    {
      name: "Zod",
      fn: () => {
        // Using safeParse() for consistency with other benchmarks and fair comparison
        // (parse() throws exceptions which adds overhead even for valid values)
        zodNumberEnum.safeParse(getNumberEnumValue());
        zodBooleanEnum.safeParse(getBooleanEnumValue());
        zodMixedEnum.safeParse(getMixedEnumValue());
      },
    },
  ];
};





