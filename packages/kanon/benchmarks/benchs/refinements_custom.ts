import * as z from "zod";
import * as v from "valibot";
import { parse as parseV3 } from "@kanon/v3/core/parser.js";
import { string as stringV3 } from "@kanon/v3/schemas/primitives/string";
import { number as numberV3 } from "@kanon/v3/schemas/primitives/number";
import { boolean as booleanV3 } from "@kanon/v3/schemas/primitives/boolean";
import { date as dateV3 } from "@kanon/v3/schemas/primitives/date";
import { object as objectV3 } from "@kanon/v3/schemas/composites/object";
import { array as arrayV3 } from "@kanon/v3/schemas/composites/array";
import { refineObject as refineObjectV3 } from "@kanon/v3/schemas/constraints/refine/object";
import { refineArray as refineArrayV3 } from "@kanon/v3/schemas/constraints/refine/array";
import { optional as optionalV3 } from "@kanon/v3/schemas/wrappers/optional";
import { enum_ as enumV3 } from "@kanon/v3/schemas/primitives/enum";
import { v as validatorsV1 } from "@kanon/v1/validation";
import { LibName, POOL_SIZE } from "../dataset/config";

const evenNumberPool = Array.from({ length: POOL_SIZE }, (_, i) => i * 2);

const positiveNumberPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => i + 1
);

const passwordPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => `SecureP@ss${i}word123!`
);

const dateRangePool = Array.from({ length: POOL_SIZE }, (_, i) => ({
  startDate: new Date(2023, 0, 1 + i),
  endDate: new Date(2023, 6, 1 + i),
}));

const ageVerificationPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
  birthDate: new Date(2000 - (i % 50), (i % 12), (i % 28) + 1),
  wantsAlcohol: i % 3 === 0,
}));

const uniqueArrayPool = Array.from({ length: POOL_SIZE }, (_, i) =>
  Array.from({ length: 5 + (i % 10) }, (_, j) => `item-${i}-${j}`)
);

const passwordConfirmPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
  password: `SecureP@ss${i}!`,
  confirmPassword: `SecureP@ss${i}!`,
}));

const conditionalPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
  paymentMethod: i % 2 === 0 ? "card" : "paypal",
  cardNumber: i % 2 === 0 ? `4111111111111${String(i % 10000).padStart(4, "0")}` : undefined,
  paypalEmail: i % 2 === 0 ? undefined : `user${i}@paypal.com`,
}));

let evenIndex = 0;
let positiveIndex = 0;
let passwordIndex = 0;
let dateRangeIndex = 0;
let ageVerificationIndex = 0;
let uniqueArrayIndex = 0;
let passwordConfirmIndex = 0;
let conditionalIndex = 0;

const getEvenNumber = () => evenNumberPool[evenIndex++ % evenNumberPool.length];
const getPositiveNumber = () =>
  positiveNumberPool[positiveIndex++ % positiveNumberPool.length];
const getPassword = () => passwordPool[passwordIndex++ % passwordPool.length];
const getDateRange = () =>
  dateRangePool[dateRangeIndex++ % dateRangePool.length];
const getAgeVerification = () =>
  ageVerificationPool[ageVerificationIndex++ % ageVerificationPool.length];
const getUniqueArray = () =>
  uniqueArrayPool[uniqueArrayIndex++ % uniqueArrayPool.length];
const getPasswordConfirm = () =>
  passwordConfirmPool[passwordConfirmIndex++ % passwordConfirmPool.length];
const getConditional = () =>
  conditionalPool[conditionalIndex++ % conditionalPool.length];

export const simpleRefinementTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV1Schema = validatorsV1
    .number()
    .refine((n) => n % 2 === 0, "Must be even");

  // Kanon V3 uses multipleOf for even number validation
  const kanonV3Schema = numberV3().multipleOf(2);

  const zodSchema = z.number().refine((n) => n % 2 === 0, "Must be even");

  const valibotSchema = v.pipe(
    v.number(),
    v.check((n) => n % 2 === 0, "Must be even")
  );

  return [
    {
      name: "@kanon/V1",
      fn: () => kanonV1Schema.safeParse(getEvenNumber()),
    },
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getEvenNumber()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getEvenNumber()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getEvenNumber()),
    },
  ];
};

export const passwordStrengthRefinementTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const hasUpperCase = (s: string) => /[A-Z]/.test(s);
  const hasLowerCase = (s: string) => /[a-z]/.test(s);
  const hasNumber = (s: string) => /[0-9]/.test(s);
  const hasSpecial = (s: string) => /[!@#$%^&*]/.test(s);

  const kanonV1Schema = validatorsV1
    .string()
    .min(8)
    .refine(hasUpperCase, "Must have uppercase")
    .refine(hasLowerCase, "Must have lowercase")
    .refine(hasNumber, "Must have number")
    .refine(hasSpecial, "Must have special character");

  // Kanon V3 uses pattern() for regex validation - combining checks into one regex
  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
  const kanonV3Schema = stringV3().pattern(strongPasswordRegex);

  const zodSchema = z
    .string()
    .min(8)
    .refine(hasUpperCase, "Must have uppercase")
    .refine(hasLowerCase, "Must have lowercase")
    .refine(hasNumber, "Must have number")
    .refine(hasSpecial, "Must have special character");

  const valibotSchema = v.pipe(
    v.string(),
    v.minLength(8),
    v.check(hasUpperCase, "Must have uppercase"),
    v.check(hasLowerCase, "Must have lowercase"),
    v.check(hasNumber, "Must have number"),
    v.check(hasSpecial, "Must have special character")
  );

  return [
    {
      name: "@kanon/V1",
      fn: () => kanonV1Schema.safeParse(getPassword()),
    },
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getPassword()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getPassword()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getPassword()),
    },
  ];
};

export const objectRefinementTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = refineObjectV3(
    objectV3({
      startDate: dateV3(),
      endDate: dateV3(),
    }),
    (data) => data.endDate > data.startDate || "End date must be after start date"
  );

  const zodSchema = z
    .object({
      startDate: z.date(),
      endDate: z.date(),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: "End date must be after start date",
    });

  const valibotSchema = v.pipe(
    v.object({
      startDate: v.date(),
      endDate: v.date(),
    }),
    v.check(
      (data) => data.endDate > data.startDate,
      "End date must be after start date"
    )
  );

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getDateRange()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getDateRange()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getDateRange()),
    },
  ];
};

export const arrayRefinementTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const hasUniqueItems = <T>(arr: T[]) => new Set(arr).size === arr.length;

  const kanonV3Schema = refineArrayV3(
    arrayV3(stringV3()),
    (arr) => hasUniqueItems(arr) || "Items must be unique"
  );

  const zodSchema = z.array(z.string()).refine(hasUniqueItems, "Items must be unique");

  const valibotSchema = v.pipe(
    v.array(v.string()),
    v.check(hasUniqueItems, "Items must be unique")
  );

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getUniqueArray()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getUniqueArray()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getUniqueArray()),
    },
  ];
};

export const crossFieldValidationTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = refineObjectV3(
    objectV3({
      password: stringV3().minLength(8),
      confirmPassword: stringV3(),
    }),
    (data) => data.password === data.confirmPassword || "Passwords don't match"
  );

  const zodSchema = z
    .object({
      password: z.string().min(8),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const valibotSchema = v.pipe(
    v.object({
      password: v.pipe(v.string(), v.minLength(8)),
      confirmPassword: v.string(),
    }),
    v.check(
      (data) => data.password === data.confirmPassword,
      "Passwords don't match"
    )
  );

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getPasswordConfirm()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getPasswordConfirm()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getPasswordConfirm()),
    },
  ];
};

export const conditionalRefinementTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = refineObjectV3(
    objectV3({
      paymentMethod: enumV3(["card", "paypal"]),
      cardNumber: optionalV3(stringV3()),
      paypalEmail: optionalV3(stringV3().email()),
    }),
    (data) => {
      if (data.paymentMethod === "card" && !data.cardNumber) {
        return "Card number is required for card payments";
      }
      if (data.paymentMethod === "paypal" && !data.paypalEmail) {
        return "PayPal email is required for PayPal payments";
      }
      return true;
    }
  );

  const zodSchema = z
    .object({
      paymentMethod: z.enum(["card", "paypal"]),
      cardNumber: z.string().optional(),
      paypalEmail: z.string().email().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.paymentMethod === "card" && !data.cardNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Card number is required for card payments",
          path: ["cardNumber"],
        });
      }
      if (data.paymentMethod === "paypal" && !data.paypalEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "PayPal email is required for PayPal payments",
          path: ["paypalEmail"],
        });
      }
    });

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getConditional()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getConditional()),
    },
  ];
};

