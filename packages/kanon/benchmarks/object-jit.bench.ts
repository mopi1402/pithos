/**
 * Object JIT Benchmark Suite
 *
 * Comprehensive benchmark comparing V3 vs JIT vs Fastest-Validator
 * for object validation at different complexity levels.
 *
 * ## Criteria
 *
 * - **GO**: JIT >= 2x faster than V3 on complex objects
 * - **ACCEPTABLE**: JIT within 20% of Fastest-Validator
 *
 * ## Run
 *
 * ```bash
 * pnpm benchmark:kanon jit,v3,fastest object-jit.bench.ts
 * ```
 */

import { runBenchmarkSuite } from "./helpers/pool_helpers";
import {
  jitSimpleObjectTests,
  jitMediumObjectTests,
  jitComplexObjectTests,
  jitSimpleObjectInvalidTests,
} from "./benchs/object_jit";

// ============================================================================
// Benchmark Suites
// ============================================================================

runBenchmarkSuite("🏠 Simple Object (3 props) - Valid", jitSimpleObjectTests());

runBenchmarkSuite("🏢 Medium Object (10 props) - Valid", jitMediumObjectTests());

runBenchmarkSuite("🏰 Complex Object (20 props, nested) - Valid", jitComplexObjectTests());

runBenchmarkSuite("❌ Simple Object (3 props) - Invalid", jitSimpleObjectInvalidTests());
