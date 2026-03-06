---
sidebar_position: 3
sidebar_label: "Zygos"
title: "Zygos - Result Type for TypeScript | Neverthrow Alternative"
description: "Type-safe error handling with Result and Either types. Zero dependencies, fully composable. A modern Neverthrow alternative for TypeScript."
keywords:
  - result type typescript
  - neverthrow alternative
  - error handling typescript
  - either type
  - type-safe errors
image: /img/social/zygos-card.jpg
---

import ModuleName from '@site/src/components/shared/badges/ModuleName';
import { ModuleSchema } from '@site/src/components/seo/ModuleSchema';
import { RelatedLinks } from '@site/src/components/shared/RelatedLinks';
import { ZygosSizeHighlight } from '@site/src/components/comparisons/zygos/BundleSizeTable';
import { InstallTabs } from "@site/src/components/shared/InstallTabs";
import { TableConfig } from '@site/src/components/shared/Table/TableConfigContext';

<ModuleSchema
  name="Zygos"
  description="Type-safe error handling with Result and Either types for TypeScript. Zero dependencies, fully composable. A modern Neverthrow and fp-ts alternative."
  url="https://pithos.dev/guide/modules/zygos"
/>

# 🆉 <ModuleName name="Zygos" />  

_ζυγός - "balance"_

Functional error handling. Lightweight alternatives to Neverthrow and fp-ts (Either, Task, TaskEither).

Zygos brings functional error handling patterns to [TypeScript](https://www.typescriptlang.org/) without the weight of a full FP library. Instead of [try/catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) blocks that lose type information, Zygos uses [`Result`](/api/zygos/result/), [`Option`](/api/zygos/option/), and [`Either`](/api/zygos/either/) types to make errors explicit in your function signatures. Every failure path is visible to the compiler, so you handle errors before they reach production.

---

## Quick Example

The `Result` type represents an operation that can succeed ([`Ok`](/api/zygos/result/ok)) or fail ([`Err`](/api/zygos/result/err)). Pattern matching on the result forces you to handle both cases, eliminating unhandled exceptions:

```typescript links="ok:/api/zygos/result/ok,err:/api/zygos/result/err"
import { ok, err, Result } from "pithos/zygos/result/result";

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return err("Division by zero");
  return ok(a / b);
}

const result = divide(10, 2);

if (result.isOk()) {
  console.log(result.value); // 5
} else {
  console.log(result.error); // Never reached
}
```

---

## Available Monads

| Monad | Description | Use Case |
|-------|-------------|----------|
| [**Result**](#result) | `Ok<T>` or `Err<E>` | Operations that can fail |
| [**Option**](#option) | `Some<A>` or `None` | Optional values (no null) |
| [**Either**](#either-task-taskeither) | `Left<E>` or `Right<A>` | Generic two-case branching |
| [**Task**](#either-task-taskeither) | Lazy async computation | Deferred async operations |
| [**TaskEither**](#either-task-taskeither) | Async Either | Async operations that can fail |

--- 

## Result

Zygos Result is <ZygosSizeHighlight type="full" /> than Neverthrow, while maintaining **[100% API compatibility](/comparisons/zygos/interoperability/)**. You get the same developer experience with a fraction of the bundle cost.

### Drop-in Replacement for Neverthrow

**Migrate from Neverthrow with a single line change:**

```typescript
// Before (Neverthrow)
import { ok, err, Result, ResultAsync } from "neverthrow";

// After (Zygos): only change the import, code stays IDENTICAL
import { ok, err, Result } from "pithos/zygos/result/result";
import { ResultAsync } from "pithos/zygos/result/result-async";

// Your existing code works unchanged
```

:::tip Migration
Search & replace `from "neverthrow"` → split into the two imports above. All methods work the same.
:::

### Usage

Results support chaining with [`map`](/api/zygos/result/), [`mapErr`](/api/zygos/result/), and [`andThen`](/api/zygos/result/). Each operation transforms the success value while propagating errors automatically, similar to how Promises chain with `.then()`:

```typescript links="ok:/api/zygos/result/ok,err:/api/zygos/result/err,ResultAsync:/api/zygos/result/ResultAsync"
import { ok, err, Result } from "pithos/zygos/result/result";
import { ResultAsync } from "pithos/zygos/result/result-async";

// Sync
const success = ok(42);
const failure = err("Something went wrong");

// Chaining transforms the Ok value through each step.
// If any step returns an Err, the chain short-circuits.
ok(5)
  .map(x => x * 2)           // Ok(10)
  .mapErr(e => `Error: ${e}`) // Still Ok(10)
  .andThen(x => ok(x + 1));   // Ok(11)

// ResultAsync wraps Promises in the same Result pattern,
// so async operations get typed error handling too.
const asyncResult = ResultAsync.fromPromise(
  fetch("/api/data"),
  () => "Network error"
);
```

--- 

## Option

Handle optional values without null/undefined. The `Option` type makes the absence of a value explicit in the type system, replacing nullable types with [`Some`](/api/zygos/option/some) (value present) or [`None`](/api/zygos/option/none) (value absent):

```typescript links="some:/api/zygos/option/some,none:/api/zygos/option/none,fromNullable:/api/zygos/option/fromNullable,map:/api/zygos/option/map,flatMap:/api/zygos/option/flatMap,pipe:/api/arkhe/function/pipe"
import { some, none, fromNullable, Option, map, flatMap } from "pithos/zygos/option";
import { pipe } from "pithos/arkhe/function/pipe";

const value = some(42);
const empty = none;

// From nullable
const maybeNull: string | null = "hello";
const opt = fromNullable(maybeNull); // Some("hello")

// Pattern matching
const result = isSome(opt)
  ? opt.value
  : "default";

// Chaining with pipe
pipe(
  some(5),
  map(x => x * 2),        // Some(10)
  flatMap(x => some(x + 1)) // Some(11)
);
```

---

## Either, Task, TaskEither

Lightweight implementations based on fp-ts, **[100% API compatible](/comparisons/zygos/interoperability/)**. These monads cover more advanced functional programming patterns: [`Either`](/api/zygos/either/) for generic two-case branching, [`Task`](/api/zygos/task/) for lazy async computations, and [`TaskEither`](/api/zygos/task-either/TaskEither/) for async operations that can fail.

### Drop-in Replacement for fp-ts

**Migrating from fp-ts is just as simple: swap the imports and you're done.**

```typescript
// Before (fp-ts)
import * as E from "fp-ts/Either";
import * as T from "fp-ts/Task";
import * as TE from "fp-ts/TaskEither";

// After (Zygos): only change the import, code stays IDENTICAL
import * as E from "pithos/zygos/either";
import * as T from "pithos/zygos/task";
import * as TE from "pithos/zygos/task-either";

// Your existing code works unchanged
const result = pipe(
  E.right(5),
  E.map(x => x * 2),
  E.flatMap(x => E.right(x + 1))
);
```

:::tip Migration
Search & replace `from "fp-ts/Either"` → `from "pithos/zygos/either"`, etc. All functions work the same.
:::

### Available functions

<TableConfig noEllipsis>

| Module | Functions |
|--------|-----------|
| **Either** | `left`, `right`, `isLeft`, `isRight`, `map`, `mapLeft`, `flatMap`, `fold`, `match`, `getOrElse`, `orElse`, `fromOption`, `fromNullable`, `tryCatch`, `Do`, `bind`, `bindTo`, `apS`... |
| **Task** | `of`, `map`, `flatMap`, `ap` |
| **TaskEither** | `left`, `right`, `tryCatch`, `fromEither`, `fromTask`, `fromOption`, `map`, `mapLeft`, `flatMap`, `chain`, `fold`, `match`, `getOrElse`, `orElse`, `swap`... |

</TableConfig>

---

## safe() - From try/catch to Result in one line

Wrap any function that might throw into a Result-returning function. This is especially useful for third-party APIs or built-in functions like `JSON.parse` that communicate errors through exceptions:

```typescript links="safe:/api/zygos/safe"
import { safe } from "pithos/zygos/safe";

const safeJsonParse = safe(JSON.parse);

const result = safeJsonParse('{"valid": true}');
// Ok({ valid: true })

const invalid = safeJsonParse('not json');
// Err(SyntaxError: ...)
```

---

## ✅ When to Use

Zygos shines in codebases where error handling needs to be explicit and composable:

- **API calls** → `ResultAsync` for typed error handling
- **Validation chains** → `Result` with `andThen`
- **Optional data** → `Option` instead of `null | undefined`
- **Wrapping unsafe code** → `safe()` for try/catch elimination

:::info Kanon + Zygos
[`ensure()`](/api/bridges/ensure/) validates data against a Kanon schema and returns a `Result<T, string>` directly — ready to chain with `map`, `andThen`, etc. [`ensureAsync()`](/api/bridges/ensureAsync/) does the same for async pipelines with `ResultAsync`, and [`ensurePromise()`](/api/bridges/ensurePromise/) combines a Promise and validation in one step. See [Module Alchemy](/guide/module-alchemy/) for more combinations.
:::

---

## ❌ When NOT to Use

For tasks outside error handling and control flow, other Pithos modules are more appropriate:

| Need | Use Instead |
|------|-------------|
| Schema validation | [Kanon](./kanon.md) |
| Data transformation | [Arkhe](./arkhe.md) |
| Typed error factories | [Sphalma](./sphalma.md) |

---

## Migrating from Neverthrow or fp-ts

### From Neverthrow

#### Step 1: Install

Add Pithos to your project. It includes Zygos and all other modules:

<InstallTabs />

#### Step 2: Update imports

```typescript links="ok:/api/zygos/result/ok,err:/api/zygos/result/err,safeTry:/api/zygos/result/safeTry,ResultAsync:/api/zygos/result/ResultAsync"
// Before
import { ok, err, Result, ResultAsync, safeTry } from "neverthrow";

// After
import { ok, err, Result, safeTry } from "pithos/zygos/result/result";
import { ResultAsync } from "pithos/zygos/result/result-async";
```

#### Step 3: Run your tests

All your existing code works as-is. The API is 100% compatible.

#### Step 4 (optional): Use additional features

Once migrated, you can take advantage of Zygos-specific features:

```typescript links="fromOption:/api/zygos/result/fromOption,fromEither:/api/zygos/result/fromEither,toEither:/api/zygos/result/toEither,safeAsyncTry:/api/zygos/result/safeAsyncTry"
// fp-ts bridges
import { fromOption, fromEither, toEither } from "pithos/zygos/result/result";

// Simplified async try
import { safeAsyncTry } from "pithos/zygos/result/result";

// Collect all errors
const allErrors = ResultAsync.combineWithAllErrors(results);
```

### From fp-ts

#### Step 1: Install

Add Pithos to your project. It includes Zygos and all other modules:

<InstallTabs />

#### Step 2: Update imports

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

#### Step 3: Run your tests

All functions work the same. `pipe`, `map`, `flatMap`, `fold`, etc. are all compatible.

For the complete list of supported Neverthrow and fp-ts methods, see the [Zygos interoperability matrix](/comparisons/zygos/interoperability/) which documents every function across Result, ResultAsync, Either, Task, and TaskEither.

Zygos works naturally with [Sphalma typed error factories](./sphalma.md): define structured error codes with Sphalma, then return them as typed `Err` values in your Result chains.

---

<RelatedLinks title="Related Resources">

- [When to use Zygos](/comparisons/overview/) — Compare Zygos with alternatives and find when it's the right choice
- [Zygos bundle size & performance](/comparisons/zygos/bundle-size/) — Detailed bundle size comparison with Neverthrow and fp-ts
- [Zygos API Reference](/api/zygos) — Complete API documentation for Result, Either, Option, and more

</RelatedLinks>
