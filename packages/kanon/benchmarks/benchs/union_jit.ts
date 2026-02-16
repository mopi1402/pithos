/**
 * Union JIT Benchmark
 *
 * Compares V3 non-compiled vs JIT compiled union validators against other libraries.
 * Tests various union configurations to identify if unions are a weak point for JIT.
 *
 * @since 2.0.0
 * @experimental
 *
 * ## Test Scenarios
 *
 * 1. Simple union (2 branches): string | number
 * 2. Medium union (4 branches): string | number | boolean | null
 *
 * ## Criteria
 *
 * - **GO**: JIT >= 1.3x faster than V3 non-compiled
 * - **STOP**: JIT < 1x V3 (regression)
 */

import * as z from "zod";
import * as v from "valibot";
import { parse as parseV3 } from "@kanon/core/parser.js";
import { string as stringV3 } from "@kanon/schemas/primitives/string";
import { number as numberV3 } from "@kanon/schemas/primitives/number";
import { boolean as booleanV3 } from "@kanon/schemas/primitives/boolean";
import { null_ as nullV3 } from "@kanon/schemas/primitives/null";
import { unionOf, unionOf4 } from "@kanon/schemas/operators/union";
import { LibName, POOL_SIZE } from "../dataset/config";

// JIT imports
import { createGeneratorContext } from "@kanon/jit/context";
import {
  generateUnionValidation,
  createStringBranch,
  createNumberBranch,
  createBooleanBranch,
  createNullBranch,
  type UnionBranchMeta,
} from "@kanon/jit/builders/operators/union";
import { generateStringValidation } from "@kanon/jit/builders/primitives/string";
import { generateNumberValidation } from "@kanon/jit/builders/primitives/number";
import { generateBooleanValidation } from "@kanon/jit/builders/primitives/boolean";

// ============================================================================
// Test Data Pools
// ============================================================================

// Pool for 2-branch union (string | number)
const union2Pool: (string | number)[] = Array.from({ length: POOL_SIZE }, (_, i) =>
  i % 2 === 0 ? `string-${i}` : i * 10
);

// Pool for 4-branch union (string | number | boolean | null)
const union4Pool: (string | number | boolean | null)[] = Array.from(
  { length: POOL_SIZE },
  (_, i) => {
    const type = i % 4;
    if (type === 0) return `string-${i}`;
    if (type === 1) return i * 10;
    if (type === 2) return i % 2 === 0;
    return null;
  }
);

// Invalid values pool (for testing error paths)
const invalidPool: unknown[] = Array.from({ length: POOL_SIZE }, (_, i) => {
  const type = i % 4;
  if (type === 0) return { invalid: true };
  if (type === 1) return [1, 2, 3];
  if (type === 2) return Symbol(`invalid-${i}`);
  return () => {};
});

// Cyclic indices
let union2Index = 0;
let union4Index = 0;
let invalidIndex = 0;

const getUnion2Value = () => union2Pool[union2Index++ % POOL_SIZE];
const getUnion4Value = () => union4Pool[union4Index++ % POOL_SIZE];
const getInvalidValue = () => invalidPool[invalidIndex++ % POOL_SIZE];

// ============================================================================
// JIT Compiled Validators (created once)
// ============================================================================

/**
 * Creates a JIT compiled validator for a 2-branch union (string | number)
 */
function createJitUnion2Validator(): (value: unknown) => true | string {
  const ctx = createGeneratorContext();
  const branches: UnionBranchMeta[] = [
    createStringBranch((varName, c) => generateStringValidation(varName, c)),
    createNumberBranch((varName, c) => generateNumberValidation(varName, c)),
  ];

  const result = generateUnionValidation("value", ctx, { branches });
  const code = result.code.join("\n");

  // eslint-disable-next-line no-new-func
  return new Function("value", code) as (value: unknown) => true | string;
}

/**
 * Creates a JIT compiled validator for a 4-branch union (string | number | boolean | null)
 */
function createJitUnion4Validator(): (value: unknown) => true | string {
  const ctx = createGeneratorContext();
  const branches: UnionBranchMeta[] = [
    createStringBranch((varName, c) => generateStringValidation(varName, c)),
    createNumberBranch((varName, c) => generateNumberValidation(varName, c)),
    createBooleanBranch((varName, c) => generateBooleanValidation(varName, c)),
    createNullBranch(),
  ];

  const result = generateUnionValidation("value", ctx, { branches });
  const code = result.code.join("\n");

  // eslint-disable-next-line no-new-func
  return new Function("value", code) as (value: unknown) => true | string;
}

// Pre-compile JIT validators
const jitUnion2 = createJitUnion2Validator();
const jitUnion4 = createJitUnion4Validator();

// ============================================================================
// V3 Non-Compiled Schemas
// ============================================================================

const v3Union2Schema = unionOf(stringV3(), numberV3());
const v3Union4Schema = unionOf4(stringV3(), numberV3(), booleanV3(), nullV3());

// ============================================================================
// Benchmark Tests
// ============================================================================

/**
 * 2-Branch Union: string | number
 * Tests the simplest union case with primitive types.
 */
export const jitUnion2BranchTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const zodSchema = z.union([z.string(), z.number()]);
  const valibotSchema = v.union([v.string(), v.number()]);

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(v3Union2Schema, getUnion2Value()),
    },
    {
      name: "@kanon/JIT",
      fn: () => jitUnion2(getUnion2Value()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getUnion2Value()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getUnion2Value()),
    },
  ];
};

/**
 * 4-Branch Union: string | number | boolean | null
 * Tests a medium-sized union with mixed primitive types.
 */
export const jitUnion4BranchTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const zodSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
  const valibotSchema = v.union([v.string(), v.number(), v.boolean(), v.null()]);

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(v3Union4Schema, getUnion4Value()),
    },
    {
      name: "@kanon/JIT",
      fn: () => jitUnion4(getUnion4Value()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getUnion4Value()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getUnion4Value()),
    },
  ];
};

/**
 * Invalid Values - 2 Branch Union
 * Tests error path performance when no branch matches.
 */
export const jitUnion2BranchInvalidTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const zodSchema = z.union([z.string(), z.number()]);
  const valibotSchema = v.union([v.string(), v.number()]);

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(v3Union2Schema, getInvalidValue()),
    },
    {
      name: "@kanon/JIT",
      fn: () => jitUnion2(getInvalidValue()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getInvalidValue()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getInvalidValue()),
    },
  ];
};

/**
 * Invalid Values - 4 Branch Union
 * Tests error path performance with more branches.
 */
export const jitUnion4BranchInvalidTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  const zodSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
  const valibotSchema = v.union([v.string(), v.number(), v.boolean(), v.null()]);

  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(v3Union4Schema, getInvalidValue()),
    },
    {
      name: "@kanon/JIT",
      fn: () => jitUnion4(getInvalidValue()),
    },
    {
      name: "Zod",
      fn: () => zodSchema.safeParse(getInvalidValue()),
    },
    {
      name: "Valibot",
      fn: () => v.safeParse(valibotSchema, getInvalidValue()),
    },
  ];
};
