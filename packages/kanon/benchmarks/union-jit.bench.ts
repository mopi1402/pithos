/**
 * Union JIT Benchmark Suite
 *
 * Comprehensive benchmark comparing V3 vs JIT for union validation.
 *
 * ## Criteria
 *
 * - **GO**: JIT >= 1.3x faster than V3 non-compiled
 * - **STOP**: JIT < 1x V3 (regression)
 *
 * ## Run
 *
 * ```bash
 * pnpm benchmark:kanon jit,v3,valibot union-jit.bench.ts
 * ```
 */

import { runBenchmarkSuite } from "./helpers/pool_helpers";
import {
  jitUnion2BranchTests,
  jitUnion4BranchTests,
  jitUnion2BranchInvalidTests,
  jitUnion4BranchInvalidTests,
} from "./benchs/union_jit";

// ============================================================================
// Benchmark Suites
// ============================================================================

runBenchmarkSuite("🔀 Union 2 Branches (string | number) - Valid", jitUnion2BranchTests());

runBenchmarkSuite("🔀 Union 4 Branches (string | number | boolean | null) - Valid", jitUnion4BranchTests());

runBenchmarkSuite("❌ Union 2 Branches - Invalid", jitUnion2BranchInvalidTests());

runBenchmarkSuite("❌ Union 4 Branches - Invalid", jitUnion4BranchInvalidTests());
