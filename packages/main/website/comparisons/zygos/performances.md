---
sidebar_label: "Performances"
sidebar_position: 2
title: "Zygos Performance Benchmarks"
description: "Runtime performance comparison between Zygos, Neverthrow and fp-ts for Result and Option patterns"
---

import { ZygosResultBenchmarkTable, ZygosOptionBenchmarkTable, ZygosVersionsTable, ZygosPerformanceSummary, ZygosDetailedStats, ZygosGeneratedDate, ZygosPerfTLDR } from '@site/src/components/comparisons/zygos/PerformanceTable';

# 🚅 Zygos Performance Benchmarks

Performance comparison between **Zygos**, **Neverthrow** (Result) and **fp-ts** (Option).

**Data auto-generated on <ZygosGeneratedDate />.**

## TL;DR

<ZygosPerfTLDR />

Operations per second. Higher is better.

## Libraries Tested

<ZygosVersionsTable />

## Result Pattern (Zygos vs Neverthrow)

The Result pattern is the core of error handling in both libraries. Here's how they compare:

<ZygosResultBenchmarkTable />

### Key Findings

**Object creation is 2-3x faster.** Zygos uses simple object literals while Neverthrow uses class instantiation with more overhead.

**Chained operations (`andThen`) are 2-4x faster.** Zygos's simpler implementation pays off when chaining multiple operations.

**Simple operations are equivalent.** `isOk()`, `isErr()`, `unwrapOr()` perform identically — both are just property checks.

## Option Pattern (Zygos vs fp-ts)

Zygos provides a lightweight Option implementation compared to fp-ts's more comprehensive (but heavier) approach:

<ZygosOptionBenchmarkTable />

### Key Findings

**Zygos is 1.5-8x faster across all Option operations.** The biggest wins are on `flatMap` (8x) and `getOrElse` (2x).

**fp-ts's `pipe` adds overhead.** While elegant, the functional composition style has a runtime cost.

**Zygos uses direct function calls.** No intermediate abstractions, just simple conditionals.

<ZygosPerformanceSummary />

## Why Zygos is Fast

1. **Simple object literals** — `{ _tag: "Ok", value }` instead of class instances
2. **No intermediate abstractions** — Direct property access, no method chains
3. **Modern JavaScript** — ES2020+ target, no transpilation overhead
4. **Minimal code** — Less code = less to execute

## When Performance Doesn't Matter

For most applications, both Zygos and Neverthrow are "fast enough". The real differentiator is:

- **Bundle size**: Zygos is ~8x smaller than Neverthrow
- **API ergonomics**: Choose what feels right for your team
- **Ecosystem**: Zygos integrates with other Pithos modules

## Detailed Statistics

For the skeptics who want to see the raw numbers:

<ZygosDetailedStats />

## Reproduce These Results

```bash
# Clone the repo
git clone https://github.com/mopi1402/pithos.git
cd pithos

# Run benchmarks
pnpm benchmark:zygos

# Generate JSON report
pnpm doc:generate:zygos:benchmarks-results
```
