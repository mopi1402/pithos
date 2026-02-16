---
sidebar_position: 10
title: Comparison with Alternatives
description: "How Pithos compares to Lodash, es-toolkit, Remeda, Radash, Ramda, and other TypeScript utility libraries across key design dimensions."
keyword_stuffing_ignore:
  - first
  - default
---

import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

# Comparison with Alternatives

| !Aspect           | !**Pithos**    | Lodash      | es-toolkit | Remeda  | Radash  | Ramda   | moderndash | @antfu/utils | Effect  |
| ----------------- | -------------- | ----------- | ---------- | ------- | ------- | ------- | ---------- | ------------ | ------- |
| **TypeScript**    | **First**      | Added after | First      | First   | First   | Added   | First      | First        | First   |
| **Immutability**  | **Default**    | Mixed       | Default    | Default | Default | Default | Default    | Default      | Default |
| **Invalid input** | **Throw**      | Silent      | Throw      | Throw   | Mixed   | Silent  | Mixed      | Mixed        | Effect  |
| **Data paradigm** | **First**      | First       | First      | Dual    | First   | Last    | First      | First        | Pipe    |
| **Tree-shakable**| **Yes**        | lodash-es   | Yes        | Yes     | Yes     | Yes     | Yes        | Yes          | Yes     |
| **Dependencies**  | **0**          | 0           | 0          | 0       | 0       | 0       | 0          | 0            | 0       |
| **Result monad**  | **✅ (Zygos)** | ❌          | ❌         | ❌      | ❌      | ❌      | ❌         | ❌           | ✅      |
| **Validation**    | **✅ (Kanon)** | ❌          | ❌         | ❌      | ❌      | ❌      | ❌         | ❌           | ✅      |
| **FP-oriented**   | **Pragmatic**  | No          | No         | Yes     | No      | Yes     | No         | No           | Yes     |

> **Invalid input behavior:**
> - **Throw** = Fails fast with an exception on invalid input
> - **Silent** = Returns `undefined`/`null` silently (can hide bugs)
> - **Mixed** = Depends on the function
> - **Effect** = Returns an error type (no exceptions)

## What Differentiates Pithos

1. **Complete ecosystem**: Utilities + Validation + Error handling
2. **Integrated Result pattern**: Zygos for functional error handling
3. **Consistency**: Unified API across all modules
4. **Greek mythology**: Memorable naming and storytelling

---

## Checklist for New Functions

Before adding a function to Arkhe/Pithos:

- [ ] **Real need**: Is it really useful? Not already native in ES2020+?
- [ ] **TypeScript-first**: Inferred types, no `any`
- [ ] **Immutable**: Doesn't modify arguments
- [ ] **Input validation**: Throw on invalid input
- [ ] **Complete TSDoc**: Description, params, returns, throws, examples
- [ ] **100% tests**: Complete coverage, edge cases included
- [ ] **Benchmark**: No performance regression
- [ ] **Tree-shakable**: Granular export

---

## Possible Future Evolutions

| Feature             | Status   | Notes                          |
| ------------------- | -------- | ------------------------------ |
| Lazy evaluation     | To study | For chained operations         |
| Web APIs extensions | Planned  | Fetch, Storage, etc.           |
| Async iterators     | Planned  | Generators and AsyncGenerators |

---

<RelatedLinks>

- [Arkhe vs Lodash — Bundle Size](/comparisons/arkhe/bundle-size) — Real numbers on bundle impact
- [Kanon vs Zod — Interoperability](/comparisons/kanon/interoperability/) — Feature-by-feature comparison
- [Zygos vs Neverthrow — Interoperability](/comparisons/zygos/interoperability/) — Drop-in replacement details

</RelatedLinks>
