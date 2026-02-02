/**
 * Refinements JIT Benchmark Suite
 *
 * Measures the performance impact of refinements on JIT compilation.
 *
 * ## Objective
 *
 * Document the performance degradation due to refinements.
 * Refinements are user-defined validation functions that cannot be inlined
 * because their source code is not accessible. They are stored as external
 * functions and called via the externals map.
 *
 * ## Expected Results
 *
 * - No refinements: JIT should be ~2x faster than V3
 * - 1 refinement: JIT gains should be reduced
 * - 3 refinements: JIT gains should be further reduced
 *
 * ## Run
 *
 * ```bash
 * pnpm benchmark:kanon jit,v3 refinements-jit.bench.ts
 * ```
 */

import { runBenchmarkSuite } from "./helpers/pool_helpers";
import {
  noRefinementsTests,
  oneRefinementTests,
  threeRefinementsTests,
} from "./benchs/refinements_jit";

// ============================================================================
// Benchmark Suites
// ============================================================================

runBenchmarkSuite("🔧 No Refinements - Baseline", noRefinementsTests());

runBenchmarkSuite("🔧 1 Refinement per property", oneRefinementTests());

runBenchmarkSuite("🔧 3 Refinements per property", threeRefinementsTests());
