/**
 * Refinements JIT Benchmark
 *
 * Compares V3 non-compiled vs JIT compiled validators with refinements.
 * Measures the performance impact of refinements on JIT compilation.
 *
 * @since 2.0.0
 * @experimental
 *
 * ## Test Scenarios
 *
 * 1. No refinements: Baseline performance
 * 2. 1 refinement: Single custom validation
 * 3. 3 refinements: Multiple custom validations
 *
 * ## Objective
 *
 * Document the performance degradation due to refinements.
 * Refinements cannot be inlined and require function calls.
 */

import { parse as parseV3 } from "@kanon/core/parser.js";
import { string as stringV3 } from "@kanon/schemas/primitives/string";
import { number as numberV3 } from "@kanon/schemas/primitives/number";
import { object as objectV3 } from "@kanon/schemas/composites/object";
import { refineString } from "@kanon/schemas/constraints/refine/string";
import { refineNumber } from "@kanon/schemas/constraints/refine/number";
import { compile } from "@kanon/jit/compiler";
import { LibName, POOL_SIZE } from "../dataset/config";

// ============================================================================
// Type Definitions
// ============================================================================

interface TestObject {
  name: string;
  age: number;
  email: string;
}

// ============================================================================
// Test Data Pool
// ============================================================================

const testObjectPool: TestObject[] = Array.from({ length: POOL_SIZE }, (_, i) => ({
  name: `User-${i}-${Math.random().toString(36).substring(2, 10)}`,
  age: 18 + (i % 50) + Math.floor(Math.random() * 10),
  email: `user${i}@example.com`,
}));

// Cyclic index
let testIndex = 0;
const getTestObject = () => testObjectPool[testIndex++ % POOL_SIZE];

// ============================================================================
// Refinement Functions
// ============================================================================

// String refinements
const isNotEmpty = (v: string): true | string =>
  v.length > 0 ? true : "Cannot be empty";

const isLowercase = (v: string): true | string =>
  v === v.toLowerCase() ? true : "Must be lowercase";

const hasNoSpaces = (v: string): true | string =>
  !v.includes(" ") ? true : "Cannot contain spaces";

// Number refinements
const isPositive = (v: number): true | string =>
  v > 0 ? true : "Must be positive";

const isEven = (v: number): true | string =>
  v % 2 === 0 ? true : "Must be even";

const isLessThan100 = (v: number): true | string =>
  v < 100 ? true : "Must be less than 100";

// ============================================================================
// V3 Schemas - No Refinements
// ============================================================================

const v3NoRefinements = objectV3({
  name: stringV3(),
  age: numberV3(),
  email: stringV3(),
});

// ============================================================================
// V3 Schemas - 1 Refinement per property
// ============================================================================

const v3OneRefinement = objectV3({
  name: refineString(stringV3(), isNotEmpty),
  age: refineNumber(numberV3(), isPositive),
  email: refineString(stringV3(), isNotEmpty),
});

// ============================================================================
// V3 Schemas - 3 Refinements per property
// ============================================================================

const v3ThreeRefinements = objectV3({
  name: refineString(
    refineString(refineString(stringV3(), isNotEmpty), isLowercase),
    hasNoSpaces
  ),
  age: refineNumber(
    refineNumber(refineNumber(numberV3(), isPositive), isEven),
    isLessThan100
  ),
  email: refineString(
    refineString(refineString(stringV3(), isNotEmpty), isLowercase),
    hasNoSpaces
  ),
});

// ============================================================================
// JIT Compiled Validators
// ============================================================================

// Type assertion for compile function
type CompilerSchema = Parameters<typeof compile>[0];

const jitNoRefinements = compile(v3NoRefinements as CompilerSchema);
const jitOneRefinement = compile(v3OneRefinement as CompilerSchema);
const jitThreeRefinements = compile(v3ThreeRefinements as CompilerSchema);

// ============================================================================
// Benchmark Tests
// ============================================================================

/**
 * No Refinements - Baseline
 * Tests pure type validation without any refinements.
 */
export const noRefinementsTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(v3NoRefinements, getTestObject()),
    },
    {
      name: "@kanon/JIT",
      fn: () => jitNoRefinements(getTestObject()),
    },
  ];
};

/**
 * 1 Refinement per property
 * Tests the impact of a single refinement on each property.
 */
export const oneRefinementTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(v3OneRefinement, getTestObject()),
    },
    {
      name: "@kanon/JIT",
      fn: () => jitOneRefinement(getTestObject()),
    },
  ];
};

/**
 * 3 Refinements per property
 * Tests the impact of multiple refinements on each property.
 */
export const threeRefinementsTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/V3.0",
      fn: () => parseV3(v3ThreeRefinements, getTestObject()),
    },
    {
      name: "@kanon/JIT",
      fn: () => jitThreeRefinements(getTestObject()),
    },
  ];
};

/**
 * Comparison: No refinements vs 1 refinement vs 3 refinements
 * All JIT compiled to show the degradation.
 * Note: Uses @kanon/JIT for all tests - the suite name indicates the refinement count.
 */
export const refinementComparisonTests: () => {
  name: LibName;
  fn: () => void;
}[] = () => {
  return [
    {
      name: "@kanon/JIT" as LibName,
      fn: () => jitNoRefinements(getTestObject()),
    },
  ];
};
