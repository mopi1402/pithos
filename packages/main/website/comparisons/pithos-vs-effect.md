---
sidebar_label: "Pithos vs Effect"
sidebar_position: 5
title: "Pithos vs Effect: Modular Toolbox vs Full FP Runtime"
description: "Compare Pithos and Effect for TypeScript projects. When to pick a lightweight modular toolbox vs a full-featured functional effect system."
keywords:
  - pithos vs effect
  - effect-ts alternative
  - typescript utility library
  - effect system typescript
  - lightweight typescript library
  - functional programming typescript
---

import { ArticleSchema } from '@site/src/components/seo/ArticleSchema';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import KanonVsEffectTable from '@site/src/components/comparisons/kanon/KanonVsEffectTable';

<ArticleSchema
  headline="Pithos vs Effect: Modular Toolbox vs Full FP Runtime"
  description="Compare Pithos and Effect for TypeScript projects. When to pick a lightweight modular toolbox vs a full-featured functional effect system."
  datePublished="2026-03-13"
/>

# Pithos vs Effect: Different Tools for Different Problems

<a href="https://effect.website" rel="nofollow">Effect</a> is a comprehensive functional programming framework for TypeScript. It provides a full effect system with dependency injection, structured concurrency, streams, and more. Think of it as ZIO for TypeScript.

Pithos is a modular utility library. You pick the modules you need (utilities, validation, error handling) and ship only what you use. No runtime, no framework lock-in.

These are not competing libraries. They solve different problems at different scales.

---

## At a Glance

| Aspect | Pithos | Effect |
|--------|--------|--------|
| **Philosophy** | Modular toolbox, pick what you need | Full FP runtime and ecosystem |
| **Bundle impact** | Tree-shakable, per-function imports | Single package, ~120K+ lines of public API |
| **Learning curve** | Low, familiar APIs (Lodash-like, Zod-like, Neverthrow-like) | Steep, new paradigm (effects, layers, fibers) |
| **Error handling** | Result, Either, Option, CodedError | Effect\<A, E, R\>, Cause, Defects |
| **Validation** | Kanon (Zod-like, JIT-compiled) | Schema (bidirectional, AST-based) |
| **Concurrency** | Lightweight async helpers (retry, parallel, guard) | Fibers, streams, queues, semaphores, STM |
| **Dependency injection** | None (not in scope) | Context + Layer system |
| **Lodash replacement** | Yes (Arkhe + Taphos) | No |
| **Runtime required** | No | Yes |
| **Dependencies** | Zero | `@standard-schema/spec`, `fast-check` |

---

## Where They Overlap

Pithos and Effect share some foundational building blocks. The overlap is roughly **25%** of what Effect offers.

### Either & Option

Both provide discriminated union types for representing success/failure and presence/absence:

```typescript
// Pithos (Zygos)
import { right, left, isRight } from "@pithos/core/zygos/either";
import { some, none, isSome } from "@pithos/core/zygos/option";

const result = right(42);       // { _tag: "Right", right: 42 }
const maybe = fromNullable(x);  // Some(x) or None
```

```typescript
// Effect
import { Either, Option } from "effect";

const result = Either.right(42);       // Right with prototype chain
const maybe = Option.fromNullable(x);  // Some(x) or None
```

The core API is similar. Effect adds structural equality, hashing, `gen()` syntax, and the `Pipeable` interface on every type. Pithos keeps it simple with plain object literals.

<DashedSeparator noMarginBottom />

### pipe

Both implement typed `pipe` with overloads:

```typescript
// Pithos
import { pipe } from "@pithos/core/arkhe/function/pipe";
pipe(5, x => x * 2, x => x + 1); // 11

// Effect
import { pipe } from "effect";
pipe(5, x => x * 2, x => x + 1); // 11
```

Effect also provides `dual()` so every function works both data-first and data-last. Pithos functions are standalone.

:::info
Pithos uses data-first style: the data you're operating on is always the first argument. This is the most natural calling convention in JavaScript and doesn't require `pipe` to be readable.
:::

<DashedSeparator noMarginBottom />

### Array, String, Object Utilities

Both provide common utility functions. Pithos has more coverage here (closer to Lodash), while Effect covers the essentials.

| Category | Pithos | Effect |
|----------|--------|--------|
| Array (chunk, zip, groupBy, partition...) | ~45 functions (Arkhe) | ~40 functions |
| String (case conversion, template, truncate...) | ~20 functions (Arkhe) | ~5 functions |
| Object (pick, omit, mapValues, deepClone...) | ~18 functions (Arkhe) | ~10 functions (Record) |
| Predicates & guards | ~25 functions | ~15 functions |

<DashedSeparator noMarginBottom />

### Validation

Both provide schema validation with TypeScript inference:

```typescript
// Pithos (Kanon)
import { string, number, object } from "@pithos/core/kanon";
const User = object({ name: string(), age: number() });

// Effect (Schema)
import { Schema } from "effect";
const User = Schema.Struct({ name: Schema.String, age: Schema.Number });
```

Kanon is Zod-like in ergonomics with JIT compilation for performance. Effect Schema is more powerful: it supports bidirectional transformations, AST introspection, and arbitrary generation, but comes with more complexity and bundle weight.

<DashedSeparator noMarginBottom />

### Validation Performance

On real-world scenarios, Kanon V3.0 is consistently **2x to 6x faster** than Effect Schema. The gap widens on complex schemas with nested objects, arrays, and conditional validation.

<KanonVsEffectTable />

This is expected: Kanon compiles validators to optimized functions, while Effect Schema interprets an AST at runtime. Effect trades raw speed for bidirectional transforms, AST introspection, and arbitrary generation.

For full benchmark results with all libraries, see the [Kanon performance benchmarks](./kanon/performances.md).

---

## Where Effect Goes Further

These are areas where Effect provides capabilities that Pithos does not attempt to cover:

- **Effect\<A, E, R\>**: a type that encodes success, error, AND dependencies. The compiler tracks requirements through composition.
- **Layer & Context**: typed dependency injection. Build, compose, and provide services at the type level.
- **Fiber & structured concurrency**: lightweight threads with cancellation, supervision, and resource safety.
- **Stream & Channel**: reactive data processing with backpressure.
- **STM**: software transactional memory for concurrent state.
- **Schedule**: declarative retry and repeat policies.
- **Metrics, Tracing, Logging**: built-in observability primitives.
- **Platform packages**: Node, Bun, browser adapters with typed file system, HTTP, etc.
- **SQL, RPC, CLI, AI**: first-party integrations for common infrastructure.

This is not a gap in Pithos. It's a different scope entirely.

---

## Where Pithos Goes Further

- **Lodash replacement**: Arkhe + Taphos provide a complete migration path from Lodash with per-function tree-shaking. Effect doesn't play in this space.
- **Bundle size**: every Pithos function is independently importable. You pay only for what you use.
- **Neverthrow compatibility**: Zygos Result is a 100% API-compatible drop-in replacement for Neverthrow. Effect has no equivalent migration story.
- **JIT-compiled validation**: Kanon compiles validators at runtime for maximum throughput. Effect Schema interprets an AST.
- **Zero runtime**: Pithos is just functions. No runtime to bootstrap, no framework to learn.

---

## When to Choose What

### Choose Pithos when:
- You want to replace Lodash, Zod, or Neverthrow with smaller alternatives
- Bundle size is a priority
- You want familiar APIs with minimal learning curve
- You need utilities, validation, or error handling, not an effect system
- You're building a typical web app or library

### Choose Effect when:
- You're building complex backend services with many dependencies
- You need structured concurrency (fibers, cancellation, resource management)
- You want typed dependency injection at the framework level
- You're comfortable investing in a new paradigm
- You need the full ecosystem (SQL, RPC, OpenTelemetry, etc.)

### Use both when:
- You want Pithos utilities (Arkhe) alongside Effect for business logic
- You use Kanon for API input validation and Effect for service orchestration

They compose fine. Pithos has no runtime and no global state.

---

<RelatedLinks title="Further Reading">

- [Kanon performance benchmarks](./kanon/performances.md): full validation benchmark results with all libraries
- [Zygos vs Neverthrow](./zygos/zygos-vs-neverthrow.md): drop-in Result replacement comparison
- [Kanon vs Zod](./kanon/kanon-vs-zod.md): validation library comparison
- [Arkhe vs Lodash](./arkhe/arkhe-vs-lodash.md): utility library comparison
- [Comparison Overview](./overview.md): when to use each Pithos module
- [Equivalence Table](./equivalence-table.md): full library equivalence across all modules

</RelatedLinks>
