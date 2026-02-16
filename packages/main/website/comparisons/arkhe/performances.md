---
sidebar_label: "Performances"
sidebar_position: 2
title: "Arkhe Performance Benchmarks"
description: "Runtime performance comparison between Arkhe, es-toolkit, and Lodash for utility functions"
---

import { ArkheBenchmarkResultsTable, ArkheVersionsTable, ArkhePerformanceSummary, ArkheWeightedSummary, ArkheDetailedStats, ArkheGeneratedDate, ArkhePerfTLDR, ArkheBalancedTLDR, ArkheBalancedChart, ArkheBalancedTable } from '@site/src/components/comparisons/arkhe/PerformanceTable';
import { WeightedScoringTable } from '@site/src/components/comparisons/WeightedScoringTable';
import { Accordion } from '@site/src/components/shared/Accordion';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 🚅 Arkhe Performance Benchmarks

Performance comparison between **Arkhe**, **es-toolkit**, **es-toolkit/compat** and **lodash-es**.

**Data auto-generated on <ArkheGeneratedDate />.**

## TL;DR

<ArkhePerfTLDR />

Operations per second. Higher is better.

--- 

## Methodology

To ensure a fair comparison, benchmarks are adapted from [es-toolkit's benchmark suite](https://github.com/toss/es-toolkit/tree/main/benchmarks/performance). Using a well-known, third-party benchmark suite avoids any bias in our favor.

### Does Performance Matter?

Not all functions matter equally for performance. A `map` called 10,000 times in a loop matters more than a `debounce` called once at setup. We assign weights based on real-world usage patterns:

<WeightedScoringTable />

This scoring gives a more realistic picture of which library will actually make your app faster.

:::note Benchmark adjustments
We made minor adjustments to some benchmarks to ensure they measure actual function execution rather than just function creation.
:::

Each benchmark tests two scenarios:
1. **Small arrays**: Typical real-world usage (3-10 items)
2. **Large arrays**: Stress test with 10,000 items

The "fastest" label indicates the best performer for each test.

--- 

## Libraries Tested

<ArkheVersionsTable />

--- 

## Benchmark Results

<ArkheBenchmarkResultsTable />

<DashedSeparator />

<ArkhePerformanceSummary />

<DashedSeparator />

<ArkheWeightedSummary />

--- 

## Why Arkhe Is Slower Sometimes

Arkhe occasionally loses a benchmark, not because of poor optimization, but because it does **more work** than the competitor.

**Correctness over raw speed.** Some functions do extra work to return correct results:

| Function | What Arkhe does extra | Why it matters |
|---|---|---|
| `intersectionWith` | Deduplicates the result | A set intersection should not contain duplicates. es-toolkit returns them as-is. |

**Fail-fast validation.** Arkhe validates inputs early and throws on invalid arguments. This adds a few bytes and nanoseconds, but catches bugs at the call site instead of producing silent wrong results downstream. When you see a ❌ on bundle or perf, this trade-off may be the reason.

When comparing numbers, always check whether the competing function actually does the same work. A faster function that returns wrong results is not faster - it's incomplete.

:::tip
If a function appears slower on small inputs but equal or faster on large inputs, the overhead is likely input validation or deduplication: work that pays off at scale and prevents bugs.
:::

--- 

## Balanced Overview

Bundle size and performance tell different stories. This section crosses both to show where Arkhe wins on each axis.

Compared against **es-toolkit**, **es-toolkit/compat** and **lodash-es** (the same libraries as above). Bundle = smallest or within 10%. Perf = fastest in at least one scenario.

<DashedSeparator />

<ArkheBalancedTLDR />

<DashedSeparator />

<ArkheBalancedChart />

The "Perf matters?" column tells you if the performance difference actually impacts your app. A `debounce` marked ⬜ is not a concern: you call it once. A `groupBy` marked ✅ with weight CRITICAL is where Arkhe delivers real value.

<Accordion title="Full function-by-function breakdown">
  <ArkheBalancedTable />
</Accordion>

<DashedSeparator />

### Key Takeaways

**Arkhe is consistently fast.** No wild variations: you get predictable performance across all utilities.

**es-toolkit/compat pays a price.** Their lodash compatibility layer often performs worse than lodash-es itself (see `omit`, `intersectionWith`). When you prioritize API compatibility, you inherit the constraints.

**Arkhe makes its own choices.** We don't mimic Lodash's API. This freedom lets us optimize for modern JavaScript without legacy constraints.

--- 

## Why Arkhe is Fast (on small/medium data)

1. **ES2020+ target**: No transpilation overhead, modern JavaScript features
2. **No legacy checks**: We don't test for IE edge cases
3. **Simpler internals**: Less abstraction, more direct code
4. **TypeScript-first**: Types are compile-time, zero runtime cost

---

## When Lodash Wins (on large arrays)

Lodash sometimes uses different algorithms optimized for large datasets:
- **Hash-based lookups** for `intersection`, `difference` on 10K+ items
- **Lazy evaluation** in some chained operations
- **Years of production optimizations** refined through real-world usage

For most real-world code, arrays are small (< 100 items) and Arkhe's simpler approach wins. On large arrays, results vary by function: Arkhe is competitive or faster in many cases.

--- 

## Detailed Statistics

For the skeptics who want to see the raw numbers:

<ArkheDetailedStats />

--- 

## Reproduce These Results

Want to verify these results? See [how to reproduce our data](../reproduce.md).

---

<RelatedLinks>

- [Arkhe vs Lodash](./arkhe-vs-lodash.md) — Full comparison: philosophy, API, migration
- [Taphos — Performance](../taphos/performances.md) — Deprecated utilities benchmarks (same libraries)
- [Equivalence Table](/comparisons/equivalence-table/) — Full library equivalence across all modules

</RelatedLinks>
