---
title: "Decorator Pattern in TypeScript"
sidebar_label: "Decorator"
description: "Learn how to implement the Decorator design pattern in TypeScript with functional programming. Add behavior to functions without modifying them."
keywords:
  - decorator pattern typescript
  - function composition
  - add behavior dynamically
  - wrap functions
  - middleware pattern
---

import { PatternDemo } from '@site/src/components/playground/PatternDemo';

# Decorator Pattern

Attach additional behavior to a function dynamically, without altering the original function.

---

## The Problem

You have a DNA sequence analysis function. Now you need to add quality filtering. Then caching for reference sequences. Then retry logic for long sequences. Then timing metrics.

The naive approach:

```typescript
async function analyzeSequence(dna: string) {
  console.log(`Analyzing ${dna.length} base pairs`);  // logging mixed in
  const start = Date.now();                            // timing mixed in
  
  if (getQualityScore(dna) < 30) {                    // filtering mixed in
    throw new Error("Low quality sequence");
  }
  
  const cached = cache.get(dna);                      // caching mixed in
  if (cached) return cached;
  
  try {
    const result = await runAnalysis(dna);
    cache.set(dna, result);
    console.log(`Took ${Date.now() - start}ms`);
    return result;
  } catch (e) {
    // retry logic mixed in...
  }
}
```

The core analysis is buried under cross-cutting concerns. Testing is painful.

---

## The Solution

Keep the core function pure. Stack decorators that each wrap the previous one — same signature in, same signature out:

```typescript
import { decorate } from "@pithos/core/eidos/decorator/decorator";

// Pure core function — just the analysis
const analyzeSequence = async (dna: string) => runAnalysis(dna);

// Each decorator wraps the previous, preserving the signature
const enhanced = decorate(
  analyzeSequence,
  withQualityFilter(30),          // reject low-quality sequences
  withCache(new Map()),           // cache results for known sequences
  withRetry(3),                   // retry on timeout
  withTiming("analysis"),         // log execution time
);

const result = await enhanced("ATCGATCG...");
```

The consumer sees the same `(dna: string) => Promise<Result>` signature regardless of how many layers are stacked. That's the key insight: **decorators are invisible to the caller**.

For simpler cases, use `before`, `after`, and `around` helpers:

```typescript
import { before, after, around } from "@pithos/core/eidos/decorator/decorator";

// before/after for side effects
const withLogging = before((dna) => console.log(`Analyzing ${dna.length}bp`));
const withMetrics = after((_, result) => metrics.record(result));

// around for full control (caching, retry, etc.)
const withCache = (cache: Map<string, Result>) => around((fn, dna) => {
  const cached = cache.get(dna);
  if (cached) return cached;
  const result = fn(dna);
  cache.set(dna, result);
  return result;
});
```

---

## Live Demo

<PatternDemo pattern="decorator" />

---

## Real-World Analogy

A coffee order. Start with espresso (core). Add milk (decorator). Add sugar (decorator). Add whipped cream (decorator). Each addition wraps the previous result without changing how espresso is made.

---

## When to Use It

- Add logging, caching, validation, retry, or timing to existing functions
- You want to compose multiple independent behaviors
- Cross-cutting concerns should be separate from business logic

---

## When NOT to Use It

If you just need one fixed enhancement, a simple wrapper function is enough. Decorator shines when you compose multiple independent behaviors.

---

## API

- [decorate](/api/eidos/decorator/decorate) — Apply multiple decorators to a function
- [before](/api/eidos/decorator/before) — Run code before the function executes
- [after](/api/eidos/decorator/after) — Run code after the function returns
- [around](/api/eidos/decorator/around) — Wrap the function with full control over execution
