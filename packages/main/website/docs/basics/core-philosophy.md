---
sidebar_position: 2
title: Core Philosophy
description: "Discover the core philosophy behind Pithos: the guiding principles and architectural decisions that shape every module of this TypeScript utilities library."
slug: core-philosophy
---

import ResponsiveMermaid from "@site/src/components/shared/ResponsiveMermaid";
import InvisibleList from "@site/src/components/shared/InvisibleList";
import MarbleQuote from "@site/src/components/shared/MarbleQuote";

# 👁️ Core Philosophy

> **The vision that guides every architectural decision in Pithos**

---

## Cardinal Principle

<MarbleQuote>The need guides me. Technology follows.</MarbleQuote>

Everything stems from this principle. We don't choose a technology because it's trendy, elegant, or impressive. We choose it because it addresses the need.

And the ultimate need is **the end user**.

The developer is the **craftsman**. The user is the **purpose**. This simple truth guides all our technical choices.

---

## Priority Hierarchy

### 1. User Experience (UX) - Absolute Priority

User experience is **always** the #1 criterion:

- **Performance**: load time, responsiveness, fluidity
- **Bundle size**: fewer KB = more speed
- **Time to Interactive**: users must be able to act quickly

> _The end user doesn't know (and shouldn't know) which library runs behind the scenes. They just want it to work, fast and well._

### 2. Developer Experience (DX) - Secondary Priority

**Only then** do we maximize developer experience:

- Intuitive and consistent API
- Clear documentation
- Explicit error messages
- Quality TypeScript typing

> _The best API is the one you don't need to look up twice._

#### Crucial Distinction: Free DX vs Paid DX

| DX Type                                               | Runtime Cost | Decision          |
| ----------------------------------------------------- | ------------ | ----------------- |
| **Free DX**: types, naming, API design, documentation | 0            | ✅ Always welcome |
| **Paid DX**: runtime abstractions, magic, wrappers    | > 0          | ❌ Unacceptable   |

**Concrete example: auto-curry**

```typescript
// "Magic" auto-curry (Remeda style)
map(array, fn); // Detects 2 args → data-first
map(fn); // Detects 1 arg → returns curried function
// 👎 Cost: runtime detection on EVERY call, wrappers, extra logic

// Pithos approach: data-first only
map(array, fn); // Standard, always data-first
// For composition, use pipe() with explicit data-first calls
pipe(array, arr => map(arr, fn));
// 👍 Cost: 0, no runtime detection, crystal clear
```

> _We don't impact 100% of users to slightly improve code readability._

**The rule is simple**: if a DX improvement has a runtime cost, however minimal, it has no place in Pithos. The end user should never pay for developer comfort.

:::note
Pithos provides a [`curry()`](/api/arkhe/function/curry/) utility for users who want to create curried functions. Unlike auto-curry (which has runtime detection cost), [`curry()`](/api/arkhe/function/curry/) is a zero-cost abstraction: the choice is made at build time, not at runtime.
:::

### 3. Pragmatism - The Art of Smart Compromise

A certain level of pragmatism guides our choices:

| !Context                    | Approach                              |
| --------------------------- | ------------------------------------- |
| **Where it really matters** | Prioritize performance, no compromise |
| **Where V8 optimizes well** | Smart compromise to improve DX        |
| **Negligible cost**         | Improve DX without hesitation         |

---

## TypeScript: The Best of Both Worlds

TypeScript is the ideal choice for Pithos because it perfectly embodies our philosophy:

- **Improves DX**: autocompletion, refactoring, integrated documentation
- **Zero runtime cost**: types disappear at transpilation
- **Errors at build**: we catch bugs before they reach the user

> _All the power of static typing, without a single extra byte in the bundle._

---

## Compile-Time > Runtime

### Fundamental Principle

Everything that **can** be resolved at compile time **must** be.

| !Moment          | Examples                                     | Cost                       |
| ---------------- | -------------------------------------------- | -------------------------- |
| **Compile-time** | Types, inlining, dead code elimination       | 0 runtime                  |
| **Build-time**   | Tree-shaking, minification, V8 optimizations | 0 runtime                  |
| **Runtime**      | Only the unavoidable                         | Accepted cost if justified |

### What Must Be Predictable

- **Structure validation** → TypeScript types (compile-time)
- **Known transformations** → Optimized by V8 or bundler
- **Code paths** → Predictable branching for JIT

### What Remains at Runtime (by necessity)

Some things **cannot** be predicted and must be handled at runtime:

- **Boundary validation**: API data, user inputs, files
- **Dynamic data**: server responses, WebSockets, events
- **Environment**: feature flags, runtime configuration

> _For these cases, we accept the runtime cost but optimize it as much as possible._

### Why This Approach?

<ResponsiveMermaid
  desktop={`flowchart LR
    P[Predictable] --> CT[Compile-time] --> Z[0 runtime cost] --> MUX[Maximum UX]
    U[Unpredictable] --> RT[Runtime] --> MC[Minimal cost] --> PUX[Preserved UX]
`}
/>

---

## Red Lines

Some compromises are **out of the question**:

<InvisibleList>
❌ Bloated bundles for developer comfort  
❌ Too many abstractions / overloads weighing on runtime  
❌ Sacrificing client-side performance for a "prettier" API
</InvisibleList>

:::warning[Server-Side (Node.js)]
Performance matters even more server-side. Utilities like Arkhe and Kanon can be called thousands of times per request. Slow functions accumulate and block the event loop, impacting all users. That's why we obsess over benchmarks.
:::

---

## In Summary

The entire Pithos philosophy boils down to a single priority chain. This hierarchy guides every technical decision, from API design to runtime optimizations:

```text
UX > DX > Code elegance
```

> User first. Developer second. Pragmatism always.

---

## Decision Guide

When a technical choice arises, ask these questions in order:

1. **Does it degrade user experience?**
   → If yes: refuse, find another solution

2. **Does it significantly improve DX?**
   → If yes: evaluate the real cost (bundle, runtime)

3. **Is the cost negligible or well optimized by V8?**
   → If yes: accept the compromise
   → If no: prioritize performance

---

## What Pithos is NOT

To avoid misunderstandings, let's be crystal clear about what Pithos **doesn't try to be**:

| !Pithos is NOT...                      | Because...                                                                   |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| **A lodash clone**                     | We learn from lodash, but we're not bound by its legacy constraints          |
| **A "safe" library that never throws** | Explicit errors > silent failures. Masking problems leads to bigger problems |
| **A library for every use case**       | Quality over quantity. Every addition must earn its place                    |
| **A defensive library**                | We trust TypeScript at compile-time, not runtime type checks                 |

### On Edge Cases

Pithos follows a **pragmatic approach** inspired by the 80/20 rule:

<InvisibleList>
❌ We don't handle every bizarre edge case that rarely occurs in practice  
❌ We don't add runtime type checks (`typeof`, `instanceof`): TypeScript already guarantees types  
✅ We validate **values** (e.g., `size > 0`) but not **types** at runtime  
✅ When an error doesn't make sense to handle, we **throw** instead of silently masking it  
</InvisibleList>

```typescript
// ❌ Lodash style: silent, defensive
_.get(null, "a.b.c"); // → undefined (was that intentional? 🤷)

// ✅ Pithos style: explicit, predictable
get(null, "a.b.c"); // → throws (you passed null, fix your code 🔧)
```

### On Compatibility

Pithos deliberately steps away from legacy constraints:

- No polyfills for outdated browsers
- No compatibility layers for ancient APIs
- No bloat to support edge cases from a decade ago

The goal is the best balance between modern web practices and performance, not perfect interchangeability with lodash.

:::note[Right tool for the job]
If you need 100% lodash compatibility, [ES Toolkit](https://es-toolkit.dev/) offers that.

Pithos deliberately breaks from lodash conventions when modern JavaScript offers better patterns. No legacy baggage, no compatibility chains; just [**maximum performance**](/comparisons/arkhe/performances/), [**minimal bundles**](/comparisons/arkhe/bundle-size/), and the best solution for today's web.
:::

---

### The Bottom Line

> _"Pithos would rather crash loudly on bad input than silently produce garbage output."_

This philosophy means:

- **Bugs surface faster**: no silent corruption propagating through your app
- **Debugging is easier**: clear error messages pointing to the source
- **Performance is better**: no unnecessary defensive checks on hot paths
- **Bundles are smaller**: less code = less bytes

---

This page covered the **why** behind Pithos. For detailed implementation guidelines (error handling, API conventions, TypeScript patterns), continue to [Design Philosophy](../contribution/design-principles/design-philosophy.md).
