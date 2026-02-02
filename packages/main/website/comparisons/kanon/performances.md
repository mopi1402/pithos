---
sidebar_label: "Performances"
sidebar_position: 2
title: "Kanon Performance Benchmarks"
description: "Runtime performance comparison between Kanon JIT and other validation libraries (Zod, Valibot, AJV, TypeBox...)"
---

import { BenchmarkResultsTable, VersionsTable, PerformanceSummary, WeightedSummary, DetailedStats, GeneratedDate, FilterableBenchmarkSection, KanonPerfTLDR } from '@site/src/components/PerformanceTable';
import { WeightedScoringTable } from '@site/src/components/WeightedScoringTable';

# Kanon Performance Benchmarks

Real-world validation benchmarks. **Data auto-generated on <GeneratedDate />.**

## TL;DR

<KanonPerfTLDR />

Operations per second. Higher is better.

## Methodology

Each benchmark:
1. Creates a pool of 10,000 test objects
2. Runs validation in a tight loop
3. Measures operations per second with statistical analysis
4. Reports min, max, mean, percentiles (p75, p99, p995, p999)
5. Includes relative margin of error (rme) for confidence

The "fastest" label is only awarded when the winner is **≥10% faster** than the runner-up. Otherwise, it's considered a statistical tie.

### Weighted Scoring

Not all validations matter equally for performance. Validating an API response called 1000x/sec matters more than a one-time config check. We assign weights based on real-world usage patterns:

<WeightedScoringTable />

This weighted scoring gives a more realistic picture of which library will actually make your app faster.

## Libraries Tested

<VersionsTable />

## Benchmark Results

<FilterableBenchmarkSection />

## Why Kanon JIT is Fast

1. **JIT Compilation** — Schemas are compiled to optimized JavaScript functions at runtime
2. **No runtime type checks** — Types are validated at compile-time by TypeScript
3. **Minimal abstraction** — Direct validation logic, no class hierarchies
4. **Discriminated unions** — O(1) lookup instead of O(n) trial-and-error

## A Note on Coercion Performance

On basic coercion operations, Kanon and Zod are **roughly equivalent**: each wins some benchmarks. This is despite a deliberate architectural difference.

**Zod mutates the input directly:**
```typescript
// Zod's approach (simplified)
if (def.coerce) {
  payload.value = new Date(payload.value); // mutation!
}
```

**Kanon returns a new value:**
```typescript
// Kanon's approach
if (value instanceof Date) return true;
return { coerced: new Date(value) }; // pure, no mutation
```

We chose **immutability over raw speed** because:
- **Predictability** — Functions don't modify their arguments
- **Debugging** — Easier to trace where values come from
- **Composition** — Pure functions compose better
- **Safety** — No unexpected side-effects

The performance difference is negligible in practice (~0.00001ms per validation), and Kanon still dominates on **coercion with constraints** (36x faster than Zod on `date.max()`), which is the common real-world use case.

## Reproduce These Results

```bash
# Clone the repo
git clone https://github.com/mopi1402/pithos.git
cd pithos

# Run benchmarks
pnpm benchmark:kanon realworld all
```
