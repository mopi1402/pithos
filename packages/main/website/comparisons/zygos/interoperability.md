---
sidebar_label: "Interoperability"
sidebar_position: 3
title: "Zygos Interoperability — Neverthrow & fp-ts"
description: "Zygos is 100% compatible with both Neverthrow (Result, ResultAsync) and fp-ts (Either, Task, TaskEither). Drop-in replacement, zero code changes."
---

import { Accordion } from '@site/src/components/shared/Accordion';
import { Code } from '@site/src/components/shared/Code';
import { DashedSeparator } from '@site/src/components/shared/DashedSeparator';
import { TableConfig } from '@site/src/components/shared/Table/TableConfigContext';
import { MigrationCTA } from '@site/src/components/comparisons/MigrationCTA';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { ZygosSizeHighlight } from '@site/src/components/comparisons/zygos/BundleSizeTable';


# ⛓️‍💥 Zygos Interoperability

Zygos replaces two libraries with a single, lighter package. Both <a href="https://github.com/supermacro/neverthrow" rel="nofollow">Neverthrow</a> and <a href="https://github.com/gcanti/fp-ts" rel="nofollow">fp-ts</a> users can switch by changing imports — no code changes required.

## TL;DR

| Library | Zygos replacement | Compatibility | Migration |
|---------|-------------------|---------------|-----------|
| **Neverthrow** | Result, ResultAsync | 100% API compatible | Import change only |
| **fp-ts** | Either, Task, TaskEither | 100% API compatible | Import change only |

:::tip[Bottom line]
Swap your imports. Your code works as-is. Zygos is <ZygosSizeHighlight type="full" /> than Neverthrow, with zero `any` types.
:::

---

## Neverthrow — Result & ResultAsync

Zygos Result is a micro implementation of Neverthrow's Result type: **<ZygosSizeHighlight type="full" />**, 100% API compatible, zero `any` types.

```typescript
// Before
import { ok, err, Result, ResultAsync } from "neverthrow";

// After
import { ok, err, Result } from "pithos/zygos/result/result";
import { ResultAsync } from "pithos/zygos/result/result-async";
```

### Full API Compatibility

Click to expand each category:

<Accordion title="Result Constructors (100%)" badge="2/2">

<Code>ok(value)</Code>, <Code>err(error)</Code>

```typescript
import { ok, err, Result } from "pithos/zygos/result/result";

const success: Result<number, string> = ok(42);
const failure: Result<number, string> = err("Something went wrong");
```

</Accordion>

<Accordion title="Result Methods (100%)" badge="7/7">

<Code>.isOk()</Code>, <Code>.isErr()</Code>, <Code>.map()</Code>, <Code>.mapErr()</Code>, <Code>.andThen()</Code>, <Code>.unwrapOr()</Code>, <Code>.match()</Code>

```typescript
const result = ok(5)
  .map(x => x * 2)
  .mapErr(e => `Error: ${e}`)
  .andThen(x => x > 0 ? ok(x) : err("negative"));

const value = result.unwrapOr(0);

const message = result.match(
  value => `Success: ${value}`,
  error => `Error: ${error}`
);
```

</Accordion>

<Accordion title="Result Static Methods (100%)" badge="2/2">

Create Results from throwable functions and combine multiple Results into one. <Code>Result.fromThrowable()</Code>, <Code>Result.combine()</Code>

```typescript
const safeParse = Result.fromThrowable(
  JSON.parse,
  (error) => `Parse error: ${error}`
);

const result = safeParse('{"valid": "json"}'); // Ok({valid: "json"})
const error = safeParse('invalid'); // Err("Parse error: ...")

const combined = Result.combine([ok(1), ok(2), ok(3)]); // Ok([1, 2, 3])
```

</Accordion>

<Accordion title="ResultAsync Constructors (100%)" badge="2/2">

<Code>okAsync()</Code>, <Code>errAsync()</Code>

```typescript
import { okAsync, errAsync, ResultAsync } from "pithos/zygos/result/result-async";

const asyncSuccess = okAsync(Promise.resolve(42));
const asyncError = errAsync("network error");
```

</Accordion>

<Accordion title="ResultAsync Methods (100%)" badge="7/7">

<Code>.map()</Code>, <Code>.mapErr()</Code>, <Code>.andThen()</Code>, <Code>.unwrapOr()</Code>, <Code>.match()</Code>, <Code>.orElse()</Code>, <Code>.then()</Code>

```typescript
const result = await okAsync(Promise.resolve(5))
  .map(x => x * 2)
  .andThen(x => okAsync(Promise.resolve(x.toString())));

const message = await result.match(
  value => `Success: ${value}`,
  error => `Error: ${error}`
);

const withFallback = await errAsync("error")
  .orElse(() => okAsync("fallback"));
```

</Accordion>

<Accordion title="ResultAsync Static Methods (100%)" badge="4/4">

Build async Results from promises, safe promises, throwable functions, and combine them. <Code>ResultAsync.fromPromise()</Code>, <Code>ResultAsync.fromSafePromise()</Code>, <Code>ResultAsync.fromThrowable()</Code>, <Code>ResultAsync.combine()</Code>

```typescript
const result = ResultAsync.fromPromise(
  fetch('/api/data'),
  (error) => `Fetch failed: ${error}`
);

const safe = ResultAsync.fromSafePromise(Promise.resolve(42));

const safeFetch = ResultAsync.fromThrowable(
  async (url: string) => {
    const res = await fetch(url);
    return res.json();
  },
  (error) => `Request failed: ${error}`
);

const combined = ResultAsync.combine([
  okAsync(1),
  okAsync(2),
  okAsync(3)
]); // Ok([1, 2, 3])
```

</Accordion>

<Accordion title="safeTry (100%)" badge="1/1">

Use generator syntax to write Result chains that look like imperative code, with early returns on errors. <Code>safeTry()</Code>

```typescript
import { safeTry, ok, err } from "pithos/zygos/result/result";

const result = safeTry(function* () {
  yield err("validation failed");
  return ok(42);
});

const direct = safeTry(() => ok(42));
```

</Accordion>

---

## fp-ts — Either, Task, TaskEither

Lightweight reimplementations of fp-ts monads, **100% API compatible**. Same functions, same signatures, smaller bundle.

```typescript
// Before
import * as E from "fp-ts/Either";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";

// After
import * as E from "pithos/zygos/either";
import * as T from "pithos/zygos/task";
import * as TE from "pithos/zygos/task-either";
```

### Supported functions

<TableConfig noEllipsis>

| Module | Functions |
|--------|-----------|
| **Either** | `left`, `right`, `isLeft`, `isRight`, `map`, `mapLeft`, `flatMap`, `fold`, `match`, `getOrElse`, `orElse`, `fromOption`, `fromNullable`, `tryCatch`, `Do`, `bind`, `bindTo`, `apS` |
| **Task** | `of`, `map`, `flatMap`, `ap` |
| **TaskEither** | `left`, `right`, `tryCatch`, `fromEither`, `fromTask`, `fromOption`, `map`, `mapLeft`, `flatMap`, `chain`, `fold`, `match`, `getOrElse`, `orElse`, `swap` |

</TableConfig>

### Usage example

```typescript
import * as E from "pithos/zygos/either";
import * as TE from "pithos/zygos/task-either";
import { pipe } from "pithos/arkhe/function/pipe";

// Either — same as fp-ts
const result = pipe(
  E.right(5),
  E.map(x => x * 2),
  E.flatMap(x => E.right(x + 1))
);

// TaskEither — async operations that can fail
const fetchUser = pipe(
  TE.tryCatch(
    () => fetch("/api/user").then(r => r.json()),
    () => "Network error"
  ),
  TE.map(user => user.name)
);
```

---

## ✨ Zygos-only features

Beyond compatibility, Zygos adds features that neither Neverthrow nor fp-ts provide:

<TableConfig noEllipsis>

| Feature | Description |
|---------|-------------|
| 📦 **<ZygosSizeHighlight type="ratio" />** | <ZygosSizeHighlight type="sizes" /> |
| 🔒 **Zero `any` types** | Better type safety with `unknown` types |
| 🔄 **Result ↔ fp-ts bridges** | Convert between Result and Either/Option |
| ⚡️ **safeAsyncTry** | Simplified async error handling |
| 🎯 **combineWithAllErrors** | Collect all errors instead of stopping at first |

</TableConfig>

<DashedSeparator noMarginBottom />

### Result ↔ fp-ts bridges

Zygos provides built-in converters between Result and fp-ts types, so you can mix both ecosystems in the same codebase without manual wrapping:

```typescript
import { fromOption, fromEither, toEither, ok, err } from "pithos/zygos/result/result";

// Option → Result
const fromSome = fromOption(() => "No value")({ _tag: "Some", value: 42 }); // Ok(42)
const fromNone = fromOption(() => "No value")({ _tag: "None" });            // Err("No value")

// Either → Result
const fromRight = fromEither({ _tag: "Right", right: 42 });  // Ok(42)
const fromLeft = fromEither({ _tag: "Left", left: "error" }); // Err("error")

// Result → Either
const toRight = toEither(ok(42));       // { _tag: "Right", right: 42 }
const toLeft = toEither(err("error"));  // { _tag: "Left", left: "error" }
```

<DashedSeparator noMarginBottom />

### safeAsyncTry

Handle async operations that might throw without needing generators or verbose `fromPromise` wrappers. One function call, one Result:

```typescript
import { safeAsyncTry } from "pithos/zygos/result/result";

const result = await safeAsyncTry(() => fetch("/api/user").then(r => r.json()));

if (result.isOk()) {
  console.log(result.value);
} else {
  console.log(result.error);
}
```

<DashedSeparator noMarginBottom />

### combineWithAllErrors

When validating multiple operations, `Result.combine` stops at the first error. `combineWithAllErrors` collects every failure so you can report them all at once:

```typescript
import { ResultAsync, okAsync, errAsync } from "pithos/zygos/result/result-async";

const combined = ResultAsync.combineWithAllErrors([
  okAsync(1),
  errAsync("error1"),
  okAsync(3),
  errAsync("error2")
]);

const resolved = await combined;
// Err(["error1", "error2"]) — collects ALL errors
```

---

## Why choose Zygos?

| Aspect | Zygos | Neverthrow | fp-ts |
|--------|-------|------------|-------|
| **Bundle Size** | <ZygosSizeHighlight type="zygos-size" /> | <ZygosSizeHighlight type="nev-size" /> | ~50 kB+ |
| **Type Safety** | Zero `any` types | Uses `any` in places | ✅ |
| **Result + Either** | ✅ Both | Result only | Either only |
| **Bridges** | ✅ Result ↔ Either/Option | ❌ | ❌ |
| **Migration** | — | Import change only | Import change only |

:::tip[Recommendation]
Whether you're coming from Neverthrow or fp-ts, switching to Zygos is the same: change your imports, keep your code. You get a smaller bundle, better types, and both ecosystems in one package.
:::

<MigrationCTA module="Zygos" guideLink="/guide/modules/zygos/#migrating-from-neverthrow-or-fp-ts" guideDescription="install, swap imports, and start using additional features" />

---

<RelatedLinks>

- [Zygos vs Neverthrow](./zygos-vs-neverthrow.md) — Full comparison: philosophy, API, migration
- [Kanon ↔ Zod Interoperability](../kanon/interoperability.md) — Another migration compatibility story
- [Equivalence Table](/comparisons/equivalence-table/) — Full library equivalence across all modules
- [Zygos Module Guide](/guide/modules/zygos/) — Full module documentation

</RelatedLinks>
