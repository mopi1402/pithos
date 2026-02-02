import * as z from "zod";
import * as v from "valibot";
import { parse as parseV3 } from "@kanon/core/parser.js";
import { string as stringV3 } from "@kanon/schemas/primitives/string";
import { object as objectV3 } from "@kanon/schemas/composites/object";
import { compile as compileJIT } from "@kanon/jit/compiler";
import { LibName, POOL_SIZE } from "../dataset/config";

const emailPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => `user${i}@example.com`
);

const urlPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => `https://api.example.com/users/${i}/profile?ref=${i * 100}`
);

const uuidPool = Array.from({ length: POOL_SIZE }, (_, i) => {
  const hex = i.toString(16).padStart(8, "0");
  return `${hex}-${hex.slice(0, 4)}-4${hex.slice(1, 4)}-a${hex.slice(1, 4)}-${hex}${hex.slice(0, 4)}`;
});

const slugPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => `my-awesome-article-${i}-with-seo-friendly-url`
);

const ipPool = Array.from(
  { length: POOL_SIZE },
  (_, i) => `192.168.${(i % 256)}.${(i * 3) % 256}`
);

let emailIndex = 0;
let urlIndex = 0;
let uuidIndex = 0;
let slugIndex = 0;
let ipIndex = 0;

const getEmail = () => emailPool[emailIndex++ % emailPool.length];
const getUrl = () => urlPool[urlIndex++ % urlPool.length];
const getUuid = () => uuidPool[uuidIndex++ % uuidPool.length];
const getSlug = () => slugPool[slugIndex++ % slugPool.length];
const getIp = () => ipPool[ipIndex++ % ipPool.length];

export const emailValidationTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = stringV3().email();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kanonJITValidator = compileJIT(kanonV3Schema as any);
  const zodSchema = z.string().email();
  const valibotSchema = v.pipe(v.string(), v.email());

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getEmail()),
    },
    {
      name: "@kanon/JIT",
      fn: () => kanonJITValidator(getEmail()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getEmail()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getEmail()),
    },
  ];
};

export const urlValidationTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = stringV3().url();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kanonJITValidator = compileJIT(kanonV3Schema as any);
  const zodSchema = z.string().url();
  const valibotSchema = v.pipe(v.string(), v.url());

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getUrl()),
    },
    {
      name: "@kanon/JIT",
      fn: () => kanonJITValidator(getUrl()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getUrl()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getUrl()),
    },
  ];
};

export const uuidValidationTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const kanonV3Schema = stringV3().uuid();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kanonJITValidator = compileJIT(kanonV3Schema as any);
  const zodSchema = z.string().uuid();
  const valibotSchema = v.pipe(v.string(), v.uuid());

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getUuid()),
    },
    {
      name: "@kanon/JIT",
      fn: () => kanonJITValidator(getUuid()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getUuid()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getUuid()),
    },
  ];
};

export const regexValidationTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  const kanonV3Schema = stringV3().pattern(slugRegex);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kanonJITValidator = compileJIT(kanonV3Schema as any);
  const zodSchema = z.string().regex(slugRegex);
  const valibotSchema = v.pipe(v.string(), v.regex(slugRegex));

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getSlug()),
    },
    {
      name: "@kanon/JIT",
      fn: () => kanonJITValidator(getSlug()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getSlug()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getSlug()),
    },
  ];
};

export const ipValidationTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  const kanonV3Schema = stringV3().pattern(ipv4Regex);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kanonJITValidator = compileJIT(kanonV3Schema as any);
  const zodSchema = z.string().regex(ipv4Regex);
  const valibotSchema = v.pipe(v.string(), v.regex(ipv4Regex));

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getIp()),
    },
    {
      name: "@kanon/JIT",
      fn: () => kanonJITValidator(getIp()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getIp()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getIp()),
    },
  ];
};

export const combinedPatternValidationTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const combinedPool = Array.from({ length: POOL_SIZE }, (_, i) => ({
    email: emailPool[i % emailPool.length],
    website: urlPool[i % urlPool.length],
    userId: uuidPool[i % uuidPool.length],
    slug: slugPool[i % slugPool.length],
  }));

  let combinedIndex = 0;
  const getCombinedObject = () =>
    combinedPool[combinedIndex++ % combinedPool.length];

  const kanonV3Schema = objectV3({
    email: stringV3().email(),
    website: stringV3().url(),
    userId: stringV3().uuid(),
    slug: stringV3().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kanonJITValidator = compileJIT(kanonV3Schema as any);

  const zodSchema = z.object({
    email: z.string().email(),
    website: z.string().url(),
    userId: z.string().uuid(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  });

  const valibotSchema = v.object({
    email: v.pipe(v.string(), v.email()),
    website: v.pipe(v.string(), v.url()),
    userId: v.pipe(v.string(), v.uuid()),
    slug: v.pipe(v.string(), v.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
  });

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(kanonV3Schema, getCombinedObject()),
    },
    {
      name: "@kanon/JIT",
      fn: () => kanonJITValidator(getCombinedObject()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getCombinedObject()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getCombinedObject()),
    },
  ];
};

