---
sidebar_label: "Zygos vs Neverthrow"
sidebar_position: 4
title: "Zygos vs Neverthrow: TypeScript Result Type Comparison"
description: "Compare Zygos and Neverthrow for TypeScript error handling. Bundle size, performance, 100% API compatibility, fp-ts bridges, and migration guide."
keywords:
  - zygos vs neverthrow
  - neverthrow alternative typescript
  - result type typescript comparison
  - neverthrow replacement
  - typescript error handling library
  - result pattern typescript
  - either type typescript
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { ArticleSchema } from '@site/src/components/seo/ArticleSchema';
import { MigrationCTA } from '@site/src/components/comparisons/MigrationCTA';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { ZygosSizeHighlight } from '@site/src/components/comparisons/zygos/BundleSizeTable';

<ArticleSchema
  headline="Zygos vs Neverthrow: TypeScript Result Type Comparison"
  description="Compare Zygos and Neverthrow for TypeScript error handling. Bundle size, performance, 100% API compatibility, fp-ts bridges, and migration guide."
  datePublished="2026-02-16"
/>

# Zygos vs Neverthrow: Which Result Type for TypeScript?

[Neverthrow](https://www.npmjs.com/package/neverthrow) popularized the Result pattern in TypeScript: a way to make errors explicit in function signatures instead of relying on [try/catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch). It's well-designed and widely adopted.

<ModuleName name="Zygos" /> is a micro-implementation of the same pattern: **100% API compatible** with Neverthrow, but <ZygosSizeHighlight type="ratio" />. It also provides Option, Either, Task, and TaskEither monads for projects that need more than just Result. This page compares both libraries across the dimensions that matter in production.

---

## At a Glance

| Aspect | Zygos | Neverthrow |
|--------|-------|------------|
| **Result API** | 100% compatible | — |
| **ResultAsync API** | 100% compatible | — |
| **Bundle size** | <ZygosSizeHighlight type="zygos-size" /> (<ZygosSizeHighlight type="ratio" />) | <ZygosSizeHighlight type="nev-size" /> |
| **Type safety** | Zero `any` types | Uses `any` in some places |
| **Additional monads** | Option, Either, Task, TaskEither | Result only |
| **fp-ts bridges** | Yes (fromOption, fromEither, toEither) | No |
| **Dependencies** | Zero | Zero |
| **Migration effort** | Import change only | — |

---

## Bundle Size

Zygos Result is **<ZygosSizeHighlight type="full" />** than Neverthrow (gzipped). The difference comes from implementation approach: Zygos uses simple object literals (`{ _tag: "Ok", value }`) while Neverthrow uses class instantiation with more overhead.

For detailed per-module comparisons with auto-generated data, see the [Zygos bundle size comparison](./bundle-size.md).

```typescript
// Zygos: Result + ResultAsync
import { ok, err, Result } from "pithos/zygos/result/result";
import { ResultAsync } from "pithos/zygos/result/result-async";

// Neverthrow: importing any function pulls the full library
import { ok, err, Result, ResultAsync } from "neverthrow";
```

---

## Performance

Zygos is **2-4x faster** on object creation and chained operations. Simple property checks (`isOk`, `isErr`, `unwrapOr`) perform identically in both libraries.

For detailed benchmark results with auto-generated data, see the [Zygos performance benchmarks](./performances.md).

**Key findings**:
- Object creation (`ok()`, `err()`): Zygos is 2-3x faster (object literals vs class instantiation)
- Chained operations (`andThen`): Zygos is 2-4x faster
- Simple checks (`isOk`, `unwrapOr`): equivalent, both are property access

---

## 100% API Compatibility

Zygos is a drop-in replacement. Every Result and ResultAsync method works identically:

```typescript
// Just swap the import, zero code changes
import { ok, err, Result, safeTry } from "pithos/zygos/result/result";
import { ResultAsync, okAsync, errAsync } from "pithos/zygos/result/result-async";

// All Neverthrow patterns work as-is
const result = ok(5)
  .map(x => x * 2)
  .mapErr(e => `Error: ${e}`)
  .andThen(x => x > 0 ? ok(x) : err("negative"));

const asyncResult = ResultAsync.fromPromise(
  fetch("/api/data"),
  () => "Network error"
);

const combined = Result.combine([ok(1), ok(2), ok(3)]); // Ok([1, 2, 3])
```

For the complete compatibility matrix, see the [Zygos ↔ Neverthrow interoperability page](./interoperability.md).

---

## What Zygos Adds Beyond Neverthrow

### fp-ts Bridges

Convert between Result and fp-ts types without manual mapping:

```typescript
import { fromOption, fromEither, toEither } from "pithos/zygos/result/result";

// Option → Result
const fromSome = fromOption(() => "No value")(someOption); // Ok(42)

// Either → Result
const fromRight = fromEither(rightEither); // Ok(42)

// Result → Either
const either = toEither(ok(42)); // { _tag: "Right", right: 42 }
```

<DashedSeparator noMarginBottom />

### Additional Monads

Zygos provides Option, Either, Task, and TaskEither, lightweight implementations compatible with fp-ts:

```typescript
// Option: explicit absence (no null/undefined)
import { some, none, fromNullable } from "pithos/zygos/option";

// Either, Task, TaskEither: fp-ts compatible
import * as E from "pithos/zygos/either";
import * as T from "pithos/zygos/task";
import * as TE from "pithos/zygos/task-either";
```

<DashedSeparator noMarginBottom />

### Zero `any` Types

Neverthrow uses `any` in some internal types. Zygos uses `unknown` throughout, providing stricter type safety and catching more errors at compile time.

<DashedSeparator noMarginBottom />

### `safeAsyncTry`

Simplified async error handling without generators:

```typescript
import { safeAsyncTry } from "pithos/zygos/result/result";

const result = await safeAsyncTry(() => fetch("/api/users/123").then(r => r.json()));
```

---

## Migration Guide

<MigrationCTA module="Zygos" guideLink="/guide/modules/zygos/#migrating-from-neverthrow-or-fp-ts" guideDescription="install, swap imports, and start using additional features" />

---

<RelatedLinks title="Further Reading">

- [Zygos bundle size comparison](./bundle-size.md): auto-generated per-module size data
- [Zygos performance benchmarks](./performances.md): auto-generated benchmark results
- [Zygos ↔ Neverthrow interoperability](./interoperability.md): full API compatibility matrix
- [Zygos module documentation](/guide/modules/zygos/): API overview and usage guide
- [Zygos API reference](/api/zygos/): complete function reference

</RelatedLinks>
