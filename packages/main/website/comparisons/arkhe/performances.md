---
sidebar_label: "Performances"
sidebar_position: 2
title: "Arkhe Performance Benchmarks"
description: "Runtime performance comparison between Arkhe, es-toolkit, and Lodash for utility functions"
---

import { ArkheBenchmarkResultsTable, ArkheVersionsTable, ArkhePerformanceSummary, ArkheWeightedSummary, ArkheDetailedStats, ArkheGeneratedDate, ArkhePerfTLDR } from '@site/src/components/ArkhePerformanceTable';
import { WeightedScoringTable } from '@site/src/components/WeightedScoringTable';

# Arkhe Performance Benchmarks

Performance comparison between **arkhe**, **es-toolkit**, **lodash** and **lodash-es**.

**Data auto-generated on <ArkheGeneratedDate />.**

## TL;DR

<ArkhePerfTLDR />

Operations per second. Higher is better.

## Methodology

To ensure a fair comparison, benchmarks are adapted from [es-toolkit's benchmark suite](https://github.com/toss/es-toolkit/tree/main/benchmarks/performance). Using a well-known, third-party benchmark suite avoids any bias in our favor.

### Weighted Scoring

Not all functions matter equally for performance. A `map` called 10,000 times in a loop matters more than a `debounce` called once at setup. We assign weights based on real-world usage patterns:

<WeightedScoringTable />

This weighted scoring gives a more realistic picture of which library will actually make your app faster.

:::note Benchmark adjustments
We made minor adjustments to some benchmarks to ensure they measure actual function execution rather than just function creation.
:::

Each benchmark tests two scenarios:
1. **Small arrays** — Typical real-world usage (3-10 items)
2. **Large arrays** — Stress test with 10,000 items

The "fastest" label indicates the best performer for each test.

## Libraries Tested

<ArkheVersionsTable />

## Benchmark Results

<ArkheBenchmarkResultsTable />

<ArkhePerformanceSummary />

<ArkheWeightedSummary />

### Key Takeaways

**Arkhe is consistently fast.** No wild variations — you get predictable performance across all utilities.

**es-toolkit/compat pays a price.** Their Lodash compatibility layer often performs worse than Lodash itself (see `omit`, `intersectionWith`). When you prioritize API compatibility, you inherit the constraints.

**Arkhe makes its own choices.** We don't mimic Lodash's API. This freedom lets us optimize for modern JavaScript without legacy baggage.

## Why Arkhe is Fast (on small/medium data)

1. **ES2020+ target** — No transpilation overhead, modern JavaScript features
2. **No legacy checks** — We don't test for IE edge cases
3. **Simpler internals** — Less abstraction, more direct code
4. **TypeScript-first** — Types are compile-time, zero runtime cost

## When Lodash Wins (on large arrays)

Lodash uses different algorithms optimized for large datasets:
- **Hash-based lookups** for `intersection`, `difference` on 10K+ items
- **Lazy evaluation** in some chained operations
- **Battle-tested optimizations** from years of production use

For most real-world code, arrays are small (< 100 items) and Arkhe's simpler approach wins.

## When to Use Native

Use native methods when they exist:

| Task | Use This |
|------|----------|
| Flatten array | `array.flat()` |
| Check includes | `array.includes()` |
| Object keys | `Object.keys()` |
| Deep clone | `structuredClone()` |

Arkhe doesn't wrap native methods unnecessarily.

## Detailed Statistics

For the skeptics who want to see the raw numbers:

<ArkheDetailedStats />

## Reproduce These Results

```bash
# Clone the repo
git clone https://github.com/mopi1402/pithos.git
cd pithos

# Run benchmarks
pnpm benchmark:arkhe

# Generate JSON report
pnpm doc:generate:arkhe:benchmarks-results
```
