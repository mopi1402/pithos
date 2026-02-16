/**
 * Object JIT Benchmark - Complex Objects
 *
 * Compares V3 non-compiled vs JIT compiled object validators against other libraries.
 * Tests various object complexities to measure JIT performance gains.
 *
 * @since 2.0.0
 * @experimental
 *
 * ## Test Scenarios
 *
 * 1. Simple object (3 props): name, age, active
 * 2. Medium object (10 props): Various primitive types
 * 3. Complex object (20 props, nested): Nested objects and arrays
 *
 * ## Criteria
 *
 * - **GO**: JIT >= 2x faster than V3 on complex objects
 * - **ACCEPTABLE**: JIT within 20% of Fastest-Validator
 */

import * as z from "zod";
import * as v from "valibot";
import Validator from "fastest-validator";
import { parse as parseV3 } from "@kanon/core/parser.js";
import { string as stringV3 } from "@kanon/schemas/primitives/string";
import { number as numberV3 } from "@kanon/schemas/primitives/number";
import { boolean as booleanV3 } from "@kanon/schemas/primitives/boolean";
import { object as objectV3 } from "@kanon/schemas/composites/object";
import { array as arrayV3 } from "@kanon/schemas/composites/array";
import { LibName, POOL_SIZE } from "../dataset/config";

// JIT imports
import { createGeneratorContext } from "@kanon/jit/context";
import {
  generateObjectValidation,
  type ObjectConstraintMeta,
  type ObjectPropertyMeta,
} from "@kanon/jit/builders/composites/object";
import { generateStringValidation } from "@kanon/jit/builders/primitives/string";
import { generateNumberValidation } from "@kanon/jit/builders/primitives/number";
import { generateBooleanValidation } from "@kanon/jit/builders/primitives/boolean";
import { generateArrayValidation } from "@kanon/jit/builders/composites/array";

// ============================================================================
// Fastest-Validator instance
// ============================================================================

const fastestValidator = new Validator();

// ============================================================================
// Type Definitions
// ============================================================================

interface SimpleObject {
  name: string;
  age: number;
  active: boolean;
}

interface MediumObject {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
  score: number;
  level: number;
  verified: boolean;
  premium: boolean;
  role: string;
}

interface NestedConfig {
  enabled: boolean;
  timeout: number;
  retries: number;
}

interface NestedUser {
  id: number;
  name: string;
  active: boolean;
}

interface ComplexObject {
  id: number;
  name: string;
  email: string;
  age: number;
  active: boolean;
  score: number;
  level: number;
  verified: boolean;
  premium: boolean;
  role: string;
  bio: string;
  website: string;
  phone: string;
  country: string;
  city: string;
  zip: string;
  config: NestedConfig;
  tags: string[];
  users: NestedUser[];
  metadata: string;
}

// ============================================================================
// Test Data Pools
// ============================================================================

// Simple object pool (3 props)
const simpleObjectPool: SimpleObject[] = Array.from({ length: POOL_SIZE }, (_, i) => ({
  name: `User-${i}-${Math.random().toString(36).substring(2)}`,
  age: 18 + (i % 50) + Math.floor(Math.random() * 10),
  active: (i + Math.random()) % 2 > 1,
}));

// Medium object pool (10 props)
const mediumObjectPool: MediumObject[] = Array.from({ length: POOL_SIZE }, (_, i) => ({
  id: 1000 + i,
  name: `User-${i}-${Math.random().toString(36).substring(2)}`,
  email: `user${i}@example.com`,
  age: 18 + (i % 50),
  active: i % 2 === 0,
  score: Math.floor(Math.random() * 1000),
  level: 1 + (i % 10),
  verified: i % 3 === 0,
  premium: i % 5 === 0,
  role: i % 2 === 0 ? "admin" : "user",
}));

// Complex object pool (20 props, nested)
const complexObjectPool: ComplexObject[] = Array.from({ length: POOL_SIZE }, (_, i) => ({
  id: 1000 + i,
  name: `User-${i}-${Math.random().toString(36).substring(2)}`,
  email: `user${i}@example.com`,
  age: 18 + (i % 50),
  active: i % 2 === 0,
  score: Math.floor(Math.random() * 1000),
  level: 1 + (i % 10),
  verified: i % 3 === 0,
  premium: i % 5 === 0,
  role: i % 2 === 0 ? "admin" : "user",
  bio: `Bio for user ${i} - ${Math.random().toString(36).substring(2, 50)}`,
  website: `https://user${i}.example.com`,
  phone: `+1-555-${String(i).padStart(4, "0")}`,
  country: "USA",
  city: `City-${i % 100}`,
  zip: String(10000 + (i % 90000)),
  config: {
    enabled: i % 2 === 0,
    timeout: 1000 + (i % 5000),
    retries: 1 + (i % 5),
  },
  tags: Array.from({ length: 2 + (i % 4) }, (_, j) => `tag-${i}-${j}`),
  users: Array.from({ length: 2 + (i % 3) }, (_, j) => ({
    id: i * 100 + j,
    name: `SubUser-${i}-${j}`,
    active: (i + j) % 2 === 0,
  })),
  metadata: `metadata-${i}`,
}));

// Invalid object pools
const invalidSimplePool: unknown[] = Array.from({ length: POOL_SIZE }, (_, i) => {
  const type = i % 4;
  if (type === 0) return { name: 123, age: 25, active: true }; // wrong name type
  if (type === 1) return { name: "test", age: "25", active: true }; // wrong age type
  if (type === 2) return { name: "test", age: 25, active: "yes" }; // wrong active type
  return "not-an-object"; // not an object
});

// Cyclic indices
let simpleIndex = 0;
let mediumIndex = 0;
let complexIndex = 0;
let invalidSimpleIndex = 0;

const getSimpleObject = () => simpleObjectPool[simpleIndex++ % POOL_SIZE];
const getMediumObject = () => mediumObjectPool[mediumIndex++ % POOL_SIZE];
const getComplexObject = () => complexObjectPool[complexIndex++ % POOL_SIZE];
const getInvalidSimple = () => invalidSimplePool[invalidSimpleIndex++ % POOL_SIZE];

// ============================================================================
// JIT Code Generators
// ============================================================================

/**
 * Creates a string property generator
 */
function createStringPropertyGenerator(name: string): ObjectPropertyMeta {
  return {
    name,
    optional: false,
    generateCode: (varName, ctx) => generateStringValidation(varName, ctx),
  };
}

/**
 * Creates a number property generator
 */
function createNumberPropertyGenerator(name: string): ObjectPropertyMeta {
  return {
    name,
    optional: false,
    generateCode: (varName, ctx) => generateNumberValidation(varName, ctx),
  };
}

/**
 * Creates a boolean property generator
 */
function createBooleanPropertyGenerator(name: string): ObjectPropertyMeta {
  return {
    name,
    optional: false,
    generateCode: (varName, ctx) => generateBooleanValidation(varName, ctx),
  };
}

// ============================================================================
// JIT Compiled Validators
// ============================================================================

/**
 * Creates a JIT compiled validator for simple object (3 props)
 */
function createJitSimpleObjectValidator(): (value: unknown) => true | string {
  const ctx = createGeneratorContext();
  const constraints: ObjectConstraintMeta = {
    properties: [
      createStringPropertyGenerator("name"),
      createNumberPropertyGenerator("age"),
      createBooleanPropertyGenerator("active"),
    ],
  };

  const result = generateObjectValidation("value", ctx, constraints);
  const code = result.code.join("\n") + "\nreturn true;";

  // eslint-disable-next-line no-new-func
  return new Function("value", code) as (value: unknown) => true | string;
}

/**
 * Creates a JIT compiled validator for medium object (10 props)
 */
function createJitMediumObjectValidator(): (value: unknown) => true | string {
  const ctx = createGeneratorContext();
  const constraints: ObjectConstraintMeta = {
    properties: [
      createNumberPropertyGenerator("id"),
      createStringPropertyGenerator("name"),
      createStringPropertyGenerator("email"),
      createNumberPropertyGenerator("age"),
      createBooleanPropertyGenerator("active"),
      createNumberPropertyGenerator("score"),
      createNumberPropertyGenerator("level"),
      createBooleanPropertyGenerator("verified"),
      createBooleanPropertyGenerator("premium"),
      createStringPropertyGenerator("role"),
    ],
  };

  const result = generateObjectValidation("value", ctx, constraints);
  const code = result.code.join("\n") + "\nreturn true;";

  // eslint-disable-next-line no-new-func
  return new Function("value", code) as (value: unknown) => true | string;
}

/**
 * Creates a JIT compiled validator for complex object (20 props, nested)
 */
function createJitComplexObjectValidator(): (value: unknown) => true | string {
  const ctx = createGeneratorContext();

  // Nested config object generator
  const configGenerator = (varName: string, innerCtx: typeof ctx) => {
    const configConstraints: ObjectConstraintMeta = {
      properties: [
        createBooleanPropertyGenerator("enabled"),
        createNumberPropertyGenerator("timeout"),
        createNumberPropertyGenerator("retries"),
      ],
    };
    return generateObjectValidation(varName, innerCtx, configConstraints);
  };

  // Nested user object generator
  const userGenerator = (varName: string, innerCtx: typeof ctx) => {
    const userConstraints: ObjectConstraintMeta = {
      properties: [
        createNumberPropertyGenerator("id"),
        createStringPropertyGenerator("name"),
        createBooleanPropertyGenerator("active"),
      ],
    };
    return generateObjectValidation(varName, innerCtx, userConstraints);
  };

  // String array generator for tags
  const tagsGenerator = (varName: string, innerCtx: typeof ctx) => {
    return generateArrayValidation(varName, innerCtx, {
      itemGenerator: (itemVar, itemCtx) => generateStringValidation(itemVar, itemCtx),
    });
  };

  // User array generator
  const usersArrayGenerator = (varName: string, innerCtx: typeof ctx) => {
    return generateArrayValidation(varName, innerCtx, {
      itemGenerator: userGenerator,
    });
  };

  const constraints: ObjectConstraintMeta = {
    properties: [
      createNumberPropertyGenerator("id"),
      createStringPropertyGenerator("name"),
      createStringPropertyGenerator("email"),
      createNumberPropertyGenerator("age"),
      createBooleanPropertyGenerator("active"),
      createNumberPropertyGenerator("score"),
      createNumberPropertyGenerator("level"),
      createBooleanPropertyGenerator("verified"),
      createBooleanPropertyGenerator("premium"),
      createStringPropertyGenerator("role"),
      createStringPropertyGenerator("bio"),
      createStringPropertyGenerator("website"),
      createStringPropertyGenerator("phone"),
      createStringPropertyGenerator("country"),
      createStringPropertyGenerator("city"),
      createStringPropertyGenerator("zip"),
      {
        name: "config",
        optional: false,
        generateCode: configGenerator,
      },
      {
        name: "tags",
        optional: false,
        generateCode: tagsGenerator,
      },
      {
        name: "users",
        optional: false,
        generateCode: usersArrayGenerator,
      },
      createStringPropertyGenerator("metadata"),
    ],
  };

  const result = generateObjectValidation("value", ctx, constraints);
  const code = result.code.join("\n") + "\nreturn true;";

  // eslint-disable-next-line no-new-func
  return new Function("value", code) as (value: unknown) => true | string;
}

// Pre-compile JIT validators
const jitSimpleObject = createJitSimpleObjectValidator();
const jitMediumObject = createJitMediumObjectValidator();
const jitComplexObject = createJitComplexObjectValidator();

// ============================================================================
// V3 Non-Compiled Schemas
// ============================================================================

const v3SimpleObjectSchema = objectV3({
  name: stringV3(),
  age: numberV3(),
  active: booleanV3(),
});

const v3MediumObjectSchema = objectV3({
  id: numberV3(),
  name: stringV3(),
  email: stringV3(),
  age: numberV3(),
  active: booleanV3(),
  score: numberV3(),
  level: numberV3(),
  verified: booleanV3(),
  premium: booleanV3(),
  role: stringV3(),
});

const v3ComplexObjectSchema = objectV3({
  id: numberV3(),
  name: stringV3(),
  email: stringV3(),
  age: numberV3(),
  active: booleanV3(),
  score: numberV3(),
  level: numberV3(),
  verified: booleanV3(),
  premium: booleanV3(),
  role: stringV3(),
  bio: stringV3(),
  website: stringV3(),
  phone: stringV3(),
  country: stringV3(),
  city: stringV3(),
  zip: stringV3(),
  config: objectV3({
    enabled: booleanV3(),
    timeout: numberV3(),
    retries: numberV3(),
  }),
  tags: arrayV3(stringV3()),
  users: arrayV3(
    objectV3({
      id: numberV3(),
      name: stringV3(),
      active: booleanV3(),
    })
  ),
  metadata: stringV3(),
});

// ============================================================================
// Zod Schemas
// ============================================================================

const zodSimpleObject = z.object({
  name: z.string(),
  age: z.number(),
  active: z.boolean(),
});

const zodMediumObject = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  age: z.number(),
  active: z.boolean(),
  score: z.number(),
  level: z.number(),
  verified: z.boolean(),
  premium: z.boolean(),
  role: z.string(),
});

const zodComplexObject = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  age: z.number(),
  active: z.boolean(),
  score: z.number(),
  level: z.number(),
  verified: z.boolean(),
  premium: z.boolean(),
  role: z.string(),
  bio: z.string(),
  website: z.string(),
  phone: z.string(),
  country: z.string(),
  city: z.string(),
  zip: z.string(),
  config: z.object({
    enabled: z.boolean(),
    timeout: z.number(),
    retries: z.number(),
  }),
  tags: z.array(z.string()),
  users: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      active: z.boolean(),
    })
  ),
  metadata: z.string(),
});

// ============================================================================
// Valibot Schemas
// ============================================================================

const valibotSimpleObject = v.object({
  name: v.string(),
  age: v.number(),
  active: v.boolean(),
});

const valibotMediumObject = v.object({
  id: v.number(),
  name: v.string(),
  email: v.string(),
  age: v.number(),
  active: v.boolean(),
  score: v.number(),
  level: v.number(),
  verified: v.boolean(),
  premium: v.boolean(),
  role: v.string(),
});

const valibotComplexObject = v.object({
  id: v.number(),
  name: v.string(),
  email: v.string(),
  age: v.number(),
  active: v.boolean(),
  score: v.number(),
  level: v.number(),
  verified: v.boolean(),
  premium: v.boolean(),
  role: v.string(),
  bio: v.string(),
  website: v.string(),
  phone: v.string(),
  country: v.string(),
  city: v.string(),
  zip: v.string(),
  config: v.object({
    enabled: v.boolean(),
    timeout: v.number(),
    retries: v.number(),
  }),
  tags: v.array(v.string()),
  users: v.array(
    v.object({
      id: v.number(),
      name: v.string(),
      active: v.boolean(),
    })
  ),
  metadata: v.string(),
});

// ============================================================================
// Fastest-Validator Schemas
// ============================================================================

const fvSimpleObject = fastestValidator.compile({
  name: { type: "string" },
  age: { type: "number" },
  active: { type: "boolean" },
});

const fvMediumObject = fastestValidator.compile({
  id: { type: "number" },
  name: { type: "string" },
  email: { type: "string" },
  age: { type: "number" },
  active: { type: "boolean" },
  score: { type: "number" },
  level: { type: "number" },
  verified: { type: "boolean" },
  premium: { type: "boolean" },
  role: { type: "string" },
});

const fvComplexObject = fastestValidator.compile({
  id: { type: "number" },
  name: { type: "string" },
  email: { type: "string" },
  age: { type: "number" },
  active: { type: "boolean" },
  score: { type: "number" },
  level: { type: "number" },
  verified: { type: "boolean" },
  premium: { type: "boolean" },
  role: { type: "string" },
  bio: { type: "string" },
  website: { type: "string" },
  phone: { type: "string" },
  country: { type: "string" },
  city: { type: "string" },
  zip: { type: "string" },
  config: {
    type: "object",
    props: {
      enabled: { type: "boolean" },
      timeout: { type: "number" },
      retries: { type: "number" },
    },
  },
  tags: {
    type: "array",
    items: { type: "string" },
  },
  users: {
    type: "array",
    items: {
      type: "object",
      props: {
        id: { type: "number" },
        name: { type: "string" },
        active: { type: "boolean" },
      },
    },
  },
  metadata: { type: "string" },
});

// ============================================================================
// Benchmark Tests
// ============================================================================

/**
 * Simple Object (3 props): name, age, active
 * Tests basic object validation performance.
 */
export const jitSimpleObjectTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(v3SimpleObjectSchema, getSimpleObject()),
    },
    {
      name: "@kanon/JIT",
      fn: () => jitSimpleObject(getSimpleObject()),
    },
    {
      name: "Zod",
      fn: () => zodSimpleObject.safeParse(getSimpleObject()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSimpleObject, getSimpleObject()),
    },
    {
      name: "Fast-Validator",
      fn: () => fvSimpleObject(getSimpleObject()),
    },
  ];
};

/**
 * Medium Object (10 props)
 * Tests object validation with more properties.
 */
export const jitMediumObjectTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(v3MediumObjectSchema, getMediumObject()),
    },
    {
      name: "@kanon/JIT",
      fn: () => jitMediumObject(getMediumObject()),
    },
    {
      name: "Zod",
      fn: () => zodMediumObject.safeParse(getMediumObject()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotMediumObject, getMediumObject()),
    },
    {
      name: "Fast-Validator",
      fn: () => fvMediumObject(getMediumObject()),
    },
  ];
};

/**
 * Complex Object (20 props, nested)
 * Tests object validation with nested objects and arrays.
 * This is the main benchmark for JIT performance.
 */
export const jitComplexObjectTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(v3ComplexObjectSchema, getComplexObject()),
    },
    {
      name: "@kanon/JIT",
      fn: () => jitComplexObject(getComplexObject()),
    },
    {
      name: "Zod",
      fn: () => zodComplexObject.safeParse(getComplexObject()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotComplexObject, getComplexObject()),
    },
    {
      name: "Fast-Validator",
      fn: () => fvComplexObject(getComplexObject()),
    },
  ];
};

/**
 * Invalid Simple Object
 * Tests error path performance.
 */
export const jitSimpleObjectInvalidTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(v3SimpleObjectSchema, getInvalidSimple()),
    },
    {
      name: "@kanon/JIT",
      fn: () => jitSimpleObject(getInvalidSimple()),
    },
    {
      name: "Zod",
      fn: () => zodSimpleObject.safeParse(getInvalidSimple()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSimpleObject, getInvalidSimple()),
    },
    {
      name: "Fast-Validator",
      fn: () => fvSimpleObject(getInvalidSimple()),
    },
  ];
};
