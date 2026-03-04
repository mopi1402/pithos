---
sidebar_position: 2
title: Core Philosophy
description: "Discover the core philosophy behind Pithos: the guiding principles and architectural decisions that shape every module of this TypeScript utilities library."
slug: core-philosophy
---

import ResponsiveMermaid from "@site/src/components/shared/ResponsiveMermaid";
import InvisibleList from "@site/src/components/shared/InvisibleList";
import MarbleQuote from "@site/src/components/shared/MarbleQuote";
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { TableConfig } from '@site/src/components/shared/Table/TableConfigContext';

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

Maximizing user experience doesn't mean sacrificing the developer's. On the contrary, Pithos tries to deliver the best of both worlds:

- Intuitive and consistent API
- Clear documentation
- Explicit error messages
- Quality TypeScript typing

> _The best API is the one you understand at first glance._

<DashedSeparator noMarginBottom />

#### Crucial Distinction: Free DX vs Paid DX

| DX Type                                               | Runtime Cost | Decision              |
| ----------------------------------------------------- | ------------ | --------------------- |
| **Free DX**: types, naming, API design, documentation | 0            | ✅ Always welcome     |
| **Paid DX**: runtime abstractions, magic, wrappers    | > 0          | ⚠️ Opt-in only       |

### 3. Pragmatism - The Art of Smart Compromise

A certain level of pragmatism guides our choices:

| !Context                                       | Approach                                      |
| ---------------------------------------------- | --------------------------------------------- |
| **Impacts bundle or types**                     | Prioritize simplicity, no compromise          |
| **Where V8 optimizes well**                     | Smart compromise to improve DX                |
| **Negligible cost (runtime, bundle, types)**    | Improve DX without hesitation                 |

As a general rule, when a choice isn't too far from our philosophy, we prefer to let the developer decide. They get full control over the impact on performance or final bundle size.

**Concrete example: auto-curry**

```typescript
// "Magic" auto-curry (Remeda style)
map(array, fn); // Detects 2 args → data-first
map(fn); // Detects 1 arg → returns curried function
// ⚠️ Cost: runtime detection on every call, wrappers, extra logic

// Pithos approach: data-first by default
map(array, fn); // Standard, always data-first
// For composition, use pipe() with explicit data-first calls
pipe(array, arr => map(arr, fn));
// ✅ Cost: 0, no runtime detection, crystal clear
```

Auto-curry and its magic argument detection on every call are too far from Pithos's philosophy to be the default behavior. The CPU cost is negligible, but the wrappers bloat the bundle and complicate types.

Classic currying, however, remains a valuable tool for functional composition. That's why Pithos provides [`curry()`](/api/arkhe/function/curry/): an opt-in, zero-cost compromise. The curried function is created once, with no runtime detection.

:::note
Currying naturally implies a data-last style, unlike the [data-first convention](/guide/contribution/design-principles/data-first-paradigm/) used throughout Pithos. It's a conscious choice you make when you opt for functional composition.
:::

---

## TypeScript: The Best of Both Worlds

[TypeScript](https://www.typescriptlang.org/) is the ideal choice for Pithos because it perfectly embodies our [TypeScript-first philosophy](/guide/contribution/design-principles/typescript-first/):

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

## Our Standards

Some compromises are **non-negotiable**:

<InvisibleList>
❌ Excessively bloated bundles for developer comfort  
❌ Superfluous abstractions that weigh on runtime  
❌ Sacrificing client-side performance for a "prettier" API
</InvisibleList>

:::warning[Server-Side (Node.js)]
Performance matters even more server-side. Utilities like Arkhe and Kanon can be called thousands of times per request. Slow functions accumulate and block the [event loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick), penalizing all users. That's why we place great importance on performance, as our [benchmarks](/comparisons/arkhe/performances/) demonstrate.
:::

---

## In Summary

The entire Pithos philosophy boils down to a single priority chain. This hierarchy guides every technical decision, from API design to runtime optimizations:

```text
UX > DX > Code elegance
```

> User first. Developer second. Pragmatism always.

---

## What Pithos is NOT

To avoid misunderstandings, let's be crystal clear about what Pithos **doesn't try to be**:

<TableConfig noEllipsis wrapAll columns={{ "Pithos is NOT...": { width: "50%", minWidth: "200px", maxWidth: "100px" } }}>

| !Pithos is NOT...                      | Because...                                                                   |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| **A lodash clone**                     | We used Lodash from its early days, but now offer utilities more aligned with modern JavaScript's evolution |
| **A "safe" library that never throws** | Explicit errors > silent failures. Masking problems leads to bigger problems |
| **A library for every use case**       | Quality over quantity. Every addition must earn its place                    |
| **A defensive library**                | We trust TypeScript at compile-time, not runtime type checks                 |

</TableConfig>

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
If you need 100% lodash compatibility, <a href="https://es-toolkit.dev/" rel="nofollow">ES Toolkit</a> offers that.

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
