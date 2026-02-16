---
sidebar_label: "Performances"
sidebar_position: 2
title: "Taphos Performance Benchmarks"
description: "Runtime performance comparison between Taphos, es-toolkit, and Lodash for utility functions"
---

import { TaphosBenchmarkResultsTable, TaphosVersionsTable, TaphosPerformanceSummary, TaphosWeightedSummary, TaphosDetailedStats, TaphosGeneratedDate, TaphosPerfTLDR } from '@site/src/components/comparisons/taphos/PerformanceTable';
import { WeightedScoringTable } from '@site/src/components/comparisons/WeightedScoringTable';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# 🚅 Taphos Performance Benchmarks

Performance comparison between **Taphos**, **es-toolkit**, **lodash** and **lodash-es**.

**Data auto-generated on <TaphosGeneratedDate />.**

## TL;DR

<TaphosPerfTLDR />

---

## Methodology

To ensure a fair comparison, benchmarks are adapted from [es-toolkit's benchmark suite](https://github.com/toss/es-toolkit/tree/main/benchmarks/performance). Using a well-known, third-party benchmark suite avoids any bias in our favor.

<DashedSeparator noMarginBottom />

### Does Performance Matter?

Not all functions matter equally for performance. A `map` called 10,000 times in a loop matters more than a `debounce` called once at setup. We assign weights based on real-world usage patterns:

<WeightedScoringTable />

This scoring gives a more realistic picture of which library will actually make your app faster.

:::note Benchmark adjustments
We made minor adjustments to some benchmarks to ensure they measure actual function execution:

**Excluded:**
- **delay**: Timer-based functions aren't meaningful to benchmark.

**Adjusted to test invocation (not just creation):**
- constant, wrap, partial, rest, spread, unary
:::

Each benchmark tests two scenarios:
1. **Small arrays**: Typical real-world usage (3-10 items)
2. **Large arrays**: Stress test with 10,000 items

The "fastest" label indicates the best performer for each test.

---

## Libraries Tested

<TaphosVersionsTable />

---

## Benchmark Results

<TaphosBenchmarkResultsTable />

<DashedSeparator noMarginBottom />

<TaphosPerformanceSummary />

<DashedSeparator noMarginBottom />

<TaphosWeightedSummary />

<DashedSeparator noMarginBottom />

### Key Takeaways

**Native JavaScript wins.** The weighted summary shows `native` leading by a wide margin. This is intentional: modern JavaScript has caught up with most utility libraries.

**Taphos is a migration path, not a destination.** All Taphos functions are marked `@deprecated` because the goal is to help you migrate to native JavaScript, not to lock you into another library.

**Taphos beats the competition while you migrate.** Among utility libraries, Taphos consistently outperforms es-toolkit/compat and lodash-es on critical functions. Use it as a quality polyfill while progressively adopting native equivalents.

---

## The Taphos Philosophy

:::tip Migrate to Native
Taphos exists to make your Lodash migration painless. But the real performance gain comes from adopting native JavaScript methods. Every Taphos function is deprecated: that's by design.
:::

**Why deprecate everything?**
- Native `Array.prototype.flat()` is faster than any library's `flatten`
- Native `structuredClone()` beats `cloneDeep`
- Native `Object.keys()` needs no wrapper
- Modern JavaScript (ES2020+) covers 90% of Lodash use cases

**Taphos helps you:**
1. Drop Lodash without breaking your codebase
2. Get TypeScript types and tree-shaking immediately
3. Migrate function by function to native equivalents
4. Remove Taphos entirely when you're done

---

## ✅ When to Use Native

| Lodash/Taphos | Native Equivalent |
|---------------|-------------------|
| `flatten(arr)` | `arr.flat()` |
| `flattenDeep(arr)` | `arr.flat(Infinity)` |
| `includes(arr, val)` | `arr.includes(val)` |
| `keys(obj)` | `Object.keys(obj)` |
| `values(obj)` | `Object.values(obj)` |
| `entries(obj)` | `Object.entries(obj)` |
| `cloneDeep(obj)` | `structuredClone(obj)` |
| `isArray(val)` | `Array.isArray(val)` |
| `isNaN(val)` | `Number.isNaN(val)` |

---

## Why Taphos is Still Fast

While you're migrating, Taphos won't slow you down:

1. **ES2020+ target**: No transpilation overhead
2. **No legacy checks**: We don't test for IE edge cases
3. **Simpler internals**: Less abstraction, more direct code
4. **TypeScript-first**: Types are compile-time, zero runtime cost

---

## When Lodash Wins

Lodash uses algorithms optimized for very large datasets:
- **Hash-based lookups** for `intersection`, `difference` on 10K+ items
- **Lazy evaluation** in some chained operations

For most real-world code, arrays are small (< 100 items) and simpler approaches win.

---

## Detailed Statistics

For the skeptics who want to see the raw numbers:

<TaphosDetailedStats />

---

## Reproduce These Results

Want to verify these results? See [how to reproduce our data](../reproduce.md).

---

<RelatedLinks>

- [Taphos Module Guide](/guide/modules/taphos/) — The four burial types and IDE-guided migration
- [Arkhe — Performance](../arkhe/performances.md) — Non-deprecated utilities benchmarks (same libraries)
- [Taphos — Native Equivalence](./native-equivalence.md) — When native JS is enough
- [Equivalence Table](/comparisons/equivalence-table/) — Full library equivalence across all modules

</RelatedLinks>
