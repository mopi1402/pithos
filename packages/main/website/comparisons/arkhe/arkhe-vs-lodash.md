---
sidebar_label: "Arkhe vs Lodash"
sidebar_position: 4
title: "Arkhe vs Lodash: A Comprehensive Comparison for TypeScript Projects"
description: "Compare Arkhe and Lodash for TypeScript projects. Bundle size, performance benchmarks, tree-shaking, type safety, and step-by-step migration guide."
keywords:
  - arkhe vs lodash
  - lodash alternative typescript
  - lodash replacement
  - tree-shakable lodash
  - typescript utility library comparison
  - lodash bundle size
  - zero dependency utilities
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { ArticleSchema } from '@site/src/components/seo/ArticleSchema';
import { MigrationCTA } from '@site/src/components/comparisons/MigrationCTA';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';

<ArticleSchema
  headline="Arkhe vs Lodash: A Comprehensive Comparison for TypeScript Projects"
  description="Compare Arkhe and Lodash for TypeScript projects. Bundle size, performance benchmarks, tree-shaking, type safety, and step-by-step migration guide."
  datePublished="2026-02-16"
/>

# Arkhe vs Lodash: Which Utility Library for TypeScript?

Lodash has been the go-to JavaScript utility library for over a decade. It covers nearly every data manipulation need, from deep cloning to complex collection operations. But that breadth comes at a cost: large bundles, weak TypeScript inference, and legacy compatibility layers that modern projects don't need.

<ModuleName name="Arkhe" /> is a modern alternative built from scratch in [TypeScript](https://www.typescriptlang.org/). It targets ES2020+, ships as [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) with granular entry points, and carries zero dependencies. This page compares both libraries across the dimensions that matter for production TypeScript projects.

---

## At a Glance

| Aspect | Arkhe | Lodash (lodash-es) |
|--------|-------|---------------------|
| **Language** | TypeScript-first | JavaScript with @types/lodash |
| **Target** | ES2020+ | ES5 compatible |
| **Dependencies** | Zero | Zero (but internal polyfills) |
| **Tree-shaking** | Per-function entry points | Partial (lodash-es) |
| **Type inference** | Strict, narrow types | Broad, often `any` |
| **Bundle per function** | ~100-300 bytes gzipped | ~1-15 KB gzipped |
| **API coverage** | Curated subset | 300+ functions |

---

## Bundle Size

This is where the difference is most visible. Lodash carries internal utilities and ES5 compatibility layers in every function. Arkhe ships standalone pure functions with no shared runtime.

For detailed per-function comparisons with real auto-generated data, see the [Arkhe bundle size comparison](./bundle-size.md).

**Key takeaway**: Arkhe functions are typically **10-50x smaller** than their Lodash equivalents. Even compared to es-toolkit, Arkhe is generally 10-30% smaller on individual functions.

```typescript
// Arkhe: only chunk ends up in your bundle (~150 bytes gzipped)
import { chunk } from "pithos/arkhe/array/chunk";

// Lodash-es: chunk + internal dependencies (~3 KB gzipped)
import { chunk } from "lodash-es";
```

---

## Performance

Both libraries are fast enough for most applications. The differences show up in tight loops and large datasets.

For detailed benchmark results with auto-generated data, see the [Arkhe performance benchmarks](./performances.md).

**Key findings**:
- Arkhe and Lodash trade wins depending on the function and input size
- Arkhe prioritizes **correctness over raw speed**: some functions do extra work (deduplication, input validation) that Lodash skips
- On weighted real-world scoring, Arkhe is competitive across the board

<DashedSeparator noMarginBottom />

### Correctness Trade-offs

When Arkhe is slower, it's usually because it does more work to return correct results:

| Function | What Arkhe does extra | Why it matters |
|---|---|---|
| `intersectionWith` | Deduplicates the result | A set intersection should not contain duplicates |

A faster function that returns wrong results is not faster - it's incomplete.

---

## Type Safety

Lodash was written in JavaScript. TypeScript support comes from `@types/lodash`, maintained separately. This creates gaps:

```typescript
const obj = { a: { b: { c: 42 } } };

// Lodash: type inference is broad
import { get } from "lodash-es";
const value = get(obj, "a.b.c"); // any

// Arkhe: type inference is precise
import { get } from "pithos/arkhe/object/get";
const value = get(obj, ["a", "b", "c"]); // correctly typed
```

Arkhe functions use TypeScript generics and conditional types to infer return types as narrowly as possible. No `any` leaks, no manual type assertions needed.

---

## Tree-Shaking

Lodash's original CommonJS build (`lodash`) doesn't tree-shake at all. `lodash-es` improves this, but functions still share internal utilities that bundlers can't always eliminate.

Arkhe uses **per-function entry points**. Each import resolves to a standalone module with no shared runtime:

```typescript
// Each import is fully independent
import { chunk } from "pithos/arkhe/array/chunk";
import { groupBy } from "pithos/arkhe/array/groupBy";
import { get } from "pithos/arkhe/object/get";
```

This means your bundle contains exactly the code you use, nothing more.

---

## Migration Guide

<MigrationCTA module="Arkhe" guideLink="/guide/modules/arkhe/#migrating-from-lodash" guideDescription="install, replace imports incrementally, and check the equivalence table" />

---

<RelatedLinks title="Further Reading">

- [Arkhe bundle size comparison](./bundle-size.md): auto-generated per-function size data
- [Arkhe performance benchmarks](./performances.md): auto-generated benchmark results
- [Full equivalence table](/comparisons/equivalence-table/): Lodash → Arkhe function mapping
- [Arkhe module documentation](/guide/modules/arkhe/): API overview and usage guide
- [Arkhe API reference](/api/arkhe/): complete function reference

</RelatedLinks>
